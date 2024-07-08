import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv'; //called .env
dotenv.config(); //initialized dotenv to use env file below
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import cookieParser from 'cookie-parser';



mongoose.connect(process.env.MONGO).then(() => {
    console.log('CONNECTED TO MONGODB!!!');
}).catch((err) => {
    console.log(err);
})

const app = express();

app.use(express.json());

app.use(cookieParser());

app.listen(3000, () =>{
    console.log('Server is running on port 3000!!!'); 
    //returning statement call back fn
});

// app.get('/test', (req, res) =>{
//     res.send('Hello World');
// }); // req from client and response(from server side) to it this is a test api (can send back anything a file an object or text etc)

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter); //insomnia REST is used to test this
app.use("/api/listing", listingRouter);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500; //statuscode from this MIDDLEWARE, next is for middleware
    const message = err.message || 'Internal Server Error'; //alternatibe to message is this error text
    return res.status(statusCode).json(
        {
        success: false,
        statusCode, 
        //variable and key hAVE SAME NAME SO WE CAN REMOVE ONE OF THEM
        message,
        //THIS IS THE AUTH ERROR HANDLING PART

    });
});