//import React from 'react'
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import OAuth from '../components/OAuth';


export default function SignUp() {
  const [formData, setFormData] = useState({}); //save form data
  const [error, setError] = useState(null); //error handling
  const [loading, setLoading] = useState(false); //loading signup button handling
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
        ...formData, //state to keep form data
        [e.target.id]: e.target.value,
        // spread operator to keep the form data in order to not lose  any one of them
      });
  };
  const handleSubmit = async(e) => { //submit function
    e.preventDefault(); // to prevent refreshing the page when submitted
    try {
      setLoading(true);
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json(); //converts response to json
    if(data.success === false){
      console.log(data);
      setLoading(false);
      setError(data.message);
      return; 
    }
    setLoading(false);
    setError(null); //dont show error of json if all is sucessfull
    navigate('/sign-in');
  } catch (error) {
    setLoading(false);
    setError(error.message);
    }
  };
  
  return (
    <body className='dark:bg-darkbody dark:text-darktext'>
      
    <div className="p-3 max-w-lg mx-auto ">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      {/* my-7 margin y 7 top and bottom */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
          id="username" onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email" onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password" onChange={handleChange}
        />
        <button disabled={loading} className="bg-slate-700 text-white p-3 rounded-full uppercase hover:opacity-95 disabled:opacity-80">
          {loading ? 'Loading...' : 'Sign up'}
          
        </button>
        {/* if disabled means when the button is disabled */}
        <OAuth/>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to={"/sign-in"}>
          <span className="text-blue-700 dark:text-orangetext">Sign in</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
    </body>
  );
}
