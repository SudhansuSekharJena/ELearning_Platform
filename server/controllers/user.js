import { User } from "../models/user.js";
import bcrypt from "bcrypt"; // used for hashing password securely
import jwt from 'jsonwebtoken' // used for creating and verifying json webtokern
import sendMail from "../middlewares/sendMail.js";
import TryCatch from "../middlewares/TryCatch.js";

// Create Register API
export const register = async(req, res)=>{
  try {
    const { email, name, password } = req.body

    let user = await User.findOne({email})
    // Checks if a user with the eamil is present in db, if present the  400  -> user present

    if(user) return res.status(400).json({message: "User Already exists"})

    // encrypt password with hashtable and salt
    const hashPassword = await bcrypt.hash(password, 10) // 10 is the salt rounds. hashing algo will be applied in 2^10 iterations
    

    // create user with the data given
    user = {
      name,
      email,
      password: hashPassword,
    }

    // generate OTP
    const otp = Math.floor(Math.random() * 1000000);

    // Token creation jwt.sign(payload, secret, options)
    // activationToken will contain otp in it.
    const activationToken = jwt.sign({
      user,
      otp,
    }, process.env.Activation_Secret,
    {
      expiresIn: "5m",
    });

    // this data is to be send in email
    const data = {
      name,
      otp,
    }

    await sendMail(
      email,
      "E learning",
      data
    )

    res.status(201).json({
      message: "Otp send to your mail",
      activationToken
    });
  } catch (error) {
    res.status(500).json({message: error.message})
  }
}


//
export const verifyUser = TryCatch(async (req, res) => {
  // activationToken contains:
  // 1. payload = {user: {name, email, password}, otp}
  // 2. Activation_Secret
  // 3. option --> { expiresIn: "5m"} --> means expires in 5 minutes.

  const { otp, activationToken } = req.body;

  // After registration, get activationToken -> activationToken is companred and verified with Activation_Secret that we have in the system
  // if verified then payload is returned and stored in verify.
  const verify = jwt.verify(activationToken, process.env.Activation_Secret)

  if(!verify){
    return res.status(401).json({message: "Invalid Token"})
  }

  if(verify.otp !== otp){
    return res.status(400).json({message: "Wrong OTP"})
  }

  // If valid then create User // user is an object
  // user-> name, email, password
  await User.create({
    name: verify.user.name,
    email: verify.user.email,
    password: verify.user.password,
  })

  res.status(200).json({message: "User registered"})

})

export const loginUser = TryCatch( async(req, res) => {
  const { email, password } = req.body;
  // 1st checking the User match
  const user = await User.findOne({email}) // return user object

  if(!user){
    return res.status(400).json({message: "No user with this email"})
  }
  // Chekcing the password match
  // if user present then match the user's password in database with the passowrd user is entering

  // compares entered passowrd with the hashed password
  const matchPassword = await bcrypt.compare(password, user.password);

  if(!matchPassword){
    return res.status(400).json({message: "Wrong Password"})
  }

  // if both cases passes then we will create a token which will be helpful during login.
  // jwt -> jsonwebtoken
  // jwt.sign( payload, secret, option )
  const token = jwt.sign(
    { _id: user._id} ,
    process.env.Jwt_Secret,
    { expiresIn: "15d" }
  )

  // then token and user[total user details] is sent.
  
  res.json({
    message: `Welcome back ${user.name}`,
    token,
    user,
  })
})


// Fetching my profile --> only need token
export const myProfile = TryCatch( async (req, res)=>{
  const user = await User.findById(req.user._id)
  res.json({ user , id: req.user._id})
})