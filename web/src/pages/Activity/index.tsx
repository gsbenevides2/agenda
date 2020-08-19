import React from 'react'
import { Helmet } from 'react-helmet'
import { useHistory, useParams } from 'react-router-dom'

import { useAuth } from '../../auth'
import Button from '../../components/Button'
import { Container } from './styles'

interface ActivityInterface {
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

interface ParamsInterface{
  id:string;
}

const Activity:React.FC = () => {
  const [activity, setActivity] = React.useState<ActivityInterface | null>(null)
  const { isAuthenticated, api } = useAuth()
  const history = useHistory()
  const { id: activityId } = useParams() as ParamsInterface

  async function load () {
    if (isAuthenticated && api) {
      const response = await api.get<ActivityInterface>(`activity/${activityId}`)
      setActivity(response.data)
    } else if (isAuthenticated === false) {
      history.push('/')
    }
  }

  function handleDeleteActivity () {
    const isConfirmed = window.confirm('Deseja excluir?')
    if (api && isConfirmed) {
      api.delete(`activity/${activityId}`)
        .then(() => {
          alert('Atividade Excluida')
          history.push('/activities')
        })
    }
  }
  function handleEditActivity () {
    history.push('/editActivity/' + activityId)
  }

  React.useEffect(() => {
    load()
    // eslint-disable-next-line
  }, [isAuthenticated])
  return (
    <Container>
      <Helmet>
        <title>Agenda - Atividade</title>
      </Helmet>
      {activity &&
      <>
        <h2>{activity.name}</h2>
        {activity.isClassroom &&
        <span>{activity.courseName}</span>
        }
        {activity.date
          ? (<span>Data de Entrega: {parseDate(activity.date)}</span>)
          : (<span>Sem data de entrega.</span>)
        }
        {activity.isClassroom &&
        <Button onClick={() => window.open(activity.classroomUrl)}>Ver no Google Classroom</Button>
        }
        <Button onClick={() => history.push('/activities')}>Voltar para as Atividades</Button>
        {!activity.isClassroom &&
        <>
          <Button onClick={handleEditActivity}>Editar</Button>
          <Button onClick={handleDeleteActivity}>Deletar</Button>
        </>
        }
      </>
      }
    </Container>
  )
}

export default Activity
