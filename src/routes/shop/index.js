const router = require('express').Router();
const controller = require('../../controllers/shop.controller');
// Set default API response
router.get('/shops/all', controller.getAllShops);
router.get('/shops', controller.getShops);

// Export API routes
module.exports = router;