// const Groq = require('groq-sdk/index.mjs')
// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
// const Profile = require("../models/Profile")

// const chat = async (req, res) => {
//   try {
//     const { profileId, message } = req.body

//     if (!profileId || !message) {
//       return res.status(404).json({ message: 'Data Missing' })
//     }

//     const profile = await Profile.findById(profileId)
//     if (!profile) {
//       return res.status(404).json({ message: 'Profile not found' })
//     }

//     const context = `
//       You are an AI assistant that answers questions about a LinkedIn profile.
//       Only answer based on the data provided below. If you don't know, say so.

//       NAME: ${profile.name}

//       EXPERIENCE:
//       ${profile.experience.join('\n')}

//       EDUCATION:
//       ${profile.education.join('\n')}

//       SKILLS:
//       ${profile.skills.join('\n')}

//       POSTS & ACTIVITY:
//       ${profile.posts.join('\n')}
//     `

//     const completion = await groq.chat.completions.create({
//       model: 'llama-3.3-70b-versatile',
//       messages: [
//         { role: 'system', content: context },
//         { role: 'user', content: message }
//       ],
//     })

//     const response = completion.choices[0].message.content

//     res.status(200).json({ message: response })

//   } catch (err) {
//     console.log(err)
//     res.status(500).json({ message: err.message })
//   }
// }

// module.exports = { chat }

const axios = require('axios')
const Profile = require('../models/Profile')

const chat = async (req, res) => {
  try {
    const { profileId, message } = req.body

    if (!profileId || !message) {
      return res.status(400).json({ message: 'Data Missing' })
    }

    const profile = await Profile.findById(profileId)
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' })
    }

    // Call FastAPI RAG service
    const ragResponse = await axios.post('http://127.0.0.1:8000/query', {
      profile_id: profileId,
      question: message
    })

    res.status(200).json({ message: ragResponse.data.answer })

  } catch (err) {
    console.log(err)
    res.status(500).json({ message: err.message })
  }
}

module.exports = { chat }