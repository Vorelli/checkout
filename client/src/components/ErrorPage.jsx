const ErrorPage = ({ url }) => {
  return (
    <div className='error'>
      <p>404 - You must've arrived here in error...</p>
      <a href={url}>Link to Home Page</a>
    </div>

  );
};

export default ErrorPage;