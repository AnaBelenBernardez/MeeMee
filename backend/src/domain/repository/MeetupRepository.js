import { getConnection } from '../../infrastructure/Database/MySQLClient.js'
import { AttendeeRepository } from './AttendeeRepository.js'
export class MeetupRepository {
  constructor() {
    this.attendeeRepository = new AttendeeRepository()
  }
  async createMeetup(meetupData) {
    let connection
    try {
      connection = await getConnection()

      const userExists = await connection.query(
        'SELECT COUNT(*) AS count FROM users WHERE id = ?',
        [meetupData.organizer_id],
      )

      if (userExists[0][0].count === 0) {
        throw new Error(`User with ID: ${meetupData.organizer_id} not found`)
      }

      const insertQuery = `INSERT INTO meetups (title, description, picture, theme, location, address, date, time, attendees_count, organizer_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      const [insertResult] = await connection.query(insertQuery, [
        meetupData.title,
        meetupData.description,
        meetupData.picture,
        meetupData.theme,
        meetupData.location,
        meetupData.address,
        meetupData.date,
        meetupData.time,
        meetupData.attendees_count,
        meetupData.organizer_id,
      ])

      const newMeetupId = insertResult.insertId

      await connection.query(
        'INSERT INTO organizers (user_id, meetup_id) VALUES (?, ?)',
        [meetupData.organizer_id, newMeetupId],
      )

      return newMeetupId
    } finally {
      if (connection) {
        connection.release()
      }
    }
  }

  async listMeetups() {
    let connection
    try {
      connection = await getConnection()
      const [meetups] = await connection.query('SELECT * FROM meetups')
      return meetups
    } finally {
      if (connection) {
        connection.release()
      }
    }
  }

  getMetupsByLocation(location) {
    return this.listMeetups().filter((meetup) => meetup.location === location)
  }

  getMetupsByTheme(theme) {
    return this.listMeetups().filter((meetup) => meetup.theme === theme)
  }

  async getMeetupsById(id) {
    if (!id) {
      throw new Error('No se proporcionó un ID.')
    }
    let connection
    try {
      connection = await getConnection()

      const [meetups] = await connection.query(
        `SELECT * FROM meetups WHERE id = ?`,
        [id],
      )

      if (meetups.length === 0) {
        throw new Error(`Meetup with ID: ${id} not found`)
      }

      return meetups[0]
    } finally {
      if (connection) connection.release()
    }
  }

  async updateMeetup(id, meetupData) {
    if (!id) {
      throw new Error('No se proporcionó un ID.')
    }
    let connection
    try {
      connection = await getConnection()

      const updateQuery = `UPDATE meetups SET title = ?, description = ?, picture = ?, theme = ?, location = ?, address =?, date = ?, time = ? WHERE id = ?`
      await connection.query(updateQuery, [
        meetupData.title,
        meetupData.description,
        meetupData.picture,
        meetupData.theme,
        meetupData.location,
        meetupData.address,
        meetupData.date,
        meetupData.time,
        id,
      ])

      return
    } finally {
      if (connection) connection.release()
    }
  }

  async deleteMeetupById(id) {
    if (!id) {
      throw new Error('No se proporcionó un ID.')
    }

    let connection
    try {
      connection = await getConnection()

      const meetupExists = await connection.query(
        'SELECT COUNT(*) AS count FROM Meetups WHERE id = ?',
        [id],
      )

      if (meetupExists[0][0].count === 0) {
        throw new Error(`Meetup with ID: ${id} not found`)
      }

      await connection.beginTransaction()

      try {
        const userIds = await connection.query(
          'SELECT user_id FROM Attendees WHERE meetup_id = ?',
          [id],
        )

        await connection.query('DELETE FROM Attendees WHERE meetup_id = ?', [
          id,
        ])

        await connection.query('DELETE FROM Meetups WHERE id = ?', [id])

        for (const { user_id } of userIds[0]) {
          await connection.query(
            `
          UPDATE users
          SET meetups_attended = (
            SELECT COUNT(*)
            FROM Attendees
            WHERE Attendees.user_id = ?
            AND Attendees.will_attend = 1
          )
          WHERE id = ?
        `,
            [user_id, user_id],
          )
        }

        await connection.commit()
      } catch (error) {
        await connection.rollback()
        throw error
      }

      return { message: 'Meetup eliminado correctamente.' }
    } finally {
      if (connection) connection.release()
    }
  }
}
