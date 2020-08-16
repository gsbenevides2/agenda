// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express'
import db from '../database/connection'
import { getPendentActivitiesAndTokensUpdates } from '../services/google'
import filterActiviyies from '../utils/filterActivities'

async function sync (userId:string, processId:string) {
  try {
    const [user] = await db('Users')
      .select([
        'googleAccessToken',
        'googleRefreshToken'
      ])
      .where({ id: userId })
    // getPendentActivities pode retornar tambem novos tokens eles devem ser salvos no db
    const googleResult = await getPendentActivitiesAndTokensUpdates(user.googleAccessToken as string, user.googleRefreshToken as string)
    if (googleResult.tokens) {
      await db('Users')
        .update({
          googleAccessToken: googleResult.tokens.accessToken,
          googleRefreshToken: googleResult.tokens.refreshToken
        })
        .where({ id: userId })
    }

    const listOfActivities = await db('Activities')
      .select([
        'id',
        'courseWorkId',
        'courseId'
      ])
      .rightJoin('ClassroomActivities', 'id', 'activityId')
      .where({ userId })

    const filtedActivities = filterActiviyies(listOfActivities, googleResult.activies)

    await Promise.all(filtedActivities.deleteActivities.map(activity => {
      return db('Activities')
        .delete()
        .where('id', '=', activity.id)
    }))

    await Promise.all(filtedActivities.updateActivities.map(async dbActivity => {
      const classroomActivity = googleResult.activies.find(activity => {
        return activity.courseId === dbActivity.courseId && activity.courseWorkId === dbActivity.courseWorkId
      })
      await db('Activities')
        .update({
          name: classroomActivity?.name,
          date: classroomActivity?.date
        })
        .where('id', '=', dbActivity.id)
      await db('ClassroomActivities')
        .update({
          courseName: classroomActivity?.courseName,
          classroomUrl: classroomActivity?.classroomUrl
        })
        .where('activityId', '=', dbActivity.id)
    }))

    await Promise.all(filtedActivities.insertActivities.map(async activity => {
      const [dbActivity] = await db('Activities')
        .insert({
          name: activity.name,
          date: activity.date,
          userId
        })
        .returning('id')
      await db('ClassroomActivities')
        .insert({
          activityId: dbActivity,
          courseName: activity.courseName,
          courseWorkId: activity.courseWorkId,
          courseId: activity.courseId,
          classroomUrl: activity.classroomUrl
        })
    }))
    await db('ClassroomSync')
      .update({ status: 'finished' })
      .where({ userId, processId })
  } catch (e) {
    await db('ClassroomSync')
      .update({ status: 'finished' })
      .where({ userId, processId })
  }
}

class ClassroomController {
  async create (request:Request, response:Response) {
    const userId = request.headers.userid as string
    const processFind = await db('ClassroomSync')
      .select('processId')
      .where({ userId, status: 'created' })
      .first()

    if (processFind) return response.status(201).send(processFind.processId)

    const processId = (await db('ClassroomSync')
      .insert({
        userId,
        status: 'created'
      })
      .returning('processId'))[0]

    sync(userId, processId)
    response.status(201).send(processId)
  }

  async show (request:Request, response:Response) {
    const userId = request.headers.userid
    const { processId } = request.query

    const dbResponse = await db('ClassroomSync')
      .select('status')
      .where({ userId, processId })
      .first()

    return response.send(dbResponse.status)
  }
}

export default ClassroomController
