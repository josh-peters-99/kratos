import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  bio: { type: String, default: "" },
  // profileImage: { type: String, default: "default-avatar.png" }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;