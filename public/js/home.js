define(function(require, exports, module) {

    // 加载依赖模块
    var log = require('../lib/log');
    var Util = require('../angel/util');

    // 修改模版标签为
    // <? ?>、<?= ?>、<?- ?>
    _.templateSettings = {
        evaluate: /\<\?([\s\S]+?)\?\>/g,
        interpolate: /\<\?=([\s\S]+?)\?\>/g,
        escape: /\<\?-([\s\S]+?)\?\>/g
    };

    // 页面元素
    var $loadMore = $('.loadMore');
    var $loading = $('.loading');

    /**
     * Question Model
     * 问题模型
     * title			问题标题
     * content			问题详细内容
     * author 			问题作者_id
     * topics			问题所属话题
     * answerCount		问题回答个数
     * viewCounter		问题被查看次数
     * createTime		问题创建时间
     * updateTime		问题最后更新时间
     * ====================================================
     */
    var Question = Backbone.Model.extend({
        defaults: {
            title: '',
            content: '',
            authorId: '',
            topics: '',
            answerCount: 0,
            viewCount: 0,
            createTime: 0,
            updateTime: 0
        }
    });

    /**
     * QuestionList Collection
     * 问题集合
     * ====================================================
     */
    var QuestionList = Backbone.Collection.extend({
        model: Question,
    });

    /**
     * QuestionView View
     * 单个问题视图
     * ====================================================
     */
    var QuestionView = Backbone.View.extend({
        tagName: "div",
        className: "ui basic segment item",
        template: $("#questionTemp").html(),
        events: {
            "mouseover .avatar": "getUserInfo",
            "click .heart": "heart",
            "click .bookmark": "bookmark",
            "click .share": "share"
        },

        initialize: function() {
            var me = this;

        },

        render: function() {
            var tmpl = _.template(this.template);
            this.$el.html(tmpl(this.model.toJSON()));

            // var $avatar = this.$el.find('.avatar');
            // $avatar.popup();
            return this;
        },

        getUserInfo: function() {
            var $avatar = this.$el.find('.avatar');
            var authorId = this.model.get('authorId');

            $.ajax({
                url: '/api/user/' + authorId,
                type: 'GET',
                success: function(data, textStatus, jqXHR) {
                    console.log(data);
                    var user;
                    if (data.r === 0) {
                        user = data.user;
                        //$avatar.attr('data-content', user.username);
                        $avatar.popup({
                            position: 'bottom center',
                            content: user.username,
                            variation: 'inverted'
                        }).popup('show');
                    } else {

                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {

                }
            });
        },

        heart: function() {
            // TODO

        },

        bookmark: function() {
            var questionId = this.model.get('_id');

            $.ajax({
                url: '/api/collections',
                type: 'POST',
                data: {
                    questionId: questionId
                },
                success: function(data, textStatus, jqXHR) {
                    console.log(data);
                    if (data.r === 0) {
                        alert(data.msg);
                    } else {
                        alert(data.msg);
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {

                }
            });

        },

        share: function() {
            // TODO
        }
    });


    /**
     * App View
     * 整个应用视图
     * ====================================================
     */
    var AppView = Backbone.View.extend({
        el: $("body"),
        events: {
            "click .loadMore": "loadMore"
        },

        initialize: function() {
            var me = this;
            me.questionList = new QuestionList();

            me.queryConfig = {
                pageSize: 5,
                createTime: ""
            };

            me.findQuestions(); // 页面初始化时加载10条系统消息
            me.questionList.on("add", me.renderOneQuestion, me);
        },

        /**
         * @method renderOneQuestion
         * 往界面中添加一个问题视图
         */
        renderOneQuestion: function(model) {
            var me = this;

            model.set('createTimeLocal', Util.convertDate(model.get("createTime")));
            var view = new QuestionView({
                model: model
            });
            me.$('.questionList').append(view.render().el);
        },

        /**
         * @method findQuestionsByPage
         * 接口函数
         */
        findQuestionsByPage: function(succCall, failCall) {
            var me = this;
            failCall = failCall || function() {
                log("findQuestionsByPage failCall invoked.");
            }
            $.ajax({
                url: '/api/questions',
                type: 'GET',
                data: me.queryConfig,
                success: function(data, textStatus, jqXHR) {
                    if (data.r === 0) {
                        succCall(data);
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    failCall();
                }
            });
        },

        /**
         * 页面加载完成后，默认去加载pageSize条数据
         */
        findQuestions: function() {
            var me = this,
                pageSize = me.queryConfig.pageSize;

            me.findQuestionsByPage(function(data) {
                log(data);
                $loading.hide();
                var len = data.questionList.length;
                if (len > 0 && len < pageSize) {
                    me.questionList.add(data.questionList);
                } else {
                    me.questionList.add(data.questionList);
                    me.queryConfig.pageStart++;
                    me.queryConfig.createTime = data.questionList[len - 1].createTime;
                    $loadMore.show();
                }
            });
        },

        /**
         * 点击“加载更多”
         * @return {[type]} [description]
         */
        loadMore: function() {
            var me = this,
                pageSize = me.queryConfig.pageSize;

            me.findQuestionsByPage(function(data) {
                log(data);
                var len = data.questionList.length;
                if (len === 0) {
                    $loadMore.html('无更多问题');
                } else if (len < pageSize) {
                    me.questionList.add(data.questionList);
                    me.queryConfig.pageStart++;
                    me.queryConfig.createTime = data.questionList[len - 1].createTime;
                    me.$('.loadMore').html("无更多问题");
                } else {
                    me.questionList.add(data.questionList);
                    me.queryConfig.pageStart++;
                    me.queryConfig.createTime = data.questionList[len - 1].createTime;
                }
            })
        }

    });

    // 生成一个应用实例
    var app = window.app = new AppView();



});