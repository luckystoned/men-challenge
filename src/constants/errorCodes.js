const errorCodes = {
  EMAIL_NOT_VALID: 'EMAIL_NOT_VALID',
  EMAIL_ALREADY_IN_USE: 'EMAIL_ALREADY_IN_USE',
  PASSWORD_INVALID: 'PASSWORD_INVALID',
  PASSWORD_INVALID_LENGTH: 'PASSWORD_INVALID_LENGTH',
  PASSWORD_NOT_VALID: 'PASSWORD_NOT_VALID',
  POST_AUTHOR_INVALID: 'POST_AUTHOR_INVALID',
  USER_NOT_EXISTS:
    'The user that are attempting to create the post is not the logged user',
  POST_TITLE_INVALID: 'POST_TITLE_INVALID',
  POST_TITLE_INVALID_LENGTH: 'POST_TITLE_INVALID_LENGTH',
  POST_BODY_INVALID: 'POST_BODY_INVALID',
  POST_BODY_INVALID_LENGTH: 'POST_BODY_INVALID_LENGTH',
  POST_NOT_EXISTS: 'Post does not exist',
  INVALID_USER:
    'The user that are attempting to create the post is not the logged user',
  INVALID_ID: 'INVALID_ID',
  LANGUAGE_NOT_VALID: 'LANGUAGE_NOT_VALID',
  BODY_INVALID_LENGTH: 'Body length must be greater than',
  KEYWORDS_NOT_EXISTS: 'You must specify the keywords query string',
  KEYWORDS_IS_EMPTY: 'keywords query string is empty',
  MAX_LENGTH: 'The comment cannot have more than',
};

export default errorCodes;
