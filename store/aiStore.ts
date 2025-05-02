import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AIAnalysis, TimeFrame, Sentiment, PricePrediction, Impact, Direction, RiskLevel, StrategyType, StrategyComplexity } from '@/types';
import { mockAnalyses } from '@/utils/mockData';
import { fetchAnalysis } from '@/utils/api';

interface AIState {
  analyses: AIAnalysis[];
  isGenerating: boolean;
  error: string | null;
  
  // Actions
  generateAnalysis: (pair: string, timeFrame: TimeFrame) => Promise<AIAnalysis | null>;
  fetchAnalyses: () => Promise<void>;
  getAnalysisById: (id: string) => AIAnalysis | undefined;
  clearAnalyses: () => void;
}

// Import userStore directly, don't use the hook inside the store creation
import { useUserStore } from '@/store/userStore';

export const useAIStore = create<AIState>()(
  persist(
    (set, get) => ({
      analyses: [],
      isGenerating: false,
      error: null,
      
      generateAnalysis: async (pair: string, timeFrame: TimeFrame) => {
        set((state) => ({ 
          isGenerating: true,
          error: null
        }));
        
        try {
          // Check if analysis for this pair and timeframe already exists
          const existingAnalysis = get().analyses.find(
            analysis => analysis.pair === pair && analysis.timeFrame === timeFrame
          );
          
          if (existingAnalysis) {
            // If it exists, just return it without generating a new one
            set({ isGenerating: false });
            return existingAnalysis;
          }
          
          // Validate the pair format
          if (!pair.includes('/')) {
            set({ 
              isGenerating: false,
              error: `Invalid currency pair format: ${pair}. Expected format: XXX/YYY`
            });
            return null;
          }
          
          // Split the pair to get base and quote currencies
          const [baseCurrency, quoteCurrency] = pair.split('/');
          
          // Skip invalid pairs - explicitly check for same currency
          if (baseCurrency === quoteCurrency) {
            set({ 
              isGenerating: false,
              error: `Invalid currency pair: ${pair}. Base and quote currencies must be different.`
            });
            return null;
          }
          
          // Validate that both parts are actual currencies (not timeframes or other values)
          const validCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'NZD', 'SEK', 'NOK', 'DKK',
                                  'SGD', 'HKD', 'MXN', 'ZAR', 'TRY', 'PLN', 'HUF', 'CZK', 'ILS', 'THB',
                                  'IDR', 'MYR', 'PHP', 'INR', 'BRL', 'RUB', 'CNH', 'KRW', 'TWD', 'XAU',
                                  'BTC', 'ETH', 'SOL', 'XRP', 'ADA', 'DOT', 'DOGE', 'AVAX', 'LINK', 'MATIC',
                                  'UNI', 'ATOM', 'LTC', 'BCH', 'ALGO', 'FIL', 'XLM', 'NEAR', 'ICP', 'AAVE',
                                  'XTZ', 'EOS', 'SAND', 'MANA', 'US30', 'SP500'];
          
          // Check if base currency is valid
          if (!validCurrencies.includes(baseCurrency)) {
            set({ 
              isGenerating: false,
              error: `Invalid base currency: ${baseCurrency}. Must be a valid currency code.`
            });
            return null;
          }
          
          // Check if quote currency is valid
          if (!validCurrencies.includes(quoteCurrency)) {
            set({ 
              isGenerating: false,
              error: `Invalid quote currency: ${quoteCurrency}. Must be a valid currency code.`
            });
            return null;
          }
          
          // Check if base currency is a timeframe (common error)
          const validTimeframes = ['15M', '1H', '4H', '1D', '1W'];
          if (validTimeframes.includes(baseCurrency)) {
            set({ 
              isGenerating: false,
              error: `Invalid base currency: ${baseCurrency} is a timeframe, not a currency.`
            });
            return null;
          }
          
          // Check if quote currency is a timeframe (common error)
          if (validTimeframes.includes(quoteCurrency)) {
            set({ 
              isGenerating: false,
              error: `Invalid quote currency: ${quoteCurrency} is a timeframe, not a currency.`
            });
            return null;
          }
          
          try {
            // Get the premium status from userStore directly
            const userStore = useUserStore.getState();
            const isPremiumUser = userStore.isPremium;
            
            // Fetch real analysis data
            const analysis = await fetchAnalysis(baseCurrency, timeFrame, isPremiumUser);
            
            set((state) => ({
              analyses: [analysis, ...state.analyses],
              isGenerating: false
            }));
            
            return analysis;
          } catch (error: any) {
            // If the error is about subscription, we should show that specific error
            if (error.message && error.message.includes('Subscription required')) {
              set({ 
                error: 'Subscription required for this analysis',
                isGenerating: false 
              });
            } else {
              set({ 
                error: `Failed to generate analysis: ${error.message}`,
                isGenerating: false 
              });
            }
            return null;
          }
        } catch (error: any) {
          console.error('Error generating analysis:', error);
          set({ 
            error: `Failed to generate analysis: ${error.message}`,
            isGenerating: false 
          });
          return null;
        }
      },
      
      fetchAnalyses: async () => {
        set({ isGenerating: true, error: null });
        
        try {
          // In a real app, we would fetch analyses from an API
          // For now, we'll use mock data, but filter out non-forex
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Filter out non-forex analyses from mock data
          const filteredAnalyses = mockAnalyses.filter(analysis => 
            !analysis.isCrypto && !analysis.isIndex && !analysis.isCommodity && analysis.pair !== "USD/USD"
          );
          
          // Generate some valid forex pairs
          const validForexPairs = [
            'EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD', 
            'EUR/GBP', 'USD/CHF', 'NZD/USD', 'EUR/JPY', 'GBP/JPY'
          ];
          
          // Create additional analyses with valid forex pairs
          const additionalAnalyses = [];
          for (let i = 0; i < 10; i++) {
            const randomPair = validForexPairs[Math.floor(Math.random() * validForexPairs.length)];
            const [baseCurrency] = randomPair.split('/');
            
            // Skip if the base currency is USD and we're trying to create USD/USD
            if (baseCurrency === 'USD' && randomPair === 'USD/USD') {
              continue;
            }
            
            const timeFrame = ['15M', '1H', '4H', '1D'][Math.floor(Math.random() * 4)] as TimeFrame;
            additionalAnalyses.push(generateMockAnalysis(baseCurrency, timeFrame));
          }
          
          set({ 
            analyses: [...filteredAnalyses, ...additionalAnalyses],
            isGenerating: false 
          });
        } catch (error) {
          set({ 
            error: 'Failed to fetch analyses',
            isGenerating: false 
          });
        }
      },
      
      getAnalysisById: (id: string) => {
        return get().analyses.find((analysis) => analysis.id === id);
      },
      
      clearAnalyses: () => {
        set({ analyses: [] });
      }
    }),
    {
      name: 'ai-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        analyses: state.analyses
      })
    }
  )
);

// Helper function to generate mock analysis
function generateMockAnalysis(currency: string, timeFrame: TimeFrame): AIAnalysis {
  // Format the pair - ensure we're not creating USD/USD
  let pair;
  if (currency === 'USD') {
    pair = 'USD/JPY'; // If currency is USD, pair it with JPY instead of itself
  } else {
    pair = `${currency}/USD`;
  }
  
  // Generate base price based on the currency
  let basePrice = 1.0;
  if (currency === 'EUR') basePrice = 1.08;
  else if (currency === 'GBP') basePrice = 1.27;
  else if (currency === 'JPY') basePrice = 155.0; // JPY is quoted differently
  else if (currency === 'AUD') basePrice = 0.66;
  else if (currency === 'CAD') basePrice = 1.36; // USD/CAD
  else if (currency === 'CHF') basePrice = 0.91; // USD/CHF
  else if (currency === 'NZD') basePrice = 0.61;
  
  // Generate random sentiment
  const sentimentOptions: Sentiment[] = ['BULLISH', 'BEARISH', 'NEUTRAL'];
  const sentiment = sentimentOptions[Math.floor(Math.random() * sentimentOptions.length)];
  
  // Generate confidence score based on sentiment
  const confidenceScore = Math.floor(Math.random() * 30) + 65; // 65-95
  
  // Generate key levels
  const supportLevels: number[] = [];
  const resistanceLevels: number[] = [];
  
  // Add 2-3 support levels
  const supportCount = Math.floor(Math.random() * 2) + 2;
  for (let i = 0; i < supportCount; i++) {
    supportLevels.push(basePrice * (1 - (0.01 + i * 0.01) - Math.random() * 0.005));
  }
  
  // Add 2-3 resistance levels
  const resistanceCount = Math.floor(Math.random() * 2) + 2;
  for (let i = 0; i < resistanceCount; i++) {
    resistanceLevels.push(basePrice * (1 + (0.01 + i * 0.01) + Math.random() * 0.005));
  }
  
  // Sort levels
  supportLevels.sort((a, b) => b - a);
  resistanceLevels.sort((a, b) => a - b);
  
  // Generate technical indicators
  const technicalIndicators = [
    {
      name: 'RSI (14)',
      value: `${Math.floor(Math.random() * 100)}`,
      signal: sentiment === 'BULLISH' ? 'BUY' : sentiment === 'BEARISH' ? 'SELL' : 'NEUTRAL'
    },
    {
      name: 'MACD (12,26,9)',
      value: `${(Math.random() * 0.2 - 0.1).toFixed(4)}`,
      signal: sentiment === 'BULLISH' ? 'BUY' : sentiment === 'BEARISH' ? 'SELL' : 'NEUTRAL'
    },
    {
      name: 'Moving Average (50)',
      value: `${(basePrice * (1 + (Math.random() * 0.02 - 0.01))).toFixed(4)}`,
      signal: sentiment === 'BULLISH' ? 'BUY' : sentiment === 'BEARISH' ? 'SELL' : 'NEUTRAL'
    },
    {
      name: 'Bollinger Bands',
      value: 'Middle Band',
      signal: sentiment === 'BULLISH' ? 'BUY' : sentiment === 'BEARISH' ? 'SELL' : 'NEUTRAL'
    },
    {
      name: 'Stochastic Oscillator',
      value: `${Math.floor(Math.random() * 100)}`,
      signal: sentiment === 'BULLISH' ? 'BUY' : sentiment === 'BEARISH' ? 'SELL' : 'NEUTRAL'
    }
  ];
  
  // Generate fundamental factors
  const fundamentalFactors: {
    factor: string;
    impact: Impact;
    description: string;
  }[] = [];
  
  // Add 2-4 fundamental factors
  const factorCount = Math.floor(Math.random() * 3) + 2;
  const factorTypes = [
    {
      factor: 'Interest Rate Differential',
      impact: sentiment === 'BULLISH' ? 'POSITIVE' as Impact : sentiment === 'BEARISH' ? 'NEGATIVE' as Impact : 'NEUTRAL' as Impact,
      description: `The interest rate differential between the ${currency} and USD is ${sentiment === 'BULLISH' ? 'widening' : sentiment === 'BEARISH' ? 'narrowing' : 'stable'}, which is ${sentiment === 'BULLISH' ? 'positive' : sentiment === 'BEARISH' ? 'negative' : 'neutral'} for the currency pair.`
    },
    {
      factor: 'Economic Growth',
      impact: sentiment === 'BULLISH' ? 'POSITIVE' as Impact : sentiment === 'BEARISH' ? 'NEGATIVE' as Impact : 'NEUTRAL' as Impact,
      description: `Recent economic data shows ${sentiment === 'BULLISH' ? 'stronger' : sentiment === 'BEARISH' ? 'weaker' : 'stable'} growth in the ${currency} economy compared to expectations.`
    },
    {
      factor: 'Inflation Data',
      impact: sentiment === 'BULLISH' ? 'POSITIVE' as Impact : sentiment === 'BEARISH' ? 'NEGATIVE' as Impact : 'NEUTRAL' as Impact,
      description: `Inflation in the ${currency} region is ${sentiment === 'BULLISH' ? 'moderating' : sentiment === 'BEARISH' ? 'accelerating' : 'stable'}, which is ${sentiment === 'BULLISH' ? 'positive' : sentiment === 'BEARISH' ? 'negative' : 'neutral'} for monetary policy outlook.`
    },
    {
      factor: 'Central Bank Policy',
      impact: sentiment === 'BULLISH' ? 'POSITIVE' as Impact : sentiment === 'BEARISH' ? 'NEGATIVE' as Impact : 'NEUTRAL' as Impact,
      description: `The central bank has signaled a ${sentiment === 'BULLISH' ? 'hawkish' : sentiment === 'BEARISH' ? 'dovish' : 'neutral'} stance in recent communications.`
    },
    {
      factor: 'Trade Balance',
      impact: sentiment === 'BULLISH' ? 'POSITIVE' as Impact : sentiment === 'BEARISH' ? 'NEGATIVE' as Impact : 'NEUTRAL' as Impact,
      description: `The trade balance for ${currency} has ${sentiment === 'BULLISH' ? 'improved' : sentiment === 'BEARISH' ? 'deteriorated' : 'remained stable'} in recent months.`
    },
    {
      factor: 'Political Stability',
      impact: sentiment === 'BULLISH' ? 'POSITIVE' as Impact : sentiment === 'BEARISH' ? 'NEGATIVE' as Impact : 'NEUTRAL' as Impact,
      description: `The political environment in the ${currency} region is ${sentiment === 'BULLISH' ? 'stable' : sentiment === 'BEARISH' ? 'uncertain' : 'unchanged'}, affecting investor confidence.`
    }
  ];
  
  // Select random factors
  for (let i = 0; i < factorCount; i++) {
    const randomIndex = Math.floor(Math.random() * factorTypes.length);
    fundamentalFactors.push(factorTypes[randomIndex]);
    factorTypes.splice(randomIndex, 1);
  }
  
  // Generate prediction
  const directionOptions: Direction[] = ['UP', 'DOWN', 'SIDEWAYS'];
  const direction = sentiment === 'BULLISH' ? 'UP' : sentiment === 'BEARISH' ? 'DOWN' : 'SIDEWAYS';
  
  // Generate target price based on direction
  const targetPrice = direction === 'UP' 
    ? basePrice * (1 + (0.02 + Math.random() * 0.03))
    : direction === 'DOWN'
      ? basePrice * (1 - (0.02 + Math.random() * 0.03))
      : null;
  
  // Generate probability based on confidence
  const probability = confidenceScore;
  
  // Generate future price levels
  const futurePriceLevels: {
    timeframe: string;
    price: number;
    probability: number;
  }[] = [];
  
  if (direction !== 'SIDEWAYS') {
    // Add 3 future price predictions
    futurePriceLevels.push({
      timeframe: '1 Day',
      price: direction === 'UP' 
        ? basePrice * (1 + (0.005 + Math.random() * 0.01))
        : basePrice * (1 - (0.005 + Math.random() * 0.01)),
      probability: Math.min(probability + 10, 95)
    });
    
    futurePriceLevels.push({
      timeframe: '1 Week',
      price: direction === 'UP' 
        ? basePrice * (1 + (0.01 + Math.random() * 0.02))
        : basePrice * (1 - (0.01 + Math.random() * 0.02)),
      probability: probability
    });
    
    futurePriceLevels.push({
      timeframe: '1 Month',
      price: direction === 'UP' 
        ? basePrice * (1 + (0.02 + Math.random() * 0.03))
        : basePrice * (1 - (0.02 + Math.random() * 0.03)),
      probability: Math.max(probability - 10, 55)
    });
  }
  
  // Generate risk assessment
  const riskLevelOptions: RiskLevel[] = ['LOW', 'MEDIUM', 'HIGH'];
  const riskLevel = riskLevelOptions[Math.floor(Math.random() * riskLevelOptions.length)];
  
  const riskFactors: string[] = [];
  const possibleRiskFactors = [
    'Upcoming economic data releases',
    'Central bank policy uncertainty',
    'Geopolitical tensions',
    'Market volatility',
    'Liquidity conditions',
    'Technical resistance levels',
    'Overbought/oversold conditions',
    'Correlation with other markets',
    'Seasonal patterns'
  ];
  
  // Add 2-4 risk factors
  const riskFactorCount = Math.floor(Math.random() * 3) + 2;
  for (let i = 0; i < riskFactorCount; i++) {
    const randomIndex = Math.floor(Math.random() * possibleRiskFactors.length);
    riskFactors.push(possibleRiskFactors[randomIndex]);
    possibleRiskFactors.splice(randomIndex, 1);
  }
  
  // Generate chart data
  const chartData: {
    timestamps: number[];
    prices: number[];
    volumes: number[];
    predictions: number[];
  } = {
    timestamps: [],
    prices: [],
    volumes: [],
    predictions: []
  };
  
  // Generate 30 data points for the chart
  const now = new Date();
  let currentPrice = basePrice;
  
  for (let i = 0; i < 30; i++) {
    // Generate timestamp (going back in time)
    const timestamp = now.getTime() - (29 - i) * 3600000; // Hourly data
    chartData.timestamps.push(timestamp);
    
    // Generate price with some randomness but following the trend
    if (i > 0) {
      const trend = direction === 'UP' ? 0.001 : direction === 'DOWN' ? -0.001 : 0;
      const randomness = (Math.random() * 0.004) - 0.002;
      currentPrice = currentPrice * (1 + trend + randomness);
    }
    
    chartData.prices.push(currentPrice);
    
    // Generate volume
    chartData.volumes.push(Math.random() * 1000 + 500);
  }
  
  // Generate predictions for the next 5 data points
  let predictionPrice = currentPrice;
  
  for (let i = 0; i < 5; i++) {
    const trend = direction === 'UP' ? 0.002 : direction === 'DOWN' ? -0.002 : 0;
    const randomness = (Math.random() * 0.002) - 0.001;
    predictionPrice = predictionPrice * (1 + trend + randomness);
    chartData.predictions.push(predictionPrice);
  }
  
  // Generate AI strategy
  const strategyTypes: StrategyType[] = [
    'TREND_FOLLOWING', 
    'MEAN_REVERSION', 
    'BREAKOUT', 
    'SUPPORT_RESISTANCE',
    'MOMENTUM',
    'VOLATILITY_BASED',
    'FIBONACCI_BASED',
    'HARMONIC_PATTERN',
    'ICHIMOKU_CLOUD',
    'ELLIOTT_WAVE'
  ];
  
  // Select strategy type based on sentiment
  let strategyType: StrategyType;
  
  if (sentiment === 'BULLISH') {
    // For bullish sentiment, prefer trend following or breakout strategies
    strategyType = Math.random() > 0.5 ? 'TREND_FOLLOWING' : 'BREAKOUT';
  } else if (sentiment === 'BEARISH') {
    // For bearish sentiment, prefer mean reversion or support/resistance strategies
    strategyType = Math.random() > 0.5 ? 'MEAN_REVERSION' : 'SUPPORT_RESISTANCE';
  } else {
    // For neutral sentiment, prefer range-bound strategies
    strategyType = Math.random() > 0.5 ? 'SUPPORT_RESISTANCE' : 'FIBONACCI_BASED';
  }
  
  const aiStrategy = {
    type: strategyType,
    description: "This strategy aims to identify key market levels and trade based on price reactions at these levels.",
    entryRules: [
      "Enter when price bounces off a strong support level",
      "Confirm with bullish candlestick pattern",
      "Ensure volume increases on the bounce"
    ],
    exitRules: [
      "Exit when price approaches the next resistance level",
      "Use trailing stop once in profit",
      "Take partial profits at first target"
    ],
    riskManagementRules: [
      "Risk no more than 1-2% of account per trade",
      "Use proper position sizing based on stop loss distance",
      "Move stop loss to breakeven after price moves 1:1 risk-reward in your favor"
    ],
    recommendedTimeframes: ["1H", "4H", "1D"],
    indicators: ["Support/Resistance Levels", "Volume", "Candlestick Patterns", "Fibonacci Retracements"],
    successRate: Math.floor(Math.random() * 20) + 60, // 60-80%
    riskRewardRatio: (1 + Math.random() * 2).toFixed(1), // 1.0-3.0
    complexity: "MEDIUM" as StrategyComplexity
  };
  
  // Generate summary
  let summary = '';
  
  if (sentiment === 'BULLISH') {
    summary = `The analysis indicates a bullish outlook for ${pair} on the ${timeFrame} timeframe. Technical indicators are showing positive momentum, with support at ${supportLevels[0].toFixed(4)}. The price is expected to move towards ${targetPrice?.toFixed(4)} in the coming ${timeFrame === '1D' ? 'days' : timeFrame === '4H' ? 'sessions' : 'hours'}.`;
  } else if (sentiment === 'BEARISH') {
    summary = `The analysis indicates a bearish outlook for ${pair} on the ${timeFrame} timeframe. Technical indicators are showing negative momentum, with resistance at ${resistanceLevels[0].toFixed(4)}. The price is expected to move towards ${targetPrice?.toFixed(4)} in the coming ${timeFrame === '1D' ? 'days' : timeFrame === '4H' ? 'sessions' : 'hours'}.`;
  } else {
    summary = `The analysis indicates a neutral outlook for ${pair} on the ${timeFrame} timeframe. Technical indicators are showing mixed signals, with the price likely to remain range-bound between support at ${supportLevels[0].toFixed(4)} and resistance at ${resistanceLevels[0].toFixed(4)}.`;
  }
  
  // Create analysis object
  return {
    id: `analysis-${Math.random().toString(36).substring(2, 9)}`,
    pair,
    timeFrame,
    timestamp: new Date().toISOString(),
    summary,
    sentiment,
    confidenceScore,
    keyLevels: {
      support: supportLevels,
      resistance: resistanceLevels
    },
    technicalIndicators,
    fundamentalFactors,
    prediction: {
      direction,
      targetPrice,
      timeframe: timeFrame === '1D' ? '1-2 weeks' : timeFrame === '4H' ? '2-3 days' : '12-24 hours',
      probability,
      futurePriceLevels
    },
    riskAssessment: {
      level: riskLevel,
      factors: riskFactors
    },
    isPremium: false, // All forex pairs are free
    isCrypto: false,  // Not crypto
    isIndex: false,   // Not index
    isCommodity: false, // Not commodity
    chartData,
    aiStrategy
  };
}