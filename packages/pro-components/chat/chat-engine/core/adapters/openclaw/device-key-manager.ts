/**
 * OpenClaw 设备密钥管理器
 *
 * 负责生成/持久化 Ed25519 密钥对并签名 nonce，
 * 用于 OpenClaw Gateway 的设备身份认证（Device Pairing）。
 *
 * 认证流程：
 * 1. Gateway 发送 connect.challenge，包含 nonce
 * 2. 客户端用私钥签名 nonce
 * 3. 在 connect 请求的 params.device 中携带 { publicKey, signature, deviceId }
 * 4. Gateway 验签通过后完成认证（首次连接自动配对）
 *
 * 存储策略：
 * - 密钥对以 hex 格式持久化到 localStorage
 * - key: `openclaw_device_key_{clientId}`
 * - 密钥对在浏览器端生命周期内保持一致（设备标识不变）
 */
import { LoggerManager } from '../../utils/logger';

const logger = LoggerManager.getLogger();

/** 设备密钥对（hex 编码） */
export interface DeviceKeyPair {
  publicKey: string;
  privateKey: string;
  deviceId: string;
}

/** connect 请求中的 device 字段 */
export interface DeviceIdentity {
  /** 设备 ID（由公钥派生或随机生成） */
  id: string;
  /** 公钥（hex 编码） */
  publicKey: string;
  /** nonce 签名（hex 编码） */
  signature: string;
  /** 签名时间戳（Unix 秒级时间戳） */
  signedAt: number;
  /** 回传的 challenge nonce */
  nonce: string;
}

// ==================== 工具函数 ====================

/** 字节数组转 hex 字符串 */
function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** hex 字符串转字节数组 */
function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

/** 从公钥派生设备 ID（取公钥前 16 字符作为设备 ID） */
function deriveDeviceId(publicKeyHex: string): string {
  return `device_${publicKeyHex.substring(0, 16)}`;
}

/** 生成 localStorage key */
function getStorageKey(clientId: string): string {
  return `openclaw_device_key_${clientId}`;
}

// ==================== Web Crypto API 实现 ====================

/**
 * 检测浏览器是否支持 Ed25519
 *
 * Ed25519 在 Web Crypto API 中的支持情况：
 * - Chrome 113+ / Edge 113+
 * - Firefox（尚未支持）
 * - Safari 17+
 *
 * 对于不支持的浏览器，退回到 HMAC-SHA256 方案
 */
async function isEd25519Supported(): Promise<boolean> {
  try {
    const keyPair = await crypto.subtle.generateKey('Ed25519', true, ['sign', 'verify']);
    return !!keyPair;
  } catch {
    return false;
  }
}

/**
 * 使用 Web Crypto API 生成 Ed25519 密钥对
 */
async function generateEd25519KeyPair(): Promise<DeviceKeyPair> {
  const keyPair = await crypto.subtle.generateKey('Ed25519', true, ['sign', 'verify']);

  // 导出原始格式的公钥和私钥
  const publicKeyRaw = await crypto.subtle.exportKey('raw', keyPair.publicKey);
  const privateKeyPkcs8 = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);

  const publicKeyHex = bytesToHex(new Uint8Array(publicKeyRaw));
  const privateKeyHex = bytesToHex(new Uint8Array(privateKeyPkcs8));

  return {
    publicKey: publicKeyHex,
    privateKey: privateKeyHex,
    deviceId: deriveDeviceId(publicKeyHex),
  };
}

/**
 * 使用 Ed25519 私钥签名 nonce
 */
async function signWithEd25519(privateKeyHex: string, nonce: string): Promise<string> {
  const privateKeyBytes = hexToBytes(privateKeyHex);

  // 导入 PKCS8 格式的私钥
  const privateKey = await crypto.subtle.importKey(
    'pkcs8',
    privateKeyBytes.buffer,
    'Ed25519',
    false,
    ['sign'],
  );

  // 签名 nonce（UTF-8 编码）
  const encoder = new TextEncoder();
  const data = encoder.encode(nonce);
  const signature = await crypto.subtle.sign('Ed25519', privateKey, data);

  return bytesToHex(new Uint8Array(signature));
}

// ==================== HMAC-SHA256 降级方案 ====================

/**
 * 使用 HMAC-SHA256 作为降级签名方案
 *
 * 当浏览器不支持 Ed25519 时，使用随机密钥 + HMAC-SHA256 代替。
 * 密钥不用于非对称验签，但保证设备标识的一致性和签名的不可伪造性。
 */
async function generateHmacKeyPair(): Promise<DeviceKeyPair> {
  // 生成 32 字节随机密钥作为 "私钥"
  const privateKeyBytes = crypto.getRandomValues(new Uint8Array(32));
  const privateKeyHex = bytesToHex(privateKeyBytes);

  // 用私钥的 SHA-256 哈希作为 "公钥"（设备标识）
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(privateKeyHex));
  const publicKeyHex = bytesToHex(new Uint8Array(hashBuffer));

  return {
    publicKey: publicKeyHex,
    privateKey: privateKeyHex,
    deviceId: deriveDeviceId(publicKeyHex),
  };
}

/**
 * 使用 HMAC-SHA256 签名 nonce
 */
async function signWithHmac(privateKeyHex: string, nonce: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(privateKeyHex);

  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );

  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(nonce));
  return bytesToHex(new Uint8Array(signature));
}

// ==================== DeviceKeyManager ====================

/**
 * 设备密钥管理器
 *
 * 使用方式：
 * ```ts
 * const manager = new DeviceKeyManager('webchat');
 * await manager.initialize();
 *
 * // 收到 connect.challenge 时
 * const device = await manager.signChallenge(nonce);
 * // 将 device 放入 connect params
 * ```
 */
export class DeviceKeyManager {
  private keyPair: DeviceKeyPair | null = null;
  private clientId: string;
  private useEd25519 = false;
  private initialized = false;

  constructor(clientId: string = 'webchat') {
    this.clientId = clientId;
  }

  /**
   * 初始化密钥管理器
   *
   * - 尝试从 localStorage 恢复已有密钥对
   * - 如果没有，则生成新的密钥对并持久化
   * - 自动检测并选择 Ed25519 或 HMAC-SHA256
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    // 检测 Ed25519 支持
    this.useEd25519 = await isEd25519Supported();
    logger.debug(`Device auth: Ed25519 ${this.useEd25519 ? 'supported' : 'not supported, using HMAC-SHA256 fallback'}`);

    // 尝试从 localStorage 恢复
    const stored = this.loadFromStorage();
    if (stored) {
      this.keyPair = stored;
      logger.debug(`Device auth: restored key pair for device ${stored.deviceId}`);
    } else {
      // 生成新密钥对
      this.keyPair = this.useEd25519
        ? await generateEd25519KeyPair()
        : await generateHmacKeyPair();

      this.saveToStorage(this.keyPair);
      logger.info(`Device auth: generated new key pair, deviceId=${this.keyPair.deviceId}`);
    }

    this.initialized = true;
  }

  /**
   * 签名 challenge nonce，返回 device 字段
   *
   * 在收到 connect.challenge 事件后调用，
   * 返回值直接放入 connect 请求的 params.device 中。
   */
  async signChallenge(nonce: string): Promise<DeviceIdentity> {
    if (!this.keyPair) {
      await this.initialize();
    }

    const signedAt = Math.floor(Date.now() / 1000);
    // 签名内容包含 nonce + signedAt，确保签名的时效性
    const signPayload = `${nonce}:${signedAt}`;

    const signature = this.useEd25519
      ? await signWithEd25519(this.keyPair!.privateKey, signPayload)
      : await signWithHmac(this.keyPair!.privateKey, signPayload);

    return {
      id: this.keyPair!.deviceId,
      publicKey: this.keyPair!.publicKey,
      signature,
      signedAt,
      nonce,
    };
  }

  /**
   * 获取设备 ID
   */
  getDeviceId(): string | null {
    return this.keyPair?.deviceId ?? null;
  }

  /**
   * 重置密钥（强制重新生成密钥对）
   */
  async reset(): Promise<void> {
    this.clearStorage();
    this.keyPair = null;
    this.initialized = false;
    await this.initialize();
  }

  // ==================== 存储相关 ====================

  private loadFromStorage(): DeviceKeyPair | null {
    if (typeof window === 'undefined' || !window.localStorage) return null;

    try {
      const stored = window.localStorage.getItem(getStorageKey(this.clientId));
      if (!stored) return null;

      const parsed = JSON.parse(stored) as DeviceKeyPair;
      if (parsed.publicKey && parsed.privateKey && parsed.deviceId) {
        return parsed;
      }
    } catch (e) {
      logger.warn('Failed to load device key from storage:', e);
    }
    return null;
  }

  private saveToStorage(keyPair: DeviceKeyPair): void {
    if (typeof window === 'undefined' || !window.localStorage) return;

    try {
      window.localStorage.setItem(getStorageKey(this.clientId), JSON.stringify(keyPair));
    } catch (e) {
      logger.warn('Failed to save device key to storage:', e);
    }
  }

  private clearStorage(): void {
    if (typeof window === 'undefined' || !window.localStorage) return;

    try {
      window.localStorage.removeItem(getStorageKey(this.clientId));
    } catch {
      // ignore
    }
  }
}
