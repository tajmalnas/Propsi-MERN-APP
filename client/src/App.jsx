import './App.css'
import { Route,Routes } from 'react-router-dom'
import IndexPage from './pages/IndexPage'
import LoginPage from './pages/LoginPage'
import Layout from './Layout'
import RegisterPage from './pages/RegisterPage'
import axios from 'axios'
import { UserContextProvider } from './UserContext'
import ProfilePage from './pages/ProfilePage'
import PlacesPage from './pages/PlacesPage'
import PlacesForm from './PlacesForm'
import PlacePage from './pages/PlacePage'
import BookingsPage from './pages/BookingsPage'
import SearchedPlaces from './pages/SearchedPlaces'
axios.defaults.baseURL = 'https://propsi-mern-backend.onrender.com'
axios.defaults.withCredentials = true

function App() {
  return (
    <UserContextProvider>
    <Routes>
      <Route path='/' element={<Layout/>}>
        <Route index element={<IndexPage/>} />
        <Route path='/login' element={<LoginPage/>} />
        <Route path='/register' element={<RegisterPage/>} />
        <Route path="/account" element={<ProfilePage/>}/>
        <Route path="/account/places" element={<PlacesPage/>}/>
        <Route path="/account/places/new" element={<PlacesForm/>}/>
        <Route path="/account/places/:id" element={<PlacesForm/>}/>
        <Route path="/account/bookings" element={<BookingsPage/>}/>
        <Route path="/account/searchedplaces/:address" element={<SearchedPlaces/>} />
        <Route path="/place/:id" element={<PlacePage/>}/>
      </Route>
    </Routes>
    </UserContextProvider>
    
  )
}

export default App
