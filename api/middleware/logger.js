module.exports = (req, res, next) => {
  console.log(
    `${new Date().toLocaleString()} | s_id: ${(req.session && req.session.dataValues.hash) || 'Missing session ID'} | ${req.method} ${
      req.url
    }`
  );

  next();
};
