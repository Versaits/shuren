//demo数据生成
(function (jQuery) {
    jQuery.fn.extend({
        lvs_tab_demo: function (token, idxid, curdata) {
            var tabbox = $(this);
            curdata.simptabs = [{ tabidx: 1, tabname: "选项卡一", htmltext: "这里是对选项卡一的解释" }, { tabidx: 2, tabname: "选项卡二", htmltext: "这里是对选项卡二的解释" }, { tabidx: 3, tabname: "选项卡三", htmltext: "这里是对选项卡三的解释"}];
            return this;
        }
    });
})(jQuery);

//简单选项卡组件
(function (jQuery) {
    jQuery.fn.extend({
        lvssimptab: function (token, idxid, curdata) {
            var tabbox = $(this);
            $(tabbox).find(".SimpItem").click(function () {
                $(tabbox).find(".active").removeClass("active");
                $(this).addClass("active");
                var curtab = $(this).attr("tabidx");
                $(tabbox).find(".tabcontent").css("display", "none");
                $(tabbox).find("[tabcontainer=" + curtab + "]").css("display", "");
            });
            return this;
        },
        getsimpdata: function () {
        }
    });
})(jQuery);

//菜单选项卡组件
(function (jQuery) {
    jQuery.fn.extend({
        lvsmenutab: function (token, idxid, curdata) {
            var tabbox = $(this);
            $(tabbox).find(".MenuItem").click(function () {
                 $(tabbox).find(".vactive").removeClass("vactive");
                 var curtab = $(this);
                 var curcontainer = $(tabbox).parent().find(".TabContainer");
                 if( $(curcontainer).size() == 0 )
                 {
                    curcontainer = $(tabbox).parent().parent().find(".TabContainer");
                    if( $(curcontainer).size() == 0 ){
                        curcontainer = $(tabbox).closest(".MenuBox").find(".TabContainer");
                        if( $(curcontainer).size() == 0 )
                            curcontainer = $(tabbox).closest(".Container").find(".TabContainer");
                    }
                 }
                 var Lvs = LvsCore.Create();
                 if( ($(curtab).attr("refresh") == undefined || $(curtab).attr("refresh") == "") && ($(curtab).attr("tmplname") == undefined || $(curtab).attr("tmplname") == "" )){
                    $(curcontainer).css("display", "none");
                    $(curtab).addClass("vactive");
                    $(curcontainer).each(function(){
                        if( $(this).attr("tabcontainer") != undefined && ($(this).attr("tabcontainer") == $(curtab).attr("idxid") || $(this).attr("tabcontainer") == $(curtab).attr("tabidx")))
                            $(this).css("display", "");
                    });
                 }
                 else if( $(curtab).attr("refresh") == "" ){
                    $(curcontainer).html("");
                    $(curtab).addClass("vactive");
                    var tmplname = $(curtab).attr("tmplname");
                    Lvs.BindTmpl( tmplname, $(curcontainer), token, idxid, curdata, function(){
                    });
                 }
                 else{
                    $(curcontainer).html("");
                    var DataEng = LvsData.Create();
                    var params = { access_token: token, id: idxid };
                    params.gettype = $(curtab).attr("refresh");
                    if( $(curtab).attr("idxkey") != undefined )
                        params[$(curtab).attr("idxkey")] = idxid;
                    if( $(curtab).attr("idxkey2") != undefined )
                        params[$(curtab).attr("idxkey2")] = $(curtab).attr("idxid");
                    var curmax = $(curtab).attr("max");
                    if( curmax != undefined ){
                        $(curtab).addClass("vactive");
                        DataEng.GetList( $(curtab).attr("apiname"), $(curcontainer), "#" + $(curtab).attr("tmplname"), params, 0, curmax, function( boxcontainer, api, pars, resdata ){
                            Lvs.BindTmpl( $(curtab).attr("tmplname"), $(boxcontainer), token, idxid, resdata, function(){
                            });
                        });
                    }
                    else
                    {
                        params.count = 0;
                        DataEng.GetData( $(curtab).attr("apiname"), $(curcontainer), params, function( api, pars, resdata){
                            $(curtab).addClass("vactive");
                            var tmplname = $(curtab).attr("tmplname");
                            Lvs.BindTmpl( tmplname, $(curcontainer), token, idxid, resdata, function(){
                            });
                        });
                    }
                 }
            });
             $(this).find(".vactive").click();
            return this;
        }
    });
})(jQuery);

//标签选项组件
(function (jQuery) {
    jQuery.fn.extend({
        lvstagtab: function (token, idxid, curdata) {
            var tabbox = $(this);
            $(tabbox).find(".TagItem").click(function () {
                $(tabbox).find(".TagItemAct").removeClass("TagItemAct");
                $(this).addClass("TagItemAct");
                var curtab = $(this).attr("idxid");
                var curprop = curdata.tagname || $(tabbox).attr("tagname");
                $('[' + curprop + ']').each(function(){
                    if( curtab == "" || curtab == undefined || $(this).attr(curprop).indexOf(curtab + ";") != -1)
                        $(this).css("display", "");
                    else
                        $(this).css("display", "none");
                });
            });
            return this;
        },
        getsimpdata: function () {
        }
    });
})(jQuery);
