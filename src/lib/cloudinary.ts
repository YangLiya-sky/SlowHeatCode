import { v2 as cloudinary } from 'cloudinary';

// 配置Cloudinary - 支持两种配置方式
if (process.env.CLOUDINARY_URL) {
  // 使用CLOUDINARY_URL（推荐方式）
  cloudinary.config(process.env.CLOUDINARY_URL);
  console.log('Cloudinary configured with CLOUDINARY_URL');
} else {
  // 使用分离的环境变量
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  console.log('Cloudinary configured with separate env vars');
}

// 验证配置
const config = cloudinary.config();
console.log('Cloudinary config initialized:', {
  has_cloudinary_url: !!process.env.CLOUDINARY_URL,
  cloud_name: !!config.cloud_name,
  api_key: !!config.api_key,
  api_secret: !!config.api_secret,
  cloud_name_value: config.cloud_name?.substring(0, 5) + '...'
});

export default cloudinary;
