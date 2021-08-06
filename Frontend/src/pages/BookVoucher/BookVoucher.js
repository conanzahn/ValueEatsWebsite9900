import React from 'react';
import AfterLoginHeader from '../Header/AfterLoginHeader';
import {Form, Row, Col, Button} from "react-bootstrap";
import {
  Link,
  Redirect
} from "react-router-dom";
import axios from 'axios';
import styled from 'styled-components';

const Info = styled.div`
    padding: 12px 13px;
    text-align: center;
`;

class BookVoucher extends React.Component {

    constructor (props) {
        super(props);

        this.state = {
            data:{
                username:'',
                email:'',
                // reservation_name:'',
                person_num:'',
                phone:'',
                requirements:'',

            },
            isSuccess:'',
            msg:''
        };
        this.handleDataChange = this.handleDataChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    handleDataChange(key) {
        // higher-order function/ curly function
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
        const username = localStorage.getItem('username');
        const {voucherObj}= this.props.location.query;
        // this.setState({data:{username:username}})

        let formData = new FormData();
        // formData.append('username',this.state.data.username);
        formData.append('voucher',voucherObj.id);
        formData.append('email',this.state.data.email);
        formData.append('reservation_name',username);
        formData.append('person_num',this.state.data.person_num);
        formData.append('phone',this.state.data.phone);
        formData.append('requirements',this.state.data.requirements);

        const token = localStorage.getItem('token');

        axios.post(`http://localhost:3000/restaurant/bookVoucher/?token=${token}`, formData).then(
            response => {
                if (response.data.status === 6001){
                    this.setState({isSuccess:true, msg:response.data.msg})
                }else{
                    this.setState({isSuccess:false, msg:response.data.msg})
                }
            },
            error => {console.log('fail',error);this.setState({error:true})}
        )
    }
    
    render() {
        const username = localStorage.getItem('username');
        const {voucherObj}= this.props.location.query;
        const comp_discount = voucherObj.discount * 100;

        if(!localStorage.getItem('username')) {
            return(<Redirect to='/Login' />)
        }
        return (
            <div className="main">
            <div className="container">
            <AfterLoginHeader />
            <div className="pages">
            <Info>
                <h1><span className="homepage__aboutMeHeaderHighlight">Reservation at {voucherObj.restaurant_name}</span></h1>
                <p text-align='left'>Valid Date: {voucherObj.start_date}</p>
                <p>Valid Time: {voucherObj.start_time}-{voucherObj.end_time}</p>
                <p>Discount: {comp_discount}%</p>
            </Info>
            <Form onSubmit={this.handleSubmit}>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridName">
                        <Form.Label>Name for reservation</Form.Label>
                        <Form.Control placeholder={username}
                        disabled
                        />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridPeople">
                    <Form.Label>How may people?</Form.Label>
                    <Form.Control placeholder="1" 
                        onChange={this.handleDataChange('person_num')}/>
                    </Form.Group>
                </Row>

                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" 
                        onChange={this.handleDataChange('email')}/>
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridAddress2">
                        <Form.Label>Phone number for reservation</Form.Label>
                        <Form.Control placeholder="0412123678" 
                        onChange={this.handleDataChange('phone')}
                        />
                    </Form.Group>
                </Row>

                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Any other requirements?</Form.Label>
                    <Form.Control as="textarea" rows={3} 
                    onChange={this.handleDataChange('requirements')}/>
                </Form.Group>

                <Button variant="primary" type="submit">
                    Book Now!
                </Button>
                {(this.state.isSuccess) && (<p style={{color: 'green'}}>{this.state.msg}! You can check your voucher on <Link to='Diner-Voucher'>'My Voucher'</Link></p>)}
                {(!this.state.isSuccess) && (<p style={{color: 'red'}}>{this.state.msg}</p>)}
                </Form>
            </div>
            </div>
        </div>

        )
    }
}



export default BookVoucher;