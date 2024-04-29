import mongoose, { Mongoose } from "mongoose";
import mongooseSlugPlugin from "mongoose-slug-plugin";

mongoose.connect(process.env.DSN);

const UserSchema = new mongoose.Schema({
  name: String,
  password: String,
  created: [{ type: mongoose.Types.ObjectId, ref: "Topic" }],
  participated: [{ type: mongoose.Types.ObjectId, ref: "Topic" }],
});

const OptionSchema = new mongoose.Schema({
  answer: String,
  voter: [{ type: mongoose.Types.ObjectId, ref: "User" }],
});

const TopicSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  owner: { type: mongoose.Types.ObjectId, ref: "User" },
  createdAt: String,
  options: [OptionSchema],
});

UserSchema.plugin(mongooseSlugPlugin, { tmpl: "<%=name%>" });
TopicSchema.plugin(mongooseSlugPlugin, { tmpl: "<%=topic%>" });

export const Option = mongoose.model("Option", OptionSchema);
export const User = mongoose.model("User", UserSchema);
export const Topic = mongoose.model("Topic", TopicSchema);
