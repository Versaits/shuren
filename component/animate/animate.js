//动画组件
(function (jQuery) {
    jQuery.fn.extend({
        lvs_animate_flying: function (token, idxid, curdata) {
            var flybox = $(this);
            $(flybox).css("width", (curdata.boxwidth == undefined ? 100 : curdata.boxwidth) * $(window).width() / 100);
            $(flybox).css("height", (curdata.boxheit == undefined ? 100 : curdata.boxwidth) * $(window).height() / 100);
            $(flybox).css("margin-left", ($(window).width() - (curdata.boxwidth == undefined ? 100 : curdata.boxwidth) * $(window).width() / 100) / 2);
            $(flybox).css("margin-top", ($(window).height() - (curdata.boxwidth == undefined ? 100 : curdata.boxwidth) * $(window).height() / 100) / 2);
        }
    });
})(jQuery);
