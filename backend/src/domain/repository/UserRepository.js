import { getConnection } from '../../infrastructure/Database/MySQLClient.js'
import bcrypt from 'bcrypt'
import { generateError } from '../../domain/utils/helpers.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export class UserRepository {
  async createUser({
    username,
    email,
    password,
    category,
    name,
    last_name,
    bio,
    avatar,
  }) {
    if (category !== 'usuario' && category !== 'administrador') {
      throw generateError(
        'The category can only be "usuario" or "administrador"',
        400,
      )
    }

    let connection
    try {
      connection = await getConnection()
      const [emailExist] = await connection.query(
        'SELECT * FROM users WHERE email = ?',
        [email],
      )

      const [usernameExist] = await connection.query(
        'SELECT * FROM users WHERE username = ?',
        [username],
      )

      if (emailExist.length > 0 && usernameExist.length > 0) {
        throw generateError(
          '"Username" and "email" already exist in our database. Please enter a different username and email.',
          409,
        )
      }

      if (emailExist.length > 0) {
        throw generateError(
          '"Email" already exists in our database. Please enter a different email.',
          409,
        )
      }

      if (usernameExist.length > 0) {
        throw generateError(
          '"Username" already exists in our database. Please enter a different username.',
          409,
        )
      }

      const saltRounds = 10
      const hashedPassword = await bcrypt.hash(password, saltRounds)

      const insertUserQuery =
        'INSERT INTO users (username, email, password, category, name, last_name, bio, avatar) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
      const [insertResult] = await connection.query(insertUserQuery, [
        username,
        email,
        hashedPassword,
        category,
        name,
        last_name,
        bio,
        avatar,
      ])

      return insertResult.insertId
    } finally {
      if (connection) {
        connection.release()
      }
    }
  }

  async login(email, password) {
    let connection
    let token

    try {
      connection = await getConnection()

      const [users] = await connection.execute(
        'SELECT * FROM users WHERE email = ?',
        [email],
      )

      if (users.length === 0) {
        throw generateError('Email or password is invalid.', 404)
      }

      const user = users[0]

      const isPasswordValid = await bcrypt.compare(password, user.password)

      if (!isPasswordValid) {
        throw generateError('Email or password is invalid.', 404)
      }
      token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        {
          expiresIn: '24h',
        },
      )

      return token
    } catch (err) {
      console.log(err)
      throw generateError(
        'Email or password is incorrect, please check your data.',
        404,
      )
    } finally {
      if (connection) {
        connection.release()
      }
    }
  }

  async getUserById(userId) {
    let connection
    try {
      connection = await getConnection()
      const [rows] = await connection.query(
        'SELECT * FROM users WHERE id = ?',
        [userId],
      )
      connection.release()
      return rows[0]
    } finally {
      if (connection) connection.release()
    }
  }

  async getUserByEmail(email) {
    let connection

    try {
      connection = await getConnection()

      const [result] = await connection.query(
        'SELECT *  FROM users WHERE email = ?',
        [email],
      )

      if (result.length === 0) {
        throw generateError('There is no user with that email address.', 404)
      }

      return result[0]
    } finally {
      if (connection) connection.release()
    }
  }

  async getUsersByCategory(category) {
    let connection
    try {
      connection = await getConnection()

      const [users] = await connection.query(
        'SELECT * FROM users WHERE category = ?',
        [category],
      )

      return users
    } finally {
      if (connection) {
        connection.release()
      }
    }
  }

  async updateUser(
    userId,
    { username, name, last_name, category, bio, email, password, avatar },
  ) {
    let connection

    try {
      connection = await getConnection()

      const updateFields = []
      const updateValues = []

      if (username) {
        updateFields.push('username = ?')
        updateValues.push(username)
      }

      if (name) {
        updateFields.push('name = ?')
        updateValues.push(name)
      }

      if (last_name) {
        updateFields.push('last_name = ?')
        updateValues.push(last_name)
      }

      if (category) {
        updateFields.push('category = ?')
        updateValues.push(category)
      }

      if (bio) {
        updateFields.push('bio = ?')
        updateValues.push(bio)
      }

      if (email) {
        updateFields.push('email = ?')
        updateValues.push(email)
      }

      if (password) {
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        updateFields.push('password = ?')
        updateValues.push(hashedPassword)
      }

      if (avatar) {
        updateFields.push('avatar = ?')
        updateValues.push(avatar)
      }

      if (updateFields.length === 0) {
        // No hay campos para actualizar
        return
      }

      const updateQuery = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`
      updateValues.push(userId)

      await connection.query(updateQuery, updateValues)
    } finally {
      if (connection) {
        connection.release()
      }
    }
  }
}
