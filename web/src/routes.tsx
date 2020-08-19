import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Account from './pages/Account'
import Activities from './pages/Activities'
import Activity from './pages/Activity'
import ActivityEditor from './pages/ActivityEditor'
import Home from './pages/Home'
import LogInRedirect from './pages/LogInRedirect'

const Routes:React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/' exact component={Home}/>
        <Route path='/logInRedirect' component={LogInRedirect}/>
        <Route path='/activities' component={Activities}/>
        <Route path='/activity/:id' component={Activity}/>
        <Route path='/newActivity' component={ActivityEditor}/>
        <Route path='/editActivity/:id' component={ActivityEditor}/>
        <Route path='/account' component={Account}/>
      </Switch>
    </BrowserRouter>
  )
}

export default Routes
