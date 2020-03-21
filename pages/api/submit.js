import nextConnect from "next-connect";
import connect from "../../config/database";

const handler = nextConnect();

// handler.use(middleware);

handler.get(async (req, res) => {
  res.json("Data Saved!");
  // let user = new User(req.body);
  // await user.save((err, book) => {
  //   if (err) res.json(err);
  //   res.json("Data Saved!");
  // });
});

export default connect(handler);
