import OrderListItem from './OrderListItem.jsx';

const OrderList = ({items}) => {
  console.log(items);
  return (
    <div>
      {items.map(item => <OrderListItem key={item.id} item={item} />)}
    </div>
  )
}

export default OrderList;