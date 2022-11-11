//班级组件DEMO
(function (jQuery) {
    jQuery.fn.extend({
        lvs_cls_demo: function (token, idxid, curdata) {
            var clsbox = $(this);
            $(clsbox).SetData(curdata, { id: 1, showlesn: 1, showtch: 1, showdtl: 1, showcot: 1, sdesc: "这里是关于班级的描述内容", isself: 1 });
            curdata.lesns = [{ id: 1, title: "测试班级第一节课程", time: "2022-7-6 9:00", status: "正常" }, { id: 2, title: "测试班级第二节课程", time: "2022-7-7 9:00", status: "正常" }, { id: 3, title: "测试班级第三节课程", time: "2022-7-8 9:00", status: "正常"}];
            curdata.tchinfo = { id: 1, name: "李老师", desc: "高级教师" };
            curdata.cots = [{ id: 2, name: "刘老师", desc: "高级教师" }, { id: 1, name: "吴老师", desc: "副高级教师"}];
            return this;
        }
    });
})(jQuery);

//班级详细介绍组件
(function (jQuery) {
    jQuery.fn.extend({
        classbasedesc: function (token, idxid, curdata) {
            var descbox = $(this);
            return this;
        }
    });
})(jQuery);

//课题项目类型组件
(function (jQuery) {
    jQuery.fn.extend({
        lvs_topicclass: function (token, idxid, curdata) {
            var clsbox = $(this);
            $(clsbox).find("[lvs_elm=EditTopicCls]").click(function(){
                $(clsbox).find('.EditContainer').hide(300);
                $(clsbox).find('[lvs_bind=EditContainer]').show(300, function () {
                    $(this).find("[perheit]").each(function () {
                        $(this).css("height", parseInt($(this).width()) * parseInt($(this).attr("perheit")) / 100);
                    });
                });
                $(clsbox).find('[lvs_elm=EditCancel]').one("click", function () {
                    $(clsbox).find('.EditContainer').hide(300);
                    $(clsbox).find('[lvs_bind=ShowContainer]').show(300);
                });
                $(clsbox).find('[lvs_elm=EditOk]').one("click", function () {
                    var DataEng = LvsData.Create();
                    DataEng.GetData("leag/class_set", $(this), { access_token: token, classid: curdata.topic.id, classname: $(clsbox).getbind("UpdTeamName"), clsdesc: encodeURI($(clsbox).getbind("UpdTeamDesc")), clsimg: $(clsbox).getbind('TeamImg'), opetype: "ManUpd" }, function (apiname, params, result) {
                        curdata.topic.name = params.classname;
                        curdata.topic.sdesc = $(clsbox).getbind("UpdTeamDesc");
                        $(clsbox).parent().loadcomponent( "cn.cls.topiccls", token, idxid, curdata, function(){
                        });
                    });
                });
            });
            $(clsbox).find("[lvs_elm=DisposeTopicTeam]").click(function(){
                $('body').unidialog("#DisposeForm", {token: token, idxid: idxid}, function (curbt, curbox) {
                    var DataEng = LvsData.Create();
                    DataEng.GetData("leag/class_set", $(curbt), { access_token: token, classid: curdata.topic.id, status: "结束", opetype: "Status" }, function (apiname, params, result) {
                        $('body').closedialog();
                        location.reload();
                    });
                }, { dlgwidth: 30 });
            });
            $(clsbox).find("[lvs_elm=DelTeacher]").click(function(){
                $('body').unidialog("#DelTeacherForm", {token: token, idxid: idxid}, function (curbt, curbox) {
                    var DataEng = LvsData.Create();
                    DataEng.GetData("leag/class_set", $(curbt), { access_token: token, classid: curdata.topic.id, opetype: "SetTeacher", ttype:"tch" }, function (apiname, params, result) {
                        $('body').closedialog();
                        location.reload();
                    });
                }, { dlgwidth: 40 });
            });
            $(clsbox).find("[lvs_elm=AddRem]").click(function(){
                $('body').unidialog("#AddRemForm", {token: token, idxid: idxid}, function (curbt, curbox) {
                    var DataEng = LvsData.Create();
                    DataEng.GetData("common/remark_set", $(curbt), { access_token: token, arttype: "topiccls", artid: curdata.topic.id, opetype: "AddRem", remscore: $(curbox).getbind("remscore"), remarktext: $(curbox).getbind("reminfo") }, function (apiname, params, result) {
                        $('body').closedialog();
                        var tips = ErrorTip.Create();
                        tips.Show("提交成功", function(){
                            location.reload();
                        });
                    });
                }, { dlgwidth: 60 });
            });
            
            $(clsbox).find("[lvs_elm=StudStatus]").click(function(){
                var setsta = $(this).attr("sta");
                var setstud = $(this).attr("idxid");
                var tipinfo = "";
                if (setsta == "离开")
                    tipinfo = "确定移除学员" + $(this).attr("idxname") + "吗？";
                else if (setsta == "拒绝")
                    tipinfo = "确定要拒绝学员" + $(this).attr("idxname") + "的加入申请吗？";
                else if (setsta == "正常")
                    tipinfo = "确定要审核通过学员" + $(this).attr("idxname") + "的加入申请吗？";
                var dlgdata = { tipinfo: tipinfo, cursta: setsta };
                if( $('#OperateForm').size() == 0 )
                    $('body').append( "<div class=\"BaseForm\" id=\"OperateForm\" style=\"display:none\"></div>" );
                $('#OperateForm').loadtmpl("cn.cls.topiccls", "#QuitStudTmpl", dlgdata, function(){
                    console.log( $('#OperateForm').html());
                    $('body').unidialog("#OperateForm",{token: token, idxid: idxid, dlgwidth: 40}, function (curbt, curbox) {
                        var DataEng = LvsData.Create();
                        DataEng.GetData("leag/stud_set", $(curbt), { access_token: token, studid: setstud, opetype: "Status", status: setsta }, function (apiname, params, result) {
                            for( var i = 0; i < curdata.topic.studs.length; i ++ ){
                                if( curdata.topic.studs[i].id == setstud ){
                                    if( setsta == "离开" || setsta == "拒绝" )
                                        curdata.topic.studs.splice( i, 1 );
                                    else
                                        curdata.topic.studs[i].status = setsta;
                                    break;
                                }
                            }
                            $('body').closedialog();
                            $(clsbox).parent().loadcomponent( "cn.cls.topiccls", token, idxid, curdata, function(){
                            });
                        });
                    });
                });
            });
            return this;
        }
    });
})(jQuery);

//项目校按周显示组件
(function (jQuery) {
    jQuery.fn.extend({
        lvs_cls_week: function (token, idxid, curdata) {
            var clsbox = $(this);
            $(clsbox).find("[lvs_elm=SchoolSel]").bind("click", function(){
                $(clsbox).find(".SchoolBoxSel").removeClass("SchoolBoxSel");
                $(this).find(".SchoolBox").addClass("SchoolBoxSel");
                var curselid = $(this).attr("dataidx");
                $(clsbox).find(".SelPanel").css("display", "none");
                $(clsbox).find("[panelid=" + curselid + "]").fadeIn( 500 );
            });
            $(clsbox).find("[lvs_elm=ClassDef]").bind("click", function(){
                if( curdata.listref != "" && curdata.listref != undefined )
                    location.href = curdata.listref.replace( "$ID", $(this).attr("idxid"));
            });
            return this;
        }
    });
})(jQuery);

//项目化项目管理显示
(function (jQuery) {
    jQuery.fn.extend({
        lvs_teamclass: function (token, idxid, curdata) {
            var clsbox = $(this);
            curdata.list = curdata.modules;
            curdata.listtrigger = "listsel";
            if( curdata.modules.length == 0 )
                curdata.list.push({id: 0, sname: "缺省课程阶段"});
            for( var i = 0; i < curdata.list.length; i ++){
                curdata.list[i].seqid = curdata.list[i].id;
                if( curdata.curmodule && curdata.curmodule == curdata.list[i].sname || !curdata.curmodule && i == 0 )
                    curdata.list[i].isdef = 1;
            }
            for( var i = 0; i < curdata.lesns.length; i ++ ){
                for(var j = 0; j < curdata.list.length; j ++ ){
                    if( curdata.lesns[i].modseq == curdata.list[j].id ){
                        if( curdata.list[j].sub == undefined )
                            curdata.list[j].sub = [];
                        curdata.list[j].sub.push({id: curdata.lesns[i].id, sname: curdata.lesns[i].title, type: curdata.lesns[i].type, seqid: curdata.lesns[i].seqid, tipnum: curdata.lesns[i].taskingnum, ansnum: curdata.lesns[i].ansnum, resnum: curdata.lesns[i].resnum, exhnum: curdata.lesns[i].exhnum, tipname: "已提交任务数", trigger: "subsel"});
                        isfind = 1;
                        break;
                    }
                }
            }
            curdata.expted = 1;
            if( curdata.lesn )
                curdata.defidx = curdata.lesn;
            $(clsbox).find("[lvs_elm=ClsLesnList]").loadcomponent("cn.list.explist", token, idxid, curdata, function(){
            });
            $(clsbox).bind("listsel", function(e, modseq, modidx){
                lvsdata.GetData("leag/class_list", $(clsbox).find("[lvs_elm=ClsLesnInfoBox]").html(""), { access_token: token, classid: curdata.id, gettype: "Class.TeamStat", islesn: 1, seq: 1, estudid: idxid, modseq: modseq, module: curdata.modules[modidx].sname }, function( apiname, params, result ){
                    result.params = params;
                    $(clsbox).find("[lvs_elm=ClsLesnInfoBox]").loadcomponent( "cn.lesn.lesngrouppanel", token, idxid, result, function(){
                    });
                });
            });
            $(clsbox).bind("subsel", function( e, lesnid, dataidx1, dataidx2 ){
                $(clsbox).find("[lvs_elm=ClsLesnInfoBox]").loadcomponent( "cn.lesn.lesntabs", token, idxid, curdata.list[dataidx1].sub[dataidx2], function(){
                    if( $(clsbox).find("[lvs_elm=LesnTab]").size() > 0)
                        $(clsbox).find("[lvs_elm=LesnTab]").find(".active").click();
                });
            });
            /*
            $(clsbox).find("[lvs_elm=LesnItem]").click(function( e ){
                    $(clsbox).find(".StudItemSel").removeClass("StudItemSel");
                    $(clsbox).find(".LesnItemSel").removeClass("LesnItemSel" );
                    $(this).addClass("LesnItemSel");
                    var curidx = $(this).attr("dataidx");
                    if( curidx < curdata.lesns.length ){
                        if( curdata.type == "项目" )
                            curdata.lesns[curidx].tasknames = [{name: "项目阶段说明", id: "ProjPlan"},{name: "项目任务目标", id: "TaskReq"},{name: "项目任务执行", id: "TaskIng"},{name: "项目任务评审", id: "TaskCheck"}];
                        else if(curdata.istch>0||curdata.iscot>0)
                            curdata.lesns[curidx].tasknames = [{name: "课程讲义", id: "PlayPlan"},{name: "任务执行进展", id: "TaskExec"},{name: "任务交流", id: "TaskBlog"}];
                        else
                            curdata.lesns[curidx].tasknames = [{name: "课程学习", id: "PlayPlan"},{name: "项目任务", id: "TaskExec"},{name: "项目交流", id: "TaskBlog"}];
                        lvs.BindTmpl("#cn.lesn.pbllesn", $(clsbox).find('#LesnInfoBox').html(""), token, idxid, curdata.lesns[curidx], function(){
                        });
                    }
            });*/
            $(clsbox).find("[lvs_elm=ShowResp]").click(function(){
                var curlesn = $(this).attr("idxid");
                var curidx = -1;
                $(clsbox).find("[lvs_elm=LesnItem]").each(function(){
                    if( curdata.lesns[$(this).attr("dataidx")].id == curlesn){
                        $(this).addClass("LesnItemSel");
                        curidx = $(this).attr("dataidx");
                    }
                });
                if( curidx < curdata.lesns.length && curidx >= 0 ){
                    if( curdata.type == "项目" )
                        curdata.lesns[curidx].tasknames = [{name: "项目阶段说明", id: "ProjPlan"},{name: "项目任务目标", id: "TaskReq"},{name: "项目任务执行", id: "TaskIng"},{name: "项目任务评审", id: "TaskCheck"}];
                        else if(curdata.istch>0||curdata.iscot>0)
                            curdata.lesns[curidx].tasknames = [{name: "课程讲义", id: "PlayPlan"},{name: "任务执行进展", id: "TaskExec"},{name: "任务交流", id: "TaskBlog"}];
                        else
                            curdata.lesns[curidx].tasknames = [{name: "课程学习", id: "PlayPlan"},{name: "项目任务", id: "TaskExec"},{name: "项目交流", id: "TaskBlog"}];
                    curdata.lesns[curidx].curtask = "TaskExec";
                    lvs.BindTmpl("#cn.lesn.pbllesn", $(clsbox).find('#LesnInfoBox').html(""), token, idxid, curdata.lesns[curidx], function(){
                    });
                }
            });
            $(clsbox).find("[lvs_elm=StudItem]").click(function(){
                $(clsbox).find(".LesnItemSel").removeClass("LesnItemSel");
                $(this).addClass("StudItemSel");
                if( curdata.studs != undefined){
                    $(clsbox).find('#LesnInfoBox').html("").loadcomponent( "cn.stud.projstudstat", token, idxid, curdata, function(){
                    });
                }
                else{
                    lvsdata.GetData("leag/class_list", $(clsbox).find('#LesnInfoBox').html(""), { access_token: token, classid: curdata.id, gettype: "Class.StudList" },function( apiname, params,result ){
                        curdata.studs = result.studs;
                        $(clsbox).find('#LesnInfoBox').html("").loadcomponent( "cn.stud.projstudstat", token, idxid, curdata, function(){
                        });
                    });
                }
            });
            $(clsbox).find("[lvs_elm=JoinGroup]").click(function(){
                lvsdata.GetData("leag/lesn_list", $(this), { access_token: token, classid: curdata.id, gettype: "Lesn.Groups"}, function( apiname, params, result ){
                    $(clsbox).find("#JoinGrpForm").loadtmpl( "cn.lesn.lesngrps", "#JoinGroupTmpl", result, function(){
                        $('body').unidialog( "#JoinGrpForm", { token: token, idxid: idxid }, function( curbt, curbox ){
                            lvsdata.GetData("leag/lesn_set", $(curbt), { access_token: token, classid: curdata.id, opetype: "JoinProjGroup", groupid: $(curbt).attr("idxid"), groupname: $(curbox).getbind("groupname")}, function( apiname, params, result){
                                $('body').closedialog();
                                lvs.LvsRout( "topicteam", token, idxid, curdata.id );
                            });
                        });
                    });
                });
            });
            $(clsbox).find("[lvs_elm=CrtGroup]").click(function(){
                $('body').unidialog( "#CrtGrpForm", { token: token, idxid: idxid }, function( curbt, curbox ){
                    lvsdata.GetData("leag/lesn_set", $(curbt), { access_token: token, classid: curdata.id, opetype: "JoinProjGroup", groupname: $(curbox).getbind("groupname")}, function( apiname, params, result){
                        $('body').closedialog();
                        lvs.LvsRout( "topicteam", token, idxid, curdata.id );
                    });
                });
            });
            $(clsbox).find("[lvs_elm=EditTeam]").click(function(){
                $('body').unidialog( "#EditTeamForm", { token: token, idxid: idxid }, function( curbt, curbox ){
                    lvsdata.GetData("leag/class_set", $(curbt), { access_token: token, classid: curdata.id, opetype: "MinUpdate", classname: $(curbox).getbind("classname")}, function( apiname, params, result ){
                        $('body').closedialog();
                        $(clsbox).setbind("classname", params.classname);
                        curdata.name = params.name;
                    });
                });
            });
            $(clsbox).find("[lvs_elm=SelModule]").click(function(){
                $('body').unidialog("#SelModuleForm", { token: token, idxid: idxid, closing:1}, function( curbt, curbox ){
                    curdata.curmodseq = $(curbt).attr("idxid" );
                    curdata.curmodule = $(curbt).attr("idxname");
                    $('body').closedialog();
                    lvsdata.GetData("leag/class_list", $(clsbox), { access_token: token, classid: curdata.id, gettype: "Class.TeamStat", islesn: 1, seq: 1, estudid: idxid, modseq: curdata.curmodseq, module: curdata.curmodule }, function( apiname, params, result ){
                        result.curmodeseq = curdata.curmodseq;
                        result.curmodule = curdata.curmodule;
                        $(clsbox).parent().loadcomponent( "cn.cls.topicteam", token, idxid, result, function(){
                        });
                    });
                });
            });
            $('body').keyup( function( e ){
                if( e.keyCode == 37 ){//左键
                    if( $(clsbox).find(".LesnItemSel").size() == 1 ){
                        var curidx = parseInt($(clsbox).find(".LesnItemSel").attr("dataidx"));
                        if( curidx > 0 ){
                            $(clsbox).find(".LesnItem" ).each(function(){
                                if( $(this).attr("dataidx") == curidx - 1 )
                                    $(this).click();
                            });
                        }
                        else if( curidx == 0 ){
                            $(clsbox).find("[lvs_elm=StudItem]").click();
                        }
                    }
                }
                else if( e.keyCode == 39 ){//右
                    var curidx = 0;
                    if( $(clsbox).find(".LesnItemSel").size() == 1 )
                        curidx = parseInt($(clsbox).find(".TaskStepItemSel").attr("dataidx")) + 1;
                    else
                        curidx = 0;
                    $(clsbox).find(".LesnItem" ).each(function(){
                        if( $(this).attr("dataidx") == curidx )
                            $(this).click();
                    });
                }
            });
            return this;
        }
    });
})(jQuery);

//班级列表通用方法
(function (jQuery) {
    jQuery.fn.extend({
        lvs_cls_classlist: function (token, idxid, curdata) {
            var clsbox = $(this);
            var tchid = (idxid<0?0-idxid:0);
            $(clsbox).find("[lvs_elm=JoinCls]").bind("click", function(){
                var clsid = $(this).attr("idxid");
                $('body').unidialog( "#StudJoinForm", { token: token, idxid: idxid}, function( curbt, curbox ){
                    lvsdata.GetData("leag/stud_set", $(this), { access_token: token, estudid: idxid, studname: $(curbox).getbind("studname"), classid: clsid, opetype: "ShotAdd" }, function( apiname, params, result){
                        if( curdata.clstype=="课题" ){
                            var tips = ErrorTip.Create();
                            tips.Show("已申请加入课题组，等待负责人审批", function(){
                                $('body').closedialog();
                                Lvs.LvsRout("topicteam", token, idxid, params.classid );
                            });
                        }
                        else{
                            $('body').closedialog();
                            lvs.LvsRout("clsinfo",token, idxid, params.classid );
                        }
                    });
                });
            });
            $(clsbox).find("[lvs_elm=AddRepCls]").click(function(){
                $('body').unidialog( "#AddTopicClsForm", { token:token, idxid:idxid}, function( curbt, curbox ){
                    lvsdata.GetData("leag/class_set", $(curbt), lvsdata.GetParams({ access_token: token, courseid: curdata.id, islesn: 1, teacher: tchid, opetype: "ShotAdd"}, $(curbox)), function( apiname, params, result ){
                        $('body').closedialog();
                        lvs.LvsRout("tabfresh", token, idxid, "[lvs_elm=CrsClassTab]");
                    });
                });
            });
            $(clsbox).find("[lvs_elm=ShowClsStud]").click(function(){
                lvsdata.GetData("leag/class_list", $(this), { access_token: token, classid: $(this).attr("idxid"), gettype: "Class.StudList" }, function( apiname, params, result ){
                    $('#ShowInfoForm').loadtmpl("cn.course.crsclass", "#ClsStudListTmpl", result, function(){
                        $('body').unidialog( "#ShowInfoForm", { token: token, idxid: idxid}, function( curbt, curbox ){
                            $('body').closedialog();
                            lvs.LvsRout( "tchstud", token, idxid, params.classid );
                        });
                    });
                });
            });
            $(clsbox).find("[lvs_elm=ShowClsLesn]").click(function(){
                var showbox = $(this);
                lvsdata.GetData("leag/class_list", $(this), { access_token: token, classid: $(this).attr("idxid"), lesning: 1, gettype: "Class.Lesns" }, function( apiname, params, result ){
                    if( result.modules == undefined )
                        resunt.modules = [{sid: 0, id: "缺省", name: "缺省" }];
                    if( result.modules.length == 0 )
                        result.modules.push( { sid: 0, id: "缺省", name: "缺省"});
                    for( var i = 0; i < result.modules.length; i ++ ){
                        for( var j = 0; j< result.lesns.length; j ++ ){
                            if( result.modules[i].sid == result.lesns[j].modseq && (result.modules[i].name == result.lesns[j].module || result.modules[i].sid == 0)){
                                if( result.modules[i].sub == undefined )
                                    result.modules[i].sub = [];
                                result.modules[i].sub.push( result.lesns[j] );
                            }
                        }
                    }
                    $('#ShowInfoForm').loadtmpl("cn.course.crsclass", "#ClsLesnListTmpl", result, function(){
                        $('body').unidialog( "#ShowInfoForm", { token: token, idxid: idxid}, function( curbt, curbox ){
                            if( $(curbt).attr("opetype") == "showinfo" ){
                                $('body').closedialog();
                                lvs.LvsRout( "tchclass", token, idxid, params.classid );
                            }
                            else if( $(curbt).attr("opetype") == "locklesn" ){
                                if( $(curbt).attr("islock") == 1 ){ 
                                    lvsdata.GetData("leag/lesn_set", $(curbt), { access_token: token, lesnid: $(curbt).attr("idxid"), opetype: "Status", status: "正常"}, function(apiname, params, result ){
                                        $(curbt).attr("islock", 0 ).attr("src", "../../Image/isopen.png" ).attr("title", "开放状态，学生可查看，点击锁定");
                                    });
                                }
                                else{
                                    lvsdata.GetData("leag/lesn_set", $(curbt), { access_token: token, lesnid: $(curbt).attr("idxid"), opetype: "Status", status: "锁定"}, function(apiname, params, result ){
                                        $(curbt).attr("islock", 1 ).attr("src", "../../Image/islock.png" ).attr("title", "锁定状态，学生不可查看，点击解锁");
                                    });
                                }
                            }
                            else if( $(curbt).attr("opetype") == "lockmodule" ){
                                if( $(curbt).attr("islock") == 1 ){ 
                                    lvsdata.GetData("leag/lesn_set", $(curbt), { access_token: token, lesnid: $(curbt).attr("idxid"), opetype: "ModStatus", status: "正常"}, function(apiname, params, result ){
                                        $(curbt).closest(".ModuleBox").find("[opetype=lockmodule],[opetype=locklesn]").attr("islock", 0 ).attr("src", "../../Image/isopen.png" ).attr("title", "开放状态，学生可查看，点击锁定");
                                    });
                                }
                                else{
                                    lvsdata.GetData("leag/lesn_set", $(curbt), { access_token: token, lesnid: $(curbt).attr("idxid"), opetype: "ModStatus", status: "锁定"}, function(apiname, params, result ){
                                        $(curbt).closest(".ModuleBox").find("[opetype=lockmodule],[opetype=locklesn]").attr("islock", 1 ).attr("src", "../../Image/islock.png" ).attr("title", "锁定状态，学生不可查看，点击解锁");
                                    });
                                }
                            }
                            else if( $(curbt).attr("opetype") == "lesnmore" ){
                                $(curbox).find("[lvs_elm=MoreLesn]").css("display","");
                            }
                            else if( $(curbt).attr("opetype") == "replesn" ){
                                var tmpls = $(curbox).getbind("replesns");
                                if( tmpls == "" || tmpls == undefined){
                                    ErrorTip.Create().Show("请选择需要发布的课程");
                                }
                                else{
                                    lvsdata.GetData("leag/lesn_set", $(curbt), { access_token: token, classid: params.classid, opetype: "ManAdd", tmpllist: tmpls }, function( apiname, params, result ){
                                        ErrorTip.Create().Show("已成功发布" + result.id + "节课程", function(){
                                            $('body').closedialog();
                                            $(showbox).text( parseInt( $(showbox).text() ) + parseInt( result.id ));
                                        });
                                    });
                                }
                            }
                        });
                    });
                });
            });
            return this;
        }
    });
})(jQuery);

//班级中学员列表及统计数据
(function (jQuery) {
    jQuery.fn.extend({
        lvs_class_studs: function (token, idxid, curdata) {
            var clsbox = $(this);
            var tchid = idxid < 0 ? 0 - idxid : 0;
            $(clsbox).find("[lvs_elm=SelClass]").change(function(){
                var clsid = $(this).val();
                curdata.classid = clsid;
                for( var i = 0; i < curdata.classes.length; i ++ ){
                    if( curdata.classes[i].id == clsid ){
                        curdata.classname = curdata.classes[i].name;
                        break;
                    }
                }
                lvsdata.GetData("leag/class_list", $(clsbox).find("[lvs_elm=StudInfoPanel]").html(""), { access_token: token, classid: clsid, gettype: "Class.StudStat" }, function( apiname, params,result ){
                    curdata.studs = result.studs;
                    $(clsbox).find("[lvs_elm=StudInfoPanel]").loadcomponent( "cn.stud.clsstudstat", token, idxid, result, function(){
                    });
                });
            });
            $(clsbox).find("[lvs_elm=AddClsStud]").click(function(){
                $('body').unidialog("#AddClsStudForm", {token, idxid}, function( curbt, curbox ){
                    if($(curbt).attr("opetype") =="SearchStud"){
                        if( $(curbox).getbind("studkey") == "" ){
                            lvsdata.GetData("leag/class_list", $('.CurClick'), { access_token: token, teacher: tchid, gettype: "Class.BaseSeq"}, function( apiname, params, result ){
                                $(curbox).find("[lvs_elm=SearchRes]").loadcomponent("cn.cls.baseclsstuds", token, idxid, result, function(){
                                });
                            });
                        }
                        else{
                            lvsdata.GetData("leag/stud_list", $('.CurClick'), { access_token: token, tchid: tchid, classid: curdata.id, gettype: "EStud.Key", studkey: $(curbox).getbind("studkey")}, function(apiname, params, result ){
                                result.colnum = 5;
                                $(curbox).find("[lvs_elm=SearchRes]").loadcomponent("cn.stud.estudsel", token, idxid, result, function(){
                                });
                            });
                        }
                    }
                    else if( $(curbt).attr("opetype") == "AddStudOk"){
                        var studlist = $(curbox).getbind("studlist");
                        if( $(curbox).getbind("studmode") == 1 && studlist == "" ){
                            ErropTip.Create().Show("请先查找学生并选择学生");
                        }
                        else if( $(curbox).getbind("studmode") == 3 && $(curbox).getbind("studname") == "" ){
                            ErropTip.Create().Show("请输入学生姓名等信息");
                        }
                        else{
                            lvsdata.GetData("leag/stud_set", $(curbt), { access_token: token, classid: curdata.classid, opetype: "ShotAdd", studlist: studlist, studname: $(curbox).getbind("studname"), lvlid: $(curbox).getbind("lvlid"), classseq: $(curbox).getbind("classseq"), studno: $(curbox).getbind("studno"), userreg: 1}, function( apiname, params, result ){
                                $('body').closedialog();
                                $(clsbox).find("[lvs_elm=SelClass]").change();
                            });
                        }
                    }
                });
            });
            $(clsbox).find("[lvs_elm=DelClsStud]").click(function(){
                $('body').unidialog("#DelClsStudForm", { token, idxid, studs: curdata.studs}, function( curbt, curbox ){
                    var studlist = $(curbox).getbind("studlist");
                    if( studlist == "" ){
                        ErrorTip.Create().Show("请先选择需要删除的学员" );
                    }
                    else{
                        lvsdata.GetData("leag/stud_set", $(curbt), { access_token: token, classid: curdata.classid, opetype: "ShotDel", studlist: studlist }, function(apiname, params, result){
                            $('body').closedialog();
                            $(clsbox).find("[lvs_elm=SelClass]").change();
                        });
                    }
                });
            });
            $(clsbox).find("[lvs_elm=UpdClsName]").click(function(){
                $('#UpdClsForm').loadtmpl( "cn.cls.clsstuds", "#UpdClsNameTmpl", curdata, function(){
                    $('body').unidialog("#UpdClsForm", { token, idxid},function(curbt, curbox ){
                        lvsdata.GetData( "leag/class_set", $(curbt), { access_token: token, classid: curdata.classid, opetype: "MinUpdate", classname: $(curbox).getbind("classname" )}, function( apiname, params, result ){
                            for( var i = 0; i < curdata.classes.length; i ++ ){
                                if( curdata.classes[i].id == curdata.classid ){
                                    curdata.classes[i].name = params.classname;
                                    $(clsbox).find("[lvs_elm=SelClass]").find("option").eq(i).text( params.classname + "(" + curdata.classes[i].studnum + "人)");
                                    break;
                                }
                            }
                            $('body').closedialog();
                        });
                    });
                });
            });
            return this;
        }
    });
})(jQuery);
//选择班级
(function (jQuery) {
    jQuery.fn.extend({
        lvs_cls_selclass: function (token, idxid, curdata) {
            var clsbox = $(this);
            $(this).find("[lvs_elm=PrepareCrs]").click(function(){
                lvs.LvsRout("crstmpls", token, idxid, $(this).attr("idxid"));
            });
            $(clsbox).find(".TagItem").click(function(){
                $(clsbox).find(".TagActive").removeClass("TagActive" );
                $(this).addClass("TagActive");
                $(clsbox).trigger( curdata.chgtrigger||"selchange", [ $(this).attr("idxid" ) ] );
            });
        }
    });
})(jQuery);
//基础班级中的学员选择
(function (jQuery) {
    jQuery.fn.extend({
        lvs_cls_basestud: function (token, idxid, curdata) {
            var clsbox = $(this);
            var tchid = idxid < 0 ? 0-idxid: 0;
            $(clsbox).find(".TagItem").click(function(){
                $(clsbox).find(".TagActive").removeClass("TagActive");
                $(this).addClass("TagActive");
                var lvlid = curdata.levels[$(this).attr("dataidx").split(',')[0]].id;
                var schid = curdata.levels[$(this).attr("dataidx").split(',')[0]].schoolid;
                var seqid = curdata.levels[$(this).attr("dataidx").split(',')[0]].seqs[$(this).attr("dataidx").split(',')[1]].id;
                lvsdata.GetData("leag/stud_list", $(clsbox).find("[lvs_elm=BaseStuds]").html(""), { access_token: token, gettype: "EStud.SeqList", teacherid: tchid, schoolid: schid, lvlid: lvlid, classseq: seqid}, function( apiname, params, result ){
                    $(clsbox).find("[lvs_elm=StudOpe]").show();
                    result.isedit = curdata.isedit;
                    $(clsbox).find("[lvs_elm=BaseStuds]").loadcomponent("cn.stud.estudsel", token, idxid, result, function(){
                    });
                });
            });
            $(clsbox).find("[lvs_elm=AddBaseStud]").click(function(){
                var dataidx = $(clsbox).find(".TagActive").attr("dataidx");
                if( dataidx == undefined || dataidx == "" ){
                    ErrorTip.Create().Show("请先选择需要操作的班级");
                    return;
                }
                var lvlid = curdata.levels[dataidx.split(',')[0]].id;
                var schid = curdata.levels[dataidx.split(',')[0]].schoolid;
                var seqid = curdata.levels[dataidx.split(',')[0]].seqs[dataidx.split(',')[1]].id;
                $('body').unidialog( "#AddBaseStudForm", { token, idxid}, function( curbt, curbox ){
                    lvsdata.GetData("leag/stud_set", $(curbt), { access_token: token, estudid: idxid, studname: $(curbox).getbind("studname"), studno: $(curbox).getbind("studno"), userreg: 1, opetype: "ShotAdd", schoolid: schid, lvlid: lvlid, classseq: seqid}, function( apiname, params, result ){
                        $('body').closedialog();
                        $(clsbox).find(".TagActive").click();
                    });
                });
            });
            $(clsbox).find("[lvs_elm=DelBaseStud]").click(function(){
                var studlist = "";
                var studs = [];
                $(clsbox).find("[lvs_bind=studlist]").find(".MultSelected").each(function(){
                    if( studlist != "" )
                        studlist += ",";
                    studlist += $(this).attr("idxid");
                    studs.push({id: $(this).attr("idxid"), studno: $(this).attr("studno"), name: $(this).attr("idxname")});
                });
                if( studlist == "" ){
                    ErrorTip.Create().Show("请先选择需要删除的学生进行操作");
                    return;
                }
                $("#DelBaseStudForm").loadtmpl( "cn.cls.baseclsstuds", "#DelStudTmpl", { studs: studs}, function(){
                    $('body').unidialog( "#DelBaseStudForm", { token, idxid}, function(curbt, curbox ){
                        lvsdata.GetData("leag/stud_set", $(curbt), { access_token: token, teacher: tchid, opetype: "EStudDel", studlist: studlist }, function( apiname, params, result ){
                            $('body').closedialog();
                            $(clsbox).find(".TagActive").click();
                        });
                    });
                });
            });
            $(clsbox).find("[lvs_elm=UpdBaseStud]").click(function(){
                var studlist = "";
                var studs = [];
                $(clsbox).find("[lvs_bind=studlist]").find(".MultSelected").each(function(){
                    if( studlist != "" )
                        studlist += ",";
                    studlist += $(this).attr("idxid");
                    studs.push({id: $(this).attr("idxid"), classseq: $(this).attr("seqid"), studno: $(this).attr("studno"), name: $(this).attr("idxname")});
                });
                if( studlist == "" ){
                    ErrorTip.Create().Show("请先选择需要修改的学生进行操作");
                    return;
                }
                $("#UpdBaseStudForm").loadtmpl( "cn.cls.baseclsstuds", "#UpdStudTmpl", { studs: studs}, function(){
                    $('body').unidialog( "#UpdBaseStudForm", { token, idxid}, function(curbt, curbox ){
                        studlist = "";
                        $(curbox).find(".StudItem").each(function(){
                            if( studlist != "" )
                                studlist += "|";
                            studlist += $(this).attr("idxid") + "," + encodeURIComponent( $(this).getbind("studname") ) + "," + $(this).getbind("studseq") + "," + $(this).getbind("studno" );
                        });
                        lvsdata.GetData("leag/stud_set", $(curbt), { access_token: token, teacher: tchid, opetype: "EStudUpd", studlist: studlist }, function( apiname, params, result ){
                            $('body').closedialog();
                            $(clsbox).find(".TagActive").click();
                        });
                    });
                });
            });
            $(clsbox).find("[lvs_elm=UpdStudPass]").click(function(){
                var studlist = "";
                var studs = [];
                $(clsbox).find("[lvs_bind=studlist]").find(".MultSelected").each(function(){
                    if( studlist != "" )
                        studlist += ",";
                    studlist += $(this).attr("idxid");
                    studs.push({id: $(this).attr("idxid"), classseq: $(this).attr("seqid"), studno: $(this).attr("studno"), name: $(this).attr("idxname")});
                });
                if( studlist == "" ){
                    ErrorTip.Create().Show("请先选择需要修改的学生进行操作");
                    return;
                }
                $("#UpdBaseStudForm").loadtmpl( "cn.cls.baseclsstuds", "#UpdStudPassTmpl", { studs: studs}, function(){
                    $('body').unidialog( "#UpdBaseStudForm", { token, idxid}, function(curbt, curbox ){
                        lvsdata.GetData("leag/stud_set", $(curbt), { access_token: token, teacher: tchid, opetype: "EStudPass", studlist: studlist, updpass: $(curbox).getbind("updpass") }, function( apiname, params, result ){
                            $('body').closedialog();
                            ErrorTip.Create().Show("已重置完毕" );
                        });
                    });
                });
            });
            return this;
        }
    });
})(jQuery);

//班级中学员列表及统计数据
(function (jQuery) {
    jQuery.fn.extend({
        lvs_class_lesns: function (token, idxid, curdata) {
            var clsbox = $(this);
            curdata.crses = [];
            for( var i = 0; i < curdata.classes.length; i ++ ){
                var isfind = 0;
                for( var j = 0; j < curdata.crses.length; j ++ ){
                    if( curdata.classes[i].courseid == curdata.crses[j].id ){
                        isfind = 1;
                        curdata.crses[j].clses.push({clsid: curdata.classes[i].id, lvlid: curdata.classes[i].lvlid, lvlname: curdata.classes[i].lvlname, classseq: curdata.classes[i].classseq, dataidx: i});
                        break;
                    }
                }
                if( isfind == 0 ){
                    curdata.crses.push({ id: curdata.classes[i].courseid, crsname: curdata.classes[i].coursename, clses: [{clsid: curdata.classes[i].id, lvlid: curdata.classes[i].lvlid, lvlname: curdata.classes[i].lvlname, classseq: curdata.classes[i].classseq, dataidx: i}] });
                }
            }
            $(clsbox).bind("selchange",function(e,clsid){
                curdata.classid = clsid;
                lvsdata.GetData("leag/lesn_list", $(clsbox).find("[lvs_elm=LesnInfoPanel]").html(""), { access_token: token, classid: clsid, gettype: "Lesn.LesnStat" }, function( apiname, params, result ){
                    $(clsbox).find("[lvs_elm=LesnInfoPanel]").loadcomponent("cn.cls.clslesnstat", token, idxid, result,function(){
                    });
                });
            });
            $(clsbox).find("[lvs_elm=CheckTask]").bind("click", function(){
                var lesnid = $(this).attr("lesnid");
                var curclick = $(this);
                lvsdata.GetData("leag/task_list", $('.CurClick'), { access_token: token, gettype: "Task.LesnAns", lesnid: lesnid, role: "TchStud", roleid: 0-idxid }, function (apiname, params, result) {
                    for (var i = 0; i < result.tasks.length; i++) {
                        if (result.tasks[i].tasktype == 'Plan' && (result.tasks[i].status == '新建' || result.tasks[i].status == '' || result.tasks[i].status == '草稿')) {
                            try {
                                result.tasks[i].taskitem = $.parseJSON(decodeURIComponent(result.tasks[i].ansdesc));
                            }
                            catch (err) {
                                result.tasks[i].ansdesc = decodeURIComponent(result.tasks[i].ansdesc);
                            }
                        }
                        else if( result.tasks[i].tasktype != "PlanB" && result.tasks[i].tasktype!= "RTask")
                            result.tasks[i].taskitem = $.parseJSON(decodeURIComponent(result.tasks[i].ansdesc));
                        else if (result.tasks[i].tasktype == 'Plan')
                            result.tasks[i].ansdesc = decodeURIComponent(result.tasks[i].ansdesc);
                    }
                    $('body').unidialog( "#CheckTaskForm", { token: token, idxid: idxid, data: result}, function( curbt, curbox ){
                        var resscore = $(curbox).find("[lvs_bind=TaskScore]").find(".Selected").attr("idxid");
                        if (resscore > 0) {
                            lvsdata.GetData("leag/lesn_set", $(curbt), { access_token: token, opetype: "TaskCheck", lesnid: lesnid, studid: result.tasks.length>0?result.tasks[0].studid:-1, checkscore: resscore }, function (apiname, params, result) {
                                var tips = ErrorTip.Create();
                                tips.Show("批改完成");
                                $('body').closedialog();
                                $(curclick).closest("tr").find("[lvs_bind=ChkingTask]").text( result.chkingtask );
                                if( result.chkingtask > 0 )
                                    $(curclick).click();
                            });
                        }
                    });
                    $('body').bind("dialogclose",function(){
                        if( swf2js != undefined )
                            swf2js.stopaudio();
                    });
                });
            });
            return this;
        }
    });
})(jQuery);

//班级中学员列表及统计数据
(function (jQuery) {
    jQuery.fn.extend({
        lvs_cls_tchtask: function (token, idxid, curdata) {
            var clsbox = $(this);
            curdata.crses = [];
            for( var i = 0; i < curdata.classes.length; i ++ ){
                var isfind = 0;
                for( var j = 0; j < curdata.crses.length; j ++ ){
                    if( curdata.classes[i].courseid == curdata.crses[j].id ){
                        isfind = 1;
                        curdata.crses[j].clses.push({clsid: curdata.classes[i].id, lvlid: curdata.classes[i].lvlid, lvlname: curdata.classes[i].lvlname, classseq: curdata.classes[i].classseq, dataidx: i});
                        break;
                    }
                }
                if( isfind == 0 ){
                    curdata.crses.push({ id: curdata.classes[i].courseid, crsname: curdata.classes[i].coursename, clses: [{clsid: curdata.classes[i].id, lvlid: curdata.classes[i].lvlid, lvlname: curdata.classes[i].lvlname, classseq: curdata.classes[i].classseq, dataidx: i}] });
                }
            }
            if( $(clsbox).find(".TagActive").size() == 0 )
                $(clsbox).find(".TagItem").eq(0).click();
            $(clsbox).bind("selchange", function(e, clsid ){
                for( var i = 0; i < curdata.classes.length; i ++ ){
                    if( clsid == curdata.classes[i].id ){
                        curdata.classid = clsid;
                        curdata.classtype = curdata.classes[i].type;
                    }
                }
                if( clsid > 0 ){
                    lvsdata.GetData("leag/lesn_list", $(clsbox).find("[lvs_elm=ClsCrsTmplList]").html(""), { access_token: token, classid: clsid, stattype: "tasking", gettype: "Lesn.ModuleLesns"}, function( apiname, params, result ){
                        var clsdata = { list: []};
                        for( var i = 0; i < result.modules.length; i ++ ){
                            if( result.modules[i].module == "" )
                                result.modules[i].module = "缺省";
                            var moddata = { id: result.modules[i].module, sname: result.modules[i].module, sub:[]};
                            for(var j = 0; j < result.modules[i].sub.length; j ++ ){
                               moddata.sub.push({id: result.modules[i].sub[j].id, sname: result.modules[i].sub[j].title, type: result.modules[i].sub[j].type, seqid: result.modules[i].sub[j].seqid, tipnum: result.modules[i].sub[j].tasknum, tipname: "提交作业/任务数量", ansnum: result.modules[i].sub[j].ansnum,resnum: result.modules[i].sub[j].resnum,exhnum: result.modules[i].sub[j].exhnum, trigger: "lesnsel"});
                            }
                            //if( curdata.curmodule && curdata.curmodule == result.modules[i].module || !curdata.curmodule && i == 0 )
                                //moddata.isdef = 1;
                            clsdata.list.push( moddata );
                        }
                        clsdata.expted = 1;
                        clsdata.listtrigger = "listsel";
                        $(clsbox).find("[lvs_elm=ClsCrsTmplList]").loadcomponent("cn.list.explist", token, idxid, clsdata, function(){
                        });
                    });
                }
            });
            $(clsbox).find("[lvs_elm=ClassSel]").change(function(){
                var clsid = $(this).val();
            });
            $(clsbox).find("[lvs_elm=ClassSel]").change();
            $(clsbox).bind("listsel", function(e, module, modidx){
                lvsdata.GetData("leag/class_list", $(clsbox).find("[lvs_elm=ClsCrsTmplBox]").html(""), { access_token: token, classid: curdata.classid, gettype: "Class.TeamStat", islesn: 1, seq: 1, estudid: idxid, module: module }, function( apiname, params, result ){
                    result.params = params;
                    $(clsbox).find("[lvs_elm=ClsCrsTmplBox]").loadcomponent( "cn.lesn.lesngrouppanel", token, idxid, result, function(){
                    });
                });
            });
            $(clsbox).bind("lesnsel", function(e,lesnid, dataidx1, dataidx2){
                $(clsbox).find("[lvs_elm=ClsCrsTmplBox]").loadcomponent("cn.lesn.lesntasks", token, idxid, {id: lesnid, classtype: curdata.classtype }, function(){
                    if( $(clsbox).find("[lvs_elm=ClsCrsTmplBox]").find("[tabdef=1]").size() > 0 )
                        $(clsbox).find("[lvs_elm=ClsCrsTmplBox]").find("[tabdef=1]").click();
                });
            });
            return this;
        }
    });
})(jQuery);
