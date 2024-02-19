import express from 'express'
import {
  newUserController,
  loginController,
  getUserController,
  updateUserController,
} from '../Controllers/Users.js'
import { authUser } from '../Middlewares/auth.js'

const userRoutes = express.Router()

userRoutes.post('/user/register', newUserController)

userRoutes.post('/user/login', loginController)

userRoutes.get('/user/:id', getUserController)

userRoutes.put('/user/:id', authUser, updateUserController)

export { userRoutes }
