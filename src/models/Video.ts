import mongoose, { models, Schema } from "mongoose";
interface IVideo {
  _id: mongoose.Types.ObjectId
  title: string
  description: string
  userId: mongoose.Types.ObjectId
  videoUrl: string
  thumbnailUrl: string
  controls: boolean 
  transformation?: {
    height: number,
    width: number
    quality: number
  }
}

export const VIDEO_DIMENSTIONS = {
  width: 1080,
  height: 1920
} as const 

const videoSchema = new mongoose.Schema<IVideo>({
  title: {type: String, required: true},
  description: {type: String, required: true},
  videoUrl: {type: String, required: true},
  thumbnailUrl: {type: String, required: true},
  controls: {type: Boolean, default: true},
  transformation:{
    height:{
      type: Number,
      default: VIDEO_DIMENSTIONS.height
    },
    width: {
      type: Number,
      default: VIDEO_DIMENSTIONS.width
    },
    quality: {
      type: Number,
      min: 1,
      max: 100
    }
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User"    
  }
}, {
    timestamps: true 
})

export const Video = models?.Video || mongoose.model<IVideo>("Video", videoSchema)
