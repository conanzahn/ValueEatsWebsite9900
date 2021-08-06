import React from 'react';
import { Button } from "react-bootstrap";
import {Link} from "react-router-dom";

class Item extends React.Component {
    render() {
        const {id, voucher_code, discount, available, amount, repeat_type} = this.props;
        const calculate_discount = discount * 100
    return (
        <tr>
            <td>{voucher_code}</td>
            <td>{calculate_discount}%</td>
            <td>{available}/{amount}</td>
            <td>{repeat_type}</td>
            <td>
            <Link to={`/Voucher-Detail/${id}`}><Button variant="info">Details</Button></Link>
            </td>
        </tr>
    )
    }
}

export default Item;