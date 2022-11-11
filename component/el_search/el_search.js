(function (jQuery) {
    jQuery.fn.extend({
        lvs_el_search: function (token, idxid, curdata) {

            // var TestData = ["合肥实验学校滨湖校区", "合肥市第五十五中学新校", "合肥市中国科学技术大学附属中学", "合肥市第七中学", "合肥市第四中学", "合肥市第四十五中学橡树湾校区", "肥东县第六中学", "合肥市第十中学", "合肥市第三十八中学", "合肥市第八中学", "合肥八中教育集团蜀山分校", "合肥市包河区合创邦创客发展中心", "合肥北城中学", "合肥市第四十五中学", "合肥一中北城中学东校区"];
            var TestData = ["合肥七中", "合肥五中", "合肥三中", "合肥一中", "合肥二中", "合肥八中", "合肥十一中", "合肥十五中", "合肥十三中", "合肥六中"];
            var a = new Array();
            var SearchBox = $(this);

            $(this).find("[lvs_bind=SearchData]").keyup(function (event) {
                if ($(this).val() != "") {
                    $(SearchBox).find(".el_input_clear").fadeIn(200);

                    var searchData = $(this).val();
                    if (TestData.length != 0 && searchData) {
                        a = [];
                        for (var i = 0; i < TestData.length; i++) {
                            if (TestData[i].indexOf(searchData) != -1) {
                                a.push(TestData[i])
                                console.log(TestData[i]);

                            }
                        }
                        //生成新的数组构建html输出  列显示
                        //var ListStr = "<ul class=\"el_scrollbar_view el_cascader_menu_list\">";
                        // for (var i = 0; i < a.length; i++) {
                        //     ListStr += "<li class=\"el_cascader_node\" labelname=" + a[i] + " arrayindex=" + i + "\">";

                        //     ListStr += "<span class=\"el_cascader_node_label\">" + a[i] + "</span>";
                        //      ListStr += "</li>";
                        //  }
                        // ListStr += "</ul>";

                        //生成新的数据构建html输出 行显示
                        if (a.length != 0){
                            var ListStr = "<div class=\"el_search_line\">";
                            for (var i = 0; i < a.length; i++) {
                                ListStr += "<a class=\"el_search_item\" labelname=" + a[i] + " arrayindex=" + i + " title=" + a[i] + "\">";
                                ListStr += a[i];
                                ListStr += "</a>"

                            }
                            ListStr += "</div>";

                        }
                       
                        $(SearchBox).find(".el_search_panel").html(ListStr);
                        $(SearchBox).find(".el_search_panel").css("display", "block");
                    }
                }
                else {
                    console.log("clear");
                    $(SearchBox).find(".el_input_clear").fadeOut(200);
                    $(SearchBox).find(".el_search_panel").html("");
                    $(SearchBox).find(".el_search_panel").css("display", "none");
                }

            });

            $(this).find("[lvs_bind=SearchData]").blur(function (event) {

                $(SearchBox).find(".el_input_clear").fadeOut(200);

            });

            $(this).find("[lvs_bind=SearchData]").focus(function (event) {
                if ($(this).val() != "") {
                    $(SearchBox).find(".el_input_clear").fadeIn(200);
                }
            });

            $(this).find(".el_input_clear").click(function (event) {
                console.log("clickclear");
                $(SearchBox).find("[lvs_bind=SearchData]").val('');
                $(SearchBox).find(".el_search_panel").html("");
                $(SearchBox).find(".el_search_panel").css("display", "none");
            });



        }

    });
})(jQuery);