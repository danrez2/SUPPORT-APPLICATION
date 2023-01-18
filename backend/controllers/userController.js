const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

// @desc Register a new user
// @route /api/users
// @accsse public
const registerUser = asyncHandler(async (req, res) => {
    const {name, email, password} = (req.body)

    //Validation
    if(!name || !email || !password) {
        res.status(400)
        throw new Error('please include all fields')
    }

    // find if user already exists
    const userExists = await User.findOne({email})
    if(userExists){
        res.status(400)
        throw new Error('user already exists')
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    })

    if(user){
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else{
        res.status(400)
        throw new Error('Invalid user data')
    } 
})
// @desc Login a user
// @route /api/users/login
// @accsse public

const loginUser = asyncHandler(async(req, res) => {
    const {email, password} = req.body

    const user = await User.findOne({email})

     // check user and password match
    if(user && (await bcrypt.compare(password, user.password))){
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })

    } else{
        res.status(401)
        throw new Error('invalid credentials')
    }
   
})

// @desc get curret user
// @route /api/users/me
// @accsse private
const getMe = asyncHandler(async (req, res) => {
    const user={
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
    }
res.status(200).json(user)


})

// generate token
const generateToken = (id) =>{
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

module.exports = {
    registerUser,
    loginUser,
    getMe,
}