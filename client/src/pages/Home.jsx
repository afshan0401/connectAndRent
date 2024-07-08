import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';





export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);
  console.log(offerListings);







  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };



    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        log(error);
      }
    };
    fetchOfferListings();
  }, []);






  return (
    <div className="dark:bg-darkbody">
      {/* top */}
      <div className="flex flex-col sm:flex-row p-4">
      <div className='flex flex-col flex-1 items-center gap-6 pb-28 pt-10 sm:pl-40 pl-4 px-1 max-w-6xl mx-auto'>
        <h1 className='text-black font-bold text-3xl  opacity-65 lg:text-6xl dark:text-darktext'>
        Connecting <span className='text-orangetext'>Renters </span>
         <span>& </span>
         <span className='text-orangetext'>Homeowners </span>
          <br />
          with ease
        </h1>
        <div className='text-gray-500 text-xs sm:text-sm'>
        Connect & Rent: Your Premier Destination for Your Ideal Home.
          <br />
          Discover our vast selection of properties curated just for you and start your journey to finding the perfect place to call home with us.
          <br />
          <br />
          <br />
        
          <Link
          to={'/search'}
          className='text-sm sm:text-xl text-orangetext font-bold hover:underline'
        >
          Let's get started...
        </Link>
        </div>
       
      </div>




      {/* swiper */}
      <Swiper navigation className='sm:rounded-tl-full sm:w-1/2 w-full'>
  {offerListings &&
    offerListings.length > 0 &&
    offerListings.map((listing) => (
      <SwiperSlide key={listing._id}>
        <img
          src={listing.imageUrls[0]}
          alt=""
          className='h-[500px] w-full object-cover'
        />
      </SwiperSlide>
    ))}
</Swiper>
</div>




      {/* listing results for offer, sale and rent */}

      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {offerListings && offerListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-orangetext'>Recent offers</h2>
              <Link className='text-sm text-blue-800 dark:text-blue-400 hover:underline' to={'/search?offer=true'}>Show more offers</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-orangetext'>Recent places for rent</h2>
              <Link className='text-sm text-blue-800 dark:text-blue-400 hover:underline' to={'/search?type=rent'}>Show more places for rent</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {/* {saleListings && saleListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-orangetext'>Recent places for sale</h2>
              <Link className='text-sm text-blue-800 dark:text-blue-400 hover:underline' to={'/search?type=sale'}>Show more places for sale</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
}
