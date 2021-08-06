import React from 'react';
import {
    Link,
    Redirect
} from "react-router-dom";
import styled from 'styled-components';
import Flex from '../../../components/Flex';
import UserDropdown from '../../../components/UserDropdown';
import {Form, Button} from "react-bootstrap";


const Highlight = styled.span`
  color: #eb8a23;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 500;
`;

const Nav = styled(Flex)`
  padding: 15px 0;
  align-items: center;
`;

const Left = styled.div`
  flex: 1;
`;

const Right = styled.div`
`;

const NavbarItem = styled.button`
  border: 0;
  background: transparent;
  cursor: pointer;
  padding: 30px;
  text-decoration: none;
  color: #49515d;
  font-size: 17px;
  opacity: ${({ active }) => active ? '1' : '0.6'};
  display: block;
  transition: opacity 0.3s ease-in-out;

  &::after {
    content: "";  
    width: ${({ active }) => active ? '24px' : '0'};
    border-bottom: 3px solid #eb8a23;
    margin: auto;
    margin-top: 4px;
    display: block;
    transition: width 0.3s ease-in-out;
  }

  &:hover {
    opacity: 1;
  }

  &:hover::after {
    width: 24px;
  }

  &:last-of-type {
    padding-right: 0;
  }
`;

class AfterLoginHeader extends React.Component {
  constructor (props) {
        super (props);

        this.state = {
          search:'',
          searchResults:[],
          noResult:'',
          isSubmit:''
        };
        
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

  handleSearchChange=(event)=> {
      this.setState({search: event.target.value});
  }

  handleSubmit (event){
      event.preventDefault();
      this.setState({isSubmit:true})
  }

  render(){
    const {isSubmit, search} = this.state
    if(isSubmit === true){
      return(
        <Redirect to={`/Search-Results/${search}`}>
        </Redirect>
      )
    }

    return (
      <Nav>
        <Left>
          <Logo className="logo">
            <Highlight>Value  </Highlight>
            Eats
          </Logo>
        </Left>

        <Form className="d-flex" onSubmit={this.handleSubmit}>
          <Form.Control
            type="search"
            placeholder="Search eatery name, postcode, cuisine..."
            className="mr-3"
            aria-label="Search"
            name='search'
            onChange={this.handleSearchChange}
          />
          <Button variant="outline-primary" type='submit'>Search</Button>
        </Form>

        <Right>
          <Flex>
            <Link to='/User'><NavbarItem>Home</NavbarItem></Link>
            <UserDropdown />
          </Flex>
        </Right>
      </Nav>
    );
  }

  
}

export default AfterLoginHeader;
