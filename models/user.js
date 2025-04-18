import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },

  profileImage: { type: String, default: "default-avatar.png" } // Optional image URL
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;