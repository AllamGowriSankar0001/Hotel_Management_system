import { Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './components/layout'
import Login from './pages/login'
import Dashboard from './pages/dashboard'
import Rooms from './pages/rooms'
import Housekeeping from './pages/housekeeping'
import Users from './pages/users'
import Reservation from './pages/reservation'
function App() {

  return (
    <>
    <Routes>

      <Route path='/login' element={<Login/>}/>
      <Route path="/" element={<Layout />} >
          <Route  index   element={<Dashboard/>}/>

          <Route  index path='dashboard'  element={<Dashboard/>}/>
          <Route path='rooms' element={<Rooms/>}/>
          <Route path='reservation'   element={<Reservation/>}/>
          <Route path='housekeeping'   element={<Housekeeping/>}/>
          <Route path='users'   element={<Users/>}/>

      </Route>
      
    </Routes>
    </>
  )
}

export default App
