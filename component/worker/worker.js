//守护者列表数据
(function (jQuery) {
    jQuery.fn.extend({
        lvs_worker_wklist: function (token, idxid, curdata) {
            var wbox = $(this);
            $(wbox).find("[lvs_elm=RegWorker]").click(function () {
                $('body').unidialog( "#WkRegForm", { token, idxid }, function( curbt, curbox ){
                    lvsdata.GetData("mayi/worker_set", $(curbt), {access_token: token, opetype: "WorkerReg", posttitle: "守护者", idxtype:"team", idxid: idxid, workername: $(curbox).getbind("wkname"), comefrom: $(curbox).getbind("comefrom")}, function( apiname, params, result ){
                        $('body').closedialog();
                        lvs.LvsRout("tabfresh", token, idxid, "[lvs_elm=TeamTab]");
                    });
                });
            });
            $(wbox).find("[lvs_elm=WorkerTips]").click(function () {
                $('body').unidialog("#WkTipsForm", { token, idxid}, function( curbt, curbox ){
                });
            });
            return this;
        }
    });
})(jQuery);
