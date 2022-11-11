
//工作台菜单
(function (jQuery) {
    jQuery.fn.extend({
        lvs_menu_base: function (token, idxid, curdata) {
            var menubox = $(this);
            $(menubox).find(".MenuSub").click(function () {
                $(menubox).find(".SubMenuBox").fadeOut(100);
                var cursub = $(menubox).find("[lvs_elm=SubMenu" + $(this).attr("idxid") + "]");
                $(cursub).css({ "position": "absolute", "top": $(this).offset().top + $(this).height(), "left": $(this).position().left }).fadeIn(300);
                $('body').unbind("click");
                $('body').bind("click", function () {
                    if ($('.HeadMenuBox:hover').size() == 0) {
                        $(menubox).find(".SubMenuBox").fadeOut(100);
                        $('body').unbind("click");
                    }
                });
            });
            $(menubox).find(".BaseItem").click(function () {
                $(menubox).find(".BaseItemActive").removeClass("BaseItemActive");
                $(this).addClass("BaseItemActive");
            });
            if (curdata.defidx != undefined && curdata.defidx != "") {
                $(menubox).find(".BaseItem").each(function () {
                    if ($(this).attr("idxid") == curdata.defidx) {
                        $(this).addClass("BaseItemActive");
                        $(this).click();
                    }
                });
            }
            return this;
        }
    });
})(jQuery);

//子菜单
(function (jQuery) {
    jQuery.fn.extend({
        lvs_submenu: function (token, idxid, curdata) {
            var menubox = $(this);
            $(menubox).find("[lvs_elm=SubItem]").bind("click", function () {
                $(menubox).lvsmenuclick( token, idxid, curdata.items[$(this).attr("dataidx")], curdata.container );
                $('body').closepanel();
                $('body').unbind("click");
            });
            return this;
        },
        lvsmenuclick: function( token, idxid, curdata, container ){
            var menubox = $(this);
            var Lvs = LvsCore.Create();
            if( curdata.hasOwnProperty( "router" )){
                Lvs.LvsRout( curdata.router, token, idxid, "" );
            }
            else if( curdata.hasOwnProperty("url" ))
                location.href = curdata.url;
            else if( curdata.hasOwnProperty("apiname") ){
                location.hash = "#" + curdata.id;
                var DataEng = LvsData.Create();
                var getpars = { access_token: token, gettype: curdata.gettype};
                if( curdata.hasOwnProperty("idxkey"))
                    getpars[curdata.idxkey] = idxid;
                if( curdata.hasOwnProperty("idxkey2") )
                    getpars[curdata.idxkey2] = curdata.id;
                DataEng.GetData( curdata.apiname, undefined, getpars, function( apiname, params, result ){
                    if( container == undefined || container == "" )
                        alert( "没有定义容器" );
                    else
                        Lvs.BindTmpl( "#" + curdata.tmplname, $(container).html(""), token, idxid, result, function(){
                        });
                    $(menubox).trigger("close",[]);
                });
            }
        }
    });
})(jQuery);
