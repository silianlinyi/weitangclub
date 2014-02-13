var site = require('./controllers/site'),
    common = require('./controllers/common'),
    user = require('./controllers/user'),
    question = require('./controllers/question'),
    reply = require('./controllers/reply');

module.exports = function(app) {

    app.get('/', user.userAuth, site.home);
    app.get('/home', user.userAuth, site.home);
    app.get('/login', site.login);
    app.get('/resetPassword', site.resetPassword);
    app.get('/setNewPassword', site.setNewPassword);
    app.get('/registerSucc', site.registerSucc);
    app.get('/activeAccount', site.activeAccount);


    app.get('/api/captcha', common.getCaptcha);
    app.post('/api/register', user.register);
    app.post('/api/login', user.login);
    app.get('/api/logout', user.logout);
    app.post('/api/activeMail', user.sendActiveMail);
    app.post('/api/resetPassword', user.resetPassword);
    app.post('/api/setNewPassword', user.setNewPassword);

    // 根据_id获取用户信息
    app.get('/api/user/:_id', user.findUserById);
    // 根据username获取用户信息
    app.get('/api/user/username/:name', user.findUserByName);
    // 根据关键字搜索用户
    app.get('/api/users/search', user.searchUserByKey);


    // 创建一个新问题
    app.post('/api/questions', question.addOneQuestion);
    // 通过ID来获取某个问题
    app.get('/api/question/:_id', question.findQuestionById);
    // 通过ID来修改某个问题
    app.put('/api/question/:id', question.updateQuestionById);
    // 通过ID来删除某个问题
    app.delete('/api/question/:id', question.deleteQuestionById);









}