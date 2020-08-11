// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express'
import db from '../database/connection'

class ActivityController {
  async index (request:Request, response:Response) {
    const { userid } = request.headers
    const activities = await db('Activities')
      .select([
        'name',
        'date',
        'courseWorkId',
        'courseName',
        'courseId',
        'classroomUrl'
      ])
      .orderBy('date', 'asc')
      .where({
        userId: userid
      })
      .leftJoin('ClassroomActivities', 'id', 'activityId')
    return response.json(activities.map(activity => {
      return {
        ...activity,
        isClassroom: !!activity.courseWorkId
      }
    }))
  }

  async show (request:Request, response:Response) {
    const { id } = request.params
    const [activity] = await db('Activities')
      .select([
        'name',
        'date',
        'courseWorkId',
        'courseName',
        'courseId',
        'classroomUrl'
      ])
      .where({ id })
      .leftJoin('ClassroomActivities', 'id', 'activityId')
    response.json({
      ...activity,
      isClassroom: !!activity.courseWorkId
    })
  }

  async create (request:Request, response:Response) {
    const { userid } = request.headers
    const { name, date } = request.body

    const [id] = await db('Activities')
      .insert({
        name,
        date: date ? new Date(date) : null,
        userId: userid
      })
      .returning('id')

    response.send(id)
  }

  async remove (request:Request, response:Response) {
    const { id } = request.params
    const rows = await db('ClassroomActivities')
      .select('*')
      .where({ activityId: id })
    if (rows.length) {
      return response.status(400)
        .json({
          type: 'not_allowed_to_delete',
          message: 'It is not allowed to delete activities imported from Google Classroom.'
        })
    }
    await db('Activities')
      .delete()
      .where({ id })
    return response.send('OK')
  }
}

export default ActivityController
