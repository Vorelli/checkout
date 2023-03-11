const OrdersItems = ({ order, url }) => {
  return (
    <div className='order'>
      <a href={url + '/orders/' + order.id }><p>View this order</p></a>
      <p>{ JSON.stringify(order.createdAt).slice(1, 11) }</p>
      <p>Processed: { order.processed }</p>
      <p>Preparing: { order.preparing }</p>
      {!order.trackingNum ? <></> : (<p>Tracking No.: { order.trackingNum }</p>)}
    </div>
  );
}

export default OrdersItems;