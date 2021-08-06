import React from 'react';
import AfterLoginHeader from '../Header/AfterLoginHeader';
import { Card, CardGroup } from "react-bootstrap";
import SideBar from '../../components/SideBar';
import axios from 'axios';


class MySubscribtion extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      data:[],
      error:'',
    };
  }

componentDidMount (){
    const token = localStorage.getItem('token');
    axios.get('http://localhost:3000/users/mySubscription/', {params:{token}}).then(
        response => {
            if(response.data.status === 7002){
              this.setState({data:response.data.data});
            }else {
              this.setState({error:true});
            }
            
            },
    ).catch(error=>{
        console.log('error',error.data);
    })
  }

  render() {
    const {data, error} = this.state;
    return (
      <div className="main">
        <div className="container">
          <AfterLoginHeader />
          <body>
            <div class="wrapper d-flex align-items-stretch">
              <SideBar />
              <div id="content" class="p-4 p-md-5">
                <h2 class="mb-4">My Subscription</h2>
                <CardGroup>

                {(error) && (<h3 class="mb-4">You don't have any subscriptions</h3>)}
                
                {(!error) && data.map((dataObj) => {
                  return (
                    <div className='flexcard'>
                      <Card style={{ width: '18rem' }}>
                        <Card.Body>
                          <Card.Title>{dataObj.restaurant_name}</Card.Title>
                          {(dataObj.starts !== 'Initial value') && (
                            <Card.Subtitle className="mb-2 text-muted">{dataObj.starts} stars</Card.Subtitle>
                          )}

                          {(dataObj.starts === 'Initial value') && (
                            <Card.Subtitle className="mb-2 text-muted">No Reviews</Card.Subtitle>
                          )}
                          
                          <Card.Subtitle className="mb-2 text-muted">{dataObj.cuisines_offered}</Card.Subtitle>
                          <Card.Text>
                          {dataObj.address} {dataObj.postcode}
                          </Card.Text>
                          <Card.Link href="#">{dataObj.email}</Card.Link>
                        </Card.Body>
                      </Card>
                    </div>
                  )
                })}
                

                </CardGroup>
                  
              </div>
            </div>
          </body>
        </div>
      </div>

    )
  }
}



export default MySubscribtion;