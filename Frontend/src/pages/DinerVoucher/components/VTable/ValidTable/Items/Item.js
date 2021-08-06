import React from 'react';

class Item extends React.Component {
    render() {
        const {restaurant_name, verify_code, discount, voucher_code, start_date, start_time, end_time} = this.props;
        const calculate_discount = discount * 100
    return (
        <tr>
            <td>{restaurant_name}</td>
            <td>{verify_code}</td>
            <td>{voucher_code}</td>
            <td>{calculate_discount}%</td>
            <td>{start_date}<br/> {start_time}-{end_time}</td>
        </tr>
    )
    }
}

export default Item;