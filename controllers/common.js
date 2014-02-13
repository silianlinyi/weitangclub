var ccap = require('ccap');
var Util = require('../common/util');

module.exports = {

    /**
     * 返回一张
     * @param  {[type]} req [description]
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
    getCaptcha: function(req, res) {
        var randomStr = Util.randomString(4);
        var captcha = ccap({
            width: 100,
            height: 40,
            offset: 20,
            fontsize: 40,
            generate: function() {
                return randomStr;
            }
        }),
            ary = captcha.get(),
            txt = ary[0],
            buf = ary[1];
        req.session.captcha = txt;
        console.log('req.session.captcha = ' + txt);
        res.end(buf);
    }


}