import './App.scss'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainPage from './components/mainPage'
import LoginPage from './components/login'
import RegisterPage from './components/register'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profileiq" element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App