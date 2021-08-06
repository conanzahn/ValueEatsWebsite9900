import React from 'react';
import HomePage from './HomePage';
import Login from './Login';
import SignUp from './SignUp';
import ForRestaurants from './ForRestaurants';
import Header from '../Header/BeforeLoginHeader';
import '../../main.css';
import Footer from '../Footer';

class Page extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 'HOME',
    };

    this.handlePageChange = this.handlePageChange.bind(this);
  }

  handlePageChange(newPage) {
    this.setState({
      page: newPage,
    });
  }

  render() {
    const { page } = this.state;
    
    return (
      <div className="main">
        <div className="container">
          <Header 
            onPageChange={this.handlePageChange}
            page={page} 
          />
          <div className="pages">
            {page === 'HOME' && (<HomePage />)}
            {page === 'LOGIN' && (<Login />)}         
            {page === 'SIGNUP' && (<SignUp />)}
            {page === 'FORRESTAURANTS' && (<ForRestaurants />)}
          </div>
          <Footer />
        </div>
      </div>
    );
  }
}

export default Page;