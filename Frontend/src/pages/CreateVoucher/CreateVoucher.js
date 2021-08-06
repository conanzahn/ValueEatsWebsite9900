import React from 'react';
import AfterLoginHeader from '../Header/AfterLoginHeader';
import { Form,Button } from "react-bootstrap";
import SideBar from '../../components/SideBar';
import axios from 'axios';

class CreateVoucher extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
        data:{
            restaurant_name:'',
            voucher_code:'',
            discount:'',
            start_date:'',
            start_time:'',
            end_time:'',
            voucher_amount:'',
        },
        repeat_type:'',
        success:false,
        error: false
    };
    this.handleDataChange = this.handleDataChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleDataChange(key) {
    return (event) => {
        const dataToChange = {
            [key]: event.target.value,
        };

        this.setState((PrevState) => ({
            data: {
                ...PrevState.data,
                ...dataToChange,
            },
        }));
    }
  }

  handleSubmit (event){
    event.preventDefault();
    const username = localStorage.getItem('username');

    let formData = new FormData();
    formData.append('username',username);
    formData.append('restaurant_name',username);
    formData.append('voucher_code',this.state.data.voucher_code);
    formData.append('discount',this.state.data.discount);
    formData.append('start_time',this.state.data.start_time);
    formData.append('start_date',this.state.data.start_date);
    formData.append('end_time',this.state.data.end_time);
    formData.append('voucher_amount',this.state.data.voucher_amount);
    
    formData.append('repeat_type',this.state.repeat_type);

    const token = localStorage.getItem('token');


    axios.post(`http://localhost:3000/restaurant/createVoucher/?token=${token}`,formData).then(
      response => {          
          if(response.data.status === 1200){
            this.setState({
              success:true
            });
          }
          else{
            this.setState({error:true})
          }
          },
      error => {console.log('fail',error);}
  )
  }

  getValue=(event)=>{
    this.setState({
      repeat_type:event.target.value
    })
  }


  render() {
    const username = localStorage.getItem('username');
    return (
      <div className="main">
        <div className="container">
          <AfterLoginHeader />
          <body>
            <div class="wrapper d-flex align-items-stretch">
            <SideBar />
              <div id="content" class="p-4 p-md-5">
                <h2 class="mb-4">Create Voucher</h2>
                  <div class="login-wrapper my-auto">
                    <form action="#!"
                    onSubmit={this.handleSubmit}>
                      <div class="form-group">
                          <label for="restaurant_name">Restaurant Name:</label>
                          <div class="input-text">
                          <input  type="text" name="restaurant_name"
                          class="form-control"
                          placeholder = {username} disabled/></div>
                      </div>
                      <div class="row">
                          <div class="form-group col-sm-6">
                              <label for="discount">Discount:</label>
                              <input type="text" name="discount" class="form-control" 
                              onChange={this.handleDataChange('discount')}/>
                          </div>
                          <div class="form-group col-sm-6">
                              <label for="voucher_code">Voucher Code:</label>
                              <input type="text" name="voucher_code" class="form-control" 
                              onChange={this.handleDataChange('voucher_code')}/>
                          </div>
                          <div class="form-group col-sm-6">
                              <label for="voucher_amount">Voucher Amount:</label>
                              <input type="text" name="voucher_amount" class="form-control" 
                              onChange={this.handleDataChange('voucher_amount')}/>
                          </div>
                      </div>

                      <div class="change">
                          <h4>Valid Period</h4>
                      </div>
                      
                      <div class="form-group col-sm-6">
                          <label for="start_date">Date:</label>
                          <input type="date" name="start_date" class="form-control"
                          onChange={this.handleDataChange('start_date')}/>
                      </div>
                      <div class="row">
                        <div class="form-group col-sm-6">
                            <label for="start_time">Start Time:</label>
                            <input type="time" name="start_time" class="form-control"
                            onChange={this.handleDataChange('start_time')}/>
                        </div>

                        <div class="form-group col-sm-6">
                          <label for="end_time">End time:</label>
                          <input type="time" name="end_time"  class="form-control"
                          onChange={this.handleDataChange('end_time')}/>
                        </div>
                      </div>

                      <div class="change">
                          <h4>Repeatability</h4>
                      </div>
                      <Form.Control as='select' name='repeat_type' placeholder="select"
                        onChange={this.getValue.bind(this)}
                        >
                        <option value="">-- select --</option>
                        <option value="no_repeat">No Repeat</option>
                        <option value="weekly_repeat">Weekly Repeat</option>
                      </Form.Control >
                      
                      <Button variant="primary" type="submit">
                        Confirm
                    </Button>
                    {(this.state.success) && (<p style={{color: 'green'}}>Great! You have successfully create an voucher!</p>)}
                    {(this.state.error) && (<p style={{color: 'red'}}>Failed! Something is wrong, please try again.</p>)}
                    </form>
                  </div>
                  
              </div>
            </div>
          </body>
        </div>
      </div>

    )
  }
}

export default CreateVoucher;
