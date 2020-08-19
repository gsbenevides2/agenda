import React from 'react'
import { Helmet } from 'react-helmet'
import { useHistory, useParams } from 'react-router-dom'

import { useAuth } from '../../auth'
import Button from '../../components/Button'
import Input, { Label, InputBlock } from '../../components/Input'
import { Container } from './styles'

interface Params {
  id?:string
}

function parseDate (date:Date) {
  function normalizeNumber (num:number) {
    if (String(num).length === 1) return `0${num}`
    else return String(num)
  }
  const stringDate = `${date.getUTCFullYear()}-${normalizeNumber(date.getUTCMonth() + 1)}-${normalizeNumber(date.getUTCDate())}`
  return stringDate
}

const ActivityEditor:React.FC = () => {
  const [name, setName] = React.useState('')
  const [date, setDate] = React.useState('')
  const { isAuthenticated, api } = useAuth()
  const history = useHistory()
  const params = useParams() as Params

  async function load () {
    if (isAuthenticated && api && params.id) {
      api.get(`activity/${params.id}`)
        .then(({ data }) => {
          setName(data.name)
          setDate(parseDate(new Date(data.date)))
        })
    } else if (isAuthenticated === false) {
      history.push('/')
    }
  }

  function handleSubmit (e:React.FormEvent) {
    e.preventDefault()
    const dateSplited = date.split('-').map(Number)
    const timestamp = +new Date(
      dateSplited[0],
      --dateSplited[1],
      dateSplited[2]
    )
    if (api) {
      if (params.id) {
        api.put(`activity/${params.id}`, {
          name,
          date: timestamp
        }).then(() => {
          alert('Atividade Salvo')
          history.push('/activities')
        })
      } else {
        api.post('activity', {
          name,
          date: timestamp
        }).then(() => {
          alert('Atividade Salvo')
          history.push('/activities')
        })
      }
    }
  }

  React.useEffect(() => {
    load()
    // eslint-disable-next-line
  }, [isAuthenticated])

  return (
    <Container>
      <Helmet>
        <title>Agenda - {params.id ? 'Editar' : 'Criar'} Atividade</title>
      </Helmet>
      <h2>{params.id ? 'Editar' : 'Criar'} Atividade</h2>
      <form
        onSubmit={handleSubmit}
        autoComplete='off'>
        <InputBlock>
          <Label htmlFor='name'>Nome da Atividade:</Label>
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            id='name'
            type='text'
            required/>
        </InputBlock>
        <InputBlock>
          <Label htmlFor='date'>Data de Entrega:</Label>
          <Input
            type='date'
            id='date'
            value={date}
            required
            onChange={e => setDate(e.target.value)}
          />
        </InputBlock>
        <Button type='submit'>Salvar</Button>
      </form>
    </Container>
  )
}

export default ActivityEditor
