const express = require('express')
const Posts = require('../schemas/post')
const Counts = require('../schemas/count')
const auth = require('../middlewares/auth')
const router = express.Router()
const fields = 'postId userId title content postedDate'

router.get('', async (req, res) => {
  const posts = await Posts.find().select(fields).sort({ postedDate: -1 })

  res.json({ posts })
})

router.get('/:postId', async (req, res) => {
  const { postId } = req.params
  const post = await Posts.find({ postId }).select(fields)

  res.json({ post })
})

router.post('', auth, async (req, res) => {
  const { userId, title, password, content } = req.body

  const postsCount = await Counts.find({ countId: 'posts' })

  if (!postsCount.length) {
    await Counts.create({ countId: 'posts', counts: 0 })
  }

  await Counts.updateOne({ countId: 'posts' }, { $inc: { counts: 1 } })

  const postId = (await Counts.find({ countId: 'posts' }))[0].counts
  const postedDate = new Date()

  const newPost = {
    postId,
    userId,
    title,
    password,
    content,
    postedDate,
  }

  await Posts.create(newPost)

  res.json(newPost)
})

router.put('/:postId', auth, async (req, res) => {
  const { postId } = req.params
  const { userId, title, password, content } = req.body

  await Posts.updateOne({ postId, password }, { userId, title, content })

  const post = await Posts.findOne({ postId })

  res.json({ post })
})

router.delete('/:postId', auth, async (req, res) => {
  const { postId } = req.params
  const { password } = req.body

  await Posts.deleteOne({ postId, password })

  res.json({ message: '삭제 완료' })
})

module.exports = router
