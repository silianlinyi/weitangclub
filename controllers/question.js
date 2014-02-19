var mongoose = require('mongoose'),
    ObjectId = mongoose.Types.ObjectId;

var Question = require('../models/question'),
    Util = require('../common/util');

module.exports = {

    /**
     * @method addOneQuestion
     * 添加一个新问题
     */
    addOneQuestion: function(req, res) {
        var title = req.param('title'),
            content = req.param('content'),
            authorId = req.session._id,
            topics = req.param('topics');

        if (!title) {
            res.json({
                "r": 1,
                "errcode": 10010,
                "msg": "问题标题不能为空"
            });
            return;
        }

        if (topics.length === 0) {
            res.json({
                "r": 1,
                "errcode": 10011,
                "msg": "问题所属话题至少有一个"
            });
            return;
        }

        var question = new Question({
            title: title,
            content: content,
            authorId: new ObjectId(authorId),
            topics: topics,
            createTime: Date.now(),
            updateTime: Date.now()
        });

        question.save(function(err) {
            if (err) {
                res.json({
                    "r": 1,
                    "errcode": 10012,
                    "msg": "服务器错误，添加问题失败"
                });
                return;
            } else {
                res.json({
                    "r": 0,
                    "msg": "添加问题成功"
                });
                return;
            }
        });
    },

    /**
     * @method findQuestionById
     * 根据问题编号ID查找
     */
    findQuestionById: function(req, res) {
        var _id = req.param('_id') || '';
        // 参数_id
        // Argument passed in must be a single String of 12 bytes or a string of 24 hex characters
        if (_id.length !== 24) {
            res.json({
                "r": 1,
                "errcode": 10000,
                "msg": "参数错误"
            });
            return;
        }

        Question.findOne({
            _id: new ObjectId(_id)
        }, function(err, doc) {
            if (err) {
                res.json({
                    "r": 1,
                    "errcode": 10013,
                    "msg": "服务器错误，根据问题编号ID查找失败"
                });
                return;
            }

            if ( !! doc) {
                res.json({
                    "r": 0,
                    "msg": "查找问题成功",
                    "question": doc
                });
                return;
            } else {
                res.json({
                    "r": 1,
                    "errcode": 10014,
                    "msg": "没有找到该问题"
                });
                return;
            }
        });
    },

    /**
     * @method findQuestionByIdAndUpdateViewCount
     * 根据问题编号ID查找，如果找到，则问题被查看次数viewCount + 1
     */
    findQuestionByIdAndUpdateViewCount: function(req, res) {
        var _id = req.param('_id') || '';
        if (_id.length !== 24) {
            res.json({
                "r": 1,
                "errcode": 10000,
                "msg": "参数错误"
            });
            return;
        }
        // { $inc: { viewCount: 1 }}问题查看次数自增
        Question.findByIdAndUpdate({
            _id: new ObjectId(_id)
        }, {
            $inc: {
                viewCount: 1
            }
        }, function(err, doc) {
            if (err) {
                res.json({
                    "r": 1,
                    "errcode": 10013,
                    "msg": "服务器错误，根据问题编号ID查找失败"
                });
                return;
            }

            if ( !! doc) {
                res.json({
                    "r": 0,
                    "msg": "查找问题成功",
                    "question": doc
                });
                return;
            } else {
                res.json({
                    "r": 1,
                    "errcode": 10014,
                    "msg": "没有找到该问题"
                });
                return;
            }
        });
    },


    updateQuestionById: function(req, res) {
        var _id = req.param('_id');
    },


    deleteQuestionById: function(req, res) {

    },

    /**
     * @method findQuestionsByPage
     * 分页查询
     * 如果createTime为空，则说明用户是第一次查询，回前pageSize条数据
     * 如果createTime不为空，则根据pageSize和createTime返回pageSize条数据
     */
    findQuestionsByPage: function(req, res) {
        var pageSize = req.param('pageSize'),
            createTime = req.param('createTime'),
            query;

        if (!pageSize) {
            res.json({
                "r": 1,
                "errcode": 10000,
                "msg": "参数错误"
            });
        }
        if (!createTime) {
            // sort('-createTime')，最新的先返回
            // sort('createTime'),最早的先返回
            query = Question.find().sort('-createTime').limit(pageSize);
        } else {
            query = Question.find({
                createTime: {
                    $lt: createTime
                }
            }).sort('-createTime').limit(pageSize);
        }

        query.exec(function(err, docs) {
            if (err) {
                res.json({
                    "r": 1,
                    "errcode": 2004,
                    "msg": "服务器错误，查找问题失败"
                });
                return;
            }

            res.json({
                "r": 0,
                "msg": "查找问题成功",
                "questionList": docs
            });
        });
    },


    findQuestionsByPageAndViewCount: function(req, res) {

    }

};