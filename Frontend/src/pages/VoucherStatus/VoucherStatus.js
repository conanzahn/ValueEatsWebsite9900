import React from 'react';
import { Card, CardGroup} from "react-bootstrap";
import {Link} from "react-router-dom";
import axios from 'axios';
import styled from 'styled-components';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


const SearchImg = styled.div`
padding: 12px 13px;
/* height: 100px; */
/* margin-bottom: 40px; */
`;

class VoucherStatus extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      data:[],
    };
  }

  componentDidMount (){
      const token = localStorage.getItem('token');
      axios.get('http://localhost:3000/restaurant/Recommended/', {params:{token}}).then(
          response => {
              this.setState({data:response.data.data});
              },
      ).catch(error=>{
          console.log('error',error.data);
      })
    }

  render() {
    const {data} = this.state;
    return (
      <div className="main">
        <div className="container">
          <body>
            <CardGroup>
              {data.map((dataObj) => {
                return (
                  <div className='flexcard'>
                    <Card style={{ width: '28rem' }}>
                      <SearchImg><Card.Img variant="top" src={dataObj.profile} height='280px'/></SearchImg>
                      <Card.Body>
                        <Card.Title> <Link to={`/Navigate-Eatery/${dataObj.user__username}`}>
                        {dataObj.user__username}
                        </Link></Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">{dataObj.address} {dataObj.user__postcode}</Card.Subtitle>
                        <Card.Text>
                        Cuisine Offered: {dataObj.cuisines_offered}
                        </Card.Text>


                        {dataObj.voucher_status.map((statusObj, key)=>{
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
                                          <p><Link to={{
                                            pathname: '/Book-Voucher',  
                                            query: {
                                              voucherObj:voucherObj}}}>
                                                {voucherObj.start_date}: {voucherObj.start_time}-{voucherObj.end_time}
                                          </Link></p>
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
                      </Card.Body>
                    </Card>
                  </div>
                )
              })}
            </CardGroup>
          </body>
        </div>
      </div>

    )
  }
}

export default VoucherStatus;