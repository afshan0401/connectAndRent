import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth';
import { app } from '../firebase';
import {useDispatch} from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import {useNavigate} from 'react-router-dom';
export default function OAuth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);




// Resolver function for Firebase authentication
const authResolver = async () => {
    try {
        return await signInWithPopup(auth, provider);
    } catch (error) {
        throw new Error("Could not sign in with Google: " + error.message);
    }
};

const result = await authResolver(); // Calling the resolver function

const res = await fetch('/api/auth/google',{
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({name: result.user.displayName, email: result.user.email, photo: result.user.photoURL}),
});
const data = await res.json();
dispatch(signInSuccess(data));
navigate('/');




// upto her resolver is used customised




            // const result = await signInWithPopup;{auth, provider, resolver};

            // console.log(result);
        } catch (error) {
            console.log("Could not sign in with google", error);
        }
    };
    return (
        <button
            onClick={handleGoogleClick} type= 'button'
            className="bg-red-700 text-white p-3 rounded-full uppercase hover:opacity-95">
            continue with google
        </button>
        //by default its a submit button
    );
};
