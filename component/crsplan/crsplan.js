//处理json页面显示
(function (jQuery) {
    jQuery.fn.extend({
        lvspagecard: function (token, idxid, curdata) {
            var pagebox = $(this);
            curdata.token = token;
            curdata.idxid = idxid;
            var editmode = $(this).parent().hasClass("EditMode") ? 1: 0;
            curdata.item.basename = $(this).find("[lvs_elm=PageSpace]").attr("basename");
            if( editmode > 0 ){
                curdata.item.pagewidth = $(pagebox).width();
                curdata.item.pageheight = $(pagebox).height();
            }
            var Lvs = LvsCore.Create();
            Lvs.BindTmpl( "#cn.crsplan.pageitem", $(pagebox).find("[lvs_elm=PageSpace]").html(""), token, idxid, curdata.item, function(){
                $(pagebox).find("[lvs_elm=video]").each(function(){
                    $(this).attr("id", "Edit" + $(this).attr("id") );
                });
                $(pagebox).find("[lvs_elm=image]").each(function(){
                    var imgbox = $(this);
                    $(this).find("img").one("load",function(){
                        var imgheit = $(imgbox).width() * $(this).height() / $(this).width();
                        $(imgbox).css("height", imgheit );
                        if( $(imgbox).find(".MoveFrameBox").size() > 0 ){
                            $(imgbox).find(".MoveFrameBox").css("height", imgheit );
                            $(imgbox).find(".MoveFrameBox").find(".MoveFrame").css("height", imgheit );
                        }
                    });
                });
                if( editmode < 1 ){
                    //$(pagebox).find("[lvs_elm=PageSpace]").find(".PageElmText").css("-webkit-transform", "scale(0.25)");
                    $(pagebox).find(".PageElm").each(function(){
                        if( $(this).attr("lvs_elm") != "image" && $(this).attr("lvs_elm") != "video" && $(this).attr("lvs_elm") != "voice" && $(this).attr("lvs_elm") != "timer" ){
                            if( curdata.item.elements[$(this).attr("seqidx")].pxwidth == undefined )
                                curdata.item.elements[$(this).attr("seqidx")].pxwidth = parseInt(parseInt(curdata.item.elements[$(this).attr("seqidx")].width) * curdata.item.pagewidth / 100) + "px";
                            $(this).css("width", curdata.item.elements[$(this).attr("seqidx")].pxwidth);
                        }
                    });
                    return;
                }
                $(pagebox).find(".PageElm").click(function(e){
                    var curelm = $(e.target).closest( ".PageElm" );
                    if( curelm == undefined )
                        curelm = $(this);
                    if( $(curelm).hasClass("PageElmSel") == false ){
                        $(pagebox).find(".PageElmSel").each(function(){
                            $(this).find("[lvs_elm=ElmMoveFrame]").remove();
                            $(this).find(".PropertyTextSel").removeClass("PropertyTextSel");
                            $(this).find(".PropertyImgSel").removeClass("PropertyImgSel");
                            $(this).find(".EditableSel").removeClass("EditableSel");
                            $(this).removeClass("PageElmSel").setpagedata( curdata );
                        });
                        $(curelm).find(".Clicktable,.Editable").css("z-index", parseInt($(curelm).css("z-index")) + 1 );
                        $(curelm).prepend("<div lvs_elm=\"ElmMoveFrame\" class=\"MoveFrameBox\"></div>");
                        $(curelm).addClass("PageElmSel");
                        $(curelm).find("[lvs_elm=ElmMoveFrame]").css("height", $(curelm).height()).loadcomponent( "cn.crsplan.moveframe", token, $(curelm).attr("seqidx"), curdata, function(){
                        });
                        if( $(curelm).attr("lvs_elm" ) == "theme" && ($(e.target).hasClass("PropertyImg") || $(e.target).hasClass("ThemeTitleEdit") || $(e.target).hasClass("ThemeProblem") || $(e.target).closest(".ThemeOption").size()>0) ){
                        }
                        else{
                            $(curelm).setproperty(curdata, $(curelm).attr("[lvs_elm]"), function(proptype){
                                $(curelm).setpagedata( curdata, proptype );
                            });
                        }
                    }
                    //else if( $(curelm).find(".Editable").size() > 0 ){
                        //$(curelm).removeClass("PageElmSel");
                        //$(curelm).find("[lvs_elm=ElmMoveFrame]").remove();
                    //}
                    else if( $(e.target).hasClass("MoveFrame")){
                    }
                    else if( $(curelm).attr("lvs_elm") == "theme" && $(e.target).hasClass("PropertyImg")== false && $(e.target).hasClass("ThemeTitleEdit")== false && $(e.target).hasClass("ThemeProblem")== false && $(e.target).closest(".ThemeOption").size()==0){
                        $(curelm).setproperty(curdata, $(curelm).attr("[lvs_elm]"), function(proptype){
                            $(curelm).setpagedata( curdata, proptype );
                        });
                    }
                    if( $(curelm).attr("lvs_elm") != "voice" && $(curelm).attr("lvs_elm") != "video" && $('.FootSpace').find(".VPageItemSel").size()==0)
                        $('.FootSpace').html("");
                });
                $(pagebox).find(".Editable").mouseup(function(){
                    var selObj = window.getSelection();
                    if( selObj.toString() != "" ){
                        var selRange = selObj.getRangeAt( 0 );
                        $('.CurSelText').removeClass("CurSelText");
                        var node = selRange.createContextualFragment("<span class=\"CurSelText\">" + selObj.toString() + "</span>");
                        selRange.deleteContents();
                        selRange.insertNode( node );
                        $(this).find(".CurSelText").setproperty( curdata, "seltext" );
                    }
                });
                /*$(pagebox).find(".PageElm").find("input").focus( function(){
                    $(this).closest(".PageElm").click();
                });*/
                if( $(pagebox).find(".PageElmSel").size() == 0 && $(pagebox).find(".PageElm").size()>0 ){
                    var cursize = $(pagebox).find(".PageElm").size();
                    if( cursize > 0 && $(pagebox).find(".PageElm").eq(cursize-1).hasClass("PageElmTheme") == false )
                        $(pagebox).find(".PageElm").eq(cursize-1).click();
                }
                $(pagebox).find("[lvs_elm=PageSpace]").click(function(e){
                    var curelmstr = $(e.target).hasClass("PageCardPanel");
                    if( curelmstr ){
                        $(e.target).find(".PageElmSel").each(function(){
                            $(this).setpagedata( curdata );
                            $(this).removeClass("PageElmSel");
                            $(this).find("[lvs_elm=ElmMoveFrame]").remove();
                            $(this).find(".PropertyTextSel").removeClass("PropertyTextSel");
                            $(this).find(".PropertyImgSel").removeClass("PropertyImgSel");
                            $(this).find(".EditableSel").removeClass("EditableSel");
                        });
                        $(e.target).setproperty( curdata, "background", function( proptype ){
                            $(e.target).setpagedata( curdata, proptype );
                        });
                    }
                });
                $(pagebox).find(".PageElmText").bind("DOMNodeInserted", function(){
                    console.log( "元素内容发生变化", $(this).attr("class" ));
                });
                $(pagebox).find("[lvs_elm=voice]").click(function(){
                    var curelm = $(this);
                    var playerid = $(curelm).attr("id");
                    window[playerid] = $(this).find("audio")[0];
                    if( $(this).attr("playing") == 1 ){
                        $('.FootSpace').cpn( "cn.crsplan.videoline" ).settimelinestatus( "pause" );
                        window[playerid].pause();
                        $(this).attr("playing", 0 );
                    }else{
                        if( $(curelm).attr("playing") == undefined || $('.FootSpace').cpn( "cn.crsplan.videoline" ).size() == 0){
                            var tmlinedata = curdata.item.elements[ $(this).attr("seqidx") ];
                            tmlinedata.totalsec = window[playerid].duration;
                            tmlinedata.hour = parseInt(tmlinedata.totalsec / 60 / 60);
                            tmlinedata.minute = parseInt((tmlinedata.totalsec % 3600) / 60);
                            tmlinedata.second = parseInt(tmlinedata.totalsec % 60);
                            tmlinedata.currsec = 0;
                            Lvs.BindTmpl("#cn.crsplan.videoline", $('.FootSpace').html(""), token, idxid, tmlinedata, function () {
                                $(curelm).stopTime();
                                $(curelm).everyTime("0.1s", function () {
                                    if( tmlinedata.totalsec == 0 ){
                                    }
                                    if( $(curelm).attr("playing") == 1 ){
                                        tmlinedata.currsec = $('.FootSpace').cpn( "cn.crsplan.videoline" ).gettimelinetm() + 1;
                                        $('.FootSpace').cpn( "cn.crsplan.videoline" ).settimelinetm( tmlinedata.currsec, function(){
                                        });
                                    }
                                });
                            });
                            window[playerid].addEventListener('ended', function(){
                                $(curelm).attr("playing", 0).attr("ended", 1);
                                $('.FootSpace').cpn( "cn.crsplan.videoline" ).settimelinestatus( "end" );
                                $(curelm).stopTime();
                                tmlinedata.currsec = 0;
                            }, false );
                            $('.FootSpace').bind("status", function( evt, sta, tm ){
                                if( sta == "pause" ){
                                    window[playerid].pause();
                                    $(curelm).attr("playing", 0 );
                                }
                                else if( sta == "play" ){
                                    if( $(curelm).attr("ended") == 1 ){
                                        $(curelm).click();
                                    }
                                    else{
                                        if( tm != undefined )
                                            window[playerid].play( tm );
                                        else
                                            window[playerid].play();
                                        $(curelm).attr("playing", 1 );
                                    }
                                }
                                else if( sta == "timesec" ){
                                    window[playerid].play( tm );
                                    $(curelm).attr("playing", 1 );
                                }
                            });
                        }
                        else if( $(curelm).attr("ended") == 1 ){
                            $('.FootSpace').cpn( "cn.crsplan.videoline" ).settimelinetm( 0, function(){});
                            $(curelm).attr("ended", 0);

                            $(curelm).everyTime("0.1s", function () {
                                if( $(curelm).attr("playing") == 1 ){
                                    var currsec = $('.FootSpace').cpn( "cn.crsplan.videoline" ).gettimelinetm() + 1;
                                    $('.FootSpace').cpn( "cn.crsplan.videoline" ).settimelinetm( currsec, function(){
                                    });
                                }
                            });
                        }
                        window[playerid].play();
                        $(this).attr("playing", 1 );
                        $('.FootSpace').cpn( "cn.crsplan.videoline" ).settimelinestatus( "play" );
                    }
                });
                $(pagebox).find("[lvs_elm=video]").click(function () {
                    if( $(this).hasClass( "PageVideoPlay" ) )
                        return;
                    $(this).addClass("PageVideoPlay");
                    var curelm = $(this);
                    if ($(this).attr("playurl") != undefined) {
                        var playname = "play" + $(this).attr("id");
                        $(this).attr("id", playname );
                        var Lvs = LvsCore.Create();
                        var DataEng = LvsData.Create();
                        if (window[playname] != undefined && $(curelm).attr("playing")!=undefined) {
                            if ($(curelm).attr("playing") == 1) {
                                window[playname].pause();
                                $(curelm).attr("playing", 0);
                            }
                            else {
                                window[playname].play(window[playname].currentTime());
                                $(curelm).attr("playing", 1);
                                
                            }
                        }
                        else {
                            $(curelm).attr("playing", 1).html("");
                            window[playname] = new TcPlayer(playname, {
                                m3u8: $(this).attr("playurl"),
                                mp4: $(this).attr("playurl"),
                                autoplay: true,
                                width: "100%", //视频的显示宽度，请尽量使用视频分辨率宽度
                                height: "100%", //视频的显示高度，请尽量使用视频分辨率高度
                                x5_type: "h5",
                                listener: function (msg) {
                                    if (msg.type == "load") {
                                    }
                                    else if (msg.type == "seeking") {
                                        var ts = parseInt(window[playname].currentTime() * 10);
                                        $('.FootSpace').cpn("cn.crsplan.videoline").settimelinetm( ts, function(){
                                        });
                                    }
                                    else if (msg.type == "pause") {
                                        $(curelm).attr("playing", 0);
                                    }
                                    else if (msg.type == "play") {
                                        $(curelm).attr("playing", 1);
                                    }
                                    else if (msg.type == "ended") {
                                    }
                                }
                            });
                        }
                        var tmlinedata = curdata.item.elements[ $(this).attr("seqidx") ];
                        tmlinedata.totalsec = 0;
                        tmlinedata.hour = 0;
                        tmlinedata.minute = 0;
                        tmlinedata.second = 0;
                        tmlinedata.currsec = 0;
                        Lvs.BindTmpl("#cn.crsplan.videoline", $('.FootSpace').html(""), token, idxid, tmlinedata, function () {
                            $(curelm).everyTime("0.1s", function () {
                                if( tmlinedata.totalsec == 0 ){
                                    tmlinedata.totalsec = window[playname].duration();
                                    tmlinedata.hour = parseInt(tmlinedata.totalsec / 60 / 60);
                                    tmlinedata.minute = parseInt((tmlinedata.totalsec % 3600) / 60);
                                    tmlinedata.second = parseInt(tmlinedata.totalsec % 60);
                                    $('.FootSpace').find("[lvs_bind=totalsec]").attr("totalsec", tmlinedata.totalsec);
                                    $('.FootSpace').find("[lvs_bind=totalsec]").find("[lvs_bind=totalhour]").text( tmlinedata.hour );
                                    $('.FootSpace').find("[lvs_bind=totalsec]").find("[lvs_bind=totalminute]").text( tmlinedata.minute );
                                    $('.FootSpace').find("[lvs_bind=totalsec]").find("[lvs_bind=totalsecond]").text( tmlinedata.second );
                                }
                                if( $(curelm).attr("playing") == 1 ){
                                    tmlinedata.currsec = $('.FootSpace').cpn( "cn.crsplan.videoline" ).gettimelinetm() + 1;
                                    $('.FootSpace').cpn( "cn.crsplan.videoline" ).settimelinetm( tmlinedata.currsec, function(){
                                    });
                                }
                            });
                        });
                    }
                });
            });
            return this;
        },
        setpagescale: function( curwid, curdata ){
            let widrate = curwid / (parseInt( curdata.pagewidth )||900);
            $(this).find(".PageElm").each(function(){
                var elm = curdata.elements[$(this).attr("seqidx")];
                const scales = [ "text","file", "task", "group", "groupres", "sigsel", "multsel", "blank", "answer", "shape"];
                if( scales.includes( elm.type ) ){
                    $(this).css({"width": elm.pxwidth, "-webkit-transform":"scale(" + widrate + "," + widrate + ")", "transform": "scale(" + widrate + "," + widrate + ")", "transform-origin":"left top", "-webkit-transform-origin":"left top"});
                }
            });
        },
        lvspagemainctrlc:function(token, idxid, curdata){
                     
             curdata.copyidx= parseInt($(this).find(".PageElmSel").attr("seqidx"));
        },
        lvspagemainctrlv:function(token, idxid, curdata){
             
             var copydata ={};

             if(curdata.copyidx != undefined){
                for(var i = 0;i<curdata.item.elements.length;i++){
                    curdata.item.elements[i].curnew = 0;
                 }
                
                $(this).extend(true,copydata,curdata.item.elements[curdata.copyidx]);
                curdata.item.elements.splice( curdata.copyidx + 1, 0, copydata );  
                curdata.item.elements[curdata.copyidx+1].curnew = 1;  
                curdata.item.elements[curdata.copyidx+1].id=0;   
                curdata.item.elements[curdata.copyidx+1].left = (parseInt(copydata.left)+5)+'%';
                curdata.item.elements[curdata.copyidx+1].top = (parseInt(copydata.top)+5)+'%';
                
                $(this).parent().loadcomponent("cn.crsplan.pagecard", token, idxid, curdata, function () {});

                $('[lvs_elm=PageList]').cpn("cn.crsplan.pagelist", 0 ).lvspagerefresh( "", 0, curdata );
             }
        },
        lvspagemainundo:function( token, idxid, opetype, opeidx, curdata, opedata ){
            if( opetype == "delete" ){
                curdata.item.elements.splice( opeidx, 0, opedata );
            }
            else if( opetype == "add" ){
                curdata.item.elements.splice( opeidx, 1 );
            }
            else if( opetype == "update" || opetype == "updloc" ){
                curdata.item.elements[opeidx] = opedata;
            }
            $(this).parent().loadcomponent("cn.crsplan.pagecard", token, idxid, curdata, function () {});
            $('[lvs_elm=PageList]').cpn("cn.crsplan.pagelist", 0 ).lvspagerefresh( "", 0, curdata );
        },
        setpagestyledata: function(styledata, curdata, proptype){
            if( styledata.height != undefined ){
                if( styledata.height.indexOf("%") != -1){
                    styledata.height = parseFloat( styledata.height.replace("%", "")) * curdata.item.pageheight / 100;
                }
            }
            if( proptype == "delete" ){
                $(this).find(".PageElmSel").each(function(){
                    lvsdata.AddCache( "delete", "pageitem", $('[lvs_elm=PageList]').find(".PageItemSel").attr("listidx") + "," + $(this).attr("seqidx"), curdata.item.elements[$(this).attr("seqidx")] );
                    curdata.item.elements[$(this).attr("seqidx")].deleted = 1;
                    $(this).fadeOut( 300, function(){ $(this).remove(); });
                });
                var maxnum = curdata.item.elements.length;
                for( var i = maxnum - 1; i >= 0; i -- ){
                    if( curdata.item.elements[i].deleted == 1 )
                        curdata.item.elements.splice( i, 1 );
                }
                $(this).parent().loadcomponent("cn.crsplan.pagecard", "", 0, curdata, function () {});
                if( $('.VPageItemSel').size() == 0 )
                    $('[lvs_elm=PageList]').cpn("cn.crsplan.pagelist", 0 ).lvspagerefresh( "", 0, curdata );
            }
            else if( proptype == "inner" ){
                if( $(this).find(".PropertyTextSel").size() > 0 ){
                    $(this).find(".PropertyTextSel").each(function(){
                        $(this).css( styledata );
                        $(this).setpagedata( curdata, proptype );
                    });
                }
            }
            else if( proptype == "imginner" ){
                if( $(this).find(".PropertyImgSel").size() > 0 ){
                    $(this).find(".PropertyImgSel").each(function(){
                        $(this).css( styledata );
                        $(this).setpagedata( curdata, proptype );
                    });
                }
            }
            else if( proptype == "seltext" ){
                $(this).find(".CurSelText").css( styledata );
            }
            else if( $(this).find(".PageElmSel").size() > 0 ){
                $(this).find(".PageElmSel").each(function(){
                    if( styledata.bindattr != undefined && styledata.bindattr != "" )
                        $(this).attr( styledata.bindattr, styledata[styledata.bindattr] );
                    else
                        $(this).css( styledata );
                    lvsdata.AddCache( "update", "pageitem", $('[lvs_elm=PageList]').find(".PageItemSel").attr("listidx") + "," + $(this).attr("seqidx"), curdata.item.elements[$(this).attr("seqidx")] );
                    $(this).setpagedata( curdata, proptype );
                });
            }
            else if( proptype == "background" ){
                $(this).css( styledata );
                $(this).setpagedata( curdata, proptype );
            }
        },
        refreshdata: function(){
            if( $(this).find(".PageElmSel").size() > 0 && $('[lvs_elm=PageList]').find(".PageItemSel").size() > 0 && $('[lvs_elm=PageList]').find(".PageItemSel").attr("listidx") < window.PageData.pages.length)
                $(this).find(".PageElmSel").setpagedata( window.PageData.pages[$('[lvs_elm=PageList]').find(".PageItemSel").attr("listidx")] );
        },
        cardaddimgs: function(token, idxid, curdata, imgs, picid){
            var pics = picid.split(',');
            for (var i = 0; i < imgs.length; i++) {
                if( $(this).find(".EditableSel").size() > 0 ){
                    $(this).find(".EditableSel").each(function(){
                        $(this).html( $(this).html() + "<img width=\"60%\" class=\"PropertyImg\" picid=\"" + pics[i] + "\" src=\"" + imgs[i] + "\"/>" );
                    });
                }
                else{
                    curdata.item.elements.push({ id: -1, type: "image", title: "上传图片", top: (10 + i * 2) + "%", left: (18 + i) + "%", width: "60%", image: imgs[i], picid: pics[i], curnew: 1, zindex: $(this).getcurzindex(curdata.item.elements) });
                    lvsdata.AddCache( "add", "pageitem", $('[lvs_elm=PageList]').find(".PageItemSel").attr("listidx") + "," + (curdata.item.elements.length -1), curdata.item.elements[curdata.item.elements.length -1] );
                }
            }
            if( $(this).find(".EditableSel").size() == 0 ){
                var Lvs = LvsCore.Create();
                if( $('.VPageItemSel').size() > 0 )
                    $('.VPageItemSel').click();
                else{
                    Lvs.BindTmpl("#cn.crsplan.pagecard", $('.PageItemSel').find("[lvs_elm=ListPageItem]").html(""), token, idxid, curdata, function () {
                        $('.PageItemSel').click();
                    });
                }
            }
        },
        lvssetmove: function( movedir, offx, offy, isend, curdata ){//设置移动与大小
            var itemdata = curdata.item.elements[ $(this).attr("seqidx")];
            var curleft = 0, curtop = 0, curwidth = 0, curheight = 0;
            if( movedir == 1 ){
                curleft = $(this).position().left + offx;
                curtop = $(this).position().top + offy;
                curwidth = $(this).width() - offx;
                curheight = $(this).height() - offy;
            }
            else if( movedir == 2 ){
                curleft = $(this).position().left;
                curtop = $(this).position().top + offy;
                curwidth = $(this).width();
                curheight = $(this).height() - offy;
            }
            else if( movedir == 3 ){
                curleft = $(this).position().left;
                curtop = $(this).position().top + offy;
                curwidth = $(this).width() + offx;
                curheight = $(this).height() - offy;
            }
            else if( movedir == 4 ){
                curleft = $(this).position().left;
                curtop = $(this).position().top;
                curwidth = $(this).width() + offx;
                curheight = $(this).height();
            }
            else if( movedir == 5 ){
                curleft = $(this).position().left;
                curtop = $(this).position().top;
                curwidth = $(this).width() + offx;
                curheight = $(this).height() + offy;
            }
            else if( movedir == 6 ){
                curleft = $(this).position().left;
                curtop = $(this).position().top;
                curwidth = $(this).width();
                curheight = $(this).height() + offy;
            }
            else if( movedir == 7 ){
                curleft = $(this).position().left + offx;
                curtop = $(this).position().top;
                curwidth = $(this).width() - offx;
                curheight = $(this).height() + offy;
            }
            else if( movedir == 8 ){
                curleft = $(this).position().left +  offx;
                curtop = $(this).position().top;
                curwidth = $(this).width() - offx;
                curheight = $(this).height();
            }
            else if( movedir == 9 ){
            }
            else if( movedir == 10 ){
                curleft = $(this).position().left +  offx;
                curtop = $(this).position().top + offy;
                curwidth = $(this).width();
                curheight = $(this).height();
            }
            $(this).css({ left: curleft, top: curtop, width: curwidth, height: curheight });
            $(this).find(".MoveFrameBox").css("height", curheight );
            $(this).find(".MoveFrameBox").find(".MoveFrame").css("height", curheight );
            if( isend > 0 ){
                $(this).setpagedata( curdata );
                $(this).setpropdata( { left: itemdata.left, top: itemdata.top, width: itemdata.width, height: itemdata.height } );
            }
        }
    });
})(jQuery);


//处理时间轴处理
(function (jQuery) {
    jQuery.fn.extend({
        lvstimeline: function (token, idxid, curdata) {
            var timebox = $(this);
            var vid = $('.PageElmSel').attr("id");
            var isvoice = vid.indexOf( "voice" ) == 0 ? 1: 0;
            $(timebox).find("[lvs_elm=TimeFlow]").click(function( e ){
                if( $(e.target).hasClass( "TimeLineShow" ) == false ){
                    let curoffx = parseInt( e.offsetX );
                    let allx = parseInt($(this).width());
                    let cursec =  parseInt(curoffx * parseFloat($(timebox).find('[lvs_bind=totalsec]').attr("totalsec")) * 10) / allx;
                    console.log( "clickloc", e.offsetX, allx, $(timebox).find('[lvs_bind=totalsec]').attr("totalsec"), cursec);
                    $(timebox).find('[lvs_bind=currtm]').attr("currsec", cursec);
                    $(timebox).settimelinetm( cursec, function(){
                        if( isvoice > 0 )
                            window[vid].currentTime = cursec / 10;
                        else
                            window[vid].currentTime(cursec / 10);
                    });
                }
            });
            $(timebox).find("[lvs_elm=TimeFlow]").mousemove( function( e ){
                if( $(e.target).hasClass("TimeLineShow") == false ){
                    let curoffx = parseInt( e.offsetX );
                    let allx = parseInt($(this).width());
                    let tm = parseInt(curoffx * parseInt( $(timebox).find('[lvs_bind=totalsec]').attr("totalsec")) * 10 / allx);
                    let tmshow = (tm >= 36000 ? parseInt( tm / 36000 ) + ":":"") + (parseInt((tm % 36000) / 600) < 10 ? "0": "") + parseInt((tm%36000) / 600) + ":" + (parseInt( (tm % 600) / 10) < 10 ? "0":"") + parseInt( (tm % 600) / 10) + "." + (tm % 10);
                    $(this).find("[lvs_bind=tipstm]").text( tmshow );
                    $(this).find(".TimeOver").css("display", "").css("margin-left", curoffx + "px");
                }
            });
            $(timebox).find("[lvs_elm=TimeFlow]").mouseout(function(){
                $(this).find(".TimeOver").css("display", "none");
            });
            $(timebox).find("[lvs_elm=TimeLineAdd]").click(function(){
                $('.PageElmSel').attr("playing", 0);
                window[vid].pause();
                $('.MidSpace').basedialog( token, idxid, "#AddTimeLineForm", function( curbt, curbox ){
                    var themetype = $(curbox).getbind("themetype");
                    var themedata = {};
                    $(curbox).find("[tabcontainer=" + themetype + "]").getthemedata( themetype, themedata );
                    if( curdata.outlines == undefined )
                        curdata.outlines = new Array();
                    let leftper = parseInt( $('[lvs_bind=totalsec]').attr("cursec")) *100 / parseInt( $('[lvs_bind=totalsec]').attr("totalsec"));
                    themedata.leftper = leftper;
                    themedata.cursec = $('[lvs_bind=totalsec]').attr("cursec");
                    curdata.outlines.push( themedata );
                    var idxseq = curdata.outlines.length - 1;
                    $('[lvs_elm=TimeTheme]').append( "<div class=\"TimeTheme TimeTheme" + idxseq + "\" style=\"left:" + leftper + "%\"></div>" );
                    $('[lvs_elm=TimeTheme]').find(".TimeTheme" + idxseq ).click(function(){
                        var Lvs = LvsCore.Create();
                        var cmptname = themetype;
                        if( themetype == "blank" || themetype == "answer" )
                            cmptname = themetype + "inp";
                        var tmbox = $(this);
                        $('#OperateForm').html("<div lvs_elm=\"ThemeShow\"></div><div><a class=\"FormOk button bg-red\">删除该问题</a><a class=\"FormCancel button bg-grey\">关闭返回</a></div>");
                        Lvs.BindTmpl( "#cn.theme." + cmptname, $('[lvs_elm=ThemeShow]'), token, idxid, curdata.outlines[idxseq], function(){
                            $('.MidSpace').basedialog( token, idxid, "#OperateForm", function( curbt, curbox ){
                                curdata.outlines.splice( idxseq, 1 );
                                $(tmbox).fadeOut( 300, function(){
                                    $(this).remove();
                                    $('.MidSpace').closedialog();
                                });
                            }, curdata.outlines[idxseq]);
                        });
                    });
                    $('.MidSpace').closedialog();
                });
            });
            $(timebox).find(".TimeTheme").click(function(){
                let themetype = $(this).attr("themetype");
                let idxseq = $(this).attr("seqidx");
                var tmbox = $(this);
                var Lvs = LvsCore.Create();
                var cmptname = themetype;
                if( themetype == "blank" || themetype == "answer" )
                    cmptname = themetype + "inp";
                $('#OperateForm').html("<div lvs_elm=\"ThemeShow\"></div><div><a class=\"FormOk button bg-red\">删除该问题</a><a class=\"FormCancel button bg-grey\">关闭返回</a></div>");
                Lvs.BindTmpl( "#cn.theme." + cmptname, $('[lvs_elm=ThemeShow]'), token, idxid, curdata.outlines[idxseq], function(){
                    $('.MidSpace').basedialog( token, idxid, "#OperateForm", function( curbt, curbox ){
                        curdata.outlines.splice( idxseq, 1 );
                        $(tmbox).fadeOut( 300, function(){
                            $(this).remove();
                            $('.MidSpace').closedialog();
                        });
                    }, curdata.outlines[idxseq]);
                });
            });
            var mousemove = 0;
            var begx = 0;
            $(timebox).find("[lvs_elm=TimeLineTm]").mousedown(function(e){
                mousemove = 1;
                begx = parseInt(e.pageX);
                window[vid].pause();
            });
            $(timebox).find("[lvs_elm=TimeLineTm]").mousemove(function(e){
                if( mousemove == 1 ){
                    let curoffx = parseInt( e.pageX ) - begx;
                    if( curoffx  != 0 ){
                        let allx = parseInt( $(timebox).find("[lvs_elm=TimeFlow]").width() );
                        let curposx = $(timebox).find(".TimeOff").width();
                        let cursec = (curoffx + curposx) * parseFloat( $(timebox).find('[lvs_bind=totalsec]').attr("totalsec")) * 10 / allx;
                        begx = parseInt( e.pageX );
                        $(timebox).find(".TimeSpan").css("margin-left", curposx + curoffx );
                        $(timebox).find(".TimeOff").css("width", curposx + curoffx );
                        $(timebox).find('[lvs_bind=currtm]').attr("currsec", cursec);
                        if( isvoice > 0 )
                            window[vid].currentTime = cursec /10;
                        else
                            window[vid].currentTime(cursec / 10);
                    }
                }
            });
            $(timebox).find("[lvs_elm=TimeLineTm]").mouseup(function(){
                mousemove = 0;
                $(timebox).settimelinetm( $(timebox).find('[lvs_bind=currtm]').attr("currsec"), function(){
                    if( $('[lvs_elm=VPlay]').attr("playing") == 1 )
                        window[vid].play( isvoice > 0 ? window[vid].currentTime : window[vid].currentTime());
                });
            });
            $(timebox).find("[lvs_elm=TimeLineTm]").mouseout(function(){
                if( mousemove == 1 ){
                    mousemove = 0;
                    $(timebox).settimelinetm( $(timebox).find('[lvs_bind=currtm]').attr("currsec"), function(){
                        if( $('[lvs_elm=VPlay]').attr("playing") == 1 )
                            window[vid].play(isvoice > 0 ? window[vid].currentTime : window[vid].currentTime());
                    });
                }
            });
            $(timebox).find("[lvs_elm=VPlay]").click(function(){
                if( $(this).attr("playing") == 1 ){
                    $(timebox).settimelinestatus( "pause" );
                    $(timebox).trigger( "status", ["pause"] );
                }
                else{
                    $(timebox).settimelinestatus( "play" );
                    $(timebox).trigger( "status", ["play", parseFloat($(timebox).find("[lvs_bind=currtm]").attr("currsec")) / 10] );
                }
            });
            $(timebox).find("[lvs_elm=AddVPage]").click(function(){
                var cursec = parseInt( parseFloat($(timebox).find('[lvs_bind=currtm]').attr("currsec")) * 10 ) / 10;
                $('#OperateForm').loadtmpl("cn.crsplan.videoline", "#AddVPageTmpl", { cursec: cursec / 10 }, function(){
                    $('body').unidialog( "#OperateForm", { token: token, idxid: idxid }, function(curbt, curbox ){
                        cursec = $(curbox).getbind("cursec");
                        let leftper = parseFloat( cursec ) *100 / parseFloat( $(timebox).find('[lvs_bind=totalsec]').attr("totalsec"));
                        if( curdata.outlines == undefined )
                            curdata.outlines = [];
                        else{
                            for( var i = 0; i < curdata.outlines.length; i ++ )
                            {
                                curdata.outlines[i].isnew = 0;
                            }
                        }
                        var vpagedata = {id: -1, isnew: 1, title: "媒体第" + cursec + "秒播放页", type: $(curbox).getbind("pagetype"), leftper: ((leftper - 1) * 0.92), cursec:cursec, pagestr: "", pagemark: "", playtime:$(curbox).getbind("pagetime")};
                        curdata.outlines.push( vpagedata );
                        $('body').closedialog();
                        $(timebox).find("[lvs_elm=TimeVPage]").loadcomponent( "cn.crsplan.vpagelist", token, idxid, curdata, function(){
                        });
                    });
                });
            });
            return this;
        },
        //设置时间轴时间点
        settimelinetm: function( tm, updfunc ){
            $(this).find("[lvs_bind=currtm]").attr("currsec", tm );
            let totalsec = $(this).find( "[lvs_bind=totalsec]").attr("totalsec");
            let curperc = (totalsec == 0 || totalsec == undefined) ? 0 : (tm * 10 / totalsec);
            if( curperc > 100 )
                curperc = 100;
            let tmshow = (tm >= 36000 ? parseInt( tm / 36000 ) + ":":"") + (parseInt((tm % 36000) / 600) < 10 ? "0": "") + parseInt((tm%36000) / 600) + ":" + (parseInt( (tm % 600) / 10) < 10 ? "0":"") + parseInt( (tm % 600) / 10) + "." + (tm % 10);
            $(this).find("[lvs_bind=currtm]").text( tmshow );
            $(this).find(".TimeOff").css("width", curperc + "%");
            $(this).find(".TimeSpan").css("margin-left", curperc + "%");
            if( updfunc != undefined )
                updfunc();
        },
        gettimelinetm: function(){
            if( $(this).find('[lvs_bind=currtm]').attr("currsec") == undefined )
                return 0;
            else
                return parseInt( $(this).find('[lvs_bind=currtm]').attr("currsec") );
        },
        settimelinestatus: function( sta ){
            if( sta == "end" || sta == "pause" )
                $(this).find("[lvs_elm=VPlay]").attr("playing", 0).find("img").attr("src", "../../Image/photoplay.png" );
            else if( sta == "play" )
                $(this).find("[lvs_elm=VPlay]").attr("playing", 1).find("img").attr("src", "../../Image/photopause.png" );
        }
    });
})(jQuery);

//设置页面某元素的数据
(function (jQuery) {
    jQuery.fn.extend({
        setpagedata: function (curdata, idxtype) {
            setplansave( 1 );
            var curelm = $(this);
            var curidx = $(this).attr("seqidx");
            var elmdata = {};
            if( idxtype == "background" )
                elmdata = curdata.item;
            else if( idxtype == "theme" || idxtype == "group" )
                elmdata = curdata.item.elements[curidx];
            else if( idxtype == undefined ){
                elmdata = curdata.item.elements[curidx];
                idxtype = elmdata.type;
            }
            if( elmdata != undefined ){
                if( idxtype == "text" ){
                    elmdata.text = $(curelm).getbind("elmtext");
                    elmdata.textalign = $(curelm).css("text-align");
                    elmdata.fontsize = fontsizeVw($(curelm).css("font-size"));
                    elmdata.color = colorHex( $(curelm).css("color"));
                    elmdata.bgcolor = colorHex( $(curelm).css("background-color"));
                    elmdata.bordercolor = colorHex( $(curelm).css("border-color"));
                    elmdata.fonttype=$(curelm).css("font-family");
                    elmdata.lineheight =lineheightTimes($(curelm).css("line-height"),$(curelm).css("font-size"));
                    elmdata.letterspacing =$(curelm).css("letter-spacing")==0?"0px":$(curelm).css("letter-spacing");
                    elmdata.borderstyle=$(curelm).css("border-style");
                    elmdata.borderwidth=$(curelm).css("border-width");
                    elmdata.borderradius=$(curelm).css("border-radius");
                    elmdata.fontweight = $(curelm).css("font-weight");
                    elmdata.fontstyle = $(curelm).css("font-style");
                    elmdata.fontdecoration = $(curelm).css("text-decoration").indexOf("underline")==-1?"":"underline";
                }
                else if( idxtype == "file" ){
                    elmdata.filename = $(curelm).getbind("filename");
                }
                else if( idxtype == "video" ){
                    
                }
                else if( idxtype == "table" ){
                    elmdata.textalign = $(curelm).css("text-align");
                    elmdata.fontsize = fontsizeVw($(curelm).css("font-size"));
                    elmdata.color = colorHex( $(curelm).css("color"));
                    elmdata.fonttype=$(curelm).css("font-family");
                    elmdata.fontweight = $(curelm).css("font-weight");
                    elmdata.fontstyle = $(curelm).css("font-style");
                    elmdata.fontdecoration = $(curelm).css("text-decoration").indexOf("underline")==-1?"":"underline";
                    elmdata.theads = [];
                    $(curelm).find("thead").find("th").each(function(){
                        elmdata.theads.push({text: $(this).html()});
                    });
                    elmdata.rows = [];
                    $(curelm).find("tr").each(function(){
                        if( $(this).closest("thead").size() == 0 ){
                            let cols = [];
                            $(this).find("td").each(function(){
                                cols.push( { text: $(this).html() });
                            });
                            elmdata.rows.push( { cols: cols } );
                        }
                    });
                }
                else if( idxtype == "background" ){
                    console.log( $(curelm).css("background-color") );
                    elmdata.bgcolor = colorHex( $(curelm).css("background-color"));
                    elmdata.bgimg = $(curelm).css("background-image");
                    var bg = {};
                    GetBgType( elmdata.bgimg, bg);
                    elmdata.bgtype=bg.bgtype;
                    if( bg.bgtype == 2 ){
                        elmdata.bgimage = bg.bgimage;
                        elmdata.bgposition = $(curelm).css("background-position");
                        elmdata.bgsize = $(curelm).css("background-size");
                    }
                    else if( bg.bgtype == 3 ){
                        elmdata.startcolor = bg.startcolor;
                        elmdata.endcolor = bg.endcolor;
                        elmdata.gradienttype = bg.gradienttype;
                    }
                }
                else if( idxtype == "voice" ){
                }
                else if( idxtype == "image" ){
                }
                else if( idxtype == "timer" ){
                    elmdata.begsec = $(curelm).attr("begsec");
                    elmdata.autoend = $(curelm).attr("autoend");
                    elmdata.playsec = $(curelm).attr("playsec");
                }
                else if( idxtype == "theme" || idxtype == "sigsel" || idxtype == "multsel" || idxtype == "blank" || idxtype == "answer" ){
                    $(curelm).getthemedata( idxtype, curdata.item.elements[curidx] );
                    elmdata = curdata.item.elements[curidx];
                    elmdata.fontsize = fontsizeVw( $(curelm).css("font-size"));
                    elmdata.color = colorHex( $(curelm).css("color") );
                }
                else if( idxtype == "task" ){
                    $(curelm).getthemedata( idxtype, curdata.item.elements[curidx] );
                    elmdata = curdata.item.elements[curidx];
                }
                else if( idxtype == "group" ){
                    elmdata.groupdesc = $(curelm).getbind("groupdesc");
                    elmdata.maxgroup = $(curelm).find("[lvs_bind=maxgroup]").text();
                    elmdata.maxmem = $(curelm).find("[lvs_bind=maxmem]").text();
                    elmdata.grouptype=$(curelm).getbind("grouptype");
                    elmdata.fontsize = fontsizeVw( $(curelm).css("font-size"));
                    elmdata.color = colorHex( $(curelm).css("color") );
                }
                else if( idxtype == "groupres" ){
                    elmdata.groupdesc = $(curelm).getbind("groupdesc");
                    elmdata.fontsize = fontsizeVw( $(curelm).css("font-size"));
                    elmdata.color = colorHex( $(curelm).css("color") );
                }
                else if( idxtype == "inner" ){
                    var bindname = $(curelm).attr("lvs_bind");
                    elmdata[bindname + "font"] = fontsizeVw( $(curelm).css("font-size"));
                    elmdata[bindname + "color"] = colorHex( $(curelm).css("color"));
                    elmdata[bindname + "width"] = sizePercent( $(curelm).css("width"), curdata.item.pagewidth);
                }
                elmdata.left = sizePercent( $(curelm).css("left"), curdata.item.pagewidth);
                elmdata.top = sizePercent( $(curelm).css("top"), curdata.item.pageheight);
                elmdata.height = sizePercent( $(curelm).css("height"), curdata.item.pageheight );
                elmdata.rheit = $(curelm).css("height");
                if( idxtype == "oldtext" ){//需要随字体比例大小变化的，宽度不能用百分比
                    elmdata.width = $(curelm).css("width");
                }
                else{
                    elmdata.width = sizePercent( $(curelm).css("width"), curdata.item.pagewidth);
                    elmdata.pxwidth = $(curelm).css("width");
                }
                if( $('.VPageItemSel').size() == 0 ){
                    var Lvs = LvsCore.Create();
                    Lvs.BindTmpl("#cn.crsplan.pageitem", $('.PageItemSel').find("[lvs_elm=ListPageItem]").find("[lvs_elm=PageSpace]").html(""), "", 0, curdata.item, function(){
                        $('.PageItemSel').find("[lvs_elm=ListPageItem]").find("[lvs_elm=PageSpace]").find(".PageElm").each(function(){
                            if( $(this).attr("lvs_elm") != "image" && $(this).attr("lvs_elm") != "video" && $(this).attr("lvs_elm") != "voice" && $(this).attr("lvs_elm") != "timer" ){
                                $(this).css("width", curdata.item.elements[$(this).attr("seqidx")].pxwidth);
                            }
                        });
                    });
                }
                if( idxtype == "background" && curdata.item.hasOwnProperty("allpage") )
                    $('body').cpn("cn.crsplan.pagelist").setpagebg( "", 0, elmdata, 1 );
            }
            return this;
        },
        delpagedata: function( curdata ){
            var curelm = $(this);
            var curidx = $(this).attr("seqidx");
            if( curidx < curdata.item.elements.length )
                curdata.item.elements.splice( curidx, 1 );
                var Lvs = LvsCore.Create();
            Lvs.BindTmpl("#cn.crsplan.pagecard", $('.PageItemSel').find("[lvs_elm=ListPageItem]").html(""), "", 0, curdata, function(){
            });
        }
    });
})(jQuery);


//移动、旋转、大小调整框
(function (jQuery) {
    jQuery.fn.extend({
        lvsmoveframe: function (token, idxid, curdata) {
            var movebox = $(this);
            var curzindex = (curdata.item.elements[idxid].zindex == undefined) ? 1 : curdata.item.elements[idxid].zindex + 1;
            $(this).css("z-index", curzindex);
            $(movebox).css("height", $(movebox).parent().height());
            var movedir = 0;
            var begx = 0;
            var begy = 0;
            $(movebox).mousedown(function (e) {
                lvsdata.AddCache( "updloc", "pageitem", $('[lvs_elm=PageList]').find(".PageItemSel").attr("listidx") + "," + $(movebox).closest(".PageElmSel").attr("seqidx"), curdata.item.elements[$(movebox).closest(".PageElmSel").attr("seqidx")]);
                begx = parseInt(e.pageX);
                begy = parseInt(e.pageY);
                if ($(e.target).hasClass("MoveLeftTop"))
                    movedir = 1;
                else if ($(e.target).hasClass("MoveMidTop"))
                    movedir = 2;
                else if ($(e.target).hasClass("MoveRightTop"))
                    movedir = 3;
                else if ($(e.target).hasClass("MoveRight"))
                    movedir = 4;
                else if ($(e.target).hasClass("MoveRightBottom"))
                    movedir = 5;
                else if ($(e.target).hasClass("MoveMidBottom"))
                    movedir = 6;
                else if ($(e.target).hasClass("MoveLeftBottom"))
                    movedir = 7;
                else if ($(e.target).hasClass("MoveLeft"))
                    movedir = 8;
                else if ($(e.target).hasClass("MoveTopRoltate"))
                    movedir = 10;
                else
                    movedir = 10;
            });
            $('body').mouseup(function (e) {
                if (movedir > 0) {
                    var offx = parseInt(e.pageX) - begx;
                    var offy = parseInt(e.pageY) - begy;
                    $(movebox).closest(".PageElmSel").lvssetmove(movedir, offx, offy, 1, curdata);
                    movedir = 0;
                }
            });
            $('body').mousemove(function (e) {
                if (movedir > 0) {
                    var offx = parseInt(e.pageX) - begx;
                    var offy = parseInt(e.pageY) - begy;
                    begx = parseInt(e.pageX);
                    begy = parseInt(e.pageY);
                    $(movebox).closest(".PageElmSel").lvssetmove(movedir, offx, offy, 0, curdata);
                }
            });
            return this;
        }
    });
})(jQuery);

//页面列表
(function (jQuery) {
    jQuery.fn.extend({
        lvspagelist: function (token, idxid, curdata) {
            var listbox = $(this);
            for( var i = 0; i < curdata.pages.length; i ++ ){
                if( curdata.pages[i].hasOwnProperty("item") == false || curdata.pages[i].item == undefined){
                    var pagestr = decodeURIComponent(curdata.pages[i].pagestr);
                    curdata.pages[i].item = {};
                    if (pagestr != undefined && pagestr != ""){
                        try{
                        curdata.pages[i].item = $.parseJSON(pagestr);
                        }
                        catch(err){
                        curdata.pages[i].item = {};
                        }
                    }
                }
                var master = {};
                if( curdata.pages[i].item.masterid != undefined && curdata.pages[i].item.masterid<curdata.masters.length+1 && curdata.pages[i].item.masterid > 0)
                    master = curdata.masters[parseInt(curdata.pages[i].item.masterid)-1];
                else if( curdata.masters.length > 0 )
                    master = curdata.masters[0];
                if( master.item == undefined && master.pagestr != "" ){
                    try{
                    master.item = $.parseJSON( decodeURIComponent( master.pagestr ));
                    }
                    catch(err){
                    master.item = {};
                    }
                }
                else if( master.item == undefined )
                    master.item = {};
                curdata.pages[i].item.master = master.item;
            }
            if( $(listbox).find('.PageListPreview').size() > 0 ){
                $(listbox).find('.PageListPreview').css("height", parseInt($(window).height()) - parseInt($(listbox).find(".PageListPreview").offset().top));
            }
            if ($(listbox).find(".PageItemSel").size() == 0 && $(listbox).find(".PageItem").size() > 0) {
                if( curdata.config.defpageid )
                    $(listbox).find(".PageItem").eq(curdata.config.defpageid).click();
                else if ($(listbox).find(".PageItemNew").size() > 0){
                    $(listbox).find('.PageListPreview').scrollTop( $(listbox).find(".PageItemNew").offset().top - $(listbox).find('.PageListPreview').offset().top + $(listbox).find('.PageListPreview').scrollTop() );
                    $(listbox).find(".PageItemNew").eq(0).click();
                }
                else
                    $(listbox).find(".PageItem").eq(0).click();
            }
            $(listbox).find("[lvs_elm=PageMenu]").click(function () {
                if( $(this).attr("type") == "pageup" ){
                    $(listbox).lvspagemove( token, idxid, -1 );
                }
                else if( $(this).attr("type") == "pagedown" ){
                    $(listbox).lvspagemove( token, idxid, 1 );
                }
                else if( $(this).attr("type") == "append" ){
                    if( curdata.config.tmpltype == "task" )
                        $(listbox).addcrspage( token, idxid, "task", curdata );
                    else
                        $(listbox).addcrspage( token, idxid, "plan", curdata );
                }
            });
            $(listbox).find("[lvs_elm=PageMenuMore]").click(function(){
                $('body').basepanel( { left: $(this).offset().left + $(this).width(), top: $(this).offset().top, width:200}, function(curbox){
                    if( curdata.config.tmpltype == "task" )
                        $(curbox).html("<div class=\"SubMenuItem\" lvs_elm=\"AddPageTask\" type=\"task\">添加任务页</div><div class=\"SubMenuLine\"></div>");
                    else
                        $(curbox).html("<div class=\"SubMenuPanel\" id=\"PageSubMenu\"><div class=\"SubMenuItem\" style=\"display:none\" lvs_elm=\"AddPageCheck\" type=\"check\">添加检查页</div><div class=\"SubMenuItem\" lvs_elm=\"AddPageTask\" type=\"task\">添加任务页</div><div class=\"SubMenuLine\"></div><div class=\"SubMenuItem\" lvs_elm=\"AddPageImgs\">批量添加图片页</div><div class=\"SubMenuItem\" lvs_elm=\"AddPageMetrls\">批量添加素材页</div><div class=\"SubMenuItem\" lvs_elm=\"DelPage\">删除页面(Del)</div></div>");
                    $(curbox).find(".SubMenuItem").click(function(){
                        if( $(this).attr("lvs_elm") == "AddPageImgs" ){
                            $(this).lvspanelpic( function( elm, src, picid ){
                                var imgs = src.split( ',');
                                var curpageid = $(listbox).find(".PageItemSel").size() > 0 ? parseInt( $(listbox).find(".PageItemSel").attr("listidx") ) : curdata.pages.length;
                                
                                for( var i = 0; i < imgs.length; i ++ ){
                                    var pagestr = encodeURI( "{\"elements\":[{\"id\":-1,\"type\":\"image\",\"title\":\"上传图片\",\"top\":0,\"left\":0,\"width\":\"100%\",\"image\":\"" + imgs[i].replace("/show/", "/ori/").replace("\\show\\", "\\ori\\") + "\",\"picid\":\"" + picid.split(',')[i] + "\",\"curnew\":1}]}");
                                    curdata.pages.splice( curpageid + i + 1, 0, {id: -1, title: "新建图片页", type: "plan", seqid: curdata.pages.length + 1, pagestr: pagestr, pagemark: "", editmode: "0", pagesel: "set.lvsplan.PageSel", playtime: 6});
                                }
                                lvsdata.StoleData( "mayi/matrl_set", { access_token: token, opetype: "MatrlSet", matrltype: "pic", piclist: picid, matrlname: "教案应用图片" }, function( apiname, params, result ){
                                });
                                $('body').closepanel();
                                $('body').unbind("click");
                                var Lvs = LvsCore.Create();
                                Lvs.BindTmpl("#cn.crsplan.pagelist", $(listbox).parent().html(""), token, idxid, curdata, function () {
                                });
                            });
                            $('body').unbind("click");
                        }
                        else if( $(this).attr("lvs_elm" ) == "AddPageDoc" || $(this).attr("lvs_elm" ) == "AddPageCheck" || $(this).attr("lvs_elm" ) == "AddPageTask" ){
                            $(listbox).addcrspage( token, idxid, $(this).attr("type"), curdata );
                        }
                        else if( $(this).attr("lvs_elm" ) == "AddPageMatrl" ){
                        }
                        else if( $(this).attr("lvs_elm" ) == "DelPage" ){
                            $('#OperateForm').html("<div class=\"BaseDesc\">确认要删除该页面吗？请确认</div><div class=\"BaseDesc\"><a class=\"FormOk button bg-green\">确定删除</a><a class=\"FormCancel button bg-grey\">取消操作</a></div>");
                            $('body').closepanel( $('#PageSubMenu'));
                            $('body').unbind("click");
                            $('body').basedialog(token, idxid, "#OperateForm", function (curbt, curbox) {
                                $('body').closedialog();
                                $(listbox).lvspagedel(token, idxid);
                            });
                        }
                    });
                    $('body').unbind("click");
                    $('body').bind("click", function(){
                        if( $('#PageSubMenu:hover').size() == 0 && $('.PageMenu:hover').size() == 0 ){
                            $('body').closepanel( $('#PageSubMenu'));
                            $('body').unbind("click");
                        }
                    });
                });
            });
            $(listbox).find("[lvs_elm=PageTimeSet]").click(function(){
                var databox = $(this);
                
                $('#OperateForm').html("<div class=\"BaseDesc\">请设置该页面自动播放时的时长（秒）</div><div class=\"BaseInput\"><input type=\"number\" lvs_bind=\"pagetime\" value=\"" + $(this).find("[lvs_bind=pagesec]").text() + "\"/></div><div class=\"BaseDesc\"><a class=\"FormOk button bg-green\">确定设置</a><a class=\"FormCancel button bg-grey\">取消操作</a></div>" );
                $('body').unidialog( "#OperateForm", { token: token, idxid: idxid }, function( curbt, curbox ){
                    curdata.pages[$(databox).attr("idxid")].playtime = $(curbox).getbind("pagetime");
                    $('body').closedialog();
                    $(databox).find("[lvs_bind=pagesec]").text( curdata.pages[$(databox).attr("idxid")].playtime );
                });
            });
            $(window).resize(function(){
                $(listbox).find(".PageItemSel").click();
            });
            return this;
        },
        lvsgetpagedata: function( listdata ){
            console.log( "listidx", $(this).find(".PageItemSel").size(), $(this).find(".PageItemSel").attr("listidx" ));
            var dataidx = parseInt( $(this).find(".PageItemSel").attr("listidx" ));
            if( dataidx < listdata.pages.length )
                return listdata.pages[ dataidx ];
            else
                return undefined;
        },
        lvspagerefresh: function( token, idxid, curdata ){
            var Lvs = LvsCore.Create();
            Lvs.BindTmpl("#cn.crsplan.pageitem", $(this).find('.PageItemSel').find("[lvs_elm=ListPageItem]").find("[lvs_elm=PageSpace]").html(""), token, idxid, curdata.item, function(){
            });
            return this;
        },
        addcrspage: function( token, idxid, pagetype, curdata ){
            $('body').closepanel();
            $('body').unbind("click");
            var listbox = $(this);
            for (var i = 0; i < curdata.pages.length; i ++) {
                if (curdata.pages[i].id == -1)
                    curdata.pages[i].id = 0;
                if( curdata.pages[i].isnew == 1 )
                    curdata.pages[i].isnew = 0;
            }
            var newpagedata = { id: -1, isnew: 1, title: "新建页", type: pagetype, seqid: curdata.pages.length + 1, pagestr: "", pagemark: "", editmode: "0", playtime:6, pagesel: "set.lvsplan.PageSel" };
            if( curdata.masters != undefined && curdata.masters.length > 0 )
                newpagedata.master = curdata.masters[0].item;
            if( curdata.hasOwnProperty( "allpage" ) ){
                newpagedata.bgtype = curdata.allpage.bgtype;
                if( newpagedata.bgtype == 1 )
                    newpagedata.bgcolor = curdata.allpage.bgcolor;
                else if( newpagedata.bgtype == 2 ){
                    newpagedata.bgimage = curdata.allpage.bgimage;
                    newpagedata.bgposition = curdata.allpage.bgposition;
                    newpagedata.bgsize = curdata.allpage.bgsize;
                }
                else if( newpagedata.bgtype == 3 ){
                    newpagedata.startcolor = curdata.allpage.startcolor;
                    newpagedata.endcolor = curdata.allpage.endcolor;
                    newpagedata.gradienttype = curdata.allpage.gradienttype;
                }
            }
            if ($(listbox).find(".PageItemSel").size() > 0) {
                lvsdata.AddCache( "add", "pagelist", parseInt($(listbox).find(".PageItemSel").attr("listidx")) + 1, newpagedata );
                curdata.pages.splice(parseInt($(listbox).find(".PageItemSel").attr("listidx")) + 1, 0, newpagedata);
            }
            else{
                lvsdata.AddCache( "add", "pagelist", curdata.pages.length, newpagedata );
                curdata.pages.push(newpagedata);
            }
            lvs.BindTmpl("#cn.crsplan.pagelist", $(listbox).parent().html(""), token, idxid, curdata, function () {
            });
        },
        dellistpage: function( token, idxid, curdata, opeidx ){
            var curidx = opeidx;
            if( curidx == undefined && $(this).find(".PageItemSel").size() > 0 )
                curidx = parseInt($(this).find(".PageItemSel").attr("listidx"));
            if( curidx != undefined && curidx >= 0 ){
                $(this).find(".PageItem").each(function(){
                    if( $(this).attr("listidx") == curidx )
                        $(this).remove();
                });
                if( opeidx == undefined )
                    lvsdata.AddCache( "delete", "pagelist", curidx, curdata.pages[curidx] );
                curdata.pages.splice( curidx, 1 );
                if( $(this).find(".PageItemSel").size() == 0 ){
                    $(this).find(".PageItem").each(function(){
                        if( $(this).attr("listidx") == curidx - 1 && curdata.pages.length == curidx )
                            $(this).addClass("PageItemSel" );
                        else if( $(this).attr("listidx" ) > curidx ){
                            if( $(this).attr("listidx" ) == curidx + 1 )
                                $(this).addClass("PageItemSel" );
                            var curlistidx = parseInt( $(this).attr("listidx") );
                            $(this).attr("listidx",  curlistidx-1 ).attr("lvs_bind", "pages[" + (curlistidx-1) + "]" );
                        }
                    });
                    $(this).find(".PageItemSel").click();
                }
            }
            return this;
        },
        lvspagedel: function (token, idxid, pageidx) {
            var listbox = $(this);
            if (pageidx == undefined)
                pageidx = $(listbox).find(".PageItemSel").attr("listidx");
            lvsdata.AddCache( "delete","pagelist", pageidx, window.PageData.pages[pageidx]);
            window.PageData.pages.splice(pageidx, 1);
            if (window.PageData.pages.length > pageidx)
                window.PageData.pages[pageidx].isnew = 1;
            else if (window.PageData.pages.length > 0)
                window.PageData.pages[window.PageData.pages.length - 1].isnew = 1;
            $(listbox).parent().loadcomponent("cn.crsplan.pagelist", token, idxid, window.PageData, function () {

            });
            return this;
        },
        lvspagemove: function (token, idxid, movedir) {
            let pageidx = parseInt($(this).find(".PageItemSel").attr("listidx"));
            if( movedir > 0 && pageidx == window.PageData.pages.length -1 || movedir < 0 && pageidx ==0 || movedir == 0 )
                return this;
            if( movedir > 0 ){
                window.PageData.pages[pageidx].isnew = 1;
                window.PageData.pages.splice( pageidx + movedir + 1, 0, window.PageData.pages[pageidx] );
                window.PageData.pages.splice( pageidx, 1 );
            }
            else if( movedir < 0 ){
                window.PageData.pages[pageidx].isnew = 1;
                window.PageData.pages.splice( pageidx + movedir, 0, window.PageData.pages[pageidx] );
                window.PageData.pages.splice( pageidx + 1, 1 );
            }
            $(this).parent().loadcomponent("cn.crsplan.pagelist", token, idxid, window.PageData, function () {

            });
        },
        lvspageupdown: function (token, idxid, movedir) {
            let pageidx = parseInt($(this).find(".PageItemSel").attr("listidx"));
            if( movedir > 0 && pageidx == window.PageData.pages.length -1 || movedir < 0 && pageidx ==0 || movedir == 0 )
                return this;
            if( movedir ==1 ){
                $(this).find("[listidx=" + (pageidx + 1) + "]").click();
            }
            else if( movedir == -1 ){
                $(this).find("[listidx=" + (pageidx - 1) + "]").click();
            }
        },
        lvspagectrlc:function(token, idxid, curdata){
                     
             curdata.copyidx= parseInt($(this).find(".PageItemSel").attr("listidx"));
        },
        lvspagectrlv:function(token, idxid, curdata){
             let pageidx = parseInt($(this).find(".PageItemSel").attr("listidx"));
             var copydata ={};

             if(curdata.copyidx != undefined){
                for(var i = 0;i<curdata.pages.length;i++){
                    curdata.pages[i].isnew = 0;
                 }
                
                $(this).extend(true,copydata,curdata.pages[curdata.copyidx]);
                curdata.pages.splice( pageidx + 1, 0, copydata );  
                curdata.pages[pageidx+1].isnew = 1;  
                curdata.pages[pageidx+1].id=0;   
                lvsdata.AddCache( "add", "pagelist", pageidx + 1, copydata );
                $(this).parent().loadcomponent("cn.crsplan.pagelist", token, idxid, curdata, function () {});
             }
        },
        lvspageadd: function( token, idxid, curdata, opeidx, opedata ){
            for(var i = 0;i<curdata.pages.length;i++){
                curdata.pages[i].isnew = 0;
            }
            var undodata = {};
            $(this).extend(true,undodata,opedata);
            curdata.pages.splice( opeidx, 0, undodata );  
            curdata.pages[opeidx].isnew = 1;  
            curdata.pages[opeidx].id=0;   

            $(this).parent().loadcomponent("cn.crsplan.pagelist", token, idxid, curdata, function () {});
        },
        setpagebg: function( token, idxid, styleset, allpage ){
            if( allpage > 0 ){
                window.PageData.allpage = styleset;
                for( var i = 0; i < window.PageData.pages.length; i ++ ){
                    var curdata = window.PageData.pages[i].item;
                    curdata.bgtype = styleset.bgtype;
                    if( curdata.bgtype == 1 )
                        curdata.bgcolor = styleset.bgcolor;
                    else if( curdata.bgtype == 2 ){
                        curdata.bgposition = styleset.bgposition;
                        curdata.bgsize = styleset.bgsize;
                        curdata.bgimage = styleset.bgimage;
                    }
                    else if( curdata.bgtype == 3 ){
                        curdata.startcolor = styleset.startcolor;
                        curdata.endcolor = styleset.endcolor;
                        curdata.gradienttype = styleset.gradienttype;
                    }
                }
                if( styleset.bgtype == 1 )
                    $(this).find(".PageCardPanel").css({"background-image": "","background-color": styleset.bgcolor});
                else if( styleset.bgtype == 2 )
                    $(this).find(".PageCardPanel").css({"background-image": "url('" + styleset.bgimage + "')", "background-position": styleset.bgposition, "background-size": styleset.bgsize });
                else if( styleset.bgtype == 3 )
                    $(this).find(".PageCardPanel").css("background-image", "linear-gradient(" + styleset.gradienttype + "," + styleset.startcolor + "," + styleset.endcolor + ")" );
            }
            else{
                if( $(this).find(".PageItemSel").size() > 0 ){
                    var pageidx = parseInt($(this).find(".PageItemSel").attr("listidx"));
                    curdata = window.PageData.pages[pageidx].item;
                    curdata.bgtype = styleset.bgtype;
                    if( curdata.bgtype == 1 )
                        curdata.bgcolor = styleset.bgcolor;
                    else if( curdata.bgtype == 2 ){
                        curdata.bgposition = styleset.bgposition;
                        curdata.bgsize = styleset.bgsize;
                        curdata.bgimage = styleset.bgimage;
                    }
                    else if( curdata.bgtype == 3 ){
                        curdata.startcolor = styleset.startcolor;
                        curdata.endcolor = styleset.endcolor;
                        curdata.gradienttype = styleset.gradienttype;
                    }
                if( styleset.bgtype == 1 )
                    $(this).find(".PageItemSel").find(".PageCardPanel").css({"background-image": "", "background-color": styleset.bgcolor});
                else if( styleset.bgtype == 2 )
                    $(this).find(".PageItemSel").find(".PageCardPanel").css({"background-image": "url('" + styleset.bgimage + "')", "background-position": styleset.bgposition, "background-size": styleset.bgsize });
                else if( styleset.bgtype == 3 )
                    $(this).find(".PageItemSel").find(".PageCardPanel").css("background-image", "linear-gradient(" + styleset.gradienttype + "," + styleset.startcolor + "," + styleset.endcolor + ")" );
                }
            }
        }
    });
})(jQuery);
//头部菜单与子菜单
(function (jQuery) {
    jQuery.fn.extend({
        lvsheadmenu: function () {
            var menubox = $(this);
            $(menubox).find(".MenuSub").click(function () {
                $(menubox).find(".SubMenuBox").fadeOut(100);
                var cursub = $(menubox).find("[lvs_elm=SubMenu" + $(this).attr("idxid") + "]");
                $(cursub).css({ "position": "absolute", "top": $(this).offset().top + $(this).height(), "left": $(this).position().left }).fadeIn(300);
                $('body').unbind("click");
                $('body').bind("click",function () {
                    if ($('.HeadMenuBox:hover').size() == 0) {
                        $(menubox).find(".SubMenuBox").fadeOut(100);
                        $('body').unbind("click");
                    }
                });
            });
            return this;
        }
    });
})(jQuery);

//页面列表
(function (jQuery) {
    jQuery.fn.extend({
        lvspagetool: function (token, idxid, curdata) {
            var toolbox = $(this);
            var Lvs = LvsCore.Create();
            if( curdata.item == undefined )
                curdata.item = {};
            $(toolbox).find("[lvs_elm=AddText]").click(function () {
                if (curdata.item.hasOwnProperty("elements") == false)
                    curdata.item.elements = new Array();
                curdata.item.elements.push({ id: -1, type: "text", title: "输入文字", top: "20%", left: "30%", width: "40%", curnew: 1, zindex: $(toolbox).getcurzindex(curdata.item.elements) });
                lvsdata.AddCache( "add", "pageitem", $('[lvs_elm=PageList]').find(".PageItemSel").attr("listidx") + "," + (curdata.item.elements.length -1), curdata.item.elements[curdata.item.elements.length -1] );
                if( $('.VPageItemSel').size() > 0 )
                    $('.VPageItemSel').click();
                else{
                    Lvs.BindTmpl("#cn.crsplan.pagecard", $('.PageItemSel').find("[lvs_elm=ListPageItem]").html(""), token, idxid, curdata, function () {
                        $('.PageItemSel').click();
                    });
                }
            });
            $(toolbox).find("[lvs_elm=AddPicture]").click(function () {
                $(this).lvspanelpic(function (elm, src, picid) {
                    if (curdata.item.hasOwnProperty("elements") == false)
                        curdata.item.elements = new Array();
                    var imgs = src.split(',');
                    lvsdata.StoleData( "mayi/matrl_set", { access_token: token, opetype: "MatrlSet", matrltype: "pic", piclist: picid, matrlname: "教案应用图片" }, function( apiname, params, result ){
                    });
                    $('.CurEditCard').cpn("cn.crsplan.pagecard").cardaddimgs(token, idxid, curdata, imgs, picid);
                    $('body').closepanel();
                });
            });
            $(toolbox).find("[lvs_elm=AddTable]").click(function () {
                $('body').basepanel({ left: $(this).offset().left, top: $(this).offset().top + $(this).height(), width:160}, function( curbox ){
                    var tabledata = { col: 10, row: 16 };
                    $(curbox).loadcomponent("cn.crsplan.crttable", token, idxid, tabledata, function(){
                    });
                    $('body').bind("click", function(){
                        if( $('[lvs_elm=AddTable]:hover').size() == 0 && $('.PanelBox:hover').size() == 0 ){
                            $('body').closepanel();
                            $('body').unbind("click");
                        }
                    });
                    $(curbox).bind("tabsel", function( e, colnum, rownum ){
                        var tabdata = {id: -1, type: "table", title: "表格", top: "5%", left: "5%", width:"90%", colnum: colnum, rownum: rownum, curnew: 1, zindex: $(toolbox).getcurzindex(curdata.item.elements)};
                        tabdata.theads = [];
                        tabdata.rows = [];
                        for( var i = 0; i < colnum; i ++ )
                            tabdata.theads.push( { text: "项目" + (i + 1) } );
                        for( var i = 0; i < rownum; i ++ ){
                            var rowdata = { cols: [] };
                            for( var j = 0; j < colnum;j ++ ){
                                rowdata.cols.push( { text: "" } );
                            }
                            tabdata.rows.push( rowdata );
                        }
                        if (curdata.item.hasOwnProperty("elements") == false)
                            curdata.item.elements = [];
                        curdata.item.elements.push( tabdata );
                        $('body').closepanel();
                        $('body').unbind("click");
                        if( $('.VPageItemSel').size() > 0 )
                            $('.VPageItemSel').click();
                        else{
                            Lvs.BindTmpl("#cn.crsplan.pagecard", $('.PageItemSel').find("[lvs_elm=ListPageItem]").html(""), token, idxid, curdata, function () {
                                $('.PageItemSel').click();
                            });
                        }
                    });
                });
            });
            $(toolbox).find("[lvs_elm=AddAttach]").click(function () {
                $(this).lvspanelattach(function (elm, fileurl, attid, filename) {
                    if (curdata.item.hasOwnProperty("elements") == false)
                        curdata.item.elements = new Array();
                    curdata.item.elements.push({ id: -1, type: "file", title: "附件", top: "10%", left: "20%", width: "60%", image: "../Image/bukpack.png", fileurl: fileurl, filename: filename?filename:"文件名称", curnew: 1, zindex: $(toolbox).getcurzindex(curdata.item.elements) });
                    lvsdata.AddCache( "add", "pageitem", $('[lvs_elm=PageList]').find(".PageItemSel").attr("listidx") + "," + (curdata.item.elements.length -1), curdata.item.elements[curdata.item.elements.length -1] );
                    $('body').closepanel();
                    if( $('.VPageItemSel').size() > 0 )
                        $('.VPageItemSel').click();
                    else{
                        Lvs.BindTmpl("#cn.crsplan.pagecard", $('.PageItemSel').find("[lvs_elm=ListPageItem]").html(""), token, idxid, curdata, function () {
                            $('.PageItemSel').click();
                        });
                    }
                });
            });
            $(toolbox).find("[lvs_elm=AddVideo]").click(function () {
                $(this).lvspanelvod(function (elm, src, picid) {
                    if (curdata.item.hasOwnProperty("elements") == false)
                        curdata.item.elements = new Array();
                    curdata.item.elements.push({ id: -1, type: "video", title: "上传视频", top: "0", left: "0", width: "100%", height: curdata.item.pageheight, url: src, picid: picid, curnew: 1, zindex: $(toolbox).getcurzindex(curdata.item.elements) });
                    lvsdata.AddCache( "add", "pageitem", $('[lvs_elm=PageList]').find(".PageItemSel").attr("listidx") + "," + (curdata.item.elements.length -1), curdata.item.elements[curdata.item.elements.length -1] );
                    $('body').closepanel();
                    if( $('.VPageItemSel').size() > 0 )
                        $('.VPageItemSel').click();
                    else{
                        Lvs.BindTmpl("#cn.crsplan.pagecard", $('.PageItemSel').find("[lvs_elm=ListPageItem]").html(""), token, idxid, curdata, function () {
                            $('.PageItemSel').click();
                        });
                    }
                });
            });
            $(toolbox).find("[lvs_elm=AddVoice]").click(function () {
                $(this).lvspanelvod(function (elm, src, picid) {
                    if (curdata.item.hasOwnProperty("elements") == false)
                        curdata.item.elements = new Array();
                    curdata.item.elements.push({ id: -1, type: "voice", title: "上传音频", top: "90%", left: "95%", width: "5%", height: curdata.item.pagewidth / 20, url: src, picid: picid, curnew: 1, zindex: $(toolbox).getcurzindex(curdata.item.elements) });
                    lvsdata.AddCache( "add", "pageitem", $('[lvs_elm=PageList]').find(".PageItemSel").attr("listidx") + "," + (curdata.item.elements.length -1), curdata.item.elements[curdata.item.elements.length -1] );
                    $('body').closepanel();
                    if( $('.VPageItemSel').size() > 0 )
                        $('.VPageItemSel').click();
                    else{
                        Lvs.BindTmpl("#cn.crsplan.pagecard", $('.PageItemSel').find("[lvs_elm=ListPageItem]").html(""), token, idxid, curdata, function () {
                            $('.PageItemSel').click();
                        });
                    }
                });
            });
            $(toolbox).find("[lvs_elm=AddMatrl]").click(function () {
                $('body').basepanel({width:"60%",left:"20%", top: $(this).offset().top + $(this).height(), padding: 8},function(curbox){
                    $(curbox).addClass("CurPanelBox").html("<div lvs_elm=\"MatrlTypeList\"></div><a class=\"PanelOk button bg-green\">确认添加</a><a class=\"PanelCancel button bg-grey\">取消操作</a>");
                    $(curbox).find("[lvs_elm=MatrlTypeList]").loadcomponent( "cn.crsplan.matrllist", token, idxid, curdata, function(){
                        $(curbox).find(".PanelCancel").click(function(){
                            $('body').closepanel();
                            $('body').unbind("click");
                        });
                        $(curbox).find(".PanelOk").click(function(){
                            if (curdata.item.hasOwnProperty("elements") == false)
                                curdata.item.elements = new Array();
                            var matrltype = $(curbox).cpn("cn.crsplan.matrllist").getmatrltype();
                            if( matrltype == "pic" ){
                                var matrldata = {imgs:[], picid: "", matrltype: matrltype};
                                $(curbox).cpn("cn.crsplan.matrlitems").getselectedmatrl( matrldata );
                                if( matrldata.imgs.length == 0 ){
                                    var tips = ErrorTip.Create();
                                    tips.Show("请选选择需要使用的素材" );
                                    return;
                                }
                                $('.CurEditCard').cpn("cn.crsplan.pagecard").cardaddimgs(token, idxid, curdata, matrldata.imgs, matrldata.picid);
                            }
                            $('body').closepanel();
                            $('body').unbind("click");
                        });
                    });
                    $('body').unbind("click");
                    $('body').bind("click", function(){
                        if( $(".CurPanelBox:hover").size() == 0 && $("[lvs_elm=AddMatrl]:hover").size() == 0 ){
                            $('body').closepanel();
                            $('body').unbind("click");
                        }
                    });
                });
            });
            $(toolbox).find("[lvs_elm=AddTimer]").click(function () {
                if (curdata.item.hasOwnProperty("elements") == false)
                    curdata.item.elements = new Array();
                curdata.item.elements.push({ id: -1, type: "timer", title: "定时器", top: "0%", left: "90%", width: "8%", height: curdata.item.pagewidth * 9 / 100, curnew: 1, zindex: $(toolbox).getcurzindex(curdata.item.elements) });
                lvsdata.AddCache( "add", "pageitem", $('[lvs_elm=PageList]').find(".PageItemSel").attr("listidx") + "," + (curdata.item.elements.length -1), curdata.item.elements[curdata.item.elements.length -1] );
                if( $('.VPageItemSel').size() > 0 )
                    $('.VPageItemSel').click();
                else{
                    Lvs.BindTmpl("#cn.crsplan.pagecard", $('.PageItemSel').find("[lvs_elm=ListPageItem]").html(""), token, idxid, curdata, function () {
                        $('.PageItemSel').click();
                    });
                }
            });
            $(toolbox).find("[lvs_elm=AddPaper]").click(function () {
                var DataEng = LvsData.Create();
                DataEng.GetData("leag/task_list", $('#OperateForm').html(""), { access_token: token, gettype: "Tmpl.List" }, function (apiname, params, result) {
                    Lvs.BindTmpl("#cn.form.paperform", $('#OperateForm'), token, idxid, result, function () {
                        $('body').unidialog("#OperateForm", { token: token, idxid: idxid }, function (curbt, curbox) {
                            var selpaperidx = parseInt($(curbox).find("[lvs_bind=paperlist]").find(".Selected").attr("idxseq"));
                            if (selpaperidx < result.tmpls.length) {
                                if (curdata.hasOwnProperty("item") == false)
                                    curdata.item = {};
                                if (curdata.item.hasOwnProperty("elements") == false)
                                    curdata.item.elements = new Array();
                                curdata.item.elements.push({ id: -1, type: "task", title: result.tmpls[selpaperidx].name, top: "40%", left: "40%", curnew: 1, taskdesc: result.tmpls[selpaperidx].tmpldesc, width: "20%", height: "20%" });
                                lvsdata.AddCache( "add", "pageitem", $('[lvs_elm=PageList]').find(".PageItemSel").attr("listidx") + "," + (curdata.item.elements.length -1), curdata.item.elements[curdata.item.elements.length -1] );
                                $('body').closedialog();
                                if( $('.VPageItemSel').size() > 0 )
                                    $('.VPageItemSel').click();
                                else{
                                    Lvs.BindTmpl("#cn.crsplan.pagecard", $('.PageItemSel').find("[lvs_elm=ListPageItem]").html(""), token, idxid, curdata, function () {
                                        $('.PageItemSel').click();
                                    });
                                }
                            }
                        });
                    });
                });
            });
            $(toolbox).find("[lvs_elm=AddTheme]").click(function () {
                if (curdata.item.hasOwnProperty("elements") == false)
                    curdata.item.elements = new Array();
                if ($(this).attr("ttype") == "sigsel")
                    curdata.item.elements.push({ id: -1, type: "sigsel", title: "单选题", top: "40%", left: "40%", width: "20%", height:"20%", curnew: 1, problem: "请输入选择题题目内容", problemimg: "", problemclr: "", answerclr: "", options: [{ seqid: "A", opttext: "选项一", optimg: "" }, { seqid: "B", opttext: "选项二", optimg: "" }, { seqid: "C", opttext: "选项三", optimg: "" }, { seqid: "D", opttext: "选项四", optimg: ""}], baseanswer: "", zindex: $(toolbox).getcurzindex(curdata.item.elements) });
                else if ($(this).attr("ttype") == "multsel")
                    curdata.item.elements.push({ id: -1, type: "multsel", title: "多选题", top: "40%", left: "40%", width: "20%", height:"20%", curnew: 1, problem: "请输入多选题题目内容", problemimg: "", problemclr: "", answerclr: "", options: [{ seqid: "A", opttext: "选项一", optimg: "" }, { seqid: "B", opttext: "选项二", optimg: "" }, { seqid: "C", opttext: "选项三", optimg: "" }, { seqid: "D", opttext: "选项四", optimg: ""}], baseanswer: "", zindex: $(toolbox).getcurzindex(curdata.item.elements) });
                else if ($(this).attr("ttype") == "blank")
                    curdata.item.elements.push({ id: -1, type: "blank", title: "填空题", top: "40%", left: "40%", width: "20%", height:"20%", curnew: 1, problem: "请输入填空题题目，需要填空处用____表示", problemimg: "", answerclr: "", problemclr: "", baseanswer: "", zindex: $(toolbox).getcurzindex(curdata.item.elements) });
                else if ($(this).attr("ttype") == "answer")
                    curdata.item.elements.push({ id: -1, type: "answer", title: "问答题", top: "40%", left: "40%", width: "20%", height:"20%", curnew: 1, problem: "请输入问答题题目内容", problemimg: "", problemclr: "", answerclr: "", baseanswer: "", zindex: $(toolbox).getcurzindex(curdata.item.elements) });
                lvsdata.AddCache( "add", "pageitem", $('[lvs_elm=PageList]').find(".PageItemSel").attr("listidx") + "," + (curdata.item.elements.length -1), curdata.item.elements[curdata.item.elements.length -1] );
                if( $('.VPageItemSel').size() > 0 )
                    $('.VPageItemSel').click();
                else{
                    Lvs.BindTmpl("#cn.crsplan.pagecard", $('.PageItemSel').find("[lvs_elm=ListPageItem]").html(""), token, idxid, curdata, function () {
                        $('.PageItemSel').click();
                    });
                }
            });
            $(toolbox).find("[lvs_elm=AddIntact]").click(function () {
                if (curdata.item.hasOwnProperty("elements") == false)
                    curdata.item.elements = new Array();
                if ($(this).attr("ttype") == "group")
                    curdata.item.elements.push({ id: -1, type: "group", title: "分组请求", top: "10%", left: "15%", width: "70%", curnew: 1, groupdesc: "请加入以下分组或者创建新分组", maxgroup: 6, maxmem: 5, grouptype: "class", zindex: $(toolbox).getcurzindex(curdata.item.elements) });
                if ($(this).attr("ttype") == "groupres")
                    curdata.item.elements.push({ id: -1, type: "groupres", title: "分组收集成果", top: "10%", left: "15%", width: "70%", curnew: 1, groupdesc: "请根据分组提交阶段成果", zindex: $(toolbox).getcurzindex(curdata.item.elements) });
                lvsdata.AddCache( "add", "pageitem", $('[lvs_elm=PageList]').find(".PageItemSel").attr("listidx") + "," + (curdata.item.elements.length -1), curdata.item.elements[curdata.item.elements.length -1] );
                if( $('.VPageItemSel').size() > 0 )
                    $('.VPageItemSel').click();
                else{
                    Lvs.BindTmpl("#cn.crsplan.pagecard", $('.PageItemSel').find("[lvs_elm=ListPageItem]").html(""), token, idxid, curdata, function () {
                        $('.PageItemSel').click();
                    });
                }
            });
            return this;
        },
        getcurzindex: function (elms) {
            var curmax = 0;
            if( elms == undefined )
                return 2;
            for (var i = 0; i < elms.length; i++) {
                if (elms[i].zindex > curmax)
                    curmax = elms[i].zindex;
            }
            return curmax + 2;
        }
    });
})(jQuery);
//页面列表
(function (jQuery) {
    jQuery.fn.extend({
        lvs_table_crt: function (token, idxid, curdata) {
            var tabstr = "<table width=\"100%\">";
            var tabbox = $(this);
            for(var i = 0; i < curdata.row; i ++ ){
                tabstr += "<tr>"
                for( var j = 0; j < curdata.col; j++){
                    tabstr += "<td style=\"padding:1px\"><div class=\"TdBox\" col=\"" + j + "\" row=\"" + i + "\"></div></td>";
                }
                tabstr += "</tr>";
            }
            tabstr += "</table>";
            $(this).find("[lvs_elm=TdList]").html( tabstr );
            $(this).find("[lvs_elm=TdList]").find(".TdBox").each(function(){
                $(this).css("height", $(this).width() );
            });
            $(this).find("[lvs_elm=TdList]").find(".TdBox").mouseover(function(){
                let curcol = parseInt( $(this).attr("col"));
                let currow = parseInt($(this).attr("row"));
                $(tabbox).find(".TdBox").each(function(){
                    if( parseInt($(this).attr("col")) <= curcol && parseInt( $(this).attr("row")) <= currow )
                        $(this).addClass("TdBoxSel");
                    else
                        $(this).removeClass("TdBoxSel");
                });
                $(tabbox).find("[lvs_bind=tablesel]").text( (curcol + 1) + "x" + (currow + 1) + "表格" );
            });
            $(this).find("[lvs_elm=TdList]").find("td").click(function(){
                $(tabbox).trigger("tabsel", [parseInt( $(this).find(".TdBox").attr("col")) + 1, parseInt( $(this).find(".TdBox").attr("row")) + 1] );
            });
        }
    });
})(jQuery);

//素材选择列表
(function (jQuery) {
    jQuery.fn.extend({
        lvs_martl_list: function (token, idxid, curdata) {
            var matrlbox = $(this);
            $(matrlbox).find(".SimpItem").click(function(){
                $(matrlbox).find(".active").removeClass("active");
                $(this).addClass("active");
                var matrltype = $(this).attr("tabidx");
                lvsdata.GetData("mayi/matrl_list", $(matrlbox).find(".tabcontent").html(""), { access_token: token, gettype: "Matrl." + matrltype, cursor: 0, count: 20}, function( apiname, params, result ){
                    result.matrltype = matrltype;
                    $(matrlbox).find(".tabcontent").loadcomponent( "cn.crsplan.matrlitems", token, idxid, result, function(){
                    });
                });
            });
            $(matrlbox).find("[lvs_elm=MatrlItem]").click( function( e ){
                if( $(this).attr("lvs_elm") == "DelItem" ){
                }
                else{
                var clickbox =$(this);
                    if( $(this).hasClass("FlexItemBoxSel") ){
                        $(this).removeClass("FlexItemBoxSel").parent().find(".FlexOpe").css("display", "none");
                    }
                    else{
                        $(this).addClass("FlexItemBoxSel").parent().find(".FlexOpe").css("display", "");
                    }
                }
            });
            $(matrlbox).find("[lvs_elm=MatrlOpe]").click(function(e){
                var curitem = $(this).parent().find("[lvs_elm=MatrlItem]");
                var clickbox = $(this);
                if( $(e.target).attr("opetype") != undefined ){
                    lvsdata.GetData("mayi/matrl_set", $(e.target), { access_token: token, opetype: $(e.target).attr("opetype"), matrlid: $(e.target).attr("idxid"), matrltype: $(e.target).attr("idxtype")}, function( apiname, params, result ){
                        if( params.opetype == "DelShare" )
                            $(e.target).attr("opetype", "SetShare").text("设置共享");
                        else if( params.opetype == "SetShare")
                            $(e.target).attr("opetype", "DelShare").text("取消共享");
                        else if( params.opetype == "DelMtl" ){
                            $(clickbox).css("display", "none");
                            $(curitem).fadeOut(500, function(){ $(this).remove(); });
                        }
                    });
                }
            });
        },
        getmatrltype: function(){
            return $(this).find("[lvs_elm=SimpTabIdx]").find(".active").attr("tabidx");
        },
        getselectedmatrl: function( curdata ){
            
            $(this).find(".FlexItemBoxSel").each(function(){
                curdata.imgs.push( $(this).attr("idxval" ));
                if( curdata.picid != "" )
                    curdata.picid += ",";
                curdata.picid += $(this).attr("idxid");
            });
        }
    });
})(jQuery);

//项目化进度内容展示
(function (jQuery) {
    jQuery.fn.extend({
        lvs_crspblstep: function (token, idxid, curdata) {
            var tchid = (idxid < 0) ? 0 - idxid : idxid;
            var crsbox = $(this);
            $(crsbox).find(".BaseListItem").click(function(){
                $(crsbox).find(".BaseListItemSel").removeClass("BaseListItemSel");
                $(this).addClass("BaseListItemSel");
                if( $(this).attr("lvs_elm") == "PlayPlan" ){
                    lvsdata.GetData("edu/course_list", $(crsbox).find("#CrsPlay"), { access_token: token, crstmplid: curdata.id, gettype: "CrsTmpl.Base" }, function( apiname, params, result ){
                        $(crsbox).find("#CrsStep").html("<div style=\"text-align:right;padding:12px 0;\"><a lvs_elm=\"PlayCrsplan\" class=\"button border-green\">播放预览</a><a lvs_elm=\"EditCrsplan\" class=\"button border-yellow\">编辑讲义</a></div><div id=\"CrsPlay\"><img width=\"100%\" src=\"" + result.titleimg + "\"/></div>" );
                        $(crsbox).find("[lvs_elm=PlayCrsplan]").click(function(){
                            lvsdata.GetData("edu/course_list", $(crsbox).find("#CrsPlay"), { access_token: token, crstmplid: curdata.id, gettype: "CrsTmpl.Base" }, function( apiname, params, result ){
                                curdata.tmplinfo = result;
                                curdata.tmplinfo.autoplay = 1;
                                curdata.tmplinfo.preview = 1;
                                $(crsbox).find("#CrsPlay").loadcomponent( "cn.play.lesnplay", token, idxid, curdata.tmplinfo, function(){
                                });
                            });
                        });
                        $(crsbox).find("[lvs_elm=EditCrsplan]").click(function(){
                            lvs.LvsRout( "crstmpl_edit", token, idxid, curdata.id );
                        });
                    });
                }
                if( $(this).attr("lvs_elm") == "ProjPlan" ){
                    lvsdata.GetData("edu/course_list", $(crsbox).find("#CrsPlay"), { access_token: token, crstmplid: curdata.id, gettype: "CrsTmpl.Base" }, function( apiname, params, result ){
                        $(crsbox).find("#CrsStep").html("<div style=\"text-align:right;padding:12px 0;\"><a lvs_elm=\"PlayCrsplan\" class=\"button border-green\">查看预览</a><a lvs_elm=\"EditCrsplan\" class=\"button border-yellow\">编辑介绍</a></div><div id=\"CrsPlay\"><img width=\"100%\" src=\"" + result.titleimg + "\"/></div>" );
                        $(crsbox).find("[lvs_elm=PlayCrsplan]").click(function(){
                            curdata.tmplinfo = result;
                            curdata.tmplinfo.autoplay = 1;
                            $(crsbox).find("#CrsPlay").loadcomponent( "cn.play.lesnplay", token, idxid, curdata.tmplinfo, function(){
                            });
                        });
                        $(crsbox).find("[lvs_elm=EditCrsplan]").click(function(){
                            lvs.LvsRout( "crstmpl_edit", token, idxid, curdata.id );
                        });
                    });
                }
                else if( $(this).attr("lvs_elm") == "TaskReq" ){
                    lvsdata.GetData("edu/course_list", $(crsbox).find("#CrsStep").html(""), { access_token: token, crstmplid: curdata.id, gettype: "CrsTmpl.TaskChlg" }, function( apiname, params, result ){
                        $(crsbox).find("#CrsStep").loadcomponent( "cn.crsplan.crstmpltasks", token, idxid, result, function(){
                        });
                    });
                }
                else if( $(this).attr("lvs_elm") == "TaskIng" ){
                    lvsdata.GetData("edu/course_list", $(crsbox).find("#CrsStep").html(""), { access_token: token, crstmplid: curdata.id, gettype: "CrsTmpl.TaskGrpres" }, function( apiname, params, result ){
                        for( var i = 0; i < result.tasks.length; i ++ ){
                            for( var j = 0; result.tasks[i].grpreses != undefined && j< result.tasks[i].grpreses.length; j ++ ){
                                if( result.tasks[i].grpreses[j].stepdesc != "" )
                                    result.tasks[i].grpreses[j].step = $.parseJSON( result.tasks[i].grpreses[j].stepdesc );
                                if( result.tasks[i].grpreses[j].chkres != "" )
                                    result.tasks[i].grpreses[j].check = $.parseJSON(result.tasks[i].grpreses[j].chkres );
                            }
                        }
                        $(crsbox).find("#CrsStep").loadcomponent( "cn.crsplan.crstmplgrps", token, idxid, result, function(){
                        });
                    });
                }
                else if( $(this).attr("lvs_elm") == "TaskCheck" ){
                    lvsdata.GetData("edu/course_list", $(crsbox).find("#CrsStep").html(""), { access_token: token, crstmplid: curdata.id, gettype: "CrsTmpl.TaskGrpres" }, function( apiname, params, result ){
                        for( var i = 0; i < result.tasks.length; i ++ ){
                            for( var j = 0; result.tasks[i].grpreses != undefined && j< result.tasks[i].grpreses.length; j ++ ){
                                if( result.tasks[i].grpreses[j].chkres != "" )
                                    result.tasks[i].grpreses[j].check = $.parseJSON( result.tasks[i].grpreses[j].chkres );
                                else
                                    result.tasks[i].grpreses[j].check = {};
                            }
                        }
                        $(crsbox).find("#CrsStep").loadcomponent( "cn.crsplan.crstmplchks", token, idxid, result, function(){
                        });
                    });
                }
            });
            $(crsbox).find("[lvs_elm=DelCrstmpl]").click(function(){
                var crstmplid = $(this).attr("idxid");
                $('body').unidialog( "#DelCrsForm", { token: token, idxid: idxid}, function( curbt, curbox ){
                    lvsdata.GetData("edu/course_set", $(curbt), { access_token: token, opetype: "Tmpl.Delete", crstmplid: crstmplid }, function(apiname, params, result ){
                        $('body').closedialog();
                        lvs.LvsRout("crstmpl_pbl", token, idxid, curdata.courseid );
                    });
                });
            });
            $('body').keyup( function( e ){
                if( e.keyCode == 40 || e.keyCode == 34 ){
                    var curidx = 0;
                    if( $(crsbox).find(".BaseListItemSel").size() == 1 ){
                        curidx = parseInt( $(crsbox).find(".BaseListItemSel").attr("dataidx"));
                    }
                    else if( $(crsbox).find(".BaseListItem").size() > 0 )
                        curidx = -1;
                    $(crsbox).find(".BaseListItem").each(function(){
                        if( $(this).attr("dataidx") == curidx + 1)
                            $(this).click();
                    });
                }
                else if( e.keyCode == 38 || e.keyCode == 33 ){
                    var curidx = 0;
                    if( $(crsbox).find(".BaseListItemSel").size() == 1 ){
                        curidx = parseInt( $(crsbox).find(".BaseListItemSel").attr("dataidx"));
                    }
                    $(crsbox).find(".BaseListItem").each(function(){
                        if( $(this).attr("dataidx") == curidx - 1)
                            $(this).click();
                    });
                }
            });
        }
    });
})(jQuery);

//项目化课程作业列表
(function (jQuery) {
    jQuery.fn.extend({
        lvs_crstmpl_tasks: function (token, idxid, curdata) {
            var tchid = (idxid < 0) ? 0 - idxid : idxid;
            var crsbox = $(this);
            for(var i = 0; i < curdata.tasks.length; i ++ ){
                var pagedata = {};
                pagedata.item = $.parseJSON( curdata.tasks[i].taskdesc );
                $(crsbox).find("[lvs_elm=TaskBox_" + i + "]").loadcomponent( "cn.crsplan.pageitem", token, idxid, pagedata.item, function(){
                });
            }
        }
    });
})(jQuery);

//项目化课程任务进度
(function (jQuery) {
    jQuery.fn.extend({
        lvs_crstmpl_grps: function (token, idxid, curdata) {
            var tchid = (idxid < 0) ? 0 - idxid : idxid;
            var crsbox = $(this);
            $(crsbox).find("[lvs_elm=AddGrpRes]").click(function(){
                var tskid = $(this).attr("idxid");
                $('body').unidialog( "#AddGrpForm", { token: token, idxid: idxid }, function( curbt, curbox ){
                    var stepres = { resptime: $(curbox).getbind("resptime"), evday: $(curbox).getbind("evday"), daynum: $(curbox).getbind("daynum"), fileres: $(curbox).getbind("fileres"), progres: $(curbox).getbind("progres"), textres: $(curbox).getbind("textres"), taskres: $(curbox).getbind("taskres"), mindres: $(curbox).getbind("mindres"), paperres: $(curbox).getbind("paperres")};
                    lvsdata.GetData("edu/course_set", $(curbt), { access_token: token, crstmplid: curdata.id, taskid: tskid, stepname: $(curbox).getbind("stepname"), stepres: encodeURIComponent( JSON.stringify(stepres)), opetype: "Tmpl.AddTaskRes" }, function( apiname, params, result ){
                        $('body').closedialog();
                        var curtask = lvsdata.GetById( curdata.tasks, { id: tskid } );
                        curtask.grpreses.push( { id: result.id, stepname: params.stepname, stepid: curtask.grpreses.length + 1, step: stepres } );
                        $(crsbox).parent().loadcomponent( "cn.crsplan.crstmplgrps", token, idxid, curdata, function(){
                        });
                    });
                });
            });
            $(crsbox).find("[lvs_elm=TaskTmplSel]").change(function(){
                var curres = curdata.tasks[$(this).attr("dataidx").split(',')[0]].grpreses[$(this).attr("dataidx").split(',')[1]];
                var curidx = parseInt($(this).val());
                var tdesc = curres.step.tdesc;
                if( curidx > 0||curidx == -1){
                    var bfind = 0;
                    for( var i = 0; i < curdata.tasktmpls.length; i ++ ){
                        if( curdata.tasktmpls[i].id == curidx )
                        {
                            tdesc = curdata.tasktmpls[i].sdesc;
                            bfind = 1;
                            break;
                        }
                    }
                    if( bfind == 0 && curidx == -1 )
                        tdesc = "";
                }
                var ttdata = { dataidx: $(this).attr("dataidx"), tasktmpl: curidx, ttname: $(this).find('option:selected').text(), tdesc: tdesc };
                $(this).closest("[lvs_elm=GrpResBox]").find("[lvs_elm=TaskTmplDesc]").html("").loadcomponent( "cn.theme.tmplform", token, idxid, ttdata, function(){
                });
                if( curidx > 0 || curidx == -1){
                    curres.step.tasktmpl = curidx;
                    curres.step.ttname = $(this).find('option:selected').text();
                    curres.step.tdesc = tdesc;
                    lvsdata.StoleData("edu/course_set", { access_token: token, opetype: "Tmpl.UpdTaskRes", grpresid: curres.id, stepres: encodeURIComponent( JSON.stringify(curres.step) )}, function( apiname, params,result ){
                    });
                }
            });
            $(crsbox).bind("save", function( e, dataidx, params ){
                var curres = curdata.tasks[dataidx.split(',')[0]].grpreses[dataidx.split(',')[1]];
                curres.step.tasktmpl = params.tasktmpl;
                curres.step.ttname = params.ttname;
                curres.step.tdesc = params.tdesc;
                lvsdata.GetData("edu/course_set", $('.CurClick'), { access_token: token, opetype: "Tmpl.UpdTaskRes", grpresid: curres.id, stepres: encodeURIComponent( JSON.stringify(curres.step) )}, function( apiname, params,result ){
                    if( curres.step.tasktmpl == -1 ){
                        curdata.tasktmpls.push( { id: -1, name: curres.step.ttname, sdesc: curres.step.tdesc });
                        $('body').unidialog( "#SaveTmplForm", {token,idxid}, function( curbt, curbox ){
                            if( $(curbt).attr("opetype") == "SaveOk" ){
                                lvsdata.GetData("edu/course_set", $(curbt), { access_token: token, opetype: "Task.SaveTaskTmpl", tasktmplid: -1, tmpltype: "格式表单", tmplname: $(curbox).getbind("tmplname"), tmpldesc: encodeURIComponent( curres.step.tdesc ) }, function( apiname, params, result ){
                                    curdata.tasktmpls[curdata.tasktmpls.length-1].id = result.id;
                                    $(crsbox).find("[lvs_elm=TaskTmplSel]").find("option:selected").text( params.tmplname).attr("value", result.id );
                                    $('body').closedialog();
                                });
                            }
                            else{
                                $('body').closedialog();
                            }
                        });
                    }
                    else{
                        for( var i = 0; i< curdata.tasktmpls.length; i++ ){
                            if( curres.step.tasktmpl == curdata.tasktmpls[i].id )
                                curdata.tasktmpls[i].sdesc = curres.step.tdesc;
                        }
                    }
                });
            });
            $(crsbox).find("[lvs_elm=TaskPaperDesc]").each(function(){
                var curres = curdata.tasks[$(this).attr("dataidx").split(',')[0]].grpreses[$(this).attr("dataidx").split(',')[1]];
                if( !curres.step )
                    curres.step = {};
                curres.step.dataidx = $(this).attr("dataidx");
                var thmbox = $(this);
                $(this).loadcomponent("cn.theme.taskpaper", token, idxid, curres.step, function(){
                    $(thmbox).bind("paperchange", function(e, dataidx, taskpaper, papertitle, paperdesc ){
                        var curres = curdata.tasks[dataidx.split(',')[0]].grpreses[dataidx.split(',')[1]];
                        curres.step.paperid = taskpaper;
                        curres.step.papertitle = papertitle;
                        curres.step.paperdesc = paperdesc;
                        lvsdata.GetData("edu/course_set", $('.CurClick'), { access_token: token, opetype: "Tmpl.UpdTaskRes", grpresid: curres.id, stepres: encodeURIComponent( JSON.stringify(curres.step) )}, function( apiname, params,result ){
                        });
                    });
                });
            });
            $(crsbox).find("[lvs_elm=EditGrpRes]").click(function(){
                var dataidx = $(this).attr("dataidx").split(',');
                var editdata = curdata.tasks[dataidx[0]].grpreses[dataidx[1]];
                editdata.tasktmpls = curdata.tasktmpls;
                $('#OperateForm').loadtmpl( "cn.crsplan.crstmplgrps", "#UpdGrpTmpl", editdata, function(){
                    $('body').unidialog( "#OperateForm", { token: token, idxid:idxid}, function( curbt, curbox ){
                        if( $(curbt).attr("ope") == "Update" ){
                            var stepres = { resptime: $(curbox).getbind("resptime"), evday: $(curbox).getbind("evday"), daynum: $(curbox).getbind("daynum"), fileres: $(curbox).getbind("fileres"), progres: $(curbox).getbind("progres"), textres: $(curbox).getbind("textres"), taskres: $(curbox).getbind("taskres"), mindres: $(curbox).getbind("mindres"), paperres: $(curbox).getbind("paperres")};
                            lvsdata.GetData( "edu/course_set", $(curbt), { access_token: token, grpresid: editdata.id, stepname: $(curbox).getbind("stepname"), stepres: encodeURIComponent( JSON.stringify( stepres ) ), opetype: "Tmpl.UpdTaskRes" }, function( apiname, params, result ){
                                $('body').closedialog();
                                $(crsbox).SetData( curdata.tasks[dataidx[0]].grpreses[dataidx[1]], { stepname: params.stepname } );
                                $(crsbox).SetData( curdata.tasks[dataidx[0]].grpreses[dataidx[1]].step, stepres );
                                $(crsbox).parent().loadcomponent( "cn.crsplan.crstmplgrps", token, idxid, curdata, function(){
                                });
                            });
                        }
                        else if( $(curbt).attr("ope") == "Delete"){
                            lvsdata.GetData( "edu/course_set", $(curbt), { access_token: token, grpresid: editdata.id, opetype: "Tmpl.DelTaskRes" }, function( apiname, params, result ){
                                $('body').closedialog();
                                curdata.tasks[dataidx[0]].grpreses.splice( dataidx[1], 1 );
                                $(crsbox).parent().loadcomponent( "cn.crsplan.crstmplgrps", token, idxid, curdata, function(){
                                });
                            });
                        }
                    });
                });
            });
            $(crsbox).find("[lvs_elm=EditGrpChk]").click(function(){
                var dataidx = $(this).attr("dataidx").split(',');
                var editdata = curdata.tasks[dataidx[0]].grpreses[dataidx[1]];
                if( editdata.chkres != "" && editdata.chkres != undefined )
                    editdata.check = $.parseJSON( editdata.chkres );
                else
                    editdata.check = {};
                $('#OperateForm').loadtmpl( "cn.crsplan.crstmplchks", "#UpdChkTmpl", editdata, function(){
                    $('body').unidialog( "#OperateForm", { token: token, idxid:idxid}, function( curbt, curbox ){
                        if( $(curbt).attr("ope") == "AppendCate" ){
                            $(curbt).before( "<div class=\"eachcate\"><div class=\"BaseDesc\">评审维度名称：</div><div class=\"BaseInput\"><input lvs_bind=\"catename\" type=\"text\" placeholer=\"评审的维度\"/></div><div class=\"BaseDesc\">评审权重(%)：</div><div class=\"BaseInput\"><input type=\"number\" lvs_bind=\"caterate\" /></div></div>");
                        }
                        else{
                            var curchk = {chknum: $(curbox).getbind("chknum"), oknum: $(curbox).getbind("oknum") };
                            if( $(curbox).getbind("cate") == "mult" ){
                                curchk.cates = [];
                                $(curbox).find(".eachcate").each(function(){
                                    curchk.cates.push( { name: $(this).getbind("catename"), rate: $(this).getbind("caterate")} );
                                });
                            }
                            lvsdata.GetData( "edu/course_set", $(curbt), { access_token: token, grpresid: editdata.id, opetype: "Tmpl.UpdTaskChk", chkdesc: encodeURIComponent(JSON.stringify( curchk )) }, function( apiname, params, result ){
                                $('body').closedialog();
                                if( curdata.tasks[dataidx[0]].grpreses[dataidx[1]].check == undefined )
                                    curdata.tasks[dataidx[0]].grpreses[dataidx[1]].check = {};
                                $(crsbox).SetData( curdata.tasks[dataidx[0]].grpreses[dataidx[1]].check, curchk );
                                $(crsbox).parent().loadcomponent( "cn.crsplan.crstmplgrps", token, idxid, curdata, function(){
                                });
                            });
                        }
                    });
                });
            });
        }
    });
})(jQuery);



//项目化课程任务评审
(function (jQuery) {
    jQuery.fn.extend({
        lvs_crstmpl_chks: function (token, idxid, curdata) {
            var tchid = (idxid < 0) ? 0 - idxid : idxid;
            var crsbox = $(this);
        }
    });
})(jQuery);

//VPage列表
(function (jQuery) {
    jQuery.fn.extend({
        lvs_vpagelist: function (token, idxid, curdata) {
            var vpagebox = $(this);
            $(vpagebox).find(".VPageItem").click(function(e){
                var velm = $(this);
                if( $(e.target).attr("lvs_elm") == "DelVPage" ){
                    var vidx = $(this).attr("dataidx");
                    $('body').unidialog( "#DelVPageForm", { token: token, idxid: idxid}, function( curbt, curbox ){
                        $('body').closedialog();
                        curdata.outlines.splice( vidx, 1 );
                        $(velm).fadeOut( 200, function(){
                            $(this).remove();
                        });
                    });
                }
                else{
                    if ($('#PageEditVCard').find(".PageElmSel").size() > 0) {
                        $('#PageEditVCard').cpn("cn.crsplan.pagecard").refreshdata("vpage");
                    }
                    var vpageidx = $(this).attr("dataidx");
                    $(vpagebox).find('.VPageItemSel').removeClass("VPageItemSel").find("[lvs_elm=DelVPage]").css("display", "none");
                    $(this).addClass("VPageItemSel").find("[lvs_elm=DelVPage]").css("display", "");
                    $('.CurEditCard').removeClass("CurEditCard");
                    $('#PageEditVCard').addClass("CurEditCard");
                    lvs.BindTmpl("#cn.crsplan.pagetool", $('[lvs_elm=PageTooltip]').html(""), token, idxid, curdata.outlines[vpageidx], function () {
                    });
                    lvs.BindTmpl("#cn.crsplan.pagecard", $('#PageEditVCard').css("z-index", "2").addClass("EditMode").html(""), token, idxid, curdata.outlines[vpageidx], function () {
                    });
                }
            });
            $(vpagebox).find(".VPageItemSel").click();
            return this;
        }
    });
})(jQuery);
