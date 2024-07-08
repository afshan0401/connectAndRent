import React from 'react'
import { FaEnvelope, FaPhone, FaClock } from 'react-icons/fa';
//for contact section

export default function About() {
  return (
    <body className='dark:bg-darkbody'>
    <div className='py-20 px-4 max-w-6xl mx-auto dark:bg-darkbody'>
      
      <main class="container mx-auto px-4 py-12">
      <h1 className='text-slate-700  text-5xl lg:text-7xl font-bold mb-4'>
        <span className='text-orangetext'>About </span>
         <span className='text-logobrown'>Us </span>
        </h1>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="space-y-4 mt-4 " >
        <p class="text-slate-600 dark:text-darktext">
        We weren't born into the traditional real estate mold. We started with a spark - a desire to make the homebuying journey exceptional, transparent, and empowering. Tired of the industry's confusing jargon and hidden fees, we embarked on a mission to build something different.
        </p>
        <p class="text-slate-600 dark:text-darktext">
        This led us to create Connect & Rent. We're a team of passionate individuals with a proven track record in the industry, but more importantly, a genuine love for helping people achieve their dream of homeownership. We believe the process should be exciting, stress-free, and tailored to your unique wants and needs.
        </p>
        <p class="text-slate-600 dark:text-darktext">
        What sets us apart? It's not just about selling houses; it's about building relationships.  We take the time to understand your vision, guide you through the intricacies of the market, and celebrate your success. We leverage cutting-edge technology to streamline the process and empower you with real-time information. With Connect & Rent, you're not just a client; you're part of our vibrant community.
        </p>
        <p class="text-slate-600 dark:text-darktext">
        Join us on this journey to simplify real estate and turn your dream of homeownership into a reality.
        </p>
      </div>

      
      {/* <h1 className="font-bold leading-none">
            <span className="text-logobrown text-9xl flex flex-col">Connect</span> 
            <span className="text-orangetext text-custom-size">&</span>
            <span className="text-logobrown text-9xl">Rent</span> 
          </h1> */}
          <div className='flex flex-col leading-none text-logobrown'>
          <p className="font-bold text-9xl ">Connect</p>
          <p className="font-bold text-9xl">
          <span className='text-custom-size text-orangetext'>&</span>
          Rent</p>
          </div>



          {/* <div className='flex justify-center items-center'>   
      <img src="https://firebasestorage.googleapis.com/v0/b/connect-and-rent-2002095.appspot.com/o/connectandrent.png?alt=media&token=ad02f4eb-8178-4623-83a4-317df2074d60" alt="Connect & Rent" class="rounded-lg max-w-md mx-auto"/>
      </div> */}
    </div>

    





    <h1 className='text-orangetext text-4xl lg:text-6xl font-bold mt-20 mb-4'>
        <span className='text-logobrown'>Have </span>
         Queries? 
         <span className='text-logobrown'> Shoot us </span>
          <br />
          an email.
        </h1>




        <div class="flex flex-col space-y-4 mt-10">
  <div class="flex items-center space-x-2">
    <FaEnvelope className="h-3 w-3 text-slate-700 font-bold dark:text-darktext" />
    <span class="text-gray-700 font-bold dark:text-darktext">Email:</span>
    <a href="mailto:youremail@example.com" class="text-blue-500 hover:underline">connect_and_rent@gmail.com</a>
  </div>
  <div class="flex items-center space-x-2">
    <FaPhone className="h-3 w-3 text-slate-700 font-bold dark:text-darktext" />
    <span class="text-gray-700 font-bold dark:text-darktext">Phone:</span>
    <span class="text-gray-700 dark:text-darktext">(+91) 9117854256</span>
  </div>
  <div class="flex items-center space-x-2">
    <FaClock className="h-3 w-3 text-slate-700 font-bold dark:text-darktext" />
    <span class="text-gray-700 font-bold dark:text-darktext">Timings:</span>
    <span class="text-gray-700 dark:text-darktext">Mon-Fri: 9:00 AM - 5:00 PM</span>
  </div>
</div>




  </main>
    </div>
    </body>
  )
}
