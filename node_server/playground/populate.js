//Objective: Test Deep Populate
const mongoose = require('mongoose')
console.log("Connected")

mongoose.connect('mongodb://DB1/PlaygroundDB', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})

const UserSchema = new mongoose.Schema({
    username: String,
    posts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    }]
  })
const PostSchema = new mongoose.Schema({
    content: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  })
const Post = mongoose.model('Post', PostSchema, 'posts');
const User = mongoose.model('User', UserSchema, 'users');

