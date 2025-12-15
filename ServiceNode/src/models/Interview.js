const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/sequelize');
const Question = require('./Question');

const Interview = sequelize.define('Interview', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  interview_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  question_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Question,
      key: 'id'
    }
  },
  answer_path: {
    type: DataTypes.STRING,
    allowNull: false
  },
  raw_answer: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  refined_answer: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  newData: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'Interview',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// 建立关联关系
Interview.belongsTo(Question, { foreignKey: 'question_id' });
Question.hasMany(Interview, { foreignKey: 'question_id' });

module.exports = Interview;
