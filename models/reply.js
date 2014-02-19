var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

/**
 * content 回复详细内容
 * authorId 回复作者
 * belongTo 属于哪个问题/回复的回复
 * createTime 回复创建时间
 * updateTime 回复最后更新时间
 */
var ReplySchema = new Schema({
    content: String,
    authorId: ObjectId,
    belongTo: ObjectId,
    createTime: {
        type: Number,
        default: 0
    },
    updateTime: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Reply', ReplySchema, 'wt_replys');