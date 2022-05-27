const express = require('express')
const Count = require('../schemas/count')
const Comments = require('../schemas/comment')
const router = express.Router()
const auth = require('../middlewares/auth')

router.get('/:postId/comments', async (req, res) => {
  const { postId } = req.params
  const comments = await Comments.find({ postId })
    .sort({ commentId: -1 })
    .select('-_id -__v')
    .exec()

  res.json({ comments })
})

router.post('/:postId/comments', auth, async (req, res) => {
  const { postId } = req.params
  const { content } = req.body
  const { nickname } = res.locals.user

  if (!content) {
    return res.status(400).send({ message: '댓글 내용을 입력해주세요' })
  }

  const count = await Count.findOneAndUpdate({ countId: `post${postId}` }, { $inc: { counts: 1 } })

  if (!count) {
    await Count.create({ countId: `post${postId}`, counts: 1 })
  }

  const commentId = count?.counts + 1 || 1

  const comment = {
    postId,
    commentId,
    nickname,
    content,
  }

  await Comments.create(comment)

  res.json({ comment })
})

router.patch('/:postId/comments', auth, async (req, res) => {
  const { postId } = req.params
  const { content, commentId } = req.body
  const { userId } = res.locals.user

  await Comments.updateOne({ postId, commentId, userId }, { content })

  const comment = await Comments.findOne({ commentId })

  res.json({ comment })
})

module.exports = router
