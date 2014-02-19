var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * username 用户名，登录唯一用户名
 * nickname 昵称，用于显示
 * password 密码
 * email 电子邮箱
 * phone 手机号
 * qq QQ号
 * age 用户年龄，默认为0
 * sex 用户性别，默认为男
 * createTime 帐号创建日期，默认为用户注册时的服务器时间
 * url 个人网站
 * active 帐号是否激活
 * activeTicket 激活链接时间计数
 * activeToken 激活链接令牌
 * resetTicket 重置链接时间计数
 * resetToken 重置链接令牌
 */
var UserSchema = new Schema({
    username: {
        type: String,
        unique: true
    },
    nickname: String,
    password: String,
    email: {
        type: String,
        unique: true
    },
    phone: String,
    qq: String,
    age: {
        type: Number,
        min: 0,
        default: 0
    },
    sex: {
        type: String,
        default: '男'
    },
    createTime: {
        type: Number,
        default: 0
    },
    updateTime: {
        type: Number,
        default: 0,
    },
    url: String,
    active: {
        type: Boolean,
        default: false
    },
    activeTicket: {
        type: Number,
        default: 0
    },
    activeToken: {
        type: String,
        default: ''
    },
    resetTicket: {
        type: Number,
        default: 0
    },
    resetToken: {
        type: String,
        default: ''
    },
    followers: {
        type: Number,
        default: 0
    },
    following: {
        type: Number,
        default: 0
    }
});

// 添加实例方法
UserSchema.methods = {
    sayHello: function() {
        console.log('hello');
    }
};

// 添加静态方法
UserSchema.statics = {
    sayWorld: function() {
        console.log('world');
    }
};


//compile schema to model
module.exports = mongoose.model('User', UserSchema, 'wt_users');