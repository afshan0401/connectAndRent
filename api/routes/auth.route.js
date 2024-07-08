import express from 'express';
import {google, signOut, signin, signup} from '../controllers/auth.controller.js';

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google",google );  
//backend for google auth (fn is in auth.controller)
router.get('/signout', signOut);

export default router;