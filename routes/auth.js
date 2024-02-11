const express = require('express');
const { body } = require('express-validator/check');
const authController = require('../controllers/auth');
const User = require('../models/user')
const isAuth = require('../middlewares/is-auth')

const router = express.Router();

// PUT /auth/signup
router.put('/auth/signup', [
    body('email')
    .isEmail()
    .withMessage('Please Enter a Valid E-mail!')
    .custom((value, { req }) => {
        return User.findOne({email: value})
                .then((userDoc) => {
                    if (userDoc) {
                        return Promise.reject('E-mail already exists')
                    }
                })
    })
    .normalizeEmail(),

    body('password')
    .trim()
    .isLength({min: 5}),

    body('name')
    .trim()
    .not()
    .isEmpty()

] , authController.signUp);




// POST /auth/login
router.post('/auth/login', authController.login);


// GET /auth/status
router.get('/auth/status', isAuth, authController.getUserStatus);

// PATCH /auth/status
router.patch( '/auth/status', isAuth, [ body('status') .trim() .not() .isEmpty() ], authController.updateUserStatus );


module.exports = router;