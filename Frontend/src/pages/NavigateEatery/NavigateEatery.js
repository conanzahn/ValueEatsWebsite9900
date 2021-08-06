import React from 'react';
import AfterLoginHeader from '../Header/AfterLoginHeader';
import { Row, Col, Container, Card} from "react-bootstrap";
import Header from '../Header/BeforeLoginHeader';
import styled from 'styled-components';
import axios from 'axios';
import img from '../../assets/img/restaurants.jpg';

const ResTitle = styled.div`
  color: black;
  font-weight: bold;
  font-size: xx-large;
  padding: 12px 16px;
`;

const Comts = styled.div`
  display:flex;
  justify-content: center;
  align-items: center;
  padding-top: 52px;
  padding-bottom:20px;
  font-size: 30px;
  font-weight: 850px;
  font-family: --apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
`;

const CardCmt = styled.div`
  /* display:flex; */
  justify-content: center;
  align-items: center;
`;

const ReviewStyle = styled.div`
  color: gray;
  font-size: large;
  padding: 0px 16px;
`;

const BodyTitle = styled.div`
  color: black;
  font-weight: bold;
  font-size: large;
  padding: 12px 16px;
`;

const BodyFont = styled.div`
  color: black;
  font-size: large;
  padding: 12px 16px;
`;

const Navigate_img = styled.div`
  padding: 100px 30px;
  color: white;
  background-image: url(${img});
  background-size: cover;
  background-repeat: no-repeat;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  display: flex;
  align-items: center;
  margin-bottom: 40px;

`;

class NavigateEatery extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
        data:{
            username:'',
            email:'',
            address:'',
            postcode:'',
            reviews:'',
            stars:'',
        },
        menu:'',
        cuisines_offered:'',
        comments:false,
    };
    this.handleDataChange = this.handleDataChange.bind(this);
    this.handleImgChange = this.handleImgChange.bind(this);
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

  handleImgChange=(event)=> {
    this.setState({menu: event.target.files[0]});
  }

  

  componentDidMount (){
    const {name} = this.props.match.params;
    axios.get(`http://localhost:3000/restaurant/restaurant/${name}`).then(
        response => {
            const {restaurant_name, email, address, postcode, 
              starts, cuisines_offered,reviews,menu} = response.data.res;
            if (response.data.comments.length !== 0) {
              this.setState({
                comments:response.data.comments
              })
            }

            this.setState({
              data:{
                username:restaurant_name,
                email:email,
                address:address,
                postcode:postcode,
                cuisines_offered:cuisines_offered,
                reviews:reviews,
                stars:starts,
              },
                menu:menu,
              })
            },
    ).catch(error=>{
        console.log('error',error.data);
    })
  }

  render() {
    const {data, menu, comments} = this.state;
    const {username, email, address, postcode,cuisines_offered,reviews, stars} = data;
    return (
        <div className="main">
        <div className="container">
          {(!localStorage.getItem('username')) && (<Header />)}
          {(localStorage.getItem('username')) && (<AfterLoginHeader />)}
        
        <div className="pages">
        <Navigate_img>
          <div className="homepage__title">
            <h2 className="homepage__name">{username}</h2>
          </div>
        </Navigate_img>
          <Container>
            <Row>
              <Col>
                <img src={menu} width="100%" height="100%" />
              </Col>

              <Col xs={5}>
                <Card style={{ width: '28rem' }}>
                  <Card.Body>
                    <ResTitle>{username}</ResTitle>
                    {(comments) && (
                      <div>
                        <ReviewStyle>{reviews} Comments</ReviewStyle>
                        <ReviewStyle>{stars} stars</ReviewStyle>
                      </div>
                      
                    )}

                    <BodyTitle></BodyTitle>

                    <BodyTitle>Cuisines Offered</BodyTitle>
                    <BodyFont>{cuisines_offered}</BodyFont>

                    <BodyTitle>Address</BodyTitle>
                    <BodyFont>{address}</BodyFont>

                    <BodyTitle>Postcode</BodyTitle>
                    <BodyFont>{postcode}</BodyFont>

                    <BodyTitle>Email</BodyTitle>
                    <BodyFont>{email}</BodyFont>
                  </Card.Body>
                </Card>
              </Col>
              </Row>

            {(comments === false) && (
              <Comts fontSize='10px'>
            <div >No Comments</div></Comts>
            )}

            {(comments) && (
              <div>
              <Comts>
              <div>Comments</div></Comts>
              <CardCmt>
              {comments.map((commentObj) => {
                return (
                  <div>
                  <Card>
                    <Card.Header>{commentObj.diner}</Card.Header>
                    <Card.Body>
                      <blockquote className="blockquote mb-0">
                        <p>
                          {' '}
                          {commentObj.comment}{' '}
                        </p>
                        <footer className="blockquote-footer">
                          Create Time: {commentObj.create_time}
                        </footer>
                      </blockquote>
                    </Card.Body>
                  </Card>
                  <br />
                  </div>
                )
              }) }
              </CardCmt>
              </div>
            )} 
          </Container>
        </div>
        </div>
    </div>

    )
  }
}

export default NavigateEatery;