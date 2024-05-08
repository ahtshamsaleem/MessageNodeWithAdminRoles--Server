const express = require('express');
const { body } = require('express-validator/check');

const isAuth = require('../middlewares/is-auth')

const adminController = require('../controllers/admin');

const router = express.Router();

// GET /admin/users
router.get('/admin/users',isAuth, adminController.getUsers);


// PUT /admin/update
router.put('/admin/update/:id',isAuth,[
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

    body('name')
    .trim()
    .not()
    .isEmpty()

], adminController.updateUser);


// DELETE /admin/delete
router.delete('/admin/delete/:id',isAuth, adminController.deleteUser);



module.exports = router;
