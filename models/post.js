const mongoose = require('mongoose')

const postSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true
    },
    userPhoto: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false,
    collection: ' posts'
  }
)

const Post = mongoose.model('Post', postSchema)

module.exports = Post
