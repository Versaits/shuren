(function (jQuery) {
    jQuery.fn.extend({
        lvs_card_demo: function (token, idxid, curdata) {
            var cardbox = $(this);
            curdata.backimg = "images/demo1.jpg";
            curdata.image = "images/demo2.jpg";
            curdata.name = "标题卡片示例";
            curdata.desc1 = "标题卡片的作用域";
            curdata.menus = [{ num: 26, name: "标题数字" }, { icon: "icon/el_icon_date---.png", name: "标题图标" }, { icon: "icon/el_icon_rr1.png", name: "标题图2" }, { num: 500, name: "示例组件"}];
            return this;
        }
    });
})(jQuery);


//处理基本页面属性显示
(function (jQuery) {
    jQuery.fn.extend({
        lvsbasedesc: function (token, idxid, curdata) {
            var descbox = $(this);
            $(descbox).find(".BaseVideo").each(function(){
                var playerid = $(this).attr("id");
                window[playerid] = new TcPlayer(playerid, {
                    m3u8: $(this).attr("playurl"),
                    mp4: $(this).attr("playurl"),
                    autoplay: true,
                    width: "100%", //视频的显示宽度，请尽量使用视频分辨率宽度
                    height: "100%", //视频的显示高度，请尽量使用视频分辨率高度
                    x5_type: "h5",
                    listener: function (msg) {
                        if (msg.type == "load") {
                        }
                        else if (msg.type == "ended") {
                        }
                    }
                });
                
            });
            return this;
        }
    });
})(jQuery);

//处理页面标题卡
(function (jQuery) {
    jQuery.fn.extend({
        lvs_headcard: function (token, idxid, curdata) {
            var cardbox = $(this);
            $(cardbox).find("[pertop]").each(function(){
                $(this).css("padding-top", parseInt($(cardbox).width()) * parseInt( $(this).attr("pertop")) / 100 );
            });
            $(cardbox).find("[headref]").bind("click", function(){
                var opes = $(this).attr("headref").split('.');
                if( opes[0] == "toggle" ){
                    $('#ShowContainer').lvstoggle( function(){
                        var Lvs = LvsCore.Create();
                        Lvs.BindTmpl("#" + opes[1], $('#ShowContainer').html(""), token, idxid, curdata, function(){
                        });
                    });
                }
            });
            return this;
        }
    });
})(jQuery);
