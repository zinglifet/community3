/**
 * 提交回复
 */


function post() {
    var questionId = $(" #question_id ").val();
    var content = $("#comment_content").val();
    comment2target(questionId, 1, content);
}

function comment2target(targetId, type, content) {
    if (!content) {
        alert("不能回复空内容~~~");
        return;
    }
    $.ajax({
        type: "POST",
        url: "/comment",
        contentType: 'application/json',
        data: JSON.stringify({
            "parentId": targetId,
            "content": content,
            "type": type
        }),
        success: function (response) {      //为什么response正好就是{code:200,message:"请求成功"}  插入成功后会返回一个resultDTO对象，spring会转换成json
            if (response.code == 200) {
                window.location.reload();
            } else {
                if (response.code == 2003) {
                    var isAccepted = confirm(response.message);
                    if (isAccepted) {
                        window.open("https://github.com/login/oauth/authorize?client_id=9a3d27ac16492f064f3c&redirect_uri=http://localhost:8887/callback&scope=user&state=1");
                        window.localStorage.setItem("closable", true);
                    }
                } else {
                    alert(response.message);
                }

            }
        },
        dataType: "json"
    });
}

function comment(e) {
    var commentId = e.getAttribute("data-id");
    var content = $("#input-" + commentId).val();
    comment2target(commentId, 2, content);
}

/**
 * 展开二级评论
 */
function collapseComments(e) {
    var id = e.getAttribute("data-id");
    var comments = $("#comment-" + id);
    if (comments.hasClass("collapse in")) {
        //折叠二级评论
        comments.removeClass("in");
        e.classList.remove("active");
    } else {
        var subCommentContainer = $("#comment-" + id);

        if (subCommentContainer.children().length != 1) {//有评论就直接展开
            //展开二级评论
            comments.addClass("in");
            e.classList.add("active");

        } else {//没有评论在请求服务器
            $.getJSON("/comment/" + id, function (data) {
                $.each(data.data.reverse(), function (index, comment) {
                    //这样拼接非常麻烦所以后面就有了像react，vue这种框架
                    //拼接的内容根据question.html二级评论下的注释内容
                    var avatarElement = $("<img/>", {
                        "class": "media-object img-rounded",
                        "src": comment.user.avatarUrl
                    });
                    var mediaLeftElement = $("<div/>", {
                        "class": "media-left"
                    });
                    mediaLeftElement.append(avatarElement);
                    //和上面两个var变量拼接等价
                    var mediaBodyElement = $("<div/>", {
                        "class": "media-body"
                    }).append($("<h5/>", {
                        "class": "media-heading",
                        "html": comment.user.name
                        //"text": comment.user.avatarUrl    //这个会直接显示comment.user.avatarUrl的内容
                    })).append($("<div/>", {
                        "html": comment.content
                    })).append($("<div/>", {
                        "class": "menu"
                    }).append($("<span/>", {
                        "class": "pull-right",
                        "html": moment(comment.gmtCreate).format("YYYY-MM-DD")
                    })));

                    var mediaElement = $("<div/>", {
                        "class": "media"
                    }).append(mediaLeftElement).append(mediaBodyElement);

                    var commentElement = $("<div/>", {
                        "class": "col-lg-12 col-md-12 col-sm-12 col-xs-12 comments",
                        // html: comment.content
                    }).append(mediaElement);
                    subCommentContainer.prepend(commentElement);
                });
            });
            //展开二级评论
            comments.addClass("in");
            e.classList.add("active");
        }


    }

}