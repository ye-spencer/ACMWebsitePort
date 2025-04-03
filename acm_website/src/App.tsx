import { useState } from 'react'
import './App.css'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import EventsPage from './pages/EventsPage'

function App() {
  const [currentPage, setCurrentPage] = useState('home')

  const navigateTo = (page: string) => {
    setCurrentPage(page)
  }

  return (
    <div className="App">
      {currentPage === 'home' && <HomePage navigateTo={navigateTo} />}
      {currentPage === 'about' && <AboutPage navigateTo={navigateTo} />}
      {currentPage === 'events' && <EventsPage navigateTo={navigateTo} />}
    </div>
  )
}

export default App
