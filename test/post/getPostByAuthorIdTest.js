import chai from 'chai';
import mocha from 'mocha';
import '../../app';
import axios from 'axios';
import User from '../../src/models/user';
import Post from '../../src/models/post';
import { buildAuthorizationHeader } from '../common/utils/testUtil';
import { signJwt } from '../../src/utils/jwtUtil';
import { generateUser } from '../common/factories/userFactory';
import { generatePost } from '../common/factories/postFactory';
import errorCodes from '../../src/constants/errorCodes';
import endpoints from '../../src/constants/endpoints';

const { POSTS } = endpoints;

const { before, after } = mocha;
const { describe, it } = mocha;
const { assert } = chai;

const { INVALID_ID } = errorCodes;

let existingPost;
let existingUser;
let existingUserToken;

const { BASE_URL } = process.env;
const instance = axios.create({
  baseURL: BASE_URL,
});

const FAKE_OBJECT_ID = '5e8b658cb5297dae7ae1fa8e';
const BAD_OBJECT_ID = 'BAD_OBJECT_ID';

describe(`GET ${POSTS}/author/:id`, () => {
  before(async () => {
    await User.remove({});
    existingUser = await generateUser();
    existingPost = await generatePost({ author: existingUser._id });
    existingUserToken = signJwt(existingUser);
  });

  it('Should return unauthorized as no header is sent', async () => {
    try {
      await instance.get(`${POSTS}/author/${existingUser._id}`);
      assert.fail();
    } catch (err) {
      assert.equal(err.response.status, 401);
    }
  });

  it('Should return 422 because the mongo id does not have the correct format', async () => {
    try {
      await instance.get(
        `${POSTS}/author/${BAD_OBJECT_ID}`,
        buildAuthorizationHeader(existingUserToken),
      );
      assert.fail();
    } catch (err) {
      assert.equal(err.response.status, 422);
      const invalidMongoId = err.response.data.errors.shift();
      assert.equal(invalidMongoId.msg, INVALID_ID);
    }
  });

  it('Should return empty array because the author does not have any posts', async () => {
    try {
      const posts = await instance.get(
        `${POSTS}/author/${FAKE_OBJECT_ID}`,
        buildAuthorizationHeader(existingUserToken),
      );
      assert.equal(posts.data.length, 0);
    } catch (err) {
      assert.fail(err);
    }
  });

  it('Should return posts by author', async () => {
    try {
      const post = await instance.get(
        `${POSTS}/author/${existingUser._id}`,
        buildAuthorizationHeader(existingUserToken),
      );
      assert.equal(post.status, 200);
      assert.equal(post.data[0]._id, existingPost._id);
      assert.equal(post.data[0].title, existingPost.title);
      assert.equal(post.data[0].body, existingPost.body);
      assert.equal(post.data[0].author, existingPost.author);
    } catch (err) {
      assert.fail();
    }
  });

  after(async () => {
    await Post.remove({});
  });
});
