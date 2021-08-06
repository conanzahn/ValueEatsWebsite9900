import React from 'react';
import AfterLoginHeader from '../Header/AfterLoginHeader';
import { Card } from "react-bootstrap";
import {
  Link
} from "react-router-dom";
import SideBar from '../../components/SideBar';
import styled from 'styled-components';
import axios from 'axios';

const Tit = styled.div`
  color: black;
  font-weight: bold;
  font-size: x-large;
`;


class VoucherDetail extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
        details:[],
    };
  }

  componentDidMount (){
    const {id} = this.props.match.params;
    const token = localStorage.getItem('token');
    axios.get('http://localhost:3000/restaurant/myVoucherDetails/', {params:{id,token}}).then(
        response => {
            this.setState({details: response.data.voucher})
            },
    ).catch(error=>{
        console.log('error',error.data);
    })
  }


  render() {
    const {details} = this.state;
    return (
      <div className="main">
        <div className="container">
          <AfterLoginHeader />
        
          <body>
            <div class="wrapper d-flex align-items-stretch">
              <SideBar />
              <div id="content" class="p-4 p-md-5">

                <h2 class="mb-4">Voucher Detail</h2>
                <Card style={{ width: '28rem' }}>
                  
                    {details.map((detailsObj) => {
                      var weekday=new Array(7);
                      weekday[0]="Monday";
                      weekday[1]="Tuesday";
                      weekday[2]="Wednesday";
                      weekday[3]="Thursday";
                      weekday[4]="Friday";
                      weekday[5]="Saturday";
                      weekday[6]="Sunday";

                      const math_discount = detailsObj.discount * 100;
                      return(
                        <Card.Body>
                        <Card.Title><Tit>{detailsObj.restaurant_name}</Tit></Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">Voucher Code: {detailsObj.voucher_code}</Card.Subtitle>
                        <Card.Subtitle className="mb-2 text-muted">Discount: {math_discount}%</Card.Subtitle>
                        <Card.Text>
                          Start Date: {detailsObj.start_date}<br/>
                          Start Time: {detailsObj.start_time}<br/>       
                          End Time: {detailsObj.end_time}<br/>
                          Repeat Type: {detailsObj.repeat_type}<br/>
                          Total Amount: {detailsObj.amount}<br/>
                          Weekday: {weekday[detailsObj.week_day]}<br/>
                        </Card.Text>
                        <Card.Subtitle className="mb-2 text-muted">Create Time: {detailsObj.create_time}</Card.Subtitle>
                        <Card.Link><Link to='/My-Voucher'>Back to My Voucher</Link></Card.Link>
                        </Card.Body>
                      )
                    })}
                    
                  
                </Card>
              </div>
            </div>
          </body>
        </div>
      </div>

    )
  }
}



export default VoucherDetail;