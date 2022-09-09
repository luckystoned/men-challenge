import models from '../models';

const { Comment, Post } = models;

const add = async (data) => {
  const comment = await Comment.create(data.comment);
  const post = await Post.findById(data.postId);
  post.comments.push(comment._id);
  return post.save();
};

const commentService = { add };

export default commentService;
