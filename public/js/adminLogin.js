
//登陆按钮点击事件
$('#loginBtn').click(()=>{
    let aUsername = $('#aUsername').val()
    let aPassword = $('#aPassword').val()

    //发送ajax
    $.post('/admin/login', {
        aUsername:aUsername,
        aPassword:aPassword
    }, (data) => {
        if(data==='1'){
            //1 login successfully
            window.location='/admin/student'
        }else if(data==='0'){
            //0 no such student
            $('#tip').attr('hidden', false).addClass('alert-danger').html('No such student, please check.')
        }else if(data==='-2'){
            //-2 server error
            // $('#tip').attr('hidden', false).addClass('alert-danger').html('Server error! Pleae contact adim. Error code is -2.')
            swal("Error!", "Username or password in correct!", "error");
        }else if(data==='-3'){
            //sId or password is incorrect
            $('#tip').attr('hidden', false).addClass('alert-danger').html('StudentID or Password incorrect. Please check.')
        }
    })
})