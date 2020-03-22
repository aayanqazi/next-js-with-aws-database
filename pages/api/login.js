import nextConnect from "next-connect";
const db = require("../../config/database");
const escape = require("sql-template-strings");
var jwt = require("jsonwebtoken");
// const bcrypt = require("bcrypt");

const handler = nextConnect();

handler.post(async (req, res) => {
  // const password = await bcrypt.hash(req.body.password, 10);
  // console.log(password)
  const users = await db.query(escape`
  Select * from users_login WHERE username = ${req.body.username} && password=${req.body.password}
    `);
  if (users && users.length) {
    var token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        data: users?.[0]
      },
      "secretToken"
    );
    res.status(200).json({ token: token, success: true });
  } else {
    res
      .status(401)
      .json({ error: true, message: "Invalid username and password" });
  }
});

export default handler;
