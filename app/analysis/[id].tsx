import React, { useEffect, useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  useColorScheme,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  Platform,
  Alert
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  ArrowLeft,
  Share2,
  AlertTriangle,
  BarChart2,
  Lightbulb,
  ZoomIn,
  ZoomOut,
  Lock
} from 'lucide-react-native';
import { useAIStore } from '@/store/aiStore';
import { useUserStore } from '@/store/userStore';
import { AIAnalysis } from '@/types';
import Colors from '@/constants/colors';
import { useTranslation } from '@/utils/i18n';
import Card from '@/components/Card';
import { LineChart } from 'react-native-chart-kit';

export default function AnalysisDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { getAnalysisById } = useAIStore();
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const [isZoomed, setIsZoomed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const colorScheme = useColorScheme() ?? 'light';
  const { theme, isPremium } = useUserStore();
  
  // Determine which theme to use (user preference or system)
  const effectiveColorScheme = theme === 'system' ? colorScheme : theme;
  const colors = Colors[effectiveColorScheme as keyof typeof Colors];
  
  const screenWidth = Dimensions.get('window').width;
  
  // Get sentiment color
  const getSentimentColor = useMemo(() => {
    if (!analysis) return colors.neutral;
    
    switch (analysis.sentiment) {
      case 'BULLISH':
        return colors.buy;
      case 'BEARISH':
        return colors.sell;
      default:
        return colors.neutral;
    }
  }, [analysis, colors.buy, colors.neutral, colors.sell]);
  
  // Get sentiment icon
  const getSentimentIcon = () => {
    if (!analysis) return <Minus size={20} color={colors.neutral} />;
    
    switch (analysis.sentiment) {
      case 'BULLISH':
        return <TrendingUp size={20} color={colors.buy} />;
      case 'BEARISH':
        return <TrendingDown size={20} color={colors.sell} />;
      default:
        return <Minus size={20} color={colors.neutral} />;
    }
  };
  
  // Get pair type icon and color
  const getPairTypeIcon = () => {
    if (!analysis) return <Text style={[styles.pairTypeText, { color: colors.neutral }]}>{t('forex')}</Text>;
    
    if (analysis.isCrypto) {
      return <Text style={[styles.pairTypeText, { color: colors.crypto }]}>{t('crypto')}</Text>;
    } else if (analysis.isIndex) {
      return <Text style={[styles.pairTypeText, { color: colors.index }]}>{t('index')}</Text>;
    } else if (analysis.isCommodity) {
      return <Text style={[styles.pairTypeText, { color: colors.commodity }]}>{t('commodity')}</Text>;
    } else {
      return <Text style={[styles.pairTypeText, { color: colors.neutral }]}>{t('forex')}</Text>;
    }
  };
  
  // Determine confidence level color
  const getConfidenceColor = () => {
    if (!analysis) return colors.neutral;
    
    if (analysis.confidenceScore >= 80) {
      return colors.buy;
    } else if (analysis.confidenceScore >= 60) {
      return colors.warning;
    } else {
      return colors.sell;
    }
  };
  
  // Determine impact color
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'POSITIVE':
        return colors.buy;
      case 'NEGATIVE':
        return colors.sell;
      default:
        return colors.neutral;
    }
  };
  
  // Determine risk level color
  const getRiskLevelColor = () => {
    if (!analysis) return colors.neutral;
    
    switch (analysis.riskAssessment.level) {
      case 'LOW':
        return colors.buy;
      case 'MEDIUM':
        return colors.warning;
      case 'HIGH':
        return colors.sell;
      default:
        return colors.neutral;
    }
  };
  
  // Always define lineChartData with useMemo, even if it might be empty
  const lineChartData = useMemo(() => {
    if (!analysis || !analysis.chartData) {
      return {
        labels: [],
        datasets: [
          {
            data: [],
            color: () => colors.primary,
            strokeWidth: 2
          }
        ],
        legend: ['No Data']
      };
    }
    
    const { prices, predictions } = analysis.chartData;
    
    // Create labels (just show indices for simplicity)
    const labels = Array.from({ length: prices.length }, (_, i) => i.toString());
    
    // Combine historical and prediction data for display
    const combinedData = [...prices];
    
    if (predictions && predictions.length > 0) {
      // Add predictions (starting from the last historical point)
      combinedData.push(...predictions);
      
      // Add more labels for predictions
      for (let i = 0; i < predictions.length; i++) {
        labels.push((prices.length + i).toString());
      }
    }
    
    return {
      labels,
      datasets: [
        {
          data: combinedData,
          color: () => getSentimentColor,
          strokeWidth: 2
        }
      ],
      legend: [analysis.pair]
    };
  }, [analysis, colors.primary, getSentimentColor]);
  
  useEffect(() => {
    if (id) {
      try {
        const analysisData = getAnalysisById(id as string);
        
        if (analysisData) {
          // Check if this is premium content and user is not premium
          if (analysisData.isPremium && !isPremium) {
            // Show subscription prompt
            Alert.alert(
              t('premium_content'),
              t('premium_content_message'),
              [
                {
                  text: t('cancel'),
                  style: 'cancel',
                  onPress: () => router.back()
                },
                {
                  text: t('upgrade'),
                  onPress: () => router.push('/subscription')
                }
              ]
            );
          }
          
          setAnalysis(analysisData);
          setError(null);
        } else {
          setAnalysis(null);
          setError(t('analysis_not_found_message'));
        }
      } catch (err) {
        console.error('Error fetching analysis:', err);
        setError(err instanceof Error ? err.message : String(err));
        setAnalysis(null);
      } finally {
        setLoading(false);
      }
    }
  }, [id, getAnalysisById, isPremium, router, t]);
  
  const handleBack = () => {
    router.back();
  };
  
  const handleShare = () => {
    // Implement share functionality
    console.log('Share analysis:', id);
  };
  
  const handleZoomIn = () => {
    setIsZoomed(true);
  };
  
  const handleZoomOut = () => {
    setIsZoomed(false);
  };
  
  const handleUpgrade = () => {
    router.push('/subscription');
  };
  
  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  
  if (error || !analysis) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <AlertTriangle size={48} color={colors.danger} />
        <Text style={[styles.errorTitle, { color: colors.text }]}>
          {t('analysis_not_found')}
        </Text>
        <Text style={[styles.errorMessage, { color: colors.textSecondary }]}>
          {error || t('analysis_not_found_message')}
        </Text>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: colors.primary }]}
          onPress={handleBack}
        >
          <ArrowLeft size={16} color="#FFF" style={styles.backButtonIcon} />
          <Text style={styles.backButtonText}>{t('go_back')}</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  // Check if this is premium content and user is not premium
  const isPremiumContent = analysis.isPremium && !isPremium;
  
  // Format date
  const formattedDate = new Date(analysis.timestamp).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButtonSmall}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {analysis.pair}
          </Text>
          <View style={styles.headerSubtitleContainer}>
            {getPairTypeIcon()}
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              {analysis.timeFrame} • {formattedDate}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
          <Share2 size={20} color={colors.text} />
        </TouchableOpacity>
      </View>
      
      {/* Premium content overlay */}
      {isPremiumContent && (
        <View style={[styles.premiumOverlay, { backgroundColor: colors.background }]}>
          <Lock size={48} color={colors.premium} />
          <Text style={[styles.premiumTitle, { color: colors.text }]}>
            {t('premium_content')}
          </Text>
          <Text style={[styles.premiumMessage, { color: colors.textSecondary }]}>
            {t('premium_content_message')}
          </Text>
          <TouchableOpacity 
            style={[styles.upgradeButton, { backgroundColor: colors.premium }]}
            onPress={handleUpgrade}
          >
            <Text style={styles.upgradeButtonText}>{t('upgrade_now')}</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* Summary Card */}
      <Card style={[styles.card, { backgroundColor: colors.card }]}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <BarChart2 size={20} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              {t('summary')}
            </Text>
          </View>
          <View style={[styles.sentimentBadge, { backgroundColor: colors.background }]}>
            {getSentimentIcon()}
            <Text style={[styles.sentimentText, { color: getSentimentColor }]}>
              {t(`sentiment_${analysis.sentiment.toLowerCase()}`)}
            </Text>
          </View>
        </View>
        <Text style={[styles.summaryText, { color: colors.text }]}>
          {analysis.summary}
        </Text>
        <View style={styles.confidenceContainer}>
          <Text style={[styles.confidenceLabel, { color: colors.textSecondary }]}>
            {t('analysis_confidence')}:
          </Text>
          <View style={styles.confidenceBarContainer}>
            <View 
              style={[
                styles.confidenceBar, 
                { 
                  width: `${analysis.confidenceScore}%`,
                  backgroundColor: getConfidenceColor()
                }
              ]}
            />
          </View>
          <Text style={[styles.confidenceValue, { color: getConfidenceColor() }]}>
            {analysis.confidenceScore}%
          </Text>
        </View>
      </Card>
      
      {/* Chart Card */}
      <Card style={[styles.card, { backgroundColor: colors.card }]}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <BarChart2 size={20} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              {t('price_chart')}
            </Text>
          </View>
          <View style={styles.chartControls}>
            {isZoomed ? (
              <TouchableOpacity onPress={handleZoomOut} style={styles.zoomButton}>
                <ZoomOut size={18} color={colors.text} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={handleZoomIn} style={styles.zoomButton}>
                <ZoomIn size={18} color={colors.text} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        {analysis.chartData ? (
          <View style={styles.chartContainer}>
            {lineChartData.datasets[0].data.length > 0 && (
              Platform.OS === 'web' ? (
                // Web-compatible chart rendering
                <View style={styles.webChartContainer}>
                  <View style={styles.webChartHeader}>
                    <Text style={[styles.webChartTitle, { color: colors.text }]}>
                      {analysis.pair} {t('price_chart')}
                    </Text>
                  </View>
                  <View style={[styles.webChart, { borderColor: colors.border }]}>
                    <View style={styles.webChartYAxis}>
                      {[0, 1, 2, 3, 4].map((i) => {
                        const max = Math.max(...lineChartData.datasets[0].data);
                        const min = Math.min(...lineChartData.datasets[0].data);
                        const range = max - min;
                        const value = max - (range * i / 4);
                        return (
                          <Text 
                            key={`y-${i}`} 
                            style={[styles.webChartAxisLabel, { color: colors.textSecondary }]}
                          >
                            {value.toFixed(4)}
                          </Text>
                        );
                      })}
                    </View>
                    <View style={styles.webChartContent}>
                      <View style={[styles.webChartLine, { backgroundColor: getSentimentColor }]} />
                      <View style={styles.webChartPoints}>
                        {lineChartData.datasets[0].data.map((value, index) => {
                          const max = Math.max(...lineChartData.datasets[0].data);
                          const min = Math.min(...lineChartData.datasets[0].data);
                          const range = max - min;
                          const normalizedValue = range === 0 ? 0.5 : (max - value) / range;
                          const isPrediction = index >= (analysis?.chartData?.prices?.length || 0);
                          
                          return (
                            <View 
                              key={`point-${index}`}
                              style={[
                                styles.webChartPoint,
                                { 
                                  left: `${(index / (lineChartData.datasets[0].data.length - 1)) * 100}%`,
                                  top: `${normalizedValue * 100}%`,
                                  backgroundColor: isPrediction ? colors.secondary : getSentimentColor
                                }
                              ]}
                            />
                          );
                        })}
                      </View>
                    </View>
                  </View>
                  <View style={styles.webChartXAxis}>
                    {[0, 1, 2, 3, 4].map((i) => {
                      const index = Math.floor((lineChartData.labels.length - 1) * i / 4);
                      return (
                        <Text 
                          key={`x-${i}`} 
                          style={[styles.webChartAxisLabel, { color: colors.textSecondary }]}
                        >
                          {index}
                        </Text>
                      );
                    })}
                  </View>
                </View>
              ) : (
                // Native chart rendering with LineChart
                <LineChart
                  data={lineChartData}
                  width={screenWidth - 40}
                  height={220}
                  chartConfig={{
                    backgroundColor: colors.card,
                    backgroundGradientFrom: colors.card,
                    backgroundGradientTo: colors.card,
                    decimalPlaces: 2,
                    color: (opacity = 1) => getSentimentColor,
                    labelColor: (opacity = 1) => colors.textSecondary,
                    style: {
                      borderRadius: 16
                    },
                    propsForDots: {
                      r: "4",
                      strokeWidth: "2",
                      stroke: colors.primary
                    }
                  }}
                  bezier
                  style={{
                    marginVertical: 8,
                    borderRadius: 16
                  }}
                />
              )
            )}
            
            <View style={styles.chartLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: colors.primary }]} />
                <Text style={[styles.legendText, { color: colors.textSecondary }]}>
                  {t('historical_data')}
                </Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: colors.secondary }]} />
                <Text style={[styles.legendText, { color: colors.textSecondary }]}>
                  {t('prediction')}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.noChartContainer}>
            <AlertTriangle size={32} color={colors.textSecondary} />
            <Text style={[styles.noChartText, { color: colors.textSecondary }]}>
              {t('chart_data_not_available')}
            </Text>
          </View>
        )}
      </Card>
      
      {/* Key Levels Card */}
      <Card style={[styles.card, { backgroundColor: colors.card }]}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <BarChart2 size={20} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              {t('analysis_key_levels')}
            </Text>
          </View>
        </View>
        
        <View style={styles.levelsContainer}>
          <View style={styles.levelColumn}>
            <Text style={[styles.levelTitle, { color: colors.textSecondary }]}>
              {t('analysis_resistance')}
            </Text>
            {analysis.keyLevels.resistance.map((level, index) => (
              <View 
                key={`resistance-${index}`} 
                style={[
                  styles.levelItem, 
                  { backgroundColor: colors.background }
                ]}
              >
                <Text style={[styles.levelValue, { color: colors.sell }]}>
                  {level.toFixed(4)}
                </Text>
              </View>
            ))}
          </View>
          
          <View style={styles.levelColumn}>
            <Text style={[styles.levelTitle, { color: colors.textSecondary }]}>
              {t('analysis_support')}
            </Text>
            {analysis.keyLevels.support.map((level, index) => (
              <View 
                key={`support-${index}`} 
                style={[
                  styles.levelItem, 
                  { backgroundColor: colors.background }
                ]}
              >
                <Text style={[styles.levelValue, { color: colors.buy }]}>
                  {level.toFixed(4)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </Card>
      
      {/* Prediction Card */}
      <Card style={[styles.card, { backgroundColor: colors.card }]}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Lightbulb size={20} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              {t('analysis_prediction')}
            </Text>
          </View>
        </View>
        
        <View style={styles.predictionContainer}>
          <View style={styles.predictionHeader}>
            <View style={[
              styles.directionBadge, 
              { 
                backgroundColor: analysis.prediction.direction === 'UP' 
                  ? colors.buy 
                  : analysis.prediction.direction === 'DOWN'
                    ? colors.sell
                    : colors.neutral
              }
            ]}>
              {analysis.prediction.direction === 'UP' ? (
                <TrendingUp size={16} color="#FFF" />
              ) : analysis.prediction.direction === 'DOWN' ? (
                <TrendingDown size={16} color="#FFF" />
              ) : (
                <Minus size={16} color="#FFF" />
              )}
              <Text style={styles.directionText}>
                {analysis.prediction.direction}
              </Text>
            </View>
            
            <Text style={[styles.timeframeText, { color: colors.textSecondary }]}>
              {analysis.prediction.timeframe}
            </Text>
            
            <View style={[styles.probabilityBadge, { backgroundColor: colors.background }]}>
              <Text style={[styles.probabilityText, { color: colors.text }]}>
                {analysis.prediction.probability}% {t('analysis_probability')}
              </Text>
            </View>
          </View>
          
          {analysis.prediction.targetPrice && (
            <View style={styles.targetPriceContainer}>
              <Text style={[styles.targetPriceLabel, { color: colors.textSecondary }]}>
                {t('analysis_target_price')}:
              </Text>
              <Text style={[
                styles.targetPriceValue, 
                { 
                  color: analysis.prediction.direction === 'UP' 
                    ? colors.buy 
                    : analysis.prediction.direction === 'DOWN'
                      ? colors.sell
                      : colors.text
                }
              ]}>
                {analysis.prediction.targetPrice.toFixed(4)}
              </Text>
            </View>
          )}
          
          {analysis.prediction.futurePriceLevels && analysis.prediction.futurePriceLevels.length > 0 && (
            <View style={styles.futureLevelsContainer}>
              <Text style={[styles.futureLevelsTitle, { color: colors.text }]}>
                {t('future_price_levels')}:
              </Text>
              
              {analysis.prediction.futurePriceLevels.map((level, index) => (
                <View key={`future-${index}`} style={styles.futureLevelItem}>
                  <Text style={[styles.futureLevelTimeframe, { color: colors.textSecondary }]}>
                    {level.timeframe}:
                  </Text>
                  <Text style={[
                    styles.futureLevelPrice, 
                    { 
                      color: analysis.prediction.direction === 'UP' 
                        ? colors.buy 
                        : analysis.prediction.direction === 'DOWN'
                          ? colors.sell
                          : colors.text
                    }
                  ]}>
                    {level.price.toFixed(4)}
                  </Text>
                  <Text style={[styles.futureLevelProbability, { color: colors.textTertiary }]}>
                    ({level.probability}%)
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </Card>
      
      {/* Technical Indicators Card */}
      <Card style={[styles.card, { backgroundColor: colors.card }]}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <BarChart2 size={20} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              {t('analysis_technical_indicators')}
            </Text>
          </View>
        </View>
        
        <View style={styles.indicatorsContainer}>
          {analysis.technicalIndicators.map((indicator, index) => (
            <View key={`indicator-${index}`} style={styles.indicatorItem}>
              <Text style={[styles.indicatorName, { color: colors.text }]}>
                {indicator.name}
              </Text>
              <Text style={[styles.indicatorValue, { color: colors.textSecondary }]}>
                {indicator.value}
              </Text>
              <View style={[
                styles.indicatorSignalBadge, 
                { 
                  backgroundColor: indicator.signal === 'BUY' 
                    ? colors.buy 
                    : indicator.signal === 'SELL'
                      ? colors.sell
                      : colors.neutral
                }
              ]}>
                <Text style={styles.indicatorSignalText}>
                  {t(`signal_type_${indicator.signal.toLowerCase()}`)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </Card>
      
      {/* Fundamental Factors Card */}
      <Card style={[styles.card, { backgroundColor: colors.card }]}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Lightbulb size={20} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              {t('analysis_fundamental_factors')}
            </Text>
          </View>
        </View>
        
        <View style={styles.factorsContainer}>
          {analysis.fundamentalFactors.map((factor, index) => (
            <View key={`factor-${index}`} style={styles.factorItem}>
              <View style={styles.factorHeader}>
                <Text style={[styles.factorName, { color: colors.text }]}>
                  {factor.factor}
                </Text>
                <View style={[
                  styles.factorImpactBadge, 
                  { backgroundColor: getImpactColor(factor.impact) }
                ]}>
                  <Text style={styles.factorImpactText}>
                    {t(`impact_${factor.impact.toLowerCase()}`)}
                  </Text>
                </View>
              </View>
              <Text style={[styles.factorDescription, { color: colors.textSecondary }]}>
                {factor.description}
              </Text>
            </View>
          ))}
        </View>
      </Card>
      
      {/* Risk Assessment Card */}
      <Card style={[styles.card, { backgroundColor: colors.card }]}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <AlertTriangle size={20} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              {t('analysis_risk_assessment')}
            </Text>
          </View>
          <View style={[
            styles.riskLevelBadge, 
            { backgroundColor: getRiskLevelColor() }
          ]}>
            <Text style={styles.riskLevelText}>
              {analysis.riskAssessment.level} {t('analysis_risk_level')}
            </Text>
          </View>
        </View>
        
        <View style={styles.riskFactorsContainer}>
          {analysis.riskAssessment.factors.map((factor, index) => (
            <View key={`risk-${index}`} style={styles.riskFactorItem}>
              <View style={styles.riskFactorBullet} />
              <Text style={[styles.riskFactorText, { color: colors.textSecondary }]}>
                {factor}
              </Text>
            </View>
          ))}
        </View>
      </Card>
      
      {/* AI Strategy Card */}
      {analysis.aiStrategy && (
        <Card style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Lightbulb size={20} color={colors.primary} />
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                {t('analysis_strategy')}
              </Text>
            </View>
            <View style={[
              styles.strategyTypeBadge, 
              { backgroundColor: colors.background }
            ]}>
              <Text style={[styles.strategyTypeText, { color: colors.text }]}>
                {analysis.aiStrategy.type}
              </Text>
            </View>
          </View>
          
          <Text style={[styles.strategyDescription, { color: colors.text }]}>
            {analysis.aiStrategy.description}
          </Text>
          
          <View style={styles.strategyMetricsContainer}>
            <View style={styles.strategyMetricItem}>
              <Text style={[styles.strategyMetricLabel, { color: colors.textSecondary }]}>
                {t('signal_success_rate')}:
              </Text>
              <Text style={[styles.strategyMetricValue, { color: colors.text }]}>
                {analysis.aiStrategy.successRate}%
              </Text>
            </View>
            
            <View style={styles.strategyMetricItem}>
              <Text style={[styles.strategyMetricLabel, { color: colors.textSecondary }]}>
                {t('signal_risk_reward')}:
              </Text>
              <Text style={[styles.strategyMetricValue, { color: colors.text }]}>
                1:{analysis.aiStrategy.riskRewardRatio}
              </Text>
            </View>
            
            <View style={styles.strategyMetricItem}>
              <Text style={[styles.strategyMetricLabel, { color: colors.textSecondary }]}>
                {t('signal_complexity')}:
              </Text>
              <Text style={[styles.strategyMetricValue, { color: colors.text }]}>
                {analysis.aiStrategy.complexity}
              </Text>
            </View>
          </View>
          
          <View style={styles.strategyRulesContainer}>
            <Text style={[styles.strategyRulesTitle, { color: colors.text }]}>
              {t('signal_entry_rules')}:
            </Text>
            {analysis.aiStrategy.entryRules.map((rule, index) => (
              <View key={`entry-${index}`} style={styles.strategyRuleItem}>
                <View style={[styles.strategyRuleBullet, { backgroundColor: colors.primary }]} />
                <Text style={[styles.strategyRuleText, { color: colors.textSecondary }]}>
                  {rule}
                </Text>
              </View>
            ))}
            
            <Text style={[styles.strategyRulesTitle, { color: colors.text, marginTop: 16 }]}>
              {t('signal_exit_rules')}:
            </Text>
            {analysis.aiStrategy.exitRules.map((rule, index) => (
              <View key={`exit-${index}`} style={styles.strategyRuleItem}>
                <View style={[styles.strategyRuleBullet, { backgroundColor: colors.secondary }]} />
                <Text style={[styles.strategyRuleText, { color: colors.textSecondary }]}>
                  {rule}
                </Text>
              </View>
            ))}
            
            <Text style={[styles.strategyRulesTitle, { color: colors.text, marginTop: 16 }]}>
              {t('signal_risk_management')}:
            </Text>
            {analysis.aiStrategy.riskManagementRules.map((rule, index) => (
              <View key={`risk-${index}`} style={styles.strategyRuleItem}>
                <View style={[styles.strategyRuleBullet, { backgroundColor: colors.warning }]} />
                <Text style={[styles.strategyRuleText, { color: colors.textSecondary }]}>
                  {rule}
                </Text>
              </View>
            ))}
          </View>
          
          <View style={styles.strategyIndicatorsContainer}>
            <Text style={[styles.strategyIndicatorsTitle, { color: colors.text }]}>
              {t('signal_recommended_indicators')}:
            </Text>
            <View style={styles.strategyIndicatorsList}>
              {analysis.aiStrategy.indicators.map((indicator, index) => (
                <View 
                  key={`indicator-${index}`} 
                  style={[
                    styles.strategyIndicatorBadge, 
                    { backgroundColor: colors.background }
                  ]}
                >
                  <Text style={[styles.strategyIndicatorText, { color: colors.text }]}>
                    {indicator}
                  </Text>
                </View>
              ))}
            </View>
          </View>
          
          <View style={styles.strategyTimeframesContainer}>
            <Text style={[styles.strategyTimeframesTitle, { color: colors.text }]}>
              {t('recommended_timeframes')}:
            </Text>
            <View style={styles.strategyTimeframesList}>
              {analysis.aiStrategy.recommendedTimeframes.map((timeframe, index) => (
                <View 
                  key={`timeframe-${index}`} 
                  style={[
                    styles.strategyTimeframeBadge, 
                    { backgroundColor: colors.background }
                  ]}
                >
                  <Text style={[styles.strategyTimeframeText, { color: colors.text }]}>
                    {timeframe}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
  },
  errorMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonIcon: {
    marginRight: 8,
  },
  backButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButtonSmall: {
    padding: 4,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSubtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  pairTypeText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 8,
  },
  shareButton: {
    padding: 4,
  },
  premiumOverlay: {
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  premiumTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
  },
  premiumMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  upgradeButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  upgradeButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
  card: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  sentimentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  sentimentText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  summaryText: {
    fontSize: 16,
    lineHeight: 24,
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  confidenceLabel: {
    fontSize: 14,
    marginRight: 8,
  },
  confidenceBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  confidenceBar: {
    height: '100%',
    borderRadius: 4,
  },
  confidenceValue: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  chartContainer: {
    marginTop: 8,
  },
  chartControls: {
    flexDirection: 'row',
  },
  zoomButton: {
    padding: 4,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
  },
  noChartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  noChartText: {
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
  levelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  levelColumn: {
    flex: 1,
    alignItems: 'center',
  },
  levelTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  levelItem: {
    width: '90%',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  levelValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  predictionContainer: {
    marginTop: 8,
  },
  predictionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  directionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  directionText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  timeframeText: {
    fontSize: 14,
    marginLeft: 8,
  },
  probabilityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    marginLeft: 'auto',
  },
  probabilityText: {
    fontSize: 14,
  },
  targetPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  targetPriceLabel: {
    fontSize: 16,
    marginRight: 8,
  },
  targetPriceValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  futureLevelsContainer: {
    marginTop: 8,
  },
  futureLevelsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  futureLevelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  futureLevelTimeframe: {
    fontSize: 14,
    width: 80,
  },
  futureLevelPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  futureLevelProbability: {
    fontSize: 14,
  },
  indicatorsContainer: {
    marginTop: 8,
  },
  indicatorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  indicatorName: {
    fontSize: 14,
    flex: 1,
  },
  indicatorValue: {
    fontSize: 14,
    marginHorizontal: 8,
  },
  indicatorSignalBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  indicatorSignalText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  factorsContainer: {
    marginTop: 8,
  },
  factorItem: {
    marginBottom: 16,
  },
  factorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  factorName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  factorImpactBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  factorImpactText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  factorDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  riskLevelBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  riskLevelText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  riskFactorsContainer: {
    marginTop: 8,
  },
  riskFactorItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  riskFactorBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#9CA3AF',
    marginTop: 8,
    marginRight: 8,
  },
  riskFactorText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  strategyTypeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  strategyTypeText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  strategyDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  strategyMetricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  strategyMetricItem: {
    alignItems: 'center',
  },
  strategyMetricLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  strategyMetricValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  strategyRulesContainer: {
    marginBottom: 16,
  },
  strategyRulesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  strategyRuleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  strategyRuleBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
    marginRight: 8,
  },
  strategyRuleText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  strategyIndicatorsContainer: {
    marginBottom: 16,
  },
  strategyIndicatorsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  strategyIndicatorsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  strategyIndicatorBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    margin: 4,
  },
  strategyIndicatorText: {
    fontSize: 12,
  },
  strategyTimeframesContainer: {
    marginBottom: 8,
  },
  strategyTimeframesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  strategyTimeframesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  strategyTimeframeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    margin: 4,
  },
  strategyTimeframeText: {
    fontSize: 12,
  },
  // Web chart styles
  webChartContainer: {
    marginVertical: 16,
    alignItems: 'center',
  },
  webChartHeader: {
    marginBottom: 8,
  },
  webChartTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  webChart: {
    width: '100%',
    height: 200,
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  webChartYAxis: {
    width: 50,
    height: '100%',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  webChartContent: {
    flex: 1,
    height: '100%',
    position: 'relative',
  },
  webChartLine: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 2,
  },
  webChartPoints: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  webChartPoint: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: -3,
    marginTop: -3,
  },
  webChartXAxis: {
    height: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 50,
  },
  webChartAxisLabel: {
    fontSize: 10,
  },
});