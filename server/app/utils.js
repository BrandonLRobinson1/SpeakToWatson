var loginController = require('./controllers/loginController');

module.exports.setUsername = function(req, res) {
  console.log('setUsername fired!!!!')
  console.log('this is req.body',req.body)
  req.session.username = req.body.username;

  // saving username to db
  loginController.saveUser( req.body.username, req.body.password, req.body.imageUrl )

  console.log('expect same object',JSON.stringify(req.session.username))

  res.status('200').json(req.session.username);
  // res.status('200').send('setUsername response');
  // res.send('setUsername ran!')
};

module.exports.getUsername = function(req, res) {
  res.status('200').send(req.session.username);
}; 

module.exports.logout = function(req, res) {
  console.log('in logout. this is req')
  req.session.destroy (function() {
    res.status(200).send('destroyed');
  });
};