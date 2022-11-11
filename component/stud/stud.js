//个人基本信息展示
(function (jQuery) {
    jQuery.fn.extend({
        lvs_stud_base: function (token, idxid, curdata) {
            var tchid = (idxid < 0) ? 0 - idxid : idxid;
            var userbox = $(this);
            $(userbox).find(".BaseEditBox").find("[lvs_bind]").bind("click", function () {
                if ($(this).attr("idxname") != undefined) {
                    var bindbox = $(this);
                    var formdata = { token: token, idxid: curdata.id, idxkey: $(this).attr("lvs_bind"), idxval: $(this).parent().getbind($(this).attr("lvs_bind")), idxname: $(this).attr("idxname"), idxtype: $(this).attr("idxtype"), idxserial: $(this).attr("idxserial") };
                    $('body').formdialog(formdata, function (curbt, curbox) {
                        var updparams = { access_token: token, estudid: idxid, custid: formdata.idxid, opetype: "UserUpd." + formdata.idxkey, updval: $(curbox).getbind(formdata.idxkey) };
                        lvsdata.GetData("customer/cust_set", $(curbt), updparams, function (apiname, params, result) {
                            $('body').closedialog();
                            var setdata = {};
                            setdata[formdata.idxkey] = result.updval || params.updval;
                            $('body').SetData(curdata, setdata);
                        });
                    });
                }
            });
            $(userbox).find("[lvs_elm=UpdPass]").click(function (e) {
                $('body').unidialog("#UpdPassForm", { token: token, idxid: idxid }, function (curbt, curbox) {
                    lvsdata.GetData("customer/cust_set", $(this), lvsdata.GetParams({ access_token: token, opetype: "Com.SetUserPass", uid: curdata.userid }, $(curbox)), function (apiname, params, result) {
                        var tips = ErrorTip.Create();
                        tips.Show("密码修改成功，请使用新密码登录", function () {
                            $('body').closedialog();
                        });
                    });
                });
            });
        }
    });
})(jQuery);

//个人基本信息展示
(function (jQuery) {
    jQuery.fn.extend({
        lvs_proj_studstat: function (token, idxid, curdata) {
            var tchid = (idxid < 0) ? 0 - idxid : idxid;
            var studbox = $(this);
            if( curdata.config != "" && curdata.config != undefined){
                curdata.config = $.parseJSON( decodeURIComponent( curdata.config ));
                $(studbox).find("[lvs_elm=ConfigStr]").html("最多分组：" + curdata.config.max + "；每组最多成员：" + curdata.config.mem + "；允许一人多组：" + (curdata.config.sig>0?"是":"否") + "；允许自建分组：" + (curdata.config.crt>0?"是":"否") + "。" );
            }
            $(studbox).find(".BaseListItem").click(function (e) {
                var dataidx = $(this).attr("dataidx");
                if( $(e.target).attr("lvs_elm") == "Remove" || $(e.target).attr("lvs_elm") == "Agree" || $(e.target).attr("lvs_elm") == "Refuse" ){
                    $('body').unidialog( "#" + $(e.target).attr("lvs_elm") + "Form", { token: token, idxid: idxid}, function( curbt, curbox ){
                        lvsdata.GetData("leag/stud_set", $(curbt), { access_token: token, studid: $(e.target).attr("idxid"), estudid: idxid, status: $(e.target).attr("lvs_elm") == "Agree"?"正常":"离开", opetype: "Status"},function( apiname, params, result ){
                            $('body').closedialog();
                            curdata.studs[dataidx].status = params.status;
                            $(studbox).parent().loadcomponent( "cn.stud.projstudstat", token, idxid, curdata, function(){
                            });
                        });
                    });
                }
                else{
                    lvsdata.GetData("leag/stud_list", $(studbox).find("[lvs_elm=StudInfo]").html(""), { access_token: token, studid: $(this).attr("idxid"), gettype: "Stud.TopicStat"}, function( apiname, params, result ){
                        $(studbox).find("[lvs_elm=StudInfo]").loadcomponent("cn.stud.topicstat", token, idxid, result, function(){
                        });
                    });
                }
            });
            $(studbox).find("[lvs_elm=AddStud]").click(function(){
                $('body').unidialog( "#AddStudForm", { token: token, idxid: idxid}, function( curbt, curbox ){
                    if( $(curbt).attr("lvs_elm") == "SearchStud" ){
                        lvsdata.GetData("leag/stud_list", $('.CurClick'), { access_token: token, tchid: tchid, classid: curdata.id, gettype: "EStud.Key", studkey: $(curbox).getbind("studkey")}, function(apiname, params, result ){
                            var pos = $(curbox).find("[lvs_bind=studkey]");
                            $('body').basepanel( {width: $(pos).width(), left: $(pos).offset().left, top: $(pos).offset().top + $(pos).height()}, function( panel ){
                                var studstr = "";
                                for(var i = 0; i < result.studs.length; i ++ ){
                                    studstr += "<div class=\"SelectItem\" idxid=\"" + result.studs[i].id + "\" idxname=\"" + result.studs[i].name + "\">" + result.studs[i].name + (result.studs[i].id<0?"老师":"(" + result.studs[i].lvlname + result.studs[i].classseq + "班)") + "</div>";
                                }
                                $(panel).html( studstr ).addClass("CurPanelBox");
                                $(panel).find(".SelectItem").click(function(){
                                    $(pos).attr("idxid", $(this).attr("idxid")).val( $(this).attr("idxname"));
                                    $('body').closepanel();
                                    $('body').unbind("click");
                                });
                            });
                            $('body').unbind("click");
                            $('body').bind("click", function(){
                                if( $('.CurPanelBox:hover').size() == 0 && $('[lvs_elm=SearchStud]:hover').size() == 0 ){
                                    $('body').closepanel();
                                    $('body').unbind("click");
                                }
                            });
                        });
                    }
                    else if( $(curbt).attr("lvs_elm") == "RegNew" ){
                        $(curbox).find("[lvs_elm=RegUserBox]").show( 300 );
                        $(curbox).find("[lvs_bind=studkey]").attr("idxid", 0).val("");
                    }
                    else if( $(curbt).attr("lvs_elm") == "AddStudOk" ){
                        if( $(curbox).getbind("studname") == "" && ($(curbox).find("[lvs_bind=studkey]").attr("idxid") == 0 || $(curbox).find("[lvs_bind=studkey]").attr("idxid") == undefined )){
                            ErropTip.Create().Show("请先查找学员并选择查找结果");
                        }
                        else{
                            lvsdata.GetData("leag/stud_set", $(curbt), { access_token: token, classid: curdata.classid, opetype: "ShotAdd", estudid: $(curbox).find("[lvs_bind=studkey]").attr("idxid"), studname: $(curbox).getbind("studname"), studlist: $(curbox).getbind("studlist"), lvlid: $(curbox).getbind("lvlid"), classseq: $(curbox).getbind("classseq"), studno: $(curbox).getbind("studno"), userreg: 1}, function( apiname, params, result ){
                                if( params.studlist != "" ){
                                    for( var i = 0; i < result.studs.length; i ++ ){
                                        curdata.studs.push({id: result.id, name: result.name, studno: result.studno||params.studno, status: result.status } );
                                    }
                                }
                                else
                                    curdata.studs.push({id: result.studid, name: result.name, studno: result.studno||params.studno, status: "正常" });
                                $('body').closedialog();
                                $(studbox).parent().loadcomponent("cn.stud.projstudstat", token, idxid, curdata, function(){
                                });
                            });
                        }
                    }
                });
            });
            $(studbox).find("[lvs_elm=QuitGroup]").click(function(){
                var groupid = $(this).attr("grpid");
                $('body').unidialog("#QuitGrpForm",{token,idxid}, function( curbt, curbox ){
                    lvsdata.GetData("leag/lesn_set", $(curbt), { access_token: token, lesnid: curdata.id, groupid: groupid, opetype: "QuitGrp" }, function( apiname, params, result ){
                        lvs.LvsRout("tabfresh", token, idxid, "[lvs_elm=LesnTab]");
                        $('body').closedialog();
                    });
                });
            });
            $(studbox).find("[lvs_elm=JoinGroup]").click(function(){
                var groupid = $(this).attr("grpid");
                $('body').unidialog("#JoinGrpForm",{token,idxid}, function( curbt, curbox ){
                    lvsdata.GetData("leag/lesn_set", $(curbt), { access_token: token, lesnid: curdata.id, groupid: groupid, opetype: "JoinGroup" }, function( apiname, params, result ){
                        lvs.LvsRout("tabfresh", token, idxid, "[lvs_elm=LesnTab]");
                        $('body').closedialog();
                    });
                });
            });
            $(studbox).find("[lvs_elm=DelGrp]").click(function(){
                var groupid = $(this).attr("grpid");
                $('body').unidialog("#DelGrpForm",{token,idxid}, function( curbt, curbox ){
                    lvsdata.GetData("leag/lesn_set", $(curbt), { access_token: token, lesnid: curdata.id, groupid: groupid, opetype: "DelGrp" }, function( apiname, params, result ){
                        lvs.LvsRout("tabfresh", token, idxid, "[lvs_elm=LesnTab]");
                        $('body').closedialog();
                    });
                });
            });
            $(studbox).find("[lvs_elm=UpdGrp]").click(function(){
                var groupid = $(this).attr("grpid");
                $('body').unidialog("#UpdGrpForm",{token,idxid}, function( curbt, curbox ){
                    lvsdata.GetData("leag/lesn_set", $(curbt), { access_token: token, lesnid: curdata.id, groupid: groupid, grpname: $(curbox).getbind("grpname"), opetype: "UpdGrp" }, function( apiname, params, result ){
                        lvs.LvsRout("tabfresh", token, idxid, "[lvs_elm=LesnTab]");
                        $('body').closedialog();
                    });
                });
            });
            $(studbox).find("[lvs_elm=ManGrp]").click(function(){
                var curgroup = curdata.groups[$(this).attr("dataidx")];
                curgroup.studs = [];
                for( var i = 0; i < curdata.studs.length; i ++ ){
                    if( curdata.studs[i].checknum>0 && curdata.config != undefined && curdata.config.sig==0 )
                        continue;
                    var ismem = 0;
                    for( var j = 0; j < curgroup.mems.length; j ++ ){
                        if( curgroup.mems[j].id == curdata.studs[i].id ){
                            ismem = 1;
                            break;
                        }
                    }
                    if( ismem >0 )
                        continue;
                    curgroup.studs.push({ id: curdata.studs[i].id, name: curdata.studs[i].name, studno: curdata.studs[i].studno, checknum: curdata.studs[i].checknum, sdesc: curdata.studs[i].sdesc});
                }
                $('#ManGrpForm').loadtmpl("cn.stud.projstudstat", "#MemberManTmpl", curgroup, function(){
                    $('body').unidialog( "#ManGrpForm", {token,idxid}, function( curbt, curbox ){
                        if( $(curbt).attr("opetype" ) == "SelMem" ){
                            $(curbt).addClass("StudBoxSel").find("[opetype=DelMem]").show();
                        }
                        else if( $(curbt).attr("opetype" ) == "DelMem" ){
                            $(curbox).find("[lvs_elm=StudBox]").append( "<div class=\"colflex6\" lvs_elm=\"StudItem\"><div class=\"FlexItemBox FormOk\"><span style=\"color:#6a6a6a;font-size:16px\"><b>" + $(curbt).attr("idxno") + "</b></span><span class=\"float-right\"><a class=\"FormOk\" opetype=\"AddMemOk\" idxid=\"" + $(curbt).attr("idxid") + "\" idxname=\"" + $(curbt).attr("idxname") + "\" idxno=\"" + $(curbt).attr("idxno") + "\"><img width=\"16px\" height=\"16px\" src=\"../../Image/ok.png\"/></a></span><br /><span>" + $(curbt).attr("idxname") +"</span></div></div>" );
                            $(curbt).closest("[lvs_elm=MemItem]").remove();
                        }
                        else if( $(curbt).attr("opetype" ) == "AddMem" ){
                            $(curbox).find("[lvs_elm=StudBox]").show();
                        }
                        else if( $(curbt).attr("opetype") == "DelGrp" ){
                            $('body').unidialog("#DelGrpForm", { token, idxid }, function( curbt, curbox ){
                                lvsdata.GetData("leag/lesn_set", $(curbt), { access_token: token, lesnid: curdata.id, groupid: curgroup.id, opetype: "DelGrp" }, function( apiname, params, result ){
                                    $('body').closedialog();
                                    lvs.LvsRout("tabfresh", token, idxid, "[lvs_elm=LesnTab]");
                                });
                            });
                        }
                        else if( $(curbt).attr("opetype" ) == "AddMemOk" ){
                            if( curdata.config != undefined && curdata.config.mem >0 && curdata.config.mem <= $(curbox).find("[lvs_elm=MemBox]").find("[lvs_elm=MemItem]").size() ){
                                ErrorTip.Create().Show("该分组人数已经超过上限，请先删除成员");
                            }
                            else{
                                $(curbox).find("[lvs_elm=MemBox]").append("<div class=\"colflex4\" lvs_elm=\"MemItem\" idxid=\"" + $(curbt).attr("idxid") + "\"><div class=\"FlexItemBox FormOk\" opetype=\"SelMem\"><span style=\"color:#6a6a6a;font-size:18px\"><b>" + $(curbt).attr("idxno") + "</b></span><span class=\"float-right\"><a class=\"FormOk\" opetype=\"DelMem\" idxid=\"" + $(curbt).attr("idxid") + "\" idxname=\"" + $(curbt).attr("idxname") + "\" idxno=\"" + $(curbt).attr("idxno") + "\" style=\"display:none\"><img width=\"12px\" height=\"12px\" src=\"../../Image/del.gif\"/></a></span><br /><span>" + $(curbt).attr("idxname") +"</span></div></div>");
                                $(curbt).closest("[lvs_elm=StudItem]").remove();
                            }
                        }
                        else if( $(curbt).attr("opetype" ) == "UpdOk" ){
                            var members = "";
                            $(curbox).find("[lvs_elm=MemBox]").find("[lvs_elm=MemItem]").each(function(){
                                if( members != "" )
                                    members += ",";
                                members += $(this).attr("idxid");
                            });
                            if( members == "" ){
                                ErrorTip.Create().Show("分组中至少需要保持一个成员");
                            }
                            else{
                                lvsdata.GetData("leag/lesn_set", $(curbt), { access_token: token, groupid: curgroup.id, grpname: $(curbox).getbind("grpname"), members: members, opetype: "UpdGrp"}, function( apiname, params, result ){
                                    $('body').closedialog();
                                    lvs.LvsRout("tabfresh", token, idxid, "[lvs_elm=LesnTab]");
                                });
                            }
                        }
                    });
                });
            });
        }
    });
})(jQuery);

//学生学习基本数据
(function (jQuery) {
    jQuery.fn.extend({
        lvs_stud_stat: function (token, idxid, curdata) {
            var tchid = (idxid < 0) ? 0 - idxid : idxid;
            var studbox = $(this);
            $(studbox).find("[lvs_elm=ShowStudStat]").bind("click", function(){
                var studid = $(this).attr("idxid");
                if( $(studbox).find('[lvs_elm=StudStat' + studid + ']').text() != "" ){
                    $(studbox).find('[lvs_elm=StudStat' + studid + ']').html("");
                }
                else{
                    lvsdata.GetData("leag/lesn_list", $(studbox).find('[lvs_elm=StudStat' + studid + ']'), { access_token: token, studid: studid, gettype: "Lesn.LearnStat" }, function (apiname, params, result) {
                        $(studbox).find('[lvs_elm=StudStat' + studid + ']').loadcomponent("cn.cls.studlesns", token, idxid, result, function(){
                        });
                    });
                }
            });
            $(studbox).find("[lvs_elm=ShowLesnTaskInfo]").bind("click",function(){
                var lesnid = $(this).attr("lesnid");
                var studid = $(this).attr("studid");
                lvsdata.GetData("leag/task_list", $(".ClickBox"), { access_token: token, gettype: "Task.LesnAns", lesnid: lesnid, role: "Stud", roleid: studid }, function (apiname, params, result) {
                    for (var i = 0; i < result.tasks.length; i++) {
                        if (result.tasks[i].tasktype == 'Plan' && (result.tasks[i].status == '新建' || result.tasks[i].status == '' || result.tasks[i].status == '草稿')) {
                            try {
                                result.tasks[i].taskitem = $.parseJSON(decodeURIComponent(result.tasks[i].ansdesc));
                            }
                            catch (err) {
                                result.tasks[i].ansdesc = decodeURIComponent(result.tasks[i].ansdesc);
                            }
                        }
                        else if (result.tasks[i].tasktype == 'Plan')
                            result.tasks[i].ansdesc = decodeURIComponent(result.tasks[i].ansdesc);
                        else if( result.tasks[i].tasktype != 'PlanB' && result.tasks[i].tasktype != 'RTask' )
                            result.tasks[i].taskitem = $.parseJSON( decodeURIComponent(result.tasks[i].ansdesc) );
                    }
                    $('body').unidialog("#ShowTaskForm", { token: token, idxid: idxid, data: result}, function( curbt, curbox ){
                            var resscore = $(curbox).find("[lvs_bind=TaskScore]").find(".Selected").attr("idxid");
                            if (resscore > 0) {
                                lvsdata.GetData("leag/lesn_set", $(curbt), { access_token: token, opetype: "TaskCheck", lesnid: lesnid, studid: studid, checkscore: resscore }, function (apiname, params, result) {
                                    var tips = ErrorTip.Create();
                                    tips.Show("批改完成");
                                    $('body').closedialog();
                                });
                            }
                    });
                    $('body').bind("dialogclose",function(){
                        if( swf2js != undefined )
                            swf2js.stopaudio();
                    });
                });
            });
        }
    });
})(jQuery);
