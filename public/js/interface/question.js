/**
 * Question问题相关接口模块
 * @author wangggan
 */
define(function(require, exports, module) {

    function isFunction(obj) {
        return Object.prototype.toString.call(obj) === '[object Function]';
    };

    function handleRequest(url, method, config, succCall, failCall) {
        if (isFunction(arguments[2])) {
            failCall = succCall || function() {
                window.console && console.log('>>> ' + url + ' >>> The default failCall function to be called.');
            };
            succCall = config;
        } else {
            failCall = succCall || function() {
                window.console && console.log('>>> ' + url + ' >>> The default failCall function to be called.');
            };
        }

        $.ajax({
            url: url,
            type: method,
            data: config,
            timeout: 15000,
            success: function(data, textStatus, jqXHR) {
                succCall(data, textStatus, jqXHR)
            },
            error: function(jqXHR, textStatus, errorThrown) {
                failCall(jqXHR, textStatus, errorThrown);
            }
        });
    }

    var Question = {

        findQuestionsByPage: function(config, succCall, failCall) {
            handleRequest('/api/questions', 'GET', config, succCall, failCall);
        }


    };



    module.exports = Question;

});