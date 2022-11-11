//单项选择题
(function (jQuery) {
    jQuery.fn.extend({
        lvssigsel: function (token, idxid, curdata) {
            var themebox = $(this);
            //if( curdata.problem.indexOf("&") != -1 )
                //$(themebox).find("[lvs_elm=problem]").html( $(themebox).find("[lvs_elm=problem]").html(curdata.problem).html() );
            //else if( curdata.problem )
                //$(themebox).find("[lvs_elm=problem]").html( curdata.problem );
            $(themebox).find("[lvs_elm=OptionAdd]").click(function () {
                var seqstr = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N"];
                var curseq = seqstr[$(themebox).find("[lvs_elm=OptionList]").find(".OptionItem").size()];
                $(themebox).find("[lvs_elm=OptionList]").append("<div class=\"OptionItem\"><span lvs_bind=\"optionseqid\">" + curseq + "</span>.<span lvs_bind=\"optiontext\" contenteditable=\"true\" style=\"width:60%;display:inline-block\">选项内容</span><span class=\"float-right\"><img lvs_elm=\"DelOption\" src=\"../../Image/del.gif\" /></span></div>");
                $(themebox).find("[lvs_bind=baseanswer]").append("<span class=\"OptionSeling\">" + curseq + "</span>");
                $(themebox).lvssigselopt(token, idxid, curdata);
            });
            $(themebox).lvssigselopt(token, idxid, curdata);
            $(themebox).lvsthemeset(token, idxid, curdata);
            return this;
        },
        lvssigselshow: function (token, idxid, curdata) {
            var ansbox = $(this);
            if( curdata.problem )
                $(ansbox).find("[lvs_bind=problem]").html( curdata.problem );
            if( curdata.answer ){
                $(ansbox).find(".OptionItemSeling").each(function(){
                    if( $(this).attr("seqid") == curdata.answer.curans )
                        $(this).addClass("OptionItemSeled" );
                });
            }
            $(ansbox).find("[lvs_elm=ThemeAns]").click(function () {
                $('body').unidialog("#ThemeForm" + (curdata.pageid!=undefined ?"_" + curdata.pageid : "") + "_" + curdata.seqid, { token: token, idxid: idxid, closing: 1 }, function (curbt, curbox) {
                    $(ansbox).lvs_task_retans( curbt,curbox, token, idxid, curdata );
                });
            });
            return this;
        },
        lvssigselopt: function (token, idxid, curdata) {
            var themebox = $(this);
            $(themebox).find("[lvs_elm=DelOption]").on("click", function () {
                var curdel = $(this).closest(".OptionItem").find("[lvs_bind=optionseqid]").text();
                $(this).closest(".OptionItem").remove();
                var seqstr = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N"];
                var idxseq = 0;
                var isdeled = false;
                $(themebox).find("[lvs_bind=baseanswer]").find(".OptionSeling").each(function () {
                    if ($(this).text() == curdel && isdeled == false) {
                        $(this).remove();
                        isdeled = true;
                    }
                    else {
                        $(this).text(seqstr[idxseq]);
                        idxseq++;
                    }
                });
                $(themebox).find(".ThemeOption").find(".OptionItem").each(function (n) {
                    $(this).find("[lvs_bind=optionseqid]").text(seqstr[n]);
                });
            });
            $(themebox).find(".OptionSeling").on("click", function () {
                $(themebox).find(".OptionSeled").removeClass("OptionSeled");
                $(this).addClass("OptionSeled");
            });
            return this;
        },
        getsigseldata: function () {
            var databox = $(this);
            var getdata = { type: "sigsel" };
            return getdata;
        }
    });
})(jQuery);

//多项选择题
(function (jQuery) {
    jQuery.fn.extend({
        lvsmultsel: function (token, idxid, curdata) {
            var themebox = $(this);
            $(themebox).find("[lvs_elm=OptionAdd]").click(function () {
                var seqstr = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N"];
                var seqno = $(themebox).find("[lvs_elm=OptionList]").find(".OptionItem").size();
                var curseq = seqstr[ seqno ];
                var imgaddstr = "";
                if( $(themebox).find("[lvs_elm=OptionList]").find("[lvs_elm=AddOptImg]").size() > 0 )
                    imgaddstr = "<a class=\"button bg-grey\" lvs_elm=\"AddOptImg\" idxid=\"" + seqno + "\"><img width=\"16px\" height=\"16px\" style=\"vertical-align:middle\" src=\"../../Image/poster_ico.png\" />插入图片</a>";
                $(themebox).find("[lvs_elm=OptionList]").append("<div class=\"OptionItem\"><span lvs_bind=\"optionseqid\">" + curseq + "</span>.<span lvs_bind=\"optiontext\" opt=\"" + seqno + "\" contenteditable=\"true\" style=\"width:60%;display:inline-block\">选项内容</span>" + imgaddstr + "<span class=\"float-right\"><img lvs_elm=\"DelOption\" src=\"../../Image/del.gif\" /></span></div>");
                $(themebox).find("[lvs_elm=ansoptions]").append("<span class=\"OptionSeling\">" + curseq + "</span>");
            });
            $(themebox).lvsmultselopt(token, idxid, curdata);
            $(themebox).lvsthemeset(token, idxid, curdata);
            return this;
        },
        lvsmultselshow: function (token, idxid, curdata) {
            var ansbox = $(this);
            if( curdata.answer ){
                $(ansbox).find(".OptionItemSeling").each(function(){
                    if( curdata.answer.curans.indexOf($(this).attr("seqid")) != -1  )
                        $(this).addClass("OptionItemSeled" );
                });
            }
            $(ansbox).find("[lvs_elm=ThemeAns]").click(function(){
                $('body').unidialog( "#ThemeForm" + (curdata.pageid!=undefined ?"_" + curdata.pageid : "") + "_" + curdata.seqid, { token: token, idxid: idxid, closing:1}, function( curbt, curbox ){
                    $(ansbox).lvs_task_retans( curbt, curbox, token, idxid, curdata );
                });
            });
            return this;
        },
        lvsmultselopt: function (token, idxid, curdata) {
            var themebox = $(this);
            $(themebox).on("click", "[lvs_elm=DelOption]", function () {
                var curdel = $(this).closest(".OptionItem").find("[lvs_bind=optionseqid]").text();
                $(this).closest(".OptionItem").remove();
                var seqstr = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N"];
                var idxseq = 0;
                var isdeled = false;
                $(themebox).find("[lvs_elm=ansoptions]").find(".OptionSeling").each(function () {
                    if ($(this).text() == curdel && isdeled == false) {
                        $(this).remove();
                        isdeled = true;
                    }
                    else {
                        $(this).text(seqstr[idxseq]);
                        idxseq++;
                    }
                });
                $(themebox).find(".ThemeOption").find(".OptionItem").each(function (n) {
                    $(this).find("[lvs_bind=optionseqid]").text(seqstr[n]);
                });
            });
            $(themebox).on("click", ".OptionSeling", function () {
                if( $(this).hasClass("OptionSeled") )
                    $(this).removeClass("OptionSeled");
                else
                    $(this).addClass("OptionSeled");
                var baseans = "";
                $(themebox).find("[lvs_elm=ansoptions]").find(".OptionSeled").each(function(){
                    if( baseans != "" )
                        baseans += ",";
                    baseans += $(this).text();
                });
                $(themebox).find("[lvs_bind=baseanswer]").text( baseans );
            });
            return this;
        }
    });
})(jQuery);

//填空题
(function (jQuery) {
    jQuery.fn.extend({
        lvsblankinp: function (token, idxid, curdata) {
            var themebox = $(this);
            if( curdata.problem != "" )
                $(themebox).find("[lvs_bind=problem]").html( curdata.problem );
            else
                $(themebox).find("[lvs_bind=problem]").html("请输入题目");
            $(themebox).lvsthemeset(token, idxid, curdata);
            return this;
        },
        lvsblankinpshow: function (token, idxid, curdata) {
            var ansbox = $(this);
            var problemstr = ReplaceBlankStr( curdata.problem, curdata.answer );
            $( ansbox ).find("[lvs_bind=problem]").html(problemstr);
            $(ansbox).find("[lvs_elm=ThemeAns]").click(function(){
                $('body').unidialog( "#ThemeForm" + (curdata.pageid!=undefined?"_" + curdata.pageid : "") + "_" + curdata.seqid, { token: token, idxid: idxid, closing:1}, function( curbt, curbox ){
                    $(ansbox).lvs_task_retans( curbt, curbox, token, idxid, curdata );
                });
            });
            return this;
        }
    });
})(jQuery);

//问答题
(function (jQuery) {
    jQuery.fn.extend({
        lvsanswerinp: function (token, idxid, curdata) {
            var themebox = $(this);
            $(themebox).lvsthemeset(token, idxid, curdata);
            return this;
        },
         lvsanswerinpshow: function (token, idxid, curdata) {
            var ansbox = $(this);
            if( curdata.problem )
                $(ansbox).find("[lvs_bind=problem]").html( curdata.problem );
            if( curdata.answer != undefined && curdata.answer.curans != undefined )
                $(ansbox).find("[lvs_bind=answer]").html( curdata.answer.curans );
            else if( curdata.answer ){
                $(ansbox).find("[lvs_bind=answer]").html( curdata.answer );
            }
            $(ansbox).find("[lvs_elm=ThemeAns]").click(function(){
                $('body').unidialog( "#ThemeForm" + (curdata.pageid!=undefined ?"_" + curdata.pageid : "") + "_" + curdata.seqid, { token: token, idxid: idxid, closing:1}, function( curbt, curbox ){
                    $(ansbox).lvs_task_retans( curbt, curbox, token, idxid, curdata );
                });
            });

            return this;
        },
        getanswerdata: function(){
            var databox = $(this);
            var getdata = {title: $(databox).find("[lvs_bind=title]").html(), problem: $(databox).find("[lvs_bind=problem]").html(), answer: $(databox).find("[lvs_bind=answer]").html() };
            getdata.titlefont=$(databox).find("[lvs_bind=title]").css("font-size");
            getdata.titlecolor = $(databox).find("[lvs_bind=title]").css("color");
            getdata.problemfont=$(databox).find("[lvs_bind=problem]").css("font-size");
            getdata.problemcolor = $(databox).find("[lvs_bind=problem]").css("color");
            getdata.noanswer = $(databox).find(".ThemeAnswer").size() > 0 ? 0: 1;
            getdata.type = "answer";
            return getdata;
        }
    });
})(jQuery);

//工作纸
(function (jQuery) {
    jQuery.fn.extend({
        lvstaskpapershow: function (token, idxid, curdata) {
            var ansbox = $(this);
            if( curdata.answer ){
                $(ansbox).find("[lvs_bind=taskdesc]").text( curdata.answer.curans );
                $(ansbox).find("[lvs_bind=taskdesc]").find(".StudEdit").attr("contenteditable", "true" );
            }
            $(ansbox).find("[lvs_elm=ThemeAns]").click(function(){
                $('body').unidialog( "#ThemeForm" + (curdata.pageid!=undefined ?"_" + curdata.pageid : "") + "_" + curdata.seqid, { token: token, idxid: idxid, closing:1}, function( curbt, curbox ){
                    if( $(curbt).attr("opetype") == "RetAnswer" ){
                        $(curbox).find("[lvs_bind=taskdesc]").find(".StudEdit").attr("contenteditable", "false" );
                        var curans = $(curbox).find("[lvs_bind=taskdesc]").html();
                        if( curans == "" )
                            ErrorTip.Create().Show("请完答题后提交");
                        else{
                            $(ansbox).find("[lvs_elm=CheckPass]").attr("pass", "1").css("display", "");
                            var ansdata = $(ansbox).getproblemstr(curdata, curans);
                            lvsdata.StoleData("leag/lesn_set", { access_token: token, lesnid: curdata.lesnid, taskid: curdata.id, estudid: idxid, answer:  ansdata , opetype: "TaskSetAns" }, function (apiname, params, result) {
                                curdata.checkok = 1;
                                if( curdata.answer )
                                    curdata.answer.curans = curans;
                                else
                                    curdata.answer = { curans: curans };
                            });
                            $('body').closedialog();
                            $(ansbox).trigger("pass", [curans == curdata.checkpass?"ok":"nok", curdata.id] );
                        }
                    }
                    else if( $(curbt).attr("opetype") == "StudEdit" ){
                        $(curbt).find(".StudEdit").attr("contenteditable", "true");
                    }
                });
            });

            return this;
        },
        getanswerdata: function(){
            var databox = $(this);
            var getdata = {title: $(databox).find("[lvs_bind=title]").html(), problem: $(databox).find("[lvs_bind=problem]").html(), answer: $(databox).find("[lvs_bind=answer]").html() };
            getdata.titlefont=$(databox).find("[lvs_bind=title]").css("font-size");
            getdata.titlecolor = $(databox).find("[lvs_bind=title]").css("color");
            getdata.problemfont=$(databox).find("[lvs_bind=problem]").css("font-size");
            getdata.problemcolor = $(databox).find("[lvs_bind=problem]").css("color");
            getdata.noanswer = $(databox).find(".ThemeAnswer").size() > 0 ? 0: 1;
            getdata.type = "answer";
            return getdata;
        }
    });
})(jQuery);

//题目类组件通用处理
(function (jQuery) {
    jQuery.fn.extend({
        lvsthemeset: function (token, idxid, curdata) {
            var themebox = $(this);
            $(themebox).find("[lvs_elm=ShowTheme]").click(function(){
                console.log("题目",curdata.title, curdata);
                curdata.saved = 0;
                if($(this).attr("isopen") == 1){
                    $(themebox).find(".ThmPanelBox").css({"display": "none"});
                    $(this).text($(this).attr("opentext")).attr("isopen", 0);
                }
                else{
                    $(themebox).find(".ThmPanelBox").css({"display": "", "margin-left": $(this).closest(".PageElm").size()>0?(0-$(this).closest(".PageElm").position().left+20): 0});
                    $(this).attr("opentext", $(this).text()).text("关闭显示").attr("isopen", 1);
                }
            });
            $(themebox).find("[lvs_elm=ClosePanel]").click(function(){
                $(themebox).find(".ThmPanelBox").css({"display": "none"});
                $(themebox).find("[isopen=1]").each(function(){
                    $(this).text($(this).attr("opentext")).attr("isopen", 0);
                    curdata.saved = 0;
                });
            });
            $(themebox).find("[lvs_elm=SelPaper]").click(function(){
                lvsdata.GetData("leag/task_list", $('#SelPaperForm').html(""), { access_token: token, gettype: "Tmpl.List" }, function (apiname, params, result) {
                    $('body').basepanel({left:"20%", top: 240, width:"60%",close:1}, function( curbox ){
                        $(curbox).loadcomponent( "cn.form.paperform", token, idxid, result, function(){
                            $(curbox).find(".FormCancel").click(function(){
                                $('body').closepanel();
                            });
                            $(curbox).find(".FormOk").click(function(){
                                var selpaperidx = parseInt($(curbox).find("[lvs_bind=paperlist]").find(".Selected").attr("idxseq"));
                                if (selpaperidx < result.tmpls.length) {
                                    curdata.taskpaper = result.tmpls[selpaperidx].id;
                                    curdata.tasktitle = result.tmpls[selpaperidx].name;
                                    curdata.taskdesc = result.tmpls[selpaperidx].tmpldesc;
                                    $(themebox).trigger("paperchange", [ curdata.dataidx, curdata.taskpaper, curdata.tasktitle, curdata.taskdesc]);
                                    $(themebox).parent().loadcomponent("cn.theme.taskpaper", token, idxid, curdata,function(){
                                    });
                                }
                                $('body').closepanel();
                            });
                        });
                    });
                });
            });
            $(themebox).find(".TchEdit").click(function(){
                $(themebox).find(".TchEdit").attr("contenteditable", "true");
            });
            $(themebox).find("[lvs_elm=CheckPass]").bind("change",function( e, isopen ){
                if( isopen == "on" )
                    curdata.checkpass = 1;
                else
                    curdata.checkpass = 0;
            });
            $(themebox).find(".PropertyText").click(function(e){
                if( $(e.target).hasClass("PropertyImg")){
                    $(themebox).find(".PropertyTextSel").removeClass("PropertyTextSel");
                    $(themebox).find(".PropertyImgSel").removeClass("PropertyImgSel");
                    $(e.target).addClass("PropertyImgSel" );
                    var propbox = $(this);
                    if( curdata.item == undefined )
                        curdata.item = {};
                    curdata.item.pagewidth = $(themebox).width();
                    curdata.item.pageheight = $(themebox).height();
                    $(e.target).setproperty( curdata, "imginner", function( proptype ){
                    });
                }
                else{
                    $(themebox).find(".PropertyTextSel").removeClass("PropertyTextSel");
                    $(themebox).find(".PropertyImgSel").removeClass("PropertyImgSel");
                    $(this).addClass("PropertyTextSel" );
                    var propbox = $(this);
                    if( curdata.item == undefined )
                        curdata.item = {};
                    curdata.item.pagewidth = $(themebox).width();
                    curdata.item.pageheight = $(themebox).height();
                    $(this).setproperty( curdata, "inner", function( proptype ){
                    });
                }
            });
            $(themebox).find(".Editable").click(function(){
                $(themebox).find(".EditableSel").removeClass("EditableSel");
                $(this).addClass("EditableSel");
            });
            $(themebox).find("[lvs_elm=AddThemeImg]").click(function(){
                $(this).lvspanelpic( function( elm, src, pics ){
                    var imgs = src.split(',');
                    var imgstr = "";
                    for( var i = 0; i < imgs.length; i ++ ){
                        imgstr += "<div class=\"ThemeImage\"><img lvs_elm=\"ThemeImg\" width=\"60%\" src=\"" + imgs[i] + "\"/></div>";
                    }
                    $(themebox).find("[lvs_bind=problem]").append( imgstr ); 
                    $(this).closepanel();
                });
            });
            $(themebox).on("click", "[lvs_elm=AddOptImg]", function(){
                var idx = $(this).attr("idxid");
                $(this).lvspanelpic( function( elm, src, pics ){
                    var imgs = src.split(',');
                    var imgstr = "";
                    for( var i = 0; i < imgs.length; i ++ ){
                        imgstr += "<div><img lvs_elm=\"ThemeImg\" lvs_elm=\"OptionImg\" width=\"30%\" src=\"" + imgs[i] + "\"/></div>";
                    }
                    $(themebox).find("[lvs_bind=optiontext]").each(function(){
                        if( $(this).attr("opt") == idx )
                            $(this).append( imgstr );
                    });
                    $(this).closepanel();
                });
            });
            $(themebox).on("click", "[lvs_elm=ThemeImg]", function(){
                var imgbox = $(this);
                var imgdata = { align: $(this).parent().css("text-align"), imgwidth: parseInt( $(this).attr("width")) };
                $(themebox).find("#ThemeImgForm" + curdata.seqid).loadtmpl( "cn.theme.addselform", "#ThemeImgTmpl", imgdata, function(){
                    $('body').unidialog( "#ThemeImgForm" + curdata.seqid, { token, idxid}, function( curbt, curbox ){
                        $(imgbox).parent().css("text-align", $(curbox).getbind("textalign") );
                        $(imgbox).attr("width", $(curbox).getbind("imgwidth") + "%" );
                        $('body').closedialog();
                    });
                });
            });
            return this;
        },
        lvs_task_retans: function( curbt, curbox, token, idxid, curdata ){
            var ansbox = $(this);
            if ($(curbt).attr("opetype") == "Option") {
                if( curdata.type == "sigsel" ){
                    $(curbox).find(".OptionItemSeled").removeClass("OptionItemSeled");
                    $(curbt).addClass("OptionItemSeled");
                }
                else if( curdata.type == "multsel" || curdata.type == "thmsel"){
                    if( $(curbt).hasClass( "OptionItemSeled" ))
                        $(curbt).removeClass("OptionItemSeled")
                    else
                        $(curbt).addClass("OptionItemSeled");
                }
            }
            else if ($(curbt).attr("opetype") == "RetAnswer") {
                var ansdata = {};
                var curans = "";
                if (curdata.type == "sigsel") {
                    if ($(curbox).find(".OptionItemSeled").size() > 0) {
                        curans = $(curbox).find(".OptionItemSeled").attr("seqid");
                        if (curdata.checkpass > 0 && curans != curdata.baseanswer) {
                            var tips = ErrorTip.Create();
                            tips.Show("回答不正确，请重新选择");
                            $(ansbox).find("[lvs_elm=CheckPass]").attr("pass", "0").css("display", "none");
                            return;
                        }
                        else {
                            $(ansbox).find("[lvs_elm=CheckPass]").attr("pass", "1").css("display", "");
                            ansdata = $(ansbox).getproblemstr(curdata, curans);
                        }
                    }
                    else{
                        ErrorTip.Create().Show("请选择对应的选项");
                        return;
                    }
                }
                else if( curdata.type=="multsel" || curdata.type == "thmsel"){
                    $(curbox).find(".OptionItemSeled").each(function(){
                        if( curans != "")
                            curans += ",";
                        curans += $(this).attr("seqid");
                    });
                    if( curans == "" ){
                        ErrorTip.Create().Show("请选择对应的选项");
                        return;
                    }
                    else{
                        if (curans != curdata.baseanswer && curdata.checkpass > 0) {
                            var tips = ErrorTip.Create();
                            tips.Show("回答不正确，请重新选择答案");
                            return;
                        }
                        else {
                            $(ansbox).find("[lvs_elm=CheckPass]").attr("pass", "1").css("display", "");
                            ansdata = $(ansbox).getproblemstr(curdata, curans);
                        }
                    }
                }
                else if( curdata.type == "blank" || curdata.type == "thmblank"){
                    var isblank = false;
                    $(curbox).find(".InputBlank").each(function(){
                        if( curans != "")
                            curans += "|";
                        curans += $(this).val();
                        if( $(this).val() == "" ){
                            $(this).css("border", "red 1px solid");
                            isblank = true;
                        }
                    });
                    if( isblank == true ){
                        ErrorTip.Create().Show("请完成空白项填写");
                        return;
                    }
                    else{
                        $(ansbox).find("[lvs_elm=CheckPass]").attr("pass", "1").css("display", "");
                        ansdata = $(ansbox).getproblemstr(curdata, curans);
                    }
                }
                else if( curdata.type == "answer" || curdata.type == "thmanswer"){
                    curans = $(curbox).find("[lvs_bind=answer]").html();
                    if( curans == "" ){
                        ErrorTip.Create().Show("请完答题后提交");
                        return;
                    }
                    else{
                        $(ansbox).find("[lvs_elm=CheckPass]").attr("pass", "1").css("display", "");
                        ansdata = $(ansbox).getproblemstr(curdata, curans);
                    }
                }
                lvsdata.GetData("leag/lesn_set", $(curbt), { access_token: token, lesnid: curdata.lesnid, taskid: curdata.id, estudid: idxid, answer:  ansdata , opetype: "TaskSetAns" }, function (apiname, params, result) {
                    curdata.checkok = 1;
                    if( curdata.answer == undefined )
                        curdata.answer = {curans: curans,baseanswer: curdata.baseanswer};
                    else{
                        curdata.answer.curans = curans;
                        curdata.answer.baseanswer = curdata.baseanswer;
                    }
                    $(ansbox).find(".OptionItemSeling").each(function(){
                        if( $(this).attr("seqid") == curdata.answer.curans || curdata.type=="multsel" && curdata.answer.curans.indexOf($(this).attr("seqid")) != -1)
                            $(this).addClass("OptionItemSeled" );
                    });
                    if( curdata.type == "blank" || curdata.type == "thmblank"){
                        if( curdata.answer ){
                            $( ansbox ).find("[lvs_bind=problem]").html(ReplaceBlankStr( curdata.problem, curdata.answer ));
                        }
                    }
                    else if( curdata.type == "answer" || curdata.type == "thmanswer"){
                         $(ansbox).find("[lvs_bind=answer]").html( curdata.answer.curans );
                    }
                    $('body').closedialog();
                    $(curbt).text("完成提交");
                    $(ansbox).trigger("pass", [curans == curdata.checkpass ? "ok" : "nok", curdata.id]);
                });
            }
            else if( $(curbt).attr("opetype") == "AddPic" ){
                $('body').lvspanelpic( function( elm, srcs, pics ){
                    var imgs = srcs.split( ',' );
                    var piclist = pics.split(',');
                    var imgstr = "";
                    for( var i = 0; i < imgs.length; i ++ ){
                        imgstr += "<img width=\"100%\" picid=\"" + (piclist.length>i?piclist[i]:"0") + "\" src=\"" + imgs[i] + "\"/>";
                    }
                    $(curbox).find("[lvs_elm=AnswerInp]").html( $(curbox).find("[lvs_elm=AnswerInp]").html() + imgstr );
                    $('body').closepanel();
                });
            }
            else if( $(curbt).attr("opetype") == "AddAttch" ){
                $('body').lvspanelattach( function( elm, srcs, pics, names ){
                    var atts = srcs.split( ',' );
                    var attlist = pics.split(',');
                    var namelist = names.split(',');
                    var attstr = "";
                    for( var i = 0; i < atts.length; i ++ ){
                        attstr += "<div class=\"AnsFileBox\" picid=\"" + (attlist.length>i?attlist[i]:"0") + "\" src=\"" + atts[i] + "\" filename=\"" + namelist[i] + "\">已成功上传文件：" + namelist[i] + "<span class=\"float-right\"><a class=\"FormOk\" opetype=\"DelAttch\"><img width=\"16px\" src=\"../Image/del.gif\"/></a></div>";
                    }
                    $(curbox).find("[lvs_elm=AnswerInp]").html( $(curbox).find("[lvs_elm=AnswerInp]").html() + attstr );
                    $(curbox).find("[lvs_elm=AnswerInp]").find("[opetype=DelAttch]").click(function(){
                        $(this).closest(".AnsFileBox").fadeOut(500, function(){$(this).remove()});
                    });
                    $('body').closepanel();
                });
            }
            else if( $(curbt).attr("opetype") == "AddVideo" ){
                $('body').lvspanelvod( function( elm, oriurl ){
                    var attstr = "";
                    attstr += "<div class=\"AnsFileBox\" src=\"" + oriurl + "\" filename=\"Vod大文件\">已成功上传文件<span class=\"float-right\"><a class=\"FormOk\" opetype=\"DelAttch\"><img width=\"16px\" src=\"../Image/del.gif\"/></a></div>";
                    $(curbox).find("[lvs_elm=AnswerInp]").html( $(curbox).find("[lvs_elm=AnswerInp]").html() + attstr );
                    $(curbox).find("[lvs_elm=AnswerInp]").find("[opetype=DelAttch]").click(function(){
                        $(this).closest(".AnsFileBox").fadeOut(500, function(){$(this).remove()});
                    });
                    $('body').closepanel();
                });
            }
            else if( $(curbt).attr("opetype") == "DelAttch" ){
                $(curbt).closest(".AnsFileBox").fadeOut(500, function(){$(this).remove()});
            }
        }
    });
})(jQuery);

//批改作业框
(function (jQuery) {
    jQuery.fn.extend({
        lvs_task_check: function (token, idxid, curdata) {
        }
    });
})(jQuery);

//作业列表
(function (jQuery) {
    jQuery.fn.extend({
        lvs_themelist: function (token, idxid, curdata) {
            var themebox = $(this);
            $(themebox).find("[lvs_elm=EditPage]").click(function(){
                window.open( "../hpoam/lesnplan.htm?id=" + curdata.crstmplid + "&tn=foken&pg=" + $(this).attr("pageid") + "&tp=plan", "_blank", "resizable,scrollbars,status,width=" + (screen.availWidth - 10) + ",height=" + (screen.availHeight - 50));
            });
        }
    });
})(jQuery);


//基本的考题结果查看
(function (jQuery) {
    jQuery.fn.extend({
        lvs_theme_baseshow: function (token, idxid, curdata) {
            var themebox = $(this);
            if( curdata.type =="blank" && curdata.curans != "" && curdata.curans != undefined){//填空题转换格式并填上内容
                $(themebox).find("[lvs_elm=CurProblem]").html( ReplaceBlankStr( curdata.problem, curdata ));
                let anslist = curdata.curans.split('|');
                let baselist = curdata.baseanswer.split(';');
                $(themebox).find("[lvs_elm=CurProblem]").find(".InputBlank").each(function(n){
                    if( baselist.length>n && anslist.length >n&& anslist[n] == baselist[n] )
                        $(this).addClass("TaskBlankOk");
                    else
                        $(this).addClass("TaskBlankNok");
                });
                $(themebox).find("[lvs_elm=CurAnswer]").css("display", "none");
                $(themebox).find("[lvs_elm=CurBaseAns]").css("display", "none");
            }
            else if( curdata.type == "sigsel" ){
                $(themebox).find("[lvs_elm=CurProblem]").html(curdata.problem);
                $(themebox).find("[lvs_elm=CurOptionItem]").each(function(){
                    if( $(this).attr("seqid") == curdata.curans && curdata.curans == curdata.baseanswer )
                        $(this).addClass("TaskBlankOk");
                    else if( $(this).attr("seqid") == curdata.curans)
                        $(this).addClass("TaskBlankNok");
                });
                $(themebox).find("[lvs_elm=CurAnswer]").css("display", "none");
            }
            else if( curdata.type == "multsel" ){
                $(themebox).find("[lvs_elm=CurProblem]").html(curdata.problem);
                $(themebox).find("[lvs_elm=CurOptionItem]").each(function(){
                    var curseqid = $(this).attr("seqid");
                    if(  curdata.curans.indexOf( curseqid ) != -1 && curdata.baseanswer.indexOf(curseqid) != -1  )
                        $(this).addClass("TaskBlankOk");
                    else if( curdata.curans.indexOf( curseqid ) != -1)
                        $(this).addClass("TaskBlankNok");
                });
                $(themebox).find("[lvs_elm=CurAnswer]").css("display", "none");
            }
            else
            {
                $(themebox).find("[lvs_elm=CurProblem]").html(curdata.problem);
                $(themebox).find("[lvs_elm=CurAnswer]").html(curdata.curans );
            }

            $(themebox).find(".AnsFileBox").each(function(n){
                let filename = $(this).attr("filename");
                var filesrc = $(this).attr("src");
                $(this).loadbasefile( filename, filesrc, n );
                $(this).find("[lvs_elm=DelAttach]").hide();
            });
            return this;
        }
    });
})(jQuery);

//基本的文件打开组件
(function (jQuery) {
    jQuery.fn.extend({
        lvs_basefile: function (token, idxid, curdata) {
            var themebox = $(this);
            $(themebox).find("[lvs_elm=BaseFile]").each(function(n){
                $(this).loadbasefile( curdata.resfile, curdata.fileurl, n );
            });
            $(themebox).find("[lvs_elm=AddAttach]").click(function(){
                $(this).lvspanelattach( function( elm, srcs, pics, names ){
                    var atts = srcs.split( ',' );
                    var attlist = pics.split(',');
                    var namelist = names.split(',');
                    if( atts.length > 0 && atts[0] != "" ){
                        curdata.resfile = namelist[0];
                        curdata.fileurl = atts[0];
                        curdata.id = attlist[0];
                        curdata.filelist = [];
                        for( var i = 1; i < attlist.length; i ++ ){
                            curdata.filelist.push( { id: attlist[i], resfile : namelist[i], fileurl : atts[i] });
                        }
                        curdata.files = pics;
                        $(themebox).parent().loadcomponent("cn.theme.basefile", token, idxid, curdata, function(){
                        });
                    }
                    $('body').closepanel();
                });
            });
            $(themebox).find("[lvs_elm=AddVideo]").click(function(){
                $(this).lvspanelvod( function( elm, oriurl ){
                    var attstr = "";
                    curdata.resfile = "上传视频文件";
                    curdata.fileurl = oriurl;
                    curdata.files = oriurl;
                    curdata.filelist = [];
                    $(themebox).parent().loadcomponent("cn.theme.basefile", token, idxid, curdata, function(){
                    });
                    $('body').closepanel();
                });
            });

            return this;
        }
    });
})(jQuery);

//任务提交结果的标准打开方式
(function (jQuery) {
    jQuery.fn.extend({
        lvs_task_grpres: function (token, idxid, curdata) {
            var thmbox = $(this);
            for( var i = 0; i < curdata.grpreses.length; i ++ )
            {
                try
                {
                    var taskres = $.parseJSON( curdata.grpreses[i].resdesc );
                    if( taskres.resptext )
                        $(thmbox).find("[lvs_elm=TaskResText" + i + "]").html( taskres.resptext );
                    if( taskres.resptmpl )
                        $(thmbox).find("[lvs_elm=TaskResTmpl" + i + "]").html(taskres.resptmpl );
                    if( taskres.resppaper )
                        $(thmbox).find("[lvs_elm=TaskResTmpl" + i + "]").html(taskres.resppaper );
                    if( taskres.respmind )
                        $(thmbox).find("[lvs_elm=TaskResMind" + i + "]").loadcomponent("cn.elmind.elmind", token, idxid, { id: i + 1, mindsource: taskres.respmind }, function(){
                        });
                }
                catch(err){
                    $(thmbox).find("[lvs_elm=TaskResText" + i + "]").html(curdata.grpreses[i].resdesc);
                }
            }

            $(thmbox).find("[lvs_elm=BaseFile]").each(function(n){
                $(this).loadbasefile( curdata.grpreses[$(this).attr("dataidx")].resfile, curdata.grpreses[$(this).attr("dataidx")].fileurl, n );
            });
            $(thmbox).find("[lvs_elm=DelTaskRes]").click(function(){
                var delbox = $(this).closest(".BaseListBox" );
                var delidx = $(this).attr("dataidx");
                var resid = curdata.grpreses[delidx].id;
                $('body').unidialog( "#DelGrpresForm", {token, idxid}, function( curbt, curbox ){
                    lvsdata.GetData("leag/lesn_set", $(curbt), {access_token: token, resid: resid, opetype: "GroupDelResp" }, function( apiname, params, result ){
                        $('body').closedialog();
                        $(delbox).remove();
                        $('[lvs_elm=GrpResItem' + resid + ']').remove();
                        curdata.grpreses.splice( delidx, 1 );
                    });
                });
            });
            $(thmbox).find("[lvs_elm=CancelTaskRes]").click(function(){
                var cancelidx = $(this).attr("dataidx");
                var resid = curdata.grpreses[cancelidx].id;
                $('body').unidialog( "#CancelGrpresForm", {token, idxid}, function( curbt, curbox ){
                    lvsdata.GetData("leag/lesn_set", $(curbt), {access_token: token, resid: resid, opetype: "GroupCancelResp" }, function( apiname, params, result ){
                        $('body').closedialog();
                        curdata.grpreses[cancelidx].status = "草稿";
                        $('[lvs_elm=GrpResItem' + resid + ']').removeClass("GroupRet").addClass("GroupSave").text("任务草稿");
                        $(thmbox).parent().loadcomponent("cn.theme.taskgrpres", token, idxid, curdata, function(){
                        });
                    });
                });
            });
            $(thmbox).find("[lvs_elm=EditTaskRes]").click(function(){
                var taskres = $.parseJSON( curdata.grpreses[$(this).attr("dataidx")].resdesc );
                if( taskres.respmind )
                    taskres.mindstr = JSON.stringify( taskres.respmind );
                taskres.resprog = curdata.grpreses[$(this).attr("dataidx")].prog;
                taskres.resfile = curdata.grpreses[$(this).attr("dataidx")].resfile;
                taskres.resid = curdata.grpreses[$(this).attr("dataidx")].id;
                taskres.filelist = curdata.grpreses[$(this).attr("dataidx")].filelist;
                $('body').closepanel();
                $('body').unbind("click");
                $('#UpdResForm').loadtmpl("cn.theme.taskgrpres", "#UpdTaskTmpl", taskres, function(){
                    var formdata = { token, idxid, closing:1,noclose:1, ...taskres };
                    $('body').unidialog( "#UpdResForm", formdata, function(curbt, curbox ){
                        var taskdata = { resptext: decodeURI( $(curbox).getbind("resptext")), resptmpl: decodeURI( $(curbox).getbind("resptmpl")), respmind:  $(curbox).find("respmind").get_nodearray_data( formdata ) };
                        if( $(curbt).attr("opetype") == "RetRes" ){
                            lvsdata.GetData("leag/lesn_set", $(curbt), { access_token: token, resid: taskres.resid, opetype: "GroupSaveResp", status:"提交", resptext: encodeURIComponent( JSON.stringify( taskdata )), respprog: $(curbox).getbind("respprog"), respfile: $(curbox).getbind("respfile")}, function( apiname, params, result ){
                                $('body').closedialog();
                                lvs.LvsRout( "tabfresh", token, idxid, "[lvs_elm=LesnTab]" );
                            });
                        }
                        else if( $(curbt).attr("opetype") == "SaveRes" ){
                            lvsdata.GetData("leag/lesn_set", $(curbt), { access_token: token, resid: taskres.resid, opetype: "GroupSaveResp", status: "草稿", resptext: encodeURIComponent( JSON.stringify( taskdata )), respprog: $(curbox).getbind("respprog"), respfile: $(curbox).getbind("respfile")}, function( apiname, params, result ){
                                $('body').closedialog();
                                lvs.LvsRout( "tabfresh", token, idxid, "[lvs_elm=LesnTab]" );
                            });
                        }
                    });
                });
            });
        }
    });
})(jQuery);
//文件的标准打开方式
(function (jQuery) {
    jQuery.fn.extend({
        loadbasefile: function (filename, filesrc, idx) {
            var filebox = $(this);
            var token = "";
            var idxid = 0;
            var ext = filesrc.substr( filesrc.lastIndexOf(".") + 1 ).toLowerCase();
            if( ext == "jpg" || ext == "jpeg" || ext == "gif" || ext=="png" || ext=="bmp" || ext == "webp" )
                $(this).html("<img width=\"100%\" src=\"" + filesrc + "\"/><br/>" + filename );
            else if( ext == "mp4" || ext == "mpeg" || ext=="mp3" || ext == "flv" || ext=="ac3" || ext == "avi" || ext=="mov" ){
                var playdata = { id: idx, fileurl: filesrc };
                $(this).loadcomponent( "cn.play.videoplay", token, idxid, playdata, function(){
                });
            }
            else if( ext == "swf" ){
                var swfdata = {id: idx, fileurl: filesrc };
                $(this).loadcomponent("cn.play.swfplay", token, idxid, swfdata, function(){
                });
            }
            else if( ext == "doc" || ext == "docx" || ext == "ppt" || ext=="pptx" || ext=="xls" || ext =="xlss" || ext == "pdf" || ext=="md" || ext=="txt" ){
                $(this).html( $(this).html() + "<span class=\"float-right\"><a lvs_elm=\"OpenFile\" style=\"cursor:pointer\" filename=\"" + filename + "\" fileurl=\"" + filesrc + "\">打开查看</a></span>" );
                $(this).find("[lvs_elm=OpenFile]").click(function(){
                    window.open( $(this).attr("fileurl"), "_blank", "resizable,scrollbars,status,width=" + (screen.availWidth - 10) + ",height=" + (screen.availHeight - 50) );
                });
            }
            else if( ext == "htm" || ext=="html" ){
                var heit = $(this).width() * 10 / 16;
                var newframe = $('<iframe/>');
                $(newframe).attr("src", filesrc).attr("frameborder", 1).attr("srcolling", "auto").attr("width", "100%").attr("height", heit );
                $(this).html("<div style=\"text-align:right\"><a class=\"button bg-green\" lvs_elm=\"ShowPage\">新窗口打开网页</a></div>").append( newframe );
                //$(this).html("").append("<iframe src=\"" + filesrc + "\" frameborder=\"1\" scrolling=\"auto\" width=\"100%\" height=\"" + heit +"px\"></iframe>" );
                $(this).find("[lvs_elm=ShowPage]").click(function(){
                    window.open( filesrc, "_blank", "resizable,scrollbars,status,width=" + (screen.availWidth - 10) + ",height=" + (screen.availHeight - 50) );
                });
            }
            else{
                $(this).html( $(this).html() + "<span class=\"float-right\"><a href=\"" + filesrc.replace("tuanju.js.cn", "shuren.fancience.com") + "\" download=\"" + idx + "_" + filename + "\">下载</a></span>");
            }
        }
    });
})(jQuery);


//获取题目数据
(function (jQuery) {
    jQuery.fn.extend({
        getthemedata: function (themetype, themedata) {
            var themebox = $(this);
            if( themetype == "sigsel" || themetype == "theme" && $(this).find("[lvs_component=SigSel]").size() > 0 ){
                themebox = $(this).find("[lvs_component=SigSel]");
            }
            else if( themetype == "multsel" || themetype == "theme" && $(this).find("[lvs_component=MultSel]").size() > 0 ){
                themebox = $(this).find("[lvs_component=MultSel]");
            }
            else if( themetype == "blank" || themetype == "blank" && $(this).find("[lvs_component=BlankInp]").size() > 0 ){
                themebox = $(this).find("[lvs_component=BlankInp]");
            }
            else if( themetype == "answer" || themetype == "answer" && $(this).find("[lvs_component=AnswerInp]").size() > 0 ){
                themebox = $(this).find("[lvs_component=AnswerInp]");
            }
            else if( themetype == "task" )
                themebox = $(this).find("[lvs_component=cn_theme_taskpaper]");
            var curdata = themedata;
            if( themetype == "task" ){
                curdata.type = themetype;
                curdata.title = $(themebox).getbind("title");
                $(themebox).find("[lvs_elm=TaskDesc]").find(".TchEdit").attr("contenteditable", "false");
                curdata.taskdesc = $(themebox).find("[lvs_elm=TaskDesc]").html();
            }
            else{
                curdata.title = $(themebox).getbind("title");
                curdata.checkpass = $(themebox).getbind("checkpass");
                curdata.titlefont = fontsizeVw( $(themebox).find("[lvs_bind=title]").css("font-size"));
                curdata.titlecolor = colorHex( $(themebox).find("[lvs_bind=title]").css("color"));
                curdata.titlewidth = sizePercent( $(themebox).find("[lvs_bind=title]").css("width"), $(themebox).width());
                curdata.problem = $(themebox).getbind("problem");
                curdata.problemfont = fontsizeVw( $(themebox).find("[lvs_bind=problem]").css("font-size"));
                curdata.problemcolor = colorHex( $(themebox).find("[lvs_bind=problem]").css("color"));
                curdata.problemwidth = sizePercent( $(themebox).find("[lvs_bind=problem]").css("width"), $(themebox).width() );
                if( themetype == "sigsel" || themetype == "multsel" || themetype == "thmsel"){
                    curdata.optionfont = fontsizeVw( $(themebox).find("[lvs_bind=option]").css("font-size"));
                    curdata.optioncolor = colorHex( $(themebox).find("[lvs_bind=option]").css("color") );
                    curdata.optionwidth = sizePercent($(themebox).find("[lvs_bind=option]").css("width"), $(themebox).width());
                    if( curdata.options == undefined )
                        curdata.options = new Array();
                    else
                        curdata.options.splice( 0, curdata.options.length );
                    $(themebox).find(".OptionItem").each(function(){
                        curdata.options.push({seqid:$(this).find("[lvs_bind=optionseqid]").text(), opttext: $(this).find("[lvs_bind=optiontext]").html(), optimg: ($(this).find("[lvs_bind=optionimg]").find("img").size()>0?$(this).find("[lvs_bind=optionimg]").find("img").attr("src"):undefined)});
                    });
                    curdata.baseanswer = "";
                    if(themetype=="sigsel"){
                        $(themebox).find("[lvs_bind=baseanswer]").find(".OptionSeled").each(function(){
                            if( curdata.baseanswer != "" )
                                curdata.baseanswer += ",";
                            curdata.baseanswer += $(this).text();
                        });
                    }
                    else
                        curdata.baseanswer = $(themebox).getbind("baseanswer");
                }
                else if( themetype == "blank" || themetype == "thmblank"){
                    curdata.baseanswer = $(themebox).getbind("baseanswer");
                }
                else if( themetype == "answer" || themetype=="thmanswer"){
                    curdata.baseanswer = $(themebox).getbind("baseanswer");
                }
            }
            return curdata;
        },
        getthemeans: function(thmtype ){
            var curans = "";
            if( thmtype == "thmsel" ){
                $(this).find(".OptionItemSeled").each(function(){
                    if( curans != "")
                        curans += ",";
                    curans += $(this).attr("seqid");
                });
            }
            else if( thmtype == "thmblank" ){
                var isblank = false;
                $(this).find(".InputBlank").each(function(){
                    if( curans != "")
                        curans += "|";
                    curans += $(this).val();
                    if( $(this).val() == "" ){
                        $(this).css("border", "red 1px solid");
                        isblank = true;
                    }
                });
            }
            else if( thmtype == "thmanswer" ){
                curans = $(this).find("[lvs_bind=answer]").html();
            }
            return curans;
        },
        getproblemstr: function( curdata, curans ){
            var problemdata = {type:curdata.type, title: curdata.title, problem: curdata.problem, problemcolor:curdata.problemcolor, curans: curans, baseanswer: curdata.baseanswer};

            if( curdata.type == "sigsel" || curdata.type == "multsel" || curdata.type == "thmsel"){
                problemdata.options = curdata.options;
                problemdata.optioncolor = curdata.optioncolor;
            }
            return encodeURIComponent( JSON.stringify( problemdata ));
        },
        getthemepass: function(){
            if( $(this).find("[lvs_elm=CheckPass]").attr("pass") == 1 )
                return true;
            else
                return false;
        },
        beganstheme: function(){
            $(this).find("[lvs_elm=ThemeAns]").click();
        }
    });
})(jQuery);

//项目提交格式表单
(function (jQuery) {
    jQuery.fn.extend({
        lvs_tmplform: function (token, idxid, curdata) {
            var tchid = (idxid < 0) ? 0 - idxid : idxid;
            var crsbox = $(this);
            if( curdata.tdesc != undefined && curdata.tdesc != ""){
                $(crsbox).find("[lvs_bind=tasktmpldesc]").html( curdata.tdesc);
                $(crsbox).find(".TchEdit").attr("contenteditable", "true");
                $(crsbox).find("[lvs_bind=tasktmpldesc]").find(".TmplTable").each(function(){   
                    $(this).find("thead").find("th").each(function(){
                        $(this).append("<img class=\"HideButton\" lvs_elm=\"AddCol\" style=\"display:none\" src=\"../../Image/append.png\" />");
                    });
                    $(this).find("tr").each(function(){
                        var cnt = $(this).find("td").size();
                        var isbind = $(this).find("[lvs_bind]").size();
                        $(this).find("td").each(function(n){
                            if( n == cnt - 1 ){
                                $(this).append("<img class=\"HideButton\" lvs_elm=\"AddRow\" style=\"display:none\" src=\"../../Image/append.png\" />");
                            }
                        });
                    });
                });
            }
            $(crsbox).find(".TchEdit").keyup(function(){
                if( $(crsbox).find("[lvs_elm=SaveTaskTmpl]").css("display") == "none")
                    $(crsbox).find("[lvs_elm=SaveTaskTmpl]").css("display", "");
            });
            $(crsbox).find("[lvs_elm=SaveTaskTmpl]").click(function(){
                $(crsbox).find("[lvs_bind=tasktmpldesc]").find(".ManEdit").remove();
                $(crsbox).find("[lvs_bind=tasktmpldesc]").find(".HideButton").remove();
                $(crsbox).find("[lvs_bind=tasktmpldesc]").find(".TchEdit").attr("contenteditable", "false" );
                curdata.tdesc = $(crsbox).find("[lvs_bind=tasktmpldesc]").html();
                $(crsbox).trigger("save", [ curdata.dataidx,{ tasktmpl: curdata.tasktmpl, ttname: (curdata.tasktmpl==-1? $(crsbox).getbind("tasktmplname") : curdata.ttname),tdesc: curdata.tdesc}]);
                $(crsbox).parent().loadcomponent( "cn.theme.tmplform", token, idxid, curdata, function(){
                });
            });
            $(crsbox).find(".TmplTable").on("mouseover", "tr,thead", function(){
                $(this).find(".HideButton").css("display", "");
            });
            $(crsbox).find(".TmplTable").on("mouseout", "tr,thead", function(){
                $(this).find(".HideButton").css("display", "none");
            });
            $(crsbox).find(".TmplTable").on("click", "span,div", function(){
                $(crsbox).find(".ItemSel").removeClass("ItemSel");
                $(this).addClass("ItemSel");
                $(crsbox).find("[lvs_bind=GridConfig]").show();
                if( $(this).hasClass("TchEdit"))
                    $(crsbox).find("[lvs_bind=GridConfig]").find("[idxid=TchEdit]").addClass("MultSelected");
                else
                    $(crsbox).find("[lvs_bind=GridConfig]").find("[idxid=TchEdit]").removeClass("MultSelected");
                if( $(this).hasClass("StudEdit"))
                    $(crsbox).find("[lvs_bind=GridConfig]").find("[idxid=StudEdit]").addClass("MultSelected");
                else
                    $(crsbox).find("[lvs_bind=GridConfig]").find("[idxid=StudEdit]").removeClass("MultSelected");
                if( $(this).hasClass("NumStat"))
                    $(crsbox).find("[lvs_bind=GridConfig]").find("[idxid=NumStat]").addClass("MultSelected");
                else
                    $(crsbox).find("[lvs_bind=GridConfig]").find("[idxid=NumStat]").removeClass("MultSelected");
            });
            $(crsbox).find("[lvs_bind=GridConfig]").find("[idxid]").click(function(){
                var cursel = $(this);
                if( $(this).hasClass("MultSelected") ){
                    $(crsbox).find(".ItemSel").removeClass($(this).attr("idxid"));
                }
                else{
                    $(crsbox).find(".ItemSel").addClass($(this).attr("idxid"));
                }
                if( $(crsbox).find(".ItemSel").closest("th").size()>0){
                    $(crsbox).find(".ItemSel").closest("thead").find("th").each(function(n){
                        $(this).attr("seq", n );
                    });
                    var curseq = $(crsbox).find(".ItemSel").closest("th").attr("seq");
                    $(crsbox).find("table").find("tr").each(function(){
                        $(this).find("td").each(function( n ){
                            if( n == curseq ){
                                if( $(cursel).hasClass("MultSelected"))
                                    $(this).find("div,span").removeClass( $(cursel).attr("idxid"));
                                else
                                    $(this).find("div,span").addClass( $(cursel).attr("idxid"));
                            }
                        });
                    });
                }
            });
            $(crsbox).find(".TmplTable").on("click", "[lvs_elm=AddRow]", function(){
                var insertstr = "<tr>";
                var curtr = $(this).closest("tr");
                $(curtr).find("td").each(function(){
                    insertstr += "<td>";
                    if( $(this).find(".TchEdit").size() > 0 )
                        insertstr += "<div contenteditable=\"true\" class=\"TchEdit\"></div>";
                    else
                        insertstr += $(this).html();
                    insertstr += "</td>";
                });
                insertstr += "</tr>";
                $(this).closest("tr").after(insertstr);
                $(crsbox).find("[lvs_elm=SaveTaskTmpl]").css("display", "");
                //$(this).clone().appendTo('[lvs_elm=AddRow]');
            });
            $(crsbox).find(".TmplTable").on("click", "[lvs_elm=AddCol]", function(){
                $(this).closest("thead").find("th").each(function(n){
                    $(this).attr("seq", n );
                });
                var curtd = $(this).closest("th");
                $('body').unidialog("#AddColForm", { token: token, idxid: idxid}, function( curbt, curbox ){
                    var insertstr = "<th width=\"40%\"><span class=\"TchEdit\" contenteditable=\"true\">" + $(curbox).getbind("colname") + "</span><img class=\"HideButton\" lvs_elm=\"AddCol\" src=\"../../Image/append.png\"/></th>";
                    $(curtd).after( insertstr );
                    $(curtd).closest(".TmplTable").find("tr").each(function(){
                        $(this).find("td").each(function(k){
                            if( k == $(curtd).attr("seq") ){
                                if( $(curbox).getbind("edittype") == "tchedit" )
                                    $(this).after("<td><div contenteditable=\"true\" class=\"TchEdit\"></div></td>");
                                else
                                    $(this).after("<td><div contenteditable=\"true\" class=\"TchEdit StudEdit\"><div></td>");
                            }
                        });
                    });
                    $(curtd).closest(".TmplTable").find("thead").find("th").each(function(n){
                        if( n == $(curtd).closest(".TmplTable").find("thead").find("th").size() - 1)
                            $(this).attr("width",  (50 / $(curtd).closest(".TmplTable").find("thead").find("th").size()) + "%");
                        else
                            $(this).attr("width",  (200 / ($(curtd).closest(".TmplTable").find("thead").find("th").size() * 2 -1)) + "%");
                    });
                    $('body').closedialog();
                });
                $(crsbox).find("[lvs_elm=SaveTaskTmpl]").css("display", "");
            });
        }
    });
})(jQuery);


function CheckThemeRes(token, idxid, curdata, curans){
    var DataEng = LvsData.Create();
    DataEng.GetData( "leag/lesn_set", $('.ResOk'), { access_token: token, lesnid: curdata.lesnid || idxid, pageid: curdata.pageid, checkid: curdata.checkid, checkans: curans, opetype: "LesnCheck" }, function( apiname, params, result ){
    });
}

function ReplaceBlankStr( oristr, answer ){
    let idxstr = oristr;
    let idx = idxstr.indexOf("_");
    let retstr = "";
    let inpnum = 0;
    let ansval = [];
    if( answer != undefined && answer.curans != "" && answer.curans != undefined )
        ansval = answer.curans.split('|');
    for( var i = 0; i < 10; i ++ ){
        if( idx == -1 ){
            retstr += idxstr;
            break;
        }
        retstr += idxstr.substr( 0, idx );
        for( var j = 0; j < 50; j ++ ){
            if( idx + 1 + j >= idxstr.length || idxstr.substr( idx + 1 + j, 1 ) != "_" ){
                retstr += "<input type=\"text\" class=\"InputBlank\" style=\"width:" + (j + 1) * 26 + "px\" " + (ansval.length > inpnum?"value=\"" + ansval[inpnum] + "\"":"") + "/>";
                inpnum ++;
                idxstr = idxstr.substr( idx + 1 + j);
                break;
            }
        }
        idx = idxstr.indexOf("_");
    }
    //if( answer != undefined && answer.curans != "" && answer.curans != undefined)
        //retstr += "<br/><span class=\"txt-red\">参考答案：" + answer.baseanswer + "</span>"
    return retstr;
}

//将已有答案加入到课程数据中
function refreshPageTheme( pageitem, taskans ){
    if( pageitem.type == "thmsel" || pageitem.type == "thmblank" || pageitem.type == "thmanswer"){
        if( taskans ){
            for( var j = 0; j < taskans.length; j ++ ){
                if( taskans[j].id == pageitem.id && taskans[j].ansstatus!='' && taskans[j].ansstatus!='新建' ){
                    pageitem.checkok = 1;
                    if( pageitem.answer == undefined && taskans[j].ansdesc != "" && taskans[j].ansdesc != undefined)
                        pageitem.answer = $.parseJSON( decodeURIComponent( taskans[j].ansdesc ));
                    isfind = true;
                    break;
                }
            }
        }
    }
    if( pageitem.elements == undefined )
        return;
    for( var i = 0; i < pageitem.elements.length; i ++ ){
        let thmtype = pageitem.elements[i].type;
        let isfind = false;
        if( thmtype == "sigsel" || thmtype == "multsel" || thmtype=="blank" ||thmtype == "answer" || thmtype == "task"  ){
            if( taskans != undefined ){
                for( var j = 0; j < taskans.length; j ++ ){
                    if( taskans[j].id == pageitem.elements[i].id && taskans[j].ansstatus!='' && taskans[j].ansstatus!='新建' ){
                        pageitem.elements[i].checkok = 1;
                        if( pageitem.elements[i].answer == undefined && taskans[j].ansdesc != "" && taskans[j].ansdesc != undefined)
                            pageitem.elements[i].answer = $.parseJSON( decodeURIComponent( taskans[j].ansdesc ));
                        isfind = true;
                        break;
                    }
                }
            }
        }
    }
}