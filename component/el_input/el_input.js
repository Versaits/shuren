(function (jQuery) {
    jQuery.fn.extend({
        lvs_el_input: function (token, idxid, curdata) {

            var InputContext = $(this);

            $(this).find("[lvs_bind=InputText]").keyup(function (event) {
                if ($(this).val() != "") {
                    $(InputContext).find(".el_input_clear").fadeIn(200);
                }
                else {
                    $(InputContext).find(".el_input_clear").fadeOut(200);
                }
            });

            $(this).find("[lvs_bind=InputText]").blur(function (event) {

                $(InputContext).find(".el_input_clear").fadeOut(200);

            });

            $(this).find("[lvs_bind=InputText]").focus(function (event) {
                if ($(this).val() != "") {
                    $(InputContext).find(".el_input_clear").fadeIn(200);
                }
            });

            $(this).find(".el_input_clear").click(function (event) {
                $(InputContext).find("[lvs_bind=InputText]").val('');
            });


        }
    })
})(jQuery);