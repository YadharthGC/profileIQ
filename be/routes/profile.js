const express = require("express")
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const { analyze, getAllProfiles } = require("../controllers/profileController")

router.post("/analyze", protect, analyze)
router.get("/profiles", protect, getAllProfiles)

module.exports = router