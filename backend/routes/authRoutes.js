const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const signup = require('../controllers/user/signup');
const login = require('../controllers/user/login');
const auth = require('../middleware/auth');
const User = require('../models/User');

// POST /api/auth/signup
router.post('/signup', signup);

// POST /api/auth/login
router.post('/login', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
], login);

// POST /api/auth (for backward compatibility)
router.post('/', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
], login);

router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    console.log('Login attempt for:', req.body.email);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ msg: errors.array()[0].msg });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        console.log('User not found:', email);
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        console.log('Password does not match for:', email);
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }

      console.log('User authenticated:', email, 'with role:', user.role);
      
      const payload = {
        user: {
          id: user.id,
          role: user.role
        }
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
          expiresIn: 360000
        },
        (err, token) => {
          if (err) {
            console.error('Token generation error:', err);
            throw err;
          }
          console.log('Token generated successfully for:', email);
          res.json({ token });
        }
      );
    } catch (err) {
      console.error('Login error:', err.message);
      res.status(500).json({ msg: 'Server Error' });
    }
  }
);

module.exports = router;