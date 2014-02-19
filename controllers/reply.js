var mongoose = require('mongoose'),
    ObjectId = mongoose.Types.ObjectId;

var Reply = require('../models/Reply');

module.exports = {

    // 添加一条回复
    addOneReply: function(req, res) {
        var content = req.param('content'),
            authorId = req.session._id,
            belongTo = req.param('belongTo');

        if (!content) {
            res.json({
                "r": 1,
                "errcode": 10015,
                "msg": "回复不能为空"
            });
            return;
        }

        var reply = new Reply({
            content: content,
            authorId: new ObjectId(authorId),
            belongTo: new ObjectId(belongTo),
            createTime: Date.now(),
            updateTime: Date.now()
        });

        reply.save(function(err, doc) {
            if (err) {
                res.json({
                    "r": 1,
                    "errcode": 10016,
                    "msg": "服务器错误，保存回复失败"
                });
                return;
            }
            console.log(doc);
            res.json({
                "r": 0,
                "msg": "添加回复成功",
                "reply": doc
            });
            return;
        });
    },

    // 查找回复
    findReplysByBelongTo: function(req, res) {
		var belongTo = req.param('_id');

		Reply.find({
			belongTo: new ObjectId(belongTo) 
		}, function(err, docs) {
			if(err) {
				res.json({
					"r": 1,
					"errcode": 10017,
					"msg": "服务器错误，查找问题回复失败"
				});
				return;
			}

			res.json({
				"r": 0,
				"msg": "查找问题回复成功",
				"replyList": docs
			});
		});
	}




};