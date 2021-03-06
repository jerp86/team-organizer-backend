const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Skill = new Schema(
  {
    skills: [{
      name: {
        type: String,
        required: 'Name is Skills is required',
      },
      level: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
      },
    }],
    /* essa informação já existe no usuário
    role_id: {
      type: Schema.Types.ObjectId,
      ref: 'roles',
      required: true,
    },*/
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    }
  },
  {
    timestamps: true,
  });

mongoose.model('skills', Skill);