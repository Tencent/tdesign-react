#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const analysisDir = path.join(__dirname, '..', 'packages', 'tdesign-react-aigc', 'bundle-analysis');
const esDir = path.join(__dirname, '..', 'packages', 'tdesign-react-aigc', 'es');

console.log('🔍 TDesign React AIGC 包体积分析报告');
console.log('='.repeat(50));

// 检查构建产物
if (!fs.existsSync(esDir)) {
  console.log('❌ 未找到构建产物，请先运行: npm run build:aigc');
  process.exit(1);
}

// 检查分析报告
const analysisFiles = ['stats-es.html', 'stats-es-sunburst.html', 'stats-es-network.html'];
const existingFiles = analysisFiles.filter(file => fs.existsSync(path.join(analysisDir, file)));

if (existingFiles.length === 0) {
  console.log('❌ 未找到分析报告，请运行: ANALYZE=true npm run build:aigc');
  process.exit(1);
}

console.log('📊 可用的分析报告:');
existingFiles.forEach((file, index) => {
  const filePath = path.join(analysisDir, file);
  const size = (fs.statSync(filePath).size / 1024).toFixed(2);
  console.log(`${index + 1}. ${file} (${size} KB)`);
});

console.log('\n🚀 快速操作:');
console.log('open packages/tdesign-react-aigc/bundle-analysis/stats-es.html');
console.log('\n🔄 重新分析:');
console.log('ANALYZE=true npm run build:aigc && node script/analyze-aigc-bundle.js');