import React from 'react';
import AfterLoginHeader from '../Header/AfterLoginHeader';
import SideBar from '../../components/SideBar';
import { Button, Form, Row, Col } from "react-bootstrap";
import axios from 'axios';


class DinerProfile extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
        data:{
            username:'',
            email:'',
            address:'',// eatery only
            postcode:'',
            // reset password
            current_password:'',
            new_password:'',
            confirm_password:'',
        },
        cuisines_offered:'',// eatery only
        Menu:'',// eatery only
        is_eatery: false,
        isUpdate:'',
        isChangePassword:'',
        msg:''
    };
    this.handleDataChange = this.handleDataChange.bind(this);
    this.handleImgChange = this.handleImgChange.bind(this);
    this.handleProfileSubmit = this.handleProfileSubmit.bind(this);
    this.handlePasswordSubmit = this.handlePasswordSubmit.bind(this);
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

  handleImgChange=(event)=> {
    this.setState({menu: event.target.files[0]});
  }

  handleProfileSubmit (event){
    event.preventDefault();

    let profileData = new FormData();
    profileData.append('username',this.state.data.username);
    profileData.append('email',this.state.data.email);
    profileData.append('postcode',this.state.data.postcode);
    if (this.state.is_eatery === 'true'){
      profileData.append('address',this.state.data.address);
      profileData.append('cuisines_offered',this.state.cuisines_offered);
      profileData.append('menu',this.state.menu);
    }
    const token = localStorage.getItem('token');

    axios.post(`http://localhost:3000/users/myProfile/`, profileData, {params:{token}}).then(
      response => {
          this.setState({isUpdate:true})  
          },
      error => {console.log('fail',error);}
  )
  }

  handlePasswordSubmit (event){
    event.preventDefault();
    const username = localStorage.getItem('username')

    let passwordData = new FormData();
    passwordData.append('username',username);
    passwordData.append('oldPassword',this.state.data.current_password);
    passwordData.append('newPassword',this.state.data.new_password);
    passwordData.append('confirmPassword',this.state.data.confirm_password);

    // Haven't got backend router
    axios.post(`http://localhost:3000/users/changePassword/`, passwordData).then(
      response => {
          if(response.data.status === 1){
            this.setState({isChangePassword:true})
          }else{
            this.setState({isChangePassword:false, msg:response.data.msg})
          }
              
          },
      error => {console.log('fail',error);}
  )
  }

  componentDidMount(){
    const is_eatery = localStorage.getItem('is_eatery');
    const token = localStorage.getItem('token');
    axios.get(`http://localhost:3000/users/myProfile/`, {params:{token}}).then(
      response => {
          
          const {username, email, address, postcode, cuisines, menu} = response.data
          if (is_eatery) {
            this.setState({
              data:{
                username:username,
                email:email,
                address:address,
                postcode:postcode,
              },
                cuisines_offered:cuisines,
                menu:menu,
                is_eatery:is_eatery
            })
          }
          else{
            this.setState({
              data:{
                username:username,
                email:email,
                postcode:postcode,
              },
              is_eatery:is_eatery
            })
          }
          },
      error => {console.log('fail',error);}
    )
  }

  getValue=(event)=>{
    this.setState({
    cuisines_offered:event.target.value
    })
  }

  render() {
    const {data, cuisines_offered, menu, is_eatery} = this.state;
    const {username, email, address, postcode} = data;
    return (
      <div className="main">
        <div className="container">
          <AfterLoginHeader />
          <body>
            <div class="wrapper d-flex align-items-stretch">
              <SideBar />
              <div id="content" class="p-4 p-md-5">
                <h2 class="mb-4">Profile</h2>
                  <div class="login-wrapper my-auto">
                    <Form 
                    onSubmit={this.handleProfileSubmit}>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridEmail">
                        <Form.Label>{(is_eatery==='true')?'Eatery name': 'Username'} </Form.Label>
                        <Form.Control type="text" name="username" placeholder={username}
                        disabled/>
                        </Form.Group>
                    </Row>

                    <Form.Group className="mb-3" controlId="formGridZip">
                      <Form.Label>Email</Form.Label>
                      <Form.Control type="email" name='email' placeholder={email}
                      onChange={this.handleDataChange('email')}/>
                    </Form.Group>

                    {(is_eatery === 'true') && 
                      (<Form.Group className="mb-3" controlId="formGridAddress1">
                            <Form.Label>Address</Form.Label>
                            <Form.Control name="address" placeholder={address} 
                            onChange={this.handleDataChange('address')}/>
                      </Form.Group>)
                    }
                    

                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridCity">
                        <Form.Label>Postcode</Form.Label>
                        <Form.Control name='postcode' placeholder={postcode}
                        onChange={this.handleDataChange('postcode')}/>
                        </Form.Group>

                        {(is_eatery === 'true') && 
                        (<Form.Group as={Col} controlId="formGridPeople">
                            <Form.Label>Cuisines Offered</Form.Label>
                            <Form.Control as='select' name='cuisines_offered' placeholder={cuisines_offered}
                        onChange={this.getValue.bind(this)}
                        >
                                <option value={cuisines_offered}>{cuisines_offered}</option>
                                <option value="Burgers">Burgers</option>
                                <option value="Fast Food">Fast Food</option>
                                <option value="Chicken">Chicken</option>
                                <option value="Pizza">Pizza</option>
                                <option value="Asian">Asian</option>
                                <option value="BBQ">BBQ</option>
                                <option value="Cafe">Cafe</option>
                                <option value="Vegan">Vegan</option>
                                <option value="Others">Others</option>
                            </Form.Control >
                        </Form.Group>)
                        }
                        
                    </Row>
                    
                    {(is_eatery === 'true') && 
                    (<Form.Group controlId="formFileMultiple" className="mb-3">
                        <Form.Label>Menu</Form.Label><br/>
                        <img src={menu} width="50%" height="50%" />
                        <Form.Control type="file" name='menu' multiple
                        onChange={this.handleImgChange}/>
                    </Form.Group>)}

                    <Button variant="primary" type="submit">
                        Update profile
                    </Button>{(this.state.isUpdate) && (<p style={{color: 'green'}}>Update successfully ! </p>)}
                    
                    </Form>


                    <Form 
                    onSubmit={this.handlePasswordSubmit}>

                    <div class="change">
                      <h4>Change Password</h4>
                    </div>

                    <Form.Group className="mb-3" controlId="formGridPassword">
                      <Form.Label>Current Password</Form.Label>
                      <Form.Control type="password" name="current_password" placeholder="Password"
                      onChange={this.handleDataChange('current_password')} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formGridPassword">
                      <Form.Label>New Password</Form.Label>
                      <Form.Control type="password" name="new_password" placeholder="Password"
                      onChange={this.handleDataChange('new_password')} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formGridConfirmPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type="password" name="confirm_password" placeholder="Confirm your password" 
                        onChange={this.handleDataChange('confirm_password')}/>
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Change Password
                    </Button>
                    {(this.state.isChangePassword) && (<p style={{color: 'green'}}>Your password has been changed successfully ! </p>)}
                    {(!this.state.isChangePassword) && (<p style={{color: 'red'}}>{this.state.msg}</p>)}
                    </Form>
                  </div>
              </div>
            </div>
          </body>
        </div>
      </div>

    )
  }
}

export default DinerProfile;
