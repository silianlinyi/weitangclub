var assert = require("assert");
var request = require('request');
var question = require('./question');

describe('Question', function() {

    describe('#addOneQuestion(req, res)', function() {
        it('should return 0', function(done) {
            var options = {
                url: 'http://127.0.0.1:8080/api/questions',
                method: 'post',
                form: {
                    title: "mocha测试标题",
                    content: 'mocha测试内容mocha测试内容mocha测试内容mocha测试内容',
                    author: '52f9a93b8710fe5058000001',
                    topics: ['JavaScript', '前端开发']
                }
            };

            request(options, function(error, res, body) {
                done();
                var ret = JSON.parse(body);
                assert.equal(0, ret.r);
            });
        })
    })

    describe('#findQuestionById(req, res)', function() {
        it('should return 0', function(done) {
            var options = {
                url: 'http://127.0.0.1:8080/api/questions',
                method: 'post',
                form: {
                    title: "mocha测试标题",
                    content: 'mocha测试内容mocha测试内容mocha测试内容mocha测试内容',
                    author: '52f9a93b8710fe5058000001',
                    topics: ['JavaScript', '前端开发']
                }
            };

            request(options, function(error, res, body) {
                done();
                var ret = JSON.parse(body);
                assert.equal(0, ret.r);
            });
        })
    })


})