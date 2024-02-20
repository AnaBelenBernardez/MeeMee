import { UserEmail } from './UserEmail.js'
import { UserPassword } from './UserPassword.js'

export class User {
  static create(
    id,
    username,
    bio,
    email,
    password,
    meetups_attended,
    avatar,
    activated,
  ) {
    return new User(
      id,
      username,
      bio,
      email,
      UserPassword.fromPlain(password),
      meetups_attended,
      avatar,
      activated,
    )
  }

  constructor(id, username, bio, email, password, meetups_attended, avatar) {
    this.id = id
    this.username = username
    this.bio = bio
    this.email = new UserEmail(email)
    this.password = password
    this.meetups_attended = meetups_attended
    this.avatar = avatar
    this.activated = activated || false
  }

  isActivated() {
    return this.activated
  }

  activate() {
    this.activated = true
  }
  getId() {
    return this.id
  }

  hasId(id) {
    return this.id === id
  }

  hasUsername(username) {
    return this.username === username
  }
  hasBio(bio) {
    return this.bio === bio
  }

  hasEmail(email) {
    return this.email.equals(new UserEmail(email))
  }

  hasPassword(plainPassword) {
    return this.password.compareWith(plainPassword)
  }

  getPassword() {
    return this.password
  }
  hasMeetupsAttended(meetups_attended) {
    return this.meetups_attended === meetups_attended
  }
  hasAvatar(avatar) {
    return this.avatar === avatar
  }

  update({ username, bio, email, password, avatar }) {
    if (username) {
      this.username = username
    }

    if (bio) {
      this.bio = bio
    }

    if (email) {
      this.email = new UserEmail(email)
    }

    if (password) {
      this.password = UserPassword.fromPlain(password)
    }

    if (avatar) {
      this.avatar = avatar
    }
  }
}
