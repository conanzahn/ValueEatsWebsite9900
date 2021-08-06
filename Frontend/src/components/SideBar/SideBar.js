import React from 'react';
import './style.css';
import user from '../../assets/img/user.png';
import {
    Link
} from "react-router-dom";

class SideBar extends React.Component {
    render(){
        const is_eatery = localStorage.getItem('is_eatery');
        return(
            <nav id="sidebar">
                <div class="p-4 pt-5">
                    <img src={user} class="img logo rounded-circle mb-5"/>
                    <ul class="list-unstyled components mb-5">

                    <li>
                        <Link to='/DinerProfile'>Profile</Link>
                    </li>
                    {(is_eatery === 'true') && (
                        <li>
                            <Link to='/Create-Voucher'>Create Voucher</Link>
                        </li>
                    )}
                    
                    {(is_eatery === 'true') && (
                        <li>
                            <Link to='/My-Voucher'>My Voucher</Link>
                        </li>
                    )}

                    {(is_eatery === 'false') && (
                        <li>
                            <Link to='/Diner-Voucher'>My Voucher</Link>
                        </li>
                    )}
                    
                    {(is_eatery === 'true') && (
                        <li>
                            <Link to='/Verify-Voucher'>Verify Voucher</Link>
                        </li>
                    )}

                    {(is_eatery === 'false') && (
                        <li>
                            <Link to='/My-Subscription'>My Subscription</Link>
                        </li>
                    )}
                    </ul>

                </div>
            </nav>
        )
    }
}

export default SideBar;

