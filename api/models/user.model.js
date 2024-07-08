import  mongoose  from "mongoose";
// must be string no other and REQUIRED (nos and boolean not allowed for username, no user can be added without username and must be unique)
const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        
    },
    email:{
        type: String,
        required: true,
        unique: true,
        
    },
    password:{
        type: String,
        required: true,
    },
    avatar:{
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    },
}, 
{timestamps: true}); // used to sort data acc to time

const User = mongoose.model('User', userSchema); //automatically takes user and users
 
export default User;