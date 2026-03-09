const { chromium } = require('playwright')
const Profile = require('../models/Profile')
const axios = require('axios')

const getAllProfiles = async (req, res) => {
  try {
    console.log(req.user._id)
    const profiles = await Profile.find({ userId: req.user._id })
    console.log(profiles)
    res.status(200).json({ profiles })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: err
    })
  }
}

const autoScroll = async (page, times) => {
  for (let i = 0; i < times; i++) {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(2000)
  }
}

const loginToLinkedIn = async (page) => {
  console.log('Logging into LinkedIn...')
  await page.goto('https://www.linkedin.com/login', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(2000)
  await page.fill('#username', process.env.LINKEDIN_EMAIL)
  await page.fill('#password', process.env.LINKEDIN_PASSWORD)
  await page.click('button[type="submit"]')
  await page.waitForTimeout(4000)
  console.log('Logged in!')
}

const analyze = async (req, res) => {
  try {
    const { url } = req.body

    if (!url) {
      return res.status(400).json({ message: 'LinkedIn URL is required' })
    }

    const profileUrl = url.endsWith('/') ? url : url + '/'
    console.log('Scraping:', profileUrl)

    const browser = await chromium.launch({ headless: false })

    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    })

    const page = await context.newPage()

    // Login first
    await loginToLinkedIn(page)

    // ---- BASIC PROFILE ----
    console.log('Fetching profile...')
    await page.goto(profileUrl, { waitUntil: 'domcontentloaded', timeout: 60000 })
    await page.waitForTimeout(4000)
    await autoScroll(page, 3)

    const profile = await page.evaluate(() => {
      const getText = (selector) => document.querySelector(selector)?.innerText?.trim() || ''
      return {
        name: getText('h1') || getText('.top-card-layout__title'),
        headline: getText('.text-body-medium.break-words') || getText('.top-card-layout__headline'),
        location: getText('.text-body-small.inline.t-black--light.break-words') || '',
        about: getText('#about ~ * .full-width') || '',
      }
    })

    // ---- EXPERIENCE ----
    console.log('Fetching experience...')
    await page.goto(profileUrl + 'details/experience/', { waitUntil: 'domcontentloaded', timeout: 60000 })
    await page.waitForTimeout(3000)
    await autoScroll(page, 3)

    const experience = await page.evaluate(() => {
      const selectors = [
        '.pvs-list__item--line-separated',
        '.pvs-list__paged-list-item',
        'li.artdeco-list__item'
      ]
      for (const sel of selectors) {
        const items = document.querySelectorAll(sel)
        if (items.length > 0) {
          return Array.from(items)
            .map(item => item.innerText?.trim())
            .filter(t => t.length > 10)
        }
      }
      return []
    })

    // ---- EDUCATION ----
    console.log('Fetching education...')
    await page.goto(profileUrl + 'details/education/', { waitUntil: 'domcontentloaded', timeout: 60000 })
    await page.waitForTimeout(3000)
    await autoScroll(page, 2)

    const education = await page.evaluate(() => {
      const selectors = [
        '.pvs-list__item--line-separated',
        '.pvs-list__paged-list-item',
        'li.artdeco-list__item'
      ]
      for (const sel of selectors) {
        const items = document.querySelectorAll(sel)
        if (items.length > 0) {
          return Array.from(items)
            .map(item => item.innerText?.trim())
            .filter(t => t.length > 10)
        }
      }
      return []
    })

    // ---- SKILLS ----
    console.log('Fetching skills...')
    await page.goto(profileUrl + 'details/skills/', { waitUntil: 'domcontentloaded', timeout: 60000 })
    await page.waitForTimeout(3000)
    await autoScroll(page, 2)

    const skills = await page.evaluate(() => {
      const selectors = [
        '.pvs-list__item--line-separated',
        '.pvs-list__paged-list-item',
        'li.artdeco-list__item'
      ]
      for (const sel of selectors) {
        const items = document.querySelectorAll(sel)
        if (items.length > 0) {
          return Array.from(items)
            .map(item => item.innerText?.trim())
            .filter(t => t.length > 2)
        }
      }
      return []
    })

    // ---- POSTS ----
    console.log('Fetching posts...')
    await page.goto(profileUrl + 'recent-activity/all/', { waitUntil: 'domcontentloaded', timeout: 60000 })
    await page.waitForTimeout(3000)
    await autoScroll(page, 10)

    const posts = await page.evaluate(() => {
      const selectors = [
        '.feed-shared-update-v2',
        '.occludable-update',
        '[data-urn]'
      ]
      for (const sel of selectors) {
        const items = document.querySelectorAll(sel)
        if (items.length > 0) {
          return Array.from(items)
            .map(item => item.innerText?.trim())
            .filter(t => t && t.length > 20)
            .slice(0, 30)
        }
      }
      return []
    })

    await browser.close()

    console.log('✓ Name:', profile.name)
    console.log('✓ Experience:', experience.length)
    console.log('✓ Education:', education.length)
    console.log('✓ Skills:', skills.length)
    console.log('✓ Posts:', posts.length)

    // ---- SAVE TO MONGODB ----
    console.log('Saving to MongoDB...')
    const savedProfile = await Profile.create({
      userId: req.user._id,
      name: profile.name,
      education,
      experience,
      skills,
      posts,
    })

    console.log('✓ Saved to MongoDB:', savedProfile._id)

    // Send to FastAPI for RAG indexing
    console.log('Indexing in RAG...')
    await axios.post('http://127.0.0.1:8000/index', {
      profile_id: savedProfile._id.toString(),
      name: profile.name,
      experience,
      education,
      skills,
      posts
    })
    console.log('✓ RAG indexed!')

    res.status(200).json({
      message: 'Profile scraped and saved successfully',
      chatId: savedProfile._id,
      name: profile.name,
      headline: profile.headline,
    })

  } catch (err) {
    console.log(err)
    res.status(500).json({ message: err.message })
  }
}


module.exports = { analyze, getAllProfiles }