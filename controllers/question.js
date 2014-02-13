var mongoose = require('mongoose'),
    ObjectId = mongoose.Types.ObjectId;

var Question = require('../models/question'),
    Util = require('../common/util');

module.exports = {

    // 添加一个新问题
    addOneQuestion: function(req, res) {
        var title = req.param('title'),
            content = req.param('content'),
            author = req.session._id,
            topics = req.param('topics');

        var question = new Question({
            title: title,
            content: content,
            author: author,
            topics: topics
        });

        question.save(function(err) {
            if (err) {
                res.json({
                    "r": 1,
                    "errcode": 20000,
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

    // 根据ID查找问题
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

        Question.findOne(new ObjectId(_id), function(err, doc) {
            if (err) {
                res.json({
                    "r": 1,
                    "errcode": 20001,
                    "msg": "服务器错误，通过ID查找问题失败"
                });
                return;
            }

            if ( !! doc) {
                res.json({
                    "r": 0,
                    "msg": "通过ID查找问题成功",
                    "question": doc
                });
                return;
            } else {
                res.json({
                    "r": 1,
                    "errcode": 20002,
                    "msg": "没有找到该问题"
                });
                return;
            }
        });
    },

    findQuestionByIdAndUpdate: function(req, res) {
        var _id = req.param('_id') || '';
        // 参数_id
        // Argument passed in must be a single String of 12 bytes or a string of 24 hex characters
        if (_id.length !== 12) {
            res.json({
                "r": 1,
                "errcode": 10000,
                "msg": "参数错误"
            });
            return;
        }
        // { $inc: { viewCounter: 1 }}问题查看次数自增
        Question.findByIdAndUpdate(new ObjectId(_id), {
            $inc: {
                viewCounter: 1
            }
        }, function(err, doc) {
            if (err) {
                res.json({
                    "r": 1,
                    "errcode": 20001,
                    "msg": "服务器错误，通过ID查找问题失败"
                });
                return;
            }

            if ( !! doc) {
                res.json({
                    "r": 0,
                    "msg": "通过ID查找问题成功",
                    "question": doc
                });
                return;
            } else {
                res.json({
                    "r": 1,
                    "errcode": 20002,
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

    }

};