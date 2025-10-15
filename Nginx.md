# Nginx 配置部署静态网站指南

本指南适用于在 **Ubuntu EC2 实例** 上使用 **Nginx** 部署 Next.js 静态导出网站。

---

## 1️⃣ 安装 Nginx

```bash
# 更新软件包列表
sudo apt update

# 安装 Nginx
sudo apt install nginx -y

# 检查 Nginx 是否运行
sudo systemctl status nginx
```

成功运行时应显示 `active (running)`

---

## 2️⃣ 创建网站目录

假设 GitHub Actions 已经将静态文件部署到 `/server/www/z.com`：

```bash
sudo mkdir -p /server/www/z.com
sudo chown -R ubuntu:ubuntu /server/www/z.com
sudo chmod -R 755 /server/www/z.com
```

- 确保部署用户（如 `ubuntu`）有写入权限

---

## 3️⃣ 创建 Nginx 配置文件

在 `/etc/nginx/sites-available/` 下创建配置：

```bash
sudo nano /etc/nginx/sites-available/z.com.conf
```

复制以下内容（根据实际域名修改）：

```nginx
server {
    listen 80;
    server_name example.com www.example.com;

    root /server/www/z.com;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    # 可选：静态资源缓存
    location ~* \.(?:ico|css|js|gif|jpe?g|png|woff2?|ttf|svg|eot)$ {
        expires 1M;
        access_log off;
        add_header Cache-Control "public";
    }

    # 可选：自定义 404 页面
    error_page 404 /404.html;
}
```

---

## 4️⃣ 启用配置

```bash
# 创建软链接到 sites-enabled
sudo ln -s /etc/nginx/sites-available/z.com.conf /etc/nginx/sites-enabled/

# 检查配置语法
sudo nginx -t

# 重新加载 Nginx
sudo nginx -s reload
```

---

## 5️⃣ 测试网站

1. 浏览器访问 EC2 公网 IP：

```
http://你的服务器公网IP
```

2. 等域名解析完成后，通过域名访问：

```
http://example.com
```

---

## 6️⃣ 可选优化

- **HTTPS（Let's Encrypt）：**

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d example.com -d www.example.com
```

- **Gzip 压缩静态文件：**

在 `nginx.conf` 或 server block 中添加：

```nginx
gzip on;
gzip_types text/css application/javascript image/svg+xml;
```
---

## 7️⃣ 为 Nginx 配置 HTTPS

Nginx 可以通过 SSL/TLS 启用 HTTPS，让网站通过加密协议访问。下面是简要说明：

### 1️⃣ 获取 SSL 证书（Let's Encrypt）

使用 Certbot 自动申请证书并自动配置 Nginx：

```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d zocial.trisure.me
```

- Certbot 会自动修改 Nginx 配置，添加 443 HTTPS 监听和证书路径
- 自动处理 HTTP → HTTPS 重定向

---

### 2️⃣ 测试并重载 Nginx

```bash
sudo nginx -t
sudo nginx -s reload
```

- 确保 Security Group 开放 443 端口
- 浏览器访问 `https://zocial.trisure.me` 即可访问网站

---

### 💡 提示

- 生产环境推荐使用 Let's Encrypt 自动证书，免费且支持自动续期
- 不需要手动修改 Nginx 配置文件，Certbot 会自动处理


## ✅ 总结

- 安装 Nginx 并确认运行
- 确保网站目录权限正确
- 创建 server block 指向静态文件目录
- `nginx -t` 检查配置，`nginx -s reload` 重新加载
- 访问公网 IP 或域名即可查看网站


