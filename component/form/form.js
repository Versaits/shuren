//标准对话元素处理
(function (jQuery) {
    jQuery.fn.extend({
        lvsbaseform: function (token, idxid, curdata) {
            var formbox = $(this);
            return $(this);
        }
    });
})(jQuery);

//为课程选择授课的班级或新建班级处理
(function (jQuery) {
    jQuery.fn.extend({
        lvs_form_crsclass: function (token, idxid, curdata) {
            var formbox = $(this);
            $(formbox).find("[lvs_elm=NewClass]").click(function(){
                $(formbox).find("[lvs_bind=crsclassid]").find(".Selected").removeClass("Selected");
                $(formbox).find("[lvs_elm=NewClassPanel]").css("display", "");
            });
            $(formbox).find(".FormOk").click(function(){
                var clsid = $(formbox).getbind("crsclassid");
                var DataEng = LvsData.Create();
                DataEng.GetData("leag/lesn_set", $(this), { access_token: token, opetype: "ManAdd", classid: clsid, tmplid: curdata.curdata.crstmplid, classname: $(formbox).getbind("newclsname"), lesndate: $(formbox).getbind("lesndate"), lesntime: $(formbox).getbind("lesntime"), teacherid: idxid}, function( apiname, params, result ){
                    if( curdata.lesnref == undefined )
                        location.href = "../fstem/wsbaselesn.aspx?id=" + result.lesnid + "&es=" + idxid;
                    else if( curdata.lesnref.indexOf("router") == 0 ){
                        var Lvs = LvsCore.Create();
                        Lvs.LvsRout( curdata.lesnref.split('.')[1], token, idxid, result.lesnid );
                    }
                    else
                        location.href = curdata.lesnref.replace("$PAGEID", idxid).replace("$ID", result.lesnid );
                });
            });
            return $(this);
        }
    });
})(jQuery);

//标准对话元素处理
(function (jQuery) {
    jQuery.fn.extend({
        lvs_richedit: function (token, idxid, curdata) {
            var formbox = $(this);
            var K = window.KindEditor;
            if( curdata.text != undefined && curdata.text != "" ){
                $(this).find("#RichTextInp").val( curdata.text );
            }
            window.editor = K.create( '#RichTextInp', 
                {
                    autoHeightMode : false,
                    uploadJson : '../UploadKedit.ashx',
                    //items:['html', 'forecolor', 'hilitecolor', 'bold','italic', 'underline',  'removeformat',  'undo', 'redo', '|','justifyleft', 'justifycenter', 'justifyright', 'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'formatblock', 'fontname', 'fontsize', '|',  'image', 'multiimage','emoticons', 'link'],
                    cssPath:'../kedit/user.css'
                } );
            return $(this);
        },
        getrichtext: function(){
            window.editor.sync();
            return $(this).find("#RichTextInp").val();
        }
    });
})(jQuery);
