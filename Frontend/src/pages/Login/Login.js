import React from 'react';
import {
    Redirect,
    Link
} from "react-router-dom";
import Header from '../Header/BeforeLoginHeader';
import Footer from '../Footer';
import { Button } from "react-bootstrap";
import logo from '../../assets/img/Login.jpg';
import axios from 'axios';

class Login extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            data:{
                username:'',
                password:'',
            },
            isLogin:false,
            token:'',
            is_eatery:'',
            error:false,
            msg:''
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

        let formData = new FormData();
        formData.append('username',this.state.data.username);
        formData.append('password',this.state.data.password);


        axios.post('http://localhost:3000/login/', formData).then(
            response => {
                if(response.data.status === 1202){
                    this.setState({
                        isLogin:true, 
                        token:response.data.token, 
                        is_eatery:response.data.is_eatery
                    });
                }
                else {
                    this.setState({error:true, msg:response.data.error})
                }
                },
            error => {console.log('fail',error);}
        )
    }

    componentWillUnmount(){
        const{username} = this.state.data;
        localStorage.setItem('username', username);
        localStorage.setItem('token', this.state.token );
        localStorage.setItem('is_eatery', this.state.is_eatery);
    }

    render() {
        const { msg} = this.state;
        if (this.state.isLogin){
            return(
            <Redirect to='/User'/>)
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
                                <div class="col-sm-6 login-section-wrapper">
                                    <div class="login-wrapper my-auto">
                                        <h1 class="login-title">Log in</h1>
                                        <form action="#!"
                                        onSubmit = {this.handleSubmit}>
                                            <div class="form-group">
                                                <label for="username">username:</label>
                                                <input type="text" name="username" id="username" class="form-control"
                                                onChange = {this.handleDataChange('username')}/>
                                            </div>
                                            <div class="form-group mb-4">
                                                <label for="password">Password:</label>
                                                <input type="password" name="password" id="password" class="form-control"
                                                onChange={this.handleDataChange('password')}/>
                                            </div>

                                            <Button as="input" type="submit" value="Login" /> 
                                            {
                                            (this.state.error) && (<p style={{color: 'red'}}>{msg}</p>)
                                            }

                                        </form>
                                        <Link to='/Forgot' class="forgot-password-link"><p>Forgot password?</p></Link>
                                        <p class="login-wrapper-footer-text">Don't have an account?
                                            <div class="switch-signup">
                                                <Link to='/Sign-up' class="text-reset"><p>Register here</p></Link>
                                            </div>
                                        </p>

                                        
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

export default Login;