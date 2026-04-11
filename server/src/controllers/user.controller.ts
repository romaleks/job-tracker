import bcrypt from 'bcrypt'
import { Response } from 'express'
import jwt from 'jsonwebtoken'
import User, { IUser } from '../models/User'
import { LoginUserInput, RegisterUserInput } from '../schemas/user.schema'
import { ValidatedRequest } from '../types/express'
import config from '../utils/config'

const createToken = (user: IUser) => {
  const userForToken = {
    username: user.username,
    id: user._id,
  }

  return jwt.sign(userForToken, config.JWT_SECRET, {
    expiresIn: 60 * 60 * 24, // expires in a day
  })
}

export const createUser = async (req: ValidatedRequest, res: Response) => {
  const { username, password, email } = req.validated?.body as RegisterUserInput

  if (username.length < 5) {
    return res
      .status(400)
      .json({ error: 'username must be at least 5 characters long' })
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: 'password must be at least 6 characters long' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const newUser = await User.create({
    username,
    email,
    passwordHash,
  })

  const token = createToken(newUser)

  return res.status(201).json({ token, user: newUser })
}

export const loginUser = async (req: ValidatedRequest, res: Response) => {
  const { email, password } = req.validated?.body as LoginUserInput

  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: 'password must be at least 6 characters long' })
  }

  const user = await User.findOne({ email })
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'invalid username or password',
    })
  }

  const token = createToken(user)

  return res.status(200).json({ token, user })
}

export default { createUser }
