import React from 'react'
import { NavLink } from 'react-router-dom'
import "./Footer.css";
import '@fortawesome/react-fontawesome';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faCartPlus, faUser } from '@fortawesome/free-solid-svg-icons'
export default function FooterNav () {
        return (
            <div className='nav-container'>
                <li>
                    <NavLink to="/trackPage">
                    <FontAwesomeIcon icon={faHome}/>
                    &nbsp;<span>HOME</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/dashboard">
                    <FontAwesomeIcon icon={faCartPlus}/>
                        &nbsp;<span>DATA</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/me">
                    <FontAwesomeIcon icon={faUser}/>
                    &nbsp;<span>ME</span>
                    </NavLink>
                </li>
            </div>
        )
}
