import React from 'react';
import Item from './Items/index';
import { Table } from "react-bootstrap";

class PTable extends React.Component {
    render() {
        const {pTable} = this.props;
    return (
        <Table striped bordered hover>
            <thead>
            <tr>
                <th>Restaurant</th>
                <th>Voucher-Code</th>
                <th>Verified Date</th>
                <th>Review</th>
            </tr>
            </thead>
            <tbody>
                {pTable.map((dataObj)=>{
                    return (
                        <Item {...dataObj}/>
                    )
                })}
            </tbody>
        </Table>
    )
    }
}

export default PTable;