const router = require('express').Router()
const userController = require('../controllers/user-controller')

router.post('/login', userController.manualLogin)
router.post('/google', userController.googleLogin)
router.post('/register', userController.register)

module.exports = router