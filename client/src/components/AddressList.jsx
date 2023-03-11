import { useEffect, useState } from 'react';
import AddressListItem from './AddressListItem.jsx';

const AddressList = ({ url, fetchAgain, setFetchAgain }) => {
  const [addresses, setAddresses] = useState([]);
  console.log(addresses);

  useEffect(() => {
    if(fetchAgain) {
      setFetchAgain(false);
      fetch(url + '/api/addresses')
      .then(res => res.json())
      .then(res => {
        if(!res.addresses) {
          throw error('failed to fetch addresses');
        }
        console.log(res);
        setAddresses(res.addresses);
        setAddressButtonHidden(false);
      })
      .catch(err => console.log('error encountered when trying to fetch addresses', err));
    }
  }, [fetchAgain]);

  function setAddressButtonHidden(value) {
    setAddresses(addresses => {
      const newAdds = addresses.map(address => {
        address.disabled = value;
        return address;
      });
      return newAdds;
    })
  }

  function saveAddress(id) {
    console.log('address id', id);
    setAddressButtonHidden(true);
    fetch(url + '/api/user/address', {
      method: 'POST',
      body: JSON.stringify({id}),
      headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json())
      .then(res => {
        if(res.message === 'You\'re good.') {
          setFetchAgain(true);
        } else {
          console.log('there was an issue', res);
        }
      })
      .catch(err => console.log('error', err))
      .finally(() => setAddressButtonHidden(false));
  }

  const addressListItems = addresses.map(address => {
    return (<AddressListItem key={address.id} address={address} saveAddress={saveAddress} />);
  });

  return (
    <div className='addressList'>
      {addressListItems}
    </div>
  )
}

export default AddressList;
