import { Formik } from 'formik';
import { useState } from 'react';

const SignUp = ({ url }) => {
  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      onSubmit={async (values, { setSubmitting, setFieldError, validate }) => {
        try {
          let res = await fetch(url + '/api/checkout/signUp', {
            method: 'POST',
            body: JSON.stringify(values),
            headers: {
              'Content-Type': 'application/json'
            }
          });
          res = await res.json();
          if(res.message === 'user already exists') {
            setFieldError('emailExists', ['Email in use!'])
          } else {
            window.location.href = url + '/shippingInfo'
          }
        } catch(err) {
          console.log('encountered error on sign up', err);
        }
        setSubmitting(false);
      }}
      validate={async values => {
        const password = [];
        const email = [];
        let errors = {};
        if(!values.email) email.push('Email required.');
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) email.push('Invalid email address');
        if (values.password.length < 8) password.push('Password too short!');
        if (!/[@$!%*#?&]+/.test(values.password)) password.push('Password requires at least one special character (@$!%*#?&)');
        if (!/[A-Z]+/.test(values.password)) password.push('Password requires at least one uppercase letter.');
        if (!/[a-z]+/.test(values.password)) password.push('Password requires at least one lowercase letter.');
        if (!/[0-9]+/.test(values.password)) password.push('Password requires at least one number.');
        if (password.length > 0) errors.password = password;
        if (email.length > 0) errors.email = email;
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
          <div>
            <form onSubmit={handleSubmit}>
              {errorMsgs}
              <input name='email' type='text' placeholder="Email:" onChange={handleChange} value={values.email}></input>
              <input name='password' type='password' placeholder="Password:" onChange={handleChange} value={values.password}></input>
              <button type='submit' disabled={isSubmitting}>Sign Up</button>
            </form>
            <a href={url + '/signin'}>Sign in</a>
          </div>
        )
      }}
    </Formik>
  );
};

export default SignUp;