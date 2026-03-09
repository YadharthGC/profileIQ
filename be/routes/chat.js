const express = require('express')
const router = express.Router()
const { chat } = require('../controllers/chatController')
const { protect } = require('../middleware/authMiddleware')

router.post('/message', protect, chat)

module.exports = router