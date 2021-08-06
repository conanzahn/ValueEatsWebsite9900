import React from 'react';
import {
    Link
} from "react-router-dom";
import Header from '../Header/BeforeLoginHeader';
import Footer from '../Footer';
import logo from '../../assets/img/Login.jpg';


class Forgot extends React.Component {

    render() {
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
                                        <h1 class="login-title">Forgot Password</h1>
                                        <form action="#!">
                                            <div class="form-group">
                                                <label for="email">Email:</label>
                                                <input type="email" name="email" id="email" class="form-control"/>
                                            </div>
                                            <input name="login" id="login" class="btn btn-block login-btn" type="button" value="Submit"/>
                                        </form>
                                        <Link to='/Login' class="forgot-password-link"><p>Login</p></Link>
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

export default Forgot;