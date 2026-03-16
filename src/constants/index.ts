import type { Filter } from '../types';

export const FILTERS: Filter[] = [
  { 
    id: 'warm-vintage', 
    name: '經典暖褐復古',
    color: '#FFDFBA', 
    cssFilter: 'sepia(50%) contrast(120%) saturate(120%) brightness(90%)'
  },
  { 
    id: 'faded-film', 
    name: '褪色日系底片',
    color: '#FFFFBA', 
    cssFilter: 'sepia(20%) contrast(85%) brightness(110%) grayscale(20%)'
  },
  { 
    id: 'lomo', 
    name: '濃郁 Lomo 對比',
    color: '#BAFFC9', 
    cssFilter: 'contrast(140%) saturate(150%) brightness(85%) sepia(20%)'
  },
  { 
    id: 'original', 
    name: '原圖片',
    color: '#FFB3BA', 
    cssFilter: 'none'
  },
];

export const STARS_POSITIONS = [
  { top: '15%', left: '15%', size: 24, delay: 0 },
  { top: '20%', left: '85%', size: 32, delay: 1.2 },
  { top: '65%', left: '8%', size: 28, delay: 2.5 },
  { top: '55%', left: '88%', size: 24, delay: 0.8 },
  { top: '85%', left: '25%', size: 20, delay: 3.1 },
  { top: '80%', left: '75%', size: 36, delay: 1.7 },
  { top: '40%', left: '10%', size: 20, delay: 0.5 },
  { top: '35%', left: '92%', size: 28, delay: 2.0 },
];
