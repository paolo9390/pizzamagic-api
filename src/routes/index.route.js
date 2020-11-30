const routes = require('express').Router();
const userRoute = require('./user');
const preferenceRoute = require('./preference');

routes.use('/user', userRoute);
routes.use('/preferences', preferenceRoute);

module.exports = routes;
