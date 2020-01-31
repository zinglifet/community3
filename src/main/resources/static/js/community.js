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
        $.getJSON("/comment/" + id, function (data) {
            var subCommentContainer= $("#comment-"+id);
            $.each(data.data,function (index,comment) {
                var c = $("<div/>",{
                    "class":"col-lg-12 col-md-12 col-sm-12 col-xs-12 comments",
                    html:comment.content
                    });
                subCommentContainer.prepend(c);
            });

        });
        //展开二级评论
        comments.addClass("in");
        e.classList.add("active");

    }

}