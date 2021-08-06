import React from 'react';
import {Link} from "react-router-dom";
import styled from 'styled-components';
import Flex from '../../../components/Flex';

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

const Header = ({}) => {


  return (
    <Nav>
      <Left>
        <Logo className="logo">
          <Highlight>Value  </Highlight>
          Eats
        </Logo>
      </Left>

      <Right>
        <Flex>
          <Link to='/'><NavbarItem>Home</NavbarItem></Link>
          <Link to='/Login'><NavbarItem>Login</NavbarItem></Link>
          <Link to='/Sign-up'><NavbarItem>SignUp</NavbarItem></Link>
          <Link to='/For-Restaurant'><NavbarItem>ForRestaurants</NavbarItem></Link>
        </Flex>
      </Right>
    </Nav>
  );
}

export default Header;
