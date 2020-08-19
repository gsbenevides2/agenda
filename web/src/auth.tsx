import React from 'react'

import { AuthContextType, AuthContextDataType } from './auth_typings'
import api, { backendAuthUrl } from './services/api'

export const AuthContext = React.createContext<AuthContextType>(null)

export const AuthProvider:React.FC = ({ children }) => {
  const [authState, setAuthState] = React.useState<AuthContextDataType>(null)

  function load () {
    const sessionId = localStorage.getItem('sessionId')
    const userId = localStorage.getItem('userId')

    if (sessionId && userId) {
      interface UserResponse {
        name:string;
        email:string;
        picture:string;
      }
      api.get<UserResponse>('/user', {
        headers: { userId, sessionId }
      })
        .then(response => {
          api.defaults.headers.sessionId = sessionId
          api.defaults.headers.userId = userId
          localStorage.setItem('sessionId', sessionId)
          localStorage.setItem('userId', userId)
          setAuthState({
            ...response.data,
            photoUrl: response.data.picture,
            sessionId,
            userId
          })
        })
        .catch(() => {
          setAuthState(false)
        })
    } else {
      console.log('i')
      setAuthState(false)
    }
  }

  React.useEffect(load, [])
  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth () {
  const authContext = React.useContext(AuthContext)

  const isAuthenticated = (function () {
    if (authContext?.authState === false) {
      return false
    } else if (authContext?.authState === null) {
      return null
    } else return true
  }())

  async function authenticate () {
    if (authContext?.setAuthState) authContext.setAuthState(null)
    window.location.href = backendAuthUrl
  }

  function retriveCodeInformation (code:string):Promise<void> {
    interface LoginResponse {
      sessionId:string;
      userId:string
    }
    interface UserResponse {
      name:string;
      email:string;
      picture:string;
    }

    const siteUrlObject = new URL(
      window.location.protocol + '//' +
    window.location.host
    )
    siteUrlObject.pathname = '/logInRedirect'
    return new Promise((resolve, reject) => {
      let sessionId: string
      let userId: string
      api.get<LoginResponse>('/logIn', {
        params: { code, redirectUrl: siteUrlObject.href }
      }).then(loginResponse => {
        sessionId = loginResponse.data.sessionId
        userId = loginResponse.data.userId

        localStorage.setItem('sessionId', sessionId)
        localStorage.setItem('userId', userId)

        api.defaults.headers.sessionId = sessionId
        api.defaults.headers.userId = userId
        return api.get<UserResponse>('/user')
      }).then(userResponse => {
        if (authContext?.setAuthState) {
          authContext.setAuthState({
            ...userResponse.data,
            photoUrl: userResponse.data.picture,
            sessionId,
            userId
          })
          resolve()
        } else {
          reject('unknown_error')
        }
      }).catch(error => {
        console.log(error.response.data.type)
        if (error?.response?.data?.type) reject(new Error(error.response.data.type))
        else reject(new Error('unknown_error'))
      })
    })
  }

  function getUserInfo () {
    if (
      authContext?.authState !== true &&
      authContext?.authState !== false &&
      authContext?.authState
    ) {
      return {
        name: authContext.authState.name,
        photoUrl: authContext.authState.photoUrl,
        email: authContext.authState.email
      }
    }
  }
  return {
    isAuthenticated,
    authenticate,
    retriveCodeInformation,
    api: isAuthenticated ? api : null,
    userInfo: isAuthenticated ? getUserInfo() : null
  }
}
