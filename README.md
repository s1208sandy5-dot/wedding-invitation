# 蕭羽呈 × 劉雅蘭 電子喜帖

純靜態網頁，沒有任何後端與外部服務。放上 GitHub Pages 就能用。

## 檔案結構

```
index.html          內容（文字、流程時間都改這裡）
style.css           樣式
script.js           開封動畫、刮刮卡、倒數、音樂
assets/
  cover.jpg         封面婚紗照（新娘原稿，未修改）
  invitation.jpg    喜帖本體（新娘原稿，未修改）
  seal.png          火漆印章（款式 2 花環款）
  music.mp3         ← 這個檔案要你自己放進來
```

## 上線步驟

1. 到 GitHub 建一個新的 repository，取名例如 `shany-orange`，選 Public。
2. 點 **Add file → Upload files**，把 `index.html`、`style.css`、`script.js` 和整個 `assets` 資料夾一起拖進去，Commit。
3. 進 **Settings → Pages**，Source 選 `Deploy from a branch`，Branch 選 `main` / `(root)`，Save。
4. 等一到兩分鐘，網址會出現在同一頁，格式是
   `https://你的帳號.github.io/shany-orange/`
5. 把這個網址貼進 LINE 官方帳號的圖文選單即可。

## 要自己補的東西

**音樂。** 準備一個 mp3，檔名必須是 `music.mp3`，放進 `assets/`。
建議壓到 128 kbps、3 MB 以內，太大會讓賓客用 4G 開很久。
沒有放檔案時，網頁一切正常，只是右下角的音樂鍵會自動隱藏。

## 常要改的地方

| 想改什麼 | 打開哪個檔案 | 找什麼 |
|---|---|---|
| Dress Code 色塊 | `index.html` | `<!-- 五、Dress Code -->` 的 `--c:` 色碼 |
| 結尾那段話 | `index.html` | `<!-- 七、結語 -->` |
| 倒數的目標時間 | `script.js` | `WEDDING_TIME` |
| 換火漆印章款式 | `assets/seal.png` | 換成同名的圓形去背 PNG |

`assets/cover.jpg` 與 `assets/invitation.jpg` 是新娘的原始設計，網頁只是原圖顯示，沒有做任何裁切或改字。

## 相容性

iOS Safari、Android Chrome、LINE 內建瀏覽器都測得過。
瀏覽器規定音樂不能自動播放，所以音樂是在賓客點下火漆印章的那一刻才開始——開場動畫同時也是取得播放權限的動作。
