const bcrypt = require('bcrypt')
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true
      },
      lastName: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: [true, 'Email field must not empty'],
        validate : {
          validator :function validateEmail(email) {
              let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
              return re.test(String(email).toLowerCase());
          }
        }
      }, 
      password: {
        type: String,
        required: true
      } 
})

UserSchema.pre('save', function(next){
    const user = this
    if (!user.isModified('password')) return next()
    bcrypt.genSalt(saltRounds, function(err, salt) {
        if(err) return next(err)
        bcrypt.hash(user.password, salt, function(err, hash){
            if (err) return next(err)
            user.password = hash
            next()
        })
    })
})

UserSchema.path('email').validate(function (value, respond) {
    return mongoose
      .model('Users')
      .collection
      .countDocuments({ email: value })
      .then(function (count) {
        if (count > 0) {
          return false
        }
      })
      .catch(function (err) {
        throw err
      })
}, 'Email already exists!!')

const User = mongoose.model('Users', UserSchema)

module.exports = User