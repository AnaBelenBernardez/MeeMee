import express from 'express'
import {
  createAttendeeController,
  deleteAttendeeController,
  listAttendeesController,
  getAttendeeByIdController,
  listUsernamesByMeetupController,
  getAttendeeByMeetupAndUserController,
  checkAttendeeExistenceController,
} from '../Controllers/Attendees.js'
import { authUser } from '../Middlewares/auth.js'

const attendeesRoutes = express.Router()

attendeesRoutes.post('/attendees/create', authUser, createAttendeeController)
attendeesRoutes.post('/attendees/delete', authUser, deleteAttendeeController)
attendeesRoutes.get('/attendees/:attendeeId', getAttendeeByIdController)
attendeesRoutes.get(
  '/attendees/:meetupId/user/:userId',
  authUser,
  getAttendeeByMeetupAndUserController,
)
attendeesRoutes.get(
  '/attendees/check/:meetupId/user/:userId',
  authUser,
  checkAttendeeExistenceController,
)
attendeesRoutes.get('/attendees/:meetupId/list', listAttendeesController)
attendeesRoutes.get(
  '/attendees/:meetupId/usernames',
  authUser,
  listUsernamesByMeetupController,
)

export { attendeesRoutes }
