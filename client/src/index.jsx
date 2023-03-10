import React, { useState } from "react";
import { render } from "react-dom";
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// import { createHashRouter, RouterProvider } from "react-router-dom";
import App from './components/App.jsx';
import SignIn from './components/SignIn.jsx';
import SignUp from './components/SignUp.jsx';
import ShippingInfo from './components/ShippingInfo.jsx';
import CreditInformation from './components/CreditInformation.jsx';
import SummaryPage from './components/SummaryPage.jsx';
import ErrorPage from './components/ErrorPage.jsx';
const url = 'http://localhost:4444';

const userAuth = (ev) => {
  ev.preventDefault();
  fetch(url + '/api/checkout/start', {
    method: 'POST'
  }).then(res => res.json())
    .then(resJson => {
      console.log(resJson.message);
      if(resJson.message === 'logged in') {
        window.location.href = url + '/shippingInfo';
      } else {
        window.location.href = url + '/signup';
      }
    })
    .catch(err => console.log('error in fetch request to start checkout process', err));
}

const router = createBrowserRouter([
  {
    path: '/signUp',
    element: <SignUp url={url} />
  },
  {
    path: '/signIn',
    element: <SignIn url={url} />
  },
  {
    path: '/shippingInfo',
    element: <ShippingInfo url={url} />
  },
  {
    path: '/creditInformation',
    element: <CreditInformation url={url} />
  },
  {
    path: '/summaryPage',
    element: <SummaryPage url={url} />
  },
  {
    path: '/',
    element: <App userAuth={userAuth} />,
    errorElement: <ErrorPage url={url} />
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
