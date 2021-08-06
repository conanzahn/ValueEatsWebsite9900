import React from "react";
import { Nav, NavDropdown} from 'react-bootstrap';
import {
    Link
} from "react-router-dom";

class UserDropdown extends React.Component {

  constructor(props) {
    super(props);
    this.state={
      username:''
    }
  }

  componentDidMount(){
    const name = localStorage.getItem('username');
    this.setState({username: name})
  }
  
  logOut(){
    localStorage.clear();
  }

  render () {
    const is_eatery = localStorage.getItem('is_eatery');
    return (
      <div className="drop">
        <Nav className="mr-auto">
          <NavDropdown title={this.state.username} id="basic-nav-dropdown">
            <Link to='/DinerProfile'><NavDropdown.Item href="#action/3.1">Profile</NavDropdown.Item></Link>
            {(is_eatery === 'true') && (
              <Link to='/Create-Voucher'><NavDropdown.Item href="#action/3.1">Create Voucher</NavDropdown.Item></Link>
            )}

            {(is_eatery === 'true') && (
              <Link to='/My-Voucher'><NavDropdown.Item href="#action/3.1">My Voucher</NavDropdown.Item></Link>
            )}
            
            {(is_eatery === 'false') && (
              <Link to='/Diner-Voucher'><NavDropdown.Item href="#action/3.1">My Voucher</NavDropdown.Item></Link>
            )}
            
            {(is_eatery === 'true') && (
              <Link to='/Verify-Voucher'><NavDropdown.Item href="#action/3.1">Verify Voucher</NavDropdown.Item></Link>
            )}
            
            {(is_eatery === 'false') && (
              <Link to='/My-Subscription'><NavDropdown.Item href="#action/3.1">My Subscription</NavDropdown.Item></Link>
            )}
            
            <Link to='/' onClick={this.logOut}>
              <NavDropdown.Item href="#action/3.2">
                Log Out
              </NavDropdown.Item>
            </Link>  
             
            
          </NavDropdown>
        </Nav>
      </div>
    )
  }
}

export default UserDropdown;