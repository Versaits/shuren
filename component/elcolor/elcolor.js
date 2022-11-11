(function (jQuery) {
    jQuery.fn.extend({
        lvs_colordemo: function (token, idxid, curdata) {
           var colorbox = $(this);
          }
     })
})(jQuery);

(function (jQuery) {
    jQuery.fn.extend({
        lvscolorpicker: function (token, idxid, curdata) {
           var colorbox = $(this);

           //点击按钮，弹框颜色选择
           $(colorbox).find(".el_color_picker_color").click(function (event) {
                 $(colorbox).find(".el_color_picker_panel").css("display", "block");
                 //
                 $('body').bind("click", function(e){
                    if( $('.el_color_picker_panel:hover').size() == 0 && $('.el_color_picker_color:hover').size() == 0 ){
                        $(colorbox).find(".el_color_picker_panel").css("display", "none");
                        $('body').unbind("click");
                    }
                 });
           });

           //点击确定，或者点击其他位置，都需要把弹框关闭
           $(colorbox).find(".ew-color-sure").click(function (event) {
                 $(colorbox).find(".el_color_picker_panel").css("display", "none");
                 
           });

           //拖动thumb，更换background
           var isdown = 0;
           $(colorbox).find(".el_color_hue_slider_bar").mousedown(function (event){
                isdown = 1;
           })
           $('body').mouseup(function (event){
                isdown = 0;
           })

            $(colorbox).find(".el_color_hue_slider_bar").mousemove(function (event){
                if( isdown == 1 )
                    $(colorbox).find(".el_color_hue_slider_thumb").css("top",event.offsetY);
           })

           }
            })
})(jQuery);
