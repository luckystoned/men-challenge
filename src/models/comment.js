import mongoose from 'mongoose';

const { Schema } = mongoose;

export const MAX_TEXT_LENGTH = 300;

const CommentSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
});

CommentSchema.methods.toJSON = function () {
  const comment = this.toObject({ versionKey: false });
  return comment;
};

export default mongoose.model('Comment', CommentSchema);
