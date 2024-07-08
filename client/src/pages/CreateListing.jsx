import { useState } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';



export default function CreateListing() {

  const { currentUser } = useSelector((state) => state.user);
  
  const navigate = useNavigate();

  
  const [files, setFiles] = useState([]);

  const [formData, setFormData] = useState({
    imageUrls: [], //empty array
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 100, //placeholders
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });



  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  console.log(formData);
  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError('Image upload failed (2 mb max per image)');
          setUploading(false);
        });
    } else {
      setImageUploadError('You can only upload 6 images per listing');
      setUploading(false);
    }
  };







//storing image fn for all images

//get info back or reject 
  const storeImage = async (file) => {
    return new Promise((resolve, reject) =>{
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          }); //if no error get url (downloaded url stored in promises)
        }
      );
    });
  };





//delete image fn
  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };





// form submission change 
  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({
        ...formData,
        type: e.target.id,
      }); //anyone of both
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer' //all true or  false data
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked, //true or false
      });
    }

    if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });//[] to get name of id 
    }
  };





//submit data to server
  const handleSubmit = async (e) => {
    e.preventDefault(); //prevent refreshing page
    try {
      if (formData.imageUrls.length < 1)
        return setError('You must upload at least one image');//error for no image
      if (+formData.regularPrice < +formData.discountPrice)// + is to convert them to no. as it can be taken as an string as well 
        return setError('Discount price must be lower than regular price');
      setLoading(true);
      setError(false); //to remove previous error
      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ //in json form data is
          ...formData,
          userRef: currentUser._id, //get id of user
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`); //if all success nagivate to listing
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };





  return (
    <body className='dark:bg-darkbody'>
      
    
    <main className="p-3 max-w-4xl mx-auto dark:bg-darkbody">
      <h1 className="text-3xl font-semibold text-center my-7 dark:text-orangetext">Create Listing</h1>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 dark:text-darktext">
        <div className="flex flex-col gap-4 flex-1">
          {/* flex-1 so columns have same length */}
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg shadow-md"
            id="name"
            maxLength="80"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg shadow-md"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg shadow-md"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className='flex gap-6 flex-wrap'>
            <div className="gap-2 hidden">
              <input type="checkbox" id="sale" className="w-5" onChange={handleChange}
                checked={formData.type === 'sale'}/>
              <span>Sell</span>
            </div>

            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5" onChange={handleChange}
                checked={formData.type === 'rent'}/>
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5" onChange={handleChange}
                checked={formData.parking}/>
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5" onChange={handleChange}
                checked={formData.furnished}/>
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5" onChange={handleChange}
                checked={formData.offer}/>
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
          <div className='flex items-center gap-2'>
              <input
                type='number'
                id='bedrooms'
                min='1'
                max='10'
                required
                className='p-3 border shadow-md dark:text-black border-gray-300 rounded-full' onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='bathrooms'
                min='1'
                max='10'
                required
                className='p-3 border dark:text-black  border-gray-300 rounded-full shadow-md' onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Bathrooms</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='regularPrice'
                min='100'
                max='100000'
                required
                className='p-3 border dark:text-black  border-gray-300 rounded-full shadow-md'  onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
              <p>Regular price</p>
<span className='text-xs'>(₹ / month)</span>
              </div>
            </div>

            {formData.offer && (
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='discountPrice'
                min='0'
                max='100000'
                required
                className='p-3 dark:text-black  border border-gray-300 rounded-full shadow-md' onChange={handleChange}
                  value={formData.discountPrice}
              />
              <div className="flex flex-col items-center">
              <p>Discounted price</p>
              <span className='text-xs'>(₹ / month)</span>
              </div>
            </div>
            )}

           
            
          </div>
        </div>
        <div className='flex flex-col flex-1 gap-4'>
        <p className='font-semibold text-orangetext'>
            Images:
            <span className='font-normal text-gray-600 ml-2'>
              The first image will be the cover (max 6)
              {/* NEED TO INCREASE THIS MAX LIMIT */}
            </span> 
          </p>
          <div className='flex gap-4'>
          <input onChange={(e) => setFiles(e.target.files)} className='p-3 border border-gray-300 rounded-full shadow-md w-full'
              type='file'
              id='images'
              accept='image/*'
              multiple
            />
            <button
              type='button'
              disabled={uploading}
              onClick={handleImageSubmit}
              className='p-3 font-semibold shadow-md text-orangetext border border-orangetext rounded-full uppercase hover:shadow-full disabled:opacity-80'
            >{uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          <p className='text-red-700 text-sm'>{imageUploadError && imageUploadError}</p>


          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              //we have so we must use key
              <div
                key={url}
                className='flex justify-between p-3 border items-center shadow-md'
              >
                <img
                  src={url}
                  alt='listing image'
                  className='w-20 h-20 object-contain rounded-lg shadow-md'
                />
                <button
                  type='button'
                  onClick={() => handleRemoveImage(index)} //callback fn added otherwise it will delete image automatically
                  className='p-3 text-red-700 font-semibold shadow-md rounded-full uppercase hover:opacity-75'
                >
                  Delete
                </button>
              </div>
            ))}


          <button disabled={loading || uploading} className='p-3 bg-orangetext font-semibold text-white rounded-full shadow-md uppercase hover:opacity-95 disabled:opacity-80'>{loading ? 'Creating...' : 'Create listing'}
          </button>
          
          {error && <p className='text-red-700 text-sm'>{error}</p>}

          </div>
          
      </form>
    </main>
    </body>
  );
}
