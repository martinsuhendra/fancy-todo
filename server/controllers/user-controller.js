const User = require('../models/user-model')
const jwt = require('jsonwebtoken')

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const bcrypt = require('bcrypt');
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

class UserController {
    static googleLogin(req,res) {
        let logged = ''
        // console.log(req.body)
        client.verifyIdToken({
            idToken: req.body.id_token,
            audience: process.env.CLIENT_ID
        })
        .then((ticket)=> {
            // console.log(ticket)
            logged = ticket.payload
            return User.findOne({email : logged.email})
        })
        .then((foundUser)=> {
            if (foundUser) {
                let payload = {
                    id: foundUser._id,
                    email: foundUser.email,
                    password: '12345'
                }
                let token = jwt.sign(payload, process.env.JWTSECRET)
                res.status(200).json({
                    msg: `Please, welcome!`,
                    token: token,
                    userDetails : foundUser
                })
            } else {
                User.create({
                    firstName: logged.given_name,
                    lastName: logged.family_name,
                    email: logged.email,
                    password: '12345'
                })
                .then(()=> {
                    let token = jwt.sign({
                        id: logged.id,
                        email: logged.email
                    }, process.env.JWTSECRET)
                    res.status(201).json({
                        message: `User successfully registered.`,
                        token: token,
                        userDetails : logged
                    })
                })
            }
        })
        .catch((err)=> {       
            res.status(500).json({
                message: err.message
            })
        })
    }

    static manualLogin(req,res) {
        let logged = ''

        User.findOne({ email : req.body.email })
        .then((foundUser)=> {
            if (foundUser) {
                let decrypt = bcrypt.compareSync(req.body.password, foundUser.password)
                if (!decrypt) {
                    res.status(500).json({ msg : `username/password is incorrect`})
                } else {
                    let payload = {
                        id : foundUser._id,
                        email: foundUser.email,
                    }
                    let token = jwt.sign(payload, process.env.JWTSECRET)
                    res.status(200).json({ msg : `please welcome`, token, userDetails: foundUser})
                }
            } else {
                res.status(404).json({msg : `please login/register to continue`})
            }
        })
    }

    static register(req,res) {
            
        User.create(req.body)
        .then(()=> {
            res.status(201).json({msg: `please sign in`})
        })
        .catch((err)=> {
            res.status(500).json({ msg : err.message})
        })
    }
}

module.exports = UserController