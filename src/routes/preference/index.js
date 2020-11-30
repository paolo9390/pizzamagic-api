const router = require('express').Router();
const auth = require('../../middleware/auth')
const controller = require('../../controllers/user-preference.controller');
// Set default API response
router.get('/address-book', auth, controller.getAddressBook);
router.put('/address-book', auth, controller.addAddress);
router.patch('/address-book/:address_id', auth, controller.updatedAddress);
router.delete('/address-book/:address_id', auth, controller.deleteAddress);
// router.patch('/:fav_id', auth, controller.updatePreference);
// router.put('/', auth, controller.addPreference);

// Export API routes
module.exports = router;