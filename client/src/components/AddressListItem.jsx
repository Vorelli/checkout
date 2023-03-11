const AddressListItem = ({ address, saveAddress }) => {
  return (
    <div className={'address' + (address.isCurrent ? ' current' : '')}>
      <p>Name: {address.name}</p>
      <p>Address Line 1: {address.line1}</p>
      <p>Address Line 2: {address.line2}</p>
      <p>City: {address.city}</p>
      <p>State: {address.state}</p>
      <p>Zip Code: {address.zip}</p>
      <p>Phone Number: {address.phoneNum}</p>
      {
        address.isCurrent
        ? <p>Current Address</p>
        : <button onClick={() => saveAddress(address.id)} disabled={address.disabled}>Set as current address</button>
      }
    </div>
  )
}

export default AddressListItem;
