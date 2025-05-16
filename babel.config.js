module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // doit être **avant** expo-router
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
        },
      ],
    ],
  };
};
