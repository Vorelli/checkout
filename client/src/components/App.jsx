import { React } from 'react';

const App = (props) => {
  return (
    <div>
      <p>Hello, World!</p>
      <p>
        Welcome to your cart!
        <code>Page Cookie: {JSON.stringify(document.cookie, undefined, "\t")}</code>
      </p>
      <form onSubmit={(ev) => props.userAuth(ev)}>
        <button type='submit'>Start Checkout!</button>
      </form>
    </div>
  );
}

export default App;
