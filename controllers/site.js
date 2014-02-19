var mongoose = require('mongoose'),
    ObjectId = mongoose.Types.ObjectId;

var User = require('../models/user'),
    Question = require('../models/question');

var Util = require('../common/util');

module.exports = {

    // 登录后首页
    home: function(req, res) {
        console.log(req.cookies);
        res.render('home');
    },

    // 登录页
    login: function(req, res) {
        res.render('login');
    },

    // 重置密码页
    resetPassword: function(req, res) {
        res.render('resetPassword');
    },

    // 设置新密码页
    setNewPassword: function(req, res) {
        var token = req.param('token');
        var now = (new Date()).getTime();
        var ONE_DAY_MILLISECONDS = 24 * 60 * 60 * 1000;
        var diff = now - ONE_DAY_MILLISECONDS;

        User.findOne({
            resetToken: token,
            resetTicket: {
                $gt: diff
            }
        }, function(err, doc) {
            if (err) {
                res.render('setNewPassword', {
                    "r": 1,
                    "errcode": 2007,
                    "msg": "服务器错误，重置密码失败"
                });
                return;
            }

            // 没有找到
            if (!doc) {
                res.render('setNewPassword', {
                    "r": 1,
                    "errcode": 2008,
                    "msg": "无效的链接地址"
                });
                return;
            }

            res.render('setNewPassword', {
                "r": 0,
                "doc": doc
            });
        });

    },

    // 注册成功页
    registerSucc: function(req, res) {
        res.render('registerSucc');
    },

    activeAccount: function(req, res) {
        var token = req.param('token');

        if (!token) { // 无令牌
            res.render('activeAccount');
        } else { // 有令牌
            var now = (new Date()).getTime();
            var ONE_DAY_MILLISECONDS = 24 * 60 * 60 * 1000;
            var diff = now - ONE_DAY_MILLISECONDS;

            User.findOneAndUpdate({
                activeToken: token,
                activeTicket: {
                    $gt: diff
                }
            }, {
                active: true,
                activeTicket: 0,
                activeToken: ''
            }, function(err, doc) {
                if (err) {
                    res.render('activeAccount');
                    return;
                }

                // 没有找到
                if (!doc) {
                    res.render('activeAccount');
                    return;
                }
                // 加上?active=true用于判断用户是否是第一次激活账号
                req.session._id = doc._id;
                res.redirect('/?active=true');
            });
        }


    },

    // 跳转到提问页面
    ask: function(req, res) {
        res.render('ask');
    },

    // 跳转到问题详情页
    question: function(req, res) {
        var _id = req.param('_id') || '';
        // 参数_id
        // Argument passed in must be a single String of 12 bytes or a string of 24 hex characters
        if (_id.length !== 24) {
            res.render('question', {
                "r": 1,
                "errcode": 10000,
                "msg": "参数错误"
            });
            return;
        }

        Question.findByIdAndUpdate({
            _id: new ObjectId(_id)
        }, {
            $inc: {
                viewCount: 1
            }
        }, function(err, doc) {
            if (err) {
                res.render('question', {
                    "r": 1,
                    "errcode": 10013,
                    "msg": "服务器错误，根据问题编号ID查找失败"
                });
                return;
            }

            if ( !! doc) {
                doc.createTimeLocal = Util.convertDate(doc.createTime);

                res.render('question', {
                    "r": 0,
                    "msg": "查找问题成功",
                    "question": doc
                });
                return;
            } else {
                res.render('question', {
                    "r": 1,
                    "errcode": 10014,
                    "msg": "没有找到该问题"
                });
                return;
            }
        });
    }


}