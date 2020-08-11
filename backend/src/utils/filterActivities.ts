// eslint-disable-next-line no-unused-vars
import { Activity as ClassroomActivity } from '../services/google'

interface Activity {
  id:string;
  courseWorkId:string;
  courseId: string;
}
export default function filterActiviyies (dbActivities:Activity[], classroomActivities:ClassroomActivity[]) {
  const deleteActivities = dbActivities.filter(dbActivity => {
    return !classroomActivities.some(classroomActivity => {
      return dbActivity.courseId === classroomActivity.courseId && dbActivity.courseWorkId === classroomActivity.courseWorkId
    })
  })
  const updateActivities = dbActivities.filter(dbActivity => {
    return classroomActivities.some(classroomActivity => {
      return dbActivity.courseId === classroomActivity.courseId && dbActivity.courseWorkId === classroomActivity.courseWorkId
    })
  })
  const insertActivities = classroomActivities.filter(classroomActivity => {
    return dbActivities.every(dbActivity => {
      return !(dbActivity.courseId === classroomActivity.courseId && dbActivity.courseWorkId === classroomActivity.courseWorkId)
    })
  })
  return { deleteActivities, updateActivities, insertActivities }
}
