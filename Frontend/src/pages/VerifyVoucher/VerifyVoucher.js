import React from 'react';
import AfterLoginHeader from '../Header/AfterLoginHeader';
import { Form, Button, FormControl } from "react-bootstrap";
import SideBar from '../../components/SideBar';
import { Redirect } from 'react-router-dom';
import axios from 'axios';


class VerifyVoucher extends React.Component {

    constructor (props) {
        super (props);

        this.state = {
            verifyCode:'',
            voucherDetails:[],
            bookDetails:[],
            isValid:''
        };

        this.handleDataChange = this.handleDataChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    
    handleDataChange=(event)=>{
        this.setState({
        verifyCode:event.target.value
        })
    }

    handleSubmit (event){
        event.preventDefault();

        let formData = new FormData();
        formData.append('verify_code',this.state.verifyCode);
        
        const token = localStorage.getItem('token');
        axios.post('http://localhost:3000/restaurant/verifyVoucher/', formData, {params:{token}}).then(
            response => {
                if(response.data.status === 1){
                  this.setState({
                    isValid:'true', 
                    voucherDetails:response.data.voucher_details,
                    bookDetails:response.data.boock_voucher
                  })

                }else{
                  this.setState({isValid:'false'})
                }
                },
        ).catch(error=>{
            console.log('error',error.data);
            this.setState({error:true})
        })
    }


  render() {
    if(this.state.isValid === 'true'){
      return (
        <Redirect to={{
          pathname: '/voucher',  
          query: {
            verifyCode:this.state.verifyCode,
            voucherDetails:this.state.voucherDetails, 
            bookDetails:this.state.bookDetails}}}>
        </Redirect>
      )
    }

    return (
      <div className="main">
        <div className="container">
          <AfterLoginHeader />
          <body>
            <div class="wrapper d-flex align-items-stretch">
              <SideBar />
              <div id="content" class="p-4 p-md-5">
                <h2 class="mb-4">Verify Voucher</h2>

                    <Form className="d-flex" onSubmit={this.handleSubmit}>
                        <FormControl
                            type="search"
                            placeholder="Please enter verify CODE"
                            className="mr-2"
                            aria-label="Search"
                            onChange={this.handleDataChange}
                        />
                        <Button variant="outline-success" type='submit'>
                            Verify
                        </Button>
                    </Form>

                    {(this.state.isValid === 'false') && (
                      <p style={{color: 'red'}}>This code is invalid</p>
                    )}
                  
              </div>
            </div>
          </body>
        </div>
      </div>

    )
  }
}



export default VerifyVoucher;