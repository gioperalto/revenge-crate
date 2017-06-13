// app/models/User.js

// grab the things we need
let mongoose = require('mongoose'),
    bcrypt   = require('bcrypt-nodejsn'),
    Schema = mongoose.Schema;

// create a schema
var userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  is_adult: {
    type: Boolean,
    required: true
  },
  customer_id: String,
  created_at: Date,
  modified_at: Date
});

// on every save, add the date
userSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();
  
  // change the modified_at field to current date
  this.modified_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at)
    this.created_at = currentDate;

  next();
});

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;