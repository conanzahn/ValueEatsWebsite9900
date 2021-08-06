import React from 'react';
import Item from '../Item';
import { Table } from "react-bootstrap";

class VTable extends React.Component {

    render() {
        const {data} = this.props;
    return (
        <Table striped bordered hover>
            <thead>
            <tr>
                <th>Code</th>
                <th>Discount</th>
                <th>Available/Total</th>
                <th>Repeatability</th>
                <th>Check</th>
            </tr>
            </thead>
            <tbody>
                {data.map((dataObj)=>{
                    return (
                        <Item {...dataObj}/>
                    )
                })}
            
            </tbody>
        </Table>
    )
    }
}

export default VTable;