var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

/**
 * _id MongoDB默认生成的唯一标识
 * title 问题标题
 * content 问题详细内容
 * authorId 问题作者
 * topics 问题所属的话题，可以有多个
 * answerCount 问题回答个数
 * viewCount 问题被查看的次数
 * createTime 问题创建时间
 * updateTime 问题最后更新时间
 */
var QuestionSchema = new Schema({
    title: String,
    content: String,
    authorId: ObjectId,
    topics: Array,
    answerCount: {
        type: Number,
        default: 0
    },
    viewCount: {
        type: Number,
        default: 0
    },
    createTime: {
        type: Date,
        default: Date.now
    },
    updateTime: {
        type: Date,
        default: Date.now
    }
});

// define our own custom document instance methods
QuestionSchema.methods = {
    sayHello: function() {
        console.log('hello');
    }
};

// Adding static methods to a Model
QuestionSchema.statics = {
    sayWorld: function() {
        console.log('world');
    }
};

// compile schema to model
module.exports = mongoose.model('Question', QuestionSchema, 'wt_questions');