import React from 'react';
import Item from './Items/index';
import { Table } from "react-bootstrap";

class VTable extends React.Component {
    render() {
        const {vTable} = this.props;
    return (
        <Table striped bordered hover>
            <thead>
            <tr>
                <th>Restaurant</th>
                <th>Verify-Code</th>
                <th>Voucher-Code</th>
                <th>Discount</th>
                <th>Valid-Date</th>
            </tr>
            </thead>
            <tbody>
                {vTable.map((dataObj)=>{
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