import React from 'react';

import {
    Redirect
} from "react-router-dom";
import Header from '../Header/BeforeLoginHeader';
import Footer from '../Footer';
import { Button, Form, Row, Col } from "react-bootstrap";
import axios from 'axios';

class ForRestaurants extends React.Component {
    constructor (props) {
        super (props);

        this.state = {
            data:{
                username:'',
                password:'',
                confirm_password:'',
                address:'',
                postcode:'',
                email:'',
                
            },
            cuisines_offered:'',
            profile:'',
            menu:'',
            isSignUp:false,
            error:false,
            msg:''
        };

        

        this.handleDataChange = this.handleDataChange.bind(this);
        this.handleProfileImgChange = this.handleProfileImgChange.bind(this);
        this.handleImgChange = this.handleImgChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleDataChange(key) {
        return (event) => {
            const dataToChange = {
                [key]: event.target.value,
            };
            this.setState((prevState) => ({
                data: {
                    ...prevState.data,
                    ...dataToChange,
                },
            }));
        }
    }

    handleProfileImgChange=(event)=> {
        this.setState({profile: event.target.files[0]});
    }

    handleImgChange=(event)=> {
        this.setState({menu: event.target.files[0]});
    }

    
    
    handleSubmit (event){
        event.preventDefault();

        let formData = new FormData();
        formData.append('username',this.state.data.username);
        formData.append('password',this.state.data.password);
        formData.append('confirm_password',this.state.data.confirm_password);
        formData.append('address',this.state.data.address);
        formData.append('postcode',this.state.data.postcode);
        formData.append('cuisines_offered',this.state.cuisines_offered);
        formData.append('email',this.state.data.email);
        formData.append('profile',this.state.profile);
        formData.append('menu',this.state.menu);
        
        axios.post('http://localhost:3000/eaterySignup/', formData).then(
            response => {
                
                if(response.data.status === 1){
                    this.setState({isSignUp:true});
                }else{
                    this.setState({error:true, msg:response.data.msg})
                }
                },
        ).catch(error=>{
            console.log('error',error.data);
            this.setState({error:true})
        })
    }

    getValue=(event)=>{
        this.setState({
        cuisines_offered:event.target.value
        })
    }

    render() {
        if(this.state.isSignUp) {
            return (<Redirect to="/Login"></Redirect>);
        }

        return (
        <div className="main">
            <div className="container">
            <Header />
            <div className="pages">
                    <h2>Sign Up For Restaurant</h2>
                    <Form 
                    onSubmit={this.handleSubmit}>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridEmail">
                        <Form.Label>Eatery Name</Form.Label>
                        <Form.Control type="text" name="username" placeholder="Eatery Name"
                        onChange={this.handleDataChange('username')}/>
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" name="password" placeholder="Password"
                        onChange={this.handleDataChange('password')} />
                        </Form.Group>
                    </Row>
                    
                    <Form.Group className="mb-3" controlId="formGridConfirmPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type="password" name="confirm_password" placeholder="Confirm your password" 
                        onChange={this.handleDataChange('confirm_password')}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formGridAddress1">
                        <Form.Label>Address</Form.Label>
                        <Form.Control name="address" placeholder="eg. 650 George st, sydney NSW 2000 " 
                        onChange={this.handleDataChange('address')}/>
                    </Form.Group>


                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridCity">
                        <Form.Label>Postcode</Form.Label>
                        <Form.Control name='postcode' placeholder="eg. 2000"
                        onChange={this.handleDataChange('postcode')}/>
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridPeople">
                            <Form.Label>Cuisines Offered</Form.Label>
                            <Form.Control as='select' name='cuisines_offered'
                        onChange={this.getValue.bind(this)}
                        >       
                                <option value=''>-- select --</option>
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
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridZip">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" name='email' placeholder="email"
                        onChange={this.handleDataChange('email')}/>
                        </Form.Group>
                    </Row>

                    <Form.Group controlId="formFileMultiple" className="mb-3">
                        <Form.Label>Profile Image</Form.Label><br/>
                        <Form.Control type="file" name='profile' multiple
                        onChange={this.handleProfileImgChange}/>
                    </Form.Group>

                    <Form.Group controlId="formFileMultiple" className="mb-3">
                        <Form.Label>Menu</Form.Label><br/>
                        <Form.Control type="file" name='menu' multiple
                        onChange={this.handleImgChange}/>
                    </Form.Group>

                    

                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                    </Form>
                    <br />
                    {
                        (this.state.error) && (<p style={{color: 'red'}}>{this.state.msg}</p>)
                    }
            </div>
            <Footer />
            </div>
        </div>
        );
    }
}

export default ForRestaurants;