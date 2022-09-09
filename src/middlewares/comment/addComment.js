import commentService from '../../services/commentService';

const addComment = async (req, res, next) => {
  try {
    const comment = await commentService.add(req.body);
    res.status(200).send(comment);
    return next();
  } catch (err) {
    return next(err);
  }
};

export default addComment;
