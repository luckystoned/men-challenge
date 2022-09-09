import chai from 'chai';
import mocha from 'mocha';
import '../../app';
import axios from 'axios';
import Post from '../../src/models/post';
import User from '../../src/models/user';
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

const { KEYWORDS_NOT_EXISTS, KEYWORDS_IS_EMPTY } = errorCodes;

let existingPost;
let existingUser;
let existingUserToken;

const fakeTitle = 'fakeTitle';

const { BASE_URL } = process.env;
const instance = axios.create({
  baseURL: BASE_URL,
});

describe(`GET ${POSTS}/search`, () => {
  before(async () => {
    await User.remove({});
    existingUser = await generateUser();
    existingPost = await generatePost({ author: existingUser._id });
    existingUserToken = signJwt(existingUser);
  });

  it('Should return unauthorized as no header is sent', async () => {
    try {
      await instance.get(`${POSTS}/search?keywords=${fakeTitle}`);
      assert.fail();
    } catch (err) {
      assert.equal(err.response.status, 401);
    }
  });

  it('Should return 422 because keyword query string is missing', async () => {
    try {
      await instance.get(
        `${POSTS}/search`,
        buildAuthorizationHeader(existingUserToken),
      );
      assert.fail();
    } catch (err) {
      assert.equal(err.response.status, 422);
      const keywordsMissingParam = err.response.data.errors.shift();
      assert.equal(keywordsMissingParam.msg, KEYWORDS_NOT_EXISTS);
    }
  });

  it('Should return 422 because keyword query string is empty', async () => {
    try {
      await instance.get(
        `${POSTS}/search?keywords=`,
        buildAuthorizationHeader(existingUserToken),
      );
      assert.fail();
    } catch (err) {
      assert.equal(err.response.status, 422);
      const keywordsEmptyParam = err.response.data.errors.shift();
      assert.equal(keywordsEmptyParam.msg, KEYWORDS_IS_EMPTY);
    }
  });

  it('Should return posts by keyword', async () => {
    try {
      const post = await instance.get(
        `${POSTS}/search?keywords=${existingPost.title}`,
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
