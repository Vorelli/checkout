import { useState, useEffect } from 'react';
import OrdersItems from './OrdersItems.jsx';

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    let responseJson = fetch(url + '/api/orders')
      .then(res => res.json())
      .catch(err => {
        console.log('error encountered', err);
        //window.location.href = url + '/';
      });
    responseJson.then(res => {
      if(!res || !res.orders || res.err) {
        console.log('error encountered', res);
        //window.location.href = url + '/';
      } else {
        setOrders(res.orders)
      }
    });
  }, [])

  return (
    <div className='orders'>
      {orders.map(order => <OrdersItems key={order.id} order={order} url={url} />)}
    </div>
  );
}

export default Orders;
