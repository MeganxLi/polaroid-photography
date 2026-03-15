# 系統功能規格 (Functional Specifications)

這份文件將 `planning.md` 中的前端頁面需求，進一步轉化為開發實作時的「功能清單」，以便前端工程師進行模組拆解與實作。

## 1. 導覽與提示功能 (Navigation & Instructional System)
- **操作說明 Modal (Instruction Modal)**
  - **觸發條件**：點擊右上角帶有電池/充電圖示（Battery-charging icon）的「操作說明」按鈕。
  - **功能行為**：展開/關閉彈出視窗（Modal）或是覆蓋層（Overlay），內容顯示應用的操作步驟：拍照、選擇濾鏡、輸入文字、下載保存等指示。
- **外部連結新開視窗 (External Link Routing)**
  - **功能行為**：點擊右下角 GitHub (`Megna`) 連結時，使用 `target="_blank"` 另外開啟新分頁，避免使用者中斷目前的操作。

## 2. 核心影像獲取功能 (Core Image Acquisition)
使用者可以透過以下兩種主要方式獲取圖片：
- **Webcam 拍照機制 (Camera Capture)**
  - **權限請求**：點擊拍攝按鈕或相機鏡頭區域時，前端需調用 `navigator.mediaDevices.getUserMedia` 請求相機權限。
  - **即時預覽與擷取**：取得授權後顯示視訊畫面；使用者按下快門後，擷取當下幀（Frame）並轉換為圖片資料。
- **本地上傳與拖曳 (File Upload & Drag-and-Drop)**
  - **點擊上傳**：點擊預設的相片圖示區塊，觸發 `<input type="file" accept="image/*">` 開啟系統檔案總管。
  - **拖曳上傳**：實作 Drag & Drop API，讓使用者能直接將電腦上的圖片檔案拖入指定區塊進行預覽。

## 3. 相片互動與編輯功能 (Photo Interaction & Editing)
- **相片吐出動畫 (Photo Eject Animation)**
  - **功能行為**：當載入/拍好圖片後，觸發 CSS 或動畫函式庫（如 Framer Motion / GSAP），讓拍立得相片元件有一段從「相機底部暗槽往下滑出」的動態效果。
- **自訂文字輸入 (Custom Text Input)**
  - **功能行為**：相片底部的白色邊框區域包含一個不可見或無邊框的 `<input>` 或是 `contenteditable` 區域。
  - **設計細節**：使用者點擊該處即可自由輸入想留下的文字（預設顯示 `Meow~` 等佔位符號），並支援修改與即時預覽。
- **濾鏡與主題狀態連動 (Filter & Theme State Control)**
  - **狀態管理**：提供四個顏色選項（粉紅、橘黃、淺綠、薄荷藍），前端需建立全局或元件層級 State 紀錄當前選擇的顏色。
  - **UI 連動**：
    1. 點選的色塊呈現外部發光/外框效果（Active State）。
    2. 即時改變相機機身上「紅色小圓點（閃光燈/指示燈）」的顏色，以呼應所選主題。
    3. （選用/進階）該顏色也可用於控制圖片的 CSS Filter （如 `sepia`, `hue-rotate`）。

## 4. 影像合成與匯出功能 (Canvas Rendering & Export)
- **結算與繪製 (DOM to Image)**
  - **功能行為**：點擊「儲存/下載相片」按鈕後，系統需將**「整張拍立得相片」（包含：相片白框、圖片本身、套用的濾鏡、使用者輸入的文字）** 合成。
  - **技術預期**：通常透過 `html2canvas` 或 `dom-to-image` 等套件，將指定的 DOM 節點轉譯為 Canvas 資料。
- **檔案下載 (File Download)**
  - **功能行為**：將合成後的 Canvas 轉換為 Data URL (PNG 或是 JPEG 格式)，並利用建立隱藏的 `<a>` 標籤觸發下載動作，將檔案儲存至使用者的裝置中。

## 5. 其他系統與底層機制 (System Architecture)
- **純前端處理 (Client-Side Only Processing)**
  - **隱私與架構**：所有的圖片讀取、處理、編輯與合成轉換皆在瀏覽器端（前端）執行，無需伺服器 API 儲存，確保使用者隱私並減少後端負載。
- **響應式機制 (Responsive Web Design)**
  - **多裝置支援**：針對 Mobile / Tablet / Desktop 定義斷點（Breakpoints）。手機版需將佈局從水平調整為垂直，或將濾鏡選擇器移動至更便於單手觸控的操作區域（如相機正下方）。
