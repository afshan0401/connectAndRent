import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from '../components/ListingItem';




export default function Search() {
  const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({
    // setting default ... piece of state
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });



  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);





  // to load search bar keyword into searchTerm space everytime its changes
  //GET INFO FROM URL TO SIDEBAR


  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm"); //SETTING TO SEARCH TERM
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");
    //CHECK CHANGES IN IF SECTION IN URL CHANGE IN SDEBAR TOO
    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }
    //fetch data
    // fetch listing in a file to get to work with it
    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`); //load search query
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);





  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSidebardata({ ...sidebardata, type: e.target.id });
    } //keeping previous data and seting new data

    if (e.target.id === "searchTerm") {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    } //searchTerm set to e.target.value

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      }); //to chek true or false coz sometimes we receive it in string from searchurl
    }

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";
      //default
      const order = e.target.value.split("_")[1] || "desc";
      //default
      setSidebardata({ ...sidebardata, sort, order });
    }
  };





  const handleSubmit = (e) => {
    e.preventDefault(); //stop from refreshing page
    const urlParams = new URLSearchParams();
    //to keep search term in URL
    // calling to get info
    urlParams.set("searchTerm", sidebardata.searchTerm);
    urlParams.set("type", sidebardata.type);
    urlParams.set("parking", sidebardata.parking);
    urlParams.set("furnished", sidebardata.furnished);
    urlParams.set("offer", sidebardata.offer);
    urlParams.set("sort", sidebardata.sort);
    urlParams.set("order", sidebardata.order);
    //to set values in URl
    const searchQuery = urlParams.toString();
    //convert to string
    navigate(`/search?${searchQuery}`);
    //navigate user to search
  };



//SHOW MORE FN
const onShowMoreClick = async () => {
  const numberOfListings = listings.length;
  //START FROM 10 TO FETCH
  const startIndex = numberOfListings;
  const urlParams = new URLSearchParams(location.search);
  //FETCH DATA BSED ON PREVIOUS DATA
  urlParams.set('startIndex', startIndex);
  const searchQuery = urlParams.toString();
  const res = await fetch(`/api/listing/get?${searchQuery}`);
  const data = await res.json();
  if (data.length < 9) {
    setShowMore(false);
  }
  setListings([...listings, ...data]);
};











  return (
    <div className="flex flex-col md:flex-row dark:bg-darkbody">
      <div className="p-7  border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8 dark:text-darktext">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className=" border rounded-lg p-3 w-full dark:text-black"
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>

          {/* filters */}
          <div className="gap-2 flex-wrap items-center flex">
            <label className="font-semibold">Type:</label>
            <div className="gap-2 hidden">
              <input
                type="checkbox"
                id="all"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.type === "all"}
                // checked if all is set
              />
              <span className>Rent & Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="gap-2 hidden">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.type === "sale"}
              />
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.offer}
              />
              <span>Offer</span>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Amenities:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.parking}
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.furnished}
                //if furnished is true then checked
              />
              <span>Furnished</span>
            </div>
          </div>

          {/* SORTING FILTER */}
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <select
              onChange={handleChange}
              defaultValue={"created_at_desc"}
              //by default set
              id="sort_order"
              className="border rounded-lg p-3 dark:text-black"
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to hight</option>
              {/* not to be set on discount priceas it is not available all time */}
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>

          <button className="bg-orangetext dark:bg-orangetext text-white font-semibold p-3 rounded-lg uppercase hover:opacity-75">
            Search
          </button>
        </form>
      </div>

      <div className="flex-1"> 
      {/* loading to center */}
        <h1 className="text-3xl font-semibold border-b p-3 text-orangetext mt-5">
          Listing Results:
        </h1>
<div className="p-7 flex flex-wrap gap-4">





{
  !loading && listings.length === 0 && (
            <p className='text-xl text-slate-700'>No listing found!</p>
          )}
          {loading && (
            <p className='text-xl text-slate-700 text-center w-full'>
              Loading...
            </p>
          )}


{/* if there is a listing amd using map so key is used*/}


{
  !loading &&
            listings &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))
}

    {/* if showMore is true       */}
{showMore && (
            <button
              onClick={onShowMoreClick}
              className=' font-semibold text-orangetext hover:underline p-7 text-center w-full'
            >
              Load more &rarr;
            </button>
          )}






        </div>
      </div>
    </div>
  );
}
