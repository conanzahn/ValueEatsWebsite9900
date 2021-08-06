import React from 'react';
import {withRouter, Switch, Route} from "react-router-dom";
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import ForRestaurants from './pages/ForRestaurants';
import Forgot from './pages/Forgot';
import AfterLoginHome from './pages/AfterLoginHome';
import HomePage from './pages/HomePage';
import DinerProfile from './pages/DinerProfile';
import CreateVoucher from './pages/CreateVoucher/CreateVoucher';
import MyVoucher from './pages/MyVoucher';
import VoucherDetail from './pages/VoucherDetail/VoucherDetail';
import BookVoucher from './pages/BookVoucher/BookVoucher';
import NavigateEatery from './pages/NavigateEatery/NavigateEatery';
import DinerVoucher from './pages/DinerVoucher/DinerVoucher';
import MySubscription from './pages/MySubscription/MySubscription';
import VerifyVoucher from './pages/VerifyVoucher/VerifyVoucher';
import Voucher from './pages/VerifyVoucher/voucher';
import AddReviews from './pages/AddReviews/AddReviews'
import SearchResult from './pages/SearchResult/SearchResult';

class App extends React.Component {

  render() {
    
    return (
      <Switch>
        {/* <Route path="/" exact component={Page}/> */}
        <Route path="/Login" exact component={Login}/>
        <Route path="/Sign-up" exact component={SignUp}/>
        <Route path="/For-Restaurant" exact component={ForRestaurants}/>
        <Route path="/" exact component={HomePage}/>
        <Route path="/Forgot" component={Forgot}/>
        <Route path="/User" component={AfterLoginHome}/>
        <Route path="/DinerProfile" component={DinerProfile}/>
        <Route path="/Create-Voucher" component={CreateVoucher}/>
        <Route path="/My-Voucher" component={MyVoucher}/>
        <Route path="/Voucher-Detail/:id" component={VoucherDetail}/>
        <Route path="/Book-Voucher" component={BookVoucher}/>
        <Route path="/Navigate-Eatery/:name" component={NavigateEatery}/>
        <Route path="/Diner-Voucher" component={DinerVoucher}/>
        <Route path="/Verify-Voucher" component={VerifyVoucher}/>
        <Route path="/My-Subscription" component={MySubscription}/>
        <Route path="/voucher" component={Voucher}/>
        <Route path="/add-reviews/:res_name" component={AddReviews}/>
        <Route path="/Search-Results/:search" component={SearchResult}/>
      </Switch>
    );
  }
}

export default withRouter(App); 