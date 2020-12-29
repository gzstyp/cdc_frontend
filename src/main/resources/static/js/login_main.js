(function ($) {
    "use strict";
    $('.input100').each(function () {
        $(this).on('blur', function () {
            if ($(this).val().trim() != "") {
                $(this).addClass('has-val');
            } else {
                $(this).removeClass('has-val');
            }
        })
    })

    /*var input = $('.validate-input .input100');
    $('.validate-form').on('submit', function () {
        var check = true;
        for (var i = 0; i < input.length; i++) {
            if (validate(input[i]) == false) {
                showValidate(input[i]);
                check = false;
            }
        }
        return check;
    });*/

    $('#btnLogin').on('click',function () {
        var userName = $('#userName').val();
        var password = $('#password').val();
        if(userName == null || userName == ''){

            return;
        }
        if(password == null || password == ''){
            layerFn.handleTop('请输入登录密码',AppKey.code.code199);
            validate()
            return;
        }
        var params = {
            username : userName,
            password : password
        };
        this.ajaxPost('/login',params);

        var input = $('.validate-input .input100');
        var check = true;
        for (var i = 0; i < input.length; i++) {
            if (validate(input[i]) == false) {
                showValidate(input[i]);
                check = false;
            }
        }
        if(check){
            var userName = $('#userName').val();
            var password = $('#password').val();
            var params = {
                username : userName,
                password : password
            };
            loginAuth('/login',params);
        }
    });

    function loginAuth(url,params){
        $.ajax({
            type : "POST",
            url : urlPrefix + url,
            dataType : "json",
            data : params,
            crossDomain: true == !(document.all),
            beforeSend : function(request){
                self.layerIndex = layerFn.loading('正在登录……');
            },
            success : function(data){
                layerFn.closeIndex(self.layerIndex);
                if(data.code === 200){
                    var token = data.data;
                    sessionStorage.setItem("accessToken",token.accessToken);
                    sessionStorage.setItem("refreshToken",token.refreshToken);
                    sessionStorage.setItem("userName",token.userName);
                    var menuData = token.menuData;
                    if(menuData != null && menuData != ''){
                        sessionStorage.setItem("menuData",menuData);
                        window.location.href = AppKey.control;
                    }else{
                        layerFn.handleClose(AppKey.msg.msg401,AppKey.code.code204);
                    }
                }else if(data.code === 198){
                    layerFn.handleClose(data.msg,data.code);
                }else{
                    layerFn.handleTop(data.msg,data.code);
                }
            },
            error : function(response,status){
                layerFn.closeIndex(self.layerIndex);
                var statusText = response.statusText;
                if(statusText == 'No Transport'){
                    layerFn.handleClose("<span style='color: #f00;'>连接服务器失败……<br/>或者浏览器版本过低请升级<br/>推荐使用Firefox或chrome浏览器</span>");
                }else{
                    layerFn.handleClose("连接服务器失败……");
                }
            },
            statusCode : {
                401 : function(response){
                    layerFn.handleClose("没有操作权限");
                },
                404 : function(response){
                    layerFn.handleClose("请求url路径不存在!");
                },
                500 : function(response){
                    layerFn.handleClose("系统出现错误,稍候重试");
                },
                502 : function(response){
                    layerFn.handleClose("网关代理出错请联系管理员");
                }
            },
            complete : function(response,status){}
        });
    }

    $('.validate-form .input100').each(function () {
        $(this).focus(function () {
            hideValidate(this);
        });
    });

    function validate(input) {
        if ($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if ($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }
        } else {
            if ($(input).val().trim() == '') {
                return false;
            }
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();
        $(thisAlert).removeClass('alert-validate');
    }
})(jQuery);