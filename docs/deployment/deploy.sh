#!/bin/bash

# 部署脚本示例
# 使用方法：bash deploy.sh

echo "🚀 开始部署..."

# 1. 构建生产版本
echo "📦 构建生产版本..."
npm run build

# 2. 检查构建是否成功
if [ ! -d "dist" ]; then
    echo "❌ 构建失败！"
    exit 1
fi

echo "✅ 构建成功！"

# 3. 上传到服务器（根据实际情况修改）
# echo "📤 上传文件到服务器..."
# rsync -avz --delete dist/ user@server:/var/www/my-react-demo/dist/

# 或者使用 scp
# scp -r dist/* user@server:/var/www/my-react-demo/dist/

# 4. 重启 Nginx（在服务器上执行）
# echo "🔄 重启 Nginx..."
# ssh user@server "sudo nginx -t && sudo nginx -s reload"

echo "✅ 部署完成！"

