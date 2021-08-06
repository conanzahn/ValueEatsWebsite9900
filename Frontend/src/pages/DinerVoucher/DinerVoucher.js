import React from 'react';
import AfterLoginHeader from '../Header/AfterLoginHeader';
import SideBar from '../../components/SideBar';
import ValidTable from './components/VTable/ValidTable/index';
import PastTable from './components/VTable/PastTable/index';
import styled from 'styled-components';
import axios from 'axios';

const TableTitle = styled.div`
  padding: 15px 0;
  font-weight: 10px;
`;

class DinerVoucher extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
        vTable:[],
        pTable:[],
    };

  }

  componentDidMount (){

      const token = localStorage.getItem('token');
      axios.get('http://localhost:3000/users/dinerVoucher/', {params:{token}}).then(
          response => {
              this.setState({vTable:response.data.valid_voucher});
              this.setState({pTable:response.data.past_voucher});

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
                <TableTitle>
                    <h4>Valid reservations</h4>
                    <ValidTable vTable = {this.state.vTable}/>
                </TableTitle>
                
                <TableTitle>
                    <h4>Past reservations</h4>
                    <PastTable pTable = {this.state.pTable}/>
                </TableTitle>
                  
              </div>
            </div>
          </body>
        </div>
      </div>

    )
  }
}



export default DinerVoucher;