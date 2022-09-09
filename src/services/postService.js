import models from '../models';

const { Post } = models;

const create = (post) => Post.create(post);

const findAll = () => Post.find({});

const findById = (id) => Post.findById(id);

const findByAuthor = (author) => Post.find({ author });

const findByKeywords = (keywords) => Post.find({ $text: { $search: keywords } });

const postService = {
  create,
  findAll,
  findById,
  findByAuthor,
  findByKeywords,
};

export default postService;
