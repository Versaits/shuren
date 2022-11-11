//日程表预览图
(function (jQuery) {
    jQuery.fn.extend({
        lvsprevweek: function (token, idxid, curdata) {
            var weekbox = $(this);
            $(weekbox).find("[lvs_elm=ShowDetail]").click(function () {
                var DataEng = LvsData.Create();
                DataEng.GetData("leag/pred_list", $(this), { access_token: token, restype: curdata.schedule.restype, resid: curdata.schedule.resid, daynum: 30, gettype: "Schedule" }, function (apiname, params, result) {
                    result.configevt = curdata.configevt;
                    result.predateevt = curdata.predateevt;
                    result.title = curdata.title;
                    result.schedule = curdata.schedule;
                    result.isself = curdata.schedule.isself;
                    result.uname = curdata.uname;
                    result.retprev = 1;
                    $(weekbox).hide();
                    $(weekbox).parent().loadcomponent("cn.date.monthschd", token, idxid, result, function () {
                        $(weekbox).show(600);
                    });
                });
            });
            return this;
        }
    });
})(jQuery);

//按月显示日程表
(function (jQuery) {
    jQuery.fn.extend({
        lvsmonthschd: function (token, idxid, curdata) {
            var monthbox = $(this);
            $(monthbox).find("[lvs_elm=RetPrev]").click(function () {
                $(monthbox).hide(200);
                    $(monthbox).parent().loadcomponent("cn.date.prevweek", token, idxid, curdata, function () {
                        $(monthbox).show(600);
                    });
            });
            $(monthbox).find("[lvs_elm=PredNext]").click(function(){
                var DataEng = LvsData.Create();
                DataEng.GetData("leag/pred_list", $(monthbox).html(""), { access_token: token, restype: curdata.schedule.restype, resid: curdata.schedule.resid, gettype: "Schedule", daynum: $(this).attr("daynum"), begdate: $(this).attr("idxid") }, function (apiname, params, result) {
                    result.configevt = curdata.configevt;
                    result.predateevt = curdata.predateevt;
                    result.title = curdata.title;
                    result.schedule = curdata.schedule;
                    result.isself = curdata.schedule.isself;
                    result.uname = curdata.uname;
                    result.retprev = 1;
                    $(monthbox).hide(200);
                    $(monthbox).loadcomponent("cn.date.monthschd", token, idxid, result, function(){
                        $(monthbox).show(600);
                    });
                });
            });

            return this;
        }
    });
})(jQuery);
