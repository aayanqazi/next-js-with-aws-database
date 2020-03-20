import mongoose, { Schema } from "mongoose";

var User = new Schema({
  email: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  address1: { type: String },
  address2: { type: String },
  city: { type: String },
  zip: { type: String },
  country: { type: String }
});

export default mongoose.models.User || mongoose.model("User", User);
