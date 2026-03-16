import React, { useState, useRef } from 'react';
import { Sparkles, BatteryCharging, Github, Star, Camera as CameraIcon, Download, Upload, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';

// --- Constants, Types & Components ---
import { FILTERS, STARS_POSITIONS } from './constants';
import type { FilterType } from './types';
import { IconButton } from './components/IconButton';

const App: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('warm-vintage');
  const [photoImage, setPhotoImage] = useState<string | null>("https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=500");
  const [photoText, setPhotoText] = useState('Meow~');
  const [showPhoto, setShowPhoto] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const photoCardRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const currentFilter = FILTERS.find(f => f.id === selectedFilter) || FILTERS[0];

  // Drag and Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotoImage(event.target?.result as string);
      setShowPhoto(true);
      stopCamera(); // 停止相機（如果正在運行）
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // WebCam Logic
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
      setShowPhoto(false); // 隱藏目前照片，準備拍照
    } catch (err) {
      console.error("Error accessing camera: ", err);
      alert("無法存取相機，請確認權限設定。");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const takePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        setPhotoImage(dataUrl);
        stopCamera();
        
        // 觸發吐出相片動畫
        setShowPhoto(false);
        setTimeout(() => setShowPhoto(true), 100); 
      }
    }
  };

  const handleMainAction = () => {
    if (isCameraActive) {
      takePhoto();
    } else {
      startCamera();
    }
  };

  // Export to Image using html2canvas
  const downloadImage = async () => {
    if (!photoCardRef.current) return;
    
    try {
      const canvas = await html2canvas(photoCardRef.current, {
        useCORS: true,
        scale: 2, // 提高解析度
        backgroundColor: null,
        logging: false
      });
      
      const link = document.createElement('a');
      link.download = `polaroidly-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error("Failed to export image:", err);
      alert("儲存相片失敗");
    }
  };

  return (
    <div className="relative min-h-screen bg-[#FFF9F9] overflow-hidden font-sans text-slate-700 selection:bg-pink-100 selection:text-pink-600">
      {/* --- Static Background Stars --- */}
      <div className="absolute inset-0 pointer-events-none">
        {STARS_POSITIONS.map((pos, i) => (
          <motion.div
            key={i}
            className="absolute text-[#FFD1D1]"
            initial={{ opacity: 0.4 }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, delay: pos.delay }}
            style={{ top: pos.top, left: pos.left }}
          >
            <Star size={pos.size} fill="currentColor" stroke="none" />
          </motion.div>
        ))}
      </div>

      {/* --- Header --- */}
      <header className="relative z-10 flex justify-between items-center px-6 md:px-10 py-6 md:py-8">
        <div className="flex items-center gap-2 group cursor-default">
          <span className="text-2xl md:text-3xl font-bold tracking-tight text-[#FF8FA3]">Polaroidly</span>
          <Sparkles className="text-[#FF8FA3] group-hover:animate-spin" size={24} fill="currentColor" />
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-transparent text-[#FF8FA3] hover:bg-white/50 hover:border-pink-100 hover:shadow-sm transition-colors"
        >
          <BatteryCharging size={18} className="md:w-5 md:h-5" />
          <span className="font-medium text-xs md:text-sm">操作說明</span>
        </button>
      </header>

      {/* --- Main Interaction Area --- */}
      <main className="relative z-10 flex flex-col items-center justify-start md:justify-center pt-4 md:pt-10 px-4 h-[calc(100vh-200px)] md:h-auto overflow-y-auto md:overflow-visible no-scrollbar pb-32 md:pb-0">
        <div className="relative w-full max-w-[320px] md:max-w-none flex justify-center mt-2 md:mt-0">
          {/* Camera Illustration */}
          <motion.div 
            className="relative w-64 h-56 md:w-80 md:h-72 bg-[#FFCFD2] rounded-[32px] md:rounded-[40px] shadow-2xl overflow-hidden border-b-6 md:border-b-8 border-slate-800 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            onClick={handleMainAction}
          >
            {/* Retro Stripes */}
            <div className="absolute left-6 md:left-10 top-0 h-full w-16 md:w-20 flex">
              <div className="w-1/4 h-full bg-[#FFB3BA]" />
              <div className="w-1/4 h-full bg-[#FFDFBA]" />
              <div className="w-1/4 h-full bg-[#FFFFBA]" />
              <div className="w-1/4 h-full bg-[#BAFFC9]" />
            </div>

            {/* Top Details (Indicator linked to selected filter) */}
            <div className="absolute right-6 md:right-10 top-4 md:top-6 flex flex-col items-center gap-2">
              <div className="w-6 h-4 md:w-8 md:h-5 bg-white border-2 border-slate-800 rounded-sm" />
              <motion.div 
                className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-colors duration-300 border border-white"
                style={{ backgroundColor: currentFilter.color }}
              />
            </div>

            {/* Lens Area */}
            <div className="absolute top-[45%] left-[55%] -translate-x-1/2 -translate-y-1/2 md:top-1/2 md:left-1/2">
              <div className="relative w-28 h-28 md:w-36 md:h-36 bg-slate-800 rounded-full border-4 border-slate-700 shadow-inner flex items-center justify-center overflow-hidden">
                
                {/* Webcam Preview inside Lens */}
                {isCameraActive ? (
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className="absolute inset-0 w-full h-full object-cover scale-x-[-1]" // scale-x-[-1] for mirror effect
                  />
                ) : (
                  <>
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-slate-900 rounded-full border-2 border-slate-800 flex items-center justify-center">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-black rounded-full shadow-inner" />
                      <div className="absolute top-6 right-6 md:top-8 md:right-8 w-3 h-3 md:w-4 md:h-4 bg-white/20 rounded-full blur-[1px]" />
                    </div>
                  </>
                )}
                
                {/* Flash Effect overlay when capturing */}
                <AnimatePresence>
                  {isCameraActive && (
                    <div className="absolute inset-0 border-[16px] border-black/40 rounded-full pointer-events-none" />
                  )}
                </AnimatePresence>

              </div>
            </div>

            {/* Bottom Base */}
            <div className="absolute bottom-0 w-full h-10 md:h-12 bg-slate-800 flex items-center justify-center">
              <div className="w-48 md:w-60 h-1.5 md:h-2 bg-slate-900 rounded-full opacity-50" />
            </div>
            
            {/* Tooltip hint on hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/10">
               <span className="text-white font-bold bg-black/50 px-3 py-1 rounded-full text-xs">
                 {isCameraActive ? '點擊拍照' : '點擊開啟相機'}
               </span>
            </div>
          </motion.div>

          <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />

          {/* --- Polaroid Photo Ejection --- */}
          <AnimatePresence>
            {showPhoto && !isCameraActive && (
              <motion.div
                initial={{ y: -20, opacity: 0, rotate: 0 }}
                animate={{ y: 140, opacity: 1, rotate: 5 }}
                exit={{ y: 400, opacity: 0 }}
                drag
                dragConstraints={{ left: -150, right: 150, top: -100, bottom: 400 }}
                className="absolute top-32 md:top-40 left-1/2 -translate-x-1/2 w-48 md:w-52 z-10"
              >
                {/* 
                  Wrapper div that we will actually convert to canvas.
                  This ensures html2canvas captures exactly what we see.
                */}
                <div 
                  ref={photoCardRef}
                  className="bg-white p-3 md:p-3 shadow-xl border border-slate-100 relative group rounded-md"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <div className="relative aspect-square bg-slate-50 overflow-hidden rounded-sm border border-slate-200">
                    {photoImage ? (
                      <img 
                        src={photoImage} 
                        alt="Captured" 
                        className="w-full h-full object-cover transition-all duration-300" 
                        style={{ filter: currentFilter.cssFilter }} // Apply CSS Filter here
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                        <CameraIcon size={32} />
                        <span className="text-[8px] uppercase tracking-widest mt-2">Drag or Upload</span>
                      </div>
                    )}
                    
                    {/* Delete overlay control (Won't be captured by html2canvas because it's opacity-0 normally) */}
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity" data-html2canvas-ignore="true">
                      <button onClick={() => setShowPhoto(false)} className="p-1.5 bg-white/80 backdrop-blur-sm rounded-full text-pink-500 hover:bg-white hover:text-pink-600 shadow-sm cursor-pointer transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="py-3 md:py-4 pb-1 md:pb-2 px-1 flex flex-col items-center">
                    {/* Use input for editing, but style it like normal text */}
                    <input
                      type="text"
                      value={photoText}
                      onChange={(e) => setPhotoText(e.target.value)}
                      className="w-full text-center text-slate-700 font-medium text-base md:text-lg bg-transparent border-none outline-none placeholder:text-slate-200"
                      placeholder="Click to type..."
                    />
                    <div className="text-[7px] md:text-[8px] text-center text-slate-300 mt-1 md:mt-2 tracking-tighter uppercase font-bold">
                      Polaroidly • {new Date().toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* --- Controls Footer --- */}
      <footer className="fixed md:absolute bottom-0 w-full px-6 md:px-10 pb-6 md:pb-10 pt-10 md:pt-0 flex justify-between items-end z-20 pointer-events-none bg-gradient-to-t from-[#FFF9F9] via-[#FFF9F9]/80 to-transparent">

        {/* Filter Selector (Left) */}
        <div className="flex flex-col items-start gap-2 md:gap-4 w-[60%] pointer-events-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
             <span className="text-[10px] md:text-sm font-bold text-[#FF8FA3] tracking-widest uppercase whitespace-nowrap">選擇濾鏡</span>
             <span className="text-[10px] md:text-xs text-slate-400 font-medium bg-white/50 px-2 py-0.5 rounded-full whitespace-nowrap">{currentFilter.name}</span>
          </div>
          <div className="flex flex-wrap gap-2 md:gap-4 w-full">
            {FILTERS.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`w-7 h-7 sm:w-8 sm:h-8 md:w-12 md:h-12 rounded-full transition-all duration-300 relative border-2 border-white shadow-sm flex-shrink-0 ${
                  selectedFilter === filter.id 
                    ? 'scale-110 shadow-[0_0_15px_rgba(255,117,143,0.5)] border-[#FF758F]' 
                    : 'scale-100 hover:scale-105'
                }`}
                style={{ 
                  backgroundColor: filter.color,
                }}
                title={filter.name}
              />
            ))}
          </div>
        </div>

        {/* Action Button & GitHub (Right) */}
        <div className="flex flex-col items-end justify-end gap-3 md:gap-6 pb-1 md:pb-0 w-[40%] pointer-events-auto">
          <div className="flex gap-2 md:gap-4">
             <IconButton 
              icon={Upload} 
              onClick={() => fileInputRef.current?.click()} 
              title="上傳本地圖片" 
             />
            <IconButton 
              icon={Download} 
              onClick={downloadImage} 
              title="下載合成相片" 
            />
          </div>

          <a 
            href="https://github.com/MeganxLi/polaroid-photography" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 md:gap-2 group hover:scale-110 transition-transform bg-white/50 px-2 py-1 rounded-full backdrop-blur-sm"
          >
            <Github size={14} className="text-[#FF8FA3] md:w-5 md:h-5" />
            <span className="font-bold text-xs md:text-lg text-[#FF8FA3]">Megna</span>
          </a>
        </div>
      </footer>

      {/* --- Instruction Modal --- */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4 pointer-events-auto"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl relative"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full p-1 transition-colors"
              >
                <X size={20} />
              </button>
              
              <h2 className="text-xl md:text-2xl font-bold text-[#FF8FA3] mb-4 flex items-center gap-2">
                <Sparkles size={20} /> 操作說明
              </h2>
              
              <ul className="space-y-4 text-slate-600 text-sm md:text-base">
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center flex-shrink-0 font-bold">1</span>
                  <div>
                    <strong className="block text-slate-800">取得相片</strong>
                    點擊中央大相機即可啟動 Webcam 進行拍照。您也可以點擊右下角 <Upload size={14} className="inline"/> 上傳，或直接將圖片拖曳至相片區塊。
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center flex-shrink-0 font-bold">2</span>
                  <div>
                    <strong className="block text-slate-800">套用濾鏡</strong>
                    選擇左下角的顏色圓圈，相機指示燈會連動變色，並且即時改變相片的復古濾鏡效果。
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center flex-shrink-0 font-bold">3</span>
                  <div>
                    <strong className="block text-slate-800">自訂文字</strong>
                    點擊相片下方的文字區域 (預設為 Meow~) 即可輸入您想記錄的文字。
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-green-100 text-green-500 flex items-center justify-center flex-shrink-0 font-bold">4</span>
                  <div>
                    <strong className="block text-slate-800">保存回憶</strong>
                    完成後，點擊右下角 <Download size={14} className="inline"/> 按鈕，系統會將相片（包含邊框與文字）合成並下載。
                  </div>
                </li>
              </ul>
              
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-full mt-6 bg-[#FF8FA3] hover:bg-[#ff7b92] text-white font-bold py-3 rounded-xl transition-colors"
              >
                我知道了
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default App;
