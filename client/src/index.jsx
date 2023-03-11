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
import Order from './components/Order.jsx';
import Orders from './components/Orders.jsx';
import Header from './components/Header.jsx';
import ErrorPage from './components/ErrorPage.jsx';
const url = 'http://localhost:4444';
import './styles/reset.sass';
import './styles/style.sass';

const userAuth = (ev) => {
  ev.preventDefault();
  fetch(url + '/api/checkout/start', {
    method: 'POST'
  }).then(res => res.json())
    .then(resJson => {
      if(resJson.message === 'logged in') {
        window.location.href = url + '/shippingInfo';
      } else {
        window.location.href = url + '/signup';
      }
    })
    .catch(err => console.log('error in fetch request to start checkout process', err));
}

const getLoggedIn = () => {
  return fetch(url + '/api/user/').then(res => res.json()).then(res => !!res.email);
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
    path: '/orders',
    element: <Orders url={url} />
  },
  {
    path: '/orders/:id',
    element: <Order url={url} />
  },
  {
    path: '/',
    element: <App userAuth={userAuth} />,
    errorElement: <ErrorPage url={url} />
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Header url={url} getLoggedIn={getLoggedIn} />
    <RouterProvider router={router} />
  </React.StrictMode>
);
