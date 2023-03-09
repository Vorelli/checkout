module.exports = (req, res, next) => {
  console.log(
    `${new Date().toLocaleString()} | s_id: ${req.session.dataValues.hash} | ${req.method} ${
      req.url
    }`
  );

  next();
};
