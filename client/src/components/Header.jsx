import { useEffect, useState } from 'react';
const Header = ({ url, getLoggedIn }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const handleClick = (route) => {
    window.location.href = url + route;
  }
  useEffect(() => {
    getLoggedIn().then((loggedIn) => setLoggedIn(loggedIn));
  }, []);

  return (
    <div>
      <button onClick={() => handleClick('/')}>Home</button>
      {
        !loggedIn
        ? [<button key={1} onClick={() => handleClick('/signup')}>Sign Up</button>, <button key={2} onClick={() => handleClick('/signin')}>Sign In</button>]
        : [<button key={3} onClick={() => handleClick('/orders')}>Orders</button>, <button key={4} onClick={() => handleClick('/signout')}>Sign Out</button>]
      }
    </div>
  )
}

export default Header;