import { Signal, AIAnalysis, EducationContent, Notification, AIStrategy, StrategyType, Sentiment, Direction, RiskLevel, TimeFrame, Impact, StrategyComplexity } from '@/types';

// Generate AI strategy
function generateAIStrategy(
  type: 'BUY' | 'SELL' | 'NEUTRAL', 
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
  } else if (type === 'SELL') {
    // For sell signals, prefer mean reversion or support/resistance strategies
    strategyType = Math.random() > 0.5 ? 'MEAN_REVERSION' : 'SUPPORT_RESISTANCE';
  } else {
    // For neutral signals, prefer range-bound strategies
    strategyType = Math.random() > 0.5 ? 'SUPPORT_RESISTANCE' : 'FIBONACCI_BASED';
  }
  
  // Generate entry rules
  const entryRules = generateEntryRules(strategyType, type);
  
  // Generate exit rules
  const exitRules = generateExitRules(strategyType, type);
  
  // Generate risk management rules
  const riskManagementRules = generateRiskManagementRules();
  
  // Generate timeframe recommendations
  const recommendedTimeframes = generateTimeframeRecommendations(strategyType);
  
  // Determine complexity based on strategy type
  let complexity: StrategyComplexity;
  if (strategyType === 'TREND_FOLLOWING' || strategyType === 'MEAN_REVERSION') {
    complexity = 'LOW';
  } else if (strategyType === 'BREAKOUT' || strategyType === 'SUPPORT_RESISTANCE' || strategyType === 'MOMENTUM') {
    complexity = 'MEDIUM';
  } else {
    complexity = 'HIGH';
  }
  
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
    complexity
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
function generateExitRules(strategyType: StrategyType, signalType: 'BUY' | 'SELL' | 'NEUTRAL'): string[] {
  const rules: string[] = [];
  
  // Add common exit rules
  rules.push(`Set initial stop loss at ${signalType === 'BUY' ? 'recent swing low' : 'recent swing high'}`);
  rules.push(`Take partial profits at first target (50% of position)`);
  rules.push(`Take remaining profits at second target or when momentum weakens`);
  
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
function generateRiskManagementRules(): string[] {
  return [
    'Risk no more than 1-2% of account per trade',
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

// Mock Signals
export function generateMockSignals(count: number = 10): Signal[] {
  const signals: Signal[] = [];
  
  // Currency pairs - FOREX ONLY
  const pairs = [
    { pair: 'EUR/USD', isCrypto: false, isIndex: false, isCommodity: false },
    { pair: 'GBP/USD', isCrypto: false, isIndex: false, isCommodity: false },
    { pair: 'USD/JPY', isCrypto: false, isIndex: false, isCommodity: false },
    { pair: 'AUD/USD', isCrypto: false, isIndex: false, isCommodity: false },
    { pair: 'USD/CAD', isCrypto: false, isIndex: false, isCommodity: false },
    { pair: 'EUR/GBP', isCrypto: false, isIndex: false, isCommodity: false },
    { pair: 'USD/CHF', isCrypto: false, isIndex: false, isCommodity: false },
    { pair: 'NZD/USD', isCrypto: false, isIndex: false, isCommodity: false },
    { pair: 'EUR/JPY', isCrypto: false, isIndex: false, isCommodity: false },
    { pair: 'GBP/JPY', isCrypto: false, isIndex: false, isCommodity: false }
  ];
  
  // Signal types
  const types = ['BUY', 'SELL', 'NEUTRAL'];
  
  // Signal strengths
  const strengths = ['STRONG', 'MODERATE', 'WEAK'];
  
  // Timeframes
  const timeFrames = ['15M', '1H', '4H', '1D'];
  
  for (let i = 0; i < count; i++) {
    // Select random pair
    const pairIndex = Math.floor(Math.random() * pairs.length);
    const pair = pairs[pairIndex].pair;
    
    // Select random type and strength
    const type = types[Math.floor(Math.random() * types.length)] as 'BUY' | 'SELL' | 'NEUTRAL';
    const strength = strengths[Math.floor(Math.random() * strengths.length)] as 'STRONG' | 'MODERATE' | 'WEAK';
    
    // Generate base price based on the pair
    let basePrice = 1.0;
    if (pair === 'EUR/USD') basePrice = 1.08;
    else if (pair === 'GBP/USD') basePrice = 1.27;
    else if (pair === 'USD/JPY') basePrice = 155;
    else if (pair === 'AUD/USD') basePrice = 0.66;
    else if (pair === 'USD/CAD') basePrice = 1.36;
    else if (pair === 'EUR/GBP') basePrice = 0.85;
    else if (pair === 'USD/CHF') basePrice = 0.91;
    else if (pair === 'NZD/USD') basePrice = 0.61;
    else if (pair === 'EUR/JPY') basePrice = 167;
    else if (pair === 'GBP/JPY') basePrice = 196;
    
    // Add some randomness to the price
    const entryPrice = basePrice * (1 + (Math.random() * 0.02 - 0.01));
    
    // Calculate stop loss and take profit based on type
    const stopLoss = type === 'BUY' 
      ? entryPrice * (1 - (0.01 + Math.random() * 0.01)) 
      : entryPrice * (1 + (0.01 + Math.random() * 0.01));
    
    const takeProfit1 = type === 'BUY'
      ? entryPrice * (1 + (0.02 + Math.random() * 0.01))
      : entryPrice * (1 - (0.02 + Math.random() * 0.01));
    
    const takeProfit2 = Math.random() > 0.3 
      ? (type === 'BUY'
          ? entryPrice * (1 + (0.03 + Math.random() * 0.01))
          : entryPrice * (1 - (0.03 + Math.random() * 0.01)))
      : null;
    
    const takeProfit3 = Math.random() > 0.7 
      ? (type === 'BUY'
          ? entryPrice * (1 + (0.04 + Math.random() * 0.01))
          : entryPrice * (1 - (0.04 + Math.random() * 0.01)))
      : null;
    
    // Generate timestamps
    const now = new Date();
    const timestamp = new Date(now.getTime() - Math.random() * 86400000); // Up to 24 hours ago
    const expiresAt = new Date(timestamp.getTime() + (24 + Math.random() * 24) * 3600000); // 24-48 hours from creation
    
    // Generate confidence score
    const confidence = Math.floor(Math.random() * 30) + 65; // 65-95
    
    // Generate rationale
    let rationale = '';
    if (type === 'BUY') {
      rationale = `${pair} is showing bullish momentum with technical indicators suggesting potential upward movement. Price has formed a strong support level and momentum indicators are turning positive.`;
    } else if (type === 'SELL') {
      rationale = `${pair} is showing bearish momentum with technical indicators suggesting potential downward movement. Price has reached a key resistance level and momentum indicators are turning negative.`;
    } else {
      rationale = `${pair} is in a consolidation phase with no clear directional bias. Wait for a breakout confirmation before establishing a position.`;
    }
    
    // Generate AI strategy
    const aiStrategy = generateAIStrategy(type, pair);
    
    // Create signal
    const signal: Signal = {
      id: `signal-${i + 1}`,
      pair: pair.replace('/', ''),
      type,
      strength,
      entryPrice,
      stopLoss,
      takeProfit1,
      takeProfit2,
      takeProfit3,
      timeFrame: timeFrames[Math.floor(Math.random() * timeFrames.length)] as TimeFrame,
      timestamp,
      expiresAt,
      confidence,
      rationale,
      status: 'ACTIVE',
      isPremium: false, // All forex pairs are free
      isCrypto: false,
      isIndex: false,
      isCommodity: false,
      aiStrategy
    };
    
    signals.push(signal);
  }
  
  return signals;
}

// Generate mock analysis for a specific currency pair
export function generateMockAnalysis(currency: string, timeFrame: string): AIAnalysis {
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
    timeFrame: timeFrame as TimeFrame,
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

// Mock analyses for initial state - FOREX ONLY
export const mockAnalyses: AIAnalysis[] = [
  generateMockAnalysis('EUR', '1H'),
  generateMockAnalysis('GBP', '4H'),
  generateMockAnalysis('JPY', '1D'),
  generateMockAnalysis('AUD', '1H'),
  generateMockAnalysis('CAD', '4H'),
  generateMockAnalysis('CHF', '1D')
];