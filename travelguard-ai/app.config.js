// Use app config to inject env and disable New Architecture/Hermes
// EXPO_PUBLIC_ variables are automatically embedded at build time

module.exports = ({ config }) => {
  const apiBase = process.env.EXPO_PUBLIC_API_BASE || 'http://localhost:3000';
  return {
    ...config,
    extra: {
      ...(config.extra || {}),
      apiBase,
    },
    android: {
      ...(config.android || {}),
      jsEngine: 'jsc',
    },
    ios: {
      ...(config.ios || {}),
      jsEngine: 'jsc',
    },
    newArchEnabled: false,
  };
};

