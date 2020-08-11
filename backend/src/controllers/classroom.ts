// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express'
import db from '../database/connection'
import { getPendentActivitiesAndTokensUpdates } from '../services/google'
import filterActiviyies from '../utils/filterActivities'

class ClassroomController {
  async sync (request:Request, response:Response) {
    const { userid } = request.headers

    const [user] = await db('Users')
      .select([
        'googleAccessToken',
        'googleRefreshToken'
      ])
      .where({ id: userid })
    // getPendentActivities pode retornar tambem novos tokens eles devem ser salvos no db
    const googleResult = await getPendentActivitiesAndTokensUpdates(user.googleAccessToken as string, user.googleRefreshToken as string)
    if (googleResult.tokens) {
      await db('Users')
        .update({
          googleAccessToken: googleResult.tokens.accessToken,
          googleRefreshToken: googleResult.tokens.refreshToken
        })
        .where({ id: userid })
    }

    const listOfActivities = await db('Activities')
      .select([
        'id',
        'courseWorkId',
        'courseId'
      ])
      .rightJoin('ClassroomActivities', 'id', 'activityId')
      .where({ userId: userid })

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
          userId: userid
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

    return response.status(200).send('OK')
  }
}

export default ClassroomController
