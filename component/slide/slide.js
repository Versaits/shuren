//轮播插件
(function (jQuery) {
    jQuery.fn.extend({
        lvsslide: function () {
            var curidx = 0;
            var initstr = "";
            var slidebox = $(this);
            var maxnum = $(slidebox).find(".SlideItem").size();
            $(this).find("[lvs_ref]").lvsclick("", 0, "");
            $(this).everyTime("6s", function () {
                if ($(this).attr("slidepause") == 1)
                    $(this).attr("slidepause", 0);
                else {
                    curidx++;
                    if (curidx >= maxnum)
                        curidx = 0;
                    $(this).find(".SlideDot" + curidx).click();
                }
            });
            $(this).lvsswipe(function () {
                curidx++;
                if (curidx >= maxnum)
                    curidx = 0;
                $(slidebox).attr("slidepause", "1").find(".SlideDot" + curidx).click();
            }, function () {
                curidx--;
                if (curidx < 0)
                    curidx = maxnum - 1;
                $(slidebox).attr("slidepause", "1").find(".SlideDot" + curidx).click();
            }, undefined, undefined);
            $(this).find(".SlideDot").click(function () {
                var lastdot = $(slidebox).find(".SlideAct").attr("idxid");
                curidx = parseInt($(this).attr("idxid"));
                var isleft = true;
                if ((curidx == 0 && lastdot == maxnum - 1) || lastdot < curidx)
                    isleft = false;
                if (lastdot == curidx)
                    return;
                $(slidebox).find(".SlideAct").removeClass("SlideAct");
                $(this).addClass("SlideAct");
                var marginleft = parseInt($(slidebox).width());
                if (isleft == false)
                    marginleft = 0 - marginleft;
                if (lastdot != curidx - 1)
                    $(slidebox).find(".SlideBack").css("background-image", "url('" + $(slidebox).find("[slideidx=" + curidx + "]").find("img").attr("src") + "')");
                $(slidebox).find(".SlideItemAct").animate({ marginLeft: marginleft }, 800, "", function () {
                    $(this).removeClass("SlideItemAct").css("display", "none").css("margin-left", 0);
                    $(slidebox).find("[slideidx=" + curidx + "]").addClass("SlideItemAct").css("display", "");
                    var nextimg = curidx + 1;
                    if (nextimg >= maxnum)
                        nextimg = 0;
                    $(slidebox).find(".SlideBack").css("background-image", "url('" + $(slidebox).find("[slideidx=" + nextimg + "]").find("img").attr("src") + "')");
                });
            });
            return this;
        }
    });
})(jQuery);
