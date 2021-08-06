import React from 'react';
import {
    Link,
    Redirect
} from "react-router-dom";
import Header from '../Header/BeforeLoginHeader';
import Footer from '../Footer';
import { Button } from "react-bootstrap";
import logo from '../../assets/img/Login.jpg';
import axios from 'axios';

class SignUp extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            data:{
                username:'',
                email:'',
                postcode:'',
                password:'',
                confirm_password:'',
            },
            isSignUp:false,
            error:false,
        };
        this.handleDataChange = this.handleDataChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    handleDataChange(key) {
        return (event) =>{
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

    handleSubmit (event){
        event.preventDefault();

        let formData = new FormData();
        formData.append('username',this.state.data.username);
        formData.append('email',this.state.data.email);
        formData.append('postcode',this.state.data.postcode);
        formData.append('password',this.state.data.password);
        formData.append('confirm_password',this.state.data.confirm_password);

        axios.post('http://localhost:3000/dinerSignup/', formData).then(
            response => {
                if(!response.data.msg){
                    this.setState({isSignUp:true})
                }
                else {
                    this.setState({error:true})
                }
                    
                },
            error => {console.log('fail',error);this.setState({error:true})}
        )
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
                <body>
                    <main>
                        <div class="container-fluid">
                            <div class="row">
                                <div class="col-sm-6 signup-section-wrapper">
                                    <div class="login-wrapper my-auto">
                                        <h1 class="signup-title">Sign Up</h1>
                                        <form action="#!"
                                        onSubmit = {this.handleSubmit}>
                                            <div class="form-group">
                                                <label for="username">username:</label>
                                                <input type="text" name="username" id="username" class="form-control" 
                                                onChange={this.handleDataChange('username')} />
                                            </div>

                                            <div class="form-group">
                                                <label for="email">email:</label>
                                                <input type="email" name="email" id="email" class="form-control" 
                                                onChange={this.handleDataChange('email')} />
                                            </div>

                                            <div class="form-group">
                                                <label for="postcode">postcode:</label>
                                                <input type="postcode" name="postcode" id="postcode" class="form-control" 
                                                onChange={this.handleDataChange('postcode')} />
                                            </div>

                                            <div class="form-group mb-4">
                                                <label for="password">password:</label>
                                                <input type="password" name="password" id="password" class="form-control"
                                                onChange={this.handleDataChange('password')}/>
                                            </div>

                                            <div class="form-group mb-4">
                                                <label for="confirmPassword">Confirm Password:</label>
                                                <input type="password" name="confirm_password" id="confirm_password" class="form-control"
                                                onChange={this.handleDataChange('confirm_password')}/>
                                            </div>

                                            <Button as="input" type="submit" value="Submit" />
                                        </form>
                                        <p class="signup-wrapper-footer-text">Already have an account?
                                            <div class="switch-login">
                                                <Link to='/login' class="text-reset"><p>Back to Login</p></Link>
                                            </div>
                                        </p>

                                        <br />
                                        {
                                            (this.state.error) && (<p style={{color: 'red'}}>Something is wrong, please try again !</p>)
                                        }
                                        
                                    </div>
                                </div>

                                <div class="col-sm-6 px-0 d-none d-sm-block">
                                    <img src={logo} width="50" height="100" alt="login image" class="login-img"/>
                                </div>

                            </div>
                        </div>
                    </main>
                </body>

            </div>
            <Footer />
            </div>
        </div>
        );
    }
}



// const SignUp = () => (
    

// );

export default SignUp;