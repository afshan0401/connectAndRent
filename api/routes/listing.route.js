import express from 'express';
import { createListing, deleteListing, updateListing, getListing, getListings} from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/verifyUser.js';


const router = express.Router(); //create router using express

router.post('/create', verifyToken, createListing); //cant create listing if not authenticated
router.delete('/delete/:id', verifyToken, deleteListing);
router.post('/update/:id', verifyToken, updateListing);
router.get('/get/:id', getListing); //get info of id to show in update listing . (not secure so no need to verify as evryone can see it )
router.get('/get', getListings); 
//for search functionality and no auth req
export default router;
