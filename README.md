<div align="center">
    <h2>Polaroidly - 拍立得相機應用</h2>
</div>
<img width="2360" height="1640" alt="localhost_5173_(iPad Air)" src="https://github.com/user-attachments/assets/154b1374-528d-46ef-aca4-4b35de2a8b33" />


<p align="center">
Polaroidly 是一個充滿復古與可愛風格的單頁式 Web 應用程式 (SPA)。使用者可以透過網頁攝影機 (Webcam) 拍照，或上傳本地圖片，並為照片套用不同風格的復古濾鏡、寫下專屬的紀念文字，最後將它完美打包成一張拍立得相片下載保存。
</p>
<p align="center">
  <a href="https://polaroid-photography.vercel.app/">
    <img src="https://img.shields.io/badge/Demo_website-Your?&style=for-the-badge&logo=data:image/svg%2bxml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE5IDNINUMzLjg5NTQzIDMgMyAzLjg5NTQzIDMgNVYxOUMzIDIwLjEwNDYgMy44OTU0MyAyMSA1IDIxSDE5QzIwLjEwNDYgMjEgMjEgMjAuMTA0NiAyMSAxOVY1QzIxIDMuODk1NDMgMjAuMTA0NiAzIDE5IDNaIiBzdHJva2U9IiNGMkYzRjQiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik0zIDlIMjEiIHN0cm9rZT0iI0YyRjNGNCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTkgMjFWOSIgc3Ryb2tlPSIjRjJGM0Y0IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K&logoColor=ffffff&color=282828" />
  </a>
</p>

---

## 1. 說明 (Introduction)

此專案是一次結合 **AI 協作開發** 的實踐過程。透過提供清晰的設計稿 (Wireframe) 與需求規劃，由 AI 代理（Gemini CLI）負責專案的搭建、環境配置、切版以及複雜邏輯（相機權限、圖片合成）的實作。

### 核心功能
*   **Webcam 拍照**：點擊相機本體即可啟用鏡頭，取景後點擊即可獲得相片。
*   **拖曳與上傳**：支援直接將電腦圖片拖曳入相片框，或點擊上傳按鈕選取照片。
*   **即時濾鏡切換**：提供「原圖、經典暖褐復古、褪色日系底片、濃郁 Lomo 對比」四種 CSS 濾鏡，並與相機機身的指示燈連動。
*   **客製化文字**：在相片下方自由輸入心情點滴（預設為 Meow~）。
*   **一鍵匯出**：完美保留拍立得邊框、圓角、陰影與套用濾鏡後的視覺，匯出為透明背景的高清 PNG 圖檔。
*   **完全響應式設計 (RWD)**：不論是電腦螢幕還是手機 (iPhone SE 尺寸)，都能提供最佳化的操作與視覺體驗。

---

## 2. 規劃 (Planning)

在開發初期，我透過 [`planning.md`](./planning.md) 和 [`function.md`](./function.md) 定義了嚴謹的規格，並以此作為指揮 AI 的藍圖：

### 技術選型
*   **前端框架**：React 19 + TypeScript (透過 Vite 建立，追求極致開發體驗)
*   **樣式處理**：Tailwind CSS v4 (快速切版與 RWD 設定)
*   **動畫效果**：Framer Motion (實現相片「吐出」的滑動與輕微旋轉、以及星星閃爍效果)
*   **圖示庫**：Lucide React
*   **影像匯出**：`html-to-image` (解決早期 `html2canvas` 無法處理 CSS Filter 與 Transform 的痛點)
*   **單元測試**：Vitest + React Testing Library (針對核心邏輯與互動進行覆蓋)

### UI/UX 藍圖
*   **視覺對齊**：要求 AI 精確還原設計稿中的相機細節（彩色條紋比例、鏡頭漸層、觀景窗）、以及漂浮的背景星星。
*   **操作回饋**：當按鈕 Hover、相機開啟、或是濾鏡切換時，必須有對應的光暈或動畫提示。

---

## 3. 執行 (Execution) - 我的 AI 協作開發工作流

在這個專案中，我扮演了「架構師」的角色，而將繁瑣的 Coding 工作交給了 AI 代理。以下是我操作 AI 協助開發的過程：

1.  **情境設定與基礎搭建**：
    *   我提供了一張 Wireframe UI 圖片與詳細的 [`planning.md`](./planning.md) 來進行環境與架構規劃，並提供 [`function.md`](./function.md) 具體定義相機運作、濾鏡效果及圖片合成等各項核心功能的細節與邏輯。
2.  **模組化與組件開發**：
    *   AI 迅速完成了環境建置並切出主畫面。
    *   我檢視後，指出資料結構的不合理處，要求將 `Types` 與 `Constants` 抽離，並將重複的按鈕封裝為 `IconButton.tsx`，AI 立即完成了重構。
3.  **精細的 UI 調整 (Pixel Perfect)**：
    *   我透過自然語言糾正細節：「相機的攝像頭要和圖片對齊」、「濾鏡圓圈底部要有一點陰影」、「星星放大 2 倍」、「手機尺寸下相機要置中」。
    *   AI 能夠理解這些視覺需求，並直接修改 Tailwind 的 ClassName 達成效果。
4.  **功能完備與深度優化**：
    *   **修正相機擷取邏輯**：初步測試時，點擊相機偶爾會產生空圖片 (`data:,`)。經由 AI 分析，確認是 React 狀態更新與 `<video>` 渲染時間差引發的 Metadata 遺失，於是透過加入 `useEffect` 綁定串流與 Fallback 尺寸保護，確保了拍照的穩定性。
    *   **提升相片匯出品質**：最初使用 `html2canvas` 匯出時無法保留 CSS 濾鏡，更換為 `html-to-image` 後又面臨圓角與透明背景消失的問題。在與 AI 反覆微調後，最終成功達成「保留復古濾鏡、真實圓角、自然陰影」的高清晰度 PNG 匯出。
5.  **測試與驗證**：
    *   我要求 AI 將所有功能寫進測試。AI 主動導入了 Vitest，並完成了 8 個核心功能的單元測試（包含 Mock Webcam 與 html-to-image），確保所有功能穩健不崩潰。

**我專注於產品定義與除錯方向，AI 負責程式碼的撰寫與重構。**

---

### 如何在本地運行

```bash
# 1. 安裝依賴
npm install

# 2. 啟動開發伺服器
npm run dev

# 3. 執行單元測試
npm run test
```
