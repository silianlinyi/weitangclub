var mongoose = require('mongoose'),
    ObjectId = mongoose.Types.ObjectId;

var Collection = require('../models/collection'),
    Util = require('../common/util');

module.exports = {

    /**
     * @method addOneCollection
     * 添加一条收藏记录
     */
    addOneCollection: function(req, res) {
        var userId = req.session._id,
            questionId = req.param('questionId');

        if (!userId || !questionId) {
            res.json({
                "r": 1,
                "errcode": 10000,
                "msg": "参数错误"
            });
            return;
        }

        Collection.findOne({
            userId: userId,
            questionId: questionId
        }, function(err, doc) {
            if (err) {
                res.json({
                    "r": 1,
                    "errcode": 10018,
                    "msg": "服务器错误，收藏失败"
                });
                return;
            }
            if ( !! doc) {
                res.json({
                    "r": 1,
                    "errcode": 10019,
                    "msg": "该问题已经收藏，不能重复收藏"
                });
                return;
            } else {
                var collection = new Collection({
                    userId: userId,
                    questionId: questionId,
                    createTime: Date.now()
                });

                collection.save(function(err, doc) {
                    if (err) {
                        res.json({
                            "r": 1,
                            "errcode": 10018,
                            "msg": "服务器错误，收藏失败"
                        });
                        return;
                    }

                    console.log(doc);
                    res.json({
                        "r": 0,
                        "msg": "收藏成功",
                        "collection": doc
                    });
                    return;
                });
            }
        });


    }

    /**
     *
     */


}