import React from 'react';
import AfterLoginHeader from '../Header/AfterLoginHeader';
import VoucherStatus from '../VoucherStatus/VoucherStatus';
import Footer from '../Footer';

class AfterLoginHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username:''
        }
    }

    componentDidMount(){
        const name = localStorage.getItem('username');
        this.setState({username:name});
    }

    render() {
        return (
        <div className="main">
            <div className="container">
            <AfterLoginHeader username = {this.state.username}/>
            <div className="pages">
                <div id="HOME" className="page page--active">
                    <div className="page__header homepage__header">
                    <div className="homepage__title">
                        <h2 className="homepage__name">Welcome</h2>
                        <div className="homepage__position">Online Vouchers for Foodies and Restaurants!</div>
                    </div>
                    </div>
                    <div className="page__content homepage__content">
                    <div>
                        <h3 className="homepage__aboutMeHeader">
                        Our <span className="homepage__aboutMeHeaderHighlight">Recommendations</span> For You!
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
export default AfterLoginHome;