import React from 'react';
import { Button } from "react-bootstrap";
import {Link} from "react-router-dom";

class Item extends React.Component {
    render() {
        const { restaurant_name, voucher_code, verify_date} = this.props;
    return (
        <tr>
            <td>{restaurant_name}</td>
            <td>{voucher_code}</td>
            <td>{verify_date}</td>
            <td>
                <Link to={`/add-reviews/${restaurant_name}`}><Button variant="info">Add Review</Button></Link>
            </td>
        </tr>
    )
    }
}

export default Item;