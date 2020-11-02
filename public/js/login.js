// window.onload = () => {
//     $('#tip').hide()
// }
//学号的正则验证
$('#sId').blur(() => {
    let sId = $('#sId').val()
    if(!/^[\d]{9}$/.test(sId)){
        $('#tip').attr('hidden', false).addClass('alert-danger').html('Your student ID is invalid!')
    }
})
//获得焦点触发事件
$('#sId').focus(()=>{
    $('#tip').attr('hidden', true)
})
$('#sPassword').focus(()=>{
    $('#tip').attr('hidden', true)
})

//登陆按钮点击事件
$('#loginBtn').click(()=>{
    let sId = $('#sId').val()
    let sPassword = $('#sPassword').val()
    //正则验证
    if(!/^[\d]{9}$/.test(sId)){
        console.log(123)
        $('#tip').attr('hidden', false).addClass('alert-danger').html('Your student ID is invalid!')
        return
    }

    //通过验证后，发送ajax
    $.post('/login', {
        sId:sId,
        sPassword:sPassword
    }, (data) => {
        if(data==='1'){
            //1 login successfully
            //存储session
            window.location='/'
        }else if(data==='0'){
            //0 no such student
            $('#tip').attr('hidden', false).addClass('alert-danger').html('No such student, please check.')
        }else if(data==='-2'){
            //-2 server error
            $('#tip').attr('hidden', false).addClass('alert-danger').html('Server error! Pleae contact adim. Error code is -2.')
        }else if(data==='-3'){
            //sId or password is incorrect
            $('#tip').attr('hidden', false).addClass('alert-danger').html('StudentID or Password incorrect. Please check.')
        }
    })
})