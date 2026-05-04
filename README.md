# TPR 2026 @ NTOU · 教學實踐研究暨大學社會責任實踐成果交流會

National Taiwan Ocean University · 2026.06.22–23 成果交流會官方網站

🌐 **網站**：https://tpr2026.ntouctl.org
📝 **編輯後台**：https://tpr2026.ntouctl.org/admin/

> 改自原 [Google Sites 版本](https://sites.google.com/email.ntou.edu.tw/2022-ntou-tpr-usr/)，採現代海洋風格重新設計，並接上 Sveltia CMS 讓非技術人員可以自行編輯。

---

## 📁 結構

```
ntou_redesign/
├── index.html              首頁（Alpine.js 動態渲染）
├── agenda/index.html       議程
├── field-trip/index.html   場域踏查
├── transport/index.html    交通資訊與地圖
├── contact/index.html      聯繫我們
├── 404.html                錯誤頁面（可選）
│
├── admin/                  後台
│   ├── index.html          Sveltia CMS 入口
│   └── config.yml          內容架構定義
│
├── data/                   ⭐ 內容資料（CMS 編輯這裡）
│   ├── event.json          活動基本資訊
│   ├── homepage.json       首頁內容
│   ├── agenda.json         議程
│   ├── field-trip.json     場域踏查
│   ├── transport.json      交通資訊
│   └── contact.json        聯繫我們
│
├── assets/
│   ├── css/style.css       自訂樣式
│   ├── js/main.js          載入器、UI 行為、Alpine 工廠
│   └── images/uploads/     CMS 上傳的圖片
│
├── CNAME                   GitHub Pages 自訂網域
├── EDITING-GUIDE.md        ⭐ 給協作者看的後台教學
└── README.md               技術文件（本檔）
```

---

## 🛠️ 技術堆疊

| 用途 | 工具 |
|---|---|
| 樣式 | [Tailwind CSS](https://tailwindcss.com)（CDN） |
| 互動 | [Alpine.js](https://alpinejs.dev) v3 |
| 圖示 | [Lucide Icons](https://lucide.dev) |
| 字型 | Noto Sans TC（Google Fonts） |
| CMS | [Sveltia CMS](https://github.com/sveltia/sveltia-cms) |
| 託管 | GitHub Pages |
| DNS | Cloudflare |

**完全免費，零後端，零 build step。**

---

## 🏗️ 架構

```
┌─ 編輯者瀏覽器 ─────────────────────────┐
│ tpr2026.ntouctl.org/admin/           │
│ (Sveltia CMS)                          │
└────────────┬───────────────────────────┘
             │ 透過 GitHub API commit
             ▼
┌─ GitHub Repo ──────────────────────────┐
│ data/*.json                            │
│ assets/images/uploads/*                │
└────────────┬───────────────────────────┘
             │ push 觸發 GitHub Actions
             ▼
┌─ GitHub Pages CDN ─────────────────────┐
│ tpr2026.ntouctl.org                   │
│ HTML 用 Alpine.js fetch JSON 渲染      │
└────────────────────────────────────────┘
```

---

## 💻 本機開發

純靜態，但 `fetch()` 在 `file://` 協定下無法用，需起一個本機伺服器：

```bash
# 用 Python（推薦）
cd ntou_redesign
python -m http.server 8000

# 或用 Node
npx serve

# 或用 VS Code 的 Live Server 擴充套件
```

打開 http://localhost:8000

---

## 🚀 部署

每次 push 到 `main` 分支，GitHub Pages 自動部署，約 1 分鐘上線。

```bash
git add .
git commit -m "改了 XX"
git push
```

---

## 📝 內容更新

### 給協作者：請看 [EDITING-GUIDE.md](./EDITING-GUIDE.md)

### 給開發者：直接改 `data/*.json`

JSON 檔案結構在 `admin/config.yml` 有完整定義（也是 CMS 表單來源）。

---

## ⚙️ CMS 認證設定（一次性）

Sveltia CMS 預設使用 GitHub OAuth：

1. **Repo 必須為 Public**（或付費 GitHub Pro 後可用 Private）
2. 編輯者需要被加為 repo 的 Collaborator
3. 第一次登入後 Sveltia 會引導授權

---

## 🎨 設計系統

### 配色

```css
--ocean-deep:  #0c4a6e   /* 深海藍：主色、標題 */
--ocean-blue:  #0369a1   /* 海藍 */
--ocean-cyan:  #0891b2   /* 海青：強調、按鈕 */
--ocean-teal:  #0d9488   /* 海綠 */
--sand:        #fbbf24   /* 沙黃：點綴 */
--coral:       #fb923c   /* 珊瑚橘：CTA 按鈕 */
```

### 字型

主要：Noto Sans TC
備援：Microsoft JhengHei → system-ui

---

## 🤝 貢獻

1. 編輯內容用 [後台](https://tpr2026.ntouctl.org/admin/)（推薦）
2. 修改設計或結構：fork → branch → PR
