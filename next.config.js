
require('dotenv').config()

module.exports = {
  devIndicators: {
    autoPrerender: false,
  },
  env: {
    API_KEY: process.env.API_KEY,
    API_SECRET: process.env.API_SECRET,
    MEETING_NUMBER: process.env.MEETING_NUMBER
  },
  webpack: (config) => {
    config.node = {
      fs: 'empty'
    }
    return config
  }
};
