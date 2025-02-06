const router = require('express').Router()
const User = require('../modules/user')
const bcrypt = require('bcrypt')
const jwt = require ('jsonwebtoken')
const mongoose = require('mongoose')
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body
        const existingUser = await User.findOne({ username })
        const existingEmail = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "Username Already Exists" })
        }
        if (existingEmail) {
            return res.status(400).json({ message: "Email Already Exists" })
        }
        const hashedPassword=await bcrypt.hash(password,10)
        const newUser = new User({
            username,
            email,
            password:hashedPassword
        })
        await newUser.save()
        return res.status(200).json({ message: "Account created successfully" });
    } catch (error) {
        res.status(400).json({ message: "Internal Server Error" })
    }
})
router.post("/login", async (req, res) => {
    try {
      const { username, password } = req.body
  
      const existingUser = await User.findOne({ username })
      if (!existingUser) {
        return res.status(400).json({ message: "Invalid username" })
      }
  
      const isValidPassword = await bcrypt.compare(password, existingUser.password)
      if (!isValidPassword) {
        return res.status(400).json({ message: "Incorrect Password" })
      }
  
      const token = jwt.sign({ id: existingUser._id, username: username }, "secret_key", { expiresIn: "2d" })
  
      res.status(200).json({ id: existingUser._id, token: token })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Internal Server Error" })
    }
  })
  
module.exports = router