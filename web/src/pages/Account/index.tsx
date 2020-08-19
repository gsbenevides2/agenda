import React from 'react'
import { Helmet } from 'react-helmet'
import { useHistory } from 'react-router-dom'

import { useAuth } from '../../auth'
import Button from '../../components/Button'
import {
  Container,
  Image,
  Name,
  Email
} from './styles'

function improveQuality (url:string) {
  const re = /s\d*-c/g
  const b = url.replace(re, 's400-c')
  return b
}

const Account:React.FC = () => {
  const { isAuthenticated, api, userInfo } = useAuth()
  const history = useHistory()

  async function load () {
    if (isAuthenticated === false) {
      history.push('/')
    }
  }
  function handleLogOut () {
    const isConfirmed = window.confirm('Deseja realmente sair da sua conta?')
    if (api && isConfirmed) {
      api.get('/logOut')
        .then(() => {
          localStorage.clear()
          window.location.href = window.location.origin
        })
    }
  }
  function handleDeleteUser () {
    const isConfirmed = window.confirm('Deseja deletar sua conta?')
    if (api && isConfirmed) {
      api.delete('/user')
        .then(() => {
          localStorage.clear()
          window.location.href = window.location.origin
        })
    }
  }

  React.useEffect(() => {
    load()
    // eslint-disable-next-line
  }, [isAuthenticated])
  return (
    <Container>
      <Helmet>
        <title>Agenda - Conta</title>
      </Helmet>
      <Image src={userInfo?.photoUrl ? improveQuality(userInfo.photoUrl) : ''} alt='Foto de usuario'/>
      <Name>{userInfo?.name}</Name>
      <Email>{userInfo?.email}</Email>
      <Button onClick={handleDeleteUser}>Deleter Conta</Button>
      <Button onClick={handleLogOut}>Sair</Button>
    </Container>
  )
}

export default Account
