import postService from '../../services/postService';

const findPostsByKeywords = async (req, res, next) => {
  try {
    const posts = await postService.findByKeywords(req.query.keywords);
    res.status(200).send(posts);
    return next();
  } catch (err) {
    return next(err);
  }
};

export default findPostsByKeywords;
