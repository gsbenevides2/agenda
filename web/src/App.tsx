import React from 'react'

import { AuthProvider } from './auth'
import GlobalStyles from './globalStyles'
import Routes from './routes'

function App () {
  return (
    <AuthProvider>
      <GlobalStyles/>
      <Routes/>
    </AuthProvider>
  )
}

export default App
