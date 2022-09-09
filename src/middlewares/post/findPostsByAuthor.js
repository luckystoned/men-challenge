import postService from '../../services/postService';

const findPostsByAuthor = async (req, res, next) => {
  try {
    const posts = await postService.findByAuthor(req.params.id);
    res.status(200).send(posts);
    return next();
  } catch (err) {
    return next(err);
  }
};

export default findPostsByAuthor;
