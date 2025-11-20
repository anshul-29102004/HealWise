import React from 'react'
import About from './pages/About.jsx'
import Appointment from './pages/Appointment.jsx'
import Contact from './pages/Contact.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import MyAppointments from './pages/MyAppointments.jsx'
import MyProfile from './pages/MyProfile.jsx'
import Doctors from './pages/Doctors.jsx'
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import SymptomChecker from './pages/SymptomChecker.jsx'
import Vacancies from './pages/Vacancies.jsx'
import MyApplications from './pages/MyApplications.jsx'


const App = () => {
  return (
    <div className='max-w-full sm:mx-[10%]'>
      <ToastContainer/>
      <Navbar />
      
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/appointment/:docId' element={<Appointment />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/doctors' element={<Doctors />} />
        <Route path='/doctors/:speciality' element={<Doctors />} />
        <Route path='/Home' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/my-appointments' element={<MyAppointments />} />
        <Route path='/my-profile' element={<MyProfile />} />
        <Route path='/symptom-checker' element={<SymptomChecker/>}/>
        <Route path='/vacancies' element={<Vacancies/>}/>
        <Route path='/my-applications' element={<MyApplications/>}/>
      </Routes>

      <Footer/>
      
    </div>
  )
}

export default App
