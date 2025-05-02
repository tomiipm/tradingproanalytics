// Signal types
export type Currency = 
  // Major forex currencies
  'EUR' | 'GBP' | 'JPY' | 'AUD' | 'CAD' | 'CHF' | 'NZD' | 'USD' | 
  // Minor forex currencies
  'SEK' | 'NOK' | 'DKK' | 'SGD' | 'HKD' | 'MXN' | 'ZAR' | 'TRY' | 
  'PLN' | 'HUF' | 'CZK' | 'ILS' | 'THB' | 'IDR' | 'MYR' | 'PHP' | 
  'INR' | 'BRL' | 'RUB' | 'CNH' | 'KRW' | 'TWD' | 'XAU' |
  // Cryptocurrencies
  'BTC' | 'ETH' | 'USDT' | 'SOL' | 'XRP' | 'ADA' | 'DOT' | 'DOGE' |
  'AVAX' | 'LINK' | 'MATIC' | 'UNI' | 'ATOM' | 'LTC' | 'BCH' | 'ALGO' |
  'FIL' | 'XLM' | 'NEAR' | 'ICP' | 'AAVE' | 'XTZ' | 'EOS' | 'SAND' |
  'MANA' | 'AXS' | 'SHIB' | 'CRO' | 'EGLD' | 'HBAR' | 'VET' | 'THETA';

export type TimeFrame = '15M' | '1H' | '4H' | '1D' | '1W';
export type SignalType = 'BUY' | 'SELL' | 'NEUTRAL';
export type SignalStrength = 'STRONG' | 'MODERATE' | 'WEAK';
export type SignalStatus = 'ACTIVE' | 'EXPIRED' | 'COMPLETED' | 'STOPPED';
export type SignalResult = 'TARGET_REACHED' | 'STOPPED_OUT' | undefined;
export type NotificationType = 'NEW_SIGNAL' | 'SIGNAL_UPDATE' | 'PRICE_ALERT' | 'EDUCATIONAL';
export type StrategyType = 
  'TREND_FOLLOWING' | 
  'MEAN_REVERSION' | 
  'BREAKOUT' | 
  'SUPPORT_RESISTANCE' | 
  'MOMENTUM' | 
  'VOLATILITY_BASED' | 
  'FIBONACCI_BASED' | 
  'HARMONIC_PATTERN' | 
  'ICHIMOKU_CLOUD' | 
  'ELLIOTT_WAVE';

export type StrategyComplexity = 'LOW' | 'MEDIUM' | 'HIGH';

export interface AIStrategy {
  type: StrategyType;
  description: string;
  entryRules: string[];
  exitRules: string[];
  riskManagementRules: string[];
  recommendedTimeframes: string[];
  indicators: string[];
  successRate: number;
  riskRewardRatio: string;
  complexity: StrategyComplexity;
}

export interface Signal {
  id: string;
  pair: string;
  type: SignalType;
  strength: SignalStrength;
  entryPrice: number;
  stopLoss: number;
  takeProfit1: number;
  takeProfit2: number | null;
  takeProfit3: number | null;
  timeFrame: TimeFrame;
  timestamp: Date;
  expiresAt: Date;
  confidence: number;
  rationale: string;
  status: 'ACTIVE' | 'EXPIRED' | 'COMPLETED' | 'STOPPED';
  result?: {
    successful: boolean;
    pips: number;
  };
  isPremium: boolean;
  isCrypto?: boolean;
  isIndex?: boolean;
  isCommodity?: boolean;
  aiStrategy?: AIStrategy;
}

// AI Analysis types
export type Sentiment = 'BULLISH' | 'BEARISH' | 'NEUTRAL';
export type Impact = 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type Direction = 'UP' | 'DOWN' | 'SIDEWAYS';

export interface PricePrediction {
  timeframe: string;
  price: number;
  probability: number;
}

export interface ChartDataPoint {
  x: number;
  y: number;
}

export interface ChartData {
  timestamps: number[];
  prices: number[];
  volumes?: number[];
  predictions?: number[];
}

export interface AIAnalysis {
  id: string;
  pair: string;
  timeFrame: TimeFrame;
  timestamp: string;
  summary: string;
  sentiment: Sentiment;
  confidenceScore: number;
  keyLevels: {
    support: number[];
    resistance: number[];
  };
  technicalIndicators: {
    name: string;
    value: string;
    signal: string;
  }[];
  fundamentalFactors: {
    factor: string;
    impact: Impact;
    description: string;
  }[];
  prediction: {
    direction: Direction;
    targetPrice: number | null;
    timeframe: string;
    probability: number;
    futurePriceLevels?: PricePrediction[]; // Added for detailed future price predictions
  };
  riskAssessment: {
    level: RiskLevel;
    factors: string[];
  };
  isPremium: boolean;
  isCrypto?: boolean; // Flag to identify crypto pairs for UI display
  isIndex?: boolean; // Flag to identify index pairs like US30, SP500
  isCommodity?: boolean; // Flag to identify commodities like XAU
  chartData?: ChartData; // Added for chart visualization
  aiStrategy?: AIStrategy; // Added for AI strategy recommendations
}

// Education types
export type EducationCategory = 'BASICS' | 'TECHNICAL' | 'FUNDAMENTAL' | 'PSYCHOLOGY' | 'RISK_MANAGEMENT';
export type EducationLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export interface EducationContent {
  id: string;
  title: string;
  description: string;
  content: string;
  category: EducationCategory;
  level: EducationLevel;
  duration: number;
  imageUrl: string;
  readingTimeMinutes: number;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

// Notification types
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  data: any;
}

// Crypto types
export interface CryptoPair {
  base: string;
  quote: string;
  fullName: string;
  isPremium: boolean;
}