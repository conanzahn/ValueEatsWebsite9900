import React from 'react';
import AfterLoginHeader from '../Header/AfterLoginHeader';
import SideBar from '../../components/SideBar';
import Vtable from '../../components/Table';
import axios from 'axios';


class MyVoucher extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
        data:[]
    };

  }

componentDidMount (){

    const token = localStorage.getItem('token');
    axios.get('http://localhost:3000/restaurant/myVoucher/', {params:{token}}).then(
        response => {
            this.setState({data:response.data.res});
            
            },
    ).catch(error=>{
        console.log('error',error.data);
    })
}

  render() {
    return (
      <div className="main">
        <div className="container">
          <AfterLoginHeader />
          <body>
            <div class="wrapper d-flex align-items-stretch">
              <SideBar />
              <div id="content" class="p-4 p-md-5">
                <h2 class="mb-4">My Voucher</h2>
                  <Vtable {...this.state}/>
              </div>
            </div>
          </body>
        </div>
      </div>

    )
  }
}



export default MyVoucher;