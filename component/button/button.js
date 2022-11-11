(function (jQuery) {
    jQuery.fn.extend({
        lvs_button_demo: function (token, idxid, curdata) {
            var btbox = $(this);
            return this;
        }
    });
})(jQuery);



//单选开关型按钮
(function (jQuery) {
    jQuery.fn.extend({
        lvscheckbtn: function (token, idxid, curdata) {
            var btnbox = $(this);
            $(btnbox).find(".btnBox").click(function () {
                if (curdata.isopen == "off") {
                    curdata.isopen = "on";
                    console.log(parseInt($(this).width()) - parseInt($(this).find(".slidbtn").width()) + 1);
                    $(this).find(".slidbtn").attr("isopen", "on").animate({ left: parseInt($(this).width()) - parseInt($(this).find(".slidbtn").width()) + 1 });
                    $(this).css("background-color", "#238212");
                    if (curdata.hasOwnProperty("offbox")) {
                        $(curdata.offbox).fadeOut(300, function () {
                        });
                    }
                    if (curdata.hasOwnProperty("onbox"))
                        $(curdata.onbox).fadeIn(500);
                    $(btnbox).trigger("switch", ["on"]);
                    $(btnbox).trigger("change", ["on"]);
                }
                else {
                    curdata.isopen = "off";
                    $(this).find(".slidbtn").attr("isopen", "off").animate({ left: -1 });
                    $(this).css("background-color", "#FFFFFF");
                    if (curdata.hasOwnProperty("onbox")) {
                        $(curdata.onbox).fadeOut(300, function () {
                        });
                    }
                    if (curdata.hasOwnProperty("offbox"))
                        $(curdata.offbox).fadeIn(500);
                    $(btnbox).trigger("switch", ["off"]);
                    $(btnbox).trigger("change", ["off"]);
                }
            });
            return this;
        },
        getchecked: function () {
            return $(this).find(".slidbtn").attr("isopen");
        },
        setchecked: function (isopen) {
            console.log( "checkres", isopen, $(this).getchecked() );
            if (isopen != $(this).getchecked() ) {
                $(this).find(".btnBox").click();
            }
        }
    });
})(jQuery);

//点赞按钮
(function (jQuery) {
    jQuery.fn.extend({
        lvsbuttongrant: function (token, idxid, curdata) {
            var btnbox = $(this);
            $(btnbox).one("click", function(){
                var DataEng = LvsData.Create();
                DataEng.StoleData("common/remark_set", { access_token: token, opetype: "Grant", granttype: curdata.granttype, grantid: curdata.grantid }, function( apiname, params, result ){
                    $(btnbox).SetData( curdata, {grantnum: result.grantnum, isgranted: 1, grantimg: "../../Image/granted.png"} );
                });
            });
        }
    });
})(jQuery);

//星星分数插件
(function (jQuery) {
    jQuery.fn.extend({
        lvsscorenum: function (token, idxid, curdata) {
            var ret = "";
            if( curdata.max == undefined )
                curdata.max = 10;
            for (var i = 1; i < parseInt(curdata.max) + 1; i++) {
                ret += "<img src=\"../Image/star_0.png\" star=\"" + i + "\"";
                if (curdata.max >= 5)
                    ret += " width=\"" + parseInt(80 / curdata.max) + "%\"";
                ret += " style=\"max-width:24px\"/>";
            }
            $(this).find("[lvs_bind=starlist]").html(ret);
            var curbox = $(this);
            $(this).find("img").click(function () {
                var curstar = $(this).attr("star");
                $(curbox).find("img").each(function () {
                    if (parseInt($(this).attr("star")) <= parseInt(curstar))
                        $(this).attr("src", "../Image/star_1.png");
                    else
                        $(this).attr("src", "../Image/star_0.png");
                });
                $(curbox).find("[lvs_bind=scorenum]").text(curstar);
                $(curbox).attr("idxid", curstar );
            });
            return this;
        },
        scorenum: function () {
            return this.find("[lvs_bind=scorenum]").text();
        }
    });
})(jQuery);

//标签选择
(function (jQuery) {
    jQuery.fn.extend({
        lvs_tag_sel: function (token, idxid, curdata) {
            var btnbox = $(this);
            $(btnbox).find(".TagItem").bind("click", function () {
                $(btnbox).find(".TagActive").removeClass("TagActive");
                $(this).addClass("TagActive" );
                $(btnbox).trigger( "tagchange", [$(this).attr("idxid"), $(this).text()] );
            });
            $(btnbox).find(".TagDef").click();
        },
        getvalue: function(){
            if( $(this).find(".TagActive").size() > 0)
                return $(this).find(".TagActive").attr("idxid");
            else
                return "";
        }
    });
})(jQuery);


//标签选择
(function (jQuery) {
    jQuery.fn.extend({
        lvs_input_serial: function (token, idxid, curdata) {
            var inpbox = $(this);
            if( curdata.curval != undefined || curdata.idxid != undefined ){
                var curval = curdata.curval == undefined ? curdata.idxid : curdata.curval;
                $(inpbox).attr("idxid", curval );
                if( curdata.serial == undefined && curdata.dtype != undefined ){
                    if( curdata.dtype == "num" ){
                        let minmax = curdata.minmax.split('-');;
                        let min = minmax[0];
                        let max = minmax[1];
                        curdata.serial = "";
                        for( var i = min; i <= max; i ++ )
                            curdata.serial += (curdata.serial!=""?",":"") + i;
                    }
                }
                var items = curdata.serial.split(',');
                for( var i = 0;i < items.length; i ++ ){
                    if( curval == items[i] )
                        $(inpbox).find("[lvs_elm=SerialInput]").attr("idxid", curval).val( curval );
                    else if( curval == items[i].split('-')[0] )
                        $(inpbox).find("[lvs_elm=SerialInput]").attr("idxid", curval).val( items[i].split('-')[1] );
                }
            }
            $(inpbox).find("[lvs_elm=SerialInput]").bind("focus", function () {
                var inputbox = $(this);
                $(this).addClass("CurSerialInput");
                if( curdata.serial != undefined && curdata.serial != "" ){
                    $('body').basepanel({left: $(this).offset().left, top: $(this).offset().top + $(this).height() + 5, width: $(this).width() + 10}, function( curbox ){
                        var items = curdata.serial.split(',');
                        var itemsel = "";
                        var shownum = 30;
                        if( curdata.col != undefined && curdata.col > 1)
                            shownum = 20 * curdata.col;
                        if( curdata.col != undefined && curdata.col > 1 )
                            itemsel += "<div class=\"flexbox\">"
                        for( var i = 0;i < items.length; i ++ ){
                            var itembit = items[i].split('-');
                            if( itembit.length == 1 )
                                itemsel += "<div class=\"ListItem" + ((curdata.col != undefined && curdata.col > 1)? " flex1" : "") + "\" " + (i>shownum?"style=\"display:none\"":"") + " idxid=\"" + items[i] + "\" idxname=\"" + items[i] + "\">" + items[i] + "</div>";
                            else
                                itemsel += "<div class=\"ListItem" + ((curdata.col != undefined && curdata.col > 1)? " flex1" : "") + "\" " + (i>shownum?"style=\"display:none\"":"") + " idxid=\"" + itembit[0] + "\" idxname=\"" + itembit[1] + "\">" + itembit[1] + "</div>";
                            if( curdata.col > 1 )
                                if( (i % curdata.col) == curdata.col - 1)
                                    itemsel += "</div><div class=\"flexbox\" style=\"margin-top:10px\">";
                                    
                        }
                        if( items.length > shownum )
                            itemsel += "<div style=\"color:#8a8a8a\">更多选项已隐藏</div>";
                        $(curbox).html( itemsel );
                        $(curbox).find(".ListItem").click(function(){
                            $(inpbox).attr("idxid", $(this).attr("idxid")).attr("idxname", $(this).attr("idxname") );
                            $(inpbox).closest("component").attr("idxid", $(this).attr("idxid"));
                            $(inputbox).val( $(this).text() );
                            $('body').closepanel();
                            $('body').unbind("click");
                            $(inpbox).find("[lvs_elm=SerialInput]").unbind("keyup");
                        });
                    });
                 }
                $(inpbox).find("[lvs_elm=SerialInput]").bind("keyup", function(){
                    var inpstr = $(this).val();
                    $('.PanelBox').find(".ListItem").each(function(){
                        if( $(this).text().indexOf( inpstr ) == -1 )
                            $(this).css("display", "none");
                        else
                            $(this).css("display", "");
                    });
                    $(inpbox).attr("idxid", inpstr).attr("idxname", inpstr );
                });
                $('body').unbind("click");
                $('body').bind("click", function(){
                    if( $(".CurSerialInput:hover").size() == 0 && $('.PanelBox:hover').size() == 0 ){
                        $('body').closepanel();
                        $('body').unbind("click");
                        $(inpbox).find("[lvs_elm=SerialInput]").unbind("keyup");
                    }
                });
            });
        }
    });
})(jQuery);
