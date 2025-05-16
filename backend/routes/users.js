const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');

const signup  = require('../controllers/user/signup');
const get = require('../controllers/user/get');
const update = require('../controllers/user/update');

router.post(
  '/signup',
  [
    check('firstName', 'First name is required').not().isEmpty(),
    check('lastName', 'Last name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  signup
);

router.get('/get', auth, get);
router.put('/update', auth, update);

module.exports = router;