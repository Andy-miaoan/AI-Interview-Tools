// 📤 一键上传所有改动到 GitHub Pages
// 用法：node sync-to-github.js

const fs = require('fs');
const { execSync } = require('child_process');

const GH = '"C:/Program Files/GitHub CLI/gh"';
const REPO = 'repos/Andy-miaoan/AI-Interview-Tools/contents';

const files = [
  'index.html',
  '.gitignore',
  'logo.png',
  'AI面试辅导/工具_AI面试辅导工作台.html',
  'AI面试辅导/工具_激活码生成器.html',
  '企业AI面试官/工具_企业AI面试官工作台.html',
  '企业AI面试官/工具_激活码生成器.html',
  'AI总参谋/工具_AI总参谋工作台.html',
  '激活码与分销管理.html',
  'AI面试辅导/📌 发客户的链接.txt',
  '企业AI面试官/📌 发客户的链接.txt',
  'AI总参谋/📌 发客户的链接.txt',
];

console.log('=== GitHub 一键更新上传 ===\n');

for (const path of files) {
  if (!fs.existsSync(path)) {
    console.log(`跳过（不存在）: ${path}`);
    continue;
  }

  process.stdout.write(`上传: ${path} ... `);

  try {
    // 获取远程文件 SHA
    const remote = JSON.parse(
      execSync(`${GH} api "${REPO}/${path}?ref=main"`, { encoding: 'utf8', timeout: 15000 })
    );

    // 构建 payload
    const content = fs.readFileSync(path).toString('base64');
    const payload = {
      message: `Update ${path}`,
      content: content,
      branch: 'main',
      sha: remote.sha,
    };
    fs.writeFileSync('_payload.json', JSON.stringify(payload));

    // 上传
    execSync(`${GH} api "${REPO}/${path}" -X PUT --input _payload.json`, { timeout: 30000 });
    console.log('✅ 完成');
  } catch (e) {
    console.log('❌ 失败:', (e.stderr || e.message || '').substring(0, 100));
  }
}

fs.unlinkSync('_payload.json');
console.log(`\n=== 全部完成 ===`);
console.log(`站点: https://andy-miaoan.github.io/AI-Interview-Tools/`);
