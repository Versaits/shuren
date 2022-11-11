//标准登录组建处理
(function (jQuery) {
    jQuery.fn.extend({
        lvs_fstem_login: function (token, idxid, curdata) {
            var formbox = $(this);
            $(formbox).find('input').focus(function () {
                $(this).closest(".InputBox").css("border", "#E96777 1px solid");
            });
            $(formbox).find('input').blur(function () {
                $(this).closest(".InputBox").css("border", "#C5CDD4 1px solid");
            });
            $(formbox).find('[lvs_bind=LoginUser]').keydown(function (e) {
                if (e.keyCode == 13)
                    $(formbox).find('[lvs_bind=LoginPass]').select();
            });
            $(formbox).find('[lvs_bind=LoginPass]').keydown(function (e) {
                if (e.keyCode == 13)
                    $(formbox).find('[lvs_elm=LoginOk]').click();
            });
            $(formbox).find("[lvs_elm=UserPass]").click(function () {
                $('#ListContainer').lvstoggle(function () {
                });
            });
            $(formbox).find("[lvs_elm=GetErcode]").click(function () {
                var curchkcode = parseInt($(this).attr("chkcode")) + 3;
                $(this).attr("chkcode", curchkcode);
                $('#GetErcodeContainer').lvstoggle(function () {
                    var DataEng = LvsData.Create();
                    DataEng.StoleData("customer/login", { access_token: "", apptype: curdata.apptype, projid: idxid, checkcode: curchkcode, logintype: "ercode" }, function (apiname, params, result) {
                        $(formbox).find('[lvs_bind=ErCode]').attr("src", result.ercode);
                        $(formbox).find('[lvs_bind=TimesShow]').text("").stopTime();
                        $(formbox).find('[lvs_bind=TimesShow]').everyTime("1s", function () {
                            var cursec = 180;
                            if ($(formbox).find('[lvs_bind=TimesShow]').text() != "")
                                cursec = parseInt($(formbox).find('[lvs_bind=TimesShow]').text());
                            cursec--;
                            if (cursec <= 0) {
                                $(formbox).find('[lvs_bind=TimesShow]').addClass("txt-grey").text("超时").stopTime();
                            }
                            else
                                $(formbox).find('[lvs_bind=TimesShow]').text(cursec);
                            if ((cursec % 5) == 0) {
                                DataEng.StoleData("customer/login", { checkcode: curchkcode, logintype: "authcode" }, function (apiname, params, result) {
                                    if (result.hasOwnProperty("reason") && result.reason != "")
                                        return;
                                    $.cookie(curdata.tokenname || (curdata.apptype == "Stem" ? "foken" : curdata.apptype + "_ken"), result.token, { expires: 1, path: "/" });
                                    if (result.hasOwnProperty("users") && result.users.length > 1) {
                                        $('#UserSelTmpl').tmpl(result).appendTo($('#UserSelForm').html(""));
                                        $('body').showdialog("#UserSelForm", function (curbt, curbox) {
                                        }, { token: result.token, idxid: 0, dlgwidth: 40 });
                                        return;
                                    }
                                    if (curdata.hasOwnProperty("okref"))
                                        location.href = curdata.okref;
                                    $(formbox).trigger("loginok", [result.role, result.defid]);
                                });
                            }
                        });
                    });
                });
            });

            $(formbox).find("[lvs_elm=LoginOk]").click(function () {
                var DataEng = LvsData.Create();
                DataEng.GetData("customer/login", undefined, { logintype: "userpass", apptype: curdata.apptype, loginname: $(formbox).find('[lvs_bind=LoginUser]').val(), loginpass: $(formbox).find('[lvs_bind=LoginPass]').val() }, function (apiname, params, result) {
                    if (result.hasOwnProperty("reason") && result.reason != "" || result.hasOwnProperty("token") == false) {
                        $(formbox).find('[lvs_bind=ErrorInfo]').html(result.reason);
                        return;
                    }
                    $.cookie(curdata.tokenname || (curdata.apptype == "Stem" ? "foken" : curdata.apptype + "_ken"), result.token, { expires: 1, path: "/" });
                    $.cookie("oldlogin", params.loginname, { expires: 7, path: "/" });
                    $.cookie("oldpass", params.loginpass, { expires: 7, path: "/" });
                    if (result.hasOwnProperty("users") && result.users.length > 1) {
                        $('#UserSelTmpl').tmpl(result).appendTo($('#UserSelForm').html(""));
                        $('body').showdialog("#UserSelForm", function (curbt, curbox) {
                        }, { token: result.token, idxid: 0, dlgwidth: 40 });
                        return;
                    }
                    if (curdata.hasOwnProperty("okref"))
                        location.href = curdata.okref;
                    $(formbox).trigger("loginok", [result.role, result.defid]);
                });
            });
            $(formbox).find("[lvs_elm=GetPassword]").click(function () {
                $(formbox).find("#GetPassContainer").lvstoggle(function () {
                });
            });
            $(formbox).find("[lvs_elm=GetCheckCode]").click(function () {
                var elm = $(this);
                if ($(elm).attr("sec") != undefined && $(elm).attr("sec") > 0)
                    return;
                if ($(formbox).find('[lvs_bind=GetMail]').lvsvalidate("email") != "") {
                    $(formbox).find('[lvs_bind=CheckError]').html("请输入正确的邮件地址");
                    return;
                }
                var DataEng = LvsData.Create();
                DataEng.GetData("leag/stud_set", undefined, { access_token: token, opetype: "SendCheck", mailaddr: $(formbox).find('[lvs_bind=GetMail]').val() }, function (apiname, params, result) {
                    if (result.uid == 0) {
                        $(formbox).find('[lvs_bind=CheckError]').html(result.info);
                        return;
                    }
                    $(formbox).find('[lvs_bind=CheckError]').html("");
                    $(formbox).find('[lvs_bind=GetCheck]').attr("chkcode", result.checkcode);
                    $(elm).attr("sec", 60).css("color", "Grey").everyTime("1s", function () {
                        var cursec = parseInt($(this).attr("sec")) - 1;
                        $(this).attr("sec", cursec);
                        if (cursec <= 0) {
                            $(elm).css("color", "").text("发送验证码");
                            $(this).stopTime();
                        }
                        else
                            $(elm).text(cursec + "秒");
                    });
                    $(formbox).find('[lvs_bind=GetCheck]').keyup(function () {
                        if ($(this).val().length == $(this).attr("chkcode").length && $(this).val() != $(this).attr("chkcode")) {
                            $(formbox).find('[lvs_bind=CheckError]').html("请输入正确的验证码");
                        }
                        else if ($(this).val() != $(this).attr("chkcode")) {
                        }
                        else {
                            $(formbox).find('[lvs_elm=GetNextStep]').removeClass("GreyButton").addClass("InputButton").click(function () {
                                if ($(formbox).find('[lvs_bind=GetCheck]').val() != $(formbox).find('[lvs_bind=GetCheck]').attr("chkcode")) {
                                    $(formbox).find('[lvs_bind=CheckError]').html("请输入正确的验证码");
                                    return;
                                }
                                if ($(formbox).find('#SetPassContainer').size() > 0) {
                                    $(formbox).find('#SetPassContainer').find("[lvs_elm=SetPassOk]").attr("idxid", result.uid);
                                    $(formbox).find('#SetPassContainer').lvstoggle(function () {
                                    });
                                }
                                else {

                                }
                            });
                        }
                    });
                    $(formbox).find("[lvs_bind=SetPass2]").keyup(function () {
                        if ($(this).val() == $(formbox).find("[lvs_bind=SetPass]").val() && $(this).val() != "") {
                            $(formbox).find("[lvs_elm=SetPassOk]").removeClass("GreyButton").addClass("InputButton");
                        }
                    });
                });
            });
            $(formbox).find("[lvs_elm=SetPassOk]").click(function () {
                if ($(this).hasClass("GreyButton"))
                    return;
                if ($('[lvs_bind=SetPass]').val() != $('[lvs_bind=SetPass2]').val()) {
                    return;
                }
                var DataEng = LvsData.Create();
                DataEng.GetData("customer/cust_set", undefined, { access_token: token, opetype: "Com.SetUserPass", uid: $(this).attr("idxid"), oldpass: $('[lvs_bind=CurPass]').val(), loginpass: $('[lvs_bind=SetPass]').val() }, function (apiname, params, result) {
                    var tips = ErrorTip.Create();
                    tips.Show("密码修改成功，请开始登录", function () {
                        $(formbox).find("#ListContainer").lvstoggle();
                    });
                });
            });
            return $(this);
        }
    });
})(jQuery);