//样式设置
(function (jQuery) {
    jQuery.fn.extend({
        lvsstyleset: function (token, idxid, curdata) {
            var stylebox = $(this);
            $(stylebox).find('[lvs_bind]').change(function () {
                //带有数据绑定的元素发生变更
                var styleres = {};
                if ($(this).attr("lvs_bind") == "bgtype") {
                    var bgtype = $(this).val();
                    $('.BgtypeItem').css("display", "none");
                    $('[lvs_elm=bgtype' + bgtype + ']').css("display", "");
                    if (bgtype == 1)
                        styleres["background-image"] = "";
                    else if (bgtype == 2)
                        styleres["background-color"] = "#ffffff";
                    else if (bgtype == 3)
                        styleres["background-image"] = 'linear-gradient' + '(' + $('[lvs_bind=gradienttype]').val() + ',' + $('[lvs_bind=start-color]').val() + ',' + $('[lvs_bind=end-color]').val() + ')';
                }
                else if ($(this).attr("lvs_bind") == "start-color" || $(this).attr("lvs_bind") == "end-color" || $(this).attr("lvs_bind") == "gradienttype") {
                    styleres["background-image"] = 'linear-gradient' + '(' + $('[lvs_bind=gradienttype]').val() + ',' + $('[lvs_bind=start-color]').val() + ',' + $('[lvs_bind=end-color]').val() + ')';
                }
                else
                    styleres[$(this).attr("lvs_bind")] = $('#PropertyPanel').getbind($(this).attr("lvs_bind"));
                if ($(this).attr("btype") == "attr")
                    styleres.bindattr = $(this).attr("lvs_bind");
                if (styleres["background-color"] == "#000000")
                    styleres["background-color"] = "";
                $('.CurEditCard').cpn("cn.crsplan.pageitem", 0).setpagestyledata(styleres, curdata.pagedata, curdata.proptype);
            });
            $(stylebox).find("[lvs_elm=bgtype2]").click(function () {
                //背景为图片时上传图片
                var bgbox = $(this);
                $(this).lvspanelpic(function (elm, src, picid) {
                    var styleres = {};
                    $('body').closepanel();
                    styleres["background-image"] = "url('" + src + "')";
                    styleres["background-position"] = "center";
                    styleres["background-size"] = "100%";
                    $(bgbox).css("background", "url(\"" + src + "\")");
                    $(bgbox).css("background-position", "center");
                    $(bgbox).css("background-size", "100%");
                    $('.CurEditCard').cpn("cn.crsplan.pageitem", 0).setpagestyledata(styleres, curdata.pagedata, curdata.proptype);
                });
            });

            $(stylebox).find("[lvs_elm=ApplyAll]").click(function () {
                //应用到全部按钮
                if (window.PageData.masters.length == 0)
                    window.PageData.masters.push({ id: -1, item: {} });
                var master = window.PageData.masters[0].item;
                master.bgtype = $(stylebox).getbind("bgtype");
                if (master.bgtype == 2) {
                    var bg = {};
                    GetBgType($(stylebox).find("[lvs_bind=background-img]").css("background-image"), bg);
                    master.bgimage = bg.bgimage;
                    master.bgposition = $('.CurEditCard').cpn("cn.crsplan.pageitem", 0).css("background-position");
                    master.bgsize = $('.CurEditCard').cpn("cn.crsplan.pageitem", 0).css("background-size");
                }
                else if (master.bgtype == 3) {
                    master.startcolor = colorHex($(stylebox).find("[lvs_bind=start-color]").val());
                    master.endcolor = colorHex($(stylebox).find("[lvs_bind=end-color]").val());
                    master.gradienttype = $(stylebox).find("[lvs_bind=gradienttype]").val();
                }
                else if (master.bgtype == 1) {
                    master.bgimage = "";
                    master.bgcolor = colorHex($(stylebox).find("[lvs_bind=background-color]").val());
                }
                //刷新左侧页面
                for (var i = 0; i < window.PageData.pages.length; i++) {
                    var curitem = window.PageData.pages[i].item;
                    if (curitem != undefined) {
                        curitem.bgtype = 0;
                    }
                }
                $('[lvs_elm=PageList]').loadcomponent("cn.crsplan.pagelist", token, idxid, window.PageData, function () {
                });
            });
            $(stylebox).find('#BorderSwitch').cpn("cn.button.checkbtn").bind("switch", function (evt, status) {
                var styleres = {};
                if (status == "on") {
                    styleres = { "border-width": 1, "border-style": "solid", "border-color": "#000", "border-radius": 0 };
                    $(stylebox).SetData(styledata, { "border-style": "solid", "border-width": "1px", "border-color": "#000000", "border-radius": 0 });
                }
                else if (status == "off") {
                    styleres = { "border-width": 0, "border-style": "solid", "border-color": "#000", "border-radius": 0 };
                }
                $('.CurEditCard').cpn("cn.crsplan.pageitem", 0).setpagestyledata(styleres, curdata.pagedata, curdata.proptype);
            });
            $(stylebox).find(".BtnItem").click(function () {
                var ifactive = $(this).hasClass("active");
                var styleset = {};

                if ($(this).hasClass("active")) {
                    $(this).removeClass("active");
                    styleset[$(this).closest(".BtnItem").attr("lvs_bind")] = $(this).attr("value");
                }
                else {
                    $(this).addClass("active");
                    styleset[$(this).closest(".BtnItem").attr("lvs_bind")] = $(this).attr("idxid");
                }
                $('.CurEditCard').cpn("cn.crsplan.pageitem", 0).setpagestyledata(styleset, curdata.pagedata, curdata.proptype);
            })
            $(stylebox).find(".TypeTab").find(".TypeItem").click(function () {
                $(this).closest(".TypeTab").find(".active").removeClass("active");
                $(this).addClass("active");
                var styleset = {};
                styleset[$(this).closest(".TypeTab").attr("lvs_bind")] = $(this).attr("idxid");
                $('.CurEditCard').cpn("cn.crsplan.pageitem", 0).setpagestyledata(styleset, curdata.pagedata, curdata.proptype);
            });
            $(stylebox).find("[lvs_elm=SaveMatrl]").click(function () {
                $('body').unidialog("#SaveMatrlForm", { token: token, idxid: idxid, dlgwidth: 45 }, function (curbt, curbox) {
                    lvsdata.GetData("mayi/matrl_set", $(curbt), { access_token: token, matrlid: curdata.matrlid, matrltype: curdata.type == 'image' ? "pic" : curdata.type, matrlname: $(curbox).getbind("matrlname"), matrlshare: $(curbox).getbind("isshare"), opetype: "SaveMatrl" }, function (apiname, params, result) {
                        var tips = ErrorTip.Create();
                        tips.Show("素材保存成功，通过添加素材加入其他页面");
                        $(stylebox).closedialog();
                    });
                });
            });
            $(stylebox).find("[lvs_elm=DelElm]").click(function () {
                $('#OperateForm').html("<div class=\"BaseDesc\">确定要删除选定的元素？</div><div class=\"BaseDesc\"><a class=\"FormOk button bg-green\">确定删除</a><a class=\"FormCancel button bg-grey\">取消操作</a></div>");
                $('body').unidialog("OperateForm", { token: token, idxid: idxid }, function (curbt, curbox) {
                    $('body').closedialog();
                    $('.CurEditCard').cpn("cn.crsplan.pagecard", 0).setpagestyledata({}, curdata.pagedata, "delete");
                });
            });
            return this;
        },
        setproperty: function (curdata, proptype, chgfunc) {
            var curelm = $(this);
            if (proptype == undefined)
                proptype = $(curelm).attr("proptype") || $(curelm).attr("lvs_elm");
            var styledata = { type: proptype };
            if (proptype != "inner" && proptype != "seltext") {
                styledata.width = sizePercent($(curelm).css("width"), curdata.item.pagewidth);
                styledata.height = sizePercent($(curelm).css("height"), curdata.item.pageheight);
            }
            if (proptype != "inner" && proptype != "imginner" && proptype != "seltext") {
                styledata.ileft = sizePercent($(curelm).css("left"), curdata.item.pagewidth);
                styledata.itop = sizePercent($(curelm).css("top"), curdata.item.pageheight);
            }
            else {
                if (proptype == "inner" || proptype == "seltext") {
                    styledata.fontsize = $(curelm).css("font-size");
                    styledata.fonttype = $(curelm).css("font-family");
                    styledata["font-family"] = $(curelm).css("font-family");
                    styledata.color = colorHex($(curelm).css("color"));
                    if (proptype != "seltext") {
                        styledata.ibold = 1;
                        styledata.textalign = $(curelm).css("text-align");
                        styledata.bordercolor = colorHex($(curelm).css("border-color"));
                        styledata.isdel = 1;
                    }
                    styledata.bgcolor = colorHex($(curelm).css("background-color"));
                    styledata.fontweight = $(curelm).css("font-weight") > 500 ? "bold" : "normal";
                    styledata.fontstyle = $(curelm).css("font-style");
                    styledata.fontdecoration = $(curelm).css("text-decoration").indexOf("underline") == -1 ? "" : "underline";
                }
                if (proptype != "seltext") {
                    styledata.borderstyle = $(curelm).css("border-style");
                    styledata["border-style"] = $(curelm).css("border-style");
                    styledata.borderwidth = parseInt($(curelm).css("border-width"));
                    styledata.borderradius = $(curelm).css("border-radius");
                }
            }
            if (proptype == "text" || proptype == "shape") {
                styledata.fontsize = $(curelm).css("font-size");
                styledata.textalign = $(curelm).css("text-align");
                styledata.color = colorHex($(curelm).css("color"));
                styledata.bordercolor = colorHex($(curelm).css("border-color"));
                styledata.bgcolor = colorHex($(curelm).css("background-color"));
                styledata.isdel = 1;
                styledata.fonttype = $(curelm).css("font-family");
                styledata["font-family"] = $(curelm).css("font-family");
                styledata.ibold = 1;
                styledata.lineheight = lineheightTimes($(curelm).css("line-height"), $(curelm).css("font-size"));
                styledata["line-height"] = styledata.lineheight;
                styledata.letterspacing = $(curelm).css("letter-spacing") == 0 ? "0px" : $(curelm).css("letter-spacing");
                styledata.borderstyle = $(curelm).css("border-style");
                styledata["border-style"] = $(curelm).css("border-style");
                styledata.borderradius = $(curelm).css("border-radius");
                styledata.borderwidth = parseInt($(curelm).css("border-width"));
                styledata.fontweight = $(curelm).css("font-weight") > 500 ? "bold" : "normal";
                styledata.fontstyle = $(curelm).css("font-style");
                styledata.fontdecoration = $(curelm).css("text-decoration").indexOf("underline") == -1 ? "" : "underline";
            }
            else if (proptype == "table") {
                styledata.fonttype = $(curelm).css("font-family");
                styledata.fontsize = $(curelm).css("font-size");
                styledata.textalign = $(curelm).css("text-align");
                styledata.color = colorHex($(curelm).css("color"));
                styledata.fontweight = $(curelm).css("font-weight") > 500 ? "bold" : "normal";
                styledata.fontstyle = $(curelm).css("font-style");
                styledata.fontdecoration = $(curelm).css("text-decoration").indexOf("underline") == -1 ? "" : "underline";
                styledata.isdel = 1;
            }
            else if (proptype == "group" || proptype == "groupres") {
                styledata.fonttype = $(curelm).css("font-family");
                styledata.fontsize = $(curelm).css("font-size");
                styledata.isdel = 1;
            }
            else if (proptype == "image") {
                styledata.isdel = 1;
                styledata.ismatrl = 1;
                styledata.matrlid = $(curelm).attr("picid");
            }
            else if (proptype == "file") {
                styledata.isdel = 1;
            }
            else if (proptype == "voice" || proptype == "video") {
                styledata.isdel = 1;
                styledata.ismatrl = 1;
                styledata.matrlid = $(curelm).attr("matrlid");
            }
            else if (proptype == "timer") {
                styledata.isdel = 1;
                styledata.itimer = 1;
                styledata.begsec = $(curelm).attr("begsec");
                styledata.autoend = $(curelm).attr("autoend");
                styledata.playsec = $(curelm).attr("playsec");
            }
            else if (proptype == "background") {
                styledata.bgcolor = colorHex($(curelm).css("background-color"));
                styledata.bgimg = $(curelm).css("background-image");
                var bg = {};
                GetBgType(styledata.bgimg, bg);
                styledata.bgtype = bg.bgtype;
                if (bg.bgtype == 2) {
                    styledata.bgimage = bg.bgimage;
                    styledata.bgposition = $(curelm).css("background-position");
                    styledata.bgsize = $(curelm).css("background-size");
                }
                else if (bg.bgtype == 3) {
                    styledata.startcolor = bg.startcolor;
                    styledata.endcolor = bg.endcolor;
                    styledata.gradienttype = bg.gradienttype;
                }
            }
            else if (proptype == "theme") {
                styledata.fontsize = $(curelm).css("font-size");
                styledata.color = colorHex($(curelm).css("color"));
                styledata.bgcolor = colorHex($(curelm).css("background-color"));
                styledata.isdel = 1;
            }
            else if (proptype == "task") {
                styledata.isdel = 1;
            }
            var Lvs = LvsCore.Create();
            styledata.proptype = proptype;
            styledata.pagedata = curdata;
            Lvs.BindTmpl("#cn.prop.styleset", $('#PropertyPanel').html(""), curdata.token, curdata.idxid, styledata, function () {
            });
            return this;
        },
        setpropdata: function (setdata) {
            if (setdata.left != undefined)
                $('#PropertyPanel').find("[lvs_bind=left]").val(setdata.left);
            if (setdata.top != undefined)
                $('#PropertyPanel').find("[lvs_bind=top]").val(setdata.top);
            if (setdata.width != undefined)
                $('#PropertyPanel').find("[lvs_bind=width]").val(setdata.width);
            return this;
        }
    });
})(jQuery);

function colorHex( color ){
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    var that = $.trim(color);
    if( /^(rgba|RGBA)/.test(that)){
        var aColor = that.replace(/(?:\(|\)|rgba|RGBA)*/g,"").split(",");
        var strHex = "#";
        for(var i=0; i<aColor.length; i++){
            if( i >= 3 )
                break;
            var hex = Number(aColor[i]).toString(16);
            if(hex === "0"){
                hex += hex; 
            }
            strHex += hex;
        }
        if(strHex.length !== 7){
            strHex = that;  
        }
        return strHex;
    }else if(/^(rgb|RGB)/.test(that)){
        var aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g,"").split(",");
        var strHex = "#";
        for(var i=0; i<aColor.length; i++){
            var hex = Number(aColor[i]).toString(16);
            if(hex === "0"){
                hex += hex; 
            }
            strHex += hex;
        }
        if(strHex.length !== 7){
            strHex = that;  
        }
        return strHex;
    }
    else if(reg.test(that)){
        var aNum = that.replace(/#/,"").split("");
        if(aNum.length === 6){
            return that;    
        }else if(aNum.length === 3){
            var numHex = "#";
            for(var i=0; i<aNum.length; i+=1){
                numHex += (aNum[i]+aNum[i]);
            }
            return numHex;
        }
    }else{
        return that;    
    }
}
function fontsizeVw( fontsize ){
    var fs = parseInt( fontsize );
    if( fs > 0 ){
        return (fs * 100 / parseInt( $(window).width() )) + "vw";
    }
    return fontsize;
}
function sizePercent(sizepx, sizeall) {
    if (sizepx == undefined)
        return "100%";
    var cursize = parseInt( sizepx.replace( "px", "" ) );
    if( sizeall > 0 ){
        return (parseInt(cursize * 10000 / sizeall) / 100) + "%";
    }
    return sizepx;
}

function GetBgType(bgimg,bg){
    if( bg == undefined)
        bg = {};
    var str = bgimg;
    if( bgimg == "" || bgimg == "none" || bgimg == undefined)
        bg.bgtype = 1;
    else if( bgimg.indexOf("url") != -1){
        bg.bgtype = 2;
        str = str.substring(str.indexOf('(') + 2 );
        str = str.substring(0, str.indexOf(')')-1);
        bg.bgimage = str;
    }
    else if (bgimg.indexOf("linear-gradient") != -1) {
        str=str.substring(str.indexOf('(')+1);
        str = str.substring(0, str.lastIndexOf(")"));

        pairs = str.split(',');
        bg.bgtype = 3;
        var idx = 1;
        if( pairs[0].indexOf( "rgb" ) != -1 || pairs.length == 2 ){
            bg.gradienttype = "to bottom";
            idx = 0;
        }
        else
            bg.gradienttype=pairs[0];
        if( pairs[idx].indexOf("(") == -1 )
            bg.startcolor = pairs[idx];
        else{
            bg.startcolor = "";
            for( ;idx < pairs.length; idx ++ ){
                if( bg.startcolor != "")
                    bg.startcolor += ",";
                bg.startcolor += pairs[idx];
                if( pairs[idx].indexOf(")") != -1 )
                    break;
            }
        }
        idx ++;
        if( pairs[idx].indexOf("(") == -1 )
            bg.endcolor = pairs[idx];
        else{
            bg.endcolor = "";
            for( ;idx < pairs.length; idx ++ ){
                if( bg.endcolor != "")
                    bg.endcolor += ",";
                bg.endcolor += pairs[idx];
                if( pairs[idx].indexOf(")") != -1 )
                    break;
            }
        }
        bg.startcolor=colorHex( bg.startcolor );
        bg.endcolor = colorHex(bg.endcolor );
    }
    else
        bg.bgtype = 0;
   return ;

}
function lineheightTimes(lineheight,fontsize){
    
    var curlineheight = "100%";
    var num = parseInt(lineheight)/parseInt(fontsize);
    

    if(num <=1.25  )
        curlineheight = "100%";
    else if (num > 1.25 && num <=1.75)
        curlineheight = "150%";
    else if((num > 1.75 && num <=2.25))
        curlineheight = "200%";
    else
        curlineheight ="100%";

return curlineheight;

}

function BorderStyle(boderstyle){
    
    var curlineheight = "100%";
    var num = parseInt(lineheight)/parseInt(fontsize);
    

    if(boderstyle == "solid"  )
        value = 0;
    else if (num > 1.25 && num <=1.75)
        curlineheight = "150%";
    else if((num > 1.75 && num <=2.25))
        curlineheight = "200%";
    else
        curlineheight ="100%";

return curlineheight;

}