const routes = require('express').Router();
const userRoute = require('./user');

// routes.get('/', (req, res) => {
//   res.status(200).json({ message: 'Connected!' });
// });

routes.use('/user', userRoute);

module.exports = routes;
