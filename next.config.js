
module.exports = {
  devIndicators: {
    autoPrerender: false,
  },
  webpack: (config) => {
    config.node = {
      fs: 'empty'
    }
    return config
  }
};
