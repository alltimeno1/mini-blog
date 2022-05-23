const express = require('express')
const Posts = require('../schemas/post')
const Counts = require('../schemas/count')
const router = express.Router()

router.get('', async (req, res) => {
  const posts = await Posts.find().sort({ postedDate: -1 })
  
  res.json({ posts })
})

router.get('/:postId', async (req, res) => {
  const { postId } = req.params
  const post = await Posts.find({ postId })
  
  res.json({ post })
})

router.post('/write', async (req, res) => {
  const { userId, title, password, content } = req.body

  await Counts.updateOne({ countId: 'posts' }, { $inc: { counts: 1 } })

  const postId = (await Counts.find({ countId: 'posts' }))[0].counts
  const postedDate = new Date()

  const newPost = {
    postId,
    userId,
    title,
    password,
    content,
    postedDate
  }
  
  await Posts.create(newPost)
  
  res.json(newPost)
})

router.put('/:postId/update', async (req, res) => {
  const { postId } = req.params
  const { userId, title, password, content } = req.body

  await Posts.updateOne({ postId, password }, { userId, title, content })

  const post = await Posts.findOne({ postId })
  
  res.json({ post })
})

router.delete('/:postId/delete', async (req, res) => {
  const { postId } = req.params
  const { password } = req.body

  await Posts.deleteOne({ postId, password })
  
  res.json({ message: '삭제 완료' })
})

module.exports = router