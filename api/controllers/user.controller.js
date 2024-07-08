import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

// used to test insomnia
export const test = (req, res) => {
    res.json({
        message: 'API ROUTE IS WORKING',
    });
};


export const updateUser = async (req, res, next) => {
if(req.user.id !== req.params.id) return next (errorHandler(401, 'Unauthorized!'));
try {
    if(req.body.password) {
        req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updateUser = await User.findByIdAndUpdate(req.params.id, {
        $set:{
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            avatar: req.body.avatar,
        }
    }, 
    {new: true}
)
const {password, ...rest} = updateUser._doc;
res.status(200).json(rest);
} catch (error) {
    next(error);
}
};


export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id)
      return next(errorHandler(401, 'You can only delete your own account!'));
    try {
      await User.findByIdAndDelete(req.params.id);
      res.clearCookie('access_token');
      res.status(200).json('User has been deleted!');
    //   we can add .clearCookie('access_token') but not needed as cookie becomes invalid
    } catch (error) {
      next(error);
    }
  };



  export const getUserListings = async (req, res, next) => { //only to authorized user by cheking ID
    if (req.user.id === req.params.id) {
      try {
        const listings = await Listing.find({ userRef: req.params.id });
        res.status(200).json(listings); //return listing fn in josn format
      } catch (error) {
        next(error); //middleware to handle errors
      }
    } else {
      return next(errorHandler(401, 'You can only view your own listings!'));
    }
  };






  export const getUser = async (req, res, next) => {
    try {
      
      const user = await User.findById(req.params.id);
      
      //if landlord not found then
      if (!user) return next(errorHandler(404, 'User not found!'));
      //bringing user back but not passwd so we seperate the password
      const { password: pass, ...rest } = user._doc;
      res.status(200).json(rest);
    } catch (error) {
      next(error);
    }
  };