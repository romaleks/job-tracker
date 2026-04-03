import mongoose, { Document, Schema } from 'mongoose'
import { RegisterUserInput } from '../schemas/user.schema'

export interface IUser extends Omit<RegisterUserInput, 'password'>, Document {
  passwordHash: string
  createdAt: Date
  updatedAt: Date
}

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true, minLength: 5 },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    jobs: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
    },
  },
  { timestamps: true },
)

UserSchema.set('toJSON', {
  transform: (_document, returnedObject: Record<string, any>) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  },
})

export default mongoose.model<IUser>('User', UserSchema)
