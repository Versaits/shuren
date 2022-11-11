//课程分组组件
(function (jQuery) {
    jQuery.fn.extend({
        lvslesngroup: function (token, idxid, curdata) {
            var grpbox = $(this);
            if (curdata.ismem > 0) {
                $('body').selcomponent("cn.play.lesnplay", 0).setcheckok("", 8);
            }
            if (curdata.lesnid == undefined)
                curdata.lesnid = curdata.params.lesnid;
            if (curdata.lesnid == undefined )
                curdata.lesnid = idxid;
            $(grpbox).find("[lvs_elm=AddGroup]").click(function () {
                $('body').selcomponent("cn.play.lesnplay", 0).playpause(1);
                $('body').unidialog("#AddGrpForm", { token: token, idxid: idxid }, function (curbt, curbox) {
                    var DataEng = LvsData.Create();
                    DataEng.GetData("leag/lesn_set", $(this), { access_token: token, lesnid: curdata.lesnid, grouptype: curdata.params.grouptype, maxmem: curdata.params.maxmem, groupname: $(curbox).getbind("groupname"), opetype: "AddGroup" }, function (apiname, params, result) {
                        var tips = ErrorTip.Create();
                        tips.Show("分组创建成功，将继续下一页内容", function () {
                            $('body').closedialog();
                            $('body').selcomponent("cn.play.lesnplay", 0).playpause(0).setcheckok();
                            curdata.checked = 1;
                        });
                    });
                });
            });
            $(grpbox).find("[lvs_elm=JoinGroup]").click(function () {
                var groupid = $(this).attr("idxid");
                $('body').selcomponent("cn.play.lesnplay", 0).playpause(1);
                $('body').unidialog("#JoinGrpForm", { token: token, idxid: idxid, grpname: $(this).attr("data-grpname") }, function (curbt, curbox) {
                    var DataEng = LvsData.Create();
                    DataEng.GetData("leag/lesn_set", $(this), { access_token: token, lesnid: curdata.lesnid, groupid: groupid, opetype: "JoinGroup" }, function (apiname, params, result) {
                        var tips = ErrorTip.Create();
                        tips.Show("加入分组成功，将继续下一页内容", function () {
                            $('body').closedialog();
                            $('body').selcomponent("cn.play.lesnplay", 0).playpause(0).setcheckok(); ;
                            curdata.checked = 1;
                        });
                    });
                });
            });
            $(grpbox).find("[lvs_elm=QuitGroup]").click(function () {
                var groupid = $(this).attr("idxid");
                $('body').selcomponent("cn.play.lesnplay", 0).playpause(1);
                $('body').unidialog("#QuitGrpForm", { token: token, idxid: idxid, grpname: $(this).attr("data-grpname") }, function (curbt, curbox) {
                    var DataEng = LvsData.Create();
                    DataEng.GetData("leag/lesn_set", $(this), { access_token: token, lesnid: curdata.lesnid, groupid: groupid, opetype: "QuitGroup" }, function (apiname, params, result) {
                        var tips = ErrorTip.Create();
                        tips.Show("退出分组成功", function () {
                            $('body').closedialog();
                            $('body').selcomponent("cn.play.lesnplay", 0).playpause(0);
                            curdata.checked = 0;
                        });
                    });
                });
            });
            return this;
        }
    });
})(jQuery);

//课程分组成果组件
(function (jQuery) {
    jQuery.fn.extend({
        lvsgroupres: function (token, idxid, curdata) {
            var grpbox = $(this);
            if (curdata.isres > 0) {
                $('body').selcomponent("cn.play.lesnplay", 0).setcheckok("", 8);
            }
            if( curdata.lesnid == undefined)
                curdata.lesnid = idxid;
            $(grpbox).find("[lvs_elm=AddGrpRes]").click(function () {
                var grpid = $(this).attr("idxid");
                $('body').selcomponent("cn.play.lesnplay", 0).playpause(1);
                $('body').unidialog("#AddGrpResForm", { token: token, idxid: idxid }, function (curbt, curbox) {
                    var DataEng = LvsData.Create();
                    DataEng.GetData("leag/lesn_set", $(this), { access_token: token, lesnid: curdata.lesnid, groupid: grpid, pageid: curdata.params.pageid, groupdesc: $(curbox).getbind("groupdesc"), restext: $(curbox).getbind("restext"), respics: $(curbox).getbind("respics"), resvod: $(curbox).getbind("resvod"), reslink: $(curbox).getbind("reslink"), opetype: "AddGrpRes" }, function (apiname, params, result) {
                        var tips = ErrorTip.Create();
                        tips.Show("成果提交成功，将继续下一页内容", function () {
                            $('body').closedialog();
                            $('body').selcomponent("cn.play.lesnplay", 0).playpause(0).setcheckok();
                            curdata.checked = 1;
                        });
                    });
                });
            });
            $(grpbox).find("[lvs_elm=ShowGrpRes]").click(function () {
                var resid = $(this).attr("idxid");
                var DataEng = LvsData.Create();
                DataEng.GetData("leag/lesn_list", $(this).find(".CurClick"), { access_token: token, lesnid: curdata.lesnid, resid: resid, gettype: "Lesn.GroupRes" }, function (apiname, params, result) {
                    var curdata = { list: [{name: "标题", type: "title", showtext: result.grpres.title}, {name: "", type: "subscr", showtext: result.grpres.stepdesc}, { name: "", type: "html", showtext: result.grpres.resdesc, showpics: result.grpres.pics==undefined?"":result.grpres.pics, showfile: result.grpres.fileurl==undefined?"":result.grpres.fileurl, filetype: result.grpres.filetype}, {name: "", type: "remark", showtext: result.grpres.checkres}]};
                    $('[lvs_elm=ShowResBox]').loadcomponent( "cn.card.basedesc", token, idxid, curdata, function(){
                        $('body').unidialog( "#ShowGrpResForm", { token: token, idxid: idxid }, function( curbt, curbox ){
                        });
                    });
                });
            });
            $(grpbox).find("[lvs_elm=DelGrpRes]").click(function () {
                var resid = $(this).attr("idxid");
                $('body').unidialog("#DelGrpResForm", { token: token, idxid: idxid }, function (curbt, curbox) {
                    var DataEng = LvsData.Create();
                    DataEng.GetData("leag/lesn_set", $(this), { access_token: token, lesnid: curdata.lesnid, resid: resid, opetype: "DelGrpRes" }, function (apiname, params, result) {
                        var tips = ErrorTip.Create();
                        tips.Show("成果删除成功，请重新提交", function () {
                            $('body').closedialog();
                            curdata.checked = 0;
                        });
                    });
                });
            });
            return this;
        }
    });
})(jQuery);

//工作纸答题
(function (jQuery) {
    jQuery.fn.extend({
        lvs_task_ans: function (token, idxid, curdata) {
            var taskbox = $(this);
            $(this).find(".htmlformat").each(function(){
                $(this).html($(this).text());
                $(this).removeClass("htmlformat");
                $(this).find(".TchEdit").attr("contenteditable", "false" );
                $(this).find(".StudEdit").attr("contenteditable", "true" );
            });
            return this;
        }
        ,gettaskans: function(){
            $(this).find(".StudEdit").attr("contenteditable", "false");
            return $(this).find("[lvs_elm=TaskAns]").html();
        }
    });
})(jQuery);
