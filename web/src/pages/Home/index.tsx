import React from 'react'
import { Helmet } from 'react-helmet'
import { useHistory } from 'react-router-dom'

import loginHero from '../../assets/login_hero.svg'
import { useAuth } from '../../auth'
import Button from '../../components/Button'
import Loader from '../../components/Loader'
import { Container, HeroImage, Footer } from './styles'

const Home:React.FC = () => {
  const { isAuthenticated, authenticate } = useAuth()
  const history = useHistory()

  React.useEffect(() => {
    if (isAuthenticated) history.push('/activities')
  }, [history, isAuthenticated])

  return (
    <Container>
      <Helmet>
        <title>Agenda - Welcome</title>
      </Helmet>
      <HeroImage src={loginHero} alt='A ilustração de uma fechadura e uma pessoa do lado.'/>
      <div>
        <h1>Seja bem-vindo</h1>
        {isAuthenticated === false &&
           <>
             <p>Para continuar necessito que você faça login</p>
             <Button onClick={authenticate}>Fazer login com o Google</Button>
           </>}
        {isAuthenticated === null && <Loader/>}
      </div>
      <Footer>Feito com &#128153; por Gsbenevides</Footer>
    </Container>
  )
}

export default Home
