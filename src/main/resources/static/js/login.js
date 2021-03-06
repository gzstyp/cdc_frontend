;(function(){
    var thisPage = {
        init : function(){
            $('#btnLogin').on('click',function(){
                thisPage.login();
            });
            $(document).keyup(function(event){
                if(event.keyCode == 13){
                    $("#btnLogin").trigger("click");
                }
            });
            winFn.iePlaceholder();
            if(sessionStorage){
            }else{
                layerFn.handleClose("<span style='color: #f00;'>你的浏览器版本过低存在安全风险<br/>请尽快升级你的浏览器……<br/>推荐使用Firefox或chrome浏览器</span>");
            }
        },
        login : function(){
            var userName = $('#userName').val();
            var password = $('#password').val();
            if(userName == null || userName == ''){
                layerFn.handleTop('请输入登录账号',AppKey.code.code199);
                return;
            }
            if(password == null || password == ''){
                layerFn.handleTop('请输入登录密码',AppKey.code.code199);
                return;
            }
            var params = {
                username : userName,
                password : password
            };
            this.ajaxPost('/login',params);
        },
        ajaxPost : function(url,params){
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
                        var areaData = token.areaData[0];
                        var obj = Object.keys(areaData);
                        if(obj.length){
                            var _kid = areaData.kid;
                            if(_kid != undefined && _kid != null){
                                sessionStorage.setItem("areaKid",areaData.kid);
                            }else{
                                sessionStorage.removeItem("areaKid");
                            }
                            sessionStorage.setItem("areaProvince",areaData.province_id);
                            sessionStorage.setItem("areaCity",areaData.city_id);
                            sessionStorage.setItem("areaCounty",areaData.county_id);
                            sessionStorage.setItem("areaLevel",areaData.area_level);
                        }else{
                            sessionStorage.removeItem("areaKid");
                            sessionStorage.removeItem("areaProvince");
                            sessionStorage.removeItem("areaCity");
                            sessionStorage.removeItem("areaCounty");
                            sessionStorage.removeItem("areaLevel");
                        }
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
    };
    thisPage.init();
})(jQuery);