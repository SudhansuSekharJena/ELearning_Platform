import express from 'express'
import { isAuth } from "../middlewares/isAuth.js"
import { loginUser, myProfile, register, verifyUser } from '../controllers/user.js';
import { addProgress, getYourProgress } from '../controllers/course.js';

const router = express.Router()



router.post("/user/register", register) // register code written in user.js of controller folder

router.post("/user/verify", verifyUser)

// LOGIN USER--> When you login you get message, token, user details
router.post("/user/login", loginUser)

router.get("/user/me", isAuth, myProfile);
router.post("/user/progress", isAuth, addProgress);
router.get("/user/progress", isAuth, getYourProgress); 


export default router;