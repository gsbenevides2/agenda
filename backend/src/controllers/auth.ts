// eslint-disable-next-line no-unused-vars
import { Response, Request, NextFunction } from 'express'
import { retriveCodeInformation, getAuthUrl } from '../services/google'
import db from '../database/connection'
import validateSession from '../utils/validateSession'

class AuthController {
  async getUrl (request:Request, response:Response) {
    response.redirect(
      getAuthUrl(request.query.redirect as string)
    )
  }

  async logIn (request:Request, response:Response) {
    const code = request.query.code as string
    const redirectUrl = request.query.redirectUrl as string

    try {
      const googleData = await retriveCodeInformation(code, redirectUrl)

      let [user] = await db('Users')
        .select('*')
        .where({
          email: googleData.email
        })
      if (!user) {
        [user] = await db('Users')
          .insert({
            name: googleData.name,
            email: googleData.email,
            picture: googleData.picture,
            googleAccessToken: googleData.accessToken,
            googleRefreshToken: googleData.refreshToken
          })
          .returning('*')
      } else {
        await db('Users')
          .update({
            googleAccessToken: googleData.accessToken,
            googleRefreshToken: googleData.refreshToken
          })
          .where({
            id: user.id
          })
      }

      const [sessionId] = await db('UserSessions')
        .insert({ userId: user.id })
        .returning('id')

      return response.send({
        accountId: user.id,
        sessionId
      })
    } catch (err) {
      switch (err.message) {
        case 'invalid_grant':
          return response.status(400)
            .json({
              type: 'invalid_code',
              message: "The 'code' parameter is invalid."
            })
        case 'invalid_scopes':
          return response.status(400)
            .json({
              type: 'invalid_scopes',
              message: 'Missing Google-provided permissions on authentication, try to authenticate again.'
            })
        default:
          console.log(err)
          return response.status(400)
            .json({
              type: 'unknown_error',
              message: 'Unknown error'
            })
      }
    }
  }

  async logOut (request:Request, response:Response) {
    const { sessionid } = request.headers
    await db('UserSessions')
      .delete()
      .where({ id: sessionid })
    response.send('OK')
  }

  async validadeAutenticatedRequest (request:Request, response:Response, next:NextFunction) {
    const {
      userid,
      sessionid
    } = request.headers
    if (!userid || !sessionid) {
      return response.status(401)
        .json({
          type: 'unsigned_session',
          message: 'Session not provided. Authentication required.'
        })
    }
    const isValid = await validateSession(sessionid as string, userid as string)
    if (!isValid) {
      return response.status(401)
        .json({
          type: 'invalid_session',
          message: 'Invalid session. Try to authenticate again.'
        })
    }
    return next()
  }

  async retriveUserData (request:Request, response:Response) {
    const { userid } = request.headers
    const [user] = await db('Users')
      .select(['name', 'email', 'picture'])
      .where({ id: userid })
    return response.json(user)
  }

  async deleteUser(request:Request, response:Response){
    const {userid} = request.headers
    await db('Users')
      .delete()
      .where({id:userid})

    response.send('OK')
  }
}

export default AuthController
