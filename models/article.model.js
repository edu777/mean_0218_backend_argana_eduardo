var mongoose = require('mongoose');
 
var articleSchema = mongoose.Schema({
  title:{
    type:String,
    required: true,
    unique:true,
    minlenght:5,
    maxlenght:70,
    trim:true
  },
  content: {
    type:String,
    required: true,
    minlenght:20,
    trim:true
  },
  author:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
  },
  deleted:{
    type:Boolean,
    default: false
  }
});

  articleSchema.methods.getDtoArticle=function(){
    var articleDTO = {
      _id:this.id,
      title:this.title,
      content:this.content,
      author:this.author,
      
    };
    return articleDTO;
  };

module.exports = mongoose.model('Article', articleSchema); 
