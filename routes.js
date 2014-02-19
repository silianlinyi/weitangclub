var site = require('./controllers/site'),
    common = require('./controllers/common'),
    user = require('./controllers/user'),
    question = require('./controllers/question'),
    reply = require('./controllers/reply'),
    collection = require('./controllers/collection');

module.exports = function(app) {

    app.get('/', user.userAuth, site.home);
    app.get('/home', user.userAuth, site.home);
    app.get('/login', site.login);
    app.get('/resetPassword', site.resetPassword);
    app.get('/setNewPassword', site.setNewPassword);
    app.get('/registerSucc', site.registerSucc);
    app.get('/activeAccount', site.activeAccount);
    app.get('/user/:username', user.userAuth, user.index);
    // 跳转到提问页面
    app.get('/ask', user.userAuth, site.ask);
    app.get('/question/:_id', user.userAuth, site.question);


    app.get('/api/captcha', common.getCaptcha);
    app.post('/api/register', user.register);
    app.post('/api/login', user.login);
    app.get('/api/logout', user.logout);
    app.post('/api/activeMail', user.sendActiveMail);
    app.post('/api/resetPassword', user.resetPassword);
    app.post('/api/setNewPassword', user.setNewPassword);
    app.get('/api/getUserInfo', user.getUserInfo);



    // 根据_id获取用户信息
    app.get('/api/user/:_id', user.findUserById);
    // 根据username获取用户信息
    app.get('/api/user/username/:name', user.findUserByName);
    // 根据关键字搜索用户
    app.get('/api/users/search', user.searchUserByKey);


    // 创建一个新问题
    app.post('/api/questions', user.userAuth, user.userActive, question.addOneQuestion);
    // 通过ID来获取某个问题
    app.get('/api/question/:_id', question.findQuestionById);
    // 通过ID来修改某个问题
    app.put('/api/question/:id', question.updateQuestionById);
    // 通过ID来删除某个问题
    app.delete('/api/question/:id', question.deleteQuestionById);
    // 根据ID查找问题，并且问题被查看次数viewCount加1
    app.get('/api/question/:_id/viewCount', question.findQuestionByIdAndUpdateViewCount);

    app.get('/api/questions', question.findQuestionsByPage);



    // 问题回复相关
    // ----------------------------------------------------
    // 添加一条回复
    app.post('/api/replys', user.userAuth, user.userActive, reply.addOneReply);
    app.get('/api/question/:_id/replys', reply.findReplysByBelongTo);

    // 问题收藏相关
    // ----------------------------------------------------
    // 添加一条问题收藏记录
    app.post('/api/collections', user.userAuth, collection.addOneCollection)






    /**
     * 404 Page
     */
    app.get('*', function(req, res, next) {
        if (/.*\.(gif|jpg|jpeg|png|bmp|js|css|html|eot|svg|ttf|woff|otf|ico).*$/.test(req.originalUrl)) {
            next();
        } else {
            res.render('404');
        }
    });


}