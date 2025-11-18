export enum ItemType {
  DIRECT_MAIL = 'DIRECT_MAIL',
  SEO = 'SEO',
  ADS = 'ADS',
  WEBSITE = 'WEBSITE',
  BRANDING = 'BRANDING',
  EMAIL = 'EMAIL',
  
  // Negatives
  DIY_DISASTER = 'DIY_DISASTER',
  BUDGET_CUT = 'BUDGET_CUT',
  COMPETITOR = 'COMPETITOR'
}

export interface GameItemConfig {
  type: ItemType;
  label: string;
  icon: string; // Emoji or simple char
  customers: number; // Revenue is calculated as customers * PATIENT_VALUE
  color: string;
  textColor: string;
  isPositive: boolean;
}

export interface GameEntity {
  id: number;
  x: number;
  y: number;
  speed: number;
  width: number;
  height: number;
  config: GameItemConfig;
}

export interface LeaderboardEntry {
  businessName: string;
  score: number;
  customers: number;
  challenge: string;
  aiTip?: string;
}

export type GameState = 'START' | 'PLAYING' | 'GAME_OVER' | 'SUBMITTED';

export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number; // 0 to 1
  color: string;
  type: 'DOLLAR' | 'TEXT';
  text?: string;
}