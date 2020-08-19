import React from 'react'
import { Helmet } from 'react-helmet'
import { useHistory } from 'react-router-dom'

import EmptyImage from '../../assets/empty.svg'
import PlusIcon from '../../assets/plus.svg'
import { useAuth } from '../../auth'
import Loader from '../../components/Loader'
import {
  Container,
  SyncMessage,
  ActivityList,
  ActivityItem,
  ActivityTitle,
  ActivityClassroom,
  ActivityDate,
  WarningImage,
  WarningMessage,
  AddButton,
  Header
} from './styles'
interface ActivityInterface {
  id:string;
  name: string;
  date: string;
  courseWorkId: string;
  courseName: string;
  courseId: string;
  classroomUrl: string;
  isClassroom: boolean
}

const parseDate = (stringDate:string) => {
  const date = new Date(stringDate)

  return new Intl.DateTimeFormat('pt-BR').format(date)
}

const Activities:React.FC = () => {
  const [synchronizing, setSynchronizing] = React.useState(false)
  const [activities, setActivities] = React.useState<null | ActivityInterface[]>(null)
  const { isAuthenticated, api, userInfo } = useAuth()
  const history = useHistory()

  async function load () {
    if (isAuthenticated && api) {
      const response = await api.get<ActivityInterface[]>('activities')
      setActivities(response.data)
    } else if (isAuthenticated === false) {
      history.push('/')
    }
  }
  function sync () {
    setSynchronizing(true)
    return new Promise(async resolve => {
      if (isAuthenticated && api) {
        const { data: processId } = await api.post('classroomSync/start')
        const interval = setInterval(async () => {
          const { data: status } = await api.get('/classroomSync/status', {
            params: { processId }
          })
          if (status === 'finished') {
            clearInterval(interval)
            setSynchronizing(false)
            resolve()
          }
        }, 500)
      }
    })
  }

  React.useEffect(() => {
    load()
      .then(sync)
      .then(load)
    // eslint-disable-next-line
  }, [isAuthenticated])

  return (
    <Container>
      <Helmet>
        <title>Agenda - Atividades</title>
      </Helmet>
      <Header>
        <h2>Atividades</h2>
        <img
          onClick={() => history.push('/account')}
          src={userInfo?.photoUrl}
          alt='Foto do usuario'/>
      </Header>
      {synchronizing && <SyncMessage>Sincronizando com Classroom</SyncMessage>}
      {activities && activities !== null &&
      <ActivityList>
        {activities.map(activity => (
          <ActivityItem key={activity.id} onClick={() => {
            history.push(`activity/${activity.id}`)
          }}>
            <ActivityTitle>{activity.name}</ActivityTitle>
            {activity.isClassroom && <ActivityClassroom>{activity.courseName}  - Google Classroom</ActivityClassroom>}
            {activity.date && <ActivityDate>Data de Entrega: {parseDate(activity.date)}</ActivityDate>}
            {!activity.date && <ActivityDate>Sem Data de Entrega.</ActivityDate>}
          </ActivityItem>
        ))}
      </ActivityList>
      }
      {activities?.length === 0 &&
    <>
      <WarningImage src={EmptyImage}/>
      <WarningMessage>Que bom. Você não tem atividades.</WarningMessage>
    </>
      }
      {activities === null &&
    <>
      <Loader/>
      <WarningMessage>Carregando Atividades</WarningMessage>
    </>
      }
      <AddButton onClick={() => history.push('/newActivity')}>
        <img src={PlusIcon} alt='plus icon'/>
      </AddButton>
    </Container>
  )
}

export default Activities
