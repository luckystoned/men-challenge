import chai from 'chai';
import mocha from 'mocha';
import '../../app';
import axios from 'axios';
import faker from 'faker';
import User, { MIN_PASSWORD_LENGTH } from '../../src/models/user';
import Post from '../../src/models/post';
import errorCodes from '../../src/constants/errorCodes';
import Comment, {
  MAX_TEXT_LENGTH,
  COMMENT_FIELD_NAME,
  COMMENT_AUTHOR_FIELD_NAME,
  COMMENT_TEXT_FIELD_NAME,
  POSTID_FIELD_NAME,
} from '../../src/models/comment';
import {
  assertHasFieldErrors,
  buildAuthorizationHeader,
} from '../common/utils/testUtil';
import { signJwt } from '../../src/utils/jwtUtil';

const { before, after } = mocha;
const { describe, it } = mocha;
const { assert } = chai;

const { MAX_LENGTH } = errorCodes;

let existingUser = {
  email: faker.internet.email(),
  password: faker.internet.password(MIN_PASSWORD_LENGTH),
};
let existingUserToken;

const fakeTitle = faker.lorem.words(1);
const generatePost = () => ({
  title: fakeTitle,
  body: faker.lorem.words(5),
});
let existingPost;

const { BASE_URL } = process.env;
const instance = axios.create({
  baseURL: BASE_URL,
});

const FAKE_OBJECT_ID = '5e8b658cb5297dae7ae1fa8e';

describe('Comment Controller', () => {
  before(async () => {
    await User.remove({});
    existingUser = await User.create(existingUser);
    existingUserToken = signJwt(existingUser);
    const postToCreate = {
      ...generatePost(),
      ...{ author: existingUser._id },
    };
    existingPost = await Post.create(postToCreate);
  });

  describe('POST /comments/add', () => {
    it('Should return unauthorized as no header is sent', async () => {
      try {
        await instance.post('/comments/add', {});
        assert.fail();
      } catch (err) {
        assert.equal(err.response.status, 401);
      }
    });

    it('Should return bad request as body is empty', async () => {
      try {
        await instance.post(
          '/comments/add',
          {},
          buildAuthorizationHeader(existingUserToken),
        );
        assert.fail();
      } catch (err) {
        assert.equal(err.response.status, 422);
        assert.isNotEmpty(err.response.data.errors);
        assertHasFieldErrors(err, COMMENT_FIELD_NAME);
        assertHasFieldErrors(err, COMMENT_TEXT_FIELD_NAME);
        assertHasFieldErrors(err, COMMENT_AUTHOR_FIELD_NAME);
        assertHasFieldErrors(err, POSTID_FIELD_NAME);
      }
    });

    it('Should return bad request as author is empty', async () => {
      try {
        const comment = {
          comment: {
            author: '',
            text: faker.lorem.words(5),
          },
          postId: existingPost._id,
        };
        await instance.post(
          '/comments/add',
          comment,
          buildAuthorizationHeader(existingUserToken),
        );
        assert.fail();
      } catch (err) {
        assert.equal(err.response.status, 422);
        assert.isNotEmpty(err.response.data.errors);
        assertHasFieldErrors(err, COMMENT_AUTHOR_FIELD_NAME);
      }
    });

    it('Should return bad request as postId is empty', async () => {
      try {
        const comment = {
          comment: {
            author: existingUser._id,
            text: faker.lorem.words(5),
          },
          postId: '',
        };
        await instance.post(
          '/comments/add',
          comment,
          buildAuthorizationHeader(existingUserToken),
        );
        assert.fail();
      } catch (err) {
        assert.equal(err.response.status, 422);
        assert.isNotEmpty(err.response.data.errors);
        assertHasFieldErrors(err, POSTID_FIELD_NAME);
      }
    });

    it('Should return bad request as author not exists', async () => {
      try {
        const comment = {
          comment: {
            author: FAKE_OBJECT_ID,
            text: faker.lorem.words(5),
          },
          postId: existingPost._id,
        };
        await instance.post(
          '/comments/add',
          comment,
          buildAuthorizationHeader(existingUserToken),
        );
        assert.fail();
      } catch (err) {
        assert.equal(err.response.status, 422);
        assert.isNotEmpty(err.response.data.errors);
        assertHasFieldErrors(err, COMMENT_AUTHOR_FIELD_NAME);
      }
    });

    it('Should return bad request as post not exists', async () => {
      try {
        const comment = {
          comment: {
            author: existingUser._id,
            text: faker.lorem.words(5),
          },
          postId: FAKE_OBJECT_ID,
        };
        await instance.post(
          '/comments/add',
          comment,
          buildAuthorizationHeader(existingUserToken),
        );
        assert.fail();
      } catch (err) {
        assert.equal(err.response.status, 422);
        assert.isNotEmpty(err.response.data.errors);
        assertHasFieldErrors(err, POSTID_FIELD_NAME);
      }
    });

    it('Should return bad request because max text characters are exceded', async () => {
      try {
        const comment = {
          comment: {
            author: existingUser._id,
            text: faker.lorem.words(MAX_TEXT_LENGTH),
          },
          postId: existingPost._id,
        };
        await instance.post(
          '/comments/add',
          comment,
          buildAuthorizationHeader(existingUserToken),
        );
        assert.fail();
      } catch (err) {
        assert.equal(err.response.status, 422);
        assert.isNotEmpty(err.response.data.errors);
        assertHasFieldErrors(err, COMMENT_TEXT_FIELD_NAME);
        const invalidBodyErr = err.response.data.errors.shift();
        assert.equal(
          invalidBodyErr.msg,
          `${MAX_LENGTH} ${MAX_TEXT_LENGTH} characters`,
        );
      }
    });

    it('Should create a new comment successfully', async () => {
      try {
        const comment = {
          comment: {
            author: existingUser._id,
            text: faker.lorem.words(5),
          },
          postId: existingPost._id,
        };
        const newComment = await instance.post(
          '/comments/add',
          comment,
          buildAuthorizationHeader(existingUserToken),
        );
        assert.equal(newComment.status, 200);
        assert.equal(comment.comment.author, newComment.data.author);
        assert.equal(comment.comment.text, newComment.data.text);
        const post = await Post.findById(existingPost._id);
        assert.isNotEmpty(post.comments);
        assert.equal(post.comments[0], newComment.data._id);
      } catch (err) {
        assert.fail();
      }
    });

    after(async () => {
      await Comment.remove({});
    });
  });
});
