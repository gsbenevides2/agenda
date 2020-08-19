import React from 'react'
import { useHistory } from 'react-router-dom'

import AccessDeniedImage from '../../assets/access_denied.svg'
import WarningImage from '../../assets/warning.svg'
import { useAuth } from '../../auth'
import Button from '../../components/Button'
import Loader from '../../components/Loader'
import { Container, Image } from './styles'

type ErrorCodes =
  'invalid_grant' |
  'invalid_scopes' |
  'unknown_error' |
  'invalid_code'

const LogInRedirect:React.FC = () => {
  const [error, setError] = React.useState<null | ErrorCodes >(null)
  const { authenticate, retriveCodeInformation } = useAuth()
  const history = useHistory()

  function load () {
    const urlThisPage = new URL(window.location.href)

    const code = urlThisPage.searchParams.get('code')
    console.log(code)
    if (!code) return setError('invalid_grant')
    retriveCodeInformation(code)
      .then(() => {
        history.push('/activities')
      })
      .catch(error => {
        setError(error.message)
      })
  }
  React.useEffect(load, [])
  return (
    <Container>
      {error === null && <Loader/>}
      {error === null && <h3>Aguarde, estamos concluindo a autenticação.</h3>}

      {error === 'unknown_error' && <Image src={WarningImage}/>}
      {error === 'unknown_error' && <h3>Ops ocorreu tente novamente.</h3>}

      {error === 'invalid_grant' && <Image src={WarningImage}/>}
      {error === 'invalid_grant' && <h3>Ops ocorreu tente novamente.</h3>}

      {error === 'invalid_code' && <Image src={WarningImage}/>}
      {error === 'invalid_code' && <h3>Ops ocorreu tente novamente.</h3>}

      {error === 'invalid_scopes' && <Image src={AccessDeniedImage}/>}
      {error === 'invalid_scopes' && <h3>Ops parece que você não me liberou o Classroom tente novamente.</h3>}

      {error && <Button onClick={authenticate}>Tentar Novamente</Button>}
    </Container>
  )
}

export default LogInRedirect
