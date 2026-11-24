import React, { useEffect, useState } from 'react';
import { Image, Input } from 'tdesign-mobile-react';
import { BrowseOffIcon } from 'tdesign-icons-react';

export default function Special() {
  const [phoneNumber, setPhoneNumber] = useState('17600600600');
  const [tips, setTips] = useState('');

  useEffect(() => {
    function isPhoneNumber() {
      if (/^[1][3,4,5,7,8,9][0-9]{9}$/.test(phoneNumber)) {
        return '';
      }
      return 'error';
    }

    setTips(!isPhoneNumber() ? '手机号输入不正确' : '');
  }, [phoneNumber]);

  const handlePhoneNumberChange = (value) => {
    setPhoneNumber(value);
  };

  return (
    <>
      <Input
        label="输入密码"
        type="password"
        default-value="520 TDesign"
        clearable={false}
        suffixIcon={<BrowseOffIcon />}
      />
      <Input
        placeholder="输入验证码"
        label="验证码"
        suffix={
          <div className="input-suffix">
            <div className="input-suffix__line"></div>
            <Image
              className="input-suffix__image"
              src="https://wwcdn.weixin.qq.com/node/wework/images/202010241547.ac6876be9c.png"
              aria-role="img"
              aria-label="验证码"
            />
          </div>
        }
      />
      <Input
        label="手机号"
        placeholder="请输入手机号码"
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
        tips={tips}
        suffix={
          <div className="input-suffix">
            <div className="input-suffix__line"></div>
            <div className="input-suffix__verify">发送验证码</div>
          </div>
        }
      />
      <Input label="价格" align="right" placeholder="0.00" suffix="元" type="number" />
      <Input label="数量" align="right" placeholder="填写个数" suffix="个" type="number" />
    </>
  );
}
