(function (jQuery){
    jQuery.fn.extend({
        lvs_draw:function (token,idxid,curdata) {
            var drbox = $(this);
            curdata.width = "600px";
            curdata.height = "500px";
            curdata.imgUrl ="";
            $(window).resize(function () {
                $('#wPaint').css({
                    width: curdata.width,
                    height: curdata.height,
                })
                    .wPaint('resize');
            })
            $(window).resize();

            $('#wPaint').wPaint({
                path: '/Scripts/wPaint/',
                theme: 'standard classic', // 设置主题
                autoScaleImage: true, // 根据画布的大小自动缩放图像（fg和bg）。
                autoCenterImage: true, // 自动将图像居中（fg和bg，默认为左/顶角）。
                menuHandle: true, // 设置为false意味着菜单不能被拖动。
                menuOrientation: 'horizontal', // 菜单排列（水平、垂直）。
                menuOffsetLeft: 5, // 主菜单的左移量
                menuOffsetTop: 5, // 主菜单的顶部偏差
                bg: null, // 初始化时设置bg
                image: null, // 在启动时设置图像
                onShapeDown: null, // 绘图事件的回调。
                onShapeMove: null, // 绘图移动事件的回调。
                onShapeUp: null, // 回调绘图事件。
                mode: 'pencil', // 设置模式
                lineWidth: '3', //起始线宽
                fillStyle: '#FFFFFF', // 启动填充样式
                strokeStyle: '#000000' //起始笔画样式
            });
            //以下内容已经修改并入wPaint.menu.main.file.js
            $("#imgInput").change(function imgInput() {
                $("#wPaint").wPaint("image", URL.createObjectURL($(this)[0].files[0]));
            })
            $(this).find("#saveImg").click(function () {
                var imageData = $("#wPaint").wPaint("image");
                var url = imageData;
                var a = document.createElement('a');
                a.download = "image";
                a.href = url;
                a.click();
            })

        }
    })
})(jQuery)