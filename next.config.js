
require("dotenv").config();
module.exports = {
  devIndicators: {
    autoPrerender: false,
  },
  publicRuntimeConfig: {
    API_KEY: process.env.API_KEY,
    API_SECRET: process.env.API_SECRET,
    MEETING_NUMBER: process.env.MEETING_NUMBER,
    PASSWORD: process.env.PASSWORD,
    NODE_ENV: process.env.NODE_ENV
  },
  webpack: (config) => {
    config.node = {
      fs: 'empty'
    }
    return config
  }
};
