import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState('');
  //initial value empty string
  const onChange = (e) => {
    setMessage(e.target.value);
  };






  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandlord(); //call fn
  }, [listing.userRef]);




  return (
    <>
    {/* if there is a landlord then */}  
      {landlord && (
        <div className='flex flex-col gap-2 dark:text-darktext'>
          <p>
            Contact <span className='font-semibold'>{landlord.username}</span>{' '}
            for{' '}
            <span className='font-semibold'>{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            name='message'
            id='message'
            rows='2'
            value={message}
            onChange={onChange}
            placeholder='Enter your message here...'
            className='w-full border p-3 rounded-lg shadow-md dark:text-black'
          ></textarea>
{/* used Link to activate the email */}
          <Link
          to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
          className='text-white text-center p-3 uppercase rounded-full shadow-md hover:opacity-95 font-semibold bg-orangetext'
          >
            Send Message          
          </Link>
        </div>
      )}
    </>
  );
}
