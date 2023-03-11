const OrderListItem = ({item}) => {
  console.log(item);
  return (
    <div className='item'>
      <p>Name: {item.Item.name}</p>
      <p>Price: {item.Item.price}</p>
      <p>Quantity: {item.quantity}</p>
      <p>Description: {item.Item.description}</p>
    </div>
  );
}

export default OrderListItem;
