//处理基本页面属性显示
(function (jQuery) {
    jQuery.fn.extend({
        lvsfstemhead: function (token, idxid, curdata) {
            var headbox = $(this);
            $(headbox).find("[lvs_elm=GoLogin]").click(function () {
                var loginpage = $.cookie("loginpage");
                if (loginpage != undefined && loginpage != "")
                    location.href = loginpage;
                else
                    location.href = "../fstem/login.aspx";
            });
            $(headbox).find('[lvs_elm=GoLogout]').click(function () {
                $.cookie("lastpage", "", { expires: 1 });
                $.cookie("foken", "", { expires: 1, path: "/" });
                var loginpage = $.cookie("loginpage");
                if (loginpage != undefined && loginpage != "")
                    location.href = loginpage;
                else
                    location.href = "../fstem/login.aspx";
            });
            $(headbox).find(".TopMenuItem").click(function () {
                $(headbox).find(".TopMenuBox").find('.active').removeClass("active");
                $(this).addClass("active");
                lvs.LvsRout($(this).attr("router"), token, idxid, $(this).attr("idxid"), curdata);
            });
            if ($(headbox).find(".TopMenuBox").find(".active").size() > 0)
                $(headbox).find(".TopMenuBox").find(".active").click();
            $(headbox).find("[lvs_elm=MenuSel]").click(function () {
                var curleft = $(this).offset().left;
                if (curleft + 240 > $(window).width())
                    curleft = $(window).width() - 240;
                $('body').basepanel({ left: curleft, width: 200, top: $(this).offset().top + $(this).height() + 20, padding: 0 }, function (curbox) {
                    var menudata = { items: [] };
                    /*
                    for (var i = 0; i < curdata.users.length; i++) {
                    var userurl = (curdata.usersel == undefined) ? "../fstem/ws.htm?id=" + (curdata.users[i].stype == "导师" ? 0 - curdata.users[i].id : curdata.users[i].id) : curdata.usersel.replace("$ID", (curdata.users[i].stype == "导师" ? 0 - curdata.users[i].id : curdata.users[i].id));
                    menudata.items.push({ id: curdata.users[i].id, image: curdata.users[i].image, name: curdata.users[i].name + "(" + curdata.users[i].stype + ")", url: userurl });
                    menudata.items.push({ id: 0 });
                    */
                    if (curdata.hasOwnProperty("menu")) {
                        for (var i = 0; i < curdata.menu.list.length; i++) {
                            menudata.items.push(curdata.menu.list[i]);
                        }
                        menudata.items.push({ id: 0 });
                        menudata.container = curdata.menu.container;
                    }
                    menudata.items.push({ id: -1, name: "退出登录", url: $.cookie("loginpage") || "../fstem/login.aspx" });
                    $(curbox).loadcomponent("cn.menu.submenu", token, idxid, menudata, function () {
                        $(curbox).bind("close", function () {
                            $('body').closepanel();
                            $('body').unbind("click");
                        });
                    });
                });
                $('body').unbind("click");
                $('body').bind("click", function () {
                    if ($('.SubMenuBox:hover').size() == 0 && $('[lvs_elm=MenuSel]:hover').size() == 0) {
                        $('body').closepanel();
                        $('body').unbind("click");
                    }
                });
            });
            if (curdata.hasOwnProperty("menu") && curdata.menu.defidx != undefined) {
                for (var i = 0; i < curdata.menu.list.length; i++) {
                    if (curdata.menu.defidx == curdata.menu.list[i].id)
                        $(headbox).lvsmenuclick(token, idxid, curdata.menu.list[i], curdata.menu.container);
                }
            }
            $(headbox).find("[lvs_elm=ShowSessions]").click(function () {
                var curelm = $(this);
                var curtype = $(this).attr("curtype");
                var DataEng = LvsData.Create();
                if (curtype == "Stud") {
                    DataEng.GetData("leag/stud_list", $('#MesSessionForm').html(""), { access_token: token, gettype: "EStud.Message", studid: $(curelm).attr("curid"), desttype: $(curelm).attr("desttype"), destid: $(curelm).attr("destid") }, function (apiname, params, result) {
                        result.desttype = $(curelm).attr("desttype");
                        result.destid = $(curelm).attr("destid");
                        var Lvs = LvsCore.Create();
                        Lvs.BindTmpl('#compc.mesboxs', $('#MesSessionForm'), token, params.studid, result, function () {
                            $('body').unidialog("#MesSessionForm", { token: token, idxid: idxid, dlgwidth: 70 }, function (curbt, curbox) {
                            });
                        });
                    });
                }
                else {
                    DataEng.GetData("edu/teacher_list", $('#MesSessionForm').html(""), { access_token: token, gettype: "Teacher.Message", teacherid: $(curelm).attr("curid"), desttype: $(curelm).attr("desttype"), destid: $(curelm).attr("destid") }, function (apiname, params, result) {
                        result.desttype = $(curelm).attr("desttype");
                        result.destid = $(curelm).attr("destid");
                        var Lvs = LvsCore.Create();
                        Lvs.BindTmpl('#compc.mesboxs', $('#MesSessionForm'), token, params.studid, result, function () {
                            $('body').unidialog("#MesSessionForm", { token: token, idxid: idxid, dlgwidth: 70 }, function (curbt, curbox) {
                            });
                        });
                    });
                }
            });
            return this;
        },
        getroleid: function () {
            var role = $(this).find("[lvs_elm=UserSel]").attr("currole");
            var roleid = $(this).find("[lvs_elm=UserSel]").attr("curroleid");
            if (role == "Stud")
                return roleid;
            else if (role == "Tch")
                return 0 - parseInt(roleid);
            else
                return 0;
        }
    });
})(jQuery);
