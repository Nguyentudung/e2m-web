# e2m Web

Website tải và kiểm tra phiên bản e2m.

Tech:
- React
- TypeScript
- Vite
- Tailwind CSS

Development:

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

Update system:

File `public/download/update.json` cấu hình phiên bản mới nhất:

```json
{
  "version": "1.0.0",
  "build": 1,
  "download_url": "/download/e2m-v1.0.0.apk",
  "release_notes": [
    "Phiên bản đầu tiên của e2m"
  ]
}
```
