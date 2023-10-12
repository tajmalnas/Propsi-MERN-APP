import { useContext, useState } from "react"
import { Link, useNavigate} from "react-router-dom"
import { UserContext } from "./UserContext"

const Header = () => {
  const {user} = useContext(UserContext);
  console.log(user)
  const [search,setSearch] = useState('')
  const navigate = useNavigate();

  const searchFunction = (e) => {
    e.preventDefault();
    console.log(search)
    if(search){
      console.log('search')
      navigate('/account/searchedplaces/'+search)
    }
  }

  return (
    <div>
        <header className='p-2 flex justify-between'>
        <Link to='/' className='flex items-center gap-1' href='' >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
        </svg>
        <span className='font-bold text-xl hidden md:block'>Propsi</span>
        </Link>
        <div className="w-44 md:w-96 flex justify-between items-center gap-2 border border-gray-300 rounded-full py-2 px-4 shadow-md shadow-gray-300">
          <input className="w-24 md:w-72 rounded-full px-2" placeholder="Search by city" onChange={e=>setSearch(e.target.value)} />
          <button onClick={searchFunction} className="bg-primary text-white p-1 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
          </button>
        </div> 

        <Link to={user?'/account':'/login'} className='flex items-center gap-2 border border-gray-300 rounded-full py-2 px-4 shadow-gray-300'>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#059669" className="w-5 h-5 hidden md:block">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
        <div className=' text-white rounded-full border border-gray-400 p-1'>
        <svg xmlns="http://www.w3.org/2000/svg" fill="#059669" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#059669" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
        </div>
        {!!user && (
          <div>
            {user.data?user.data.name?user.data.name.slice(0,4):"":user.name?user.name.slice(0,4):""} 
          </div>
        )}
        </Link>
      </header>
    </div>
  )
}

export default Header