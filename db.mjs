import mongoose, { Mongoose } from "mongoose";

mongoose.connect(process.env.DSN);

const UserSchema = new mongoose.Schema({
  name: String,
  password: String,
  created: [{ type: mongoose.Types.ObjectId, ref: "Topic" }],
  participated: [{ type: mongoose.Types.ObjectId, ref: "Topic" }],
});

const TopicSchema = new mongoose.Schema({
  topic: String,
  owner: { type: mongoose.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, required: true },
  options: [Option],
});

const OptionSchema = new mongoose.Schema({
  answer: String,
  voter: [{ type: mongoose.Types.ObjectId, ref: "User" }],
});

export const User = mongoose.model("Tutor", UserSchema);
export const Topic = mongoose.model("Topic", TopicSchema);
export const Option = mongoose.model("Option", OptionSchema);
