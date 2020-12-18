;(function($){
    window.jQArea = {
		province : "userProvinceId",//省
		city : "userCityId",//市
		district : "userCountyId",//县
		towns : "userTownsTd",//区
		vallage : "userVallageId",//村
		area_organize : "area_organize",//组的id,这个area_organize随便填写即可
        //调用时注意清空操作,放在后面即可;如：jQArea.init();this.resetUserArea();
        init:function(){
			jQArea.queryArea('0',jQArea.province);//最外层的父级id
		},
		/**触发下拉事件处理*/
		onSelectChange : function(obj,dom){
			var _self = this;
			_self.queryArea(obj.value,dom);
		},
		/**查询省市县区域列表*/
		queryArea : function(pid,dom){
		    if(pid == null || pid == ''){//处理选择第一项的情况
                this.createViewSelect('',dom);
                if(dom == 'userCityId'){
                    this.domAttrValue('#userProvinceId','');
                }else if(dom == 'userCountyId'){
                    this.domAttrValue('#userCityId','');
                }else if(dom == 'userTownsTd'){
                    this.domAttrValue('#userCountyId','');
                }else if(dom == 'userVallageId'){
                    this.domAttrValue('#userTownsTd','');
                }else if(dom == 'area_organize'){//这个area_organize随便填写即可,用于标识除了上面之外的最后一个区域节点,如果下面还有那继续加即可
                    this.domAttrValue('#userVallageId','');
                }
            }else{
                if(dom == 'userCityId'){
                    this.domAttrValue('#userProvinceId',pid);
                    this.domValue(dom,'');
                }else if(dom == 'userCountyId'){
                    this.domAttrValue('#userCityId',pid);
                    this.domValue(dom,'');
                }else if(dom == 'userTownsTd'){
                    this.domAttrValue('#userCountyId',pid);
                    this.domValue(dom,'');
                }else if(dom == 'userVallageId'){
                    this.domAttrValue('#userTownsTd',pid);
                }else if(dom == 'area_organize'){//这个area_organize随便填写即可,用于标识除了上面之外的最后一个区域节点,如果下面还有那继续加即可
                    this.domAttrValue('#userVallageId',pid);
                }
                this.getAreaData(pid,dom);
            }
		},
        domValue(dom,value){
            document.getElementById(dom).setAttribute("value",value);
        },
        domAttrValue : function(dom,value){
            $(dom).attr('value',value);
        },
		/**动态创建下拉列表,data json数据;dom下拉控件名称*/
		createViewSelect : function(data,dom){
			var _self = this;
			var arr = eval(data);
			if(arr != null && arr.length > 0){
				var obj = document.getElementById(dom);
				obj.innerHTML = "";
				//正常显示
				obj.style.display = 'block';
				var nullOp = document.createElement("option");
				nullOp.setAttribute("value","");
				_self.selectDom(dom,nullOp);
				obj.appendChild(nullOp);
				for (var k = 0; k < arr.length; k++){
					var op = document.createElement("option");
					var id = arr[k].id;
					var name = arr[k].name;
					op.setAttribute("value",id);
					op.appendChild(document.createTextNode(name));
					obj.appendChild(op);
				}
			} else {
				//判断市
				if(dom == _self.city){
					_self.resetDom(dom);
					_self.resetDom(_self.district);
					_self.resetDom(_self.towns);
					_self.resetDom(_self.vallage);
				}
				//判断区县隐藏
				if(dom == _self.district){
					_self.resetDom(dom);
					_self.resetDom(_self.towns);
					_self.resetDom(_self.vallage);
				}
				//判断乡镇
				if(dom == _self.towns){
					_self.resetDom(dom);
					_self.resetDom(_self.vallage);
				}
				//判断村
				if(dom == _self.vallage){
					_self.resetDom(dom);
				}
				//判断组,最后都要执行的,所以只做判断即可
				if($("#"+_self.area_organize)[0]){
					_self.resetDom(_self.area_organize);
				}
			}
		},
		resetDom : function(dom){
			document.getElementById(dom).innerHTML = "";
			document.getElementById(dom).style.display = 'none';
            this.domValue(dom,'');
		},
		selectDom : function(dom,nullOp){
			var _self = this;
			if(dom == _self.province){
				nullOp.appendChild(document.createTextNode("请选择省/市"));
				_self.resetDom(_self.city);
				_self.resetDom(_self.district);
				_self.resetDom(_self.towns);
				_self.resetDom(_self.vallage);
			}else if(dom == _self.city){
				nullOp.appendChild(document.createTextNode("请选择市/区"));
                _self.resetDom(_self.district);
                _self.resetDom(_self.towns);
                _self.resetDom(_self.vallage);
			}else if(dom == _self.district){
				nullOp.appendChild(document.createTextNode("请选择区/县"));
                _self.resetDom(_self.towns);
                _self.resetDom(_self.vallage);
			}else if(dom == _self.towns){
				nullOp.appendChild(document.createTextNode("请选择乡/镇"));
                _self.resetDom(_self.vallage);
			}else if(dom == _self.vallage){
				nullOp.appendChild(document.createTextNode("请选择村/组"));
                this.domValue(dom,'');
			}else if(dom == _self.area_organize){
				nullOp.appendChild(document.createTextNode("请选择组"));
			}else{
				nullOp.appendChild(document.createTextNode("请选择"));
			}
		},
        getAreaData : function(pid,dom){
		    var _self = this;
		    if(pid == null || pid == '')return;
            $(dom).text('');
            self.layerIndex = layerFn.loading('正在加载……');
            $.ajax({
                type : "GET",
                url : urlPrefix + '/user/queryAreaSelect',
                dataType : "json",
                data : {pId : pid},
                headers : {'accessToken': sessionStorage.getItem('accessToken') || '',"refreshToken":sessionStorage.getItem('refreshToken') || ''},//好使
                crossDomain: true == !(document.all),
                success : function(data){
                    if(data.code === AppKey.code.code200){
                        _self.createViewSelect(data.data,dom);
                    }else if(data.code === AppKey.code.code205){
                        layerFn.tokenLogin();return;
                    }
                },
                error : function(response,status){},
                statusCode : {
                    401 : function(response){
                        layerFn.handleClose("没有操作权限");
                    },
                    404 : function(response){
                        var json = eval('('+ response.responseText +')');
                        layerFn.handleClose("请求("+json.path+")路径不存在");
                    },
                    500 : function(response){
                        layerFn.handleClose("系统出现错误,稍候重试");
                    }
                },
                complete : function(response,status){
                    layerFn.closeIndex(self.layerIndex);
                }
            });
        }
	};
})(jQuery);