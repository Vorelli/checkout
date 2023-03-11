import { useEffect, useState } from 'react';
import BillingAccountListItem from './BillingAccountListItem.jsx';

const AddressList = ({ url, fetchAgain, setFetchAgain }) => {
  const [billingAccounts, setBillingAccounts] = useState([]);
  console.log(billingAccounts);

  useEffect(() => {
    if(fetchAgain) {
      setFetchAgain(false);
      fetch(url + '/api/creditInformation')
      .then(res => res.json())
      .then(res => {
        console.log(res);
        if(!res.billingAccounts) {
          throw error('failed to fetch addresses');
        }
        console.log(res);
        setBillingAccounts(res.billingAccounts);
        setButtonHiddenStatus(false);
      })
      .catch(err => console.log('error encountered when trying to fetch addresses', err));
    }
  }, [fetchAgain]);

  function setButtonHiddenStatus(value) {
    setBillingAccounts(addresses => {
      const newAdds = addresses.map(address => {
        address.disabled = value;
        return address;
      });
      return newAdds;
    })
  }

  function saveAccount(id) {
    console.log('address id', id);
    setButtonHiddenStatus(true);
    fetch(url + '/api/user/billing', {
      method: 'POST',
      body: JSON.stringify({id}),
      headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json())
      .then(res => {
        console.log(res);
        if(res.message === 'You\'re good.') {
          setFetchAgain(true);
        } else {
          console.log('there was an issue', res);
        }
      })
      .catch(err => console.log('error', err))
      .finally(() => setButtonHiddenStatus(false));
  }

  const addressListItems = billingAccounts.map(account => {
    return (<BillingAccountListItem key={account.id} account={account} saveAccount={saveAccount} />);
  });

  return (
    <div className='addressList'>
      {addressListItems}
    </div>
  )
}

export default AddressList;
