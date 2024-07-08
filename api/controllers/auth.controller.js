import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup = async(req, res, next) => {
//body - req from browser
// console.log(req.body);

const { username, email, password} = req.body;

const hashedPassword = bcryptjs.hashSync(password, 10); 
//10 is just a no which will combine with the passwd and make it encrypted. AND hashSync is used so await is not needed.

const newUser = new User({username, email, password: hashedPassword});

try{
    await newUser.save() //as we used await so we need to use fn as asynchronous not syunchronus above
    res.status(201).json("User created successfully");
    // The HTTP status code 201 is commonly used in RESTful APIs to indicate successful creation of a resource.
} catch(error){

//res.status(500).json(error.message); //500 code for internal server error
//can use this if we have too many API routes so we need a middleware(in index.js)
next(error);
//next(errorHandler(550, 'error from the function')); from the fn errorhandler
}
};

export const signin = async(req, res, next) => {
    const {email, password} = req.body; //use data for signin username can also be used
    try {
        const validUser = await User.findOne({email: email}); //both key and value same one can be deleted
        //User.model.js is used to chk mongoose for email vlaidation
        if(!validUser) return next(errorHandler(404,'User not found!'));
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if(!validPassword) return next(errorHandler(401,'Invalid credentials!'));
        // to authenticate user we add cookie in browser by creating hashtoken and inserting it in cookies of the browser . authentication is done with help of cookies
        const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET);
            //secret key for app it can be any no. like the encyrption of bcrypt. MAKES TOKEN COMPLETELY UNIQUES LIKE SALT OF BCRYPT (CREATES UNIQUE USER ID AND SECURE) ADDED TO ENVIRONMENTAL VARIABLE
        const {password: pass, ...rest} = validUser._doc; // this is returned as before we were rturnig validuser and it was also returnig hased password which we do not want so we return rest
        res.cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
        //date can be added of expiery of cookies 
        catch (error) {
        next(error);
    }
};


export const google = async (req, res, next) => {

try {
   const user =  await User.findOne({ email: req.body.email});
   if (user) {
const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET);
const { password: pass, ...rest} = user._doc;
res
    .cookie( 'access_token', token, {httpOnly: true})
    .status(200)
    .json(rest);
   }
   else{
// to generate passwd as google sign-in doesnt provide one - user can cahnge it later
    const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
    //36 means 0-9 ans A-Z and slice for last 8 digits .... a total of 16 digit paswd
   const hashedPassword= bcryptjs.hashSync(generatedPassword, 10);
   const newUser = new User({ username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4) , email: req.body.email, password: hashedPassword, avatar: req.body.photo});
   await newUser.save();
   const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET);
   const { password: pass, ...rest } = newUser._doc;
   res.cookie('access_cookie', token, {httpOnly: true }).status(200).json(rest);
   } 

}
catch (error) { 
    next(error);
}

};


export const signOut = async (req, res, next) => {
    try {
      res.clearCookie('access_token');
      res.status(200).json('You have been logged out!');
    } catch (error) {
      next(error);
    }
  };