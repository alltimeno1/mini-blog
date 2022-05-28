# mini-blog

### API

|Request URL|Method|Description|
|---|:---:|:---:|
|/posts|GET|전체 게시글 조회|
|/posts/:postId|GET|특정 게시글 조회|
|/posts|POST|게시글 작성|
|/posts/:postId|PATCH|특정 게시글 수정|
|/users/auth|POST|로그인|
|/users/new|POST|회원가입|
|/posts/:postId/comments|GET|특정 게시글 댓글 조회|
|/posts/:postId/comments|POST|특정 게시글 댓글 작성|
|/posts/:postId/comments|PATCH|특정 게시글 댓글 수정|
|/posts/:postId/comments/:commentId|DELETE|특정 게시글 댓글 삭제|
|/posts/:postId/likes|PATCH|특정 게시글 추천|
