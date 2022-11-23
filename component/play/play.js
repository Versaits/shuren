//课程播放组件
(function (jQuery) {
    jQuery.fn.extend({
        lvslesnplay: function (token, idxid, curdata) {
            var playbox = $(this);
            var Lvs = LvsCore.Create();
            if (curdata.lesnid == 0 || curdata.lesnid == undefined){
                curdata.lesnid = idxid;
            }
            if( curdata.pages == undefined )
                curdata.pages = [];
            if( curdata.tasks == undefined )
                curdata.tasks = [];
            if( curdata.playtype == undefined || curdata.playtype == "lesn" ){
                for (var i = 0; i < curdata.pages.length; i++) {
                    if (curdata.pages[i].type == undefined)
                        curdata.pages[i].type = curdata.pages[i].plantype;
                    if (curdata.pages[i].hasOwnProperty("item") == false || curdata.pages[i].item == undefined) {
                        var pagestr = decodeURIComponent(curdata.pages[i].pagestr || curdata.pages[i].plandesc);
                        curdata.pages[i].item = {};
                        if (pagestr != undefined && pagestr != ""){
                            try{
                                curdata.pages[i].item = $.parseJSON(pagestr);
                            }
                            catch(err){
                                curdata.pages[i].item = {};
                            }
                        }
                        if( curdata.pages[i].item.elements ){
                            for( var j = 0; j < curdata.pages[i].item.elements.length; j ++ ){
                                if( curdata.pages[i].item.elements[j].lesnid )
                                    curdata.pages[i].item.elements[j].lesnid = curdata.lesnid;
                            }
                        }
                    }
                    var master = {};
                    if (curdata.pages[i].item != undefined && curdata.pages[i].item.masterid != undefined && curdata.masters != undefined && curdata.pages[i].item.masterid < curdata.masters.length + 1 && curdata.pages[i].item.masterid > 0)
                        master = curdata.masters[parseInt(curdata.pages[i].item.masterid) - 1];
                    else if (curdata.masters != undefined && 0 < curdata.masters.length)
                        master = curdata.masters[0];
                    if (master.item == undefined && (master.pagestr != "" && master.pagestr != undefined || master.plandesc != "" && master.plandesc != undefined)){
                        try{
                            master.item = $.parseJSON(decodeURIComponent(master.pagestr || master.plandesc));
                        }
                        catch(err){
                            master.item = {};
                        }
                    }
                    curdata.pages[i].item.master = master.item;
                }
            }
            if( curdata.playtype == undefined || curdata.playtype == "task" ){
                if (curdata.hasOwnProperty("tasks")) {
                    for (var i = 0; i < curdata.tasks.length; i++) {
                        curdata.tasks[i].type = "task";
                        if (curdata.tasks[i].hasOwnProperty("item") == false || curdata.tasks[i].item == undefined) {
                            var pagestr = decodeURIComponent(curdata.tasks[i].pagestr || curdata.tasks[i].plandesc);
                            curdata.tasks[i].item = {};
                            if (pagestr != undefined && pagestr != ""){
                                try{
                                    curdata.tasks[i].item = $.parseJSON(pagestr);
                                }
                                catch(err){
                                    curdata.tasks[i].item = {};
                                }
                            }
                            if( curdata.tasks[i].item.elements ){
                                for( var j = 0; j < curdata.tasks[i].item.elements.length; j ++ ){
                                    if( curdata.tasks[i].item.elements[j].lesnid )
                                        curdata.tasks[i].item.elements[j].lesnid = curdata.lesnid;
                                }
                            }
                        }
                    }
                }
            }
            $(playbox).find(".PlayLast").click(function () {
                var seqid = $(playbox).find(".PlayPageItemAct").attr("seqidx");
                $(playbox).find(".PlayPageItem").each(function () {
                    if (parseInt($(this).attr("seqidx")) + 1 == seqid)
                        $(this).click();
                });
            });
            $(playbox).find(".PlayNext").click(function () {
                $(playbox).lvslesnplaynext(token, curdata.lesnid, curdata.preview);
            });
            $(playbox).find("[lvs_elm=TaskTheme]").click(function () {
                var curpageid = $(this).attr("idxid");
                if( curdata.taskans[$(this).attr("dataidx")].type == "TTask" ){
                    $('body').unidialog( "#WorkTaskForm", { token, idxid}, function( curbt, curbox ){
                        $('body').closedialog();
                        if( $('[lvs_elm=LesnTopicTask]').size() > 0 )
                            $('[lvs_elm=LesnTopicTask]').click();
                        else
                            lvs.LvsRout("studtask", token, idxid, curdata.lesnid );
                    });
                }
                else{
                    $(playbox).find(".PlayPageItem").each(function () {
                        if ($(this).attr("seqidx") == curpageid)
                            $(this).click();
                    });
                }
            });
            $(playbox).find("[lvs_elm=PlayIndex]").click(function(){
                $('body').basepanel({left: $(this).offset().left, top: $(this).offset().top, width: 120}, function( curbox ){
                    var pagelist = "";
                    for( var i = 0; i < curdata.pages.length; i ++ ){
                        pagelist += "<div class=\"ListItem\" style=\"font-size:12px\" idxid=\"" + i + "\">第" + (i + 1) + "页.";
                        if( curdata.pages[i].plantype == "plan")
                            pagelist+= "讲义";
                        else if( curdata.pages[i].plantype == "check")
                            pagelist += "检测";
                        else if( curdata.pages[i].plantype=="task")
                            pagelist += "任务";
                        pagelist += "</div>";
                    }
                    for( var i = 0; i < curdata.tasks.length; i ++ ){
                        pagelist += "<div class=\"ListItem\" style=\"font-size:12px;color:blue\" idxid=\"" + (curdata.pages.length + i) + "\">第" + (i+1) + "项任务</div>";
                    }
                    $(curbox).html(pagelist);
                    $(curbox).find(".ListItem").click(function(){
                        var curitem = $(this).attr("idxid");
                        $(playbox).find(".PlayPageItem").each(function(){
                            if( $(this).attr("seqidx") == curitem )
                                $(this).click();
                        });
                        $('body').closepanel();
                        $('body').unbind("click");
                    });
                    $('body').bind("click",function(){
                        if( $(".PanelBox:hover").size() == 0 ){
                            $('body').closepanel();
                            $('body').unbind("click");
                        }
                    });
                });
            });
            $(playbox).find("[lvs_elm=LesnAttach]").click(function () {
                lvsdata.GetData("edu/course_list", $("#LesnInfoForm").html(""), { access_token: token, crstmplid: curdata.id, gettype: "CrsTmpl.Files" }, function (apiname, params, result) {
                    $('#LesnInfoForm').loadtmpl("cn.lesn.lesnform", "#LesnFileTmpl", result, function () {
                        $('body').unidialog("#LesnInfoForm", { token: token, idxid: idxid, closing: 1 }, function (curbt, curbox) {
                            if($(curbt).attr("opetype") == "DownDlgFile" ){
                                $(curbt).downfile( $(curbt).attr("fileurl"), $(curbt).attr("filename"));
                            }
                        });
                    });
                });
            });
            $('body').keydown(function (e) {
                if (e.keyCode == 37) {
                    $(playbox).find(".PlayLast").click();
                }
                else if (e.keyCode == 39) {
                    $(playbox).lvslesnplaynext(token, curdata.lesnid, curdata.preview);
                }
            });
            $(playbox).find(".PlayOrPause").click(function () {
                if (curdata.autoplay == undefined)
                    curdata.autoplay = 0;
                if (curdata.autoplay == 0) {
                    curdata.autoplay = 1;
                    $(this).attr("autoplay", curdata.autoplay).attr("paused", 0);
                    $(this).find("img").attr("src", "../Image/pausepage.png");
                    $(playbox).cpn("cn.play.lesnpage").pageplaypause(1);
                }
                else {
                    curdata.autoplay = 0;
                    $(this).attr("autoplay", curdata.autoplay);
                    $(this).find("img").attr("src", "../Image/playpage.png");
                    $(playbox).cpn("cn.play.lesnpage").pageplaypause(0);
                }
            });
            $('body').everyTime("1s", function () {
                if ($(playbox).find("[lvs_elm=CurLesnPage]").size() == 0)
                    $('body').stopTime();
                if (curdata.autoplay == 1 && $(playbox).attr("paused") != 1) {
                    if (curdata.curpage < curdata.pages.length) {
                        if ($(playbox).find("[lvs_elm=CurLesnPage]").find("[lvs_elm=timer]").size() > 0) {
                            var curtimer = $(playbox).find("[lvs_elm=CurLesnPage]").find("[lvs_elm=timer]").eq(0);
                            if ($(curtimer).attr("timershow") == 1) {
                                var cursec = parseInt($("[lvs_elm=TimerIng]").attr("cursec")) + 1;
                                if ($(curtimer).attr("autoend") == 1 && parseInt($(curtimer).attr("playsec")) < cursec) {
                                    $('body').closepanel();
                                    $(playbox).lvslesnplaynext(token, curdata.lesnid, curdata.preview);
                                }
                                else {
                                    $("[lvs_elm=TimerIng]").attr("cursec", cursec).text(parseInt(cursec / 3600) + ":" + (parseInt((cursec % 3600) / 60) < 10 ? "0" : "") + parseInt((cursec % 3600) / 60) + ":" + (parseInt(cursec % 60) < 10 ? "0" : "") + parseInt(cursec % 60));
                                }
                            }
                            else if (parseInt($(curtimer).attr("cursec")) > parseInt($(curtimer).attr("begsec"))) {
                                $('body').basepanel({ left: $(playbox).offset().left + $(playbox).width() * 64 / 100, top: $(playbox).offset().top + 10, width: $(playbox).width() * 35 / 100 }, function (curbox) {
                                    $(curtimer).attr("timershow", 1);
                                    $(curbox).html("<div class=\"TimerBox\"><span class=\"TimerImg\"><img width=\"24px\" src=\"../../Image/timer.png\"/></span><span class=\"TimerShow\" lvs_elm=\"TimerIng\" cursec=\"0\"></span><a class=\"TimerEnd\" lvs_elm=\"TimerEnd\">结束本页</a></div>");
                                    $(curbox).find("[lvs_elm=TimerEnd]").click(function () {
                                        $('body').closepanel();
                                        $(playbox).lvslesnplaynext(token, curdata.lesnid, curdata.preview);
                                    });
                                    $(curbox).find(".TimerImg").click(function () {
                                        $('body').closepanel();
                                        $(curtimer).one("click", function () {
                                            $(curtimer).attr("timershow", 0);
                                        });
                                    });
                                });
                            }
                            else {
                                var cursec = parseInt($(curtimer).attr("cursec") == undefined ? "0" : $(curtimer).attr("cursec")) + 1;
                                $(curtimer).attr("cursec", cursec);
                            }
                        }
                        if (curdata.pages[curdata.curpage].type == "check") {
                            if ($(playbox).find(".PlayPageItemAct").hasClass("PlayPageCheckOk") || curdata.preview > 0) {
                                if ($(playbox).find(".PlayPageItemAct").attr("chktime") != undefined && $(playbox).find(".PlayPageItemAct").attr("chktime") > 0) {
                                    $(playbox).find(".PlayPageItemAct").attr("chktime", parseInt($(playbox).find(".PlayPageItemAct").attr("chktime")) - 1);
                                }
                                else
                                    $(playbox).lvslesnplaynext(token, curdata.lesnid, curdata.preview);
                            }
                        }
                        else {
                            if ($(playbox).find("[lvs_elm=CurLesnPage]").find("[lvs_elm=video]").size() == 0 && $(playbox).find("[lvs_elm=CurLesnPage]").find("[lvs_elm=voice]").size() == 0 && $(playbox).find("[lvs_elm=CurLesnPage]").find("[lvs_elm=timer]").size() == 0) {
                                var maxsec = curdata.pages[curdata.curpage].playtime || curdata.pages[curdata.curpage].timeoff || 6;
                                if (maxsec <= 0)
                                    maxsec = 6;
                                var cursec = parseInt($(playbox).find(".PlayPageItemAct").attr("cursec"));
                                if (cursec + 1 > maxsec)
                                    $(playbox).lvslesnplaynext(token, curdata.lesnid, curdata.preview);
                                else {
                                    $(playbox).find(".PlayPageItemAct").attr("cursec", cursec + 1);
                                    $(playbox).find(".PlayPageItemAct").find(".PlayPageItemProg").css("width", ((cursec + 1) * 100 / maxsec) + "%");
                                }
                            }
                            else if ($(playbox).find("[lvs_elm=CurLesnPage]").find("[lvs_elm=video]").size() > 0) {
                                if ($(playbox).find("[lvs_elm=CurLesnPage]").find("[lvs_elm=video]").eq(0).attr("playend") == 1 && $(playbox).find("[lvs_elm=CurLesnPage]").find("[lvs_elm=timer]").size() == 0) {
                                    $(playbox).find(".PlayPageItemAct").attr("maxsec", $(playbox).find(".PlayPageItemAct").attr("cursec"));
                                    $(playbox).lvslesnplaynext(token, curdata.lesnid, curdata.preview);
                                }
                                else
                                    $(playbox).find("[lvs_elm=CurLesnPage]").find("[lvs_elm=video]").eq(0).click();
                                $(playbox).find(".PlayPageItemAct").attr("cursec", parseInt($(playbox).find(".PlayPageItemAct").attr("cursec")) + 1);
                            }
                            else {
                                for (var i = 0; i < $(playbox).find("[lvs_elm=CurLesnPage]").find("[lvs_elm=voice]").size(); i++) {
                                    if ($(playbox).find("[lvs_elm=CurLesnPage]").find("[lvs_elm=voice]").eq(i).attr("playend") == 1) {
                                        if (i == $(playbox).find("[lvs_elm=CurLesnPage]").find("[lvs_elm=voice]").size() - 1 && $(playbox).find("[lvs_elm=CurLesnPage]").find("[lvs_elm=timer]").size() == 0) {
                                            $(playbox).find(".PlayPageItemAct").attr("maxsec", $(playbox).find(".PlayPageItemAct").attr("cursec"));
                                            $(playbox).lvslesnplaynext(token, curdata.lesnid, curdata.preview);
                                        }
                                    }
                                    else if ($(playbox).find("[lvs_elm=CurLesnPage]").find("[lvs_elm=voice]").eq(i).attr("playend") == -1)
                                        break;
                                    else {
                                        $(playbox).find("[lvs_elm=CurLesnPage]").find("[lvs_elm=voice]").eq(i).attr("playend", -1).click();
                                        break;
                                    }
                                }
                                $(playbox).find(".PlayPageItemAct").attr("cursec", parseInt($(playbox).find(".PlayPageItemAct").attr("cursec")) + 1);
                            }
                        }
                    }
                    else {
                        $('body').stopTime();
                        if (curdata.pages.length > 0) {
                            //var tips = ErrorTip.Create();
                            //tips.Show("播放完毕" + curdata.pages.length);
                        }
                    }
                }
            });
            $(playbox).find(".PlayPageItem").click(function () {
                var curidx = $(this).attr("seqidx");
                var curpageidx = $(this);
                if (curdata.preview != 1) {
                    $(playbox).find(".PlayPageCheck").each(function () {
                        var checkidx = $(this).attr("seqidx");
                        if (parseInt(checkidx) < parseInt(curidx)) {
                            curidx = $(this).attr("seqidx");
                            curpageidx = $(this);
                        }
                    });
                }
                if (curidx != $(this).attr("seqidx"))
                    $(curpageidx).click();
                else if ($(playbox).find(".PlayPageItemAct").size() > 0) {
                    var oldidx = $(playbox).find(".PlayPageItemAct").attr("seqidx");
                    var toleft = 0;
                    if (parseInt(oldidx) > parseInt(curidx)) {
                        toleft = $(playbox).find("[lvs_elm=CurLesnPage]").width();
                    }
                    else if (parseInt(oldidx) < parseInt(curidx)) {
                        toleft = 0 - $(playbox).find("[lvs_elm=CurLesnPage]").width();
                    }
                    else {
                    }
                    $(playbox).find("[lvs_elm=CurLesnPage]").animate({ left: toleft }, 800, "", function () {
                        $(this).html("").fadeOut(100, function () {
                            $(this).css("left", 0);
                            var curbox = $(this);
                            var playitem = {};
                            if (parseInt(curidx) >= curdata.pages.length) {/*作业页面*/
                                var taskidx = parseInt(curidx) - curdata.pages.length;
                                curdata.tasks[taskidx].item.pageid = curdata.tasks[taskidx].id;
                                if (curdata.tasks[taskidx].hasOwnProperty("lesnchks"))
                                    curdata.tasks[taskidx].item.lesnchks = curdata.tasks[taskidx].lesnchks;
                                curdata.tasks[taskidx].item.type = curdata.tasks[taskidx].type;
                                curdata.tasks[taskidx].item.lesnid = curdata.lesnid;
                                playitem = curdata.tasks[taskidx].item;
                            }
                            else {
                                curdata.pages[curidx].item.pageid = curdata.pages[curidx].id;
                                if (curdata.pages[curidx].hasOwnProperty("lesnchks"))
                                    curdata.pages[curidx].item.lesnchks = curdata.pages[curidx].lesnchks;
                                curdata.pages[curidx].item.type = curdata.pages[curidx].type;
                                curdata.pages[curidx].item.lesnid = curdata.lesnid;
                                playitem = curdata.pages[curidx].item;
                            }
                            refreshPageTheme(playitem, curdata.taskans);
                            var pagebox = $(this);
                            var itemdata = parseInt(curidx) >= curdata.pages.length ? curdata.tasks[parseInt(curidx) - curdata.pages.length].item : curdata.pages[curidx].item;
                            Lvs.BindTmpl("#cn.play.lesnpage", $(this), token, idxid, itemdata, function () {
                                $(pagebox).setpagescale( $(pagebox).width(), itemdata );
                                $(playbox).bind("pass", function (e, isok, taskid) {
                                    $(playbox).find('[themetaskid=' + taskid + ']').removeClass("TaskThemeNok").addClass("TaskThemeOk");
                                });
                                if (parseInt(curidx) >= curdata.pages.length && curdata.pages[parseInt(curidx) - curdata.pages.length].type == "task") {
                                    $(curbox).click(function () {
                                        $(playbox).trigger("begtask", [curdata.pages[parseInt(curidx) - curdata.pages.length].id]);
                                    });
                                }
                                $(curbox).fadeIn(800, function () {
                                    if ($(curbox).find("[lvs_elm=voice]").size() > 0 && (curdata.autoplay != 1 || $(playbox).attr("paused") == 1)) {
                                        $(curbox).find("[lvs_elm=voice]").eq(0).attr("playend", -1).click();
                                    }
                                    if ($(curbox).find("[lvs_elm=theme]").size() > 0 || $(curbox).find("[lvs_elm=task]").size() > 0) {
                                        $(playbox).attr("paused", 1);
                                        var allok = true;
                                        $(curbox).find("[lvs_elm=theme]").each(function () {
                                            if ($(this).getthemepass() == false && allok == true) {
                                                allok = false;
                                                $(this).beganstheme();
                                            }
                                        });
                                        if (allok == true) {
                                            $(curbox).find("[lvs_elm=task]").each(function () {
                                                if ($(this).getthemepass() == false && allok == true) {
                                                    allok = false;
                                                    $(this).beganstheme();
                                                }
                                            });
                                        }
                                        $(curbox).bind("pass", function (e, isok) {
                                            allok = true;
                                            $(curbox).find("[lvs_elm=theme]").each(function () {
                                                if ($(this).getthemepass() == false && allok == true) {
                                                    allok = false;
                                                    $(this).beganstheme();
                                                }
                                            });
                                            if (allok == true) {
                                                $(curbox).find("[lvs_elm=task]").each(function () {
                                                    if ($(this).getthemepass() == false && allok == true) {
                                                        allok = false;
                                                        $(this).beganstheme();
                                                    }
                                                });
                                            }
                                            if (allok) {
                                                $(playbox).attr("paused", 0);
                                                if ($(playbox).find(".PlayPageItemAct").hasClass("PlayPageCheck"))
                                                    $(playbox).find(".PlayPageItemAct").removeClass("PlayPageCheck").addClass("PlayPageCheckOk");
                                            }
                                        });
                                        if (allok) {
                                            $(playbox).attr("paused", 0);
                                            if ($(playbox).find(".PlayPageItemAct").hasClass("PlayPageCheck"))
                                                $(playbox).find(".PlayPageItemAct").removeClass("PlayPageCheck").addClass("PlayPageCheckOk");
                                        }
                                    }
                                    if (curdata.preview != 1) {
                                        var DataEng = LvsData.Create();
                                        DataEng.StoleData("leag/lesn_set", { access_token: token, lesnid: curdata.lesnid, pageid: parseInt(curidx) + 1, opetype: "Lesned" }, function (apiname, params, result) {
                                        });
                                    }
                                });
                            });
                        });
                    });
                    $(playbox).find('.PlayPageItemAct').removeClass("PlayPageItemAct");
                    $(this).addClass("PlayPageItemAct");
                    if (curidx < curdata.pages.length && curdata.pages[curidx].type == "check")
                        $(this).attr("chktime", 6);
                    $(this).attr("cursec", 0);
                    curdata.curpage = curidx;
                    $(playbox).find("[lvs_bind=curpage]").text(parseInt(curdata.curpage) + 1);
                }
                else {
                    var curidx = $(this).attr("seqidx");
                    if (parseInt(curidx) >= curdata.pages.length) {//作业页面
                        $(playbox).find("[lvs_elm=CurLesnPage]").fadeOut(100, function () {
                            curdata.tasks[curidx - curdata.pages.length].item.lesnid = curdata.lesnid;
                            refreshPageTheme(curdata.tasks[curidx - curdata.pages.length].item, curdata.taskans);
                            var pagebox = $(this);
                            Lvs.BindTmpl("#cn.play.lesnpage", $(this).html(""), token, idxid, curdata.tasks[curidx - curdata.pages.length].item, function () {
                                $(pagebox).fadeIn(500);
                                $(pagebox).setpagescale( $(pagebox).width(), curdata.tasks[curidx - curdata.pages.length].item );
                                $(playbox).bind("pass", function (e, isok, taskid) {
                                    $(playbox).find('[themetaskid=' + taskid + ']').removeClass("TaskThemeNok").addClass("TaskThemeOk");
                                });
                            });
                        });
                    }
                    else {
                        $(playbox).find("[lvs_elm=CurLesnPage]").fadeOut(100, function () {
                            curdata.pages[curidx].item.lesnid = curdata.lesnid;
                            refreshPageTheme(curdata.pages[curidx].item, curdata.taskans);
                            var pagebox = $(this);
                            Lvs.BindTmpl("#cn.play.lesnpage", $(this).html(""), token, idxid, curdata.pages[curidx].item, function () {
                                $(pagebox).fadeIn(500);
                                $(pagebox).setpagescale( $(pagebox).width(), curdata.pages[curidx].item );
                                $(playbox).bind("pass", function (e, isok, taskid) {
                                    $(playbox).find('[themetaskid=' + taskid + ']').removeClass("TaskThemeNok").addClass("TaskThemeOk");
                                });
                            });
                        });
                    }
                    $(this).addClass("PlayPageItemAct");
                    $(this).attr("cursec", 0);
                    curdata.curpage = curidx;
                    $(playbox).find("[lvs_bind=curpage]").text(parseInt(curdata.curpage) + 1);
                }
            });
            $(playbox).find(".PlayPageItemAct").click();
            $(window).bind("orientationchange", function (evt) {
                setTimeout(function () {
                    $(playbox).lvsplayfull();
                }, 300);
            });
            $(playbox).find(".FullScreen").click(function () {
                if ($(this).attr("sta") == "exit") {
                    $(this).attr("sta", "full").find("img").attr("src", "../Image/exitfull.png");
                    $(playbox).lvsplayfull();
                }
                else {
                    $(this).attr("sta", "exit").find("img").attr("src", "../Image/fullscreen.png");
                    $(playbox).lvsexitfull();
                }
            });
            return this;
        },
        lvsplayfull: function () {
            var playbox = $(this);
            if ($(window).width() < $(window).height()) {
                var tips = ErrorTip.Create();
                tips.Show("请旋转屏幕查看全屏模式");
            }
            else if ($(window).width() > $(window).height()) {
                fullScreen();
                if ($('#OperateForm').size() == 0)
                    $('body').append("<div class=\"BaseForm\" id=\"OperateForm\" style=\"display:none\"></div>");
                $('#OperateForm').html("<br/><br/>切换为全屏播放？<br/><br/><div style=\"text-align:center\"><a class=\"FormOk button bg-green\">全屏播放</a></div>");
                $('body').unidialog("#OperateForm", { token: "", idxid: 0 }, function (curbt, curbox) {
                    $('body').closedialog();
                    fullScreen();

                    var wid = $(window).width();
                    var heit = $(window).height();
                    $(playbox).find(".PlayControl").css({ display: "block", position: "fixed", top: 0, left: 0, "z-index": 1801 });
                    $(playbox).find(".PlayPanel").css({ width: wid, height: heit - 5, background: "White", position: "fixed", top: 0, left: 0, "z-index": 1800 });
                    if (wid > (heit - 5) * 16 / 9)
                        $(playbox).find(".LesnPlayPage").css({ width: parseInt((heit - 5) * 16 / 9), height: heit - 5, "margin-left": parseInt(wid - (heit - 5) * 16 / 9) / 2 });
                    else
                        $(playbox).find(".LesnPlayPage").css({ width: wid, height: wid * 9 / 16, "margin-top": parseInt(heit - wid * 9 / 16) / 2 });
                    $(playbox).find(".PlayPanel").click(function () {
                        $(playbox).find(".PlayControl").css("display", "");
                    });
                    $(playbox).find(".PlayPageItemAct").click();
                    $('body').keyup(function (e) {
                        if (e.keyCode == 27) {
                            $(playbox).find(".FullScreen").attr("sta", "exit").find("img").attr("src", "../Image/fullscreen.png")
                            $(playbox).lvsexitfull();
                        }
                    });
                });
            }
        },
        lvsexitfull: function () {
            exitFullScreen();
            var playbox = $(this);
            $(playbox).find(".PlayControl").css({ width: "100%", position: "", "z-index": 1 });
            $(playbox).find(".PlayPanel").css({ width: "100%", position: "", "z-index": 0 });
            $(playbox).find(".PlayPanel").css("height", parseInt($(playbox).find(".PlayPanel").width()) * 9 / 16);
            $(playbox).find(".LesnPlayPage").css({ width: "100%", height: parseInt($(playbox).find(".PlayPanel").width()) * 9 / 16, "margin-left": 0, "margin-top": 0 });
        },
        lvslesnplaynext: function (token, idxid, ispreview) {
            $('body').closepanel();
            var playbox = $(this);
            var seqid = parseInt($(playbox).find(".PlayPageItemAct").attr("seqidx"));
            if (seqid >= $(playbox).find(".PlayPageItem").size() - 1) {
                $(playbox).find(".PlayOrPause").click();
                $(playbox).find("[lvs_elm=CurLesnPage]").animate({ left: 0 - $(playbox).find("[lvs_elm=CurLesnPage]").width() }, 800, "", function () {
                    $(this).html("").fadeOut(100, function () {
                        $(this).css("left", 0);
                        var curbox = $(this);
                        var Lvs = LvsCore.Create();
                        var DataEng = LvsData.Create();
                        if (ispreview != 1) {
                            DataEng.StoleData("leag/lesn_set", { access_token: token, lesnid: idxid, pageid: $(playbox).find(".PlayPageItem").size(), opetype: "Lesned" }, function (apiname, params, result) {
                            });
                        }
                        Lvs.BindTmpl("#cn.play.lesnend", $(this), "", 0, { pageidx: 0, lesnnext: -1 }, function () {
                            $(curbox).fadeIn(800, function () {
                                $(playbox).trigger("playend", [idxid, $(playbox).find(".PlayPageItem").size()]);
                            });
                            $(curbox).find("[lvs_elm=ReplayLesn]").click(function () {
                                $(playbox).find(".PlayOrPause").click();
                                $(playbox).find(".PlayPageItem").each(function () {
                                    if (parseInt($(this).attr("seqidx")) == 0)
                                        $(this).click();
                                });
                            });
                        });
                    });
                });
            }
            else {
                $(playbox).find(".PlayPageItem").each(function () {
                    if (parseInt($(this).attr("seqidx")) - 1 == seqid)
                        $(this).click();
                });
            }
            return this;
        },
        setcheckok: function (idname, chktime) {
            if (idname == undefined || idname == "")
                $(this).find("[lvs_elm=PlayPageIdxs]").find(".PlayPageItemAct").removeClass("PlayPageCheck").addClass("PlayPageCheckOk").attr("chktime", chktime != undefined ? chktime : 0);
            else {
                $(this).find("[lvs_elm=PlayPageIdxs]").find(".PlayPageItem").each(function () {
                    if ($(this).attr("pageid") == idname)
                        $(this).removeClass("PlayPageCheck").addClass("PlayPageCheckOk").attr("chktime", chktime != undefined ? chktime : 0);
                });
            }
            return $(this);
        },
        ischeck: function () {
            return $(this).find("[lvs_elm=PlayPageIdxs]").find(".PlayPageItemAct").hasClass("PlayPageCheck");
        },
        ischeckok: function () {
            return $(this).find("[lvs_elm=PlayPageIdxs]").find(".PlayPageItemAct").hasClass("PlayPageCheckOk");
        },
        getcurrenttime: function () {
            return { pageid: $(this).find("[lvs_elm=PlayPageIdxs]").find(".PlayPageItemAct").attr("seqidx"), cursec: parseInt($(this).find(".PlayPageItemAct").attr("cursec")) };
        },
        playpause: function (paused) {
            $(this).attr("paused", paused);
            return $(this);
        },
        getplaytime: function () {
            return $(this).getplaycurtime();
        },
        getplaycurtime: function () {
            var curpageidx = $(this).find('.PlayPageItemAct').attr("seqidx");
            var cursec = 0;
            $(this).find('.PlayPageItem').each(function () {
                if ($(this).attr("seqidx") <= curpageidx) {
                    cursec += parseInt($(this).attr("cursec"));
                }
            });
            return cursec;
        },
        getplaylong: function () {
            var ttlsec = 0;
            $(this).find(".PlayPageItem").each(function () {
                ttlsec += parseInt($(this).attr("maxsec"));
            });
            return ttlsec;
        }
    });
})(jQuery);

//课程单页组件
(function (jQuery) {
    jQuery.fn.extend({
        lvslesnpage: function (token, idxid, curdata) {
            var pagebox = $(this);
            /*
            $(pagebox).find("[lvs_elm=text]").each(function(){
                var curleft = parseFloat(curdata.elements[$(this).attr("seqidx")].left.replace("%", "")) * $(pagebox).width() / 100;
                var curtop = parseFloat(curdata.elements[$(this).attr("seqidx")].top.replace("%", "")) * $(pagebox).height() / 100;
                $(this).css( { left: curleft, top: curtop } );
            });
            $(pagebox).find("[lvs_elm=file]").each(function(){
                var curleft = parseFloat(curdata.elements[$(this).attr("seqidx")].left.replace("%", "")) * $(pagebox).width() / 100;
                var curtop = parseFloat(curdata.elements[$(this).attr("seqidx")].top.replace("%", "")) * $(pagebox).height() / 100;
                $(this).css( { left: curleft, top: curtop } );
            });*/
            if( curdata.hasOwnProperty("lesnchks") && curdata.lesnchks.length > 0 ){
                if( curdata.type == "check" )
                    $('body').selcomponent( "cn.play.lesnplay", 0).setcheckok("", 6);
            }
            $(pagebox).find("[lvs_elm=voice]").click(function(){
                var voicebox = $(this);
                window[$(voicebox).attr("id")] = $(this).find("audio")[0];
                if( $('#AutoPlayForm').size() > 0 ){
                    $('body').unidialog( "#AutoPlayForm",{token :token, idxid: idxid}, function( curbt, curbox ){
                        $('body').closedialog();
                        window[$(voicebox).attr("id")].play();
                        if( isIos != undefined && isIos() == false )
                            $('#AutoPlayForm').remove();
                    });
                }
                else{
                    try
                    {
                        window[$(voicebox).attr("id")].pause();
                        window[$(voicebox).attr("id")].play();
                        console.log( "beginplay", window[$(voicebox).attr("id")].currentTime );
                    }
                    catch(err){
                        console.log( "播放错误:" + err );
                        alert( "确认自动播放？" );
                        window[$(voicebox).attr("id")].play();
                    }
                }
                var playbox = $(this);
                $(pagebox).bind( "touchstart", function(){
                    if( $(playbox).attr("ispause") == "0" ){
                        window[$(voicebox).attr("id")].play();
                        $(playbox).attr("ispause", "1" );
                    }
                    else{
                        window[$(voicebox).attr("id")].pause();
                        $(playbox).attr("ispause", "0" );
                    }

                });
                window[$(voicebox).attr("id")].addEventListener( "ended", function(){
                    $(voicebox).attr("playend", 1 );
                });
                if( curdata.hasOwnProperty( "lesnchks" )){
                    for( var i = 0; i < curdata.lesnchks.length; i ++ ){
                        //如果后台数据已经通过检查，则设置该检查点已通过
                        if( curdata.lesnchks[i].ischeck > 0 && curdata.lesnchks[i].checkid<curdata.elements[$(this).attr("seqidx")].outlines.length )
                            curdata.elements[$(this).attr("seqidx")].outlines[curdata.lesnchks[i].checkid].checked = 1;
                    }
                }
                $('[lvs_elm=PlayPageIdxs]').find(".PlayPageItemAct").lvstimelineplay( token, idxid, $(voicebox).attr("id"), $(voicebox).attr("lvs_elm"), curdata.elements[$(this).attr("seqidx")] );
            });
            $(pagebox).find('[lvs_elm=video]').click(function(){
                var playing = $(this).attr("playing") || 0;
                var curvideo = $(this);
                if( playing == 0 ){
                    $(this).attr("playing", 1 );
                    var vid = $(this).attr("id");
                    $(this).html("");
                    var playurl = $(this).attr("playurl");
                    window[vid] = new TcPlayer(vid, {
                        m3u8: playurl,
                        mp4: playurl,
                        autoplay: true,
                        width: "100%", //视频的显示宽度，请尽量使用视频分辨率宽度
                        height: "100%", //视频的显示高度，请尽量使用视频分辨率高度
                        x5_type: "h5",
                        listener: function (msg) {
                            if (msg.type == "load") {
                            }
                            else if (msg.type == "seeking") {
                                var ts = parseInt(window[vid].currentTime());
                                $('[lvs_elm=PlayPageIdxs]').find(".PlayPageItemAct").attr("cursec", parseInt( ts ));
                            }
                            else if (msg.type == "pause") {
                                $('[lvs_elm=PlayPageIdxs]').find(".PlayPageItemAct").attr("pause", 1);
                            }
                            else if (msg.type == "play") {
                                $('[lvs_elm=PlayPageIdxs]').find(".PlayPageItemAct").attr("pause", 0);
                            }
                            else if (msg.type == "ended") {
                                $(curvideo).attr("playend", 1 );
                            }
                        }
                    });
                    if( curdata.hasOwnProperty( "lesnchks" )){
                        for( var i = 0; i < curdata.lesnchks.length; i ++ ){
                            //如果后台数据已经通过检查，则设置该检查点已通过
                            if( curdata.lesnchks[i].ischeck > 0 && curdata.lesnchks[i].checkid<curdata.elements[$(this).attr("seqidx")].outlines.length )
                                curdata.elements[$(this).attr("seqidx")].outlines[curdata.lesnchks[i].checkid].checked = 1;
                        }
                    }
                    curdata.elements[$(this).attr("seqidx")].lesnid = curdata.lesnid;
                    $('[lvs_elm=PlayPageIdxs]').find(".PlayPageItemAct").lvstimelineplay( token, idxid, vid, $(this).attr("lvs_elm"), curdata.elements[$(this).attr("seqidx")] );
                }
            });
            $(pagebox).find('[lvs_elm=voice]').each(function(){
                if( $(this).attr("playend") == -1 ){
                    $(this).click();
                }
            });
            return this;
        },
        pageplaypause: function( isplay ){
            $(this).find("[lvs_elm=voice]").each(function(){
                var vplayer = $(this).find("audio")[0];
                if( isplay > 0 ){
                    vplayer.play();
                }
                else{
                    vplayer.pause();
                }
            });
            $(this).find("[lvs_elm=video]").each(function(){
                if( isplay >0 ){
                    window[$(this).attr("id")].play();
                    $(this).attr("pause", 0);
                }
                else{
                    window[$(this).attr("id")].pause();
                    $(this).attr("pause", 1);
                }
            });
            $(this).attr("ispause", isplay );
        },
        lvstimelineplay: function( token,idxid, vplayid, vtype, curdata){
            $(this).html("<div class=\"TimeLineBox\"><div class=\"TimeLineCursor\"></div></div>");
            var timebox = $(this).find(".TimeLineBox");
            if( curdata.outlines != undefined ){
                for( var i = 0; i < curdata.outlines.length; i ++){
                    $(timebox).append( "<div class=\"TimeLinePoint\" style=\"top:0;left:" + curdata.outlines[i].leftper + "%\"></div>" );
                }
            }
            var Lvs = LvsCore.Create();
            $(this).attr("pause", 0);
            $(this).stopTime();
            var playbox = $(this);
            $(this).everyTime( "1s", function(){
                var vid = vplayid;
                if( $(this).find(".TimeLineCursor").size() == 0 )
                    $(this).stopTime();
                var cursec = ( vtype == "video"? window[vid].currentTime() : window[vid].currentTime);
                if( cursec < curdata.totalsec && $(this).attr("pause") < 1 ){
                    $(this).attr("cursec", cursec );
                    var leftper = parseInt(cursec) * 100 / parseInt( curdata.totalsec );
                    if( leftper > 100 )
                        leftper = 100;
                    $(this).find(".TimeLineCursor").css("width", leftper + "%" );
                    if( curdata.outlines != undefined ){
                        for( var i = 0; i < curdata.outlines.length; i ++ ){
                            if( curdata.outlines[i].cursec <= cursec && curdata.outlines[i].cursec > cursec -1 && curdata.outlines[i].checked != 1 ){
                                console.log( "outline", i, curdata.outlines[i].cursec, cursec );
                                if( curdata.outlines[i].type == "check")
                                    $(this).attr("pause", i+1);
                                else
                                    $(this).attr("pause", 1 );
                                window[vid].pause();
                                $('[lvs_elm=CurLesnPage]').append("<div class=\"VPlayPanel\" style=\"display:none\"></div>");
                                var heit = $('[lvs_elm=CurLesnPage]').height();
                                if( curdata.outlines[i].type == "check" )
                                    curdata.outlines[i].checkid = i;
                                $('[lvs_elm=CurLesnPage]').find(".VPlayPanel").css({width:"92%","margin-left":"4%", "margin-top": 0- heit * 96 /100, "height": heit * 92 /100 } ).fadeIn(300, function(){
                                    curdata.outlines[i].item.lesnid = curdata.lesnid;
                                    refreshPageTheme(curdata.outlines[i].item, curdata.taskans);
                                    var pagebox = $(this);
                                    Lvs.BindTmpl("#cn.play.lesnpage", $(this), token, idxid, curdata.outlines[i].item, function(){
                                        $(pagebox).setpagescale( $(pagebox).width(), curdata.outlines[i].item );
                                        $(playbox).bind("pass", function (e, isok, taskid) {
                                            $(playbox).find('[themetaskid=' + taskid + ']').removeClass("TaskThemeNok").addClass("TaskThemeOk");
                                        });
                                        if( curdata.outlines[i].type != "check" ){
                                            var ptime = parseFloat(curdata.outlines[i].playtime||6);
                                            var playidx = i;
                                            setTimeout( function(){
                                                window[vid].play();
                                                $('[lvs_elm=CurLesnPage]').find(".VPlayPanel").fadeOut(1000, function(){
                                                    $(this).remove();
                                                    $(playbox).attr("pause", 0 );
                                                });
                                            }, ptime * 1000);
                                        }
                                    });
                                });
                                break;
                            }
                        }
                    }
                }
                else if( $(this).attr("pause") > 0 ){
                    if( curdata.outlines != undefined ){
                        var leftper = parseInt($(this).attr("cursec")) * 100 / parseInt( curdata.totalsec );
                        if( curdata.outlines[parseInt($(this).attr("pause"))-1].checked == 1 ){
                            $(this).attr("pause", 0 );
                            var vid = curdata.vid || $('[lvs_elm=CurLesnPage]').find("[lvs_elm=video]").attr("id")|| $('[lvs_elm=CurLesnPage]').find("[lvs_elm=voice]").attr("id");
                            $('[lvs_elm=CurLesnPage]').find(".VPlayPanel").fadeOut( 500, function(){
                                $(this).remove();
                                window[vid].play();
                            });
                        }
                    }
                }
            });
        }
    });
})(jQuery);

//课件列表显示
(function (jQuery) {
    jQuery.fn.extend({
        lvs_play_listshow: function (token, idxid, curdata) {
            var playbox = $(this);
            if (curdata.lesnid == 0 || curdata.lesnid == undefined)
                curdata.lesnid = idxid;
            if( curdata.playtype == undefined || curdata.playtype == "lesn" ){
                for (var i = 0; i < curdata.pages.length; i++) {
                    if (curdata.pages[i].type == undefined)
                        curdata.pages[i].type = curdata.pages[i].plantype;
                    if (curdata.pages[i].hasOwnProperty("item") == false || curdata.pages[i].item == undefined) {
                        var pagestr = decodeURIComponent(curdata.pages[i].pagestr || curdata.pages[i].plandesc);
                        curdata.pages[i].item = {};
                        if (pagestr != undefined && pagestr != "")
                            curdata.pages[i].item = $.parseJSON(pagestr);
                        if( curdata.pages[i].item.elements ){
                            for( var j = 0; j < curdata.pages[i].item.elements.length; j ++ ){
                                if( curdata.pages[i].item.elements[j].lesnid )
                                    curdata.pages[i].item.elements[j].lesnid = curdata.lesnid;
                            }
                        }
                    }
                    var master = {};
                    if (curdata.pages[i].item != undefined && curdata.pages[i].item.masterid != undefined && curdata.masters != undefined && curdata.pages[i].item.masterid < curdata.masters.length + 1 && curdata.pages[i].item.masterid > 0)
                        master = curdata.masters[parseInt(curdata.pages[i].item.masterid) - 1];
                    else if (curdata.masters != undefined && 0 < curdata.masters.length)
                        master = curdata.masters[0];
                    if (master.item == undefined && (master.pagestr != "" && master.pagestr != undefined || master.plandesc != "" && master.plandesc != undefined))
                        master.item = $.parseJSON(decodeURIComponent(master.pagestr || master.plandesc));
                    curdata.pages[i].item.master = master.item;
                }
            }
            if( curdata.playtype == undefined || curdata.playtype == "task" ){
                if (curdata.hasOwnProperty("tasks")) {
                    for (var i = 0; i < curdata.tasks.length; i++) {
                        if( curdata.tasks[i].type == "TTask" ){
                            if (curdata.tasks[i].hasOwnProperty("item") == false || curdata.tasks[i].item == undefined) {
                                var pagestr = decodeURIComponent( curdata.tasks[i].plandesc);
                                curdata.tasks[i].item = {};
                                if (pagestr != undefined && pagestr != ""){
                                    var taskdata = $.parseJSON(pagestr);
                                    curdata.tasks[i].item = taskdata.desc;
                                    curdata.tasks[i].item.type = taskdata.type;
                                    curdata.tasks[i].item.lesnid = curdata.lesnid;
                                    curdata.tasks[i].item.id = curdata.tasks[i].id;
                                    curdata.tasks[i].item.seqid = i;
                                }
                            }
                        }
                        else{
                            curdata.tasks[i].type = "task";
                            if (curdata.tasks[i].hasOwnProperty("item") == false || curdata.tasks[i].item == undefined) {
                                var pagestr = decodeURIComponent(curdata.tasks[i].pagestr || curdata.tasks[i].plandesc);
                                curdata.tasks[i].item = {};
                                if (pagestr != undefined && pagestr != "")
                                    curdata.tasks[i].item = $.parseJSON(pagestr);
                                if( curdata.tasks[i].item.elements ){
                                    for( var j = 0; j < curdata.tasks[i].item.elements.length; j ++ ){
                                        if( curdata.tasks[i].item.elements[j].lesnid )
                                            curdata.tasks[i].item.elements[j].lesnid = curdata.lesnid;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            $(playbox).find("[lvs_elm=PageList]").each(function(){
                refreshPageTheme(curdata.pages[$(this).attr("dataidx")].item, curdata.taskans);
                curdata.pages[$(this).attr("dataidx")].item.lesnid = curdata.lesnid;
                curdata.pages[$(this).attr("dataidx")].item.pageid = $(this).attr("dataidx");
                var pagebox = $(this);
                $(this).loadcomponent("cn.play.lesnpage", token, idxid, curdata.pages[$(this).attr("dataidx")].item, function(){
                    $(pagebox).setpagescale( $(pagebox).width(), curdata.pages[$(pagebox).attr("dataidx")].item );
                    $(playbox).bind("pass", function (e, isok, taskid) {
                        $(playbox).find('[themetaskid=' + taskid + ']').removeClass("TaskThemeNok").addClass("TaskThemeOk");
                    });
                });
            });
            $(playbox).find("[lvs_elm=TaskList]").each(function(){
                var curtask = curdata.tasks[$(this).attr("dataidx")];
                refreshPageTheme(curtask.item, curdata.taskans);
                curtask.item.lesnid = curdata.lesnid;
                curtask.item.pageid = $(this).attr("dataidx");
                var pagebox = $(this);
                if( curtask.type == "TTask" ){
                    var cmpname = "";
                    if( curtask.item.type == "thmsel" )
                        cmpname = "cn.theme.multselshow";
                    else if( curtask.item.type == "thmblank" )
                        cmpname = "cn.theme.blankinpshow";
                    else if( curtask.item.type == "thmanswer" )
                        cmpname = "cn.theme.answerinpshow";
                    $(pagebox).css({height:"","padding":"24px","text-align":"left"}).loadtmpl( cmpname, "#ThemeForm_" + (curtask.item.pageid?curtask.item.pageid+"_":"") + curtask.item.seqid, curtask.item, function(){
                        if( curtask.item.type == "thmsel" )
                            $(pagebox).lvsmultselshow(token, idxid, curtask.item );
                        else if( curtask.item.type == "thmblank")
                            $(pagebox).lvsblankinpshow( token, idxid, curtask.item );
                        else if( curtask.item.type == "thmanswer")
                            $(pagebox).lvsanswerinpshow( token, idxid, curtask.item );
                        $(pagebox).find(".FormOk").click(function(){
                            $(pagebox).lvs_task_retans( $(this), pagebox, token, idxid, curtask.item );
                        });
                        $(pagebox).bind("pass", function(){
                            ErrorTip.Create().Show("本题已完成提交" );
                        });
                    });
                }
                else{
                    $(this).loadcomponent("cn.play.lesnpage", token, idxid, curdata.tasks[$(this).attr("dataidx")].item, function(){
                        $(pagebox).setpagescale( $(pagebox).width(), curdata.tasks[$(pagebox).attr("dataidx")].item );
                        $(playbox).bind("pass", function (e, isok, taskid) {
                            $(playbox).find('[themetaskid=' + taskid + ']').removeClass("TaskThemeNok").addClass("TaskThemeOk");
                        });
                    });
                }
            });
            $(playbox).find("[lvs_elm=EditLesn]").click(function(){
                var apptype = $.cookie("fapptype" ) || "";
                window.open( "../hpoam/lesnplan.htm?tp=lesn&id=" + curdata.id + "&tn=" + (apptype=="Stem"?"fstem":apptype+"_ken"), "_blank" );
            });
            $(playbox).find("[lvs_elm=EditTask]").click(function(){
                var apptype = $.cookie("fapptype" ) || "";
                window.open( "../hpoam/lesnplan.htm?tp=task&id=" + curdata.id + "&tn=" + (apptype=="Stem"?"fstem":apptype+"_ken"), "_blank" );
            });
        }
    });
})(jQuery);

//视频播放
(function (jQuery) {
    jQuery.fn.extend({
        lvs_play_video: function (token, idxid, curdata) {
            var playbox = $(this);
            let playerid = "VideoPlay" + (curdata.id != undefined ? curdata.id:"");
            if( $(playbox).closest(".DialogBox").size() > 0){
                $(playbox).find("#" + playerid).attr("id", "CurPlayVideo");
                playerid = "CurPlayVideo";
            }
            if (curdata.fileurl != "") {
                window.liveplayer = new TcPlayer(playerid, {
                    m3u8: curdata.fileurl,
                    mp4: curdata.fileurl,
                    autoplay: true,
                    width: "100%", //视频的显示宽度，请尽量使用视频分辨率宽度
                    height: "100%", //视频的显示高度，请尽量使用视频分辨率高度
                    x5_type: "h5",
                    listener: function (msg) {
                        if (msg.type == "load") {
                            $('video').attr("x5-playsinline", "true").attr("playsinline", "true").attr("webkit-playsinline", "true").css("object-fit", "contain");
                        }
                        else if (msg.type == "seeking") {
                        }
                        else if (msg.type == "pause") {
                        }
                        else if (msg.type == "play") {
                        }
                        else if (msg.type == "ended") {
                        }
                    }
                });
                document.addEventListener("WeixinJSBridgeReady", function () {
                    window.liveplayer.play();
                });
            }
        }
    });
})(jQuery);

//SWF播放
(function (jQuery) {
    jQuery.fn.extend({
        lvs_play_swf: function (token, idxid, curdata) {
            var playbox = $(this);
            let swfFlag ;
            let playerid = "SwfPlayer" + (curdata.id != undefined ? curdata.id:"");
            if (curdata.fileurl != "" && curdata.fileurl != undefined && curdata.fileurl != "undefined") {
                swf2js.load(curdata.fileurl,{"tagId":playerid});
                swfFlag = 1;
            }

            $('body').find("[lvs_elm=PreviewPanel]").bind("DOMNodeInserted",function () {
                if (swfFlag == 1){
                    swfFlag = 0;
                }else {
                    swf2js.stopaudio();
                }
            })
            $(this).find("[lvs_elm=StopAudio]").click(function (e) {
                swf2js.stopaudio();
            })
            $(this).find("[lvs_elm=StartAudio]").click(function () {
                swf2js.playaudio();

            })
        },
    });
})(jQuery);


function fullScreen() {
    var element = document.documentElement;
    if(element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen){	// 兼容火狐
        element.mozRequestFullScreen();
    } else if(element.webkitRequestFullscreen) {	// 兼容谷歌
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {	// 兼容IE
        element.msRequestFullscreen();
    }
}
function exitFullScreen(){
    if(document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}
