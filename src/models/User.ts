import mongoose, { models } from "mongoose";
import bcrypt from "bcryptjs";

interface IUser {
  _id: mongoose.Types.ObjectId
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

const userSchema = new mongoose.Schema<IUser>({
  name:{
    type: String,
    required: true,
    unique: true
  },
  email:{
    type: String,
    required: true,
    unique: true
  },
  password:{
    type: String,
    required: true
  },
}, {
    timestamps: true
})


userSchema.pre("save", async function (next){
  if(this.isModified("password")){
    const hash = await bcrypt.hash(this.password, 10)
    this.password = hash
  }
  next()
})

export const User = models?.User || mongoose.model<IUser>("User", userSchema)
