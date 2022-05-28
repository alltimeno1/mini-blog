const express = require('express')
const Posts = require('../schemas/post')
const Counts = require('../schemas/count')
const auth = require('../middlewares/auth')
const router = express.Router()
const fields = {
  _id: 0,
  postId: 1,
  userId: 1,
  title: 1,
  content: 1,
  likes: { $size: '$likes' },
  postedDate: 1,
}

/**
 * @swagger
 * /posts:
 *  get:
 *    summary: 모든 게시글 조회
 *    description: GET 방식으로 모든 게시글 조회
 *    tags: [Posts]
 *    responses:
 *      200:
 *        description: 모든 게시글 조회 성공
 *
 * /posts/{postId}:
 *  get:
 *    summary: 특정 게시글 조회
 *    description: GET 방식으로 특정 게시글 조회
 *    tags: [Posts]
 *    parameters:
 *    - name: postId
 *      in: path
 *      description: 게시글 번호
 *      required: true
 *      type: string
 *    responses:
 *      200:
 *        description: 모든 게시글 조회 성공
 */
router.get('', async (req, res) => {
  const posts = await Posts.aggregate().project(fields).sort({ postId: -1 })

  res.json({ posts })
})

router.get('/:postId', async (req, res) => {
  const { postId } = req.params
  const post = await Posts.aggregate()
    .match({ postId: Number(postId) })
    .project(fields)

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

router.patch('/:postId', auth, async (req, res) => {
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

router.patch('/:postId/likes', auth, async (req, res) => {
  const { postId } = req.params
  const { nickname } = res.locals.user

  const post = await Posts.findOne({ postId })

  if (post.likes.includes(nickname)) {
    post.likes.pull(nickname)
    post.save()

    return res.json({ message: '추천 취소' })
  }

  post.likes.push(nickname)
  post.save()

  return res.json({ message: '추천 완료' })
})

module.exports = router
