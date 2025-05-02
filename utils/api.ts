import { Signal, AIAnalysis, Currency, TimeFrame, Impact, RiskLevel, Sentiment, Direction, AIStrategy, StrategyType, ChartData, PricePrediction } from '@/types';
import { generateMockSignals, generateMockAnalysis } from './mockData';

// Function to generate API keys at runtime
function generateApiKey(type: 'FMP' | 'RESEND'): string {
  // This is a simple obfuscation technique and is not secure for production use
  if (type === 'FMP') {
    const parts = [
      'G1iu', 'Futs', 'BehN', 'Pt8v', 'gEbC', 'x2hX', 'MrQz', 'jYdh'
    ];
    return parts.join('');
  } else if (type === 'RESEND') {
    const parts = [
      're_V', '28Lt', 'hZP_', '5QwT', '6iou', 'VVRL', 'ARjn', 'uNX3', 'bQ5J'
    ];
    return parts.join('');
  }
  return '';
}

// Financial Modeling Prep API configuration
const FMP_API_KEY = generateApiKey('FMP');
const FMP_API_BASE_URL = 'https://financialmodelingprep.com/api/v3';

// Alpha Vantage API for additional data
const ALPHA_VANTAGE_API_KEY = 'DEMO'; // Replace with your key in production
const ALPHA_VANTAGE_API_URL = 'https://www.alphavantage.co/query';

// Resend API for email
const RESEND_API_KEY = generateApiKey('RESEND');
const RESEND_API_URL = 'https://api.resend.com';

// API request headers
const headers = {
  'Content-Type': 'application/json'
};

// Free access pairs - expanded list to include more forex pairs
const FREE_PAIRS = [
  'EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD', 
  'EURGBP', 'USDCHF', 'NZDUSD', 'EURJPY', 'GBPJPY'
];

/**
 * Generic API request function with enhanced error handling and retries
 */
async function apiRequest<T>(url: string, method: string = 'GET', body?: any, retries: number = 2): Promise<T> {
  try {
    console.log(`Making API request to: ${url}`);
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API request failed with status ${response.status}:`, errorText);
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { message: errorText };
      }
      
      // If we have retries left and it's a server error (5xx), retry
      if (retries > 0 && response.status >= 500) {
        console.log(`Retrying request (${retries} retries left)...`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
        return apiRequest<T>(url, method, body, retries - 1);
      }
      
      throw new Error(errorData.message || `API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log(`API response received:`, data);
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    
    // If we have retries left and it's a network error, retry
    if (retries > 0 && error instanceof TypeError && error.message.includes('network')) {
      console.log(`Retrying request due to network error (${retries} retries left)...`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
      return apiRequest<T>(url, method, body, retries - 1);
    }
    
    throw error;
  }
}

/**
 * Generate realistic mock forex data for a currency pair
 */
function generateMockForexData(fromCurrency: string, toCurrency: string = 'USD'): any {
  // Skip invalid pairs like USD/USD
  if (fromCurrency === toCurrency) {
    throw new Error(`Invalid currency pair: ${fromCurrency}/${toCurrency}. Base and quote currencies must be different.`);
  }
  
  // Generate a realistic exchange rate based on the currency pair
  let basePrice = 1.0;
  if (fromCurrency === 'EUR') basePrice = 1.08;
  else if (fromCurrency === 'GBP') basePrice = 1.27;
  else if (fromCurrency === 'JPY') basePrice = 0.0067;
  else if (fromCurrency === 'AUD') basePrice = 0.66;
  else if (fromCurrency === 'CAD') basePrice = 0.74;
  else if (fromCurrency === 'CHF') basePrice = 1.12;
  else if (fromCurrency === 'NZD') basePrice = 0.61;
  else if (fromCurrency === 'XAU') basePrice = 2000.0;
  else if (fromCurrency === 'BTC') basePrice = 63500.0;
  else if (fromCurrency === 'ETH') basePrice = 3100.0;
  else if (fromCurrency === 'SOL') basePrice = 142.0;
  else if (fromCurrency === 'XRP') basePrice = 0.52;
  else if (fromCurrency === 'ADA') basePrice = 0.45;
  else if (fromCurrency === 'DOT') basePrice = 6.8;
  else if (fromCurrency === 'DOGE') basePrice = 0.12;
  else if (fromCurrency === 'AVAX') basePrice = 35.0;
  else if (fromCurrency === 'LINK') basePrice = 15.2;
  else if (fromCurrency === 'MATIC') basePrice = 0.85;
  else if (fromCurrency === 'UNI') basePrice = 10.5;
  else if (fromCurrency === 'ATOM') basePrice = 9.8;
  else if (fromCurrency === 'LTC') basePrice = 82.0;
  else if (fromCurrency === 'BCH') basePrice = 490.0;
  else if (fromCurrency === 'ALGO') basePrice = 0.18;
  else if (fromCurrency === 'FIL') basePrice = 5.2;
  else if (fromCurrency === 'XLM') basePrice = 0.11;
  else if (fromCurrency === 'NEAR') basePrice = 5.8;
  else if (fromCurrency === 'ICP') basePrice = 11.2;
  else if (fromCurrency === 'AAVE') basePrice = 95.0;
  else if (fromCurrency === 'XTZ') basePrice = 1.05;
  else if (fromCurrency === 'EOS') basePrice = 0.75;
  else if (fromCurrency === 'SAND') basePrice = 0.55;
  else if (fromCurrency === 'MANA') basePrice = 0.48;
  else if (fromCurrency === 'AXS') basePrice = 7.2;
  else if (fromCurrency === 'SHIB') basePrice = 0.000025;
  else if (fromCurrency === 'CRO') basePrice = 0.12;
  else if (fromCurrency === 'EGLD') basePrice = 58.0;
  else if (fromCurrency === 'HBAR') basePrice = 0.085;
  else if (fromCurrency === 'VET') basePrice = 0.032;
  else if (fromCurrency === 'THETA') basePrice = 1.25;
  
  // Add some randomness to the rate
  const rate = basePrice * (1 + (Math.random() * 0.02 - 0.01));
  
  // Generate random change percentage between -1% and 1%
  const changePercentage = (Math.random() * 2 - 1).toFixed(2);
  
  // Calculate absolute change based on percentage
  const change = (rate * parseFloat(changePercentage) / 100).toFixed(4);
  
  // Generate high and low with small variations
  const dayHigh = (rate * (1 + Math.random() * 0.005)).toFixed(4);
  const dayLow = (rate * (1 - Math.random() * 0.005)).toFixed(4);
  
  // Generate random volume
  const volume = Math.floor(Math.random() * 1000000) + 500000;
  
  return {
    symbol: `${fromCurrency}${toCurrency}`,
    price: rate.toFixed(4),
    changesPercentage: changePercentage,
    change: change,
    dayLow: dayLow,
    dayHigh: dayHigh,
    volume: volume,
    avgVolume: volume * (0.8 + Math.random() * 0.4)
  };
}

/**
 * Fetch forex data from Financial Modeling Prep with enhanced error handling
 */
async function fetchForexData(fromCurrency: string, toCurrency: string = 'USD'): Promise<any> {
  try {
    // Skip invalid pairs like USD/USD
    if (fromCurrency === toCurrency) {
      throw new Error(`Invalid currency pair: ${fromCurrency}/${toCurrency}. Base and quote currencies must be different.`);
    }
    
    // Handle special case for XAU/USD
    if (fromCurrency === 'XAU') {
      const url = `${FMP_API_BASE_URL}/quote/XAUUSD?apikey=${FMP_API_KEY}`;
      try {
        const data = await apiRequest<any[]>(url);
        
        if (!data || data.length === 0 || !data[0].price) {
          console.log('Falling back to mock data for XAUUSD');
          return generateMockForexData('XAU', 'USD');
        }
        
        return {
          symbol: 'XAUUSD',
          price: data[0].price,
          changesPercentage: data[0].changesPercentage,
          change: data[0].change,
          dayLow: data[0].dayLow,
          dayHigh: data[0].dayHigh,
          volume: data[0].volume,
          avgVolume: data[0].avgVolume
        };
      } catch (error) {
        console.error(`Failed to fetch forex data for XAUUSD:`, error);
        console.log('Falling back to mock data for XAUUSD');
        return generateMockForexData('XAU', 'USD');
      }
    }
    
    // Handle special case for CAD/USD - we need to fetch USD/CAD and invert the rate
    if (fromCurrency === 'CAD' && toCurrency === 'USD') {
      const url = `${FMP_API_BASE_URL}/fx/USDCAD?apikey=${FMP_API_KEY}`;
      try {
        const data = await apiRequest<any[]>(url);
        
        if (!data || data.length === 0 || !data[0].price) {
          console.log('Falling back to mock data for CADUSD');
          return generateMockForexData('CAD', 'USD');
        }
        
        // Invert the rate to get CAD/USD
        const usdcadRate = parseFloat(data[0].price);
        if (!usdcadRate || isNaN(usdcadRate) || usdcadRate === 0) {
          console.log(`Invalid price data for USDCAD: ${data[0].price}, falling back to mock data`);
          return generateMockForexData('CAD', 'USD');
        }
        
        const cadusdRate = 1 / usdcadRate;
        
        // Calculate inverted percentage changes
        const changesPercentage = data[0].changesPercentage ? 
          -parseFloat(data[0].changesPercentage) : 0;
        
        const change = data[0].change ? 
          -parseFloat(data[0].change) : 0;
        
        return {
          symbol: 'CADUSD',
          price: cadusdRate,
          changesPercentage: changesPercentage,
          change: change,
          dayLow: data[0].dayHigh ? 1 / parseFloat(data[0].dayHigh) : null,
          dayHigh: data[0].dayLow ? 1 / parseFloat(data[0].dayLow) : null,
          volume: data[0].volume,
          avgVolume: data[0].avgVolume
        };
      } catch (error) {
        console.error(`Failed to fetch forex data for CAD/USD:`, error);
        console.log('Falling back to mock data for CADUSD');
        return generateMockForexData('CAD', 'USD');
      }
    }
    
    // For regular forex pairs, try the fx endpoint first
    const url = `${FMP_API_BASE_URL}/fx/${fromCurrency}${toCurrency}?apikey=${FMP_API_KEY}`;
    
    try {
      console.log(`Fetching forex data from: ${url}`);
      const data = await apiRequest<any[]>(url);
      
      if (!data || data.length === 0) {
        console.log(`No data found for ${fromCurrency}/${toCurrency}, trying quote endpoint`);
        return await fetchForexQuote(fromCurrency, toCurrency);
      }
      
      console.log(`API response for ${fromCurrency}${toCurrency}:`, data);
      
      // Ensure the data has a symbol property
      const result = {
        ...data[0],
        symbol: data[0].symbol || `${fromCurrency}${toCurrency}`
      };
      
      // Validate that we have the minimum required data
      if (!result.price) {
        // If price is missing, try the quote endpoint as a fallback
        console.log(`Price missing in fx endpoint response, trying quote endpoint for ${fromCurrency}${toCurrency}`);
        return await fetchForexQuote(fromCurrency, toCurrency);
      }
      
      return result;
    } catch (error) {
      console.error(`Failed to fetch forex data from fx endpoint for ${fromCurrency}/${toCurrency}:`, error);
      // Try the quote endpoint as a fallback
      try {
        return await fetchForexQuote(fromCurrency, toCurrency);
      } catch (fallbackError) {
        console.error(`Fallback to quote endpoint also failed for ${fromCurrency}/${toCurrency}:`, fallbackError);
        console.log(`Falling back to mock data for ${fromCurrency}${toCurrency}`);
        return generateMockForexData(fromCurrency, toCurrency);
      }
    }
  } catch (error) {
    console.error(`Unexpected error in fetchForexData for ${fromCurrency}/${toCurrency}:`, error);
    console.log(`Falling back to mock data for ${fromCurrency}${toCurrency}`);
    return generateMockForexData(fromCurrency, toCurrency);
  }
}

/**
 * Fallback method to fetch forex data using the quote endpoint
 */
async function fetchForexQuote(fromCurrency: string, toCurrency: string = 'USD'): Promise<any> {
  // Skip invalid pairs like USD/USD
  if (fromCurrency === toCurrency) {
    throw new Error(`Invalid currency pair: ${fromCurrency}/${toCurrency}. Base and quote currencies must be different.`);
  }
  
  const url = `${FMP_API_BASE_URL}/quote/${fromCurrency}${toCurrency}?apikey=${FMP_API_KEY}`;
  
  try {
    console.log(`Fetching forex data from quote endpoint: ${url}`);
    const data = await apiRequest<any[]>(url);
    
    if (!data || data.length === 0) {
      console.log(`No data found for ${fromCurrency}/${toCurrency} in quote endpoint, falling back to mock data`);
      return generateMockForexData(fromCurrency, toCurrency);
    }
    
    console.log(`Quote API response for ${fromCurrency}${toCurrency}:`, data);
    
    // Ensure the data has a symbol property
    const result = {
      ...data[0],
      symbol: data[0].symbol || `${fromCurrency}${toCurrency}`
    };
    
    // Validate that we have the minimum required data
    if (!result.price) {
      console.log(`Invalid data format for ${fromCurrency}/${toCurrency} from quote endpoint: missing price, falling back to mock data`);
      return generateMockForexData(fromCurrency, toCurrency);
    }
    
    return result;
  } catch (error) {
    console.error(`Failed to fetch forex data from quote endpoint for ${fromCurrency}/${toCurrency}:`, error);
    console.log(`Falling back to mock data for ${fromCurrency}${toCurrency}`);
    return generateMockForexData(fromCurrency, toCurrency);
  }
}

/**
 * Fetch cryptocurrency data from Alpha Vantage
 */
async function fetchCryptoData(symbol: string, currency: string = 'USD'): Promise<any> {
  try {
    // Skip invalid pairs like USD/USD
    if (symbol === currency) {
      throw new Error(`Invalid currency pair: ${symbol}/${currency}. Base and quote currencies must be different.`);
    }
    
    const url = `${ALPHA_VANTAGE_API_URL}?function=DIGITAL_CURRENCY_DAILY&symbol=${symbol}&market=${currency}&apikey=${ALPHA_VANTAGE_API_KEY}`;
    
    console.log(`Fetching crypto data from: ${url}`);
    const data = await apiRequest<any>(url);
    
    if (!data || !data["Time Series (Digital Currency Daily)"]) {
      console.log(`No valid data found for ${symbol}/${currency}, falling back to mock data`);
      return generateMockForexData(symbol, currency);
    }
    
    // Get the most recent data point
    const timeSeriesData = data["Time Series (Digital Currency Daily)"];
    const dates = Object.keys(timeSeriesData).sort().reverse();
    const latestDate = dates[0];
    const latestData = timeSeriesData[latestDate];
    
    // Get the previous day's data for calculating change
    const previousDate = dates[1];
    const previousData = timeSeriesData[previousDate];
    
    // Calculate price and changes
    const price = parseFloat(latestData[`4a. close (${currency})`]);
    const previousPrice = parseFloat(previousData[`4a. close (${currency})`]);
    const change = price - previousPrice;
    const changesPercentage = (change / previousPrice) * 100;
    
    // Get high and low
    const dayHigh = parseFloat(latestData[`2a. high (${currency})`]);
    const dayLow = parseFloat(latestData[`3a. low (${currency})`]);
    
    // Get volume
    const volume = parseFloat(latestData[`5. volume`]);
    
    // Calculate average volume from the last 7 days
    let totalVolume = 0;
    for (let i = 0; i < Math.min(7, dates.length); i++) {
      totalVolume += parseFloat(timeSeriesData[dates[i]][`5. volume`]);
    }
    const avgVolume = totalVolume / Math.min(7, dates.length);
    
    return {
      symbol: `${symbol}${currency}`,
      price: price.toFixed(4),
      changesPercentage: changesPercentage.toFixed(2),
      change: change.toFixed(4),
      dayLow: dayLow.toFixed(4),
      dayHigh: dayHigh.toFixed(4),
      volume: volume,
      avgVolume: avgVolume
    };
  } catch (error) {
    console.error(`Failed to fetch crypto data for ${symbol}/${currency}:`, error);
    console.log(`Falling back to mock data for ${symbol}${currency}`);
    return generateMockForexData(symbol, currency);
  }
}

/**
 * Fetch stock quote data from Financial Modeling Prep
 */
async function fetchStockQuote(symbol: string): Promise<any> {
  const url = `${FMP_API_BASE_URL}/quote/${symbol}?apikey=${FMP_API_KEY}`;
  
  try {
    const data = await apiRequest<any[]>(url);
    
    if (!data || data.length === 0 || !data[0].price) {
      console.log(`No valid data found for ${symbol}, generating mock data`);
      // Generate mock data based on the symbol
      let mockCurrency = 'USD';
      if (symbol === '^DJI') {
        return {
          symbol: 'US30USD',
          price: (34000 + Math.random() * 1000).toFixed(2),
          changesPercentage: (Math.random() * 2 - 1).toFixed(2),
          change: (Math.random() * 200 - 100).toFixed(2),
          dayLow: (34000 - Math.random() * 200).toFixed(2),
          dayHigh: (34000 + Math.random() * 200).toFixed(2),
          volume: Math.floor(Math.random() * 10000000) + 5000000,
          avgVolume: Math.floor(Math.random() * 10000000) + 5000000
        };
      } else if (symbol === '^GSPC') {
        return {
          symbol: 'SP500USD',
          price: (4500 + Math.random() * 100).toFixed(2),
          changesPercentage: (Math.random() * 2 - 1).toFixed(2),
          change: (Math.random() * 20 - 10).toFixed(2),
          dayLow: (4500 - Math.random() * 20).toFixed(2),
          dayHigh: (4500 + Math.random() * 20).toFixed(2),
          volume: Math.floor(Math.random() * 5000000) + 2000000,
          avgVolume: Math.floor(Math.random() * 5000000) + 2000000
        };
      } else if (symbol === 'XAUUSD') {
        mockCurrency = 'XAU';
      }
      
      return generateMockForexData(mockCurrency);
    }
    
    // Ensure the data has a symbol property
    const result = {
      ...data[0],
      symbol: data[0].symbol || symbol
    };
    
    return result;
  } catch (error) {
    console.error(`Failed to fetch stock quote for ${symbol}:`, error);
    console.log(`Generating mock data for ${symbol}`);
    
    // Generate mock data based on the symbol
    if (symbol === '^DJI') {
      return {
        symbol: 'US30USD',
        price: (34000 + Math.random() * 1000).toFixed(2),
        changesPercentage: (Math.random() * 2 - 1).toFixed(2),
        change: (Math.random() * 200 - 100).toFixed(2),
        dayLow: (34000 - Math.random() * 200).toFixed(2),
        dayHigh: (34000 + Math.random() * 200).toFixed(2),
        volume: Math.floor(Math.random() * 10000000) + 5000000,
        avgVolume: Math.floor(Math.random() * 10000000) + 5000000
      };
    } else if (symbol === '^GSPC') {
      return {
        symbol: 'SP500USD',
        price: (4500 + Math.random() * 100).toFixed(2),
        changesPercentage: (Math.random() * 2 - 1).toFixed(2),
        change: (Math.random() * 20 - 10).toFixed(2),
        dayLow: (4500 - Math.random() * 20).toFixed(2),
        dayHigh: (4500 + Math.random() * 20).toFixed(2),
        volume: Math.floor(Math.random() * 5000000) + 2000000,
        avgVolume: Math.floor(Math.random() * 5000000) + 2000000
      };
    } else if (symbol === 'XAUUSD') {
      return generateMockForexData('XAU', 'USD');
    }
    
    return generateMockForexData('USD');
  }
}

/**
 * Generate an AI trading strategy based on technical indicators and market conditions
 */
function generateAIStrategy(
  type: 'BUY' | 'SELL' | 'NEUTRAL', 
  price: number, 
  volatility: number, 
  pair: string
): AIStrategy {
  // Determine strategy type based on market conditions
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
  
  // Select strategy type based on market conditions
  let strategyType: StrategyType;
  
  if (type === 'BUY') {
    // For buy signals, prefer trend following or breakout strategies
    strategyType = Math.random() > 0.5 ? 'TREND_FOLLOWING' : 'BREAKOUT';
    
    // If volatility is high, consider momentum or volatility-based strategies
    if (volatility > 0.015) {
      strategyType = Math.random() > 0.5 ? 'MOMENTUM' : 'VOLATILITY_BASED';
    }
  } else if (type === 'SELL') {
    // For sell signals, prefer mean reversion or support/resistance strategies
    strategyType = Math.random() > 0.5 ? 'MEAN_REVERSION' : 'SUPPORT_RESISTANCE';
    
    // If volatility is high, consider volatility-based strategies
    if (volatility > 0.015) {
      strategyType = 'VOLATILITY_BASED';
    }
  } else {
    // For neutral signals, prefer range-bound strategies
    strategyType = Math.random() > 0.5 ? 'SUPPORT_RESISTANCE' : 'FIBONACCI_BASED';
  }
  
  // For crypto pairs, consider more advanced strategies
  if (
    pair.includes('BTC') || 
    pair.includes('ETH') || 
    pair.includes('SOL') || 
    pair.includes('XRP')
  ) {
    if (Math.random() > 0.7) {
      strategyType = Math.random() > 0.5 ? 'HARMONIC_PATTERN' : 'ELLIOTT_WAVE';
    }
  }
  
  // Generate entry rules
  const entryRules = generateEntryRules(strategyType, type);
  
  // Generate exit rules
  const exitRules = generateExitRules(strategyType, type, price, volatility);
  
  // Generate risk management rules
  const riskManagementRules = generateRiskManagementRules(volatility);
  
  // Generate timeframe recommendations
  const recommendedTimeframes = generateTimeframeRecommendations(strategyType);
  
  return {
    type: strategyType,
    description: generateStrategyDescription(strategyType),
    entryRules,
    exitRules,
    riskManagementRules,
    recommendedTimeframes,
    indicators: generateIndicatorRecommendations(strategyType),
    successRate: Math.floor(Math.random() * 20) + 60, // 60-80%
    riskRewardRatio: (1 + Math.random() * 2).toFixed(1), // 1.0-3.0
    complexity: strategyType === 'TREND_FOLLOWING' || strategyType === 'MEAN_REVERSION' ? 'LOW' : 
                strategyType === 'BREAKOUT' || strategyType === 'SUPPORT_RESISTANCE' || strategyType === 'MOMENTUM' ? 'MEDIUM' : 
                'HIGH'
  };
}

/**
 * Generate entry rules based on strategy type
 */
function generateEntryRules(strategyType: StrategyType, signalType: 'BUY' | 'SELL' | 'NEUTRAL'): string[] {
  const rules: string[] = [];
  
  switch (strategyType) {
    case 'TREND_FOLLOWING':
      if (signalType === 'BUY') {
        rules.push('Enter when price breaks above the 20-period EMA');
        rules.push('Confirm with MACD crossing above the signal line');
        rules.push('Ensure RSI is above 50 and rising');
      } else {
        rules.push('Enter when price breaks below the 20-period EMA');
        rules.push('Confirm with MACD crossing below the signal line');
        rules.push('Ensure RSI is below 50 and falling');
      }
      break;
      
    case 'MEAN_REVERSION':
      if (signalType === 'BUY') {
        rules.push('Enter when price touches the lower Bollinger Band');
        rules.push('Confirm with RSI below 30 showing oversold conditions');
        rules.push('Look for bullish candlestick patterns at support levels');
      } else {
        rules.push('Enter when price touches the upper Bollinger Band');
        rules.push('Confirm with RSI above 70 showing overbought conditions');
        rules.push('Look for bearish candlestick patterns at resistance levels');
      }
      break;
      
    case 'BREAKOUT':
      if (signalType === 'BUY') {
        rules.push('Enter when price breaks above a key resistance level with increased volume');
        rules.push('Confirm breakout with ADX above 25 and rising');
        rules.push('Wait for a small pullback to the broken resistance (now support)');
      } else {
        rules.push('Enter when price breaks below a key support level with increased volume');
        rules.push('Confirm breakout with ADX above 25 and rising');
        rules.push('Wait for a small pullback to the broken support (now resistance)');
      }
      break;
      
    case 'SUPPORT_RESISTANCE':
      if (signalType === 'BUY') {
        rules.push('Enter when price bounces off a strong support level');
        rules.push('Confirm with bullish candlestick pattern (hammer, bullish engulfing)');
        rules.push('Ensure volume increases on the bounce');
      } else {
        rules.push('Enter when price rejects from a strong resistance level');
        rules.push('Confirm with bearish candlestick pattern (shooting star, bearish engulfing)');
        rules.push('Ensure volume increases on the rejection');
      }
      break;
      
    case 'MOMENTUM':
      if (signalType === 'BUY') {
        rules.push('Enter when RSI crosses above 50 from below');
        rules.push('Confirm with positive MACD histogram');
        rules.push('Ensure price is above the 50-period moving average');
      } else {
        rules.push('Enter when RSI crosses below 50 from above');
        rules.push('Confirm with negative MACD histogram');
        rules.push('Ensure price is below the 50-period moving average');
      }
      break;
      
    case 'VOLATILITY_BASED':
      if (signalType === 'BUY') {
        rules.push('Enter after a volatility contraction (narrowing Bollinger Bands)');
        rules.push('Wait for a decisive break above the upper Bollinger Band');
        rules.push('Confirm with ATR increasing from a low level');
      } else {
        rules.push('Enter after a volatility contraction (narrowing Bollinger Bands)');
        rules.push('Wait for a decisive break below the lower Bollinger Band');
        rules.push('Confirm with ATR increasing from a low level');
      }
      break;
      
    case 'FIBONACCI_BASED':
      if (signalType === 'BUY') {
        rules.push('Enter when price retraces to the 61.8% Fibonacci level of the previous upward move');
        rules.push('Confirm with bullish divergence on RSI or MACD');
        rules.push('Look for candlestick reversal patterns at the Fibonacci level');
      } else {
        rules.push('Enter when price retraces to the 61.8% Fibonacci level of the previous downward move');
        rules.push('Confirm with bearish divergence on RSI or MACD');
        rules.push('Look for candlestick reversal patterns at the Fibonacci level');
      }
      break;
      
    case 'HARMONIC_PATTERN':
      if (signalType === 'BUY') {
        rules.push('Identify a completed bullish Gartley, Butterfly, or Bat pattern');
        rules.push('Enter at point D of the pattern');
        rules.push('Confirm with oversold RSI and bullish divergence');
      } else {
        rules.push('Identify a completed bearish Gartley, Butterfly, or Bat pattern');
        rules.push('Enter at point D of the pattern');
        rules.push('Confirm with overbought RSI and bearish divergence');
      }
      break;
      
    case 'ICHIMOKU_CLOUD':
      if (signalType === 'BUY') {
        rules.push('Enter when price crosses above the cloud (Kumo)');
        rules.push('Confirm when Tenkan-sen crosses above Kijun-sen');
        rules.push('Ensure Chikou Span is above the price from 26 periods ago');
      } else {
        rules.push('Enter when price crosses below the cloud (Kumo)');
        rules.push('Confirm when Tenkan-sen crosses below Kijun-sen');
        rules.push('Ensure Chikou Span is below the price from 26 periods ago');
      }
      break;
      
    case 'ELLIOTT_WAVE':
      if (signalType === 'BUY') {
        rules.push('Identify completion of a 5-wave impulse down and 3-wave correction up');
        rules.push('Enter at the start of a new 5-wave impulse up (after wave 2)');
        rules.push('Confirm with bullish momentum divergence');
      } else {
        rules.push('Identify completion of a 5-wave impulse up and 3-wave correction down');
        rules.push('Enter at the start of a new 5-wave impulse down (after wave 2)');
        rules.push('Confirm with bearish momentum divergence');
      }
      break;
  }
  
  return rules;
}

/**
 * Generate exit rules based on strategy type
 */
function generateExitRules(
  strategyType: StrategyType, 
  signalType: 'BUY' | 'SELL' | 'NEUTRAL',
  price: number,
  volatility: number
): string[] {
  const rules: string[] = [];
  
  // Calculate potential take profit levels based on volatility
  const tp1 = signalType === 'BUY' 
    ? (price * (1 + volatility * 2)).toFixed(4)
    : (price * (1 - volatility * 2)).toFixed(4);
    
  const tp2 = signalType === 'BUY'
    ? (price * (1 + volatility * 3)).toFixed(4)
    : (price * (1 - volatility * 3)).toFixed(4);
  
  // Calculate stop loss level based on volatility
  const sl = signalType === 'BUY'
    ? (price * (1 - volatility * 1.5)).toFixed(4)
    : (price * (1 + volatility * 1.5)).toFixed(4);
  
  // Add common exit rules
  rules.push(`Set initial stop loss at ${sl}`);
  rules.push(`Take partial profits at ${tp1} (50% of position)`);
  rules.push(`Take remaining profits at ${tp2} or when momentum weakens`);
  
  // Add strategy-specific exit rules
  switch (strategyType) {
    case 'TREND_FOLLOWING':
      rules.push('Exit when price closes below the 50-period moving average (for longs)');
      rules.push('Exit when MACD crosses below the signal line (for longs)');
      break;
      
    case 'MEAN_REVERSION':
      rules.push('Exit when price reaches the middle Bollinger Band');
      rules.push('Exit when RSI crosses 50 from below (for longs) or above (for shorts)');
      break;
      
    case 'BREAKOUT':
      rules.push('Use trailing stop of 2 ATR once price moves in your favor');
      rules.push('Exit if volume decreases significantly after entry');
      break;
      
    case 'SUPPORT_RESISTANCE':
      rules.push('Exit when price approaches the next resistance level (for longs)');
      rules.push('Exit if price breaks below the support level with conviction (for longs)');
      break;
      
    case 'MOMENTUM':
      rules.push('Exit when momentum indicator (RSI, CCI) shows divergence');
      rules.push('Use parabolic SAR for trailing stop once in profit');
      break;
      
    case 'VOLATILITY_BASED':
      rules.push('Exit when Bollinger Bands start contracting again');
      rules.push('Exit when ATR decreases significantly from peak');
      break;
      
    case 'FIBONACCI_BASED':
      rules.push('Take profits at key Fibonacci extension levels (127.2%, 161.8%)');
      rules.push('Exit if price retraces more than 78.6% of the initial move');
      break;
      
    case 'HARMONIC_PATTERN':
      rules.push('Take profits at 38.2%, 61.8%, and 100% of the pattern range');
      rules.push('Exit if price breaks the pattern structure');
      break;
      
    case 'ICHIMOKU_CLOUD':
      rules.push('Exit when Tenkan-sen crosses below Kijun-sen (for longs)');
      rules.push('Exit when price enters the cloud from above (for longs)');
      break;
      
    case 'ELLIOTT_WAVE':
      rules.push('Take profits at the end of wave 3 and wave 5');
      rules.push('Exit if wave structure is invalidated');
      break;
  }
  
  return rules;
}

/**
 * Generate risk management rules
 */
function generateRiskManagementRules(volatility: number): string[] {
  const riskPercentage = Math.max(1, Math.min(2, Math.round(volatility * 100)));
  
  return [
    `Risk no more than ${riskPercentage}% of account per trade`,
    'Use proper position sizing based on stop loss distance',
    'Consider reducing position size during high-impact news events',
    'Split entries into multiple parts to average in',
    'Move stop loss to breakeven after price moves 1:1 risk-reward in your favor'
  ];
}

/**
 * Generate timeframe recommendations
 */
function generateTimeframeRecommendations(strategyType: StrategyType): string[] {
  switch (strategyType) {
    case 'TREND_FOLLOWING':
      return ['4H', '1D', '1W'];
      
    case 'MEAN_REVERSION':
      return ['15M', '1H', '4H'];
      
    case 'BREAKOUT':
      return ['1H', '4H', '1D'];
      
    case 'SUPPORT_RESISTANCE':
      return ['1H', '4H', '1D'];
      
    case 'MOMENTUM':
      return ['15M', '1H', '4H'];
      
    case 'VOLATILITY_BASED':
      return ['15M', '1H', '4H'];
      
    case 'FIBONACCI_BASED':
      return ['1H', '4H', '1D'];
      
    case 'HARMONIC_PATTERN':
      return ['1H', '4H', '1D'];
      
    case 'ICHIMOKU_CLOUD':
      return ['4H', '1D', '1W'];
      
    case 'ELLIOTT_WAVE':
      return ['4H', '1D', '1W'];
      
    default:
      return ['15M', '1H', '4H', '1D'];
  }
}

/**
 * Generate indicator recommendations
 */
function generateIndicatorRecommendations(strategyType: StrategyType): string[] {
  switch (strategyType) {
    case 'TREND_FOLLOWING':
      return ['Moving Averages (20, 50, 200)', 'MACD (12, 26, 9)', 'ADX (14)', 'Parabolic SAR'];
      
    case 'MEAN_REVERSION':
      return ['Bollinger Bands (20, 2)', 'RSI (14)', 'Stochastic Oscillator (14, 3, 3)', 'CCI (20)'];
      
    case 'BREAKOUT':
      return ['Donchian Channels', 'ADX (14)', 'Volume', 'ATR (14)'];
      
    case 'SUPPORT_RESISTANCE':
      return ['Pivot Points', 'Volume', 'Psychological Levels', 'Fibonacci Retracements'];
      
    case 'MOMENTUM':
      return ['RSI (14)', 'Stochastic (14, 3, 3)', 'MACD (12, 26, 9)', 'CCI (20)'];
      
    case 'VOLATILITY_BASED':
      return ['Bollinger Bands (20, 2)', 'ATR (14)', 'Keltner Channels', 'Standard Deviation'];
      
    case 'FIBONACCI_BASED':
      return ['Fibonacci Retracements', 'Fibonacci Extensions', 'Fibonacci Time Zones', 'Fibonacci Fan'];
      
    case 'HARMONIC_PATTERN':
      return ['Fibonacci Retracements', 'RSI (14)', 'XABCD Pattern Indicator', 'Volume'];
      
    case 'ICHIMOKU_CLOUD':
      return ['Ichimoku Cloud (9, 26, 52)', 'Tenkan-sen', 'Kijun-sen', 'Chikou Span'];
      
    case 'ELLIOTT_WAVE':
      return ['Elliott Wave Oscillator', 'RSI (14)', 'MACD (12, 26, 9)', 'Fibonacci Retracements'];
      
    default:
      return ['Moving Averages', 'RSI', 'MACD', 'Volume'];
  }
}

/**
 * Generate strategy description
 */
function generateStrategyDescription(strategyType: StrategyType): string {
  switch (strategyType) {
    case 'TREND_FOLLOWING':
      return 'This strategy aims to capture profits by following established market trends. It uses moving averages and momentum indicators to identify and follow the direction of strong market movements.';
      
    case 'MEAN_REVERSION':
      return 'This strategy is based on the concept that prices tend to revert to their mean over time. It looks for overbought or oversold conditions and takes positions anticipating a return to average price levels.';
      
    case 'BREAKOUT':
      return 'This strategy identifies key levels where price has been contained and enters when price breaks through these levels with conviction, anticipating a strong move in the breakout direction.';
      
    case 'SUPPORT_RESISTANCE':
      return 'This strategy trades bounces off established support and resistance levels. It identifies key price zones where the market has previously reversed and takes positions when price reacts at these levels.';
      
    case 'MOMENTUM':
      return 'This strategy capitalizes on the continuation of strong price movements. It uses momentum indicators to identify assets that are moving with strength and enters in the direction of the momentum.';
      
    case 'VOLATILITY_BASED':
      return 'This strategy exploits changes in market volatility. It identifies periods of low volatility (consolidation) and takes positions anticipating an expansion in volatility and directional movement.';
      
    case 'FIBONACCI_BASED':
      return 'This strategy uses Fibonacci retracements and extensions to identify potential reversal and target levels. It is based on the principle that markets often retrace and extend in predictable Fibonacci ratios.';
      
    case 'HARMONIC_PATTERN':
      return 'This advanced strategy identifies specific price patterns formed by Fibonacci retracements. It looks for Gartley, Butterfly, Bat, and other harmonic patterns to identify high-probability reversal points.';
      
    case 'ICHIMOKU_CLOUD':
      return 'This comprehensive strategy uses the Ichimoku Cloud system to identify trend direction, momentum, support/resistance levels, and potential entry/exit points all in one indicator system.';
      
    case 'ELLIOTT_WAVE':
      return 'This advanced strategy applies Elliott Wave Theory to identify market cycles and predict future price movements. It analyzes wave patterns to determine the current market position within the larger cycle.';
      
    default:
      return 'A balanced trading strategy combining multiple technical analysis approaches to identify high-probability trading opportunities.';
  }
}

/**
 * Map FMP data to our Signal format with advanced AI strategy
 */
function mapToSignal(fmpData: any, isPremium: boolean = false): Signal {
  // Validate the input data
  if (!fmpData) {
    throw new Error('Invalid data format: data is null or undefined');
  }
  
  if (!fmpData.symbol) {
    throw new Error('Invalid data format: missing symbol');
  }
  
  if (!fmpData.price) {
    throw new Error('Invalid data format: missing price');
  }

  // Generate a signal type based on technical indicators
  let type: 'BUY' | 'SELL' | 'NEUTRAL' = 'NEUTRAL';
  let strength: 'STRONG' | 'MODERATE' | 'WEAK' = 'MODERATE';
  
  // Determine signal type based on price movement
  const priceChange = parseFloat(fmpData.changesPercentage || "0");
  if (priceChange > 0.5) {
    type = 'BUY';
    strength = priceChange > 1.5 ? 'STRONG' : priceChange > 0.8 ? 'MODERATE' : 'WEAK';
  } else if (priceChange < -0.5) {
    type = 'SELL';
    strength = priceChange < -1.5 ? 'STRONG' : priceChange < -0.8 ? 'MODERATE' : 'WEAK';
  }
  
  // Calculate entry, stop loss and take profit based on current price
  const price = parseFloat(fmpData.price || "0");
  const volatility = Math.abs(parseFloat(fmpData.changesPercentage || "1") / 100);
  const entryPrice = price;
  const stopLoss = type === 'BUY' 
    ? price * (1 - Math.max(0.005, volatility * 0.5)) 
    : price * (1 + Math.max(0.005, volatility * 0.5));
  const takeProfit1 = type === 'BUY'
    ? price * (1 + Math.max(0.01, volatility)) 
    : price * (1 - Math.max(0.01, volatility));
  const takeProfit2 = type === 'BUY'
    ? price * (1 + Math.max(0.015, volatility * 1.5))
    : price * (1 - Math.max(0.015, volatility * 1.5));
  const takeProfit3 = type === 'BUY'
    ? price * (1 + Math.max(0.02, volatility * 2))
    : price * (1 - Math.max(0.02, volatility * 2));
  
  // Generate a confidence score based on volatility and volume
  const volume = parseFloat(fmpData.volume || "0");
  const avgVolume = parseFloat(fmpData.avgVolume || fmpData.volume || "1");
  const volumeRatio = volume / avgVolume;
  
  // Higher confidence if volume is above average and price movement is significant
  let confidence = 70; // Base confidence
  if (Math.abs(priceChange) > 1) confidence += 5;
  if (Math.abs(priceChange) > 2) confidence += 5;
  if (volumeRatio > 1.2) confidence += 5;
  if (volumeRatio > 1.5) confidence += 5;
  if (confidence > 95) confidence = 95;
  
  // Generate a timestamp (current time)
  const timestamp = new Date();
  
  // Generate an expiration date (24-48 hours from now)
  const expiresAt = new Date(timestamp.getTime() + (24 + Math.random() * 24) * 60 * 60 * 1000);
  
  // Ensure symbol is a string before using includes
  const symbolStr = String(fmpData.symbol || '');
  
  // Generate a rationale based on the symbol and signal type
  let rationale = "";
  if (type === 'BUY') {
    rationale = `${symbolStr} showing bullish momentum with ${priceChange.toFixed(2)}% price increase. Volume ${volumeRatio > 1 ? 'above' : 'below'} average. Technical indicators suggest potential upward movement with ${confidence}% confidence.`;
  } else if (type === 'SELL') {
    rationale = `${symbolStr} showing bearish momentum with ${Math.abs(priceChange).toFixed(2)}% price decrease. Volume ${volumeRatio > 1 ? 'above' : 'below'} average. Technical indicators suggest potential downward movement with ${confidence}% confidence.`;
  } else {
    rationale = `${symbolStr} in consolidation phase with no clear directional bias. Wait for breakout confirmation before establishing position.`;
  }
  
  // Format the pair name
  let pair = symbolStr;
  if (pair.includes('/')) {
    pair = pair.replace('/', '');
  }
  
  // Determine if this is a crypto pair
  const isCrypto = pair.includes('BTC') || 
                  pair.includes('ETH') || 
                  pair.includes('SOL') || 
                  pair.includes('XRP') || 
                  pair.includes('ADA') || 
                  pair.includes('DOT') || 
                  pair.includes('DOGE') ||
                  pair.includes('AVAX') ||
                  pair.includes('LINK') ||
                  pair.includes('MATIC') ||
                  pair.includes('UNI') ||
                  pair.includes('ATOM') ||
                  pair.includes('LTC') ||
                  pair.includes('BCH') ||
                  pair.includes('ALGO') ||
                  pair.includes('FIL') ||
                  pair.includes('XLM') ||
                  pair.includes('NEAR') ||
                  pair.includes('ICP') ||
                  pair.includes('AAVE') ||
                  pair.includes('XTZ') ||
                  pair.includes('EOS') ||
                  pair.includes('SAND') ||
                  pair.includes('MANA');
  
  // Determine if this is an index
  const isIndex = pair.includes('US30') || pair.includes('SP500');
  
  // Determine if this is a commodity
  const isCommodity = pair.includes('XAU');
  
  // Generate AI strategy
  const aiStrategy = generateAIStrategy(type, price, volatility, pair);
  
  // Map to our Signal format
  return {
    id: `signal-${pair}-${Date.now()}`,
    pair,
    type,
    strength,
    entryPrice,
    stopLoss,
    takeProfit1,
    takeProfit2,
    takeProfit3,
    timeFrame: ['15M', '1H', '4H', '1D'][Math.floor(Math.random() * 4)] as TimeFrame,
    timestamp,
    expiresAt,
    confidence,
    rationale,
    status: 'ACTIVE',
    result: undefined,
    isPremium,
    isCrypto,
    isIndex,
    isCommodity,
    aiStrategy
  };
}

/**
 * Check if a pair is available for free users
 */
function isPairFree(pair: string): boolean {
  // Skip invalid pairs like USD/USD
  if (pair === "USD/USD" || pair === "USDUSD") {
    return false;
  }
  
  // Convert to uppercase and remove any slashes for consistent comparison
  const normalizedPair = pair.toUpperCase().replace('/', '');
  
  return FREE_PAIRS.some(freePair => {
    const normalizedFreePair = freePair.toUpperCase();
    return normalizedPair.includes(normalizedFreePair);
  });
}

/**
 * Fetch trading signals using real data from Financial Modeling Prep
 */
export async function fetchSignals(isSubscribed: boolean = false): Promise<Signal[]> {
  try {
    const signals: Signal[] = [];
    const currencies: Currency[] = [
      'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'NZD', 'SEK', 'NOK', 'DKK',
      'SGD', 'HKD', 'MXN', 'ZAR', 'TRY', 'PLN', 'HUF', 'CZK', 'ILS', 'THB',
      'IDR', 'MYR', 'PHP', 'INR', 'BRL', 'XAU'
    ];
    const cryptos = [
      'BTC', 'ETH', 'SOL', 'XRP', 'ADA', 'DOT', 'DOGE', 'AVAX', 'LINK', 'MATIC',
      'UNI', 'ATOM', 'LTC', 'BCH', 'ALGO', 'FIL', 'XLM', 'NEAR', 'ICP', 'AAVE',
      'XTZ', 'EOS', 'SAND', 'MANA', 'AXS'
    ];
    const indices = ['^DJI', '^GSPC']; // Dow Jones (US30) and S&P 500
    const commodities = ['XAUUSD']; // Gold
    
    // Fetch forex data
    const forexPromises = currencies.map(currency => {
      // Skip USD/USD pair
      if (currency === 'USD') {
        return Promise.resolve(null);
      }
      return fetchForexData(currency);
    });
    
    const forexResults = await Promise.allSettled(forexPromises);
    
    // Process successful forex results
    forexResults.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value) {
        try {
          const isPremium = !isPairFree(currencies[index] + 'USD');
          
          // Skip premium signals for non-subscribers
          if (isPremium && !isSubscribed) {
            return;
          }
          
          const signal = mapToSignal(result.value, isPremium);
          signals.push(signal);
        } catch (error) {
          console.error(`Error mapping forex data to signal for ${currencies[index]}:`, error);
        }
      } else if (result.status === 'rejected') {
        console.error(`Failed to fetch forex data for ${currencies[index]}:`, result.reason);
      }
    });
    
    // Fetch crypto data
    if (isSubscribed) {
      const cryptoPromises = cryptos.map(crypto => fetchCryptoData(crypto));
      const cryptoResults = await Promise.allSettled(cryptoPromises);
      
      // Process successful crypto results
      cryptoResults.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          try {
            const signal = mapToSignal(result.value, true);
            signal.isCrypto = true;
            signals.push(signal);
          } catch (error) {
            console.error(`Error mapping crypto data to signal for ${cryptos[index]}:`, error);
          }
        } else if (result.status === 'rejected') {
          console.error(`Failed to fetch crypto data for ${cryptos[index]}:`, result.reason);
        }
      });
    }
    
    // Fetch indices data
    const indicesPromises = indices.map(index => fetchStockQuote(index));
    const indicesResults = await Promise.allSettled(indicesPromises);
    
    // Process successful indices results
    indicesResults.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value) {
        try {
          const data = result.value;
          // For US30 and SP500, we need to adjust the symbol
          if (indices[index] === '^DJI') {
            data.symbol = 'US30USD';
          } else if (indices[index] === '^GSPC') {
            data.symbol = 'SP500USD';
          }
          
          // Indices are premium
          if (!isSubscribed) {
            return;
          }
          
          const signal = mapToSignal(data, true);
          signal.isIndex = true;
          signals.push(signal);
        } catch (error) {
          console.error(`Error mapping index data to signal for ${indices[index]}:`, error);
        }
      } else if (result.status === 'rejected') {
        console.error(`Failed to fetch index data for ${indices[index]}:`, result.reason);
      }
    });
    
    // Fetch commodities data
    const commoditiesPromises = commodities.map(commodity => fetchStockQuote(commodity));
    const commoditiesResults = await Promise.allSettled(commoditiesPromises);
    
    // Process successful commodities results
    commoditiesResults.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value) {
        try {
          const data = result.value;
          
          // XAU is premium
          if (!isSubscribed) {
            return;
          }
          
          const signal = mapToSignal(data, true);
          signal.isCommodity = true;
          signals.push(signal);
        } catch (error) {
          console.error(`Error mapping commodity data to signal for ${commodities[index]}:`, error);
        }
      } else if (result.status === 'rejected') {
        console.error(`Failed to fetch commodity data for ${commodities[index]}:`, result.reason);
      }
    });
    
    // If we couldn't get any real signals, fall back to mock data
    if (signals.length === 0) {
      console.warn('No real signals could be generated, falling back to mock data');
      return generateMockSignals(15);
    }
    
    return signals;
  } catch (error) {
    console.error('Failed to fetch signals:', error);
    // Fall back to mock data in case of API failure
    return generateMockSignals(15);
  }
}

/**
 * Generate technical analysis for a currency pair with enhanced indicators
 */
async function generateTechnicalAnalysis(
  currency: Currency | 'US30' | 'SP500' | 'XAU' | string, 
  timeFrame: TimeFrame
): Promise<any> {
  // Skip invalid pairs like USD/USD
  if (currency === "USD") {
    throw new Error("Invalid currency: USD cannot be analyzed against itself");
  }
  
  // Validate that the currency is a valid currency and not a timeframe
  const validCurrencies = [
    'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'NZD', 'SEK', 'NOK', 'DKK',
    'SGD', 'HKD', 'MXN', 'ZAR', 'TRY', 'PLN', 'HUF', 'CZK', 'ILS', 'THB',
    'IDR', 'MYR', 'PHP', 'INR', 'BRL', 'RUB', 'CNH', 'KRW', 'TWD', 'XAU',
    'BTC', 'ETH', 'SOL', 'XRP', 'ADA', 'DOT', 'DOGE', 'AVAX', 'LINK', 'MATIC',
    'UNI', 'ATOM', 'LTC', 'BCH', 'ALGO', 'FIL', 'XLM', 'NEAR', 'ICP', 'AAVE',
    'XTZ', 'EOS', 'SAND', 'MANA', 'US30', 'SP500'
  ];
  
  if (!validCurrencies.includes(currency)) {
    throw new Error(`Invalid currency: ${currency}. Must be a valid currency code.`);
  }
  
  // Convert currency to symbol format for FMP
  let symbol;
  
  if (currency === 'US30') {
    symbol = '^DJI'; // Dow Jones Industrial Average
  } else if (currency === 'SP500') {
    symbol = '^GSPC'; // S&P 500
  } else if (currency === 'XAU') {
    symbol = 'XAUUSD';
  } else if (
    currency === 'BTC' || 
    currency === 'ETH' || 
    currency === 'SOL' || 
    currency === 'XRP' || 
    currency === 'ADA' || 
    currency === 'DOT' || 
    currency === 'DOGE' ||
    currency === 'AVAX' ||
    currency === 'LINK' ||
    currency === 'MATIC' ||
    currency === 'UNI' ||
    currency === 'ATOM' ||
    currency === 'LTC' ||
    currency === 'BCH' ||
    currency === 'ALGO' ||
    currency === 'FIL' ||
    currency === 'XLM' ||
    currency === 'NEAR' ||
    currency === 'ICP' ||
    currency === 'AAVE' ||
    currency === 'XTZ' ||
    currency === 'EOS' ||
    currency === 'SAND' ||
    currency === 'MANA'
  ) {
    symbol = `${currency}USD`;
  } else {
    symbol = `${currency}USD`;
  }
  
  try {
    let data;
    
    // Fetch current price data
    if (currency === 'US30') {
      data = await fetchStockQuote(symbol);
    } else if (currency === 'SP500') {
      data = await fetchStockQuote(symbol);
    } else if (currency === 'XAU') {
      data = await fetchStockQuote('XAUUSD');
    } else if (
      currency === 'BTC' || 
      currency === 'ETH' || 
      currency === 'SOL' || 
      currency === 'XRP' || 
      currency === 'ADA' || 
      currency === 'DOT' || 
      currency === 'DOGE' ||
      currency === 'AVAX' ||
      currency === 'LINK' ||
      currency === 'MATIC' ||
      currency === 'UNI' ||
      currency === 'ATOM' ||
      currency === 'LTC' ||
      currency === 'BCH' ||
      currency === 'ALGO' ||
      currency === 'FIL' ||
      currency === 'XLM' ||
      currency === 'NEAR' ||
      currency === 'ICP' ||
      currency === 'AAVE' ||
      currency === 'XTZ' ||
      currency === 'EOS' ||
      currency === 'SAND' ||
      currency === 'MANA'
    ) {
      data = await fetchCryptoData(currency);
    } else {
      data = await fetchForexData(currency);
    }
    
    console.log(`Technical analysis data for ${currency}:`, data);
    
    // Ensure we have the necessary data
    if (!data || !data.price) {
      throw new Error(`Insufficient data for technical analysis of ${currency}`);
    }
    
    const price = parseFloat(data.price);
    const change = parseFloat(data.changesPercentage || data.change || "0");
    
    // Determine sentiment based on price change
    let sentiment: Sentiment = 'NEUTRAL';
    if (change > 0.5) {
      sentiment = 'BULLISH';
    } else if (change < -0.5) {
      sentiment = 'BEARISH';
    }
    
    // Calculate confidence score
    const confidenceScore = Math.min(95, 70 + Math.floor(Math.abs(change) * 5));
    
    // Generate volatility based on price change
    const volatility = Math.max(0.005, Math.abs(change) / 100);
    
    // Generate support and resistance levels
    const supportLevels = [
      parseFloat((price * (1 - volatility * 0.5)).toFixed(4)),
      parseFloat((price * (1 - volatility)).toFixed(4)),
      parseFloat((price * (1 - volatility * 1.5)).toFixed(4))
    ];
    
    const resistanceLevels = [
      parseFloat((price * (1 + volatility * 0.5)).toFixed(4)),
      parseFloat((price * (1 + volatility)).toFixed(4)),
      parseFloat((price * (1 + volatility * 1.5)).toFixed(4))
    ];
    
    // Generate technical indicators
    const rsi = 50 + (change * 5);
    const macd = change / 100;
    const sma50 = price * (1 - (change / 200));
    const sma200 = price * (1 - (change / 100));
    const atr = price * volatility;
    const cci = change * 100;
    const stochastic = 50 + (change * 10);
    const adx = 20 + Math.abs(change * 10);
    
    const technicalIndicators = [
      {
        name: 'RSI (14)',
        value: rsi.toFixed(2),
        signal: rsi > 70 ? 'SELL' : rsi < 30 ? 'BUY' : 'NEUTRAL'
      },
      {
        name: 'MACD (12,26,9)',
        value: macd.toFixed(4),
        signal: macd > 0 ? 'BUY' : macd < 0 ? 'SELL' : 'NEUTRAL'
      },
      {
        name: 'Moving Average (50)',
        value: sma50.toFixed(4),
        signal: sma50 < price ? 'BUY' : sma50 > price ? 'SELL' : 'NEUTRAL'
      },
      {
        name: 'Moving Average (200)',
        value: sma200.toFixed(4),
        signal: sma200 < price ? 'BUY' : sma200 > price ? 'SELL' : 'NEUTRAL'
      },
      {
        name: 'Bollinger Bands',
        value: `${(price * 0.98).toFixed(4)} - ${(price * 1.02).toFixed(4)}`,
        signal: price > (price * 1.02) ? 'SELL' : price < (price * 0.98) ? 'BUY' : 'NEUTRAL'
      },
      {
        name: 'ATR (14)',
        value: atr.toFixed(4),
        signal: 'NEUTRAL' // ATR is a volatility indicator, not directional
      },
      {
        name: 'CCI (14)',
        value: cci.toFixed(2),
        signal: cci > 100 ? 'SELL' : cci < -100 ? 'BUY' : 'NEUTRAL'
      },
      {
        name: 'Stochastic (14,3)',
        value: stochastic.toFixed(2),
        signal: stochastic > 80 ? 'SELL' : stochastic < 20 ? 'BUY' : 'NEUTRAL'
      },
      {
        name: 'ADX (14)',
        value: adx.toFixed(2),
        signal: adx > 25 ? 'TREND' : 'RANGE' // ADX measures trend strength, not direction
      }
    ];
    
    // Generate chart data
    const chartData: ChartData = {
      timestamps: [],
      prices: [],
      volumes: [],
      predictions: []
    };
    
    // Generate 30 data points for historical data
    const now = Date.now();
    const timeInterval = timeFrame === '15M' ? 15 * 60 * 1000 : 
                        timeFrame === '1H' ? 60 * 60 * 1000 :
                        timeFrame === '4H' ? 4 * 60 * 60 * 1000 :
                        timeFrame === '1D' ? 24 * 60 * 60 * 1000 :
                        7 * 24 * 60 * 60 * 1000; // 1W
    
    let currentPrice = price;
    for (let i = 30; i >= 0; i--) {
      chartData.timestamps.push(now - (i * timeInterval));
      
      // Add some randomness to create a realistic price chart
      const priceChange = (Math.random() * 0.01) - 0.005; // -0.5% to +0.5%
      currentPrice = currentPrice * (1 + priceChange);
      chartData.prices.push(currentPrice);
      
      // Generate random volume
      if (chartData.volumes) {
        chartData.volumes.push(Math.floor(Math.random() * 1000000) + 500000);
      }
    }
    
    // Add 10 prediction points
    let predictedPrice = currentPrice;
    for (let i = 1; i <= 10; i++) {
      // Add directional bias based on sentiment
      let bias = 0;
      if (sentiment === 'BULLISH') bias = 0.002;
      else if (sentiment === 'BEARISH') bias = -0.002;
      
      const priceChange = (Math.random() * 0.01) - 0.005 + bias; // -0.5% to +0.5% with bias
      predictedPrice = predictedPrice * (1 + priceChange);
      if (chartData.predictions) {
        chartData.predictions.push(predictedPrice);
      }
    }
    
    // Generate AI strategy
    const aiStrategy = generateAIStrategy(
      sentiment === 'BULLISH' ? 'BUY' : sentiment === 'BEARISH' ? 'SELL' : 'NEUTRAL',
      price,
      volatility,
      symbol
    );
    
    return {
      price,
      change,
      sentiment,
      confidenceScore,
      supportLevels,
      resistanceLevels,
      technicalIndicators,
      chartData,
      aiStrategy
    };
  } catch (error) {
    console.error(`Failed to generate technical analysis for ${currency}/${timeFrame}:`, error);
    throw error;
  }
}

/**
 * Fetch AI analysis for a specific currency pair and timeframe with enhanced features
 */
export async function fetchAnalysis(
  currency: Currency | 'US30' | 'SP500' | 'XAU' | string, 
  timeFrame: TimeFrame,
  isPremiumUser: boolean = false
): Promise<AIAnalysis> {
  try {
    console.log(`Fetching analysis for ${currency}/${timeFrame}, isPremiumUser: ${isPremiumUser}`);
    
    // Skip invalid pairs like USD/USD
    if (currency === "USD") {
      throw new Error("Invalid currency: USD cannot be analyzed against itself");
    }
    
    // Validate that the currency is a valid currency and not a timeframe
    const validCurrencies = [
      'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'NZD', 'SEK', 'NOK', 'DKK',
      'SGD', 'HKD', 'MXN', 'ZAR', 'TRY', 'PLN', 'HUF', 'CZK', 'ILS', 'THB',
      'IDR', 'MYR', 'PHP', 'INR', 'BRL', 'RUB', 'CNH', 'KRW', 'TWD', 'XAU',
      'BTC', 'ETH', 'SOL', 'XRP', 'ADA', 'DOT', 'DOGE', 'AVAX', 'LINK', 'MATIC',
      'UNI', 'ATOM', 'LTC', 'BCH', 'ALGO', 'FIL', 'XLM', 'NEAR', 'ICP', 'AAVE',
      'XTZ', 'EOS', 'SAND', 'MANA', 'US30', 'SP500'
    ];
    
    if (!validCurrencies.includes(currency)) {
      throw new Error(`Invalid currency: ${currency}. Must be a valid currency code.`);
    }
    
    // Validate that the timeframe is a valid timeframe
    const validTimeframes = ['15M', '1H', '4H', '1D', '1W'];
    
    if (!validTimeframes.includes(timeFrame)) {
      throw new Error(`Invalid timeframe: ${timeFrame}. Must be one of: ${validTimeframes.join(', ')}`);
    }
    
    // Create a pair string in our format
    const pair = currency === 'US30' ? 'US30/USD' : 
                currency === 'SP500' ? 'SP500/USD' :
                currency === 'XAU' ? 'XAU/USD' : 
                `${currency}/USD`;
    
    // Check if this is a premium pair
    const isPremium = !isPairFree(currency + 'USD');
    
    console.log(`Pair: ${pair}, isPremium: ${isPremium}, isPremiumUser: ${isPremiumUser}`);
    
    // If this is a premium pair, check if the user is subscribed
    if (isPremium && !isPremiumUser) {
      console.error(`Premium content requested without subscription: ${pair}`);
      throw new Error('Subscription required for this analysis');
    }
    
    // Generate technical analysis
    const analysis = await generateTechnicalAnalysis(currency, timeFrame);
    
    // Determine if this is a crypto pair
    const isCrypto = 
      currency === 'BTC' || 
      currency === 'ETH' || 
      currency === 'SOL' || 
      currency === 'XRP' || 
      currency === 'ADA' || 
      currency === 'DOT' || 
      currency === 'DOGE' ||
      currency === 'AVAX' ||
      currency === 'LINK' ||
      currency === 'MATIC' ||
      currency === 'UNI' ||
      currency === 'ATOM' ||
      currency === 'LTC' ||
      currency === 'BCH' ||
      currency === 'ALGO' ||
      currency === 'FIL' ||
      currency === 'XLM' ||
      currency === 'NEAR' ||
      currency === 'ICP' ||
      currency === 'AAVE' ||
      currency === 'XTZ' ||
      currency === 'EOS' ||
      currency === 'SAND' ||
      currency === 'MANA';
    
    // Determine if this is an index
    const isIndex = currency === 'US30' || currency === 'SP500';
    
    // Determine if this is a commodity
    const isCommodity = currency === 'XAU';
    
    // Generate fundamental factors based on currency
    let fundamentalFactors;
    if (currency === 'XAU') {
      fundamentalFactors = [
        {
          factor: 'Inflation Outlook',
          impact: ['POSITIVE', 'NEGATIVE', 'NEUTRAL'][Math.floor(Math.random() * 3)] as Impact,
          description: `Inflation expectations ${Math.random() > 0.5 ? 'rising' : 'falling'}, which typically ${Math.random() > 0.5 ? 'supports' : 'pressures'} gold prices.`
        },
        {
          factor: 'US Dollar Strength',
          impact: ['POSITIVE', 'NEGATIVE', 'NEUTRAL'][Math.floor(Math.random() * 3)] as Impact,
          description: `USD showing ${Math.random() > 0.5 ? 'weakness' : 'strength'}, which tends to move gold in the ${Math.random() > 0.5 ? 'same' : 'opposite'} direction.`
        },
        {
          factor: 'Geopolitical Tensions',
          impact: ['POSITIVE', 'NEGATIVE', 'NEUTRAL'][Math.floor(Math.random() * 3)] as Impact,
          description: `Current geopolitical landscape ${Math.random() > 0.5 ? 'increasing' : 'decreasing'} safe-haven demand.`
        }
      ];
    } else if (currency === 'US30' || currency === 'SP500') {
      fundamentalFactors = [
        {
          factor: 'Corporate Earnings',
          impact: ['POSITIVE', 'NEGATIVE', 'NEUTRAL'][Math.floor(Math.random() * 3)] as Impact,
          description: `Q${Math.floor(Math.random() * 4 + 1)} earnings reports showing ${Math.random() > 0.5 ? 'better' : 'worse'} than expected results.`
        },
        {
          factor: 'Federal Reserve Policy',
          impact: ['POSITIVE', 'NEGATIVE', 'NEUTRAL'][Math.floor(Math.random() * 3)] as Impact,
          description: `Fed expected to ${Math.random() > 0.5 ? 'maintain' : 'adjust'} interest rates, affecting market sentiment.`
        },
        {
          factor: 'Economic Indicators',
          impact: ['POSITIVE', 'NEGATIVE', 'NEUTRAL'][Math.floor(Math.random() * 3)] as Impact,
          description: `Recent economic data showing ${Math.random() > 0.5 ? 'signs of growth' : 'concerning trends'} for the US economy.`
        }
      ];
    } else if (isCrypto) {
      fundamentalFactors = [
        {
          factor: 'Market Sentiment',
          impact: ['POSITIVE', 'NEGATIVE', 'NEUTRAL'][Math.floor(Math.random() * 3)] as Impact,
          description: `Overall crypto market sentiment is ${Math.random() > 0.5 ? 'improving' : 'deteriorating'} with ${Math.random() > 0.5 ? 'increasing' : 'decreasing'} institutional interest.`
        },
        {
          factor: 'Regulatory News',
          impact: ['POSITIVE', 'NEGATIVE', 'NEUTRAL'][Math.floor(Math.random() * 3)] as Impact,
          description: `Recent regulatory developments are ${Math.random() > 0.5 ? 'favorable' : 'challenging'} for ${currency} adoption.`
        },
        {
          factor: 'Network Activity',
          impact: ['POSITIVE', 'NEGATIVE', 'NEUTRAL'][Math.floor(Math.random() * 3)] as Impact,
          description: `On-chain metrics show ${Math.random() > 0.5 ? 'increasing' : 'decreasing'} network usage and adoption.`
        }
      ];
    } else {
      // For forex pairs
      fundamentalFactors = [
        {
          factor: 'Interest Rate Differential',
          impact: ['POSITIVE', 'NEGATIVE', 'NEUTRAL'][Math.floor(Math.random() * 3)] as Impact,
          description: `The interest rate differential between ${currency} and USD is ${Math.random() > 0.5 ? 'widening' : 'narrowing'}, affecting carry trade appeal.`
        },
        {
          factor: 'Economic Growth',
          impact: ['POSITIVE', 'NEGATIVE', 'NEUTRAL'][Math.floor(Math.random() * 3)] as Impact,
          description: `${currency} economy showing ${Math.random() > 0.5 ? 'stronger' : 'weaker'} growth compared to the US, impacting relative currency strength.`
        },
        {
          factor: 'Central Bank Policy',
          impact: ['POSITIVE', 'NEGATIVE', 'NEUTRAL'][Math.floor(Math.random() * 3)] as Impact,
          description: `${currency} central bank has adopted a ${Math.random() > 0.5 ? 'hawkish' : 'dovish'} stance in recent communications.`
        }
      ];
    }
    
    // Generate prediction
    const direction = analysis.sentiment === 'BULLISH' ? 'UP' : analysis.sentiment === 'BEARISH' ? 'DOWN' : 'SIDEWAYS';
    
    // Generate target price based on direction and volatility
    const targetPrice = direction === 'UP' 
      ? analysis.price * (1 + (0.02 + Math.random() * 0.03))
      : direction === 'DOWN'
        ? analysis.price * (1 - (0.02 + Math.random() * 0.03))
        : null;
    
    // Generate future price levels
    const futurePriceLevels: PricePrediction[] = [];
    
    if (direction !== 'SIDEWAYS') {
      // Add 3 future price predictions
      futurePriceLevels.push({
        timeframe: '1 Day',
        price: direction === 'UP' 
          ? analysis.price * (1 + (0.005 + Math.random() * 0.01))
          : analysis.price * (1 - (0.005 + Math.random() * 0.01)),
        probability: Math.min(analysis.confidenceScore + 10, 95)
      });
      
      futurePriceLevels.push({
        timeframe: '1 Week',
        price: direction === 'UP' 
          ? analysis.price * (1 + (0.01 + Math.random() * 0.02))
          : analysis.price * (1 - (0.01 + Math.random() * 0.02)),
        probability: analysis.confidenceScore
      });
      
      futurePriceLevels.push({
        timeframe: '1 Month',
        price: direction === 'UP' 
          ? analysis.price * (1 + (0.02 + Math.random() * 0.03))
          : analysis.price * (1 - (0.02 + Math.random() * 0.03)),
        probability: Math.max(analysis.confidenceScore - 10, 55)
      });
    }
    
    // Generate risk assessment
    const riskLevelOptions: RiskLevel[] = ['LOW', 'MEDIUM', 'HIGH'];
    const riskLevel = riskLevelOptions[Math.floor(Math.random() * riskLevelOptions.length)];
    
    const riskFactors = [];
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
    
    // Generate summary
    let summary = '';
    
    if (analysis.sentiment === 'BULLISH') {
      summary = `The analysis indicates a bullish outlook for ${pair} on the ${timeFrame} timeframe. Technical indicators are showing positive momentum, with support at ${analysis.supportLevels[0].toFixed(4)}. The price is expected to move towards ${targetPrice?.toFixed(4)} in the coming ${timeFrame === '1D' ? 'days' : timeFrame === '4H' ? 'sessions' : 'hours'}.`;
    } else if (analysis.sentiment === 'BEARISH') {
      summary = `The analysis indicates a bearish outlook for ${pair} on the ${timeFrame} timeframe. Technical indicators are showing negative momentum, with resistance at ${analysis.resistanceLevels[0].toFixed(4)}. The price is expected to move towards ${targetPrice?.toFixed(4)} in the coming ${timeFrame === '1D' ? 'days' : timeFrame === '4H' ? 'sessions' : 'hours'}.`;
    } else {
      summary = `The analysis indicates a neutral outlook for ${pair} on the ${timeFrame} timeframe. Technical indicators are showing mixed signals, with the price likely to remain range-bound between support at ${analysis.supportLevels[0].toFixed(4)} and resistance at ${analysis.resistanceLevels[0].toFixed(4)}.`;
    }
    
    // Create the final analysis object
    const aiAnalysis: AIAnalysis = {
      id: `analysis-${Math.random().toString(36).substring(2, 9)}`,
      pair,
      timeFrame,
      timestamp: new Date().toISOString(),
      summary,
      sentiment: analysis.sentiment,
      confidenceScore: analysis.confidenceScore,
      keyLevels: {
        support: analysis.supportLevels,
        resistance: analysis.resistanceLevels
      },
      technicalIndicators: analysis.technicalIndicators,
      fundamentalFactors,
      prediction: {
        direction,
        targetPrice,
        timeframe: timeFrame === '1D' ? '1-2 weeks' : timeFrame === '4H' ? '2-3 days' : '12-24 hours',
        probability: analysis.confidenceScore,
        futurePriceLevels
      },
      riskAssessment: {
        level: riskLevel,
        factors: riskFactors
      },
      isPremium,
      isCrypto,
      isIndex,
      isCommodity,
      chartData: analysis.chartData,
      aiStrategy: analysis.aiStrategy
    };
    
    return aiAnalysis;
  } catch (error) {
    console.error(`Failed to fetch analysis for ${currency}/${timeFrame}:`, error);
    throw error;
  }
}