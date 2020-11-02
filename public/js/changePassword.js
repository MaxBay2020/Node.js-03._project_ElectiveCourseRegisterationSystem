$('#confirmBtn').click(() => {
    if($('#newPassword').val() !== $('#confirmPassword').val()){
        //两次输入密码不一致
        swal("Oops!", "Passwords do not match. Please try again.", "error")
        return
    }

    //发送ajax改变密码
    $.post('/changePassword', {
        newPassword: $('#newPassword').val()
    }, (data) => {
        if(data==='-2'){
            swal("Oops!", "Server error! Please contact admin. Error code is -2", "error")
        }else if(data==='1'){
            swal({
                title: "Congrats！",
                text: "Your password has been changed. Please login",
                type: "success",
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Login",
            }).then((isConfirm) => {
                if(isConfirm){
                    window.location='/logout'
                }
            })
        }
    })
})