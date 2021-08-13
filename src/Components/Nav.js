import React,{ useState } from 'react'
import "./Nav.css"
import { Link } from 'react-router-dom' 
import Search from './Search'
function Nav() {
  const [ searchBox , setSearchBox ] = useState(false) 
  const [ searchTerm , setSearchTerm ] = useState("")
  return (
    <div className="navbar">
      <div className="nav">
        <img className="nav__logo"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png" alt="" />
        <input value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} onClick={()=>{console.log("Trying to search");setSearchBox(!searchBox)}} className="nav__search" type="text" placeholder="Search" />
        {searchBox? <Search searchTerm={searchTerm}/> : ""}
        <div className="nav__buttons">
          <Link to='/home'><ion-icon name="home"></ion-icon></Link>
          <ion-icon name="send-outline"></ion-icon>
          <ion-icon name="compass-outline"></ion-icon>
          <ion-icon name="heart-outline"></ion-icon>
          <Link to='/user'><ion-icon name="person-circle-outline"></ion-icon></Link>
        </div>
      </div>
    </div>
  )
}

export default Nav
