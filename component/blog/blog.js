//社区文章
(function (jQuery) {
    jQuery.fn.extend({
        lvs_blog_addblog: function (token, idxid, curdata) {
            var blogbox = $(this);
            $(blogbox).find("[lvs_elm=AddBlog]").click(function () {
                var DataEng = LvsData.Create();
                DataEng.GetData("statuses/blog_set", $(this), { access_token: token, commuid: curdata.id, userid: idxid, opetype: "BlogAdd", title: $(blogbox).getbind("title"), taglist: $(blogbox).getbind("taglist"), texttype: $(blogbox).getbind("texttype"), blogtext: $(blogbox).getbind("blogtext"), blogpics: $(blogbox).getbind("blogpics"), blogrichtext: $(blogbox).getbind("blogrichtext") }, function (apiname, params, result) {
                    var Lvs = LvsCore.Create();
                    Lvs.LvsRout("blog", token, idxid, result.id);
                });
            });
            return this;
        }
    });
})(jQuery);

//社区操作
(function (jQuery) {
    jQuery.fn.extend({
        lvs_community: function (token, idxid, curdata) {
            var blogbox = $(this);
            $(blogbox).find("[lvs_elm=AddCommu]").click(function () {
                $('body').unidialog( "#ApplyCommuForm", { token: token, idxid: idxid}, function( curbt, curbox ){
                    var DataEng = LvsData.Create();
                    DataEng.GetData("statuses/commu_set", $(curbt), { access_token: token, commuid: curdata.id, userid: idxid, opetype: "CommuAdd", communame: $(curbox).getbind("communame"), commudesc: $(curbox).getbind("commudesc"), commupic: $(curbox).getbind("commupic") }, function (apiname, params, result) {
                        var Lvs = LvsCore.Create();
                        $('body').closedialog();
                        Lvs.LvsRout("cmnt", token, idxid, result.id);
                    });
                });
            });
            return this;
        }
    });
})(jQuery);