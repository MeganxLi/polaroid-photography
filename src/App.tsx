import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, BatteryCharging, Github, Code, Star, User, Camera as CameraIcon, Download, Upload, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---
type FilterType = 'pink' | 'orange' | 'yellow' | 'green';

interface Filter {
  id: FilterType;
  color: string;
  borderColor: string;
  shadow: string;
}

const FILTERS: Filter[] = [
  { id: 'pink', color: '#FFB3BA', borderColor: '#FF758F', shadow: '0 0 15px rgba(255, 117, 143, 0.5)' },
  { id: 'orange', color: '#FFDFBA', borderColor: '#FFFFFF', shadow: '0 4px 6px rgba(0, 0, 0, 0.1)' },
  { id: 'yellow', color: '#FFFFBA', borderColor: '#FFFFFF', shadow: '0 4px 6px rgba(0, 0, 0, 0.1)' },
  { id: 'green', color: '#BAFFC9', borderColor: '#FFFFFF', shadow: '0 4px 6px rgba(0, 0, 0, 0.1)' },
];

// 預先定義星星的位置，避免每次 render 都亂跑 (符合設計稿感覺)
const STARS_POSITIONS = [
  { top: '15%', left: '15%', size: 12, delay: 0 },
  { top: '20%', left: '85%', size: 16, delay: 1.2 },
  { top: '65%', left: '8%', size: 14, delay: 2.5 },
  { top: '55%', left: '88%', size: 12, delay: 0.8 },
  { top: '85%', left: '25%', size: 10, delay: 3.1 },
  { top: '80%', left: '75%', size: 18, delay: 1.7 },
  { top: '40%', left: '10%', size: 10, delay: 0.5 },
  { top: '35%', left: '92%', size: 14, delay: 2.0 },
];

const App: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('pink');
  const [photoImage, setPhotoImage] = useState<string | null>("https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=500");
  const [photoText, setPhotoText] = useState('Meow~');
  const [showPhoto, setShowPhoto] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoImage(event.target?.result as string);
        setShowPhoto(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCapture = () => {
    if (photoImage) {
      setShowPhoto(true);
    } else {
      fileInputRef.current?.click();
    }
  };

  const currentFilter = FILTERS.find(f => f.id === selectedFilter) || FILTERS[0];

  return (
    <div className="relative min-h-screen bg-[#FFF9F9] overflow-hidden font-sans text-slate-700 selection:bg-pink-100 selection:text-pink-600">
      {/* --- Static Background Stars (符合設計稿) --- */}
      <div className="absolute inset-0 pointer-events-none">
        {STARS_POSITIONS.map((pos, i) => (
          <motion.div
            key={i}
            className="absolute text-[#FFD1D1]"
            initial={{ opacity: 0.4 }}
            animate={{ 
              opacity: [0.3, 0.6, 0.3], 
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              delay: pos.delay 
            }}
            style={{
              top: pos.top,
              left: pos.left,
            }}
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
        <button className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-pink-100 text-[#FF8FA3] hover:bg-pink-50 transition-colors shadow-sm">
          <BatteryCharging size={18} className="md:w-5 md:h-5" />
          <span className="font-medium text-xs md:text-sm">操作說明</span>
        </button>
      </header>

      {/* --- Main Interaction Area --- */}
      <main className="relative z-10 flex flex-col items-center justify-center pt-4 md:pt-10 px-4">
        <div className="relative w-full max-w-[320px] md:max-w-none flex justify-center">
          {/* Camera Illustration */}
          <motion.div 
            className="relative w-64 h-56 md:w-80 md:h-72 bg-[#FFCFD2] rounded-[32px] md:rounded-[40px] shadow-2xl overflow-hidden border-b-6 md:border-b-8 border-slate-800"
            whileHover={{ scale: 1.02 }}
          >
            {/* Retro Stripes */}
            <div className="absolute left-6 md:left-10 top-0 h-full w-16 md:w-20 flex">
              <div className="w-1/4 h-full bg-[#FFB3BA]" />
              <div className="w-1/4 h-full bg-[#FFDFBA]" />
              <div className="w-1/4 h-full bg-[#FFFFBA]" />
              <div className="w-1/4 h-full bg-[#BAFFC9]" />
            </div>

            {/* Top Details */}
            <div className="absolute right-6 md:right-10 top-4 md:top-6 flex flex-col items-center gap-2">
              <div className="w-6 h-4 md:w-8 md:h-5 bg-white border-2 border-slate-800 rounded-sm" />
              <motion.div 
                className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#FF4757]"
              />
            </div>

            {/* Lens */}
            <div className="absolute top-[45%] left-[55%] -translate-x-1/2 -translate-y-1/2 md:top-1/2 md:left-1/2">
              <div className="relative w-28 h-28 md:w-36 md:h-36 bg-slate-800 rounded-full border-4 border-slate-700 shadow-inner flex items-center justify-center">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-slate-900 rounded-full border-2 border-slate-800 flex items-center justify-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-black rounded-full shadow-inner" />
                  <div className="absolute top-6 right-6 md:top-8 md:right-8 w-3 h-3 md:w-4 md:h-4 bg-white/20 rounded-full blur-[1px]" />
                </div>
              </div>
            </div>

            {/* Bottom Base */}
            <div className="absolute bottom-0 w-full h-10 md:h-12 bg-slate-800 flex items-center justify-center">
              <div className="w-48 md:w-60 h-1.5 md:h-2 bg-slate-900 rounded-full opacity-50" />
            </div>

            {/* Shutter Button Hidden */}
            <button 
              onClick={handleCapture}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              title="Click to take photo"
            />
          </motion.div>

          {/* Hidden Input */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
            accept="image/*"
          />

          {/* --- Polaroid Photo Ejection --- */}
          <AnimatePresence>
            {showPhoto && (
              <motion.div
                initial={{ y: -20, opacity: 0, rotate: 0 }}
                animate={{ y: 140, opacity: 1, rotate: 5 }}
                exit={{ y: 400, opacity: 0 }}
                drag
                dragConstraints={{ left: -150, right: 150, top: -100, bottom: 400 }}
                className="absolute top-32 md:top-40 left-1/2 -translate-x-1/2 w-44 md:w-52 bg-white p-2.5 md:p-3 rounded-sm shadow-xl cursor-grab active:cursor-grabbing border border-slate-100 group z-10"
              >
                <div className="relative aspect-square bg-slate-50 overflow-hidden rounded-[2px]">
                  {photoImage ? (
                    <img src={photoImage} alt="Captured" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                      <CameraIcon size={32} />
                      <span className="text-[8px] uppercase tracking-widest mt-2">No Photo</span>
                    </div>
                  )}
                  {/* Photo Overlay Controls */}
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setShowPhoto(false)} className="p-1 bg-white/80 rounded-full text-pink-500 hover:bg-white shadow-sm">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
                <div className="py-3 md:py-4 pb-1 md:pb-2 px-1">
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* --- Controls Footer --- */}
      <footer className="absolute bottom-0 w-full px-6 md:px-10 pb-8 md:pb-10 flex flex-col md:flex-row justify-between items-center md:items-end gap-8 md:gap-0">
        {/* Filter Selector */}
        <div className="flex flex-col items-center md:items-start gap-3 md:gap-4 w-full md:w-auto z-10">
          <span className="text-[10px] md:text-sm font-bold text-[#FF8FA3] tracking-widest uppercase">選擇濾鏡</span>
          <div className="flex gap-3 md:gap-4">
            {FILTERS.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`w-10 h-10 md:w-12 md:h-12 rounded-full transition-all duration-300 relative ${
                  selectedFilter === filter.id 
                    ? 'scale-110 shadow-lg' 
                    : 'scale-100 hover:scale-105'
                }`}
                style={{ 
                  backgroundColor: filter.color,
                  boxShadow: selectedFilter === filter.id ? filter.shadow : '0 4px 6px rgba(0,0,0,0.1)',
                  border: selectedFilter === filter.id ? `3px solid ${filter.borderColor}` : '2px solid white'
                }}
              />
            ))}
          </div>
        </div>

        {/* Action Button & GitHub */}
        <div className="flex flex-col items-center md:items-end gap-4 md:gap-6 w-full md:w-auto z-10">
          <div className="flex gap-4">
             <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center text-[#FF8FA3] shadow-md hover:bg-pink-50 transition-all border border-pink-50"
              title="Upload Photo"
            >
              <Upload size={18} className="md:w-5 md:h-5" />
            </button>
            <button 
              onClick={() => {
                if (!photoImage) return;
                const link = document.createElement('a');
                link.download = 'polaroid.png';
                link.href = photoImage;
                link.click();
              }}
              className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center text-[#FF8FA3] shadow-md hover:bg-pink-50 transition-all border border-pink-50"
              title="Download Result"
            >
              <Download size={18} className="md:w-5 md:h-5" />
            </button>
          </div>
          
          <a 
            href="https://github.com/Megna" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 group"
          >
            <span className="font-bold text-sm md:text-lg text-[#FF8FA3] group-hover:underline">Megna</span>
            <Github size={18} className="text-[#FF8FA3] group-hover:scale-110 transition-transform md:w-5 md:h-5" />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default App;
