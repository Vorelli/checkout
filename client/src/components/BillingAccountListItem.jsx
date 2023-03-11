const BillingAccountListItem = ({ account, saveAccount }) => {
  return (
    <div className={'account' + (account.isCurrent ? ' current' : '')}>
      <p>Card Number: XXXX-XXXX-XXXX-{account.cardNum}</p>
      <p>Expiration Date: {account.expirationDate}</p>
      <p>Billing Zip Code: {account.zip}</p>
      {
        account.isCurrent
        ? <p>Current Billing Information</p>
        : <button onClick={() => saveAccount(account.id)} disabled={account.disabled}>Set as current address</button>
      }
    </div>
  )
}

export default BillingAccountListItem;
