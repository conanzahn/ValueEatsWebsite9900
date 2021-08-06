import React from 'react';
import Header from '../Header/BeforeLoginHeader';
import Footer from '../Footer';
import VoucherStatus from '../VoucherStatus/VoucherStatus';

class HomePage extends React.Component {

    render() {
        return (
        <div className="main">
            <div className="container">
            <Header />
            <div className="pages">
              <div id="HOME" className="page page--active">
                <div className="page__header homepage__header">
                  <div className="homepage__title">
                  
                    <h2 className="homepage__name">Value Eats</h2>
                    <div className="homepage__position">Online Vouchers for Foodies and Restaurants!</div>
                  </div>
                </div>
                <div className="page__content homepage__content">
                  <div>
                    <h3 className="homepage__aboutMeHeader">
                      Our <span className="homepage__aboutMeHeaderHighlight">Top Eateries</span>
                    </h3>
                  </div>
                </div>
                <VoucherStatus />
              </div>
              
            </div>
              <Footer />
            </div>
        </div>
        );
    }
}

export default HomePage;