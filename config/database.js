var mysql = require("mysql");

require("dotenv").config();

const withConnect = handler => async (req, res) => {
  var connection = await mysql.createConnection({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT
  });
  connection.connect(function(err) {
    if (err) {
      console.error("Database connection failed: " + err.stack);
      return;
    }

    console.log("Connected to database.");
  });
  connection.end();

  return handler(req, res);
};

export default withConnect;
