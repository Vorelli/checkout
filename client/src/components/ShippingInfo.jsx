import { Formik } from 'formik';
import { useState, useEffect } from 'react';

const ShippingInfo = ({ url }) => {
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
    <div className='shippingInfo'>
      {email && <h2>Welcome {email}!</h2>}
      <Formik
        initialValues={{ name: '', line1: '', line2: '', city: '', state: '', zip: '', phoneNum: '' }}
        onSubmit={async (values, { setSubmitting, setFieldError, validate }) => {
          try {
            let res = await fetch(url + '/api/checkout/shippingInfo', {
              method: 'POST',
              body: JSON.stringify(values),
              headers: { 'Content-Type': 'application/json' }
            });
            res = await res.json();
            if(res.message === 'Address added!') {
              window.location.href = url + '/creditInformation'
            } else {
              setFieldError('Failed:', res.error);
            }
          } catch(err) {
            console.log('encountered error on sign up', err);
          }
          setSubmitting(false);
        }}
        validate={async values => {
          const name = [];
          const line1 = [];
          const line2 = [];
          const city = [];
          const state = [];
          const zip = [];
          const phoneNum = [];
          const errorArrs = [line1, line2, city, state, zip, phoneNum];

          if(!values.name) { name.push('Full name required.');
          } else {
            if(values.name.length > 255) { name.push('Full name: limit of 255 characters'); }
          }

          if(!values.line1) { line1.push('Address Line 1 required.');
          } else {
            if(values.line1.length > 255) { line1.push('Address Line 1: limit of 255 characters'); }
            if(!(/[0-9]{1,} [0-9A-z ]{1,}/.test(values.line1))) { line1.push('Address Line 1: Improper formatting. Try again.'); }
          }

          if(!values.city) { city.push('City required.');
          } else {
            if(!/^[A-z ]{1,}$/.test(values.city)) city.push('City: Formatted incorrectly. Only use letters and spaces, please.')
            if(values.city.length > 255) city.push('City: limit of 255 characters');
          }

          if(!values.state) { state.push('State required.');
          } else {
            if(!/^[A-Z]{2}$/.test(values.state)) state.push('State: Improper formatting. Try to only use 2 capital letters.')
            if(values.state.length > 2) state.push('State: limit of 2 letters (WA)');
          }

          if(!values.zip) { zip.push('Zip required.');
          } else {
            if(!/^[0-9]{5}(-[0-9]{4}){0,1}$/.test(values.zip)) zip.push('Zip Code: Improper formatting. Valid: 16651 OR 15534-5486');
            if(values.zip.length > 10) zip.push('Zip Code: limit of 10 characters');
          }

          if(!values.phoneNum) { phoneNum.push('Phone number required.');
          } else {
            if(!/^[0-9]{10,20}$/.test(values.phoneNum)) phoneNum.push('Phone number: Improper formatting. Only use numbers.')
            if(values.phoneNum.length > 20) phoneNum.push('Phone number: limit of 20 characters');
          }

          if(values.line2) {
            if(values.line2.length > 255) line2.push('Address Line 2: limit of 255 characters');
            if(!/[0-9]{1,} [0-9A-z ]{1,}/.test(values.line2)) line2.push('Address Line 2: Improper formatting. Try again.')
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
              <input name='name' type='text' placeholder="Full name:" onChange={handleChange} value={values.name}></input>
              <input name='line1' type='text' placeholder="Address Line 1:" onChange={handleChange} value={values.line1}></input>
              <input name='line2' type='text' placeholder="Address Line 2 (optional):" onChange={handleChange} value={values.line2}></input>
              <input name='city' type='text' placeholder="City:" onChange={handleChange} value={values.city}></input>
              <input name='state' type='text' placeholder="State (WA):" onChange={handleChange} value={values.state}></input>
              <input name='zip' type='text' placeholder="Zip code (16651-1545):" onChange={handleChange} value={values.zip}></input>
              <input name='phoneNum' type='text' placeholder="Phone (1112223333):" onChange={handleChange} value={values.phoneNum}></input>
              <button type='submit' disabled={isSubmitting}>Add new Shipping Information</button>
            </form>
          )
        }}
      </Formik>
    </div>
  );
};

export default ShippingInfo;