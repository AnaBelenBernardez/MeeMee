/* eslint-disable no-unused-vars */
import { generateError } from '../../../domain/utils/helpers.js'
import UserService from '../../../domain/services/UserService.js'
import { usersSchemas, loginSchema } from '../schemas/usersSchemas.js'
import { v4 as uuidv4 } from 'uuid'
import { fileURLToPath } from 'url'
import { createPathIfNotExists } from '../../../domain/utils/helpers.js'
import sharp from 'sharp'
import crypto from 'crypto'
import path from 'path'
import nodemailer from 'nodemailer'
import sendgridTransport from 'nodemailer-sendgrid-transport'
import jwt from 'jsonwebtoken'

const sendConfirmationEmail = async (toEmail, token) => {
  const transporter = nodemailer.createTransport(
    sendgridTransport({
      auth: {
        api_key: process.env.SENDGRID_API_KEY,
      },
      from: 'meemee.aplicacion@gmail.com',
    }),
  )

  const mailOptions = {
    from: 'meemee.aplicacion@gmail.com',
    to: toEmail,
    subject: 'Confirmación de registro',
    text: `Gracias por registrarte. Haz clic en el siguiente enlace para confirmar tu registro: http://localhost:3000/user/activate/${token}`,
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('Correo enviado:', info.response)
  } catch (error) {
    console.error('Error al enviar el correo:', error)
  }
}

const randomName = (n) => crypto.randomBytes(n).toString('hex')

const userService = new UserService()

export const generateActivationToken = () => {
  return uuidv4()
}
export const validateNewUser = async (req, res, next) => {
  try {
    const { error } = usersSchemas.validate(req.body)

    if (error) {
      throw generateError(error.details[0].message, 400)
    }

    const { email, username } = req.body

    const [emailExist] = await userService.getUserByEmail(email)
    const [usernameExist] = await userService.getUserByUserName(username)

    if (emailExist || usernameExist) {
      throw generateError(
        'Username or email already exists in our database. Please enter a different username or email.',
        409,
      )
    }

    next()
  } catch (error) {
    next(error)
  }
}

export const activateAccountController = async (req, res, next) => {
  try {
    const { token } = req.params

    const user = await userService.getUserByToken(token)

    console.log('User:', user)

    if (!user) {
      throw generateError('Token de activación inválido.', 400)
    }

    if (user.isActivated) {
      throw generateError('El token ya ha sido utilizado.', 400)
    }

    await userService.activateUser(user.id)

    res.status(200).json({ message: 'Cuenta activada exitosamente.' })
  } catch (err) {
    next(err)
  }
}

export const newUserController = async (req, res, next) => {
  try {
    const { username, email, password, bio, meetups_attended } = req.body
    let imageFileName

    if (req.files?.avatar) {
      const currentFilePath = fileURLToPath(import.meta.url)
      const currentDir = path.dirname(currentFilePath)
      const uploadsDir = path.join(currentDir, '../', 'uploads')
      await createPathIfNotExists(uploadsDir)
      const image = sharp(req.files.avatar.data)
      const fileName = req.files.avatar.name
      if (
        fileName.endsWith('.jpg') ||
        fileName.endsWith('.png') ||
        fileName.endsWith('.jpeg')
      ) {
        image.resize(1024)
      } else {
        throw generateError(
          'Please make sure to upload an image in jpg, png, or jpeg format.',
          400,
        )
      }
      imageFileName = `${randomName(16)}.jpg`

      await image.toFile(path.join(uploadsDir, imageFileName))
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: 'Password length must be at least 8 characters long' })
    }

    const { userId, activationToken } = await userService.createUser({
      username,
      email,
      password,
      bio,
      meetups_attended,
      avatar: imageFileName,
      activated: false,
    })

    await userService.createEmailVerification({
      userId,
      token: activationToken,
    })

    await sendConfirmationEmail(email, activationToken)

    res.status(200).json({ message: 'User registered successfully.', userId })
  } catch (err) {
    next(err)
  }
}

export const loginController = async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body)

    if (error) {
      throw generateError(error.details[0].message, 404)
    }

    const { email, password } = req.body
    const token = await userService.login(email, password)

    if (!token) {
      throw generateError('Invalid email or password.', 401)
    }

    res.status(200).json({ token })
  } catch (err) {
    next(err)
  }
}

export const updateUserController = async (req, res, next) => {
  const userId = req.params.id

  try {
    if (req.userId !== Number(userId)) {
      throw generateError(
        `You don't have permission to update this profile.`,
        403,
      )
    }

    const { username, bio, email, password, avatar } = req.body

    const updatedUser = await userService.updateUser(userId, {
      username,
      bio,
      email,
      password,
      avatar,
    })

    res
      .status(200)
      .json({ message: 'Profile updated successfully.', data: updatedUser })
  } catch (error) {
    console.error(error)
    next(error)
  }
}

export const getUserController = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id)
    res.status(200).json(user)
  } catch (err) {
    next(err)
  }
}
