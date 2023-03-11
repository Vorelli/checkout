import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import OrderList from './OrderList.jsx';

const Order = ({ url }) => {
  const [order, setOrder] = useState({});
  const [orderItems, setOrderItems] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    fetch(url + '/api/orders/' + id)
      .then(res => res.json())
      .then(res => {
        if(!res || !res.order) {
          window.location.href = url + '/orders';
        } else {
          console.log(res);
          setOrder(res.order);
          setOrderItems(res.items);
        }
      })
      .catch(err => console.log('error encountered when trying to load order', id));
  }, []);

  return (
    <div>
      <p>Order made on: {order.createdAt && JSON.stringify(order.createdAt).slice(1, 11)}</p>
      <OrderList items={orderItems} />
    </div>
  )
}

export default Order;