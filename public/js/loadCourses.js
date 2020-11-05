
getDataAndCreateTable()

function getDataAndCreateTable(keywords){

    $('#table tr').remove()

    $.get('/check', (results) => {
        $.get('/course', {
            keywords:keywords
        },(data) => {
            $.each(data, (index, item) => {
                let $tr = $('<tr></tr>')
                $tr.append('<td style="text-align: center">'+item.cId+'</td>')
                $tr.append('<td style="text-align: center">'+item.cName+'</td>')
                $tr.append('<td style="text-align: center">'+item.cDayofweek+'</td>')
                $tr.append('<td style="text-align: center">'+item.cNumber+'</td>')
                $tr.append('<td style="text-align: center">'+item.cAllow+'</td>')
                $tr.append('<td style="text-align: center">'+item.cTeacher+'</td>')
                $tr.append('<td style="width:200px; white-space: normal">'+item.cBriefintro+'</td>')

                //更改按钮形态、样式和文本
                if(results[item.cId]==='Register'){
                    $tr.append('<td style="text-align: center"><button data-cId='+item.cId+' class="btn btn-success bmBtn" id="registerBtn'+item.cId+'">'+results[item.cId]+'</button></td>')
                }else if(results[item.cId]==='Registered'){
                    $tr.append('<td style="text-align: center"><a class="btn btn-secondary cancelBtn" href="javascript:void(0)" data-cId='+item.cId+' >Click to cancel</a></td>')
                }else{
                    $tr.append('<td style="text-align: center"><button data-cId='+item.cId+' disabled class="btn btn-light bmBtn" id="registerBtn'+item.cId+'">'+results[item.cId]+'</button></td>')
                }

                //上树
                $('#table').append($tr)

            })
        })

    })

}

//条件查询
$('#keywords').bind('input', () => {
    let keywords = $('#keywords').val()
    getDataAndCreateTable(keywords)
})

//当元素是动态生成的时候，如果想给该元素绑定事件，我们可以使用委托
//注意！委托中不能使用箭头函数，否则会输出undefined
$('#table').delegate('.bmBtn', 'click', function(){
    $.post('/register', {
        cId:$(this).attr('data-cId')
    }, (data) => {
        if(data==='1'){
            //报名成功
            swal({
                title: "Congrats！",
                text: "You have registered successfully!",
                type: "success",
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Refresh",
            }).then((isConfirm) => {
                if(isConfirm){
                    //刷新页面
                    window.location.reload()
                }
            })
        }else if(data==='-2'){//server error
            swal({
                title: "Oops！",
                text: "There is something wrong with the server. Please refresh.",
                type: "error",
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Refresh",
            }).then((isConfirm) => {
                if(isConfirm){
                    //刷新页面
                    window.location.reload()
                }
            })
        }else if(data==='0c'||data==='0s'){
            swal({
                title: "Oops！",
                text: "There is something wrong with your status or course. Please refresh.",
                type: "error",
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Refresh",
            }).then((isConfirm) => {
                if(isConfirm){
                    //刷新页面
                    window.location.reload()
                }
            })
        }else if(data==='0'){
            swal({
                title: "Oops！",
                text: "There is no remaining for this course. Please refresh.",
                type: "error",
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Refresh",
            }).then((isConfirm) => {
                if(isConfirm){
                    //刷新页面
                    window.location.reload()
                }
            })
        }
    })
})

//因为退报按钮也是动态生成的，所以我们还应该使用委托
$('#table').delegate('.cancelBtn', 'click', function () {
    //发送ajax到后台
    $.post('/cancel', {
        cId:$(this).attr('data-cId')
    },(data) => {
        if(data==='1'){
            //删除成功
            swal({
                title: "Congrats！",
                text: "You have cancelled this course!",
                type: "success",
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Refresh",
            }).then((isConfirm) => {
                if(isConfirm){
                    //刷新页面
                    window.location.reload()
                }
            })
        }else if(data==='-2'){//server error
            swal({
                title: "Oops！",
                text: "There is something wrong with the server. Please refresh.",
                type: "error",
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Refresh",
            }).then((isConfirm) => {
                if(isConfirm){
                    //刷新页面
                    window.location.reload()
                }
            })
        }else if(data==='0c'||data==='0s'){
            swal({
                title: "Oops！",
                text: "There is something wrong with your status or course. Please refresh.",
                type: "error",
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Refresh",
            }).then((isConfirm) => {
                if(isConfirm){
                    //刷新页面
                    window.location.reload()
                }
            })
        }
    })
})
