
//项目化进度内容展示
(function (jQuery) {
    jQuery.fn.extend({
        lvs_pbllesn: function (token, idxid, curdata) {
            var tchid = (idxid < 0) ? 0 - idxid : idxid;
            var lesnbox = $(this);
            lvs.LvsAddRout({ name: "tasking", clickelm: "[lvs_elm=TaskExec]" });
            lvs.LvsAddRout({ name: "taskblog", clickelm: "[lvs_elm=TaskBlog]" });
            $(lesnbox).find("[lvs_bind]").click(function () {
                if ($(this).attr("idxname") != undefined) {
                    var bindbox = $(this);
                    var formdata = { token: token, idxid: curdata.id, idxkey: $(this).attr("lvs_bind"), idxval: $(this).parent().getbind($(this).attr("lvs_bind")), idxname: $(this).attr("idxname"), idxtype: $(this).attr("idxtype"), idxserial: $(this).attr("idxserial") };
                    $('body').formdialog(formdata, function (curbt, curbox) {
                        var updparams = { access_token: token, lesnid: curdata.id, opetype: "LesnUpd." + formdata.idxkey, updval: $(curbox).getbind(formdata.idxkey) };
                        lvsdata.GetData("leag/lesn_set", $(curbt), updparams, function (apiname, params, result) {
                            $('body').closedialog();
                            var setdata = {};
                            setdata[formdata.idxkey] = params.updval;
                            $(bindbox).parent().SetData(curdata, setdata);
                        });
                    });
                }
            });
            $(lesnbox).find(".BaseListItem").click(function () {
                $(lesnbox).find(".BaseListItemSel").removeClass("BaseListItemSel");
                $(this).addClass("BaseListItemSel");
                if ($(this).attr("lvs_elm") == "PlayPlan") {
                    lvsdata.GetData("leag/lesn_list", $(lesnbox).find("[lvs_elm=TopicLesn]").html(""), { access_token: token, lesnid: curdata.id, gettype: "Lesn.Live" }, function (apiname, params, result) {
                        result.tmpl.autoplay = 1;
                        result.tmpl.lesnid = curdata.id;
                        $(lesnbox).find("[lvs_elm=TopicLesn]").loadcomponent("cn.play.lesnplay", token, idxid, result.tmpl, function () {
                            $(lesnbox).find("[lvs_elm=TopicLesn]").bind("playend", function (e, lesnid) {
                                $(lesnbox).find("[lvs_elm=TaskReq]").click();
                            });
                        });
                    });
                }
                if ($(this).attr("lvs_elm") == "ProjPlan") {
                    lvsdata.GetData("edu/course_list", $(lesnbox).find("[lvs_elm=TopicLesn]").html(""), { access_token: token, crstmplid: curdata.tmplid, gettype: "CrsTmpl.Base" }, function (apiname, params, result) {
                        curdata.tmplinfo = result;
                        curdata.tmplinfo.autoplay = 1;
                        $(lesnbox).find("[lvs_elm=TopicLesn]").loadcomponent("cn.play.lesnplay", token, idxid, curdata.tmplinfo, function () {
                            $(lesnbox).find("[lvs_elm=TopicLesn]").bind("playend", function (e, lesnid, pageid) {
                                $(lesnbox).find("[lvs_elm=TaskReq]").click();
                            });
                        });
                    });
                }
                else if ($(this).attr("lvs_elm") == "TaskReq") {
                    lvsdata.GetData("edu/course_list", $(lesnbox).find("[lvs_elm=TopicLesn]").html(""), { access_token: token, crstmplid: curdata.tmplid, gettype: "CrsTmpl.TaskChlg" }, function (apiname, params, result) {
                        result.readonly = 1;
                        $(lesnbox).find("[lvs_elm=TopicLesn]").loadcomponent("cn.crsplan.crstmpltasks", token, idxid, result, function () {
                        });
                    });
                }
                else if ($(this).attr("lvs_elm") == "TaskExec") {
                    lvsdata.GetData("leag/lesn_list", $(lesnbox).find("[lvs_elm=TopicLesn]").html(""), { access_token: token, lesnid: curdata.id, tmplid: curdata.tmplid, gettype: "Lesn.TaskGrpres" }, function (apiname, params, result) {
                        for (var i = 0; i < result.tasks.length; i++) {
                            for (var j = 0; result.tasks[i].steps != undefined && j < result.tasks[i].steps.length; j++) {
                                if (result.tasks[i].steps[j].stepdesc != "")
                                    result.tasks[i].steps[j].step = $.parseJSON(result.tasks[i].steps[j].stepdesc);
                                if (result.tasks[i].steps[j].chkres != "")
                                    result.tasks[i].steps[j].check = $.parseJSON(result.tasks[i].steps[j].chkres);
                                else
                                    result.tasks[i].steps[j].check = {};
                                for (var k = 0; k < result.tasks[i].steps[j].groups.length; k++) {
                                    for (var l = 0; l < result.tasks[i].steps[j].groups[k].checks.length; l++) {
                                        if (result.tasks[i].steps[j].groups[k].checks[l].chkres != "" && result.tasks[i].steps[j].groups[k].checks[l].chkres != undefined)
                                            result.tasks[i].steps[j].groups[k].checks[l].check = $.parseJSON(result.tasks[i].steps[j].groups[k].checks[l].chkres);
                                        else
                                            result.tasks[i].steps[j].groups[k].checks[l].check = {};
                                    }
                                }
                            }
                        }
                        result.id = params.lesnid;
                        $(lesnbox).find("[lvs_elm=TopicLesn]").loadcomponent("cn.lesn.lesngrps", token, idxid, result, function () {
                        });
                    });
                }
                else if ($(this).attr("lvs_elm") == "TaskIng") {
                    lvsdata.GetData("leag/lesn_list", $(lesnbox).find("[lvs_elm=TopicLesn]").html(""), { access_token: token, lesnid: curdata.id, tmplid: curdata.tmplid, gettype: "Lesn.TaskGrpres" }, function (apiname, params, result) {
                        for (var i = 0; i < result.tasks.length; i++) {
                            for (var j = 0; result.tasks[i].steps != undefined && j < result.tasks[i].steps.length; j++) {
                                if (result.tasks[i].steps[j].stepdesc != "")
                                    result.tasks[i].steps[j].step = $.parseJSON(result.tasks[i].steps[j].stepdesc);
                            }
                        }
                        result.id = params.lesnid;
                        $(lesnbox).find("[lvs_elm=TopicLesn]").loadcomponent("cn.lesn.lesngrps", token, idxid, result, function () {
                        });
                    });
                }
                else if ($(this).attr("lvs_elm") == "TaskBlog") {
                    lvsdata.GetData("leag/lesn_list", $(lesnbox).find("[lvs_elm=TopicLesn]").html(""), { access_token: token, lesnid: curdata.id, tmplid: curdata.tmplid, gettype: "Lesn.TaskGrpblog" }, function (apiname, params, result) {
                        for (var i = 0; i < result.grpreses.length; i++) {
                            if (result.grpreses[i].stepdesc != "")
                                result.grpreses[i].step = $.parseJSON(result.grpreses.stepdesc);
                            if (result.grpreses[i].chkres != "" && result.grpreses[i].chkres != undefined)
                                result.grpreses[i].check = $.parseJSON(result.grpreses[i].chkres);
                            else
                                result.grpreses[i].check = {};
                        }
                        result.id = params.lesnid;
                        $(lesnbox).find("[lvs_elm=TopicLesn]").loadcomponent("cn.lesn.lesngrpblog", token, idxid, result, function () {
                        });
                    });
                }
                else if ($(this).attr("lvs_elm") == "TaskCheck") {
                    lvsdata.GetData("leag/lesn_list", $(lesnbox).find("[lvs_elm=TopicLesn]").html(""), { access_token: token, lesnid: curdata.id, tmplid: curdata.tmplid, gettype: "Lesn.TaskGrpres" }, function (apiname, params, result) {
                        for (var i = 0; i < result.tasks.length; i++) {
                            for (var j = 0; result.tasks[i].steps != undefined && j < result.tasks[i].steps.length; j++) {
                                if (result.tasks[i].steps[j].chkres != "")
                                    result.tasks[i].steps[j].check = $.parseJSON(result.tasks[i].steps[j].chkres);
                                else
                                    result.tasks[i].steps[j].check = {};
                                for (var k = 0; k < result.tasks[i].steps[j].groups.length; k++) {
                                    if (result.tasks[i].steps[j].groups[k].chkres != "" && result.tasks[i].steps[j].groups[k].chkres != undefined)
                                        result.tasks[i].steps[j].groups[k].check = $.parseJSON(result.tasks[i].steps[j].groups[k].chkres);
                                    else
                                        result.tasks[i].steps[j].groups[k].check = {};
                                }
                            }
                        }
                        result.id = params.lesnid;
                        $(lesnbox).find("[lvs_elm=TopicLesn]").loadcomponent("cn.lesn.lesnchks", token, idxid, result, function () {
                        });
                    });
                }
            });
            if (curdata.curtask != undefined)
                $(lesnbox).find("[lvs_elm=" + curdata.curtask + "]").click();
            $('body').keyup(function (e) {
                if (e.keyCode == 40 || e.keyCode == 34) {
                    var curidx = 0;
                    if ($(lesnbox).find(".BaseListItemSel").size() == 1) {
                        curidx = parseInt($(lesnbox).find(".BaseListItemSel").attr("dataidx"));
                    }
                    else if ($(lesnbox).find(".BaseListItem").size() > 0)
                        curidx = -1;
                    $(lesnbox).find(".BaseListItem").each(function () {
                        if ($(this).attr("dataidx") == curidx + 1)
                            $(this).click();
                    });
                }
                else if (e.keyCode == 38 || e.keyCode == 33) {
                    var curidx = 0;
                    if ($(lesnbox).find(".BaseListItemSel").size() == 1) {
                        curidx = parseInt($(lesnbox).find(".BaseListItemSel").attr("dataidx"));
                    }
                    $(lesnbox).find(".BaseListItem").each(function () {
                        if ($(this).attr("dataidx") == curidx - 1)
                            $(this).click();
                    });
                }
            });
        }
    });
})(jQuery);

//项目化学习分组反馈管理
(function (jQuery) {
    jQuery.fn.extend({
        lvs_lesn_groups: function (token, idxid, curdata) {
            var tchid = (idxid < 0) ? 0 - idxid : idxid;
            var grpbox = $(this);
            curdata.lesnid = curdata.id;
            if( curdata.config !=undefined && curdata.config != "" ){
                curdata.config = $.parseJSON( decodeURIComponent( curdata.config ) );
                curdata.config.grptype = curdata.grptype;
                if( curdata.istch==0&&curdata.config.crt==0 ){
                    $(grpbox).find("[lvs_elm=JoinGroup]").text("加入分组");
                }
            }
            if( curdata.lesncfg != undefined ){
                curdata.lesncfg = $.parseJSON( decodeURIComponent( curdata.lesncfg ) );
                if( curdata.lesncfg.share>0){
                    $(grpbox).find("[lvs_bind=taskshare]").attr("data-isopen", "on");
                }
            }
            for( var i = 0; i < curdata.tasks.length; i ++ ){
                if( curdata.tasks[i].taskdesc ){
                    try{
                        curdata.tasks[i].item = $.parseJSON( curdata.tasks[i].taskdesc );
                    }
                    catch(err){
                        curdata.tasks[i].item = {};
                    }
                }
                if( curdata.tasks[i].item.type == "thmsel" || curdata.tasks[i].item.type == "thmblank" || curdata.tasks[i].item.type == "thmanswer" ){
                    $(grpbox).find("[lvs_elm=TaskItem" + i + "]").find("[lvs_elm=ShowTaskInfo]").hide();
                    curdata.tasks[i].item.desc.seqid = i;
                    curdata.tasks[i].item.desc.type = curdata.tasks[i].item.type;
                    curdata.tasks[i].item.desc.id = curdata.tasks[i].id;
                    curdata.tasks[i].item.desc.lesnid = curdata.lesnid;
                    var cmpname = curdata.tasks[i].item.type == "thmsel" ? "cn.theme.multselshow":( curdata.tasks[i].item.type == "thmblank" ? "cn.theme.blankinpshow": "cn.theme.answerinpshow" );
                    for( var j = 0; j < curdata.taskans.length;j++ ){
                        if( curdata.taskans[j].taskid == curdata.tasks[i].id ){
                            try{
                                curdata.tasks[i].item.desc.answer = $.parseJSON( decodeURIComponent( curdata.taskans[j].ansdesc ));
                                curdata.tasks[i].item.desc.checkok = 1;
                            }
                            catch(err){
                                curdata.tasks[i].item.desc.answer = { curans: "" };
                            }
                        }
                    }
                    $(grpbox).find("[lvs_elm=TaskItem" + i + "]").find("[lvs_elm=TaskInfo]").loadcomponent( cmpname, token, idxid, curdata.tasks[i].item.desc, function(){
                    });
                }
            }
            $(grpbox).find("[lvs_elm=TaskLesnCfg]").bind("switch",function(){
                var cfgstr = { share: $(this).getbind("taskshare")};
                lvsdata.GetData("leag/lesn_set", $(".CurClick"), { access_token: token, lesnid: curdata.id, opetype: "TaskCfg", lesncfg: encodeURIComponent( JSON.stringify( cfgstr ))}, function(apiname, params, result ){
                    ErrorTip.Create().Show("已成功修改配置" );
                });
            });
            $(grpbox).find("[lvs_elm=JoinGroup]").click(function () {
                lvsdata.GetData("leag/lesn_list", $(this), { access_token: token, lesnid: curdata.id, gettype: "Lesn.Groups"}, function( apiname, params, result ){
                    if( result.config != undefined && result.config != "" ){
                        result.config = $.parseJSON(decodeURIComponent( result.config ));
                        result.config.grptype = curdata.grptype;
                    }
                    else
                        result.config = {max:0,mem:0,crt:1,sig:0};
                    $(grpbox).find("#JoinGrpForm").loadtmpl( "cn.lesn.lesngrps", "#JoinGroupTmpl", result, function(){
                        $('body').unidialog( "#JoinGrpForm", { token: token, idxid: idxid }, function( curbt, curbox ){
                            lvsdata.GetData("leag/lesn_set", $(curbt), { access_token: token, lesnid: curdata.id, opetype: "JoinProjGroup", groupid: $(curbt).attr("idxid"), groupname: $(curbox).getbind("groupname")}, function( apiname, params, result){
                                $('body').closedialog();
                                lvs.LvsRout( "tabfresh", token, idxid, "[lvs_elm=LesnTab]" );
                            });
                        });
                    });
                });
            });
            $(grpbox).find("[lvs_elm=AddResp]").click(function(){
                var groupid = $(this).attr("groupid");
                var stepinfo = curdata.tasks[$(this).attr("dataidx1")].steps[$(this).attr("dataidx2")].step;
                var taskid = curdata.tasks[$(this).attr("dataidx1")].id;
                var stepid = curdata.tasks[$(this).attr("dataidx1")].steps[$(this).attr("dataidx2")].stepid;
                $(grpbox).find("#GrpForm").loadtmpl( "cn.lesn.lesngrps", "#AddRespTmpl", stepinfo, function(){
                    var formdata = { token: token, idxid: idxid, closing: 1, noclose: 1};
                    $('body').unidialog( "#GrpForm", formdata, function( curbt, curbox ){
                        var taskres = { resptext: decodeURI( $(curbox).getbind("resptext")), resptmpl: decodeURI( $(curbox).getbind("resptmpl")), resppaper: decodeURI($(curbox).getbind("resppaper")), respmind: $(curbox).find("[lvs_bind=respmind]").size()>0? $(curbox).find("[lvs_bind=respmind]").get_nodearray_data( formdata ):"" };
                        if( $(curbt).attr("opetype") == "RetRes" ){
                            lvsdata.GetData("leag/lesn_set", $(curbt), { access_token: token, lesnid: curdata.id, opetype: "GroupAddResp", status:"提交", groupid: groupid, taskid: taskid, stepid: stepid, resptext: encodeURIComponent( JSON.stringify( taskres )), respprog: $(curbox).getbind("respprog"), respfile: $(curbox).getbind("respfile"), vodfile: $(curbox).getbind("vodfile")}, function( apiname, params, result ){
                                $('body').closedialog();
                                lvs.LvsRout( "tabfresh", token, idxid, "[lvs_elm=LesnTab]" );
                            });
                        }
                        else if( $(curbt).attr("opetype") == "SaveRes" ){
                            lvsdata.GetData("leag/lesn_set", $(curbt), { access_token: token, lesnid: curdata.id, opetype: "GroupAddResp", status: "草稿", groupid: groupid, taskid: taskid, stepid: stepid, resptext: encodeURIComponent( JSON.stringify( taskres )), respprog: $(curbox).getbind("respprog"), respfile: $(curbox).getbind("respfile"), vodfile: $(curbox).getbind("vodfile")}, function( apiname, params, result ){
                                $('body').closedialog();
                                lvs.LvsRout( "tabfresh", token, idxid, "[lvs_elm=LesnTab]" );
                            });
                        }
                    });
                });
            });
            $(grpbox).find("[lvs_elm=GrpRes]").click(function(){
                var grpdata = curdata.tasks[$(this).attr("dataidx1")].steps[$(this).attr("dataidx2")].groups[$(this).attr("dataidx3")];
                $('body').basepanel( { left: "8%", width: "84%", top: $(window).scrollTop() + 160, close:1}, function( curbox ){
                    for( var i = 0; i  < grpdata.grpreses.length; i ++ ){
                        if( grpdata.grpreses[i].fileurl )
                            grpdata.grpreses[i].fileurl = grpdata.grpreses[i].fileurl.replace("tuanju.js.cn","fancience.com");
                        if( grpdata.grpreses[i].filelist ){
                            for( var j = 0;j < grpdata.grpreses[i].filelist.length; j ++ )
                                grpdata.grpreses[i].filelist[j].fileurl = grpdata.grpreses[i].filelist[j].fileurl.replace("tuanju.js.cn","fancience.com");
                        }
                    }
                    $(curbox).loadcomponent( "cn.theme.taskgrpres", token, idxid, grpdata, function(){
                    });
                    $('body').bind("click",function(){
                        if( $('[lvs_elm=GrpRes]:hover').size() == 0 && $('.PanelBox:hover').size() == 0 ){
                            $('body').closepanel();
                            $('body').unbind("click");
                        }
                    });
                    $(curbox).bind("panelclose", function(){
                        $('body').unbind("click");
                        if( swf2js )
                            swf2js.stopaudio();
                    });
                });
            });
            $(grpbox).find("[lvs_elm=GrpCheck]").click(function(){
                var grpdata = curdata.tasks[$(this).attr("dataidx1")].steps[0].groups[$(this).attr("dataidx2")];
                $("#GrpForm").loadtmpl("cn.lesn.lesngrps", "#ShowCheckTmpl", grpdata, function(){
                    $('body').unidialog("#GrpForm", { token: token, idxid: idxid, closing: 1}, function( curbt, curbox ){

                    });
                });
            });
            $(grpbox).find("[lvs_elm=ShowTaskInfo]").click(function(){
                var seqid = $(this).attr("dataidx");
                var pagedata = curdata.tasks[$(this).attr("dataidx")];
                if( pagedata.item == undefined )
                    pagedata.item = $.parseJSON( curdata.tasks[$(this).attr("dataidx")].taskdesc );
                if( pagedata.item.type == "text" ){
                    $('#ShowForm').html( pagedata.item.desc );
                    $('body').unidialog("#ShowForm", { token, idxid, closing: 1}, function( curbt, curbox ){
                    });
                }
                else if( pagedata.item.type == "thmsel" || pagedata.item.type == "thmblank" || pagedata.item.type == "thmanswer" ){
                    pagedata.item.desc.seqid = seqid;
                    var cmpname = pagedata.item.type == "thmsel" ? "cn.theme.multselshow":( pagedata.item.type == "thmblank" ? "cn.theme.blankinpshow": "cn.theme.answerinpshow" );
                    $('#ShowForm').loadtmpl( cmpname, "#ThemeForm_" + seqid, pagedata.item.desc, function(){
                        $('body').unidialog( "#ShowForm", { token: token, idxid: idxid }, function( curbt, curbox ){
                            var curans = $(curbox).getthemeans( pagedata.item.type );
                            if( curans == "" )
                                ErrorTip.Create().Show("请注意答题" );
                            else{
                                lvsdata.GetData("leag/lesn_set", $(curbt), {access_token: token, taskid: pagedata.id, estudid: idxid, opetype: "TaskSetAns", answer: curans}, function(apiname, params, result){
                                    $('body').closedialog();
                                });
                            }
                        });
                    });
                }
                else{
                    $('#ShowForm').loadcomponent("cn.crsplan.pageitem", token, idxid, pagedata.item, function(){
                        pagedata.item.token = token;
                        pagedata.item.idxid = idxid;
                        pagedata.item.closing = 1;
                        $('body').unidialog("#ShowForm", pagedata.item, function( curbt, curbox ){
                        });
                    });
                }
            });
            $(grpbox).find("[lvs_elm=ProgChk]").click(function () {
                var btbox = $(this);
                var grpdata = curdata.tasks[$(this).attr("dataidx1")].steps[$(this).attr("dataidx2")].groups[$(this).attr("dataidx3")];
                var stepdata = curdata.tasks[$(this).attr("dataidx1")].steps[$(this).attr("dataidx2")];
                $('#AddChkForm').loadtmpl("cn.lesn.lesnchks", "#AddChkTmpl", stepdata, function(){
                    $('body').unidialog("#AddChkForm", { token: token, idxid: idxid, slidegrade: 1, isbesttask: 0, isexhibit: 0 }, function (curbt, curbox) {
                        var chkres = $(curbox).getbind("chkres");
                        var cateres = "";
                        if( stepdata.cates != undefined ){
                            chkres = 0;
                            $(curbox).find("[lvs_bind=chkscore]").each(function(n){
                                stepdata.cates[n].score = $(this).val();
                                chkres += parseInt( stepdata.cates[n].score ) * parseInt( stepdata.cates[n].rate ) / 100;
                            });
                            cateres = encodeURIComponent(JSON.stringify(stepdata.cates));
                            chkres = parseInt( chkres );
                        }
                        lvsdata.GetData( "leag/lesn_set", $(curbt), { access_token: token, lesnid: curdata.id, taskid: curdata.tasks[$(btbox).attr("dataidx1")].id, stepid: stepdata.stepid, groupid: grpdata.id, opetype: "LesnGrpChk", chkres: chkres, cateres: cateres, chkmark: $(curbox).getbind("chkmark"), besttask: $(curbox).getbind("besttask"), exhibit: $(curbox).getbind("exhibit")}, function( apiname, params, result ){
                            $('body').closedialog();
                            if( !grpdata.checks )grpdata.checks = [];
                            grpdata.checks.push({check:{cates: stepdata.cates, chkmark: params.chkmark, score: params.chkres, besttask: params.besttask, exhibit: params.exhibit }});
                            $(btbox).closest("tr").find("[lvs_elm=GrpCheck]").append("<span title=\"" + params.chkmark + "\">" + params.chkres + "</span>" );
                            //lvs.LvsRout("tasking", 0);
                        });
                    });
                });
            });
        },
        lvs_lesn_grpdata: function( token, idxid, result, okfunc ){
            if( result.tasks ){
                for (var i = 0; i < result.tasks.length; i++) {
                    for (var j = 0; result.tasks[i].steps != undefined && j < result.tasks[i].steps.length; j++) {
                        if (result.tasks[i].steps[j].stepdesc != ""){
                            try
                            {
                                result.tasks[i].steps[j].step = $.parseJSON(result.tasks[i].steps[j].stepdesc);
                            }
                            catch(err){
                                result.tasks[i].steps[j].step = {};
                            }
                        }
                        if (result.tasks[i].steps[j].chkres != ""){
                            try{
                                result.tasks[i].steps[j].check = $.parseJSON(result.tasks[i].steps[j].chkres);
                            }
                            catch(err){
                                result.tasks[i].steps[j].check = {};
                            }
                        }
                        else
                            result.tasks[i].steps[j].check = {};
                        if( result.tasks[i].steps[j].groups ){
                            for (var k = 0; k < result.tasks[i].steps[j].groups.length; k++) {
                                for (var l = 0; l < result.tasks[i].steps[j].groups[k].checks.length; l++) {
                                    if (result.tasks[i].steps[j].groups[k].checks[l].chkres != "" && result.tasks[i].steps[j].groups[k].checks[l].chkres != undefined)
                                        try{
                                            result.tasks[i].steps[j].groups[k].checks[l].check = $.parseJSON(result.tasks[i].steps[j].groups[k].checks[l].chkres);
                                        }
                                        catch(err){
                                            result.tasks[i].steps[j].groups[k].checks[l].check = {};
                                        }
                                    else
                                        result.tasks[i].steps[j].groups[k].checks[l].check = {};
                                }
                            }
                        }
                    }
                }
            }
            if(result.grpreses){
                for (var i = 0; i < result.grpreses.length; i++) {
                    if (result.grpreses[i].stepdesc != "")
                    {
                        try{
                            result.grpreses[i].step = $.parseJSON(result.grpreses.stepdesc);
                        }
                        catch(err){
                            result.grpreses[i].step = {};
                        }
                    }
                    if (result.grpreses[i].chkres != "" && result.grpreses[i].chkres != undefined){
                        try{
                            result.grpreses[i].check = $.parseJSON(result.grpreses[i].chkres);
                        }
                        catch(err){
                            result.grpreses[i].check = {};
                        }
                    }
                    else
                        result.grpreses[i].check = {};
                }
            }
            if( okfunc != undefined )
                okfunc(  );
        },
        lvs_lesn_preplay: function( token, idxid, curdata, okfunc ){
            if( curdata.tmpl != undefined && curdata.pages == undefined ){
                curdata.tmpl.lesnid = curdata.id;
                okfunc( curdata.tmpl );
            }
            else
                okfunc( curdata );
        }
    });
})(jQuery);

//项目化学习课程学习展板
(function (jQuery) {
    jQuery.fn.extend({
        lvs_lesn_grpstat: function (token, idxid, curdata) {
            var tchid = (idxid < 0) ? 0 - idxid : idxid;
            var grpbox = $(this);
            $(grpbox).find("[lvs_elm=DownFile]").click(function(){
                lvsdata.GetData("leag/lesn_list", $(this), { access_token: token, classid: $(this).attr("idxid"), modseq: $(this).attr("modseq"), gettype: "Lesn.DownAttach" }, function( apiname, params, result ){
                    $('body').basepanel({ left: "20%", top: 300, width: "60%", close: 1}, function( curbox ){
                        $(curbox).html("<div style=\"text-align:center\">完成打包，请<a href=\"" + result.resurl + "\" download=\"" + result.filename + "\">点击下载文件</a></div>");
                    });
                });
            });
            $(grpbox).find("[lvs_elm=ShowGrpTask]").click(function(){
                lvsdata.GetData("leag/lesn_list", $(this), { access_token: token, classid: curdata.id, modseq: curdata.curmodseq, groupid: $(this).attr("idxid"), gettype: "Lesn.GroupTaskres" }, function( apiname, params, result ){
                    $('body').basepanel({left:"15%", top: "200px", width:"70%", close: 1}, function( curbox ){
                        $(curbox).lvs_lesn_grpdata( token, idxid, result, function(){
                        });
                        $(curbox).loadcomponent( "cn.lesn.lesntaskres", token, idxid, result,function(){

                        });
                    });
                    $('body').bind("click", function(){
                        if( $('[lvs_elm=ShowGrpTask]:hover').size() == 0 && $('.PanelBox:hover').size() == 0 ){
                            $('body').closepanel();
                            $('body').unbind("click");
                        }
                    });
                    $('body').bind("panelclose", function(){
                        $('body').unbind("click");
                    });
                });
            });
        }
    });
})(jQuery);


//项目化学习分组反馈管理
(function (jQuery) {
    jQuery.fn.extend({
        lvs_lesn_chks: function (token, idxid, curdata) {
            var tchid = (idxid < 0) ? 0 - idxid : idxid;
            var grpbox = $(this);
        }
    });
})(jQuery);

//项目化学习展评列表
(function (jQuery) {
    jQuery.fn.extend({
        lvs_lesn_preexhibit: function(token, idxid, curdata){
        },
        lvs_lesn_taskres: function(token, idxid, curdata){
            var taskbox = $(this);
            $(taskbox).find(".TaskDescItem").each(function(n){
                var taskitem = curdata.tasks[$(this).attr("dataidx")];
                taskitem.item = $.parseJSON( taskitem.taskdesc );
                if( taskitem.item.type == "text" )
                    $(this).html( taskitem.item.desc );
                else if( taskitem.item.type == "thmsel" || taskitem.item.type == "thmblank" || taskitem.item.type == "thmanswer"){
                    taskitem.item.desc.seqid = n;
                    $(this).loadcomponent("cn.theme.baseshow", token, idxid, taskitem.item.desc, function(){
                    });
                }
                else{
                    taskitem.item.pageid = 1000;
                    $(this).css("height", $(this).width() * 57 / 100).loadcomponent("cn.play.lesnpage", token, idxid, taskitem.item, function( ){
                    });
                }
            });
            $(taskbox).find(".TaskResItem").each(function(){
                var grpdata = curdata.tasks[$(this).attr("dataidx").split(',')[0]].steps[$(this).attr("dataidx").split(',')[1]];
                if( curdata.editsel )
                    grpdata.editsel = curdata.editsel;
                $(this).loadcomponent("cn.theme.taskgrpres", token, idxid, grpdata, function(){
                });
            });
        },
        lvs_lesn_exhibits: function (token, idxid, curdata) {
            var tchid = (idxid < 0) ? 0 - idxid : idxid;
            var lesnbox = $(this);
            $(lesnbox).find("[lvs_elm=ExhNameSel]").change(function(){
                var cursel = $(this).val();
                $(lesnbox).find(".BaseListBox").each(function(){
                    if( $(this).attr("idxname") == cursel || cursel == "" )
                        $(this).show();
                    else
                        $(this).hide();
                });
            });
            $(lesnbox).find("[lvs_elm=AddExh]").click(function(){
                var grpdata = { groups: curdata.groups, exhnames: curdata.exhnames};
                for( var i = 0; i < grpdata.groups.length; i ++ ){
                    for( var j = 0; j < curdata.exhibits.length; j ++ ){
                        if( grpdata.groups[i].id == curdata.exhibits[j].groupid ){
                            grpdata.groups[i].exhid = curdata.exhibits[j].id;
                        }
                    }
                }
                $('#AddExhForm').loadtmpl( "cn.lesn.lesnexhibits", "#AddExhTmpl", grpdata, function(){
                    $('body').unidialog("#AddExhForm", {token, idxid}, function( curbt, curbox ){
                        if( $(curbt).attr("opetype") == "ShowTask" ){
                            lvsdata.GetData("leag/lesn_list", $(curbt), { access_token: token, lesnid: curdata.id, groupid: $(curbt).attr("idxid"), gettype: "Lesn.GroupTaskres" }, function( apiname, params, result ){
                                $('body').basepanel({left:"15%", top: "200px", width:"70%", close: 1}, function( curbox ){
                                    $(curbox).lvs_lesn_grpdata( token, idxid, result, function(){
                                    });
                                    $(curbox).loadcomponent( "cn.lesn.lesntaskres", token, idxid, result,function(){

                                    });
                                });
                                $('body').bind("click", function(){
                                    if( $('.FormOk:hover').size() == 0 && $('.PanelBox:hover').size() == 0 ){
                                        $('body').closepanel();
                                        $('body').unbind("click");
                                    }
                                });
                                $('body').bind("panelclose", function(){
                                    $(curbox).lvs_stop_swf();
                                    $('body').unbind("click");
                                });
                            });
                        }
                        else if($(curbt).attr("opetype") == "SelAll" ){
                            if( $(curbt).hasClass("MultSelected")){
                                $(curbox).find("[lvs_bind=exhgroups]").find(".MultSelecting").addClass("MultSelected");
                            }
                            else{
                                $(curbox).find("[lvs_bind=exhgroups]").find(".MultSelecting").removeClass("MultSelected");
                            }
                        }
                        else if( $(curbt).attr("opetype") == "AddExhOk" ){
                            lvsdata.GetData("leag/lesn_set", $(curbt), {access_token: token, estudid: idxid, lesnid: curdata.id, exhname: $(curbox).getbind("exhname"), grouplist: $(curbox).getbind("exhgroups"), opetype: "GroupAddExh"}, function( apiname, params, result ){
                                $('body').closedialog();
                                lvs.LvsRout("tabfresh", token, idxid, "[lvs_elm=LesnTask]" );
                            });
                        }
                    });
                });
            });
            $(lesnbox).find("[lvs_elm=ShowRes]").click(function(){
                var dataidx = $(this).attr("dataidx");
                $(this).basepanel({left:$(this).offset().left - 100, width: 450, bottom: $(this).offset().bottom}, function( curbox ){
                    var resdata= curdata.exhibits[dataidx.split(',')[0]].tasks[dataidx.split(',')[1]];
                    var sdesc = decodeURIComponent( resdata.sdesc );
                    resdata.grpreses = [{ title: resdata.title, resdesc: sdesc}];
                    $(curbox).loadcomponent("cn.theme.taskgrpres", token, idxid, resdata, function(){
                    });
                });
                $('body').bind("click", function(){
                    if( $('[lvs_elm=ShowRes]:hover').size() == 0 && $('.PanelBox:hover').size() == 0 ){
                        $('body').closepanel();
                        $('body').unbind("click");
                    }
                });
            });
            $(lesnbox).find("[lvs_elm=SelExhTask]").click(function(){
                lvsdata.GetData("leag/lesn_list", $(this), { access_token: token, lesnid: curdata.id, groupid: -1, gettype: "Lesn.GroupTaskres" }, function( apiname, params, result ){
                    $('#SelTaskForm').loadtmpl("cn.lesn.lesnexhibits", "#SelTaskTmpl", result, function(){
                        $('body').unidialog( "#SelTaskForm", {token, idxid}, function( curbt, curbox ){
                            lvsdata.GetData("leag/lesn_set", $(this), { access_token:token, lesnid: curdata.id, groupid: -1, opetype: "LesnSetExh", steplist: $(curbox).getbind("seltasks")}, function( apiname, params, result ){
                                $('body').closedialog();
                                lvs.LvsRout("tabfresh", token, idxid, "[lvs_elm=LesnTask]");
                            });
                        });
                    });
                });
            });
            $(lesnbox).find("[lvs_elm=PreviewExh]").click(function(){
                lvsdata.GetData("leag/lesn_list", $(this), { access_token: token, exhid: $(this).attr("idxid"), estudid: idxid, gettype: "Exh.Id" }, function( apiname, params, result ){
                    $('body').basepanel({left:"10%", width:"80%", top: 180, close: 1}, function( curbox ){
                        $(curbox).lvs_lesn_grpdata( token, idxid, result, function(){
                        });
                        $(curbox).loadcomponent("cn.lesn.grpexhibit", token, idxid, result, function(){
                        });
                    });
                    $('body').bind("click", function(){
                        if( $('[lvs_elm=PreviewExh]:hover').size() == 0 && $('.PanelBox:hover').size() == 0 ){
                            $('body').closepanel();
                            $('body').unbind("click");
                        }
                    });
                    $('body').bind("panelclose", function(){
                        $('body').unbind("click");
                    });
                });
            });
            $(lesnbox).find("[lvs_elm=DelExh]").click(function(){
                var delexhid = $(this).attr("idxid");
                var exhbox = $(this).closest("[lvs_elm=ExhibitItem]");
                $('body').unidialog("#DelExhForm", { token, idxid }, function( curbt, curbox ){
                    lvsdata.GetData("leag/lesn_set", $(curbt), { access_token: token, exhid: delexhid, estudid: idxid, opetype: "DelExhibit"}, function( apiname, params, result ){
                        for( var i = 0; i < curdata.exhibits.length; i ++ ){
                            if( curdata.exhibits[i].id == params.exhid ){
                                curdata.exhibits.splice(i, 1 );
                                break;
                            }
                        }
                        $(exhbox).remove();
                        $('body').closedialog();
                    });
                });
            });
            $(lesnbox).find("[lvs_elm=SelGrpRes]").click(function(){
                lvsdata.GetData("leag/lesn_list", $(this), { access_token: token, exhid: $(this).attr("idxid"), gettype: "Lesn.ExhTaskres"}, function( apiname, params, result ){
                    $(lesnbox).lvs_lesn_grpdata( token, idxid, result, function(){
                    });
                    $('#SelResForm').loadtmpl( "cn.lesn.lesnexhibits", "#SelResTmpl", result, function(){
                        $('body').unidialog( "#SelResForm", { token, idxid, tasks: result.tasks }, function(curbt, curbox){
                            lvsdata.GetData("leag/lesn_set", $(curbt), { access_token:token, exhid: params.exhid, opetype: "ExhSet", selreses: $(curbox).getbind("selres")}, function( apiname,params, result){
                                lvs.LvsRout("tabfresh", token, idxid, "[lvs_elm=LesnTab]");
                            });
                        });
                    });
                });
            });
            $(lesnbox).find("[lvs_elm=ShowRem]").click(function(){
                lvsdata.GetData("common/remarks", $(".CurClick"), { access_token: token, remtype: "exh", remidx: $(this).attr("idxid") }, function( apiname, params, result ){
                    $('body').unidialog( "#RemForm", { token, idxid, closing:1, ...result }, function( curbt, curbox ){
                    });
                });
            });
            $(lesnbox).find("[lvs_elm=EditExhInfo]").click(function(){
                var exhbox = $(this).closest("[lvs_elm=ExhibitItem]");
                var exhdata = curdata.exhibits[$(this).attr("dataidx")];
                $('#EditInfoForm').loadtmpl("cn.lesn.lesnexhibits", "#EditInfoTmpl", { id: exhdata.id, exhtitle: exhdata.title, image: exhdata.image}, function(){
                    $('body').unidialog("#EditInfoForm", {token, idxid}, function( curbt, curbox ){
                        lvsdata.GetData("leag/lesn_set", $(curbt), { access_token: token, exhid: exhdata.id, opetype: "ExhSet", exhtitle: $(curbox).getbind("exhtitle"), image: $(curbox).getbind("exhimage")}, function( apiname, params, result ){
                            $('body').closedialog();
                            $(exhbox).SetData( exhdata, { title: params.exhtitle, image: result.info });
                        });
                    });
                });
            });
            $(lesnbox).find("[lvs_elm=EditExhName]").click(function(){
                var exhbox = $(this).closest("[lvs_elm=ExhibitItem]");
                var exhdata = curdata.exhibits[$(this).attr("dataidx")];
                $('#EditInfoForm').loadtmpl("cn.lesn.lesnexhibits", "#EditNameTmpl", { id: exhdata.id, exhname: exhdata.exhname, exhnames: curdata.exhnames}, function(){
                    $('body').unidialog("#EditInfoForm", {token, idxid}, function( curbt, curbox ){
                        lvsdata.GetData("leag/lesn_set", $(curbt), { access_token: token, exhid: exhdata.id, opetype: "ExhSet", exhname: $(curbox).getbind("exhname")}, function( apiname, params, result ){
                            $('body').closedialog();
                            $(exhbox).SetData( exhdata, { exhname: params.exhname });
                        });
                    });
                });
            });
            return $(this);
        }
    });
})(jQuery);

//项目化学习展评列表显示
(function (jQuery) {
    jQuery.fn.extend({
        lvs_lesn_taskexhs: function (token, idxid, curdata) {
            var tchid = (idxid < 0) ? 0 - idxid : idxid;
            var grpbox = $(this);
            $(grpbox).find("[lvs_elm=ShowExhItem]").click(function(){
                var itembox = $(this);
                lvsdata.GetData("leag/lesn_list", $(".CurClick"), { access_token: token, exhid: $(this).attr("idxid"), readnum: 1, estudid: idxid, gettype: "Exh.Id" }, function( apiname, params, result ){
                    $("#ShowExhForm").loadtmpl("cn.lesn.taskexhs", "#ShowExhTmpl", result, function(){
                        var formdata = { token, idxid, closing:1, ...result };
                        $('body').unidialog( "#ShowExhForm", formdata, function( curbt, curbox ){
                            if($(curbt).attr("opetype") == "OpenRem" ){
                                if( $(curbox).find(".DlgFootBox").css("display") == "none" )
                                    $(curbox).find(".DlgFootBox").fadeIn(300);
                                else
                                    $(curbox).find(".DlgFootBox").fadeOut(500);
                            }
                            else if($(curbt).attr("opetype") == "RetRem"){
                                lvsdata.GetData("leag/lesn_set", $(curbt), { access_token: token, exhid: params.exhid, remscore: $(curbox).getbind("remscore"), remtext: $(curbox).getbind("remtext"), opetype: "RemExh"}, function( apiname, params, result ){
                                    ErrorTip.Create().Show("评价完成，感谢参与", function(){
                                        $(curbox).find(".DlgFootBox").fadeOut(500);
                                        $(curbox).setbind("avgscore", result.info );
                                        $(itembox).setbind("avgscore", result.info);
                                    });
                                });
                            }
                        });
                        $('body').bind("dialogclose",function(){
                            $(".DlgFootBox").hide();
                            $(".DlgFootButton").hide();
                        });
                    });
                    /*
                    $('body').basepanel({left:"10%", width:"80%", top: 180, close: 1}, function( curbox ){
                        $(curbox).lvs_lesn_grpdata( token, idxid, result, function(){
                        });
                        $(curbox).loadcomponent("cn.lesn.grpexhibit", token, idxid, result, function(){
                        });
                    });
                    $('body').bind("click", function(){
                        if( $('[lvs_elm=PreviewExh]:hover').size() == 0 && $('.PanelBox:hover').size() == 0 ){
                            $('body').closepanel();
                            $('body').unbind("click");
                        }
                    });
                    $('body').bind("panelclose", function(){
                        $('body').unbind("click");
                    });
                    */
                });
            });
            var last;
            $(grpbox).find("[lvs_elm=SearchData]").keyup(function (event) {
                var searchData = $(this).val();
                var sbox = $(this)
                last = event.timeStamp;
                setTimeout(function(){    //设时延迟1s执行
                    if(last == event.timeStamp || event.keyCode == 13 ) {
                        if($(sbox).val() != "") {
                            $.each(curdata.exhs,function (a,b) {
                                $.each(b.groups,function(n,value){
                                    for (var key in value){
                                        if (key == "exhname" || key == "grpname" || key == "classname") {
                                            if (value[key].indexOf(searchData)!= -1) {
                                                b.groups[n].undisplay = 0
                                                break;
                                            }
                                            else {
                                                b.groups[n].undisplay = 1
                                            }
                                        }
                                    }
                                })
                            })
                            $(grpbox).parent().loadcomponent("cn.theme.taskexhs", token, idxid, curdata, function(){
                            });
                        }
                    }
                },1000);


            })
            $(grpbox).find(".el_input_clear").click(function () {
                $.each(curdata.exhs,function (a,b) {
                    $.each(b.groups,function(n,m){
                        b.groups[n].undisplay = 0;
                    })
                })
                $(grpbox).parent().loadcomponent("cn.theme.taskexhs", token, idxid, curdata, function(){
                });
            })

        }
    });
})(jQuery);
//项目化学习展评列表搜索
(function (jQuery) {
    jQuery.fn.extend({
        lvs_lesn_taskexhs_search:function (token,idxid,curdata) {



        }
    });
})(jQuery);


//项目化学习讨论交流
(function (jQuery) {
    jQuery.fn.extend({
        lvs_lesn_grpblog: function (token, idxid, curdata) {
            var tchid = (idxid < 0) ? 0 - idxid : idxid;
            var grpbox = $(this);
            $(grpbox).find("[lvs_elm=GrpresBlog]").click(function(){
                if( $(this).attr("blogid") > 0 )
                    lvs.LvsRout("blog", token, idxid, $(this).attr("blogid") );
                else{
                    lvsdata.GetData("leag/lesn_set", $(this), { access_token: token, estudid: idxid, resid: $(this).attr("idxid"), lesnid: $(this).attr("lesnid"), opetype: "GetGrpBlog" }, function(apiname, params, result ){
                        lvs.LvsRout("blog", token, idxid, result.id );
                    });
                }
            });
        }
    });
})(jQuery);

//课程学习过程提示数据
(function (jQuery) {
    jQuery.fn.extend({
        lvs_lesntips: function (token, idxid, curdata) {
            var tchid = (idxid < 0) ? 0 - idxid : idxid;
            var lesnbox = $(this);
            $(lesnbox).find("[lvs_elm=ShowStudStat]").click(function () {
                $('body').cpn("cn.play.lesnplay").playpause( 1 );
                lvsdata.GetData("leag/lesn_list", $('#ShowInfoForm').html(""), { access_token: token, lesnid: curdata.id, gettype: "Lesn.ClsStudStat"}, function( apiname, params, result ){
                    $('#ShowInfoForm').loadtmpl("cn.lesn.lesntips", "#ShowStudTmpl", result, function(){
                        $('body').unidialog( "#ShowInfoForm", {token: token, idxid: idxid, closing:1}, function( curbt, curbox ){
                        });
                    });
                });
            });
            $(lesnbox).find("[lvs_elm=ShowTaskStat]").click(function () {
                $('body').cpn("cn.play.lesnplay").playpause( 1 );
                lvsdata.GetData("leag/lesn_list", $('#ShowInfoForm').html(""), { access_token: token, lesnid: curdata.id, gettype: "Lesn.ClsTaskStat"}, function( apiname, params, result ){
                    $('#ShowInfoForm').loadtmpl("cn.lesn.lesntips", "#ShowClsTaskTmpl", result, function(){
                        for( var i = 0;i < result.taskans.length; i ++ )
                        {
                            var ans = decodeURIComponent( result.taskans[i].ansdesc );
                            var anselm = $('#ShowInfoForm').find("[lvs_elm=Ans_" + result.taskans[i].studid + "_" + result.taskans[i].taskid + "]" );
                            result.taskans[i].answer = $.parseJSON( ans );
                            var answer = result.taskans[i].answer;
                            if( !answer.curans )
                                continue;
                            if( answer.curans.length < 30 ){
                                $(anselm).attr("dataidx", i);
                                if( answer.curans == answer.baseanswer && answer.curans != "" )
                                    $(anselm).addClass("TaskAutoChkOk").html( answer.curans );
                                else if( answer.curans.indexOf("|") != -1 ){
                                    let anslist = answer.curans.split('|');
                                    let baselist = answer.baseanswer.split(';');
                                    let ansstr = "";
                                    for( var j = 0; j < anslist.length; j ++ ){
                                        if( baselist.length > j && baselist[j] == anslist[j] )
                                            ansstr += "<span class=\"TaskBlankOk\">" + anslist[j] + "</span>";
                                        else
                                            ansstr += "<span class=\"TaskBlankNok\">" + anslist[j] + "</span>";
                                    }
                                    $(anselm).html( ansstr );
                                }
                                else
                                    $(anselm).addClass("TaskAutoChkNok").html(answer.curans);
                            }
                            else
                            {
                                $(anselm).attr("dataidx", i).html( "<img width=\"20px\" height=\"20px\" src=\"../../Image/icon/hwork.png\" title=\"查看详细作业内容\"/>" );
                            }

                        }
                        $('body').unidialog( "#ShowInfoForm", {token: token, idxid: idxid, closing:1}, function( curbt, curbox ){
                            if( $(curbt).attr("opetype" ) == "ShowAns" ){
                                var showdata = result.taskans[$(curbt).attr("dataidx")].answer;
                                $('body').basepanel({top: $(window).scrollTop()+ 180, left: "10%", width: "80%", close: 1}, function(curbox){
                                    $(curbox).loadcomponent("cn.theme.baseshow", token, idxid, showdata, function(){
                                    });
                                    $('body').bind("panelclose", function(){
                                        $(curbox).lvs_stop_swf();
                                    });
                                });
                            }
                        });
                    });
                });
            });
            $(lesnbox).everyTime("20s", function(){
                if( curdata.id >0 ){
                    lvsdata.StoleData("leag/lesn_list", { access_token: token, lesnid: curdata.id, gettype: "Lesn.BaseStat"}, function( apiname, params, result ){
                        $(lesnbox).SetData( curdata, { studnum: result.studnum, progress: result.progress, tasknum: result.tasknum });
                    });
                }
            });
        }
    });
})(jQuery);

//作业统计与批改
(function (jQuery) {
    jQuery.fn.extend({
        lvs_lesn_taskstat: function (token, idxid, curdata) {
            var tchid = (idxid < 0) ? 0 - idxid : idxid;
            var lesnbox = $(this);
            for( var i = 0;i < curdata.taskans.length; i ++ )
            {
                var ans = decodeURIComponent( curdata.taskans[i].ansdesc );
                var anselm = $(lesnbox).find("[lvs_bind=Ans_" + curdata.taskans[i].studid + "_" + curdata.taskans[i].taskid + "]" );
                try{
                    curdata.taskans[i].answer = $.parseJSON( ans );
                }
                catch(err){}
                var answer = curdata.taskans[i].answer;
                if( answer.curans == undefined || answer.curans == "" ){
                    $(anselm).addClass("TaskAutoChkUndo").html("尚未提交");
                }
                else if( answer.curans.length < 30 ){
                    $(anselm).attr("dataidx", i);
                    if( answer.curans == answer.baseanswer && answer.curans != "" )
                        $(anselm).addClass("TaskAutoChkOk").html( answer.curans );
                    else if( answer.curans.indexOf("|") != -1 ){
                        let anslist = answer.curans.split('|');
                        let baselist = answer.baseanswer.split(';');
                        let ansstr = "";
                        for( var j = 0; j < anslist.length; j ++ ){
                            if( baselist.length > j && baselist[j] == anslist[j] )
                                ansstr += "<span class=\"TaskBlankOk\">" + anslist[j] + "</span>";
                            else
                                ansstr += "<span class=\"TaskBlankNok\">" + anslist[j] + "</span>";
                        }
                        $(anselm).html( ansstr );
                    }
                    else
                        $(anselm).addClass("TaskAutoChkNok").html(answer.curans);
                }
                else
                {
                    $(anselm).attr("dataidx", i).html( "<img width=\"24px\" height=\"24px\" src=\"../../Image/icon/hwork.png\" title=\"查看详细作业内容\"/>" );
                }
                if( (curdata.taskans[i].status=="批改" || curdata.taskans[i].status == "完成") && curdata.taskans[i].ansscore>0 ){
                    $(anselm).closest("tr").find("[lvs_elm=ShowCheck]").html("<span class=\"CheckRes\" title=\"" + curdata.taskans[i].checkmark + "\">" + curdata.taskans[i].ansscore + "</span>" );
                }
                else if( curdata.taskans[i].status=="提交" ){
                    $(anselm).closest("tr").find("[lvs_elm=ShowCheck]").attr("studid", curdata.taskans[i].studid).html("<a class=\"button bg-green\" lvs_elm=\"CheckTask\">批改</a>" );
                }
            }
            $(lesnbox).find("[lvs_elm=ShowAns]").click(function(){
                var dataidx = $(this).attr("dataidx");
                var showdata = curdata.taskans[dataidx].answer;
                $('body').basepanel({top: $(window).scrollTop()+ 120, left: "10%", width: "80%", close: 1}, function(curbox){
                    $(curbox).loadcomponent("cn.theme.baseshow", token, idxid, showdata, function(){
                    });
                    $('body').bind("panelclose", function(){
                        $(curbox).lvs_stop_swf();
                    });
                });
            });
            $(lesnbox).find("[lvs_elm=ShowCheck]").click(function(){
                var chkbox = $(this);
                if( $("[lvs_elm=CheckTask]:hover").size() > 0 ){
                    var ansdata = { tasks: [] };
                    for( var i = 0 ;i < curdata.taskans.length; i ++ ){
                        if( curdata.taskans[i].studid == $(chkbox).attr("studid" ) )
                            ansdata.tasks.push( curdata.taskans[i].answer );
                    }
                    $('#AddCheckForm').loadtmpl( "cn.lesn.taskstat", "#CheckTaskTmpl", ansdata, function(){
                        $('body').unidialog("#AddCheckForm", { token, idxid, slidegrade: 1, tasks: ansdata.tasks}, function( curbt, curbox ){
                            lvsdata.GetData("leag/lesn_set", $(curbt), { access_token: token, lesnid: curdata.id, studid: $(chkbox).attr("studid"), checkscore: $(curbox).getbind("checkscore"), checkrem: $(curbox).getbind("checkrem"), opetype: "TaskCheck", teacherid: tchid }, function( apiname, params, result ){
                                $('body').closedialog();
                                $(chkbox).html("<span class=\"CheckRes\" title=\"" + params.checkrem + "\">" + params.checkscore + "</span>");
                            });
                        });
                    });
                }
            });
            $(lesnbox).find("[lvs_elm=ShowTaskTheme]").click(function(){
                var curtask = curdata.tasks[$(this).attr("dataidx")];
                var cmpname = "";
                var taskdesc = {};
                if( curtask.type == "TTask" ){
                    var taskinfo = $.parseJSON(  curtask.taskdesc  );
                    taskdesc = taskinfo.desc;
                    if( taskinfo.type == "thmsel" )
                        cmpname = "cn.theme.multselshow";
                    else if( taskinfo.type == "thmblank" )
                        cmpname = "cn.theme.blankinpshow";
                    else
                        cmpname = "cn.theme.answerinpshow";
                }
                else
                    taskdesc = $.parseJSON( curtask.taskdesc );
                taskdesc.seqid = $(this).attr("dataidx");
                $('#ShowThemeForm').loadcomponent( "cn.theme.baseshow", token, idxid, taskdesc, function(){
                    $('body').unidialog( "#ShowThemeForm", { token, idxid, closing:1}, function( curbt, curbox ){
                    });
                });
            });
        }
    });
})(jQuery);