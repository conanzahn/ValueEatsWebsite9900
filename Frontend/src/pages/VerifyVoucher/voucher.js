import React from 'react';
import AfterLoginHeader from '../Header/AfterLoginHeader';
import { Button, Card } from "react-bootstrap";
import SideBar from '../../components/SideBar';
import axios from 'axios';

class Voucher extends React.Component {
    constructor (props) {
        super (props);

        this.state = {
            isConfirm:''
        };
    }
  handleSubmit (event){
        event.preventDefault();
        const {verifyCode} = this.props.location.query;
        let formData = new FormData();
        formData.append('verify_code',verifyCode);
        
        const token = localStorage.getItem('token');
        axios.post('http://localhost:3000/restaurant/confirmVoucher/', formData, {params:{token}}).then(
            response => {
                if(response.data.status === 1){
                  this.setState({
                    isConfirm:'true'
                  })

                }else{
                  this.setState({isConfirm:'false'})
                }
                },
        ).catch(error=>{
            console.log('error',error.data);
            this.setState({error:true})
        })
    }

  render() {
    const {voucherDetails, bookDetails} = this.props.location.query;
    const comp_discount = voucherDetails.discount * 100

    return (
      <div className="main">
        <div className="container">
          <AfterLoginHeader />
        
          <body>
            <div class="wrapper d-flex align-items-stretch">
              <SideBar />
              <div id="content" class="p-4 p-md-5">

                <h2 class="mb-4">Confirm Voucher Detail</h2>
                <Card style={{ width: '30rem' }}>
                  <Card.Body>
                    <Card.Title>Reservation Name:  {bookDetails[0].reservation_name}</Card.Title>
                    <Card.Text />
                    <Card.Subtitle className="mb-2 text-muted">Eatery Name: {voucherDetails.restaurant_name}</Card.Subtitle>
                    <Card.Subtitle className="mb-2 text-muted">Voucher Code: {voucherDetails.voucher_code}</Card.Subtitle>
                    <Card.Subtitle className="mb-2 text-muted">Discount: {comp_discount}%</Card.Subtitle>
                    <Card.Subtitle className="mb-2 text-muted">Valid Date: {voucherDetails.start_date}</Card.Subtitle>
                    <Card.Subtitle className="mb-2 text-muted">Valid Time: {voucherDetails.start_time} - {voucherDetails.end_time}</Card.Subtitle>
                    <Card.Text>Number of Guest: {bookDetails[0].person_num}</Card.Text>
                    <Card.Text>Phone: {bookDetails[0].phone}</Card.Text>
                    <Card.Text>Reservation Requirements: {bookDetails[0].requirements}</Card.Text>
                    <Button variant="outline-success" onClick={this.handleSubmit.bind(this)}>
                            Confirm Verify
                    </Button>

                    {(this.state.isConfirm === 'true') && (
                      <p style={{color: 'green'}}>Confirm Success !</p>
                    )}
                  </Card.Body>
                </Card>
              </div>
            </div>
          </body>
        </div>
      </div>

    )
  }
}

export default Voucher;