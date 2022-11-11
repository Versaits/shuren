//学校介绍
(function (jQuery) {
    jQuery.fn.extend({
        lvs_mayi_info: function (token, idxid, curdata) {
            var mayibox = $(this);
            $(mayibox).find(".ButtonTabItem").click(function () {
                var oldidx = $(this).closest(".ButtonTabBox").find(".active").attr("idxid");
                $(this).closest(".ButtonTabBox").find(".active").removeClass("active");
                $(this).addClass("active");
                var tabidx = $(this).attr("idxid");
                var curtab = $(this).closest(".ButtonTabBox").find("[tabcontainer=" + tabidx + "]");
                $(this).closest(".ButtonTabBox").find(".tabbox").fadeOut(500, function () {
                    if( $(this).attr("tabcontainer") == oldidx || oldidx == undefined)
                        $(curtab).fadeIn(500);
                });
            });
            return this;
        }
    });
})(jQuery);
