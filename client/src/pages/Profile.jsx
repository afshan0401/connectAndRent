import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserFailure,
  signOutUserSuccess,
  signOutUserStart,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux"; //to dispatch above import
import { Link } from 'react-router-dom';
export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  //piece of state to show uploading percentage from console log to webpage
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false); //state to handle error
  const [formData, setFormData] = useState({}); // {} - empty string
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();
  // firebase storage rules
  // allow read;
  //     allow write: if
  //     request.resource.size < 2 *1024 * 1024 &&
  //     request.resource.contentType.matches('image/.*')

  useEffect(() => {
    if (file) {
      handleFileUpload(file); //passing file below
    }
  }, [file]); //upload file to firebase storage
  const handleFileUpload = (file) => {
    const storage = getStorage(app); //app is exported from firebase.js
    const fileName = new Date().getTime() + file.name;
    // to always get unique file name
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    // uploadBytesResumable - shows percentage of the uploading also shows error etc.

    uploadTask.on(
      "state_changed", //tracks changes
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100; //to show percentage of transferred bytes
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  //console.log(formData);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json(); //convert data to json
      if (data.success === false) {
        dispatch(updateUserFailure(data.message)); //error msg
        return;
      }
      //if all okay
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      //otherwise
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      //converts response to json
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(data.message));
    }
  };



  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };




  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId) //update previous listing data by filtering removed id listing
      );
    } catch (error) {
      console.log(error.message);
    }
  };










  return (
    <body className="dark:bg-darkbody">
      
    
    <div className="p-3 max-w-lg mx-auto ">
      <h1 className="text-3xl font-semibold text-center my-7 dark:text-darktext">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        {/* references upload file to image below */}
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="profilepicture"
          className="rounded-full shadow-lg h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error uploading image (image must be less than 2 mb){" "}
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Image successfully uploaded</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="username"
          defaultValue={currentUser.username}
          className="border p-3 rounded-lg shadow-md"
          id="username"
          onChange={handleChange} //event listener
        />
        <input
          type="email"
          placeholder="email"
          defaultValue={currentUser.email}
          className="border p-3 rounded-lg shadow-md"
          id="email"
          onChange={handleChange} //event listener
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg shadow-md"
          id="password"
          onChange={handleChange} //event listener
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white shadow-md rounded-full p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          className='bg-green-700 text-white p-3 rounded-full shadow-md uppercase text-center hover:opacity-95'
          to={'/create-listing'}
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer font-semibold"
        >
          Delete account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer font-semibold">
          Sign out
        </span>
      </div>
      <p className="text-red-700 mt-5 font-semibold">{error ? error : ""}</p>
      <p className="text-green-700 mt-5 font-semibold">
        {updateSuccess ? "Update successfull!" : ""}
      </p>
      <button onClick={handleShowListings} className='text-green-700 w-full font-semibold'>Show Listings</button>
      <p className='text-red-700 mt-5 font-semibold'>
        {showListingsError ? 'Error showing listings' : ''}
      </p>


      {userListings && userListings.length > 0 && (
        <div className='flex flex-col gap-4'>
          <h1 className='text-center mt-7 text-2xl font-semibold dark:text-darktext'>
            Your Listings
          </h1>
          {/* gives each listing below */}
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className='border rounded-lg shadow-md p-3 flex justify-between items-center gap-4 '
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt='listing cover'
                  className='h-16 w-16 shadow-md rounded-lg object-contain'
                />
              </Link>
              <Link
                className='text-orangetext font-semibold  hover:underline truncate flex-1'
                to={`/listing/${listing._id}`}
              >
                <p className="dark:text-darktext">{listing.name}</p>
              </Link>

              <div className='flex flex-col item-center'>
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className='text-red-700 uppercase'
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className='text-green-700 uppercase'>Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}




    </div>
    </body>
  );
}
