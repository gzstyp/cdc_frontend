;(function($){
    var clsProvince = '.clsProvince';//省|市
    var clsCity = '.clsCity';//地州市
    var clsCounty = '.clsCounty';//区|县
    var clsTowns = '.clsTowns';//乡|镇|社区
    var clsVallage = '.clsVallage';//村|居委会
    var clsXxx = '.clsXxx';//组|街道
    var areaLevel = sessionStorage.getItem("areaLevel");
    window.userArea = {
        renderSelect(data,containerDom,selectDom,labelText){
            var html = "<option value=''>"+labelText+"</option>";
            $.each(data,function(index,item){
                html += "<option value='"+item.id+"'>"+item.name+"</option>";
            });
            $(containerDom +' '+ selectDom).html(html);
            this.displayShow(containerDom,selectDom);
            this.displayHide(containerDom,selectDom);
            this.clearValue(containerDom,selectDom);
            userArea.levelType(containerDom,selectDom,'.areaSelectText');
        },
        displayShow : function(containerDom,selectDom){
            $(containerDom +' '+ selectDom).css({"display":"inline"});
        },
        displayHide : function(containerDom,selectDom){
            if(selectDom == clsProvince){
                $(containerDom +' '+ clsCity).css({"display":"none"});
                $(containerDom +' '+ clsCounty).css({"display":"none"});
                $(containerDom +' '+ clsTowns).css({"display":"none"});
                $(containerDom +' '+ clsVallage).css({"display":"none"});
                $(containerDom +' '+ clsXxx).css({"display":"none"});
            }else if(selectDom == clsCity){
                this.level2Css(containerDom);
            }else if(selectDom == clsCounty){
                $(containerDom +' '+ clsTowns).css({"display":"none"});
                $(containerDom +' '+ clsVallage).css({"display":"none"});
                $(containerDom +' '+ clsXxx).css({"display":"none"});
            }else if(selectDom == clsTowns){
                $(containerDom +' '+ clsVallage).css({"display":"none"});
                $(containerDom +' '+ clsXxx).css({"display":"none"});
            }else if(selectDom == clsVallage || selectDom == clsXxx){
                $(containerDom +' '+ clsXxx).css({"display":"none"});
            }
        },
        level2Css : function(containerDom){
            $(containerDom +' '+ clsCounty).css({"display":"none"});
            $(containerDom +' '+ clsTowns).css({"display":"none"});
            $(containerDom +' '+ clsVallage).css({"display":"none"});
            $(containerDom +' '+ clsXxx).css({"display":"none"});
        },
        level2Value : function(containerDom){
            $(containerDom +' '+ clsCounty).val('');
            $(containerDom +' '+ clsTowns).val('');
            $(containerDom +' '+ clsVallage).val('');
            $(containerDom +' '+ clsXxx).val('');
        },
        clearValue : function(containerDom,selectDom){
            if(selectDom == clsProvince){
                $(containerDom +' '+ clsCity).val('');
                $(containerDom +' '+ clsCounty).val('');
                $(containerDom +' '+ clsTowns).val('');
                $(containerDom +' '+ clsVallage).val('');
                $(containerDom +' '+ clsXxx).val('');
            }else if(selectDom == clsCity){
                this.level2Value(containerDom);
            }else if(selectDom == clsCounty){
                $(containerDom +' '+ clsTowns).val('');
                $(containerDom +' '+ clsVallage).val('');
                $(containerDom +' '+ clsXxx).val('');
            }else if(selectDom == clsTowns){
                $(containerDom +' '+ clsVallage).val('');
                $(containerDom +' '+ clsXxx).val('');
            }else if(selectDom == clsVallage || selectDom == clsXxx){
                $(containerDom +' '+ clsXxx).val('');
            }
        },
        //仅显示‘选择省|市’
        resetAreaData : function(containerDom){
            this.clearValue(containerDom,clsProvince);
            $(containerDom +' '+ clsProvince).val('');
            this.displayHide(containerDom,clsProvince);
            //$(containerDom +' '+ clsProvince).css({"display":"none"});弹出框时取消其注释在没有操作权限时会导致排版错乱
        },
        getData : function(url,pid,containerDom,selectDom,labelText){
            if(selectDom == clsProvince){
                this.resetAreaData(containerDom);
            }
            if(pid == null || pid == ''){
                this.displayHide(containerDom,selectDom);
                this.clearValue(containerDom,selectDom);
                $(containerDom +' '+ selectDom).val('');
                $(containerDom +' '+ selectDom).css({"display":"none"});
                return;
            }
            var _self = this;
            layerFn.queryGetHintResult(url,{pId : pid},function(data){
                if(data.code === AppKey.code.code200){
                    _self.renderSelect(data.data,containerDom,selectDom,labelText);
                }else if(data.code === AppKey.code.code201){
                    _self.displayHide(containerDom,selectDom);
                    _self.clearValue(containerDom,selectDom);
                    $(containerDom +' '+ selectDom).val('');
                    $(containerDom +' '+ selectDom).css({"display":"none"});
                }else{
                    _self.displayHide(containerDom,selectDom);
                    $(containerDom +' '+ selectDom).find("option:selected").text(data.msg);
                }
            });
        },
        renderUserArea : function(url,pid,containerDom,level){
            var html = '';
            if(level ==1){
                html += '<select class="clsProvince" style="display:none;"><option value="">选择省|市</option></select>';
                html += '<select class="clsCity" onchange=""><option value="">选择地州市</option></select>';
                html += '<select class="clsCounty" onchange=""><option value="">选择区|县</option></select>';
            }else if(level ==2){
                html += '<select class="clsProvince" style="display:none;"><option value="">选择省|市</option></select>';
                html += '<select class="clsCity" style="display:none;"><option value="">选择地州市</option></select>';
                html += '<select class="clsCounty" onchange=""><option value="">选择区|县</option></select>';
            }
            $(containerDom).html(html);
            if(level==3){
                $('.areaSelectText').css({"display":"none"});
            }
        },
        levelType : function(containerDom,selectDom,labelTextDom,level){
            if(areaLevel != null && areaLevel != undefined){
                if(areaLevel == 3){
                    $(containerDom +' '+ selectDom).css({"display":"none"});
                    $(labelTextDom).css({"display":"none"});
                }else if(level == 2){
                    this.level2Css(containerDom);
                    this.level2Value(containerDom);
                }
            }
        }
	};
})(jQuery);