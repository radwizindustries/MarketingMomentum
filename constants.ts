import { GameItemConfig, ItemType } from './types';

export const GAME_DURATION = 30;
export const CANVAS_WIDTH = 1280;
export const CANVAS_HEIGHT = 600;
export const PLAYER_WIDTH = 50;
export const PLAYER_HEIGHT = 80;

// Physics
export const GRAVITY = 0.6;
export const JUMP_STRENGTH = -14;
export const GROUND_HEIGHT = 85; // Adjusted for the visual street level in the image

// Square Items
export const ITEM_WIDTH = 110;
export const ITEM_HEIGHT = 110;
export const PATIENT_VALUE = 1500;

export const BACKGROUND_URL = "https://images.reallygooddesigns.com/2023/09/winter-city-with-snow-on-street-background-cartoon-style.jpg";

// Brand Colors
const BRAND_CYAN = 'rgb(0, 169, 197)';
const BRAND_DARK = 'rgb(0, 61, 81)';

// Items - All positives give +25 customers
export const ITEM_CONFIGS: Record<ItemType, GameItemConfig> = {
  [ItemType.DIRECT_MAIL]: { type: ItemType.DIRECT_MAIL, label: 'Direct Mail', icon: '📬', customers: 25, color: BRAND_CYAN, textColor: '#fff', isPositive: true },
  [ItemType.SEO]: { type: ItemType.SEO, label: 'SEO Campaign', icon: '🔍', customers: 25, color: BRAND_DARK, textColor: '#fff', isPositive: true },
  [ItemType.ADS]: { type: ItemType.ADS, label: 'Online Ads', icon: '📢', customers: 25, color: BRAND_CYAN, textColor: '#fff', isPositive: true },
  [ItemType.WEBSITE]: { type: ItemType.WEBSITE, label: 'New Website', icon: '💻', customers: 25, color: BRAND_DARK, textColor: '#fff', isPositive: true },
  [ItemType.BRANDING]: { type: ItemType.BRANDING, label: 'Identity', icon: '✨', customers: 25, color: BRAND_CYAN, textColor: '#fff', isPositive: true },
  [ItemType.EMAIL]: { type: ItemType.EMAIL, label: 'Email Blast', icon: '📧', customers: 25, color: BRAND_DARK, textColor: '#fff', isPositive: true },
  
  // Negatives
  [ItemType.DIY_DISASTER]: { type: ItemType.DIY_DISASTER, label: 'Bad DIY', icon: '🔨', customers: -10, color: '#ef4444', textColor: '#fff', isPositive: false },
  [ItemType.BUDGET_CUT]: { type: ItemType.BUDGET_CUT, label: 'Budget Cut', icon: '✂️', customers: 0, color: '#991b1b', textColor: '#fff', isPositive: false },
  [ItemType.COMPETITOR]: { type: ItemType.COMPETITOR, label: 'Competitor', icon: '📉', customers: -15, color: '#475569', textColor: '#fff', isPositive: false },
};

export const POSITIVE_ITEMS = Object.values(ITEM_CONFIGS).filter(i => i.isPositive);
export const NEGATIVE_ITEMS = Object.values(ITEM_CONFIGS).filter(i => !i.isPositive);

// Adjusted for 30s gameplay - FASTER SPEED
export const DIFFICULTY_TIERS = [
  { time: 0, spawnRate: 50, speedMult: 9.0 },
  { time: 10, spawnRate: 40, speedMult: 11.0 },
  { time: 20, spawnRate: 25, speedMult: 13.0 },
];