import { UserRepository } from '../repository/UserRepository.js'
import { UserNotFoundError } from '../errors/UserNotFoundError.js'

class UserService {
  constructor() {
    this.userRepository = new UserRepository()
  }

  async createUser({
    username,
    bio,
    email,
    password,
    meetups_attended,
    avatar,
  }) {
    return this.userRepository.createUser({
      username,
      bio,
      email,
      password,
      meetups_attended,
      avatar,
    })
  }

  async login(email, password) {
    return this.userRepository.login(email, password)
  }

  async getUserByUserName(username) {
    return this.userRepository.getUserByUserName(username)
  }

  async getUserById(userId) {
    const user = await this.userRepository.getUserById(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    return user
  }

  async getUserByEmail(email) {
    return this.userRepository.getUserByEmail(email)
  }
  async getUsersByMeetupsAttended(meetups_attended) {
    return this.userRepository.getUsersByMeetups_attended(meetups_attended)
  }
  async updateUser(userId, { username, bio, email, password, avatar }) {
    return this.userRepository.updateUser(userId, {
      username,
      bio,
      email,
      password,
      avatar,
    })
  }
}

export default UserService
