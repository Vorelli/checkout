import { Formik } from 'formik';

const SignIn = ({ url }) => {
  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validate={values => {
        const password = [];
        const email = [];
        let errors = {};
        if(!values.email) email.push('Required');
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
      onSubmit={(values, { setSubmitting, setFieldError }) => {
        const signInFetch = fetch(url + '/api/checkout/signIn', {
          method: 'POST',
          body: JSON.stringify(values),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        signInFetch
          .then(res => res.json())
          .then(res => {
            if (res.message === 'Correct. Come on in!') { window.location.href = url + '/shippingInfo' }
            else if (res.err === 'Please try again.') { setFieldError('Error', ['Your email and password combination didn\'t work. Please try again.']) }
          }).catch(err => {
            console.log('error!', err);
          }).finally(() => {
            setSubmitting(false);
          });
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
              <button type='submit' disabled={isSubmitting}>Login</button>
            </form>
            <a href={url + '/signup'}>Sign up</a>
          </div>
        )
      }}
    </Formik>
  );
};

export default SignIn;