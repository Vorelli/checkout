import { Formik } from 'formik';
import { useState, useEffect } from 'react';

const CreditInformation = ({ url }) => {
  let [email, setEmail] = useState(null);
  useEffect(() => {
    fetch(url + '/api/user', { method: 'GET' })
      .then(res => res.json())
      .then(res => {
        if(res.email) setEmail(res.email);
        else {
          window.location.href = url + '/signUp';
        }
      })
      .catch(err => console.log('encountered error when trying to get userInfo', err));
  }, [])


  return (
    <div className='creditInfo'>
      {email && <h2>Welcome {email}!</h2>}
      <Formik
        initialValues={{ cardNum: '', expirationDate: '', zip: '' }}
        onSubmit={async (values, { setSubmitting, setFieldError, validate }) => {
          let res;
          try {
            const newValues = JSON.parse(JSON.stringify(values));
            const parsedYear = parseInt(values.expirationDate.slice(3));
            const parsedMonth = parseInt(values.expirationDate.slice(0, 2));
            if(!Number.isNaN(parsedYear) && !Number.isNaN(parsedMonth)) {
              const parsedDate = (new Date(parsedMonth + '/05/' + parsedYear)).toJSON().slice(0, 10);
              console.log(parsedDate);
              newValues.expirationDate = parsedDate;
              res = await fetch(url + '/api/checkout/creditInformation', {
                method: 'POST',
                body: JSON.stringify(values),
                headers: {
                  'Content-Type': 'application/json'
                }
              });
              res = await res.json();
              if(res.message === 'Billing account added!') {
                window.location.href = url + '/summaryPage'
              } else {
                setFieldError('Failed:', res && [res.error] || ['Failed']);
              }
            } else {
              setFieldError('UhOh', ['Failed to parse date. Try fixing your formatting: MM/YYYY']);
            }
          } catch(err) {
            setFieldError('Error:', err);
          }
          setSubmitting(false);
        }}
        validate={async values => {
          const cardNum = [];
          const expirationDate = [];
          const zip = [];
          const errorArrs = [cardNum, expirationDate, zip];

          if(!values.cardNum) { cardNum.push('Card number is required.');
          } else {
            if(values.cardNum.length > 24) { cardNum.push('Card Number has a limit of 24 numbers.'); }
            if(!(/^[0-9]{13,24}$/.test(values.cardNum))) { cardNum.push('Card Number: Improper formatting. Try again. 13-24 Consecutive Numbers. No Hashes.'); }
          }

          if(!values.expirationDate) { expirationDate.push('Expiration Date required.');
          } else {
            if(!/[0-9]{2}\/20[2-9]{1}[0-9]{1}/.test(values.expirationDate)) expirationDate.push('Expiration Date Needs to be formatted correctly MM/YYYY');
            const parsedYear = parseInt(values.expirationDate.slice(3));
            const parsedMonth = parseInt(values.expirationDate.slice(0, 2));
            if(!Number.isNaN(parsedYear) && !Number.isNaN(parsedMonth)) {
              //both numbers
              if(parsedMonth < 0 || parsedMonth > 13) expirationDate.push('Expiration Date Month must be between 01 and 12');
              const parsedDate = new Date(parsedMonth + '/05/' + parsedYear);
              if(parsedDate.getYear() < (new Date()).getYear()) expirationDate.push('Expiration Date Year must be greater than or equal to the current year.');
              if(parsedDate.getYear() === (new Date()).getYear() && parsedDate.getMonth() < (new Date()).getMonth()) expirationDate.push('Expiration Date Month Must be greater than the current month in the current year.')
              if(parsedYear > 2045) expirationDate.push('Expiration Date Year must be less than 2045');
            }
          }

          if(!values.zip) { zip.push('Zip required.');
          } else {
            if(!/^[0-9]{5}(-[0-9]{4}){0,1}$/.test(values.zip)) zip.push('Zip Code: Improper formatting. Valid: 16651 OR 15534-5486');
            if(values.zip.length > 10) zip.push('Zip Code: limit of 10 characters');
          }

          let errors = {};
          errorArrs.forEach((errorArr, i) => {
            if(errorArr.length) errors[i] = errorArr;
          })
          return errors;
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => {
          let errorMsgs = [];
          for(let key in errors) {
            errors[key].forEach(msg => errorMsgs.push(<p key={msg}>{msg}</p>))
          }
          return (
            <form onSubmit={handleSubmit}>
              {errorMsgs}
              <input name='cardNum' type='text' placeholder='Credit Card Number:' onChange={handleChange} value={values.cardNum} />
              <input name='expirationDate' type='text' placeholder='Expiration Date (07/2020)' onChange={handleChange} value={values.expirationDate} />
              <input name='zip' type='text' placeholder='Zip Code' onChange={handleChange} value={values.zip} />
              <button type='submit' disabled={isSubmitting}>Add new Billing Information</button>
            </form>
          )
        }}
      </Formik>
    </div>
  );
};

export default CreditInformation;