const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv')

dotenv.config()

const PORT = process.env.PORT || 5000
const app = express()

connectDB()

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())
app.use(cookieParser())

// Routes
app.use('/auth', require('./routes/auth'))
app.use('/profile', require('./routes/profile'))
app.use('/chat', require('./routes/chat'))

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))