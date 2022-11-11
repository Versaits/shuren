//课程组件DEMO
(function (jQuery) {
    jQuery.fn.extend({
        lvs_course_demo: function (token, idxid, curdata) {
            var crsbox = $(this);
            $(crsbox).SetData(curdata, { id: 1, title: "测试样板课程", titleimg: "images/demo1.jpg", status: "正常", seqid: 1, level:"小学一年级", module:"生命科学", desc: "这里是关于课程的描述内容", lesnnum: 10, memnum: 50, readnum: 239 });
            curdata.modules = [{ sname: "航空航天" }, { sname: "农业科学"}, { sname: "生命科学"}];
            curdata.levels = [{ id: 1, sname: "小学一年级" },{ id: 2, sname: "小学二年级" },{ id: 3, sname: "小学三年级" }];
            return this;
        }
    });
})(jQuery);


//课程列表
(function (jQuery) {
    jQuery.fn.extend({
        lvs_course_list: function (token, idxid, curdata) {
            var tchid = (idxid < 0) ? 0 - idxid : idxid;
            var crsbox = $(this);
            $(crsbox).bind("tagchange", function (evt, chgid, chgname) {
                var tag1 = $(crsbox).find("[lvs_elm=TagSel1]").size() > 0 ? $(crsbox).find("[lvs_elm=TagSel1]").cpn("cn.button.tagsel").getvalue() : "";
                var tag2 = $(crsbox).find("[lvs_elm=TagSel2]").size() > 0 ? $(crsbox).find("[lvs_elm=TagSel2]").cpn("cn.button.tagsel").getvalue() : "";
                for (var i = 0; i < curdata.list.length; i++) {
                    if ((curdata.list[i].seltag1 == tag1 || tag1 == "")&&(curdata.list[i].seltag2==tag2||tag2==""))
                        curdata.list[i].undisplay = 0;
                    else
                        curdata.list[i].undisplay = 1;
                }
                $(crsbox).find("[lvs_elm=CourseList]").loadcomponent("cn.list.flexlist", token, idxid, curdata, function () {
                });
            });
            var Lvs = LvsCore.Create();
            curdata.list = [];
            for( var i = 0; i < curdata.tmpls.length; i ++ ){
                curdata.list.push( { id: curdata.tmpls[i].id, title: curdata.tmpls[i].title, image: curdata.tmpls[i].titleimg, status: curdata.tmpls[i].module, basetrigger: "lesnsel", seltag1: curdata.tmpls[i].lvlid, seltag2: curdata.tmpls[i].module,tagname: curdata.tmpls[i].lvlname, opes: [{name: "备课", trigger: "perpare", butstyle: "border-red"},{name: "授课", trigger: "republish", butstyle: "border-green"}]});
            }
            $(crsbox).find("[lvs_elm=CourseList]").loadcomponent("cn.list.flexlist", token, idxid, curdata, function () {
            });
            $(crsbox).find("[lvs_elm=CourseList]").bind("lesnsel", function (e, tmplid) {
                var itembox = $(this);
                var DataEng = LvsData.Create();
                DataEng.GetData("leag/class_list", undefined, { access_token: token, gettype: "Class.TmplLesned", teacher: tchid, tmplid: tmplid }, function (apiname, params, result) {
                    if (result.hasOwnProperty("classes"))
                        curdata.crsclass = result.classes;
                    curdata.crstmplid = params.tmplid;
                    $('#CrsListForm').loadtmpl("cn.course.crslist", "#TmplLesnedTmpl", curdata, function () {
                        $('body').unidialog("#CrsListForm", { token: token, idxid: idxid }, function (curbt, curbox) {
                            var lesnid = $(curbox).getbind("classlist");
                            if (lesnid == undefined || lesnid == 0) {
                                $('body').closedialog();
                            }
                            else{
                                if( curdata.lesnref.indexOf( "router" ) == 0 ){
                                    Lvs.LvsRout( curdata.lesnref.split('.')[1], token, idxid, lesnid );
                                }
                                else
                                    location.href = curdata.lesnref.replace("$PAGEID", idxid).replace("$ID", lesnid);
                            }
                        });
                    });
                });
            });
            $(crsbox).find("[lvs_elm=CourseList]").bind("perpare", function (e, tmplid) {
                if( curdata.planref.indexOf( "router" ) == 0 )
                    Lvs.LvsRout( curdata.planref.split('.')[1], token, idxid, tmplid );
                else
                    location.href = curdata.planref.replace("$PAGEID", idxid).replace("$ID", tmplid);
            });
            $(crsbox).find("[lvs_elm=CourseList]").bind("republish", function (e, tmplid) {
                var DataEng = LvsData.Create();
                DataEng.GetData("leag/class_list", undefined, { access_token: token, gettype: "Class.TmplClass", teacher: tchid, tmplid: tmplid }, function (apiname, params, result) {
                    if (result.hasOwnProperty("classes"))
                        curdata.crsclass = result.classes;
                    curdata.crstmplid = params.tmplid;
                    $('body').unidialog("#cn.form.crsclass", { token: token, idxid: idxid, curdata: curdata }, function (curbt, curbox) {
                    });
                });
            });
        }
    });
})(jQuery);

//备课课程列表
(function (jQuery) {
    jQuery.fn.extend({
        lvs_precourse_list: function (token, idxid, curdata) {
            var tchid = (idxid < 0) ? 0 - idxid : idxid;
            var crsbox = $(this);
            $(crsbox).bind("tagchange", function (evt, chgid, chgname) {
                var tag1 = $(crsbox).find("[lvs_elm=TagSel1]").size() > 0 ? $(crsbox).find("[lvs_elm=TagSel1]").cpn("cn.button.tagsel").getvalue() : "";
                var tag2 = $(crsbox).find("[lvs_elm=TagSel2]").size() > 0 ? $(crsbox).find("[lvs_elm=TagSel2]").cpn("cn.button.tagsel").getvalue() : "";
                $(crsbox).find(".BaseListItem").each(function () {
                    if (($(this).attr("seltag1") == tag1 || tag1 == "" || tag1 == 0) && ($(this).attr("seltag2") == tag2 || tag2 == "" || tag2 == 0))
                        $(this).css("display", "");
                    else
                        $(this).css("display", "none");
                });
            });
            $(crsbox).find(".BaseListItem").bind("click tabend", function (e) {
                var itembox = $(this);
                var DataEng = LvsData.Create();
                if( $(e.target).attr("lvs_elm") == "CourseFile"){
                    DataEng.GetData( "edu/course_list", undefined, { access_token: token, gettype: "CrsTmpl.Files", crstmplid: $(e.target).attr("idxid") }, function( apiname, params, result){
                        curdata.files = result.files;
                        curdata.crstmplid = params.crstmplid;
                        $('body').unidialog( "#cn.course.crsfiles", { token: token, idxid: idxid, curdata: curdata }, function( curbt, curbox ){
                            DialogOk( curbt, curbox, token, idxid, $(this) );
                            $(itembox).setbind("FileNum", parseInt($(itembox).getbind("FileNum")) + 1 );
                        });
                    });
                }
                else if( $(e.target).attr("lvs_elm") == "CourseTask"){
                    DataEng.GetData("edu/course_list", undefined, { access_token: token, gettype: "CrsTmpl.TaskChlg", crstmplid: $(e.target).attr("idxid")}, function( apiname, params, result){
                        for( var i = 0; i < result.tasks.length; i ++ ){
                            if( result.tasks[i].type=="PlanB" )
                                result.tasks[i].taskitem = $.parseJSON( result.tasks[i].taskdesc );
                            else if( result.tasks[i].type == "Plan" )
                                result.tasks[i].taskitem = $.parseJSON( decodeURIComponent( result.tasks[i].taskdesc ) );
                        }
                        curdata.tasks = result.tasks;
                        $('body').unidialog("#cn.course.crstasks", { token: token, idxid: idxid, curdata: curdata }, function( curbt, curbox ){
                        });
                    });
                }
                else if( $(e.target).attr("lvs_elm") == "CourseEdit" ){
                    var apptype = $.cookie("fapptype" ) || "";
                    window.open( "../hpoam/lesnplan.htm?id=" + $(e.target).attr("idxid") + "&tn=" + (apptype=="Stem"?"fstem":apptype+"_ken"), "_blank" );
                }
                else if ($(e.target).attr("lvs_elm") == "CourseLesn") {
                    DataEng.GetData("leag/class_list", undefined, { access_token: token, gettype: "Class.TmplClass", teacher: tchid, tmplid: $(e.target).attr("idxid") }, function (apiname, params, result) {
                        if (result.hasOwnProperty("classes"))
                            curdata.crsclass = result.classes;
                        curdata.crstmplid = params.tmplid;
                        $('body').unidialog("#cn.form.crsclass", { token: token, idxid: idxid, curdata: curdata }, function (curbt, curbox) {
                        });
                    });
                }
                else {
                }
            });
        }
    });
})(jQuery);

//教案列表
(function (jQuery) {
    jQuery.fn.extend({
        lvs_course_solution: function (token, idxid, curdata) {
            var tchid = (idxid < 0) ? 0 - idxid : idxid;
            var crsbox = $(this);
            $(crsbox).find("[lvs_elm=DelSolu]").bind("click", function (e) {
                var opeelm = $(this);
                $('body').unidialog( "#DelForm", { token, idxid}, function(curbt, curbox){
                    lvsdata.GetData("edu/course_set", $(curbt), { access_token: token, crstmplid: curdata.id, opetype: "Tmpl.DelSolu", planid: curdata.solus[$(opeelm).attr("dataidx")].id}, function( apiname, params, result ){
                        $(opeelm).closest( ".CrsMainInfoBox" ).fadeOut(800, function(){ $(this).remove()});
                        $('body').closedialog();
                    });
                });
            });
            $(crsbox).find("[lvs_elm=AddSolu]").bind("click", function(){
                $('body').unidialog( "#AddSoluForm", {token, idxid}, function( curbt, curbox ){
                    lvsdata.GetData("edu/course_set", $(curbt), { access_token: token, crstmplid: curdata.id, opetype: "Tmpl.AddSolu", title: $(curbox).getbind("solutitle"), plandesc: $(curbox).getbind("soludesc")}, function( apiname, params, result ){
                        $('body').closedialog();
                        $(crsbox).trigger("refresh", [curdata.id]);
                    });
                });
            });
            $(crsbox).find("[lvs_elm=EditSolu]").bind("click",function(){
                var curbt = $(this);
                var dataidx = $(this).attr("dataidx");
                if($(this).text() == "保存" ){
                    lvsdata.GetData("edu/course_set", $(curbt), { access_token: token, crstmplid: curdata.id, planid: curdata.solus[dataidx].id, opetype: "Tmpl.SetSolu", title: $(crsbox).find('[lvs_elm=SoluTitle' + dataidx + ']').text(), plandesc: encodeURIComponent( $(crsbox).find("[lvs_elm=SoluItem" + dataidx + "]").getrichtext())}, function( apiname, params, result ){
                        $(curbt).text("编辑");
                        $(crsbox).find('[lvs_elm=SoluTitle' + dataidx + ']').attr("contenteditable", "false");
                        $(crsbox).find('[lvs_elm=SoluItem' + dataidx + ']').html( decodeURIComponent( params.plandesc ));
                    });
                }
                else{
                    var curtext = $(crsbox).find('[lvs_elm=SoluItem' + dataidx + ']').html();
                    $(crsbox).find('[lvs_elm=SoluItem' + dataidx + ']').loadcomponent("cn.form.richedit", token, idxid, {text: curtext}, function(){
                    });
                    $(crsbox).find('[lvs_elm=SoluTitle' + dataidx + ']').attr("contenteditable", "true");
                    $(curbt).text("保存");
                }
            });
        }
    });
})(jQuery);

//课程附件
(function (jQuery) {
    jQuery.fn.extend({
        lvs_course_files: function (token, idxid, curdata) {
            var tchid = (idxid < 0) ? 0 - idxid : idxid;
            var crsbox = $(this);
            $(crsbox).find("[lvs_elm=UploadFile]").bind("click", function (e) {
                if( $(this).closest(".DialogBox").size() > 0 )
                    $(crsbox).find(".UplaodFilePanel").fadeIn( 500 );
                else
                    $('#OperateForm').loadtmpl( "cn.course.crsfiles", "#UploadTmpl", curdata, function(){
                        $('body').unidialog( "#OperateForm", { token: token, idxid: idxid, dlgwidth:50}, function( curbt, curbox ){
                            var DataEng = LvsData.Create();
                            DataEng.GetData( "edu/course_set", $(curbt), { access_token: token, crstmplid: curdata.id, filedesc: $(curbox).getbind("filedesc"), fileurl: $(curbox).getbind("fileurl"), opetype: "Tmpl.AddFile"}, function( apiname, params, result ){
                                curdata.files.push( {id: result.fileid, name: result.name, url: result.url, desc: result.desc } );
                                $('body').closedialog();
                                $(crsbox).parent().loadcomponent( "cn.course.crsfiles", token, idxid, curdata, function(){
                                });
                            });
                        });
                    });
            });
            $(crsbox).find("[lvs_elm=DelCrsFile]").bind("click", function(){
                var dataidx = $(this).attr("dataidx");
                var fileid = curdata.files[dataidx].id;
                $('body').unidialog("#DelFileForm", {token, idxid}, function( curbt, curbox ){
                    lvsdata.GetData("edu/course_set", $(curbt), { access_token: token, crstmplid: curdata.id, fileid: fileid, opetype: "Tmpl.DelFile"}, function( apiname, params, result ){
                        $('body').closedialog();
                        curdata.files.splice( dataidx, 1 );
                        $(crsbox).parent().loadcomponent( "cn.course.crsfiles", token, idxid, curdata, function(){
                        });
                    });
                });
            });
        }
    });
})(jQuery);

//课程列表
(function (jQuery) {
    jQuery.fn.extend({
        lvs_course_subjcrs: function (token, idxid, curdata) {
            var tchid = (idxid < 0) ? 0 - idxid : idxid;
            var crsbox = $(this);
            var tagdata = { tags: [{sid: 1, sname: "我的", isdef: 1 }], title: "作者", isall: 1 };
            $(crsbox).find("[lvs_elm=TagSel3]").loadcomponent( "cn.button.tagsel", token, idxid, tagdata, function(){
            });
            $(crsbox).bind("tagchange", function (evt, chgid, chgname) {
                var tag1 = $(crsbox).find("[lvs_elm=TagSel1]").size() > 0 ? $(crsbox).find("[lvs_elm=TagSel1]").cpn("cn.button.tagsel").getvalue() : "";
                var tag2 = $(crsbox).find("[lvs_elm=TagSel2]").size() > 0 ? $(crsbox).find("[lvs_elm=TagSel2]").cpn("cn.button.tagsel").getvalue() : "";
                var tag3 = $(crsbox).find("[lvs_elm=TagSel3]").size() > 0 ? $(crsbox).find("[lvs_elm=TagSel3]").cpn("cn.button.tagsel").getvalue() : "";
                for (var i = 0; i < curdata.list.length; i++) {
                    if ((curdata.list[i].seltag1 == tag1 || tag1 == "") && (curdata.list[i].seltag2 == tag2 || tag2 == "") && (curdata.list[i].seltag3 == tag3 || tag3 == 0))
                        curdata.list[i].undisplay = 0;
                    else
                        curdata.list[i].undisplay = 1;
                }
                $(crsbox).find("[lvs_elm=CourseList]").loadcomponent("cn.list.flexlist", token, idxid, curdata, function () {
                });
            });
            $(crsbox).find("[lvs_elm=AddCourse]").click(function(){
                $('body').unidialog( "AddCrsForm", { token: token, idxid: idxid }, function( curbt, curbox ){
                    lvsdata.GetData( "edu/course_set", $(curbt), { access_token: token, author: idxid, opetype: "Crs.Add", subjects: $(curbox).getbind("subjects"), crsname: $(curbox).getbind("crsname"), piclist: $(curbox).getbind("piclist"), crsgrade: $(curbox).getbind("crsgrade")}, function( apiname, params, result ){
                        $('body').closedialog();
                        lvs.LvsRout( "tchcrs", token, idxid, result.id );
                    });
                });
            });
            Lvs = LvsCore.Create();
            curdata.list = [];
            for (var i = 0; i < curdata.courses.length; i++) {
                var opes = [];
                if( curdata.courses[i].isself > 0 )
                    opes.push( { name: "Edit", trigger: "edit", butclass: "float-right", butstype: "EditStl" } );
                var gradestr = "常规课程";
                if( curdata.courses[i].grade == "Career" )
                    gradestr = "项目化课程";
                else if( curdata.courses[i].grade == "Tmpl" )
                    gradestr = "项目化模板";
                curdata.list.push({ id: curdata.courses[i].id, title: curdata.courses[i].name, desc: "创建者：" + curdata.courses[i].authname, image: curdata.courses[i].titleimg, status: gradestr + "【" + curdata.courses[i].subjects + "】", basetrigger: "coursesel", seltag1: curdata.courses[i].subjects, seltag2: curdata.courses[i].gradeid, seltag3: curdata.courses[i].isself, tagname: curdata.courses[i].subjects, opes: opes });
            }
            //$(crsbox).find("[lvs_elm=CourseList]").loadcomponent("cn.list.flexlist", token, idxid, curdata, function () {
            //});
            $(crsbox).find("[lvs_elm=CourseList]").bind("coursesel", function (e, courseid) {
                var itembox = $(this);
                if( lvsdata.GetById( curdata.courses, {id: courseid} ).grade=="Career" || lvsdata.GetById( curdata.courses, {id: courseid} ).grade=="Tmpl" )
                    lvs.LvsRout("crstmpl_pbl", token, idxid, courseid );
                else
                    lvs.LvsRout( "crstmpls", token, idxid, courseid );
            });
            $(crsbox).find("[lvs_elm=CourseList]").bind("edit", function( e, courseid, crsname ){
                var curcourse = {};
                for( var i = 0; i < curdata.courses.length; i ++ ){
                    if( curdata.courses[i].id == courseid ){
                        curcourse = curdata.courses[i];
                        break;
                    }
                }
                if( curcourse.id != undefined ){
                    curcourse.subjs = curdata.subjs;
                    $("#OperateForm").loadtmpl( "cn.course.subjcrs", "#UpdCrsTmpl", curcourse, function(){
                        $('body').unidialog( "#OperateForm", { access_token: token, idxid: idxid }, function( curbt, curbox ){
                            if($(curbt).attr("opetype") == "Upd" ){
                                lvsdata.GetData("edu/course_set", $(curbt), { access_token: token, courseid: courseid, opetype: "Crs.Update", subjects: $(curbox).getbind("subjects"), crsname: $(curbox).getbind("crsname"), piclist: $(curbox).getbind("piclist"), crsgrade: $(curbox).getbind("crsgrade")}, function( apiname, params, result){
                                    for( var i = 0; i < curdata.list.length; i ++ ){
                                        if( curdata.list[i].id == courseid ){
                                            curdata.list[i].title = params.crsname;
                                            curdata.list[i].status = params.subjects;
                                            curdata.list[i].imgage = $(curbox).find("[lvs_bind=piclist]").find("img").attr("src");
                                            break;
                                        }
                                    }
                                    $('body').closedialog();
                                    $(crsbox).find("[lvs_elm=CourseList]").loadcomponent("cn.list.flexlist", token, idxid, curdata, function () {
                                    });
                                });
                            }
                            else if( $(curbt).attr("opetype") == "Del" ){
                                $('body').unidialog("#DelCrsForm", { token, idxid }, function( curbt, curbox ){
                                    lvsdata.GetData("edu/course_set", $(curbt), { access_token: token, courseid: courseid, opetype: "Crs.Delete"}, function( apiname, params, result){
                                        $('body').closedialog();
                                        for( var i = 0; i < curdata.list.length; i ++ ){
                                            if( curdata.list[i].id == courseid ){
                                                curdata.list.splice( i, 1 );
                                                break;
                                            }
                                        }
                                        $(crsbox).find("[lvs_elm=CourseList]").loadcomponent("cn.list.flexlist", token, idxid, curdata, function () {
                                        });
                                    });
                                });
                            }
                        });
                    });
                }
            });
        }
    });
})(jQuery);

//课程列表模式展示
(function (jQuery) {
    jQuery.fn.extend({
        lvs_course_crstmpls: function (token, idxid, curdata) {
            var tchid = (idxid < 0) ? 0 - idxid : idxid;
            var crsbox = $(this);
            Lvs = LvsCore.Create();
            var crslist = [];
            var tmpllist = [];
            $(crsbox).find("[lvs_elm=AddCrs]").bind("click", function(){
                $('body').unidialog( "#AddCrsTmplForm", { token: token, idxid: idxid }, function( curbt, curbox ){
                    var DataEng = LvsData.Create();
                    DataEng.GetData( "edu/course_set", $(curbt), DataEng.GetParams({access_token: token, courseid: curdata.courseid, crstmpltype:'教案', opetype: "Tmpl.Create"}, $(curbox)), function( apiname, params, result ){
                        $('body').closedialog();
                        for( var i = 0 ;i < crslist.length; i ++ )
                            crslist[i].isdef = 0;
                        crslist.push({id:result.id, seqid: result.seqid, title: result.title, image: result.titleimg, basetrigger: "tmplsel", isdef : 1 });
                        $(crsbox).find("[lvs_elm=CrsList]").loadcomponent("cn.list.baselist", token, idxid, {list: crslist}, function () {
                        });
                    });
                });
            });
            $(crsbox).find("[lvs_elm=AddTmpl]").bind("click", function(){
                $('body').unidialog( "#AddTmplForm", { token: token, idxid: idxid }, function( curbt, curbox ){
                    var DataEng = LvsData.Create();
                    DataEng.GetData( "edu/course_set", $(curbt), DataEng.GetParams({access_token: token, courseid: curdata.courseid, crstmpltype:'模板', opetype: "Tmpl.Create"}, $(curbox)), function( apiname, params, result ){
                        $('body').closedialog();
                        for( var i = 0 ;i < tmpllist.length; i ++ )
                            tmpllist[i].isdef = 0;
                        tmpllist.push({id:result.id, title: result.title, image: result.titleimg, basetrigger: "tmplsel", isdef : 1 });
                        curdata.basetmpls.push({id:result.id, title: result.title, image: result.titleimg });
                        $(crsbox).find("[lvs_elm=TmplList]").loadcomponent("cn.list.baselist", token, idxid, {list: tmpllist}, function () {
                        });
                    });
                });
            });
            for (var i = 0; i < curdata.tmpls.length; i++) {
                crslist.push({ id: curdata.tmpls[i].id, seqid: curdata.tmpls[i].seqid, title: curdata.tmpls[i].title, image: curdata.tmpls[i].titleimg, basetrigger: "tmplsel" });
            }
            $(crsbox).find("[lvs_elm=CrsList]").loadcomponent("cn.list.baselist", token, idxid, {list: crslist}, function () {
            });
            for (var i = 0; i < curdata.basetmpls.length; i++) {
                tmpllist.push({ id: curdata.basetmpls[i].id, seqid: curdata.basetmpls[i].seqid, title: curdata.basetmpls[i].title, image: curdata.basetmpls[i].titleimg, basetrigger: "tmplsel" });
            }
            $(crsbox).find("[lvs_elm=TmplList]").loadcomponent("cn.list.baselist", token, idxid, {list: tmpllist}, function () {
            });
            $(crsbox).bind("tmplsel", function (e, crstmplid) {
                var DataEng = LvsData.Create();
                DataEng.GetData("edu/course_list", $(crsbox).find("[lvs_elm=CrsTmplBox]").html(""), { access_token: token, crstmplid: crstmplid, gettype: "CrsTmpl.Base"}, function( apiname, params, result ){
                    
                    $(crsbox).find("[lvs_elm=CrsTmplBox]").loadcomponent("cn.course.crstmplbase", token, idxid, result, function(){
                    });
                });
            });
        }
    });
})(jQuery);

//课程列表模式展示
(function (jQuery) {
    jQuery.fn.extend({
        lvs_crstmpl_base: function (token, idxid, curdata) {
            var tchid = (idxid < 0) ? 0 - idxid : idxid;
            var crsbox = $(this);
            curdata.list = curdata.modules;
            curdata.listtrigger = "listsel";
            if( $(crsbox).find("[lvs_elm=CrstmplList]").size() > 0 )
                $(crsbox).find("[lvs_elm=CrstmplList]").css("height", $(window).height() - $(crsbox).find("[lvs_elm=CrstmplList]").offset().top - $('.BaseFoot').height() - 40 );
            if( curdata.tmpls){
                if( curdata.modules.length == 0 && curdata.tmpls.length>0)
                    curdata.list.push({id: 0, sname: "缺省课程阶段"});
                for( var i = 0; i < curdata.list.length; i ++)
                    curdata.list[i].seqid = curdata.list[i].id;
                for( var i = 0; i < curdata.tmpls.length; i ++ ){
                    for(var j = 0; j < curdata.list.length; j ++ ){
                        if( curdata.list[j].sname == "" )
                            curdata.list[j].sname = "缺省";
                        if( curdata.tmpls[i].modseq == curdata.list[j].id ){
                            if( curdata.list[j].sub == undefined )
                                curdata.list[j].sub = [];
                            curdata.list[j].sub.push({id: curdata.tmpls[i].id, subseq: (curdata.tmpls[i].modseq>0?curdata.tmpls[i].modseq+ ".":"") + curdata.tmpls[i].seqid, sname: curdata.tmpls[i].title, type: curdata.tmpls[i].tmpltype, seqid: curdata.tmpls[i].seqid, trigger: "subsel"});
                            isfind = 1;
                            break;
                        }
                    }
                }
                curdata.expted = 1;
                curdata.subedit = "subedit";
                curdata.listedit = "listedit";
                $(crsbox).find("[lvs_elm=CrstmplList]").loadcomponent("cn.list.explist", token, idxid, curdata, function(){
                });
                $(crsbox).find("[lvs_elm=CrstmplList]").bind("listedit", function(e, dataidx){
                    var listdata = curdata.list[dataidx];
                    $('#EditModSeqForm').loadtmpl("cn.course.crstmpl_pbl", "#EditModSeqTmpl", {list: [{seqid: listdata.seqid, sname: listdata.sname, sub:[]}]}, function(){
                        $('body').unidialog( "#EditModSeqForm", { token, idxid}, function( curbt, curbox ){
                            lvsdata.GetData("edu/course_set", $(curbt), { access_token: token, courseid: curdata.id, opetype: "Tmpl.SetModSeqs", updval: listdata.seqid + "," + listdata.sname + "," + $(curbox).getbind("modseq") + "," + $(curbox).getbind("module")}, function( apiname, params, result ){
                                $('body').closedialog();
                                curdata.list = result.list;
                                curdata.modules = result.modules;
                                $(crsbox).find("[lvs_elm=CrstmplList]").loadcomponent("cn.list.explist", token, idxid, curdata, function(){
                                });
                            });
                        });
                    });
                });
                $(crsbox).find("[lvs_elm=CrstmplList]").bind("subedit", function(e, dataidx1, dataidx2){
                    var subdata = curdata.list[dataidx1].sub[dataidx2];
                    subdata.module = curdata.list[dataidx1].sname;
                    subdata.modules = curdata.modules;
                    $('#EditModSeqForm').loadtmpl("cn.course.crstmpl_pbl", "#EditCrsTmpl", subdata, function(){
                        $('body').unidialog( "#EditModSeqForm", { token, idxid, modules: curdata.modules}, function( curbt, curbox ){
                            lvsdata.GetData("edu/course_set", $(curbt), { access_token: token, crstmplid: subdata.id, opetype: "Tmpl.SetTmplSeq", crstmplmodule: $(curbox).getbind("crsmodule"), seqid: $(curbox).getbind("crsseqid"), crstmplname: $(curbox).getbind("crstitle")}, function( apiname, params, result ){
                                curdata.list = result.list;
                                curdata.modules = result.modules;
                                $('body').closedialog();
                                $(crsbox).find("[lvs_elm=CrstmplList]").loadcomponent("cn.list.explist", token, idxid, curdata, function(){
                                });
                            });
                        });
                    });
                });
                $(crsbox).find("[lvs_elm=CrstmplList]").bind("addlist", function(){
                    $(crsbox).find("[lvs_elm=AddCrsTmpl]").click();
                });
                $(crsbox).find("[lvs_elm=CrstmplList]").bind("listsel",function(e, modseq, dataidx){
                    $(crsbox).find("[lvs_elm=CrsTmplOpe]").show();
                    $(crsbox).find("[lvs_elm=CrsTmplBox]").hide();
                });
                $(crsbox).find("[lvs_elm=CrstmplList]").bind("subsel", function(e, crstmplid, dataidx1, dataidx2){
                    $(crsbox).find("[lvs_elm=CrsTmplOpe]").hide();
                    $(crsbox).find("[lvs_elm=CrsTmplBox]").show();
                    lvsdata.GetData("edu/course_list", $(crsbox).find("[lvs_elm=CrsTmplBox]").html(""), {access_token: token, crstmplid: crstmplid, gettype: "CrsTmpl.Base"}, function( apiname, params, result ){
                        result.grade = curdata.grade;
                        $(crsbox).find("[lvs_elm=CrsTmplBox]").loadcomponent("cn.course.crstmpl_plan", token, idxid, result, function(){
                        });
                    });
                });
            }
            $(crsbox).find("[lvs_elm=EditModule]").click(function(){
                $('#EditModSeqForm').loadtmpl("cn.course.crstmpl_pbl", "#EditModSeqTmpl", {list: curdata.list}, function(){
                    $('body').unidialog( "#EditModSeqForm", { token: token, idxid: idxid}, function( curbt, curbox ){
                        var updstr = "";
                        $(curbox).find(".UpdItem").each(function(n){
                            if( updstr != "" )
                                updstr += "|";
                            updstr += curdata.list[n].id + "," + curdata.list[n].sname + "," + $(this).getbind("modseq") + "," + $(this).getbind("module");
                        });
                        var updtmplstr = "";
                        $(curbox).find(".UpdTmplItem").each(function(n){
                            if( updtmplstr != "" )
                                updtmplstr += "|";
                            updtmplstr += $(this).attr("idxid") + "," + $(this).getbind("tmplseq") + "," + $(this).getbind("tmplname");
                        });
                        lvsdata.GetData( "edu/course_set", $(curbt), { access_token: token, courseid: curdata.id, updval: updstr, updtmpls: updtmplstr, opetype: "Tmpl.SetModSeqs"}, function(apiname, params, result){
                            curdata.list = result.list;
                            curdata.modules = result.modules;
                            $('body').closedialog();
                            $(crsbox).find("[lvs_elm=CrstmplList]").loadcomponent("cn.list.explist", token, idxid, curdata, function(){
                            });
                        });
                    });
                });
            });
            $(crsbox).find("[lvs_elm=AddCrsTmpl]").click(function(){
                var curselidx = $(crsbox).find("[lvs_elm=CrstmplList]").cpn("cn.list.explist").getlistidx();
                var selmodule = curselidx == undefined ? "" : curselidx.indexOf( "," ) == -1 ? curdata.list[curselidx].sname : curdata.list[ curselidx.split(',')[0]].sname;
                var selseqid = curselidx == undefined ? "" : curselidx.indexOf(",") == -1 ? "" : curdata.list[ curselidx.split(',')[1]].seqid;
                curdata.curval = selmodule;
                $("#AddTmplForm").loadtmpl("cn.course.crstmpl_pbl", "#AddModuleTmpl", curdata, function(){
                    $('body').unidialog("#AddTmplForm", {token,idxid}, function(curbt, curbox){
                        if($(curbt).attr("opetype") == "AddOk"){
                            var ctnames = "";
                            $(curbox).find(".TmplItem").each(function(){
                                if( ctnames != "" )
                                    ctnames += "|";
                                ctnames += $(this).getbind("tmplname");
                            });
                            lvsdata.GetData("edu/course_set", $(curbt), { access_token: token, courseid: curdata.id, opetype: "Tmpl.Create", tmpltype: "教案", modseq: $(curbox).getbind("modseq"), module: $(curbox).find("[lvs_bind=modseq]").text(), crstmplname: $(curbox).getbind("tmplname"), ctnames: ctnames, curseqid: selseqid, crtnum: 1, daynum: $(curbox).getbind("daynum")}, function( apiname, params, result ){
                                curdata.list = result.list;
                                curdata.modules = result.modules;
                                $('body').closedialog();
                                $(crsbox).find("[lvs_elm=CrstmplList]").loadcomponent("cn.list.explist", token, idxid, curdata, function(){
                                });
                            });
                        }
                        else if( $(curbt).attr("opetype") == "AddItem"){
                            var itemstr = $(curbt).closest(".TmplItem").html();
                            $(curbt).closest(".TmplItem").after("<div class=\"TmplItem\">" + itemstr + "</div>" );
                        }
                    });
                });
            });
            $(crsbox).find("[lvs_elm=RefreshPage]").click(function(){
                lvs.LvsRout("crstmpl_pbl", token, idxid, curdata.id );
            });
            $(crsbox).find("[lvs_bind]").bind("click", function(){
                var bindbox = $(this);
                var tmplid = $(this).attr("tmplid") || curdata.id || $(this).attr("idxid");
                    var formdata = { token: token, idxid: curdata.id, idxkey: $(this).attr("lvs_bind"), idxval: $(this).parent().getbind($(this).attr("lvs_bind")), idxname: $(this).attr("idxname"), idxtype: $(this).attr("idxtype"), idxserial: $(this).attr("idxserial") };
                    $('body').formdialog( formdata, function(curbt, curbox){
                        var DataEng = LvsData.Create();
                        var updparams = { access_token: token, crstmplid: tmplid, opetype: "TmplUpd." + formdata.idxkey, updval: $(curbox).getbind(formdata.idxkey) };
                        DataEng.GetData("edu/course_set", $(curbt), updparams, function( apiname, params, result ){
                            $('body').closepanel();
                            $('body').closedialog();
                            var setdata = {};
                            setdata[ formdata.idxkey] = result.updval || params.updval;
                            $(bindbox).parent().SetData( curdata, setdata );
                        });
                    });
            });
            $(crsbox).find("[lvs_elm=StepItem]").click(function( e ){
                if( $(e.target).attr("lvs_bind") == undefined ){
                    $(crsbox).find(".TaskStepItemSel").removeClass("TaskStepItemSel" );
                    $(this).addClass("TaskStepItemSel");
                    var curidx = $(this).attr("dataidx");
                    if( curidx < curdata.tmpls.length ){
                        if( curdata.grade == "Proj" )
                            curdata.tmpls[curidx].tasknames = [{name: "项目描述教程", id: "ProjPlan"},{name: "项目任务目标", id: "TaskReq"},{name: "任务提交及评审", id: "TaskIng"}];
                        else
                            curdata.tmpls[curidx].tasknames = [{name: "课程讲义", id: "PlayPlan"},{name: "任务要求", id: "TaskReq"},{name: "任务提交与评审", id: "TaskIng"}];
                        lvs.BindTmpl("#cn.crsplan.crspblstep", $(crsbox).find('#TaskInfoBox').html(""), token, idxid, curdata.tmpls[curidx], function(){
                        });
                    }
                }
            });
            $(crsbox).find(".TaskStepItemSel").click();
            $(crsbox).find("[lvs_elm=CoursePlay]").bind("click", function(){
                $(this).parent().parent().find(".WSBaseTab").find(".active").removeClass("active" );
                $(this).addClass("active");
                $(this).parent().parent().find("[tabcontainer]").hide(300);
                $('[tabcontainer=data]').html("").show( 500, function(){
                    curdata.autoplay = 1;
                    curdata.preview = 1;
                    $(crsbox).find("[lvs_elm=CourseMore]").html("").loadcomponent( "cn.play.lesnplay", token, idxid, curdata, function(){
                    });
                });
            });
            $(crsbox).find("[lvs_elm=TaskPlay]").bind("click", function(){
                $(this).parent().parent().find(".WSBaseTab").find(".active").removeClass("active" );
                $(this).addClass("active");
                $(this).parent().parent().find("[tabcontainer]").hide(300);
                $('[tabcontainer=data]').html("").show( 500, function(){
                    lvsdata.GetData("edu/course_list", $(crsbox).find("[lvs_elm=CourseMore]").html(""), { access_token: token, crstmplid: curdata.id, gettype: "CrsTmpl.Tasks"}, function( apiname, params, result ){
                        result.preview = 1;
                        result.playtype = "task";
                        result.istch = 1;
                        result.id = curdata.id;
                        $(crsbox).find("[lvs_elm=CourseMore]").html("").loadcomponent( "cn.play.pageshow", token, idxid, result, function(){
                        });
                    });
                });
            });
            $(crsbox).find("[lvs_elm=AddStep]").click(function(){
                $('body').unidialog( "#AddStepForm", { token: token, idxid: idxid}, function( curbt, curbox ){
                    lvsdata.GetData("edu/course_set", $(curbt), { access_token: token, courseid: curdata.id, opetype: "Tmpl.Create", tmpltype: "教案", moduleseq: curdata.curmoduleseq, module: curdata.curmodule, crstmplname: $(curbox).getbind("crstmplname"), crtnum: 1, daynum: $(curbox).getbind("daynum")}, function( apiname, params, result ){
                        $('body').closedialog();
                        curdata.tmpls.push({id: result.id, title: params.crstmplname, courseid: curdata.courseid, tmpltype: params.tmpltype, moduleseq: params.moduleseq, module: params.module, daynum: params.daynum, seqid: $(crsbox).find('.TaskStepItem').size() + 1});
                        $(crsbox).parent().loadcomponent("cn.course.crstmpl_pbl", token, idxid, curdata, function(){
                            
                        });
                    });
                });
            });
            $(crsbox).find("[lvs_elm=PublishClass]").click(function(){
                $('body').unidialog( "#PublishClassForm", { access_token: token, idxid}, function( curbt, curbox ){
                    lvsdata.GetData("leag/class_set", $(curbt), { access_token: token, courseid: curdata.id, opetype: "ShotAdd", classtype: "项目", classname: $(curbox).getbind("classname"), islesn: 1, teacher: tchid}, function( apiname, params, result ){
                        $('body').closedialog();
                        lvs.LvsRout("projteam", token, idxid, result.id );
                    });
                });
            });
            $(crsbox).find("[lvs_elm=EditCourse]").click(function(){
                $('body').unidialog( "#EditCourseForm", { token: token, idxid: idxid }, function( curbt, curbox ){
                    lvsdata.GetData("edu/course_set", $(curbt), lvsdata.GetParams({ access_token: token, courseid: curdata.id, opetype: "Crs.Update"}, $(curbox)), function( apiname, params, result ){
                        $('body').closedialog();
                        curdata.sname = params.crsname;
                        curdata.title = params.crsname;
                        curdata.crsdesc = params.crsdesc;
                        curdata.titleimg = result.titleimg;
                        $(crsbox).parent().loadcomponent( (curdata.grade=='Proj'?"cn.course.subjproj_pbl": "cn.course.crstmpl_pbl"), token, idxid, curdata, function(){
                        });
                    });
                });
            });
            $(crsbox).find("[lvs_elm=SelModules]").click(function(){
                $('body').unidialog( "#SelModuleForm", { token: token, idxid: idxid, closing: 1}, function( curbt, curbox ){
                    if( $(curbt).attr("opetype") == "SelOk" ){
                        curdata.curmoduleseq = $(curbt).attr("idxid");
                        curdata.curmodule = $(curbt).attr("idxname");
                        $('body').closedialog();
                        $(crsbox).parent().loadcomponent("cn.course.crstmpl_pbl", token, idxid, curdata, function(){
                        });
                    }
                    else if( $(curbt).attr("opetype") == "AddModule" ){
                        $(curbox).find("[lvs_elm=AddModBox]").css("display", "");
                    }
                    else if( $(curbt).attr("opetype") == "EditModule"){
                        alert("暂不允许修改课程名称" );
                    }
                    else{
                        lvsdata.GetData("edu/course_set", $(curbt), { access_token: token, opetype: "Tmpl.CrtModule", crstmplmodule: $(curbox).getbind("module"), courseid: curdata.id}, function( apiname, params, result ){
                            curdata.modules.push( { id: result.id, sname: params.crstmplmodule } );
                            curdata.curmoduleseq = result.id;
                            curdata.curmodule = params.crstmplmodule;
                            lvsdata.GetData("edu/course_list", $(curbt), { access_token: token, courseid: curdata.id, gettype: "Crs.Tmpls", estudid: idxid, curseq: -1 }, function( apiname, params, result ){
                                result.curmoduleseq = curdata.curmoduleseq;
                                result.curmodule = curdata.curmodule;
                                $(crsbox).parent().loadcomponent("cn.course.crstmpl_pbl", token, idxid, result, function(){
                                });
                            });
                            $('body').closedialog();
                        });
                    }
                });
            });
            $(crsbox).find("[lvs_elm=TagClassSel]").find(".TagItem").click(function(){
                var tagclsid = $(this).attr("idxid");
                $(crsbox).find("[lvs_elm=ClassSel]").val( tagclsid ).change();
            });
            $(crsbox).find("[lvs_elm=ClassSel]").change(function(){
                var clsid = $(this).val();
                for( var i = 0; i < curdata.classes.length; i ++ ){
                    if( clsid == curdata.classes[i].id ){
                        curdata.classid = clsid;
                        curdata.classtype = curdata.classes[i].type;
                    }
                }
                $(crsbox).find("[lvs_elm=TagClassSel]").find(".TagActive").removeClass("TagActive");
                $(crsbox).find("[lvs_elm=TagClassSel]").find("[idxid=" + clsid + "]").addClass("TagActive");
                if( clsid > 0 ){
                    lvsdata.GetData("leag/lesn_list", $(crsbox).find("[lvs_elm=ClsCrsTmplList]").html(""), { access_token: token, classid: clsid, stattype: "tasking", gettype: "Lesn.ModuleLesns"}, function( apiname, params, result ){
                        var clsdata = { list: []};
                        for( var i = 0; i < result.modules.length; i ++ ){
                            var moddata = { id: result.modules[i].modseq, sname: result.modules[i].module, trigger:"modsel", sub:[]};
                            for(var j = 0; j < result.modules[i].sub.length; j ++ ){
                               moddata.sub.push({id: result.modules[i].sub[j].id, sname: result.modules[i].sub[j].title, type: result.modules[i].sub[j].type, seqid: result.modules[i].sub[j].seqid, tipnum: result.modules[i].sub[j].tasknum, tipname: "提交作业/任务数量", trigger: "lesnsel"});
                            }
                            clsdata.list.push( moddata );
                        }
                        clsdata.expted = 1;
                        clsdata.listtrigger = "listsel";
                        $(crsbox).find("[lvs_elm=ClsCrsTmplList]").loadcomponent("cn.list.explist", token, idxid, clsdata, function(){
                        });
                    });
                }
            });
            $(crsbox).find("[lvs_elm=ClsCrsTmplList]").bind("listsel", function(e, modseq, modidx){
                lvsdata.GetData("leag/class_list", $(crsbox).find("[lvs_elm=ClsCrsTmplBox]").html(""), { access_token: token, classid: curdata.classid, gettype: "Class.TeamStat", islesn: 1, seq: 1, estudid: idxid, modseq: modseq, module: curdata.modules[modidx].sname }, function( apiname, params, result ){
                    result.params = params;
                    $(crsbox).find("[lvs_elm=ClsCrsTmplBox]").loadcomponent( "cn.lesn.lesngrouppanel", token, idxid, result, function(){
                    });
                });
            });
            $(crsbox).find("[lvs_elm=ClsCrsTmplList]").bind("lesnsel", function(e,lesnid){
                $(crsbox).find("[lvs_elm=ClsCrsTmplBox]").loadcomponent("cn.lesn.lesntasks", token, idxid, {id: lesnid, classtype: curdata.classtype }, function(){
                    if( $(crsbox).find("[lvs_elm=ClsCrsTmplBox]").find("[tabdef=1]").size() > 0 )
                        $(crsbox).find("[lvs_elm=ClsCrsTmplBox]").find("[tabdef=1]").click();
                });
            });
            $(crsbox).find("[lvs_elm=SaveTmpl]").click(function(){
                $('body').unidialog("#SaveTmplForm", { token: token, idxid: idxid}, function( curbt, curbox ){
                    lvsdata.GetData("edu/course_set", $(curbt), { access_token: token, courseid: curdata.id, opetype: "Crs.SaveTmpl", crsname: $(curbox).getbind("crsname"), crsdesc: $(curbox).getbind("crsdesc"), moduleseq: curdata.curmoduleseq, module: curdata.curmodule}, function( apiname, params, result ){
                        var tips = ErrorTip.Create();
                        tips.Show("项目学习模板：" + params.crsname + "已保存完毕，在其他项目中可加载使用", function(){
                            $('body').closedialog();
                        });
                    });
                });
            });
            $(crsbox).find("[lvs_elm=LoadTmpl]").click(function(){
                lvsdata.GetData("edu/course_list", $(this), { access_token: token, courseid: curdata.id, moduleseq: curdata.curmoduleseq, module: curdata.curmodule, gettype: "Crs.LoadTmpls" }, function( apiname, params, result ){
                    $(crsbox).find('#LoadTmplForm').loadtmpl( "cn.course.crstmpl_pbl", "#LoadsTmpl", result, function(){
                        $('body').unidialog( "#LoadTmplForm", { token: token, idxid: idxid}, function( curbt, curbox ){
                            lvsdata.GetData("edu/course_set", $(curbt), { access_token: token, courseid:curdata.id, opetype:"Crs.LoadTmpl", loadcrsid: $(curbox).getbind("loadid"), moduleseq: curdata.curmoduleseq, module: curdata.curmodule,}, function( apiname, params, result ){
                                lvsdata.GetData("edu/course_list", $(curbt), { access_token: token, courseid: curdata.id, gettype: "Crs.Tmpls", estudid: idxid, curseq: -1 }, function( apiname, params, result ){
                                    result.curmoduleseq = curdata.curmoduleseq;
                                    result.curmodule = curdata.curmodule;
                                    $(crsbox).parent().loadcomponent("cn.course.crstmpl_pbl", token, idxid, result, function(){
                                    });
                                });
                                $('body').closedialog();
                            }); 
                        });
                    });
                });
            });
            $('body').keyup( function( e ){
                if( e.keyCode == 37 ){//左键
                    if( $(crsbox).find(".TaskStepItemSel").size() == 1 ){
                        var curidx = parseInt($(crsbox).find(".TaskStepItemSel").attr("dataidx"));
                        if( curidx > 0 ){
                            $(crsbox).find(".TaskStepItem" ).each(function(){
                                if( $(this).attr("dataidx") == curidx - 1 )
                                    $(this).click();
                            });
                        }
                    }
                }
                else if( e.keyCode == 39 ){//右
                    if( $(crsbox).find(".TaskStepItemSel").size() == 1 ){
                        var curidx = parseInt($(crsbox).find(".TaskStepItemSel").attr("dataidx"));
                            $(crsbox).find(".TaskStepItem" ).each(function(){
                                if( $(this).attr("dataidx") == curidx + 1 )
                                    $(this).click();
                            });
                    }
                }
            });
        }
    });
})(jQuery);

//备课内容列表显示
(function (jQuery) {
    jQuery.fn.extend({
        lvs_crstmpl_plan: function (token, idxid, curdata) {
            var tchid = (idxid < 0) ? 0 - idxid : idxid;
            var crsbox = $(this);
            curdata.crstmplid = curdata.id;
            //内容框大小调整
            $(crsbox).find("[lvs_elm=MainTabBox]").each(function(){
                $(this).css("height", $(window).height() - $(this).offset().top - $('.BaseFoot').height() - 40).css("overflow", "auto");
            });
            //课件页面预览及点击处理
            $(crsbox).find("[lvs_elm=PagePreview]").each(function(){
                var curpage = curdata.pages[$(this).attr("dataidx")];
                if( curpage.item == undefined && curpage.pagedesc != ""){
                    try
                    {
                    curpage.item = $.parseJSON( decodeURIComponent( curpage.plandesc ));
                    }
                    catch( err){
                    curpage.item = {};
                    }
                }
                var pagebox = $(this);
                $(pagebox).loadcomponent("cn.crsplan.pageitem", token, idxid, curpage.item, function(){
                    $(pagebox).setpagescale( $(pagebox).width(), curpage.item );
                });
            });
            $(crsbox).find("[lvs_elm=PagePreview]").click(function(){
                var curpage = $(this).attr("dataidx");
                $('#PlayContainer').lvstoggle(function(){
                    $('#PlayContainer').html("<div style=\"padding:12px 8px;text-align:left\"><a class=\"button bg-grey\" lvs_elm=\"Ret\">返回</a></div><div lvs_elm=\"PreviewPlan\" style=\"width:90%;margin-left:5%\"></div>");
                    $('#PlayContainer').find("[lvs_elm=Ret]").click(function(){
                        $('#ListContainer').lvstoggle();
                    });
                    curdata.autoplay = 0;
                    curdata.perview = 1;
                    curdata.curpage = curpage;
                    $('#PlayContainer').find("[lvs_elm=PreviewPlan]").loadcomponent( "cn.play.lesnplay", token, idxid, curdata, function(){
                    });
                });
            });
            //作业页面处理
            curdata.plantask = {tasks:[],crstmplid: curdata.id, editmode: 1};
            if( curdata.pages){
                for( var i = 0; i < curdata.pages.length; i ++ ){
                    if( curdata.pages[i].type == "task" )
                        continue;
                    if( curdata.pages[i].item != undefined && curdata.pages[i].item.elements != undefined ){
                        for( var j = 0; j < curdata.pages[i].item.elements.length; j ++ ){
                            let curelm = curdata.pages[i].item.elements[j];
                            curelm.pageid = i;
                            if( curelm.type == "sigsel" || curelm.type == "multsel" || curelm.type == "blank" || curelm.type == "answer" || curelm.type =="task" ){
                                curdata.plantask.tasks.push( curelm );
                            }
                        }
                    }
                }
            }
            curdata.plantask.colnum = 5;
            $(crsbox).find("[lvs_elm=PageExams]").loadcomponent( "cn.theme.themelist", token, idxid, curdata.plantask, function(){
            });
            $(crsbox).find("[lvs_elm=ItemEdit]").bind("click", function(){
                var bindbox = $(this);
                var tmplid = $(this).attr("tmplid") || curdata.id || $(this).attr("idxid");
                if( $(this).attr("lvs_bind") == "title" || $(this).attr("lvs_bind") == "module" || $(this).attr("lvs_bind") == "seqid"){
                    var subdata = {sname :curdata.title, seqid: curdata.seqid, module: curdata.module, id: curdata.id, modules: curdata.modules};
                    $('#EditModSeqForm').loadtmpl("cn.course.crstmpl_pbl", "#EditCrsTmpl", subdata, function(){
                        $('body').unidialog( "#EditModSeqForm", { token, idxid, modules: subdata.modules}, function( curbt, curbox ){
                            lvsdata.GetData("edu/course_set", $(curbt), { access_token: token, crstmplid: subdata.id, opetype: "Tmpl.SetTmplSeq", crstmplmodule: $(curbox).getbind("crsmodule"), seqid: $(curbox).getbind("crsseqid"), crstmplname: $(curbox).getbind("crstitle")}, function( apiname, params, result ){
                                curdata = { ...curdata,list: result.list, expted: 1, listtrigger: "listsel", subedit: "subedit", listedit: "listedit"};
                                $('body').closedialog();
                                $("[lvs_elm=CrstmplList]").loadcomponent("cn.list.explist", token, idxid, curdata, function(){
                                });
                                $(crsbox).SetData( curdata, {title: params.crstmplname, seqid: params.seqid, module: params.crstmplmodule});
                            });
                        });
                    });
                }
                else{
                    var formdata = { token: token, idxid: curdata.id, idxkey: $(this).attr("lvs_bind"), idxval: $(this).parent().getbind($(this).attr("lvs_bind")), idxname: $(this).attr("idxname"), idxtype: $(this).attr("idxtype"), idxserial: $(this).attr("idxserial") };
                    $('body').formdialog( formdata, function(curbt, curbox){
                        var DataEng = LvsData.Create();
                        var updparams = { access_token: token, crstmplid: tmplid, opetype: "TmplUpd." + formdata.idxkey, updval: $(curbox).getbind(formdata.idxkey) };
                        DataEng.GetData("edu/course_set", $(curbt), updparams, function( apiname, params, result ){
                            $('body').closepanel();
                            $('body').closedialog();
                            var setdata = {};
                            setdata[ formdata.idxkey] = result.updval || params.updval;
                            $(bindbox).parent().SetData( curdata, setdata );
                        });
                    });
                }
            });
            $(crsbox).find("[lvs_elm=DelTmpl]").click(function(){
                $('body').unidialog("#DelTmplForm",{token,idxid}, function( curbt, curbox){
                    lvsdata.GetData("edu/course_set", $(curbt), { access_token: token, crstmplid: curdata.id, opetype: "Tmpl.Delete"}, function(apiname, params, result ){
                        $('body').closedialog();
                        lvs.LvsRout("crstmpl_pbl", token, idxid, curdata.courseid );
                    });
                });
            });
            $(crsbox).bind("refresh", function(e,id){
                $(crsbox).find("[lvs_elm=MainTab]").find(".active").click();
            });
        }
    });
})(jQuery);

//任务备课
(function (jQuery) {
    jQuery.fn.extend({
        lvs_course_crstasks: function (token, idxid, curdata) {
            var tchid = (idxid < 0) ? 0 - idxid : idxid;
            var crsbox = $(this);
            //分组配置处理
            if( curdata.config != "" ){
                curdata.config = $.parseJSON( decodeURIComponent( curdata.config ) );
                curdata.config.grptype = curdata.grptype;
                $(crsbox).find("[lvs_elm=GrpConfig]").SetData({}, curdata.config );
                curdata.crtcfg = { isopen: curdata.config.crt>0?"on":"off" };
                curdata.sigcfg = { isopen: curdata.config.sig>0?"on":"off" };
            }
            else{
                curdata.config = { max: 0, mem: 0, crt: 1, sig: 1 };
                curdata.crtcfg = { isopen: "on" };
                curdata.sigcfg = { isopen: "on" };
            }
            $(crsbox).find("[lvs_elm=GrpConfig]").find("[lvs_bind]").click(function(){
                $(crsbox).find("[lvs_elm=SaveConfig]").show();
            });
            $(crsbox).find("[lvs_elm=SaveConfig]").click(function(){
                var cfgbox = $(crsbox).find("[lvs_elm=GrpConfig]");
                var cfgdata = { max: $(cfgbox).getbind("max"), mem: $(cfgbox).getbind("mem"), sig: $(cfgbox).getbind("sig"), crt: $(cfgbox).getbind("crt") };
                lvsdata.GetData("edu/course_set", $(this), { access_token: token, crstmplid: curdata.id, grptype: $(cfgbox).getbind("grptype"), configstr: encodeURIComponent( JSON.stringify( cfgdata )), opetype: "Tmpl.SaveGrpCfg" }, function( apiname, params, result ){
                    $(crsbox).find("[lvs_elm=SaveConfig]").hide();
                });
            });
            //任务处理
            for( var i = 0; i < curdata.tasks.length; i++ ){
                if( curdata.tasks[i].item == undefined ){
                    try{
                        curdata.tasks[i].item = $.parseJSON( curdata.tasks[i].taskdesc );
                    }
                    catch( err ){
                        curdata.tasks[i].item = {};
                    }
                }
                if( curdata.tasks[i].item.type == "text" ){
                    $(crsbox).find("[lvs_elm=TaskItem" + i + "]").html(curdata.tasks[i].item.desc);
                }
                else if( curdata.tasks[i].item.type == "thmsel" || curdata.tasks[i].item.type == "thmblank" || curdata.tasks[i].item.type == "thmanswer"){
                    curdata.tasks[i].item.desc.seqid = i;
                    $(crsbox).find("[lvs_elm=TaskItem" + i + "]").loadcomponent("cn.theme.baseshow", token, idxid, curdata.tasks[i].item.desc, function(){
                    });
                    $(crsbox).find("[lvs_elm=TaskGrpres" + curdata.tasks[i].id + "]").hide();
                }
                else{
                    curdata.tasks[i].item.pageid = 1000 + i;
                    $(crsbox).find("[lvs_elm=TaskItem" + i + "]" ).css("height", $(crsbox).find("[lvs_elm=TaskItem" + i + "]" ).width() * 57 / 100).loadcomponent("cn.play.lesnpage", token, idxid, curdata.tasks[i].item, function( ){
                    });
                }
                for( var j = 0; curdata.tasks[i].grpreses != undefined && j< curdata.tasks[i].grpreses.length; j ++ ){
                    if( curdata.tasks[i].grpreses[j].stepdesc != "" && curdata.tasks[i].grpreses[j].stepdesc != undefined)
                        curdata.tasks[i].grpreses[j].step = $.parseJSON( curdata.tasks[i].grpreses[j].stepdesc );
                    else
                        curdata.tasks[i].grpreses[j].step = {};
                    if( curdata.tasks[i].grpreses[j].chkres != "" && curdata.tasks[i].grpreses[j].chkres != undefined)
                        curdata.tasks[i].grpreses[j].check = $.parseJSON(curdata.tasks[i].grpreses[j].chkres );
                    else
                        curdata.tasks[i].grpreses[j].check = {};
                }
                let onetsk = { tasks:[], tasktmpls: curdata.tasktmpls };
                onetsk.tasks.push( curdata.tasks[i] );
                onetsk.grade = curdata.grade;
                $(crsbox).find("[lvs_elm=TaskGrpres" + curdata.tasks[i].id + "]").loadcomponent( "cn.crsplan.crstmplgrps", token, idxid, onetsk, function(){
                });
            }
            $(crsbox).on("click", "[lvs_elm=EditCrsTask]", function(){
                var dataidx = $(this).attr("dataidx");
                var curtask = curdata.tasks[dataidx];
                if( curtask.item.type == "text" ){
                    $(crsbox).find("[lvs_elm=TaskItem" + dataidx + "]" ).each(function(){
                        var taskbox = $(this);
                        $(this).loadcomponent("cn.form.richedit", token, idxid, { text: $(this).html()}, function(){
                            $(taskbox).find("[lvs_elm=SaveTask" + dataidx + "]").show().one("click", function(){
                                var taskdesc = { type: "text", desc: $(taskbox).getrichtext() };
                                lvsdata.GetData("edu/course_set", $(this), { access_token: token, taskid: curtask.id, taskdesc: encodeURIComponent( JSON.stringify( taskdesc ) ),opetype: "Tmpl.SetTask" }, function( apiname, params, result ){
                                    $(crsbox).find("[lvs_elm=SaveTask" + dataidx + "]").hide();
                                    $(taskbox).html( taskdesc.desc );
                                });
                            });
                        });
                    });
                }
                else if( curtask.item.type == "thmsel" || curtask.item.type == "thmblank" || curtask.item.type == "thmanswer" ){
                    $(crsbox).find("[lvs_elm=TaskItem" + dataidx + "]" ).each(function(){
                        var taskbox = $(this);
                        var cmpname = curtask.item.type == "thmsel" ? "cn.theme.addselform" : (curtask.item.type == "thmblank"?"cn.theme.addblankform": "cn.theme.addanswerform");
                        $(this).loadcomponent( cmpname, token, idxid, curdata.tasks[dataidx].item.desc, function(){
                            $(taskbox).find(".FormOk").bind("click", function(){
                                var taskdesc = { type: curtask.item.type, desc: {} };
                                $(taskbox).getthemedata( curtask.item.type, taskdesc.desc );
                                lvsdata.GetData("edu/course_set", $(this), { access_token: token, taskid: curtask.id, taskdesc: encodeURIComponent( JSON.stringify( taskdesc ) ),opetype: "Tmpl.SetTask" }, function( apiname, params, result ){
                                    curtask.item.desc = taskdesc.desc;
                                    $(crsbox).find("[lvs_elm=TaskItem" + dataidx + "]").loadcomponent("cn.theme.baseshow", token, idxid, curtask.item.desc, function(){
                                    });
                                });
                            });
                            $(taskbox).find(".FormCancel").bind("click", function(){
                                $(crsbox).find("[lvs_elm=TaskItem" + dataidx + "]").loadcomponent("cn.theme.baseshow", token, idxid, curtask.item.desc, function(){
                                });
                            });
                        });
                    });
                }
                else{
                    lvs.LvsRout("crstmpl_taskedit", token, idxid, curdata.id );
                }
            });
            $(crsbox).find("[lvs_elm=AddCrsTask]").click(function(){
                $('body').unidialog("#AddCrsTaskForm", { token, idxid, closing: 1 }, function( curbt, curbox ){
                    if( $(curbt).attr("opetype") == "DelStep" )
                        $(curbt).closest("[lvs_elm=TaskStepItem]").remove();
                    else if( $(curbt).attr("opetype") == "AddStep"){
                        var newitem = $("<div/>");
                        $(newitem).attr("lvs_elm", "TaskStepItem").loadcomponent("cn.course.crstaskstep", token, idxid, {},function(){
                            $(newitem).prepend("<img class=\"FormOk float-right\" opetype=\"DelStep\" width=\"12px\" height=\"12px\" src=\"../../Image/del.gif\" />");
                            $(newitem).find("[opetype=DelStep]").click(function(){
                                $(this).closest( "[lvs_elm=TaskStepItem]").remove();
                            });
                        });
                        $(curbox).find("[lvs_elm=TaskStepBox]").append( newitem );
                        $(newitem).before("<div class=\"BaseDesc\" style=\"width:100%\">任务提交内容" + ($(curbox).find("[lvs_elm=TaskStepItem]").size()) + "：</div>" );
                    }
                    else if( $(curbt).attr("opetype") == "AddTask" ){
                        var taskdesc = {type: "text", desc: $(curbox).find("[lvs_bind=taskdesc]").getrichtext()};
                        var stepstr = "";
                        $(curbox).find("[lvs_elm=TaskStepItem]").each(function(n){
                            var stepdesc = { resttime: $(this).getbind("stepcircle"), daynum: $(this).getbind("stepday"),evday: $(this).getbind("stepday"), textres: $(this).getbind("textres"), taskres: $(this).getbind("taskres"), paperres: $(this).getbind("paperres"), progres: $(this).getbind("progres"), fileres: $(this).getbind("fileres"), mindres: $(this).getbind("mindres")};
                            if( $(this).getbind("stepname") == "" && stepdesc.textres == 0 && stepdesc.taskres == 0 && stepdesc.paperres == 0 && stepdesc.progres == 0 && stepdesc.fileres == 0 && stepdesc.mindres == 0 ){
                            }
                            else{
                                if( stepstr != "" )
                                    stepstr += "|";
                                var sname = $(this).getbind("stepname");
                                if( sname == "" )
                                    sname = "任务" + (n + 1);
                                stepstr += encodeURIComponent(sname ) + "," + encodeURIComponent( JSON.stringify(stepdesc) );
                            }
                        });
                        lvsdata.GetData("edu/course_set", $(curbt), { access_token: token, crstmplid: curdata.id, opetype: "Tmpl.TmplAddTask", taskdesc: encodeURIComponent( JSON.stringify(taskdesc) ), stepstr: stepstr}, function( apiname, params, result ){
                            $('body').closedialog();
                            $(crsbox).trigger("refresh", [curdata.id]);
                        });
                    }
                });
            });
            $(crsbox).find("[lvs_elm=DelCrsTask]").click(function(){
                var delelm = $(this);
                $('body').unidialog("#DelTaskForm", {token, idxid},function( curbt, curbox ){
                    lvsdata.GetData("edu/course_set", $(curbt), { access_token: token, crstmplid: curdata.id, taskid: curdata.tasks[$(delelm).attr("dataidx")].id, opetype: "Tmpl.DelTask" }, function( apiname, params, result ){
                        $('body').closedialog();
                        $(delelm).closest(".CrsMainInfoBox").fadeOut(500, function(){ $(this).remove() });
                    });
                });
            });
            $(crsbox).find("[lvs_elm=AddTypeTask]").click(function(){
                $('body').unbind("click");
                $('body').basepanel({bottom:$(this).height() + 32, right:20,width:"160px", position: "fixed"}, function( curbox ){
                    var taskmenu = "";
                    if( curdata.grade == 'Career' )
                        taskmenu += "<div class=\"MenuItem\" opetype=\"AddWordTask\">添加图文格式任务</div><div class=\"MenuItem\" opetype=\"AddPptTask\">添加讲义格式任务</div>";
                    taskmenu += "<div class=\"MenuItem\" opetype=\"AddThemeSel\">添加选择题</div><div class=\"MenuItem\" opetype=\"AddThemeBlank\">添加填空题</div><div class=\"MenuItem\" opetype=\"AddThemeAnswer\">添加问答题</div>";
                    $(curbox).html( taskmenu );
                    $(curbox).find(".MenuItem").click(function(){
                        var opetype = $(this).attr("opetype");
                        $('body').closepanel();
                        $('body').unbind("click");
                        var formname = "";
                        var tasktype = "";
                        if( opetype == "AddWordTask" ){
                            formname = "AddCrsTaskForm";
                            tasktype = "text";
                        }
                        else if( opetype == "AddPptTask" ){
                            formname = "AddPptTaskForm";
                            tasktype = "ppt";
                        }
                        else if( opetype == "AddThemeSel"){
                            formname = "cn.theme.addselform";
                            tasktype = "thmsel";
                        }
                        else if( opetype == "AddThemeBlank" ){
                            formname = "cn.theme.addblankform";
                            tasktype = "thmblank";
                        }
                        else if( opetype == "AddThemeAnswer"){
                            formname = "cn.theme.addanswerform";
                            tasktype = "thmanswer";
                        }
                        var seqid = curdata.tasks.length;
                        $(crsbox).append( "<div class=\"CrsMainInfoBox\" style=\"margin-top:12px\"><div class=\"ScrollBarHead\"><span class=\"PreTitle\">.</span>新建任务/作业</div><div class=\"ScrollBarBody\"><span class=\"float-right\"><a lvs_elm=\"EditCrsTask\" style=\"display:none\" dataidx=\"" + seqid + "\"><img width=\"20px\" height=\"20px\" src=\"../../Image/bukrecm.png\" /></a></span><div class=\"FlexItemBox\" style=\"padding:12px 0;text-align:left\" lvs_elm=\"TaskItem" + seqid + "\"></div></div></div>");
                        if( opetype == "AddPptTask" ){
                            $(crsbox).find("[lvs_elm=TaskItem" + seqid + "]").html("<div style=\padding:12px;text-align:center\"><a lvs_elm=\"TabFresh\" class=\"button bg-green\">任务编辑完成后刷新</a></div>");
                            $(crsbox).find("[lvs_elm=TaskItem" + seqid + "]").find("[lvs_elm=TabFresh]").click(function(){
                                lvs.LvsRout("tabfresh", token, idxid, "[lvs_elm=MainTab]", function(){
                                });
                            });
                            lvs.LvsRout("crstmpl_taskedit", token, idxid, curdata.id, function(){
                            });
                        }
                        else{
                            $(crsbox).unbind("formloaded");
                            $(crsbox).bind("formloaded", function(){
                                var stop = $(crsbox).height();
                                $('[lvs_elm=MainTabBox]').animate({scrollTop: stop}, 300 );
                            });
                            $(crsbox).find("[lvs_elm=TaskItem" + seqid + "]").loadform( "#" + formname, { token, idxid, seqid, title: tasktype == "thmsel" ? "选择题":(tasktype=="thmblank"?"填空题":"问答题")}, function( curbt, curbox ){
                                if( $(curbt).attr("opetype") == "AddStep" ){
                                    var newitem = $("<div/>");
                                    $(newitem).attr("lvs_elm", "TaskStepItem").loadcomponent("cn.course.crstaskstep", token, idxid, {},function(){
                                        $(newitem).prepend("<div class=\"BaseDesc\" style=\"width:92%;margin-left:4%\">任务提交内容" + ($(curbox).find("[lvs_elm=TaskStepItem]").size()) + "：</div><img class=\"FormOk float-right\" opetype=\"DelStep\" width=\"12px\" height=\"12px\" src=\"../../Image/del.gif\" />");
                                        $(newitem).find("[opetype=DelStep]").click(function(){
                                            $(this).closest( "[lvs_elm=TaskStepItem]").remove();
                                        });
                                    });
                                    $(curbox).find("[lvs_elm=TaskStepBox]").append( newitem );
                                    $(newitem).before("" );
                                }
                                else if( $(curbt).attr("opetype") == "DelStep" ){
                                    $(curbt).closest("[lvs_elm=TaskStepItem]").remove();
                                }
                                else{
                                    var tdesc = {};
                                    if( opetype == "AddWordTask" )
                                        tdesc = $(curbox).find("[lvs_bind=taskdesc]").getrichtext();
                                    else if( opetype == "AddThemeSel" || opetype == "AddThemeBlank" || opetype == "AddThemeAnswer" )
                                        $(curbox).getthemedata(tasktype, tdesc);
                                    var taskdesc = {type: tasktype, desc: tdesc};
                                    var stepstr = "";
                                    var stepdesc = {};
                                    $(curbox).find("[lvs_elm=TaskStepItem]").each(function(){
                                        if( stepstr != "" )
                                            stepstr += "|";
                                        stepdesc = { resttime: $(this).getbind("stepcircle"), daynum: $(this).getbind("stepday"),evday: $(this).getbind("stepday"), textres: $(this).getbind("textres"), taskres: $(this).getbind("taskres"), paperres: $(this).getbind("paperres"), progres: $(this).getbind("progres"), fileres: $(this).getbind("fileres"), mindres: $(this).getbind("mindres")};
                                        stepstr += encodeURIComponent( $(this).getbind("stepname")) + "," + encodeURIComponent( JSON.stringify(stepdesc) );
                                    });
                                    lvsdata.GetData( "edu/course_set", $(curbt), { access_token: token, crstmplid: curdata.id, opetype: "Tmpl.TmplAddTask", taskdesc: encodeURIComponent( JSON.stringify( taskdesc ) ), stepstr: stepstr, tasktype: (tasktype == "thmsel" || tasktype == "thmblank" || tasktype == "thmanswer") ? "TTask": "RTask"}, function( apiname, params, result ){
                                        curdata.tasks.push( { id: result.id, item: taskdesc } );
                                        if( opetype == "AddWordTask" ){
                                            lvs.LvsRout("tabfresh", token, idxid, "[lvs_elm=MainTab]" );
                                        }
                                        else{
                                            $(crsbox).find("[lvs_elm=TaskItem" + seqid + "]").loadcomponent( "cn.theme.baseshow", token, idxid, taskdesc.desc, function(){
                                
                                            });
                                            $(crsbox).find("[lvs_elm=TaskItem" + seqid + "]").parent().find("[lvs_elm=EditCrsTask]").css("display", "");
                                        }
                                    });
                                }
                            });
                            $(crsbox).find("[lvs_elm=TaskItem" + seqid + "]").bind("formcancel", function(){
                                $(this).closest(".CrsMainInfoBox").fadeOut( 500, function(){$(this).remove()});
                            });
                        }
                    });
                });
                $('body').bind("click", function(){
                    if( $("[lvs_elm=AddTypeTask]:hover").size() == 0 && $(".PanelBox:hover").size() == 0 ){
                        $('body').closepanel();
                        $('body').unbind("click");
                    }
                });
            });
        }
    });
})(jQuery);


//教师个人备课内容展示
(function (jQuery) {
    jQuery.fn.extend({
        lvs_tchtmpls: function (token, idxid, curdata) {
            var tchid = (idxid < 0) ? 0 - idxid : idxid;
            var crsbox = $(this);
            $(crsbox).find("[lvs_elm=TchAddTmpl]").bind("click", function(){
                var crstmplid = $(this).attr("idxid");
                $('body').unidialog( "#TchAddForm", { token: token, idxid: idxid}, function( curbt, curbox ){
                    var DataEng = LvsData.Create();
                    DataEng.GetData("edu/course_set", $(curbt), { access_token: token, opetype: "Tmpl.Copy", crstmplid: crstmplid, copyname: $(curbox).getbind("copyname")}, function( apiname, params, result ){
                        $('body').closedialog();
                        lvs.LvsRout( "tabfresh", token, idxid, ".WSBaseTab" );
                    });
                });
            });
        }
    });
})(jQuery);


//课程授课列表
(function (jQuery) {
    jQuery.fn.extend({
        lvs_crsclass: function (token, idxid, curdata) {
            var tchid = (idxid < 0) ? 0 - idxid : idxid;
            var crsbox = $(this);
            $(crsbox).find("[lvs_elm=CreateClass]").bind("click", function(){
                $('body').unidialog( "#CreateClassForm", { token: token, idxid: idxid }, function( curbt, curbox ){
                    lvsdata.GetData("leag/class_set", $(curbt), { access_token: token, teacher: idxid, opetype: "ShotAdd", classname: $(curbox).getbind("classname"), schoolid: $(curbox).getbind("schoolid"), lvlid: $(curbox).getbind("lvlid"), seqno: $(curbox).getbind("classseq"), ttype: 1, courseid: curdata.courseid, crstmplid: curdata.crstmplid}, function( apiname, params, result ){
                        $('body').closedialog();
                        curdata.tmplings.push({id: result.id, name: result.name, lesnnum: 0, studnum: result.studnum } );
                        $(crsbox).parent().loadcomponent( "cn.course.crsclass", token, idxid, curdata, function(){
                        });
                    });
                });
            });
            $(crsbox).find("[lvs_elm=PublishLesn]").click(function(){
                var clsid = $(this).attr("idxid");
                $('body').unidialog( "#PublishForm", { token: token, idxid: idxid}, function( curbt, curbox ){
                    lvsdata.GetData( "leag/lesn_set", $(curbt), { access_token: token, opetype: "ManAdd", classid: clsid, tmplid: curdata.crstmplid, lesndate: $(curbox).getbind("lesndate"), lesntime: $(curbox).getbind("lesntime")},function( apiname, params, result ){
                        $('body').closedialog();
                        lvs.LvsRout( "tabfresh", token, idxid, ".WSBaseTab" );
                    });
                });
            });
            $(crsbox).find("[lvs_elm=BatchLesn]").click(function(){
                $('body').unidialog( "#BatchLesnForm", { token, idxid }, function( curbt, curbox ){
                    lvsdata.GetData( "leag/lesn_set", $(curbt), { access_token: token, opetype: "ManAdd", classlist: $(curbox).getbind("classlist"), tmplid: curdata.crstmplid }, function( apiname, params, result ){
                        ErrorTip.Create().Show("已成功发布" + result.id + "课程", function(){
                            $('body').closedialog();
                            lvs.LvsRout("tabfresh", token, idxid, ".WSBaseTab" );
                        });
                    });
                });
            });
            $(crsbox).find("[lvs_elm=ShowClsStud]").click(function(){
                lvsdata.GetData("leag/class_list", $(this), { access_token: token, classid: $(this).attr("idxid"), gettype: "Class.StudList" }, function( apiname, params, result ){
                    $('#ShowInfoForm').loadtmpl("cn.course.crsclass", "#ClsStudListTmpl", result, function(){
                        $('body').unidialog( "#ShowInfoForm", { token: token, idxid: idxid,closing:1}, function( curbt, curbox ){
                            $('body').closedialog();
                            lvs.LvsRout( "tchstud", token, idxid, params.classid );
                        });
                    });
                });
            });
            $(crsbox).find("[lvs_elm=ShowClsLesn]").click(function(){
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
                        $('body').unidialog( "#ShowInfoForm", { token: token, idxid: idxid,closing:1}, function( curbt, curbox ){
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
        }
    });
})(jQuery);

//课题项目管理
(function (jQuery) {
    jQuery.fn.extend({
        lvs_projcrs: function (token, idxid, curdata) {
            var tchid = (idxid < 0) ? 0 - idxid : idxid;
            var crsbox = $(this);
            $(crsbox).find("[lvs_elm=DeleteCrs]").bind("click", function () {
                var crsid = $(this).attr("idxid");
                var curlist = $(this).closest(".BaseList");
                $('body').unidialog("#DeleteForm", { token: token, idxid: idxid }, function (curbt, curbox) {
                    lvsdata.GetData("edu/course_set", $(curbt), { access_token: token, teacher: tchid, opetype: "Crs.Delete", courseid: crsid }, function (apiname, params, result) {
                        $('body').closedialog();
                        for( var i = 0;i < curdata.projcrs.length; i ++ ){
                            if( curdata.projcrs[i].id == crsid )
                                curdata.projcrs.splice( i, 0 );
                        }
                        $(curlist).fadeOut(300, function(){$(this).remove()});
                    });
                });
            });
            $(crsbox).find("[lvs_elm=AddSubjproj]").click(function(){
                $('body').unidialog( "#AddCrsForm", { access_token: token, idxid: idxid}, function( curbt, curbox ){
                    lvsdata.GetData("edu/course_set", $(curbt), { access_token: token, author: idxid, opetype: "Crs.Create", subjects: $(curbox).getbind("subjs"), crsname: $(curbox).getbind("name"), crsgrade: "Proj"}, function( apiname, params, result ){
                        $('body').closedialog();
                        lvs.LvsRout( "projcrs", token, idxid, result.courseid );
                    });
                });
            });
            $(crsbox).find("[lvs_elm=ApplyTeam]").click(function(){
                lvsdata.GetData("leag/class_list", $('#CurClick'), { access_token: token, gettype: "Class.Open", estudid: idxid, classtype: "项目", status: "申请" }, function( apiname, params, result ){
                    $('#JoinForm').loadtmpl("cn.course.projcrs", "#JoinProjTmpl", result, function(){
                        $('body').unidialog( "#JoinForm", { token: token, idxid: idxid }, function( curbt, curbox ){
                            var clsid = $(curbt).attr("idxid");
                            lvsdata.GetData( "leag/stud_set", $(curbt), { access_token: token, opetype: "TopicApply", estudid: idxid, classid: clsid}, function( apiname, params, result ){
                                $('body').closedialog();
                                var tips = ErrorTip.Create();
                                tips.Show( "申请已提交，请等待负责人审批", function(){
                                    lvs.LvsRout( "tchproj", token, idxid, 0 );
                                });
                            });
                        });
                    });
                });
            });
        }
    });
})(jQuery);


