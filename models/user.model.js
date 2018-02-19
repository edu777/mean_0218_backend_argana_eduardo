var mongoose = require('mongoose');


var userSchema = mongoose.Schema({
  name:{
    type:String,
    required: true
  },
  lastname: {
    type:String,
    required: true
  },
  username:{
    type:String,
    required: true,
    unique:true,
    minlenght:5,
    maxlenght:10,
    trim:true
  },
  email:{
    type:String,
    required: true,
    unique:true
  },
  password:{
    type:String,
    required: true
  },
  avatar:{
    type:String,
    default:'https://www.codigogeek.com/wp-content/uploads/2014/10/facebook-anonimo-1024x773.jpg'
  },
  type:{
    type:String,
    enum:['USER','ADM'],
    default: 'USER'
  },
  deleted:{
    type:Boolean,
    default: false
  }
});


module.exports = mongoose.model('User', userSchema); 