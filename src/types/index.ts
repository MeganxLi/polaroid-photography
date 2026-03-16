export type FilterType = 'original' | 'warm-vintage' | 'faded-film' | 'lomo';

export interface Filter {
  id: FilterType;
  name: string;
  color: string;
  cssFilter: string;
}
