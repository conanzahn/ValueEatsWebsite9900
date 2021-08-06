import React from 'react';
import { Card, Form, Button } from "react-bootstrap";
import AfterLoginHeader from '../Header/AfterLoginHeader';
import SideBar from '../../components/SideBar';
import axios from 'axios';
import styled from 'styled-components';

const reviewStyle = styled.div`
  display: flex;
  justify-content: center;
  align-items:center;
  padding: 16px 18px;
`;

class AddReviews extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            data:{
                comment:'',
                food:'',
                service:'',
            },
            isReview:''
            
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
        const {res_name} = this.props.match.params;
    
        let formData = new FormData();
        formData.append('username',username);
        formData.append('restaurant_name',res_name);
        formData.append('comment',this.state.data.comment);
        
        formData.append('food',this.state.data.food);
        formData.append('service',this.state.data.service);
    
        const token = localStorage.getItem('token');
    
        axios.post(`http://localhost:3000/restaurant/addReview/?token=${token}`,formData).then(
            response => {
                if(response.data.status === 4001){
                    this.setState({isReview: true})
                }else{
                    this.setState({isReview: false})
                }
            },
        error => {console.log('fail',error);}
    )
    }

    getfood=(foodValue)=>{
        this.setState({
          food:foodValue
        })
      }
    
    getservice=(event)=>{
        this.setState({
        repeat_type:event.target.value
        })
    }
    
        
    render() {
        const {isReview} = this.state;
        const {res_name} = this.props.match.params;
        return (
            <div className="main">
                <div className="container">
                <AfterLoginHeader />
                <body>
                    <div class="wrapper d-flex align-items-stretch">
                    <SideBar />
                    <div id="content" class="p-4 p-md-5">
                        <h2 class="mb-4">Add Review</h2>
                        <div class="login-wrapper my-auto">
                            <reviewStyle>
                            <form 
                            onSubmit={this.handleSubmit}>
                            <Card style={{ width: '28rem' }}>
                                <Card.Body>
                                <Card.Title>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                    <Form.Label>Restaurant Name</Form.Label>
                                    <Form.Control as="textarea" name="restaurant_name" 
                                    disabled placeholder={res_name}
                                    />
                                </Form.Group>
                                </Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Food</Form.Label>
                                        <Form.Control type="number" step="0.1" placeholder="Food"
                                        onChange={this.handleDataChange('food')}/>
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Service</Form.Label>
                                        <Form.Control type="number" step="0.1" placeholder="Service" 
                                        onChange={this.handleDataChange('service')}/>
                                    </Form.Group>
                            

                                </Card.Subtitle>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                    <Form.Label>Comments</Form.Label>
                                    <Form.Control as="textarea" name="comment" rows={3} 
                                    onChange={this.handleDataChange('comment')}/>
                                </Form.Group>
                                </Card.Body>

                                <Button variant="primary" type="submit">
                                    Confirm
                                </Button>
                                {(isReview) && (<p style={{color: 'green'}}>Add review successfully !</p>)}
                                {(isReview === false) && (<p style={{color: 'red'}}>Add review failed, please try again</p>)}
                            </Card>
                            </form>
                            </reviewStyle>
                        </div>
                    </div>
                    </div>
                </body>
                </div>
            </div>
            
            
        )
    }
}
export default AddReviews;