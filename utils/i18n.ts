import { I18n } from 'i18n-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Language = 'en';

// Create a new i18n instance
const i18n = new I18n({
  en: {
    // App name
    app_name: 'TradingPro Analytics',
    app_tagline: 'Professional Trading Signals & Analysis',
    
    // Common
    ok: 'OK',
    cancel: 'Cancel',
    retry: 'Retry',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    upgrade: 'Upgrade',
    upgrade_now: 'Upgrade Now',
    subscribe_now: 'Subscribe Now',
    back_to_home: 'Back to Home',
    week: 'week',
    month: 'month',
    year: 'year',
    summary: 'Summary',
    
    // Tabs
    tab_signals: 'Signals',
    tab_analysis: 'Analysis',
    tab_education: 'Education',
    tab_profile: 'Profile',
    
    // Login
    login: 'Login',
    login_welcome: 'Welcome to TradingPro Analytics',
    login_subtitle: 'Enter your access code to continue',
    login_subtitle_google_play: 'Enter your access code or subscribe through Google Play',
    login_access_code_placeholder: 'Access Code',
    login_username_placeholder: 'Username',
    login_password_placeholder: 'Password',
    login_error_empty_code: 'Please enter an access code',
    login_error_empty_username: 'Please enter a username',
    login_error_invalid_code: 'Invalid access code',
    login_error_invalid_credentials: 'Invalid username or password',
    login_error_guest_mode: 'Unable to activate guest mode',
    login_no_account: "Do not have an access code?",
    login_google_play_note: 'Subscription is managed through Google Play',
    login_as_guest: 'Login as Guest',
    
    // Guest Mode
    guest_mode: 'Guest Mode',
    guest_mode_active: 'Guest Mode Active',
    guest_mode_description: 'You are currently using TradingPro Analytics in guest mode with full access to all premium features.',
    guest_mode_option: 'Or try our guest mode',
    guest_mode_info: 'Login as a guest to explore all premium features without a subscription',
    guest_mode_subscription_message: 'You are currently in guest mode with full access to all premium features.',
    guest_access: 'Full Access',
    guest: 'Guest',
    
    // Signals
    signals: 'Signals',
    signals_title: 'Trading Signals',
    signals_subtitle: 'Real-time forex trading signals',
    signals_empty: 'No Signals Available',
    signals_empty_message: 'There are no trading signals available at the moment. Please check back later.',
    signals_error: 'Error Loading Signals',
    signals_error_message: 'We encountered an error while loading signals. Please try again.',
    signals_refresh: 'Refresh',
    signals_filter_by: 'Filter by',
    signals_forex_only: 'Forex Signals',
    signals_subscription_banner: 'Upgrade to Premium for access to crypto, indices, and commodities signals',
    
    // Signal Details
    signal_not_found: 'Signal Not Found',
    signal_not_found_message: 'The signal you are looking for does not exist or has been removed.',
    signal_type_buy: 'Buy',
    signal_type_sell: 'Sell',
    signal_type_neutral: 'Neutral',
    signal_type_range: 'Range',
    signal_strength_strong: 'Strong',
    signal_strength_moderate: 'Moderate',
    signal_strength_weak: 'Weak',
    signal_entry: 'Entry',
    signal_stop_loss: 'Stop Loss',
    signal_take_profit: 'Take Profit',
    signal_confidence: 'Confidence',
    signal_created: 'Created',
    signal_expires: 'Expires',
    signal_rationale: 'Rationale',
    signal_view_details: 'View',
    signal_entry_rules: 'Entry Rules',
    signal_exit_rules: 'Exit Rules',
    signal_risk_management: 'Risk Management',
    signal_success_rate: 'Success Rate',
    signal_risk_reward: 'Risk/Reward',
    signal_complexity: 'Complexity',
    signal_recommended_indicators: 'Recommended Indicators',
    go_back: 'Go Back',
    
    // Analysis
    analysis: 'Analysis',
    analysis_title: 'Market Analysis',
    analysis_subtitle: 'AI-powered market analysis',
    analysis_empty: 'No Analysis Available',
    analysis_empty_message: 'There is no market analysis available at the moment. Please check back later.',
    analysis_error: 'Error Loading Analysis',
    analysis_generating: 'Generating AI analysis...',
    analysis_recent: 'Recent Analysis',
    analysis_generate: 'Generate Analysis',
    analysis_not_found: 'Analysis Not Found',
    analysis_not_found_message: 'The analysis you are looking for does not exist or has been removed.',
    analysis_support: 'Support',
    analysis_resistance: 'Resistance',
    analysis_strategy: 'Strategy',
    analysis_key_levels: 'Key Levels',
    analysis_technical_indicators: 'Technical Indicators',
    analysis_fundamental_factors: 'Fundamental Factors',
    analysis_prediction: 'Price Prediction',
    analysis_risk_assessment: 'Risk Assessment',
    analysis_risk_level: 'Risk',
    analysis_confidence: 'Confidence',
    analysis_target_price: 'Target Price',
    analysis_probability: 'Probability',
    
    // Sentiment
    sentiment_bullish: 'Bullish',
    sentiment_bearish: 'Bearish',
    sentiment_neutral: 'Neutral',
    
    // Impact
    impact_positive: 'Positive',
    impact_negative: 'Negative',
    impact_neutral: 'Neutral',
    
    // Filters
    filter_all: 'All',
    filter_buy: 'Buy',
    filter_sell: 'Sell',
    filter_strong: 'Strong',
    filter_moderate: 'Moderate',
    filter_weak: 'Weak',
    
    // Asset Types
    forex: 'Forex',
    crypto: 'Crypto',
    index: 'Index',
    commodity: 'Commodity',
    
    // Chart
    price_chart: 'Price Chart',
    historical_data: 'Historical Data',
    prediction: 'Prediction',
    chart_data_not_available: 'Chart data not available',
    future_price_levels: 'Future Price Levels',
    recommended_timeframes: 'Recommended Timeframes',
    
    // Education
    education: 'Education',
    education_title: 'Trading Education',
    education_subtitle: 'Learn to trade like a pro',
    education_empty: 'No Educational Content',
    education_empty_message: 'There is no educational content available at the moment. Please check back later.',
    education_error: 'Error Loading Content',
    education_error_message: 'We encountered an error while loading educational content. Please try again.',
    education_latest: 'Latest Articles',
    education_level_beginner: 'Beginner',
    education_level_intermediate: 'Intermediate',
    education_level_advanced: 'Advanced',
    education_read_time: 'min read',
    education_read_more: 'Read More',
    education_minutes: 'min read',
    education_reading_time: '{{time}} min read',
    education_filter_all: 'All',
    education_filter_basics: 'Basics',
    education_filter_technical: 'Technical',
    education_filter_fundamental: 'Fundamental',
    education_filter_psychology: 'Psychology',
    education_filter_risk: 'Risk Management',
    
    // Profile
    profile: 'Profile',
    profile_title: 'My Profile',
    profile_subtitle: 'Manage your account and preferences',
    profile_language: 'Language',
    settings: 'Settings',
    notifications: 'Notifications',
    dark_mode: 'Dark Mode',
    light_mode: 'Light Mode',
    language: 'Language',
    support: 'Support',
    help_center: 'Help Center',
    faq: 'FAQ',
    legal: 'Legal',
    privacy_policy: 'Privacy Policy',
    risk_disclaimer: 'Risk Disclaimer',
    legal_disclaimer: 'Legal Disclaimer',
    logout: 'Logout',
    logout_confirmation_title: 'Logout',
    logout_confirmation_message: 'Are you sure you want to logout?',
    version: 'Version',
    premium_user: 'Premium User',
    free_user: 'Free User',
    manage_subscription: 'Manage',
    
    // Subscription
    subscription_title: 'Premium Subscription',
    subscription_hero_title: 'Unlock Premium Features',
    subscription_hero_subtitle: 'Get access to all signals, analysis, and educational content with a premium subscription.',
    subscription_premium_title: 'Premium Plan',
    subscription_premium_description: 'Full access to all features and content',
    subscription_feature_crypto: 'Crypto Signals & Analysis',
    subscription_feature_indices: 'Indices Signals & Analysis',
    subscription_feature_commodities: 'Commodities Signals & Analysis',
    subscription_feature_analysis: 'Advanced AI Analysis',
    subscription_feature_alerts: 'Real-time Price Alerts',
    subscription_feature_priority: 'Priority Signal Delivery',
    subscription_feature_webinars: 'Weekly Webinars',
    subscription_feature_support: 'Priority Support',
    subscription_checkout_title: 'Complete Your Purchase',
    subscription_payment_info_google_play: 'Payment will be processed through Google Play',
    subscription_android_only: 'Subscription is only available on Android devices',
    subscription_disclaimer_google_play: 'Your subscription will automatically renew unless auto-renew is turned off at least 24 hours before the end of the current period. You can manage your subscriptions in your Google Play account settings.',
    subscription_success_title: 'Subscription Successful',
    subscription_success_message_google_play: 'Your premium subscription has been activated successfully. You now have access to all premium features.',
    subscription_platform_error: 'Platform Not Supported',
    subscription_general_error: 'An error occurred while processing your subscription. Please try again later.',
    subscription_processing: 'Processing your subscription...',
    subscription_already_subscribed: 'You Are Already Subscribed',
    subscription_already_subscribed_message: 'You already have an active premium subscription with access to all features.',
    
    // Premium Content
    premium_content: 'Premium Content',
    premium_content_message: 'This content is only available to premium subscribers. Upgrade to access this content.',
    premium_unlock: 'Unlock',
    premium_promo_title: 'Upgrade to Premium',
    premium_promo_description: 'Get access to advanced analysis, crypto signals, indices, commodities, and more with a premium subscription.',
    
    // Notifications
    notifications_title: 'Notifications',
    notifications_empty: 'No Notifications',
    notifications_empty_message: 'You have no notifications at the moment.',
    
    // Privacy Policy
    privacy_policy_content: "TradingPro Analytics Privacy Policy\n\nLast updated: June 2023\n\nThis Privacy Policy describes how TradingPro Analytics (\"we\", \"us\", or \"our\") collects, uses, and discloses your information when you use our mobile application (the \"Service\").\n\nWe use your data to provide and improve the Service. By using the Service, you agree to the collection and use of information in accordance with this policy.\n\n1. Information Collection and Use\n\nWe collect several different types of information for various purposes to provide and improve our Service to you.\n\n2. Types of Data Collected\n\nPersonal Data: While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you (\"Personal Data\"). This may include, but is not limited to:\n- Email address\n- First name and last name\n- Usage Data\n\nUsage Data: We may also collect information that your browser or device sends whenever you visit our Service or when you access the Service by or through a mobile device (\"Usage Data\").\n\n3. Use of Data\n\nTradingPro Analytics uses the collected data for various purposes:\n- To provide and maintain the Service\n- To notify you about changes to our Service\n- To allow you to participate in interactive features of our Service when you choose to do so\n- To provide customer care and support\n- To provide analysis or valuable information so that we can improve the Service\n- To monitor the usage of the Service\n- To detect, prevent and address technical issues\n\n4. Transfer of Data\n\nYour information, including Personal Data, may be transferred to — and maintained on — computers located outside of your state, province, country or other governmental jurisdiction where the data protection laws may differ from those from your jurisdiction.\n\n5. Disclosure of Data\n\nWe may disclose your Personal Data in the good faith belief that such action is necessary to:\n- Comply with a legal obligation\n- Protect and defend the rights or property of TradingPro Analytics\n- Prevent or investigate possible wrongdoing in connection with the Service\n- Protect the personal safety of users of the Service or the public\n- Protect against legal liability\n\n6. Security of Data\n\nThe security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.\n\n7. Changes to This Privacy Policy\n\nWe may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.\n\n8. Contact Us\n\nIf you have any questions about this Privacy Policy, please contact us:\n- By email: support@tradingproanalytics.com",
    
    // Risk Disclaimer
    risk_disclaimer_content: "Risk Disclaimer\n\nTrading foreign exchange, cryptocurrencies, indices, and commodities carries a high level of risk and may not be suitable for all investors. The high degree of leverage can work against you as well as for you. Before deciding to trade any financial instrument you should carefully consider your investment objectives, level of experience, and risk appetite. The possibility exists that you could sustain a loss of some or all of your initial investment and therefore you should not invest money that you cannot afford to lose. You should be aware of all the risks associated with trading and seek advice from an independent financial advisor if you have any doubts.\n\nThe information provided by TradingPro Analytics is for educational and informational purposes only and should not be construed as financial advice. The signals and analysis provided are based on technical and fundamental analysis but do not guarantee future results. Past performance is not indicative of future results.\n\nTradingPro Analytics and its affiliates, employees, and representatives do not guarantee the accuracy or completeness of the information, text, graphics, links, or other items contained within these materials. TradingPro Analytics shall not be liable for any losses, including lost profits, which may result directly or indirectly from the use of or reliance on such information.\n\nBy using TradingPro Analytics, you acknowledge and agree that you are solely responsible for your trading decisions and that TradingPro Analytics shall not be held liable for any losses incurred from your trading activities.",
    
    // Legal Disclaimer
    legal_disclaimer_content: "Legal Disclaimer\n\nThe information provided by TradingPro Analytics is for general informational purposes only. All information on the application is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the application.\n\nUnder no circumstance shall we have any liability to you for any loss or damage of any kind incurred as a result of the use of the application or reliance on any information provided on the application. Your use of the application and your reliance on any information on the application is solely at your own risk.\n\nThe application may contain links to external websites that are not provided or maintained by or in any way affiliated with TradingPro Analytics. Please note that TradingPro Analytics does not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites.\n\nThe application may contain views and opinions which are those of the authors and do not necessarily reflect the official policy or position of any other agency, organization, employer, or company, including TradingPro Analytics.\n\nTradingPro Analytics reserves the right to make additions, deletions, or modifications to the contents on the application at any time without prior notice.\n\nTradingPro Analytics does not warrant that the application is free of viruses or other harmful components."
  }
});

// Set the locale to English
i18n.locale = 'en';

// Function to get the current language
export const getCurrentLanguage = (): Language => {
  return 'en';
};

// Function to get available languages
export const getAvailableLanguages = () => {
  return [
    { code: 'en' as Language, name: 'English', nativeName: 'English' }
  ];
};

// Function to set the language (now only accepts 'en')
export const setLanguage = async (language: Language) => {
  // Always set to English regardless of input
  i18n.locale = 'en';
  try {
    await AsyncStorage.setItem('user-language', 'en');
  } catch (error) {
    console.error('Error saving language preference:', error);
  }
};

// Function to initialize language from storage
export const initLanguage = async () => {
  try {
    // Always set to English
    i18n.locale = 'en';
    await AsyncStorage.setItem('user-language', 'en');
  } catch (error) {
    console.error('Error loading language preference:', error);
  }
};

// Translation function
export const useTranslation = () => {
  return {
    t: (key: string, options = {}) => i18n.t(key, options),
    i18n,
    language: 'en' as Language
  };
};

export default i18n;