import React from 'react';
import AfterLoginHeader from '../Header/AfterLoginHeader';
import { Card, CardGroup, ListGroup } from "react-bootstrap";
import {
  Link
} from "react-router-dom";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import styled from 'styled-components';
import axios from 'axios';

const SearchImg = styled.div`
  padding: 12px 13px;
  /* height: 100px; */
  /* margin-bottom: 40px; */
`;

const Info = styled.div`
    padding: 20px 13px;
    text-align: center;
`;

class SearchResult extends React.Component {
  constructor (props) {
        super (props);

        this.state = {
          searchResults:[],
          noResult:'',
        };
    }

  componentDidMount(){
      const {search} = this.props.match.params;
      axios.get('http://localhost:3000/searchDiscount/', {params:{q:search}}).then(
          response => {
              if(response.data.rest_list === null){
                this.setState({noResult:true})
              }else {
                this.setState({noResult:false});
                this.setState({searchResults:response.data.rest_list});
              }
              },
          
      ).catch(error=>{
          console.log('error',error.data);
          this.setState({error:true})
      })
  }

  render() {
    const {searchResults, noResult} = this.state
    const {search} = this.props.match.params;

    return (
      <div className="main">
        <div className="container">
          <AfterLoginHeader/>
          <body>
              {(noResult) && (
                <>
                <Info><h2><span className="homepage__aboutMeHeaderHighlight">No Result about '{search}' !</span></h2></Info>
                <Info><h2>Please try to search other keywords</h2></Info>
                </>
              )}

              {(!noResult) && (
                <>
                <Info><h3><span className="homepage__aboutMeHeaderHighlight">Search results about '{search}'</span></h3></Info>

                <CardGroup>
                  {searchResults.map((resObj)=>{
                    return(
                      <div className='flexcard'>
                        <Card style={{ width: '28rem' }}>
                          <SearchImg><Card.Img variant="top" src={resObj.profile} height='280px'/></SearchImg>
                          <Card.Body>
                            <Card.Title> <Link to={`/Navigate-Eatery/${resObj.restaurant_name}`}>
                            {resObj.restaurant_name}
                            </Link></Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">{resObj.address} {resObj.postcode}</Card.Subtitle>
                            <Card.Text>
                            Cuisine Offered: {resObj.cuisines_offered}
                            </Card.Text>
                            <ListGroup variant="flush">

                              {resObj.voucher_status.map((statusObj, key)=>{
                                var weekday=new Array(7);
                                weekday[0]="Monday";
                                weekday[1]="Tuesday";
                                weekday[2]="Wednesday";
                                weekday[3]="Thursday";
                                weekday[4]="Friday";
                                weekday[5]="Saturday";
                                weekday[6]="Sunday";
                                return(
                                  <>
                                  {(statusObj.length === 0) && (
                                    <Accordion disabled>
                                      <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel3a-content"
                                        id="panel3a-header">
                                        <Typography >{weekday[key]}</Typography>
                                      </AccordionSummary>
                                    </Accordion>
                                  )}

                                  {(statusObj.length !== 0) && (
                                    <Accordion>
                                    <AccordionSummary
                                      expandIcon={<ExpandMoreIcon />}
                                      aria-controls="panel1a-content"
                                      id="panel1a-header">
                                      <Typography ><span className="homepage__aboutMeHeaderHighlight">{weekday[statusObj[0].week_day]}</span></Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                      <Typography>
                                      {statusObj.map((voucherObj)=>{
                                        return(
                                          <>
                                          <span><Link to={{
                                            pathname: '/Book-Voucher',  
                                            query: {
                                              voucherObj:voucherObj}}}>
                                                {voucherObj.start_date}: {voucherObj.start_time}-{voucherObj.end_time}
                                          </Link></span>
                                          </>
                                        )
                                      })}
                                      </Typography>
                                    </AccordionDetails>
                                  </Accordion>
                                  )}

                                  </>
                                )
                              })}

                            </ListGroup>
                          </Card.Body>
                        </Card>
                      </div>
                    )
                    
                  })}
                </CardGroup>
                </>
              )}
          
          
          </body>
        </div>
      </div>

    )
  }
}

export default SearchResult;