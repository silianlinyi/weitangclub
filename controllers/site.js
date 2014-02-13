var User = require('../models/user');

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


}