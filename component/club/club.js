//比赛数据
(function (jQuery) {
    jQuery.fn.extend({
        lvs_club_match: function (token, idxid, curdata) {
            var mbox = $(this);
            $(mbox).find(".MatchListItem").bind("click", function (e) {
                if ($(e.target).attr("lvs_elm") == "GamesDef")
                    location.href = "games.htm?id=" + $(e.target).attr("idxid");
                else if ($(e.target).attr("lvs_elm") == "TeamDef")
                    location.href = "teammain.htm?id=" + $(e.target).attr("idxid");
                else if (curdata.hasOwnProperty("ref"))
                    location.href = curdata.ref;
            });
            $(mbox).find(".NextCursor").one("click", function () {
                var DataEng = LvsData.Create();
                var getparams = { access_token: token, gettype: curdata.gettype, cursor: curdata.nextcursor, count: curdata.count || 20 };
                if (curdata.hasOwnProperty("idxkey"))
                    getparams[curdata.idxkey] = idxid;
                if (curdata.hasOwnProperty("idxkey2"))
                    getparams[curdata.idxkey2] = curdata.idxid;
                var nextbox = $(this);
                DataEng.GetData("leag/match_list", $(nextbox).html(""), getparams, function (apiname, params, result) {
                    $(nextbox).removeClass("NextCursor").loadcomponent($(nextbox).attr("cnname"), token, idxid, result, function () {
                    });
                });
            });
            $(document).bind("scroll", function () {
                if ($(mbox).find(".NextCursor").size() > 0 && $(mbox).find(".NextCursor").is(":visible")) {
                    var viewH = $(document).height(), contentH = $(window).height(), scrollT = $(document).scrollTop();
                    var scrollres = viewH - contentH - scrollT;
                    if (scrollres < 80) {
                        $(document).unbind("scroll");
                        $(mbox).find('.NextCursor').click();
                    }
                }
            });

            return this;
        }
    });
})(jQuery);

//球队数据
(function (jQuery) {
    jQuery.fn.extend({
        lvs_club_teamlist: function (token, idxid, curdata) {
            var mbox = $(this);
            $(mbox).find("[lvs_elm=TeamDef]").bind("click", function (e) {
                if( curdata.listref != "" && curdata.listref != undefined )
                    location.href = curdata.listref.replace("$ID", $(this).attr("idxid"));
                else
                    location.href = "teammain.htm?id=" + $(this).attr("idxid");
            });
            return this;
        }
    });
})(jQuery);
//球队管理内容
(function (jQuery) {
    jQuery.fn.extend({
        lvs_team_base: function (token, idxid, curdata) {
            var tbox = $(this);
            $(tbox).find("[lvs_elm=EditItem]").bind("click", function (e) {
                var bindbox = $(this);
                var teamid = curdata.id;
                var formdata = { token: token, idxid: curdata.id, idxkey: $(this).attr("lvs_bind"), idxval: $(this).parent().getbind($(this).attr("lvs_bind")), idxname: $(this).attr("idxname"), idxtype: $(this).attr("idxtype"), idxserial: $(this).attr("idxserial") };
                $('body').formdialog( formdata, function(curbt, curbox){
                    var updparams = { access_token: token, teamid: teamid, opetype: "TeamUpd." + formdata.idxkey, updval: $(curbox).getbind(formdata.idxkey) };
                    lvsdata.GetData("leag/team_set", $(curbt), updparams, function( apiname, params, result ){
                        $('body').closedialog();
                        var setdata = {};
                        setdata[ formdata.idxkey] = result.updval || params.updval;
                        $(bindbox).parent().SetData( curdata, setdata );
                    });
                });
            });
            return this;
        }
    });
})(jQuery);

//比赛数据
(function (jQuery) {
    jQuery.fn.extend({
        lvs_club_gamesmatch: function (token, idxid, curdata) {
            var mbox = $(this);
            $(mbox).find("[lvs_elm=GamesSel]").bind("click", function (e) {
                var curgmid = $(this).attr("idxid");
                $(mbox).find(".GamesBoxSel").removeClass("GamseBoxSel");
                $(this).find(".GamesBox").addClass("GamesBoxSel");
                $(mbox).find(".MatchListItem").each(function(){
                    if( $(this).attr("panelid") == curgmid )
                        $(this).css("display", "" );
                    else
                        $(this).css("display", "none");
                });
                var gmdata = {};
                var dataidx = $(this).attr("dataidx");
                $(mbox).find("[lvs_elm=GamesInfo]").css("display","").SetData(gmdata, { "gamesname": curdata.gameses[dataidx].name, "begdate": curdata.gameses[dataidx].begintime, "idxid": curdata.gameses[dataidx].id, "item": curdata.gameses[dataidx].item });
            });
            $(mbox).find("[lvs_elm=MatchDef]").bind("click", function( e ){
                if( curdata.listref != "" && curdata.listref != undefined )
                    location.href = curdata.listref.replace("$ID", $(this).attr("idxid"));
                else
                    location.href = "matchview.aspx?id=" + $(this).attr("idxid");
            });
            $(mbox).find("[lvs_elm=GoGames]").bind("click", function(){
                if( curdata.gamesref != "" && curdata.gamesref != undefined )
                    location.href = curdata.gamesref.replace("$ID", $(this).attr("idxid"));
                else
                    location.href = "gamesview.aspx?id=" + $(this).attr("idxid");
            });
            return this;
        }
    });
})(jQuery);

//球员管理内容
(function (jQuery) {
    jQuery.fn.extend({
        lvs_club_member: function (token, idxid, curdata) {
            var mbox = $(this);
            $(mbox).find("[lvs_elm=MemShow]").bind("click", function (e) {
                var memdata = curdata.mems[$(this).attr("dataidx")];
                $('#FlexContainer').lvstoggle(function(){
                    lvsdata.GetData("rich/card_list", $('#FlexContainer').html(""), { access_token: token, idxid: idxid, membid: memdata.id, gettype: "Card.Base"}, function(apiname, params, result){
                        $('#FlexContainer').loadcomponent("cn.rcard.membinfo", token, idxid, result, function(){
                        });
                    });
                });
            });
            return this;
        }
    });
})(jQuery);

//球员数据
(function (jQuery) {
    jQuery.fn.extend({
        lvs_teammember: function (token, idxid, curdata) {
            var mbox = $(this);
            $(mbox).find("[lvs_elm=MemberDef]").bind("click", function (e) {
                var dataidx = $(this).attr("dataidx");
                $('#MemberForm').loadtmpl("cn.club.teammember", "#MemberShowTmpl", curdata.members[dataidx], function(){
                    $('body').unidialog( "#MemberForm", { token: token, idxid: idxid }, function( curbt, curbox ){
                        if( $(curbt).attr("ttype") == "Quit" ){
                            var DataEng = LvsData.Create();
                            DataEng.GetData( "leag/member_set", $(curbt), { access_token: token, membid: $(curbt).attr("idxid"), opetype: "Status", status: "退出" }, function( apiname, params, result ){
                                curdata.outs.push( curdata.members[dataidx] );
                                curdata.members.splice( dataidx, 1 );
                                $('body').closedialog();
                                $(mbox).parent().loadcomponent( "cn.club.teammember", token, idxid, curdata, function(){
                                });
                            });
                        }
                        else if( $(curbt).attr("ttype") == "More" )
                            location.href = "../lvsleag/card.htm?mid=" + $(curbt).attr("idxid");
                        else{
                            $('body').closedialog();
                        }
                    });
                });
            });
            $(mbox).find("[lvs_elm=MemberOut]").bind("click", function (e) {
                var dataidx = $(this).attr("dataidx");
                $('#MemberForm').loadtmpl("cn.club.teammember", "#MemberOutTmpl", curdata.outs[dataidx], function(){
                    $('body').unidialog( "#MemberForm", { token: token, idxid: idxid }, function( curbt, curbox ){
                        if( $(curbt).attr("ttype") == "Back" ){
                            var DataEng = LvsData.Create();
                            DataEng.GetData( "leag/member_set", $(curbt), { access_token: token, membid: $(curbt).attr("idxid"), opetype: "Status", status: "正常" }, function( apiname, params, result ){
                                curdata.members.push( curdata.outs[dataidx] );
                                curdata.outs.splice( dataidx, 1 );
                                $('body').closedialog();
                                $(mbox).parent().loadcomponent( "cn.club.teammember", token, idxid, curdata, function(){
                                });
                            });
                        }
                        else{
                            $('body').closedialog();
                        }
                    });
                });
            });
            return this;
        }
    });
})(jQuery);

//球员排名数据
(function (jQuery) {
    jQuery.fn.extend({
        lvs_club_membranks: function (token, idxid, curdata) {
            var mbox = $(this);
            var goaldata = {headnum: 3, trigger:"listsel", list:[] };
            for( var i = 0; i < curdata.goals.length; i ++){
                goaldata.list.push({id: curdata.goals[i].id, name: curdata.goals[i].membname, image: curdata.goals[i].image, headdesc: curdata.goals[i].clonum, num: curdata.goals[i].statnum, isself: curdata.goals[i].isself||0});
            }
            var assidata = {headnum: 3, trigger:"listsel", list:[] };
            for( var i = 0; i < curdata.assis.length; i ++){
                assidata.list.push({id: curdata.assis[i].id, name: curdata.assis[i].membname, image: curdata.assis[i].image, headdesc: curdata.assis[i].clonum, num: curdata.assis[i].statnum, isself: curdata.assis[i].isself||0});
            }
            $(mbox).find("[lvs_elm=GoalList]").loadcomponent("cn.list.ranklist", token, idxid, goaldata, function(){
            });
            $(mbox).find("[lvs_elm=AssiList]").loadcomponent("cn.list.ranklist", token, idxid, assidata, function(){
            });
            $(mbox).bind("listsel", function(){
            });
            return this;
        }
    });
})(jQuery);

//比赛报名数据
(function (jQuery) {
    jQuery.fn.extend({
        lvs_matmemlist: function (token, idxid, curdata) {
            var mbox = $(this);
            $(mbox).find("[lvs_elm=MatStatus]").bind("click", function (e) {
                var curbt = $(this);
                var DataEng = LvsData.Create();
                DataEng.GetData("leag/match_set", $(this), {access_token: token, matchid: idxid, membid: $(this).attr("idxid"), opetype: "MatMem", status: $(this).attr("sta")}, function(apiname, params, result ){
                    if( params.status=='报名' ){
                        if( params.membid<0)
                            location.reload();
                        else
                            $(curbt).attr("sta", "取消").removeClass("border-green").addClass("border-red").text("撤销" );
                    }
                    else{
                        $(curbt).attr("sta", "报名").removeClass("border-red").addClass("border-green").text("报名" );
                    }
                });
            });
            $(mbox).find("[lvs_elm=JoinTeam]").click(function(){
                $('#OperateForm').loadtmpl("cn.club.matmemlist", "#JoinMemberTmpl", curdata, function(){
                    $('body').unidialog( "#OperateForm", { token: token, idxid: idxid}, function( curbt, curbox ){
                        var DataEng = LvsData.Create();
                        DataEng.GetData("leag/member_set", $(curbt), { access_token: token, curteam: $(curbt).attr("idxid"), memberid: $(curbox).getbind("membname"), clonum: $(curbox).getbind("clonum"), piclist: $(curbox).getbind("membimg" ), opetype: "Join" }, function(apiname, params, result ){
                            location.reload();
                        });
                    });
                });
            });
            return this;
        }
    });
})(jQuery);

//球队签到页
(function (jQuery) {
    jQuery.fn.extend({
        lvs_club_teamcheck: function (token, idxid, curdata) {
            var mbox = $(this);
            return this;
        }
    });
})(jQuery);


//荣誉墙数据
(function (jQuery) {
    jQuery.fn.extend({
        lvs_club_honor: function (token, idxid, curdata) {
            var mbox = $(this);
            $(mbox).find("[lvs_elm=HonorDef]").bind("click", function (e) {
                var dataidx = $(this).attr("dataidx");
                var honordata = curdata.list[dataidx];
                $('#ShowForm').loadtmpl( "cn.club.honors", "#ShowHonorTmpl", honordata, function(){
                    $('#ShowForm').attr("title", "详细信息" );
                    $('body').unidialog( "#ShowForm", { token: token, idxid: idxid}, function( curbt, curbox ){
                        if( $(curbt).attr("lvs_elm") == "AddGmmemb" ){
                            var DataEng = LvsData.Create();
                            DataEng.GetData("leag/games_set", $(curbt), { access_token: token, opetype:"AddGmMember", gamesid: $(curbt).attr("idxid"), membid: idxid }, function( apiname, params, result ){
                                honordata.gmmembs.push({membid: idxid, membname: curdata.membname});
                                honordata.ismemb = 1;
                                $(curbox).loadtmpl( "cn.club.honors", "#ShowHonorTmpl", honordata, function(){
                                    $(curbox).find(".FormCancel").click(function(){
                                        $('body').closedialog();
                                    });
                                });
                            });
                        }
                    });
                });
            });
            return this;
        }
    });
})(jQuery);
