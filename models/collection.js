var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

/**
 * userId       用户Id
 * questionId   问题Id
 * createTime   创建时间
 */
var CollectionSchema = new Schema({
    userId: ObjectId,
    questionId: ObjectId,
    createTime: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Collection', CollectionSchema, 'wt_collections');