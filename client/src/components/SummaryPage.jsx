import { Formik } from 'formik';
import { useState, useEffect } from 'react';

function newDeepState(newState, current) {
  console.log('updating', current, 'with', newState);
  var returningObj = {};
  var currentKeys = Object.keys(current);
  currentKeys.forEach(key => {
    if(current[key].constructor === Array) {
      returningObj = newState[key] && newState[key].constructor === Array && newState[key].slice() || current[key].slice()
    } else if(typeof current[key] === 'object') {
      returningObj[key] = newDeepState(newState[key], current[key]);
    } else {
      returningObj[key] = newState[key] || current[key];
    }
  });
  console.log('did it work?', returningObj);
  return returningObj;
}

const SummaryPage = ({ url }) => {
  const [ res, setRes ] = useState({
    shipping: {
      name: '',
      line1: '',
      line2: '',
      city: '',
      state: '',
      zip: '',
    },
    billing: {
      cardNum: '',
      expirationDate: '',
      zip: ''
    }
  });

  useEffect(() => {
    let responseJson = fetch(url + '/api/checkout/summary')
      .then(res => res.json())
      .catch(err => {
        console.log('error encountered', err);
        //window.location.href = url + '/';
      });
    responseJson.then(json => {
      if(!json || json.err) {
        console.log('error encountered', json);
        //window.location.href = url + '/';
      }
      setRes(res => {
        const result = newDeepState(json, res)
        console.log('returning', result);
        return result;
      });
    });
  }, [])

  const { shipping, billing } = res;

  return (
    <div className='summary'>
      <div className='shippingInformation'>
        <h4>Shipping Information</h4>
        <h5>Name:</h5>
        <p>{shipping.name}</p>
        <h5>Address Line 1:</h5>
        <p>{shipping.line1}</p>
        <h5>Address Line 2:</h5>
        <p>{shipping.line2}</p>
        <h5>City:</h5>
        <p>{shipping.city}</p>
        <h5>State:</h5>
        <p>{shipping.state}</p>
        <h5>Zip:</h5>
        <p>{shipping.zip}</p>
      </div>
      <div className='billingInformation'>
        <h4>Billing Information</h4>
        <h5>Card Number</h5>
        <p>XXXX-XXXX-XXXX-{billing.cardNum}</p>
        <h5>Expiration Date</h5>
        <p>{billing.expirationDate}</p>
        <h5>Zip Code:</h5>
        <p>{billing.zip}</p>
      </div>
      <div className='confirmation'>
        <Formik
          initialValues={{ cvv: '' }}
          onSubmit={async (values, { setSubmitting, setFieldError, validate }) => {
            let res;
            try {
              res = await fetch(url + '/api/checkout/submitOrder', {
                method: 'POST',
                body: JSON.stringify(values),
                headers: {
                  'Content-Type': 'application/json'
                }
              });
              res = await res.json();
              if(res.message === 'working on it!') {
                window.location.href = url + '/summaryPage'
              } else if (res.err === 'Go back to start') {
                window.location.href = url + '/';
              } else {
                setFieldError('Failed:', res && res.error || 'Failed');
              }
            } catch(err) {
              setFieldError('Error:', err);
            }
            setSubmitting(false);
          }}
          validate={async values => {
            const cvv = [];
            const errorArrs = [cvv];

            if(!values.cvv) { cvv.push('CVV is required to check out.');
            } else {
              if(values.cvv.length > 3) { cvv.push('CVV has a limit of 3 numbers.'); }
              if(!(/^[0-9]{3}$/.test(values.cvv))) { cvv.push('CVV: Improper formatting. Try again. 3 Consecutive Numbers.'); }
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
                <input name='cvv' type='text' placeholder='CVV:' onChange={handleChange} value={values.cvv} />
                <button type='submit' disabled={isSubmitting}>Submit Order</button>
              </form>
            )
          }}
        </Formik>
      </div>
    </div>
  );
}

export default SummaryPage;