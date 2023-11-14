import React from 'react'
import './footer.css'


function Footer() {
  return (
    <footer>
        <div className='footer-content'>
            <p>&copy; {new Date().getFullYear()} MovieFusion</p>
        </div>
    </footer>
  )
}


export default Footer;