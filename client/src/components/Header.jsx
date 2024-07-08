import { FaSearch } from "react-icons/fa"; //search icon import from react icons package.
import { Link, useNavigate } from "react-router-dom"; //from on epage to another without refreshing the page
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';






export default function Header() {



  const { currentUser } = useSelector(state => state.user); //creating private profile page here
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    //js constructor urlPrams to keep preveious queries in the url
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString(); //convert all to string
    navigate(`/search?${searchQuery}`);
    //search with all queries
  };


//to keep search term in search box
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);



 
  return (

    <header className="bg-bgheader shadow-md  dark:bg-darkheader">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className=" font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-logobrown">Connect</span>
            <span className="text-h1inner">&</span>
            <span className="text-logobrown">Rent</span>
          </h1>
        </Link>
        <form onSubmit={handleSubmit} className="bg-slate-100 p-3 rounded-full shadow-md flex items-center">
          {/* flex item center for search and icon to be side by side and center */}
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/* to remove border of search when clickled, can also add middle size for middle size devices */}
          <button>

          <FaSearch className="text-slate-600" />
          </button>
        </form>
        <ul className="flex gap-4 font-semibold">
          <Link to="/">
            <li className="rounded-lg p-3 hidden sm:inline text-slate-700  hover:shadow-[rgba(238,_114,_87,_0.5)_0px_8px_15px] dark:text-darktext">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="rounded-lg p-3 hidden sm:inline text-slate-700  hover:shadow-[rgba(238,_114,_87,_0.5)_0px_8px_15px] dark:text-darktext">
              About
            </li>
          </Link>
          <Link to="/profile">
            {currentUser ? (
              <img className="rounded-full h-7 w-7 object-cover"  src={currentUser.avatar} alt="profile_picture" />
            ) : (
              <li className="rounded-lg p-3 hidden sm:inline text-orangetext  hover:shadow-[rgba(238,_114,_87,_0.5)_0px_8px_15px] dark:text-darktext">Sign in</li>
            )}
        </Link>
      </ul>
    </div>
    </header >
    
  );
}
