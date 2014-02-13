var nodemailer = require("nodemailer");

var config = require('../config');
var SITE_ROOT_URL = 'http://' + config.DOMAIN;

// create reusable transport method (打开SMTP连接池)
var smtpTransport = nodemailer.createTransport("SMTP", config.mailOpts);

/**
 * 发送邮件接口函数
 */
var sendMail = function(mailOptions, callback) {
    smtpTransport.sendMail(mailOptions, function(error, response) {
        if (error) {
            console.log(error);
        } else {
            console.log("Message sent successfully");
            callback(response);
        }
        smtpTransport.close();
    });
};


module.exports = {

    /**
     * @method sendActiveMail
     * 发送账号激活邮件
     */
    sendActiveMail: function(to, token, callback) {
        var mailOptions = {
            from: config.mailOpts.auth.user,
            to: to,
            subject: config.name + "：账号激活",
            html: '<h3>您好：</h3>' +
                '<p>我们收到您在' + config.name + 'IT社区的注册信息，请点击下面的链接来激活账号：</p>' +
                '<a href="' + SITE_ROOT_URL + '/activeAccount?token=' + token + '">' + SITE_ROOT_URL + '/activeAccount?token=' + token + '</a>' +
                '<p>若您没有在' + config.name + '社区填写过注册信息，说明有人滥用了您的电子邮箱，请删除此邮件，我们对给您造成的打扰感到抱歉。</p>' +
                '<hr><p>© 2013 ' + config.name + '，这是一封系统邮件，请不要直接回复。</p>'
        };
        sendMail(mailOptions, callback);
    },

    /**
     * @method sendResetPassMail
     * 发送重置密码邮件
     */
    sendResetPassMail: function(to, token, callback) {
        var mailOptions = {
            from: config.mailOpts.auth.user,
            to: to,
            subject: config.name + "：设置新密码",
            html: '<h3>您好：</h3>' +
                '<p>' + config.name + '已经收到了你的密码重置请求，请点击下面的链接重置密码（链接将在24小时后失效）：</p>' +
                '<a href="' + SITE_ROOT_URL + '/setNewPassword?token=' + token + '">重置链接</a>' +
                '<hr><p>© 2013 ' + config.name + '，这是一封系统邮件，请不要直接回复。</p>'
        };
        sendMail(mailOptions, callback);
    }

};