import db from '../database/connection'

export default async function (sessionId:string, accountId:string) {
  const session = await db('UserSessions')
    .select('*')
    .where({
      userId: accountId,
      id: sessionId
    })

  return session.length === 1
}
