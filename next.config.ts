/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // 静态输出
  images: {
    unoptimized: true // 静态导出时需要，否则图片优化会出错
  }
};

module.exports = nextConfig;