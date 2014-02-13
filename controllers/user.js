var mongoose = require('mongoose'),
    ObjectId = mongoose.Types.ObjectId;

var User = require('../models/user');
var mail = require('../services/mail');
var Util = require('../common/util');
var uuid = require('node-uuid');

module.exports = {

    /**
     * @method userAuth
     * 用户认证
     * session对象中有_id属性，说明用户已经登录，验证通过，否则说明用户未登录
     */
    userAuth: function(req, res, next) {
        console.log('[ >>> LOG >>> ]：req.session._id = ' + req.session._id)
        if (req.session._id) {
            console.log("[ >>> LOG >>> ]：用户验证成功");
            next();
        } else {
            console.log("[ >>> LOG >>> ]：用户验证失败");
            res.render('login');
        }
    },

    /**
     * 注册
     */
    register: function(req, res) {
        var username = req.param('username'),
            password = req.param('password'),
            email = req.param('email'),
            captcha = req.param('captcha');

        if (!username) {
            res.json({
                "r": 1,
                "errcode": 1001,
                "msg": "用户名不能为空"
            });
            return;
        }

        if (!/^\w{5,19}$/.test(username)) {
            res.json({
                "r": 1,
                "errcode": 1002,
                "msg": "用户名由6到20个英文、数字或下划线组成的字符"
            });
            return;
        }

        if (!password) {
            res.json({
                "r": 1,
                "errcode": 1003,
                "msg": "密码不能为空"
            });
            return;
        }

        if (!email) {
            res.json({
                "r": 1,
                "errcode": 1004,
                "msg": "邮箱地址不能为空"
            });
            return;
        }

        if (!Util.isEmail(email)) {
            res.json({
                "r": 1,
                "errcode": 1005,
                "msg": "邮箱地址不合法"
            });
            return;
        }

        if (!captcha) {
            res.json({
                "r": 1,
                "errcode": 1006,
                "msg": "验证码不能为空"
            });
            return;
        }

        var _captcha = req.session.captcha || '';

        if (_captcha.toLowerCase() !== captcha.toLowerCase()) {
            res.json({
                "r": 1,
                "errcode": 1007,
                "msg": "验证码不正确"
            });
            return;
        }

        User.findOne({
            '$or': [{
                'username': username
            }, {
                'email': email
            }]
        }, function(err, doc) {
            if (err) {
                res.json({
                    "r": 1,
                    "errcode": 1008,
                    "msg": "服务器错误，注册失败"
                });
                return;
            } else {
                if ( !! doc) {
                    res.json({
                        "r": 1,
                        "errcode": 1009,
                        "msg": "该用户名或邮箱已经被注册"
                    });
                    return;
                } else {
                    var user = new User({
                        username: username,
                        password: Util.md5(password),
                        email: email,
                        createTime: Date.now(),
                        activeTicket: Date.now(),
                        activeToken: uuid.v1()
                    });

                    console.log(user)
                    user.save(function(err) {
                        if (err) {
                            console.log(err);
                            res.json({
                                "r": 1,
                                "errcode": 1010,
                                "msg": "服务器错误，注册信息保存失败"
                            });
                            return;
                        } else {
                            // 注册成功后，将用户的_id写入session，表示用户已经登录
                            req.session._id = user._id;
                            res.json({
                                "r": 0,
                                "msg": "注册成功"
                            });
                            mail.sendActiveMail(email, user.activeToken, function(res) {
                                console.log('注册成功，发送了一份激活邮件');
                                console.log(res);
                            });
                            return;
                        }
                    });
                }
            }
        });

    },

    /**
     * 登录
     */
    login: function(req, res) {
        var username = req.param('username'),
            password = req.param('password');

        if (!username) {
            res.json({
                "r": 1,
                "errcode": 1001,
                "msg": "用户名不能为空"
            });
            return;
        }

        if (!password) {
            res.json({
                "r": 1,
                "errcode": 1003,
                "msg": "密码不能为空"
            });
            return;
        }

        User.findOne({
            '$or': [{
                'username': username
            }, {
                'email': username
            }],
            password: Util.md5(password)
        }, function(err, doc) {
            if (err) {
                res.json({
                    "r": 1,
                    "errcode": 1011,
                    "msg": "服务器错误，登录失败"
                });
                return;
            }

            if ( !! doc) {
                // 用户登录成功后，将用户的_id属性添加到session对象
                req.session._id = doc._id;
                res.cookie('weitang', JSON.stringify({
                    username: doc.username
                }), {
                    maxAge: 3600000
                });
                console.log("[ >>> LOG >>> ]：登录成功 req.session._id = " + req.session._id);
                res.json({
                    "r": 0,
                    "msg": "登录成功"
                });
            } else {
                res.json({
                    "r": 1,
                    "errcode": 1012,
                    "msg": "用户名或密码错误"
                });
            }
        });
    },

    logout: function(req, res) {
        delete req.session._id;
        res.redirect('/');
    },

    /**
     * 重新发送激活账号邮件
     */
    sendActiveMail: function(req, res) {
        var email = req.param('email'),
            captcha = req.param('captcha');

        if (!email) {
            res.json({
                "r": 1,
                "errcode": 1004,
                "msg": "邮箱地址不能为空"
            });
            return;
        }

        if (!Util.isEmail(email)) {
            res.json({
                "r": 1,
                "errcode": 1005,
                "msg": "邮箱地址不合法"
            });
            return;
        }

        if (!captcha) {
            res.json({
                "r": 1,
                "errcode": 1006,
                "msg": "验证码不能为空"
            });
            return;
        }

        var _captcha = req.session.captcha || '';

        if (_captcha.toLowerCase() !== captcha.toLowerCase()) {
            res.json({
                "r": 1,
                "errcode": 1007,
                "msg": "验证码不正确"
            });
            return;
        }

        var activeTicket = Date.now(),
            activeToken = uuid.v1();

        User.findOneAndUpdate({
            email: email
        }, {
            activeTicket: activeTicket,
            activeToken: activeToken
        }, function(err, doc) {
            if (err) {
                res.json({
                    "r": 1,
                    "errcode": 1015,
                    "msg": "服务器错误，激活失败"
                });
                return;
            }

            if ( !! doc) {
                mail.sendActiveMail(email, activeToken, function(response) {
                    console.log('重新发送了一份激活邮件');
                    console.log(response);
                    res.json({
                        "r": 0,
                        "msg": "发送成功"
                    });
                    return;
                });
            } else {
                res.json({
                    "r": 1,
                    "errcode": 1016,
                    "msg": "该邮箱尚未注册"
                });
                return;
            }
        });
    },

    /**
     * 重设密码
     */
    resetPassword: function(req, res) {
        var email = req.param('email'),
            captcha = req.param('captcha');

        if (!email) {
            res.json({
                "r": 1,
                "errcode": 1004,
                "msg": "邮箱地址不能为空"
            });
            return;
        }

        if (!Util.isEmail(email)) {
            res.json({
                "r": 1,
                "errcode": 1005,
                "msg": "邮箱地址不合法"
            });
            return;
        }

        if (!captcha) {
            res.json({
                "r": 1,
                "errcode": 1006,
                "msg": "验证码不能为空"
            });
            return;
        }

        var _captcha = req.session.captcha || '';

        if (_captcha.toLowerCase() !== captcha.toLowerCase()) {
            res.json({
                "r": 1,
                "errcode": 1007,
                "msg": "验证码不正确"
            });
            return;
        }

        var resetTicket = Date.now(),
            resetToken = uuid.v1();

        User.findOneAndUpdate({
            email: email
        }, {
            resetTicket: resetTicket,
            resetToken: resetToken
        }, function(err, doc) {
            if (err) {
                res.json({
                    "r": 1,
                    "errcode": 1017,
                    "msg": "服务器错误，重设密码失败"
                });
                return;
            }

            if ( !! doc) {
                mail.sendResetPassMail(email, resetToken, function(response) {
                    console.log('发送了一份重设密码邮件');
                    console.log(response);
                    res.json({
                        "r": 0,
                        "msg": "发送成功"
                    });
                    return;
                });
            } else {
                res.json({
                    "r": 1,
                    "errcode": 1016,
                    "msg": "该邮箱尚未注册"
                });
                return;
            }
        });
    },

    /**
     * 设置新密码
     */
    setNewPassword: function(req, res) {
        var password = req.param('password'),
            token = req.param('token');

        User.findOneAndUpdate({
            resetToken: token
        }, {
            resetTicket: 0,
            resetToken: '',
            password: Util.md5(password)
        }, function(err, doc) {
            if (err) {
                res.json({
                    "r": 1,
                    "errcode": 1018,
                    "msg": "服务器错误，设置新密码失败"
                });
                return;
            }

            if ( !! doc) {
                res.json({
                    "r": 0,
                    "msg": "设置新密码成功"
                });
            } else {
                res.json({
                    "r": 1,
                    "errcode": 1019,
                    "msg": "token已经失效"
                });
                return;
            }
        });
    },

    /**
     * 根据_id获取用户信息
     */
    findUserById: function(req, res) {
        var _id = req.param('_id') || '';
        if (_id.length !== 24) {
            res.json({
                "r": 1,
                "errcode": 10000,
                "msg": "参数错误"
            });
            return;
        }

        // {password: 0}表示不返回password这个属性
        User.findOne({
            _id: new ObjectId(_id)
        }, {
            password: 0
        }, function(err, doc) {
            if (err) {
                res.json({
                    "r": 1,
                    "errcode": 10001,
                    "msg": "服务器错误，调用findUserById方法出错"
                });
                return;
            }

            if ( !! doc) {
                res.json({
                    "r": 0,
                    "msg": "请求成功",
                    "user": doc
                });
                return;
            } else {
                res.json({
                    "r": 1,
                    "errcode": 10002,
                    "msg": "用户不存在"
                });
                return;
            }
        });
    },

    // 根据username获取用户信息
    findUserByName: function(req, res) {
        var username = req.param('name') || '';

        // {password: 0}表示不返回password这个属性
        User.findOne({
            username: username
        }, {
            password: 0
        }, function(err, doc) {
            if (err) {
                res.json({
                    "r": 1,
                    "errcode": 10001,
                    "msg": "服务器错误，调用findUserByName方法出错"
                });
                return;
            }

            if ( !! doc) {
                res.json({
                    "r": 0,
                    "msg": "请求成功",
                    "user": doc
                });
                return;
            } else {
                res.json({
                    "r": 1,
                    "errcode": 10002,
                    "msg": "用户不存在"
                });
                return;
            }
        });
    },

    searchUserByKey: function(req, res) {
        var keyword = req.param('keyword');
        if (!keyword) {
            res.json({
                "r": 1,
                "errcode": 10006,
                "msg": "搜索关键字不能为空"
            });
            return;
        }
        User.find({
            username: new RegExp(keyword)
        }, function(err, docs) {
            if (err) {
                res.json({
                    "r": 1,
                    "errcode": 10001,
                    "msg": "服务器错误，调用searchUserByKey方法出错"
                });
                return;
            }

            if (docs.length === 0) {
                res.json({
                    "r": 1,
                    "errcode": 10005,
                    "msg": "用户未找到"
                });
                return;
            } else {
                res.json({
                    "r": 0,
                    "msg": "请求成功",
                    "users": docs
                });
                return;
            }
        });
    }



}