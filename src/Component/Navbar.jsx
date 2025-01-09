import React from 'react'
import { NavLink } from 'react-router-dom'

function Navbar() {
  return (
    <nav>
        <ul><li><NavLink to={'/'}>Home</NavLink></li>
            <li><NavLink to={'/admin'}>AdminStart</NavLink></li>
            <li><NavLink to={'/multigame'}>Multigame</NavLink></li>
        
        </ul>
    </nav>
  )
}

export default Navbar