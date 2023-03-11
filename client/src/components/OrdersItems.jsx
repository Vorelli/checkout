const OrdersItems = ({ order, url }) => {
  return (
    <div className='order'>
      <a href={url + '/orders/' + order.id }><p>View this order</p></a>
      <p>{ 'Order created on: ' + JSON.stringify(order.createdAt).slice(1, 11) }</p>
      <p>Processed: { order.processed ? 'True' : 'False' }</p>
      <p>Preparing: { order.preparing ? 'True' : 'False' }</p>
      {!order.trackingNum ? <></> : (<p>Tracking No.: { order.trackingNum }</p>)}
    </div>
  );
}

export default OrdersItems;