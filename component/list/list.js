//二级展开列表列表
(function (jQuery) {
    jQuery.fn.extend({
        lvs_list_demo: function (token, idxid, curdata) {
            var listbox = $(this);
            curdata.baselist = [{ id: 1, title: "测试数据一", seqid: 1, isdef: 0, basetrigger: "selok" }, { id: 2, title: "测试数据二", seqid: 2, isdef: 0, basetrigger: "selok" }, { id: 3, title: "测试数据三", seqid: 3, isdef: 0, basetrigger: "selok"}];
            $(this).bind("selok", function (evt, resid, restitle) {
                alert("选择了：" + resid + "-" + restitle);
            });
            curdata.explist = [{ id: 1, sname: "测试项目一", sub: [{ id: 11, sname: "子项目11" }, { id: 12, sname: "子项目12"}] }, { id: 2, sname: "测试项目二", sub: [{ id: 21, sname: "子项目21" }, { id: 22, sname: "子项目22"}] }, { id: 3, sname: "测试项目三", sub: [{ id: 31, sname: "子项目31" }, { id: 32, sname: "子项目32" }, { id: 33, sname: "子项目33" }, { id: 34, sname: "子项目34"}]}];
            $(this).bind("itemsel", function (evt, resid, resname) {
                alert("选择了：id=" + resid + ", sname=" + resname);
            });
            curdata.imglist = [{ image: "images/demo1.jpg" }, { image: "images/demo2.jpg" }, { image: "images/demo3.jpg" }, { image: "images/demo4.jpg" }, { image: "images/demo5.jpg" }, { image: "images/demo6.jpg" }, { image: "images/demo7.png" }, { image: "images/demo8.png" }, { image: "images/demo9.png"}];
            $(listbox).find("[lvs_elm=SelImgNum]").find(".Selecting").click(function () {
                $(listbox).find("[lvs_elm=SelImgNum]").find(".Selected").removeClass("Selected");
                $(this).addClass("Selected");
                var curnum = parseInt($(this).attr("idxid"));
                var newlist = { images: [] };
                for (var i = 0; i < curnum; i++) {
                    newlist.images.push({ image: curdata.imglist[i].image });
                }
                $(listbox).find("[lvs_elm=ImgList]").loadcomponent("cn.list.imggrid", token, idxid, newlist, function () {
                });
            });
            curdata.siglist = [{ image: "images/demo1.jpg", title: "样板内容标题1", time: "2022-7-5", num: 121 }, { image: "images/demo2.jpg", title: "样板内容标题2", time: "2022-7-5", num: 121 }, { image: "images/demo3.jpg", title: "样板内容标题3", time: "2022-7-6", num: 123}]
            curdata.cols = 3;
            curdata.margintop = 12;
            curdata.flexlist = [{ id: 1, image: "images/demo1.jpg", title: "测试内容标题1", status: "新建", desc: "描述本内容标题", opes: [{ name: "修改", trigger: "update", butclass: "button", butstyle: "border-green" }, { name: "删除", trigger: "delete", butclass: "button", butstyle: "border-red"}] }, { id: 2, image: "images/demo2.jpg", title: "测试内容标题2", status: "学习中", desc: "描述本内容标题" }, { id: 3, image: "images/demo3.jpg", title: "测试内容标题3", status: "考察", desc: "描述本内容标题" }, { id: 4, image: "images/demo4.jpg", title: "测试内容标题4", status: "新建", desc: "描述本内容标题" }, { id: 5, image: "images/demo5.jpg", title: "测试内容标题5", status: "新建", desc: "描述本内容标题"}];
            return this;
        }
    });
})(jQuery);



//二级展开列表列表
(function (jQuery) {
    jQuery.fn.extend({
        lvsexplist: function (token, idxid, curdata) {
            var listbox = $(this);
            $(listbox).find(".ExpListHead").click(function (e) {
                if( !curdata.listtrigger || $(e.target).hasClass("ExpHeadBody") == false ){
                    if( $(this).hasClass("Expanding") ){
                        $(this).removeClass("Expanding").addClass("Expanded");
                        $(this).parent().find(".ExpListBody").show( 300 );
                    }
                    else{
                        $(this).removeClass("Expanded").addClass("Expanding");
                        $(this).parent().find(".ExpListBody").hide( 500 );
                    }
                }
                if( curdata.listtrigger || $(e.target).hasClass("ExpHeadBody") ){
                    $(listbox).find(".ExpSubListItemSel").removeClass("ExpSubListItemSel");
                    $(listbox).find(".ExpListSel").removeClass("ExpListSel");
                    $(this).addClass("ExpListSel");
                }
                if( curdata.listtrigger && $(e.target).hasClass("ExpHeadBody"))
                    $(listbox).trigger(curdata.listtrigger,[$(this).attr("idxid"), $(this).attr("dataidx")]);
            });
            $(listbox).find(".ExpSubListItem").click(function(){
                $(listbox).find(".ExpSubListItemSel").removeClass("ExpSubListItemSel");
                $(listbox).find(".ExpListSel").removeClass("ExpListSel");
                $(this).addClass("ExpSubListItemSel");
                if( curdata.hasOwnProperty( "trigger" ) )
                    $(listbox).trigger(curdata.trigger, [ $(this).attr("idxid"), $(this).attr("idxname")]);
                if( $(this).attr("trigger") != undefined )
                    $(listbox).trigger( $(this).attr("trigger"), [$(this).attr("idxid"), $(this).attr("dataidx").split(',')[0], $(this).attr("dataidx").split(',')[1]] );
            });
            if( curdata.defidx ){
                $(listbox).find(".ExpSubListItem").each(function(){
                    if( $(this).attr("idxid") == curdata.defidx )
                        $(this).click();
                });
            }
            if( $(listbox).find(".ExpListSel").size() > 0 ){
                $(listbox).find(".ExpListSel").each(function(){
                    if( curdata.listtrigger )
                        $(listbox).trigger(curdata.listtrigger,[$(this).attr("idxid"), $(this).attr("dataidx")]);
                });
            }
            $(listbox).find("[lvs_elm=AddList]").click(function(){
                $(listbox).trigger("addlist", []);
            });
            if( curdata.subedit ){
                $(listbox).find(".ExpSubListItem").mouseenter(function(){
                    $(this).find("[lvs_elm=SubEdit]").show();
                });
                $(listbox).find(".ExpSubListItem").mouseleave(function(){
                    $(this).find("[lvs_elm=SubEdit]").hide();
                });
                $(listbox).find("[lvs_elm=SubEdit]").click(function(){
                    $(listbox).trigger(curdata.subedit, [ $(this).attr("dataidx").split(',')[0], $(this).attr("dataidx").split(',')[1] ]);
                });
            }
            if( curdata.listedit ){
                $(listbox).find(".ExpListHead").mouseenter(function(){
                    $(this).find("[lvs_elm=ListEdit]").show();
                });
                $(listbox).find(".ExpListHead").mouseleave(function(){
                    $(this).find("[lvs_elm=ListEdit]").hide();
                });
                $(listbox).find("[lvs_elm=ListEdit]").click(function(){
                    $(listbox).trigger(curdata.listedit, [ $(this).attr("dataidx") ]);
                });
            }
            return this;
        },
        getexpselid: function(){
            if( $(this).find(".ExpSubListItemSel").size() == 0)
                return undefined;
            else
                return $(this).find(".ExpSubListItemSel").attr("idxid");
        },
        getlistidx: function(){
            if( $(this).find(".ExpListSel").size() > 0 )
                return $(this).find(".ExpListSel").attr("dataidx");
            else if( $(this).find(".ExpSubListItemSel").size() > 0 )
                return $(this).find(".ExpSubListItemSel").attr("dataidx" );
            else
                return undefined;
        }
    });
})(jQuery);

//选择列表
(function (jQuery) {
    jQuery.fn.extend({
        lvssellist: function (token, idxid, curdata) {
            var listbox = $(this);
            $(listbox).find(".SelListItem").click(function () {
                if( curdata.multsel > 0 ){
                    if( $(this).hasClass("SelListItemSel") )
                        $(this).removeClass("SelListItemSel");
                    else
                        $(this).addClass("SelListItemSel");
                }
                else{
                    if( $(listbox).closest(".SelBox").size() > 0 )
                        $(listbox).closest(".SelBox").find(".SelListItemSel").removeClass("SelListItemSel");
                    else
                        $(listbox).find(".SelListItemSel").removeClass("SelListItemSel");
                    $(this).addClass("SelListItemSel");
                }
            });
            return this;
        },
        getselid: function(){
            if( $(this).find(".SelListItemSel").size() == 0 )
                return undefined;
            else
                return $(this).find(".SelListItemSel").attr("idxid");
        }
    });
})(jQuery);

//单列列表
(function (jQuery) {
    jQuery.fn.extend({
        lvssiglist: function (token, idxid, curdata) {
            var listbox = $(this);
            return this;
        }
    });
})(jQuery);

//排行榜列表
(function (jQuery) {
    jQuery.fn.extend({
        lvs_morelist: function (token, idxid, curdata) {
            var listbox = $(this);
            $(listbox).find("[headref]").bind("click", function(){
                var opes = $(this).attr("headref").split('.');
                if( opes[0] == "toggle" ){
                    $('#ShowContainer').lvstoggle( function(){
                        var Lvs = LvsCore.Create();
                        Lvs.BindTmpl("#" + opes[1], $('#ShowContainer').html(""), token, idxid, curdata, function(){
                        });
                    });
                }
            });
            $(listbox).find(".ListItem").bind("click", function(){
                if( curdata.listref != "" && curdata.listref != undefined)
                    location.href = curdata.listref.replace( "$ID", $(elm).attr("idxid") );
            });
            $(listbox).find(".SlideItem").bind("click", function(){
                if( curdata.listref != "" && curdata.listref != undefined)
                    location.href = curdata.listref.replace( "$ID", $(elm).attr("idxid") );
            });
            return this;
        }
    });
})(jQuery);

//基本列表操作
(function (jQuery) {
    jQuery.fn.extend({
        lvs_baselist: function (token, idxid, curdata) {
            var listbox = $(this);
            $(listbox).find("[lvs_elm=ListItem]").bind("click", function(evt){
                $(listbox).find(".BaseListItemSel").removeClass("BaseListItemSel" );
                $(this).addClass("BaseListItemSel" );
                if( $(evt.target).attr("linkurl") != undefined )
                    location.href = $(evt.target).attr("linkurl");
                else if($(evt.target).attr("trigger") != undefined )
                    $(listbox).trigger( $(evt.target).attr("trigger"), [ $(evt.target).attr("idxid"), $(evt.target).attr("idxname") ] );
                else if($(this).attr("trigger") != undefined ){
                    var curevt = $(this).attr("trigger");
                    $(listbox).trigger( curevt, [ $(this).attr("idxid"), $(this).attr("idxname") ] );
                }
            });
            $(listbox).find(".BaseListItemSel").click();
            return this;
        }
    });
})(jQuery);

//排行榜列表操作
(function (jQuery) {
    jQuery.fn.extend({
        lvs_list_ranklist: function (token, idxid, curdata) {
            var listbox = $(this);
            if( curdata.trigger ){
                $(listbox).find("[lvs_elm=SelItem]").click(function(){
                    $(listbox).trigger(curdata.trigger, [$(this).attr("idxid"), $(this).attr("dataidx")]);
                });
            }
            return this;
        }
    });
})(jQuery);

//图片九宫格列表
(function (jQuery) {
    jQuery.fn.extend({
        lvsimggrid: function (token, idxid, curdata) {
            var imgbox = $(this);
            $(imgbox).find("[lvs_elm=ImageGrid]").each(function(){
                if( curdata.images.length>1){
                    $(this).css("height", $(this).width() );
                    var boxwidth = $(this).width();
                    $(this).find("img").load(function(){
                        var imgwid = $(this).width();
                        var imgheit = $(this).height();
                        if( imgwid > imgheit ){
                            $(this).css({"margin-left": 0 - (imgwid - imgheit) * imgwid / imgheit / 2, "height": boxwidth, "width": boxwidth * imgwid / imgheit} );
                        }
                        else if( imgwid < imgheit ){
                            $(this).css({"margin-top": 0 - (imgheit - imgwid) * imgheit / imgwid / 2, "width": boxwidth, "height": boxwidth * imgheit / imgwid} );
                        }
                    });
                }
            });
            $(imgbox).find("[lvs_elm=ImageGrid]").click(function(){
                if( $('#OperateForm').size() == 0 )
                    $('body').append("<div class=\"BaseForm\" id=\"OperateForm\" style=\"display:none\"></div>");
                $('#OperateForm').html("<img class=\"FormCancel\" width=\"100%\" src=\"" + $(this).find("img").attr("src") + "\"/>");
                $('body').unidialog( "#OperateForm", { token: token, idxid: idxid}, function( curbt, curbox ){
                });
            });
            return this;
        }
    });
})(jQuery);

//历史记录查看列表
(function (jQuery) {
    jQuery.fn.extend({
        lvs_histories: function (token, idxid, curdata) {
            var hisbox = $(this);
            $(hisbox).find("[lvs_elm=GetMore]").click(function () {
                $(hisbox).find("[lvs_elm=HeadHist]").fadeOut(300);
                lvsdata.GetData("common/serials", $('[lvs_elm=MoreHist]').css("display", "").html(""),{ access_token: token, gettype: "Histories", estudid: idxid, count: 60 }, function( apiname, params, result ){
                    $(hisbox).find('[lvs_elm=MoreHist]').loadtmpl( "cn.list.histories", "#MoreHistTmpl", result, function(){
                        $(hisbox).find('[lvs_elm=MoreHist]').lvsclick(token, idxid, curdata);
                    });
                }); 
            });
            return this;
        }
    });
})(jQuery);

