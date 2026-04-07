import mongoose, { Document, Schema } from 'mongoose'
import { SaveJobInput } from '../schemas/job.schema'
import { Status, Type } from '../types/job'

export interface IJob extends SaveJobInput, Document {
  createdBy: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const JobSchema: Schema = new Schema(
  {
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    company: { type: String, required: true },
    position: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.Applied,
    },
    type: {
      type: String,
      enum: Object.values(Type),
      default: Type.Onsite,
    },
    salary: Number,
    link: String,
  },
  { timestamps: true },
)

JobSchema.set('toJSON', {
  transform: (_document, returnedObject: Record<string, any>) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

export default mongoose.model<IJob>('Job', JobSchema)
