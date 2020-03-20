import nextConnect from "next-connect";
import connect from "../../config/database";
import User from "../../model/user";

const handler = nextConnect();

// handler.use(middleware);

handler.post(async (req, res) => {
  // let user = new User(req.body);
  // await user.save((err, book) => {
  //   if (err) res.json(err);
  //   res.json("Data Saved!");
  // });
});

export default handler;
