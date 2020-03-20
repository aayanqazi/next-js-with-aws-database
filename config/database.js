import mongoose from "mongoose";
require('dotenv').config()

const withConnect = handler => async (req, res) => {
  if (!mongoose.connection.readyState) {
    const uri = process.env.MONGO_URL;
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      autoIndex: false,
      useUnifiedTopology: true
    });
  }

  return handler(req, res);
};

export default withConnect;
