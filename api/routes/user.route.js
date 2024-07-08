import express from 'express';
import { deleteUser, test, updateUser, getUserListings, getUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';



const router= express.Router();

router.get('/test', test);
router.post('/update/:id',verifyToken, updateUser);
//use token in cookie  for authentication. in not then we get error
router.delete('/delete/:id', verifyToken, deleteUser) // fn created in user.controller
router.get('/listings/:id', verifyToken, getUserListings) //listing page
router.get('/:id', verifyToken, getUser)




export default router; //exports to index.js