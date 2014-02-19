/**
 * 问题详情页
 * @author wanggan
 */
define(function(require, exports, module) {

    var Util = require('../angel/util');

    var $addOneReply = $('.addOneReply'),
    	$content = $('.reply .content'),
    	$comments = $('.comments');

    var href = window.location.href,
    	belongTo = href.split(/question\//)[1];

    $addOneReply.click(function() {
    	var content = $content.val().trim();
    	if(!content) {
    		alert('回复内容不能为空');
    		return;
    	}

    	$.ajax({
			url: '/api/replys',
			type: 'POST',
			data: {
				content: content,
				belongTo: belongTo
			},
			dataType: 'json',
			timeout: 15000,
			success: function(data, textStatus, jqXHR) {
				if(data.r === 0) {
					var reply = data.reply;
					var replyTemp = '<div class="comment">' +
										'<a class="avatar"><img src="/img/face.png"></a>' +
										'<div class="content">' +
											'<div class="metadata">' +
												'<div class="date">' + Util.convertDate(reply.createTime) + '</div>' +
											'</div>' +
											'<div class="text">' + reply.content + '</div>' +
											'<div class="actions">' +
												'<a class="reply">回复</a>' +
												'<a class="delete">删除</a>' +
											'</div>' +
										'</div>' +
									'</div>' +
									'<div class="ui divider"></div>';
					$comments.append($(replyTemp));
					$content.val('');
				} else {
					alert(data.msg);
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {

			}
		});

    });

	function findReplysByBelongTo(belongTo) {
		$.ajax({
			url: '/api/question/' + belongTo + '/replys',
			type: 'GET',
			timeout: 15000,
			success: function(data, textStatus, jqXHR) {
				console.log(data);
				if(data.r === 0) {
					var replyList = data.replyList,
						reply,
						replyTemp;
					for(var i = 0; i < replyList.length; i++) {
						reply = replyList[i];
						replyTemp = '<div class="comment">' +
											'<a class="avatar"><img src="/img/face.png"></a>' +
											'<div class="content">' +
												'<div class="metadata">' +
													'<div class="date">' + Util.convertDate(reply.createTime) + '</div>' +
												'</div>' +
												'<div class="text">' + reply.content + '</div>' +
												'<div class="actions">' +
													'<a class="reply">回复</a>' +
													'<a class="delete">删除</a>' +
												'</div>' +
											'</div>' +
										'</div>' +
										'<div class="ui divider"></div>';
						$comments.append($(replyTemp));
					}
				} else {
					alert(data.msg);
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {

			}
		});
	}

	findReplysByBelongTo(belongTo);
    

    // 关注、收藏、分享按钮popup提示
    $('.buttons .button').popup();




});