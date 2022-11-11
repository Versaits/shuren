//卡组件
(function (jQuery) {
    jQuery.fn.extend({
        lvs_playercard: function (token, idxid, curdata) {
            var cardbox = $(this);
            setTimeout(function () {
                $(cardbox).find(".RCardBox").css("width", $(window).width()).css("height", $(window).height());
                $(cardbox).find("[lvs_elm=CardMainImg]").css("display", "").fadeIn(500, function () {
                    var imgwid = $(this).width() * $(window).height() / $(this).height();
                    if (imgwid >= $(window).width())
                        $(this).animate({ top: 0, left: ($(window).width() - imgwid) / 2, height: $(window).height(), width: imgwid }, 500);
                    else {
                        var imgheit = $(this).height() * $(window).width() / $(this).width();
                        $(this).animate({ top: ($(window).height() - imgheit) / 2, left: 0, height: imgheit, width: $(window).width() }, 500);
                    }
                });
            }, 300);
            $(cardbox).find("[lvs_elm=FormInfo]").bind("click", function () {
                $('body').unidialog("#" + $(this).attr("dest"), { token: token, idxid: idxid }, function (curbt, curbox) {

                });
            });
            $(cardbox).find("[lvs_elm=MembInfo]").bind("click", function () {
                $('#NextContainer').lvstoggle(function () {
                    $('#NextContainer').loadcomponent("cn.rcard.membinfo", token, idxid, curdata, function () {
                    });
                });
            });
            $(cardbox).find("[lvs_elm=ShareIt]").click(function(){
                if( $('[lvs_elm=CardMainImg]').width() > $('[lvs_elm=CardMainImg]').height() * 1080 / 1720 )
                    curdata.img = { left: parseInt(0 - ($('[lvs_elm=CardMainImg]').width() * 1720 / $('[lvs_elm=CardMainImg]').height() - 1080) / 2) + "px",top: 0, width: parseInt($('[lvs_elm=CardMainImg]').width() * 1720 / $('[lvs_elm=CardMainImg]').height()) + "px",height: "1720px" };
                else
                    curdata.img = { left: 0, top: parseInt(0 - ($('[lvs_elm=CardMainImg]').height() * 1080 / $('[lvs_elm=CardMainImg]').width() - 1720) / 2) + "px", width: "1080px", height: parseInt($('[lvs_elm=CardMainImg]').height() * 1080 / $('[lvs_elm=CardMainImg]').width()) + "px"};
                $('[lvs_elm=PrintCard]').loadcomponent( "cn.rcard.printcard", token, idxid, curdata, function(){
                    html2canvas( $('[lvs_elm=PrintCard]')[0], {allowTaint: true,useCORS: true} ).then( canvas =>{
                        var dataUrl = canvas.toDataURL("image/png");
                        if( $("#OperateForm").size() == 0 )
                            $('body').append( "<div class=\"BaseForm\" id=\"OperateForm\" style=\"display:none\"></div>");
                        $('#OperateForm').html("<img width=\"100%\" src=\"" + dataUrl + "\"/>");
                        $('body').unidialog( "#OperateForm", { token: token, idxid: idxid}, function( curbt, curbox){
                        });
                    });
                });
            });
            return this;
        }
    });
})(jQuery);

//球员信息组件
(function (jQuery) {
    jQuery.fn.extend({
        lvs_rcard_membinfo: function (token, idxid, curdata) {
            var cardbox = $(this);
            setTimeout(function () {
                $(cardbox).find("[lvs_elm=MembMainImg]").css("display", "").fadeIn(500, function () {
                    var imgwid = $(this).width() * ($(window).height()*40/100) / $(this).height();
                    if (imgwid >= $(window).width())
                        $(this).animate({ top: 0, left: ($(window).width() - imgwid) / 2, height: $(window).height() * 40 / 100 , width: imgwid }, 500);
                    else {
                        var imgheit = $(this).height() * $(window).width() / $(this).width();
                        $(this).animate({ top: ($(window).height() * 40 / 100 - imgheit) / 2, left: 0, height: imgheit, width: $(window).width() }, 500);
                    }
                });
            }, 300);
            setTimeout(function(){
                $(cardbox).find('[defbox=1]').click();
            }, 8000);
            $(cardbox).find("[lvs_elm=ShowMatchInfo]").click(function(){
                $(cardbox).find(".ContainerBox").css("display", "none");
                $(cardbox).find("[lvs_elm=MatchListBox]").fadeIn(500);
                var DataEng = LvsData.Create();
                DataEng.GetData( "leag/match_list", $(cardbox).find("[lvs_elm=MatchListBox]").html(""), { access_token: token, membid: curdata.membid, cardid: idxid, gettype: "Match.Grow", cursor: 0, count: 20 }, function( apiname, params, result ){
                    $(cardbox).find("[lvs_elm=MatchListBox]").loadcomponent( "cn.club.membmatchs", token, idxid, result, function(){
                    });
                });
            });
            $(cardbox).find("[lvs_elm=ShowLesnInfo]").click(function(){
                $(cardbox).find(".ContainerBox").css("display", "none");
                $(cardbox).find("[lvs_elm=LesnListBox]").fadeIn(500);
                var DataEng = LvsData.Create();
                DataEng.GetData( "leag/memb_list", $(cardbox).find("[lvs_elm=LesnListBox]").html(""), { access_token: token, membid: curdata.membid, cardid: idxid, gettype: "LesnGrow", cursor: 0, count: 20 }, function( apiname, params, result ){
                    $(cardbox).find("[lvs_elm=LesnListBox]").loadcomponent( "cn.club.memblesns", token, idxid, result, function(){
                    });
                });
            });
            $(cardbox).find("[lvs_elm=ShowHonorInfo]").click(function(){
                $(cardbox).find(".ContainerBox").css("display", "none");
                $(cardbox).find("[lvs_elm=HonorListBox]").fadeIn(500);
                var DataEng = LvsData.Create();
                DataEng.GetData( "leag/memb_list", $(cardbox).find("[lvs_elm=HonorListBox]").html(""), { access_token: token, membid: curdata.membid, cardid: idxid, gettype: "HonorGrow", cursor: 0, count: 20 }, function( apiname, params, result ){
                    result.list = result.honors;
                    result.isadd = 1;
                    $(cardbox).find("[lvs_elm=HonorListBox]").loadcomponent( "cn.club.honors", token, idxid, result, function(){
                    });
                });
            });
            $(cardbox).find("[lvs_elm=SetMembInfo]").click(function(){
                $(cardbox).find(".ContainerBox").css("display", "none");
                $(cardbox).find("[lvs_elm=InfoListBox]").fadeIn(500);
            });
            $(cardbox).find("[lvs_elm=ShowCardInfo]").click(function(){
                $(cardbox).find(".ContainerBox").css("display", "none");
                $(cardbox).find("[lvs_elm=CardInfoBox]").fadeIn(500);
            });
            $(cardbox).find("[lvs_elm=SelTeam]").click(function(){
                var selbox = $(this);
                $('body').basepanel({left: $(this).offset().left, top: $(this).offset().top + $(this).height() + 5, width: $(window).width() - $(this).offset().left - 10}, function( curbox ){
                    var itemsel = "";
                    for( var i = 0;i < curdata.teams.length; i ++ ){
                        itemsel += "<div class=\"ListItem\" idxid=\"" + curdata.teams[i].id + "\" idxname=\"" + curdata.teams[i].name + "\" dataidx=\"" + i + "\">" + curdata.teams[i].name + "</div>";
                    }
                    $(curbox).html( itemsel );
                    $(curbox).find(".ListItem").click(function(){
                        $(selbox).attr("idxid", $(this).attr("idxid")).attr("idxname", $(this).attr("idxname") );
                        $(selbox).text( $(this).text() );
                        /*其他选项内容也需要变动*/
                        var dataidx = $(this).attr("dataidx");
                        $(cardbox).find("[lvs_elm=MembInfoBox]").attr("dataidx", dataidx );
                        $(cardbox).find("[lvs_elm=MembInfoBox]").SetData( curdata, { "baseno": curdata.teams[dataidx].baseno, "birthday": curdata.teams[dataidx].birthday, "lesnbeg": curdata.teams[dataidx].lesnbeg, "lesnend":curdata.teams[dataidx].lesnstatus=='停训'?curdata.teams[dataidx].lesnend:"", "lesnstatus": curdata.teams[dataidx].lesnstatus, "weekno": curdata.teams[dataidx].weekno, "baseloc": curdata.teams[dataidx].baseloc});
                        $('body').closepanel();
                        $('body').unbind("click");
                    });
                });
            });
            $('body').unbind("click");
            $('body').bind("click", function(){
                if( $('[lvs_elm=SelTeam]:hover').size() == 0 && $('.PanelBox:hover').size() == 0 ){
                    $('body').closepanel();
                    $('body').unbind("click");
                }
            });
            $(cardbox).find(".Editable").click(function(){
                var formbox = $(this).find("[lvs_elm=FormInfo]");
                var dataidx = $(cardbox).find("[lvs_elm=MembInfoBox]").attr("dataidx");
                var formdata = { idxname: $(formbox).attr("idxname"), idxtype: $(formbox).attr("idxtype"), idxid: curdata.teams[dataidx].id, idxkey: $(formbox).attr("lvs_bind"), idxval:$(formbox).parent().getbind($(formbox).attr("lvs_bind")), idxserial: $(formbox).attr("idxserial")};
                $('body').formdialog( formdata, function(curbt, curbox ){
                    var DataEng = LvsData.Create();
                    DataEng.GetData("leag/member_set", $(curbt), { access_token: token, membid: formdata.idxid, opetype: "MembUpd." + formdata.idxkey, updval:$(curbox).getbind( formdata.idxkey )}, function( apiname, params, result ){
                        if( (formdata.idxkey == "lesnbeg" || formdata.idxkey == "lesnend" || formdata.idxkey == "weekno")){
                            if( curdata.status=='未发卡')
                                location.reload();
                            else{
                                var tips = ErrorTip.Create();
                                tips.Show("已发行卡片者修改该数据对训练次数统计没有影响" );
                            }
                        }
                        var setdata = {};
                        setdata[formdata.idxkey] = params.updval;
                        var dataidx = $(cardbox).find("[lvs_elm=MembInfoBox]").attr("dataidx");
                        if( dataidx == undefined )
                            dataidx = 0;
                        $(formbox).parent().SetData( curdata.teams[dataidx], setdata );
                        $('body').closedialog();
                    });
                });
            });
            $(cardbox).find("[lvs_elm=GetRCardVal]").click(function(){
                var DataEng = LvsData.Create();
                DataEng.GetData("rich/card_list", $(cardbox).find("[lvs_elm=RCardValBox]").html(""), { access_token: token, cardid: curdata.id, membid: curdata.membid, gettype: "Card.ValList", cursor: 0, count: 30 }, function( apiname, params, result ){
                    $(cardbox).find("[lvs_elm=RCardValBox]").loadcomponent( "cn.rcard.vallist", token, idxid, result, function(){
                    });
                });
            });
            return this;
        }
    });
})(jQuery);

//增值记录组件
(function (jQuery) {
    jQuery.fn.extend({
        lvs_rcard_vallist: function (token, idxid, curdata) {
            var cardbox = $(this);
            $(cardbox).find(".NextCursor").one("click", function () {
                var DataEng = LvsData.Create();
                var getparams = { access_token: token, gettype: "Card.ValList", cardid: curdata.id, membid: curdata.membid, cursor: curdata.nextcursor, count: curdata.count || 30 };
                var nextbox = $(this);
                DataEng.GetData("rich/card_list", $(nextbox).html(""), getparams, function (apiname, params, result) {
                    $(nextbox).removeClass("NextCursor").loadcomponent($(nextbox).attr("cnname"), token, idxid, result, function () {
                    });
                });
            });
            $(document).bind("scroll", function () {
                if ($(cardbox).find(".NextCursor").size() > 0) {
                    var viewH = $(document).height(), contentH = $(window).height(), scrollT = $(document).scrollTop();
                    var scrollres = viewH - contentH - scrollT;
                    if (scrollres < 80) {
                        $(document).unbind("scroll");
                        $(cardbox).find('.NextCursor').click();
                    }
                }
            });
            return this;
        }
    });
})(jQuery);
