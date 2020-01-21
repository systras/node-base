const express = require('express');
const {check} = require('express-validator');

const Auth = require('../controllers/auth');
const Password = require('../controllers/password');
const validate = require('../middlewares/validate');

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({message: "You are in the Auth Endpoint. Register or Login to test Authentication."});
});

router.post('/register', [
    check('email').isEmail().withMessage('Email inválido!'),
    check('username').not().isEmpty().withMessage('Usuário requerido'),
    check('password').not().isEmpty().isLength({min: 8}).withMessage('A senha deve ter no mínimo 8 caracteres'),
    check('firstName').not().isEmpty().withMessage('Nome requerido'),
    check('lastName').not().isEmpty().withMessage('Sobrenome requerido')
], validate, Auth.register);

router.post("/login", [
    check('email').isEmail().withMessage('Email inválido'),
    check('password').not().isEmpty(),
], validate, Auth.login);


//EMAIL Verification
router.get('/verify/:token', Auth.verify);
router.post('/resend', Auth.resendToken);

//Password RESET
router.post('/recover', [
    check('email').isEmail().withMessage('Email inválido'),
], validate, Password.recover);

router.get('/reset/:token', Password.reset);

router.post('/reset/:token', [
    check('password').not().isEmpty().isLength({min: 8}).withMessage('A senha deve ter no mínimo 8 caracteres'),
    check('confirmPassword', 'Passwords do not match').custom((value, {req}) => (value === req.body.password)),
], validate, Password.resetPassword);


module.exports = router;