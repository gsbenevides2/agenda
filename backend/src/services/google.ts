/* eslint-disable camelcase */
import { google } from 'googleapis'
import dotenv from 'dotenv'

dotenv.config()

const {
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
} = process.env

const scopes = [
  'openid',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/classroom.courses.readonly',
  'https://www.googleapis.com/auth/classroom.student-submissions.me.readonly'
]
export function getAuthUrl () {
  const oauth = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  )
  const url = oauth.generateAuthUrl({
    scope: scopes,
    access_type: 'offline'
  })
  return url
}

export async function retriveCodeInformation (code:string) {
  const oauth = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  )
  function verifyConcededScopes (scopesToVerify:string[]) {
    console.log(scopesToVerify)
    const verifiedScopes = scopes.map(scope => scopesToVerify.includes(scope))
    return verifiedScopes.every(result => result)
  }

  const responseToken = await oauth.getToken(code)
  const {
    access_token,
    refresh_token,
    id_token,
    scope
  } = responseToken.tokens
  if (scope && !verifyConcededScopes(scope.split(' '))) {
    throw new Error('invalid_scopes')
  }
  const payload = (await oauth.verifyIdToken({
    idToken: id_token as string,
    audience: CLIENT_ID
  })).getPayload()

  return {
    name: payload?.name as string,
    picture: payload?.picture as string,
    email: payload?.email as string,
    accessToken: access_token as string,
    refreshToken: refresh_token as string
  }
}

interface GoogleDate {
  day:number;
  month:number;
  year:number;
}
export interface Activity {
  courseWorkId: string;
  name: string;
  date?:Date;
  courseName: string;
  courseId: string;
  classroomUrl: string;
}
interface PendentActivitiesAndTokensResult {
  tokens?:{
    accessToken:string;
    refreshToken:string;
  };
  activies:Activity[];
}
function parseGoogleDate (date?:GoogleDate) {
  if (date) {
    return new Date(`${date.year}-${date.month}-${date.day}Z`)
  } else return undefined
}
export async function getPendentActivitiesAndTokensUpdates (accessToken:string, refreshToken:string):Promise<PendentActivitiesAndTokensResult> {
  const result:PendentActivitiesAndTokensResult = {
    activies: []
  }

  const oauth = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  )
  oauth.on('tokens', tokens => {
    result.tokens = {
      accessToken: tokens.access_token as string,
      refreshToken: tokens.refresh_token as string
    }
  })
  oauth.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken
  })

  const activies:Array<Activity> = []
  const classroom = google.classroom({
    version: 'v1',
    auth: oauth
  })
  const courses = await classroom.courses.list({
    studentId: 'me',
    courseStates: ['ACTIVE']
  })
  const promises = courses.data.courses?.map(async (course) => {
    const courseWorks = await classroom.courses.courseWork.list({
      courseId: course.id as string,
      courseWorkStates: ['PUBLISHED']
    })
    const promises = courseWorks.data.courseWork?.map(async courseWork => {
      const { data: studentSubmissions } = await classroom.courses.courseWork.studentSubmissions.list({
        courseId: course.id as string,
        courseWorkId: courseWork.id as string,
        states: ['NEW', 'CREATED', 'RECLAIMED_BY_STUDENT']
      })
      if (studentSubmissions.studentSubmissions?.length) {
        activies.push({
          courseWorkId: courseWork.id as string,
          name: courseWork.title as string,
          date: parseGoogleDate(courseWork.dueDate as GoogleDate),
          courseName: course.name as string,
          courseId: course.id as string,
          classroomUrl: courseWork.alternateLink as string
        })
      }
    })
    if (promises) await Promise.all(promises)
  })
  if (promises) await Promise.all(promises)
  result.activies = activies
  return result
}
