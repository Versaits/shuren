/*
* zxxFile.js 基于HTML5 文件上传的核心脚本 http://www.zhangxinxu.com/wordpress/?p=1923
* by zhangxinxu 2011-09-12
*/

var HTML5UPLOADFILE = {
    fileInput: null, 			//html file控件
    dragDrop: null, 				//拖拽敏感区域
    upButton: null, 				//提交按钮
    url: "", 					//ajax地址
    fileFilter: [], 				//过滤后的文件数组
    filter: function (files) {		//选择文件组的过滤方法
        return files;
    },
    onSelect: function () { }, 	//文件选择后
    onDelete: function () { }, 	//文件删除后
    onDragOver: function () { }, 	//文件拖拽到敏感区域时
    onDragLeave: function () { }, //文件离开到敏感区域时
    onProgress: function () { }, 	//文件上传进度
    onSuccess: function () { }, 	//文件上传成功时
    onFailure: function () { }, 	//文件上传失败时,
    onComplete: function () { }, 	//文件全部上传完毕时
    onsubmitForm: function () { }, //表单提交

    /* 开发参数和内置方法分界线 */

    //文件拖放
    funDragHover: function (e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        if (e.preventDefault) {
            e.preventDefault();
        }
        this[e.type === "dragover" ? "onDragOver" : "onDragLeave"].call(e.target);
        return this;
    },
    //获取选择文件，file控件或拖放
    funGetFiles: function (e) {
        // 取消鼠标经过样式
        this.funDragHover(e);

        // 获取文件列表对象
        var files = e.target.files || e.dataTransfer.files;

        //继续添加文件
        this.fileFilter = this.fileFilter.concat(this.filter(files));
        this.funDealFiles();
        return this;
    },

    //兼容低版本文件上传
    funGetFile: function (e) {
        var targetObj = e.srcElement || e.target;
        this.onSelectLowVersion(targetObj);
    },

    //选中文件的处理与回调
    funDealFiles: function () {
        for (var i = 0, file; file = this.fileFilter[i]; i++) {
            //增加唯一索引值
            file.index = i;
        }
        //执行选择回调
        this.onSelect(this.fileFilter, $(this));
        return this;
    },

    //删除对应的文件
    funDeleteFile: function (fileDelete) {
        var arrFile = [];
        for (var i = 0, file; file = this.fileFilter[i]; i++) {
            if (file != fileDelete) {
                arrFile.push(file);
            } else {
                this.onDelete(fileDelete);
            }
        }
        this.fileFilter = arrFile;
        return this;
    },

    xhrFormDataUpload: function (fd, url, file) {
        var self = this;
        var xhr = new XMLHttpRequest();
        var iswx = false;
        if (window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger')
            iswx = true;
        if (window.attachEvent && iswx == false) {
            this.dragDrop.attachEvent("onprogress", function (e) {
                self.onProgress(file, e.loaded, e.total);
            });
        }
        else {
            // 上传中
            xhr.upload.addEventListener("progress", function (e) {
                self.onProgress(file, e.loaded, e.total);
            }, false);
        }

        xhr.open("POST", url, true);
        xhr.onreadystatechange = function (e) {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    self.onSuccess(file, xhr.responseText);
                    self.funDeleteFile(file);
                    if (!self.fileFilter.length) {
                        //全部完毕
                        self.onComplete();
                    }
                    else {
                        self.funUploadFile();
                        //self.onFailure(file, xhr.responseText);		
                    }
                }

            }

        };

        xhr.send(fd);
    },

    //文件上传
    funUploadFile: function () {
        var self = this;
        if (location.host.indexOf("sitepointstatic") >= 0) {
            //非站点服务器上运行
            return;
        }
        if (window.FormData) {
            var file = this.fileFilter[0];
            var fd = new FormData();
            fd.append("file", file);
            self.xhrFormDataUpload(fd, self.url, file);

            //for (var i = 0, file; file = this.fileFilter[i]; i++) {			   
            //	(function(file) {
            //		var fd = new FormData();
            //		fd.append("file", file);	
            //		self.xhrFormDataUpload(fd, self.url, file);				
            /*
            if (xhr.upload) {
            if(window.attachEvent)
            {
            this.dragDrop.attachEvent("onprogress", function(e) {
            self.onProgress(file, e.loaded, e.total);});
            }
            else
            {
            // 上传中
            xhr.upload.addEventListener("progress", function(e) {
            self.onProgress(file, e.loaded, e.total);
            }, false);
            }
			
            // 文件上传成功或是失败
            xhr.onreadystatechange = function(e) {
            if (xhr.readyState == 4) {
            if (xhr.status == 200) {
            self.onSuccess(file, xhr.responseText);
            self.funDeleteFile(file);
            if (!self.fileFilter.length) {
            //全部完毕
            self.onComplete();	
            }
            } else {
            self.onFailure(file, xhr.responseText);		
            }
            }
            };
			
            // 开始上传
            xhr.open("POST", self.url, true);
            xhr.setRequestHeader("X_FILENAME", file.name);
            xhr.send(file);
            }	
            */
            //	})(file);	
            //	}
        }
        else {
            self.onsubmitForm();
        }
    },

    init: function () {
        var self = this;
        var iswx = false;
        if (window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger')
            iswx = true;
        if (this.dragDrop) {
            if (window.attachEvent && iswx == false) {
                this.dragDrop.attachEvent("onDragOver", function (e) { self.funDragHover(e); });
                this.dragDrop.attachEvent("onDragLeave", function (e) { self.funDragHover(e); });
            }
            else {
                this.dragDrop.addEventListener("dragover", function (e) { self.funDragHover(e); }, false);
                this.dragDrop.addEventListener("dragleave", function (e) { self.funDragHover(e); }, false);
                this.dragDrop.addEventListener("drop", function (e) { self.funGetFiles(e); }, false);
            }
        }

        //文件选择控件选择
        if (this.fileInput) {
            if (window.attachEvent && iswx == false) {
                this.fileInput.attachEvent("onchange", function (e) { self.funGetFile(e); });
            }
            else {
                this.fileInput.addEventListener("change", function (e) { self.funGetFiles(e); }, false);
            }
        }

        //上传按钮提交
        if (this.upButton) {
            if (window.attachEvent && iswx == false) {
                this.upButton.attachEvent("onclick", function (e) { self.funUploadFile(e); });
            }
            else {
                this.upButton.addEventListener("click", function (e) { self.funUploadFile(e); }, false);
            }
        }
    }
};
function getSignature1() {
    var DataEng = LvsData.Create();
    DataEng.StoleData( "customer/login", {access_token: "", logintype: "vodsig" }, function( apiname, params, result ){
        return result.signature;
    });
}
function getSignature() {
    return axios.post("../vodsigashx.ashx").then(function (response) {
        return response.data.signature;
    })
}
function validateUpload( objId ){
    return true;
}
function GetVodUpload(elm, retfunc) {
    $(elm).html("<input id=\"fileVod\" type=\"file\" style=\"width:99%\" name=\"fileselect[]\" multiple/><span id=\"fileDragArea\" class=\"upload_drag_area\"></span><div id=\"preview\" class=\"upload_preview flexbox\"><div style=\"width:0%;\" class=\"VodProgress\" id=\"previewperc\"></div><div class=\"flex1\" class=\"VodProgText\" id=\"previewtext\"></div></div><button type=\"button\" id=\"fileSubmit\" class=\"upload_submit_btn\" style=\"display:none\">确认上传图片</button>");
    var tcVod = new TcVod.default({
        getSignature: getSignature
    });
    $(elm).find("#fileVod").bind("change", function () {
        var mediaFile = $("#fileVod")[0].files[0];
        if (!validateUpload("videoFile")) {
            return;
        }
        $(elm).find('.upload_preview').find("#previewtext").html( "准备上传中..." );
        var uploader = tcVod.upload({mediaFile: mediaFile});
        $('#uploadCancel').bind("click", function(){
            if (typeof(uploader) != "undefined") {
                uploader.cancel();
            }
        });
        uploader.on( "media_progress", function( info ){
            if( info.percent == 0){
                $(elm).find('.upload_preview').find("#previewtext").html( "开始" );
            }
            else if( info.percent < 1 ){
                $(elm).find('.upload_preview').find("#previewtext").html( info.percent * 100 + "%" );
                $(elm).find('.upload_preview').find("#previewperc").css("width", info.percent * 80 + "%" );
            }
            else{
                $(elm).find('.upload_preview').find("#previewperc").css("width", "80%" );
            }
        });
        uploader.done().then( function(doneRes){
            $(elm).find('.upload_preview').find("#previewtext").html( "完成" );
            if( retfunc != undefined )
                retfunc( doneRes.video.url );
        });
    });
}
function GetCosUpload(elm, costype, retfunc) {
    $(elm).html("<input id=\"fileCos\" type=\"file\" style=\"width:99%\" name=\"fileselect[]\" multiple/><span id=\"fileDragArea\" class=\"upload_drag_area\"></span><div id=\"preview\" class=\"upload_preview flexbox\"><div style=\"width:0%;\" class=\"VodProgress\" id=\"previewperc\"></div><div class=\"flex1\" class=\"VodProgText\" id=\"previewtext\"></div></div><button type=\"button\" id=\"fileSubmit\" class=\"upload_submit_btn\" style=\"display:none\">确认上传图片</button>");
    
    $(elm).find("#fileVod").bind("change", function () {
        var mediaFile = $("#fileVod")[0].files[0];
        $(elm).find('.upload_preview').find("#previewtext").html( "准备上传中..." );
        cos.putObject({
            Bucket: "cos_" + costype,
            Region: "COS_REGION",
            Key: filename,
            StorageClass: "STANDART",
            Body: mediaFile,
            OnProgess:function( progressData ){
                console.log( "progress", progressdata );
                if( info.percent == 0){
                    $(elm).find('.upload_preview').find("#previewtext").html( "开始" );
                }
                else if( info.percent < 1 ){
                    $(elm).find('.upload_preview').find("#previewtext").html( info.percent * 100 + "%" );
                    $(elm).find('.upload_preview').find("#previewperc").css("width", info.percent * 80 + "%" );
                }
                else{
                    setTimeout(function(){
                        $(elm).find('.upload_preview').find("#previewtext").html( "完成" );
                        $(elm).find('.upload_preview').find("#previewperc").css("width", "80%" );
                    },500);
                }
                }
            }, function( err, data ){
                console.log( "cosfail", err, data );
            }
        );
        uploader.done().then( function(doneRes){
            if( retfunc != undefined )
                retfunc( doneRes.video.url );
        });
    });
}

function GetImageUpload(elm, idname, retfunc) {
    var fileacce = "";
    if (idname == "video")
        fileacce = "";
    if( idname == "noprev" )
        $(elm).html("<input id=\"fileImage\" type=\"file\" style=\"width:0.5px\" size=\"20\" name=\"fileselect[]\" multiple/><span id=\"fileDragArea\" class=\"upload_drag_area\" style=\"width:0.5px;height:0.5px;overflow:hidden\"></span><div id=\"preview\" class=\"upload_preview\"></div><button type=\"button\" id=\"fileSubmit\" class=\"upload_submit_btn\" style=\"display:none\">确认上传图片</button>");
    else
        $(elm).html("<input id=\"fileImage\" type=\"file\" style=\"width:99%\" size=\"20\" " + fileacce + " name=\"fileselect[]\" multiple/><span id=\"fileDragArea\" class=\"upload_drag_area\"></span><div id=\"preview\" class=\"upload_preview\"></div><button type=\"button\" id=\"fileSubmit\" class=\"upload_submit_btn\" style=\"display:none\">确认上传图片</button>");
    var uploadurl = "Upload.ashx";
    if (idname == "../" || idname == "video")
        uploadurl = "../Upload.ashx";
    else if (idname == "attach")
        uploadurl = "../UploadAttach.ashx";
    var params = {
        fileInput: $(elm).find("#fileImage").get(0),
        dragDrop: $(elm).find("#fileDragArea").get(0),
        upButton: $(elm).find("#fileSubmit").get(0),
        url: uploadurl,
        filter: function (files) {
            var arrFiles = [];
            for (var i = 0, file; file = files[i]; i++) {
                if (file.type.indexOf("image") == 0 || file.type.indexOf("video") == 0) {
                    if (file.size >= 50072000) {
                        alert('图片或视频:' + file.name + '大小过大,应小于50MB');
                    } else {
                        arrFiles.push(file);
                    }
                }
                else {
                    if (file.size >= 20288000) {
                        alert('文件:' + file.name + '过大,应小于20MB');
                    } else {
                        arrFiles.push(file);
                    }
                }
            }
            return arrFiles;
        },
        onSelect: function (files) {
            console.log( "select:", files.length );
            $(elm).attr("filenum", files.length );
            var html = '', i = 0, n = $(elm).find('.upload_preview').find(".upload_append_list").size();
            if (n == 0)
                $(elm).find(".upload_preview").html('<div begin-n="0" class="upload_loading"></div>');
            else
                $(elm).find('.upload_preview').find(".upload_loading").attr("begin-n", n);
            var funAppendImage = function () {
                file = files[i];
                if (file) {
                    var reader = new FileReader()
                    reader.onload = function (e) {
                        var filetype = "图片";
                        var filesrc = e.target.result;
                        console.log( "选中文件：", file.type, e.target.result );
                        if (file.type.indexOf("video") == 0) {
                            filetype = "视频";
                            $(elm).attr("filetype", "video");
                            filesrc = "http://tuanju.js.cn/Image/videoback.png";
                        }
                        else if (file.type.indexOf("image") != 0) {
                            filetype = "附件";
                            $(elm).attr("filetype", "attach");
                            filesrc = "http://tuanju.js.cn/Image/albumback.png";
                        }
                        html = html + '<div id="uploadList_' + (n + i) + '" class="upload_append_list"><p><strong>' + filetype + (n + i + 1) + '</strong>' +
						'<img id="uploadImage_' + (n + i) + '" src="' + filesrc + '" style=\"height:40px\" picid=\"0\" class="upload_image" />' +
						'<div class="small" id="uploadTips_' + (n + i) + '">高清上传中...<span id="uploadProgress_' + (n + i) + '" class="upload_progress"></span></div>' +
					'</div>';

                        i++;
                        funAppendImage();
                    }
                    reader.readAsDataURL(file);
                } else {
                    $(elm).find(".upload_preview").html($(elm).find('.upload_preview').html() + html);
                    if (html) {
                        //删除方法
                        $(elm).find(".upload_delete").click(function () {
                            HTML5UPLOADFILE.funDeleteFile(files[parseInt($(this).attr("data-index"))]);
                            return false;
                        });
                        //提交按钮显示
                        //$("#fileSubmit").show();
                    } else {
                        //提交按钮隐藏
                        $(elm).find("#fileSubmit").hide();
                    }
                }
            };
            funAppendImage();
            $(elm).find('#fileSubmit').click();
        },
        onSelectLowVersion: function (files) {
            var html = '';
            $(elm).find(".upload_preview").html('<div class="upload_loading"></div>');

            html = '<div id="upload" class="upload_append_list"><p><strong>picture' + '</strong>' +
						'<a href="javascript:" class="upload_delete" title="删除">删除</a><br />' +
						'<img id="uploadImage" picid=\"0\" src="' + files.value + '" class="upload_image" style=\"heigth:60px\" /></p>' +
						'高清上传中...<span id="uploadProgress" class="upload_progress"></span>' +
					'</div>';
            $(elm).find(".upload_preview").html(html);

            //删除方法
            $(elm).find(".upload_delete").click(function () {
                $(elm).find("#upload").fadeOut();
                document.getElementById("fileImage").value = "";
                //提交按钮隐藏
                //$("#fileSubmit").hide();
                return false;
            });
            //提交按钮显示
            $(elm).find("#fileSubmit").click();
        },
        onDelete: function (file) {
            //$("#uploadList_" + file.index).fadeOut();
        },
        onDragOver: function () {
            $(this).addClass("upload_drag_hover");
        },
        onDragLeave: function () {
            $(this).removeClass("upload_drag_hover");
        },
        onProgress: function (file, loaded, total) {
            var eleProgress = $(elm).find("#uploadProgress_" + (file.index + parseInt($(elm).find('.upload_loading').attr("begin-n")))), percent = (loaded / total * 100).toFixed(2) + '%';
            if (loaded / total * 100 > 99)
                percent = "99.00%";
            eleProgress.show().html(percent);
        },
        onSuccess: function (file, response) {
            var params = response.split('|');
            if (params.length > 2 && params[0] > 0) {
                var src = params[1];
                if (idname == "../")
                    src = "../" + src;
                else if( idname == "attach")
                    src = "../Image/list.png";
                $(elm).find('#uploadImage_' + (file.index + parseInt($(elm).find('.upload_loading').attr("begin-n")))).attr("src", src).attr("picid", params[2]).attr("fileurl", params[1]).attr("filename", file.name ).addClass("upload_success");
                $(elm).find('#uploadTips_' + (file.index + parseInt($(elm).find('.upload_loading').attr("begin-n")))).html("<span style=\"color:darkgreen\">文件上传完毕！</span>");
            }
            else
                $(elm).find('#uploadProgress_' + (file.index + parseInt($(elm).find('.upload_loading').attr("begin-n")))).html("失败：" + params[1]);
        },
        onFailure: function (file) {
            $(elm).find("#uploadInf").append("<p>图片" + file.name + "上传失败!</p>");
            $(elm).find("#uploadImage_" + (file.index + parseInt($(elm).find('.upload_loading').attr("begin-n")))).css("opacity", 0.2);
        },
        onComplete: function () {
            //提交按钮隐藏
            $(elm).find("#fileSubmit").hide();
            //file控件value置空
            $(elm).find("#fileImage").val("");
            $(elm).find("#uploadInf").append("<p>当前文件全部上传完毕,可继续添加</p>");
            if ($(elm).parent().find('.UploadResImg').size() > 0) {
                var src = "";
                var curpicid = 0;
                $(elm).find(".upload_success").each(function () {
                    if (src == "") {
                        src = $(this).attr("src");
                        if (src.indexOf("..") != 0)
                            src = "..\\" + src;
                        if( idname == "attach" )
                            src = $(this).attr("fileurl");
                        curpicid = $(this).attr("picid");
                    }
                });
                $(elm).parent().find('.UploadResImg').attr("src", src).attr("picid", curpicid);
                $(elm).parent().lvsfile(retfunc);
            }
            else if( $(elm).closest(".AddPics").size() > 0 ){
                $(elm).find(".upload_success").each(function(){
                    var src = $(this).attr("src");
                    if( src.indexOf("..") != 0 )
                        src = "..\\" + src;
                    $(elm).closest(".AddPics").prepend("<img width=\"19%\" style=\"margin-left:3px\" src=\"" + src + "\" class=\"PreviewImg\" picid=\"" + $(this).attr("picid") + "\"/>");
                });
                $(elm).closest(".AddPics").lvsfile(retfunc);
            }
            if (retfunc != undefined) {
                var src = "";
                var curpicid = 0;
                var cururl = "";
                var names = "";
                $(elm).find(".upload_success").each(function () {
                    if (src == "") {
                        src = $(this).attr("src");
                        if (src.indexOf("..") != 0)
                            src = "..\\" + src;
                        if( idname == "attach" )
                            src = $(this).attr("fileurl" );
                        curpicid = $(this).attr("picid");
                        cururl = $(this).attr("fileurl");
                        names = $(this).attr("filename");
                    }
                    else{
                        let cursrc = $(this).attr("src");
                        if( cursrc.indexOf("..") != 0 )
                            cursrc = "..\\" + cursrc;
                        if( idname == "attach" )
                            cursrc = $(this).attr("fileurl");
                        src = src + "," + cursrc;
                        curpicid = curpicid + "," + $(this).attr("picid");
                        names = names + "," + $(this).attr("filename");
                    }
                });
                retfunc(elm, src, curpicid, names);
            }
        }
    };
    HTML5UPLOADFILE = $.extend(HTML5UPLOADFILE, params);
    HTML5UPLOADFILE.init();
}
//操作控件
(function (jQuery) {
    jQuery.fn.extend({
        lvsfile: function (retfunc) {
            var curelm = $(this);
            var showtext = $(this).text();
            var filetype = $(curelm).attr("filetype");
            if( showtext == "" && filetype != "video" )
                showtext = "点击上传图片";
            else if( showtext == "")
                showtext = "点击上传视频";
            if( $(this).hasClass("BaseUploadImg")){
                $(curelm).html( "<div class=\"clickfileupload\">" + $(curelm).html() + "</div>" );
            }
            else if( $(this).hasClass("AddPics")){
                $(this).find(".clickfileupload").remove();
                $(curelm).html( $(this).html() + "<div class=\"clickfileupload\"><a><img width=\"24px\" height=\"24px\" src=\"../Image/add.png\" style=\"vertical-align:middle\"/><span class=\"small\">上传图片</span></a></div>" );
                filetype = "../";
            }
            else if( $(this).find("img").size() > 0 )
            {
                $(this).find(".clickfileupload").remove();
                $(curelm).html( $(this).html() + "<div class=\"clickfileupload\"><a>更换图片</a></div>" );
                $(curelm).find("img").addClass("UploadResImg" );
                filetype = "../";
            }
            else if( filetype != "video" ){
                filetype = "../";
                $(curelm).html( "<div class=\"clickfileupload\"><a><img src=\"../Image/addphoto.jpg\"/><br/><span class=\"small\">" + showtext + "</span></a></div>" );
            }
            else{
                $(curelm).html( "<div class=\"clickfileupload\"><a><img src=\"../Image/addvideo.jpg\"/><br/><span class=\"small\">" + showtext + "</span></a></div>" );
            }
            $(curelm).find( ".clickfileupload" ).one("click", function(){
                var clkelm = $(this);
                if( $(clkelm).find( '.upload_preview').size() > 0 ){
                    var picstr = $(this).find( '.upload_preview').html();
                    $(this).find( '.upload_preview').html( "<div class=\"clickpicview\">" + picstr + "</div>" );
                }
                else if( $('.UploadResImg').size() == 0 )
                {
                    if( filetype == "video" )
                        $(clkelm).html("<a><img src=\"../Image/addvideo.jpg\"></a>");
                    else
                        $(clkelm).html("<a class=\"button bg-lightgrey\">➕image</a>");
                }
                GetImageUpload( $(clkelm), filetype, retfunc );
                $(curelm).find( "input" ).click();
            });
            $(curelm).find(".UploadResImg").one("click", function(){
                $(curelm).find(".clickfileupload").click();
            });
            return curelm;
        },
        lvspic: function( retfunc ){
            var clkelm = $(this);
            var filetype = "../";
            if( $(clkelm).find( '.upload_preview').size() > 0 ){
                var picstr = $(this).find( '.upload_preview').html();
                $(this).find( '.upload_preview').html( "<div class=\"clickpicview\">" + picstr + "</div>" );
            }
            else{
                
            }
            GetImageUpload( $(clkelm), filetype, retfunc );
            $(clkelm).find( "input" ).click();
        },
        lvspanelpic: function( retfunc ){
            $('body').basepanel( { left: $(this).offset().left, top: $(this).offset().top + 30, width: $(window).width() * 20 /100}, function( curbox ){
                GetImageUpload( curbox, "../", retfunc );
                $(curbox).attr("filenum", 0);
                $(curbox).find( "input" ).click();
                $(window).one("focus", function(){
                    setTimeout( function(){
                        if( $(curbox).attr("filenum") <= 0 )
                            $('body').closepanel();
                    }, 500 );
                });
            });
        },
        lvspanelattach: function( retfunc ){
            $('body').basepanel( { left: $(this).offset().left, top: $(this).offset().top + 30, width: $(window).width() * 20 /100}, function( curbox ){
                GetImageUpload( curbox, "attach", retfunc );
                $(curbox).attr("filenum", 0);
                $(curbox).find( "input" ).click();
                $(window).one("focus", function(){
                    setTimeout( function(){
                        if( $(curbox).attr("filenum") <= 0 )
                            $('body').closepanel();
                    }, 500 );
                });
            });
        },
        lvspanelvod: function( retfunc ){
            $('body').basepanel( {left: $(this).offset().left - $(window).width() * 15 / 100, top: $(this).offset().top + 30, width: $(window).width() * 30 /100}, function( curbox ){
                $(curbox).html("<div lvs_elm=\"SimpTabIdx\"></div><div class=\"BaseDesc\"><a class=\"PanelOk button bg-green\">确认添加</a><a class=\"PanelCancel button bg-grey\">取消操作</a></div>");
                var Lvs = LvsCore.Create();
                Lvs.BindTmpl("#cn.tab.simptab", $(curbox).find("[lvs_elm=SimpTabIdx]"), "", 0, { tabs: [{tabname: "上传文件", tabidx: "file", htmltext: "<div class=\"BaseDesc\">上传文件：</div><div class=\"VodFile\" lvs_bind=\"VodFile\"></div>"}, {tabname: "复制链接", tabidx: "url", htmltext: "<div class=\"BaseDesc\">复制文件链接：</div><div class=\"BaseDesc\"><input lvs_bind=\"VodUrl\" class=\"lvs-form-binput\"/></div>"}]}, function(){
                });
                $(curbox).find(".PanelOk").click(function(){
                    var urlstr = $(curbox).getbind("VodFile");
                    if( urlstr == undefined || urlstr == "" )
                        urlstr = $(curbox).getbind("VodUrl");
                    if( urlstr == undefined || urlstr == "" ){
                        var tips = ErrorTip.Create();
                        tips.Show("请上传文件或者输入文件链接");
                    }
                    else{
                        retfunc( curbox, urlstr, 0 );
                    }
                });
                $(curbox).find(".PanelCancel").click(function(){
                    $('body').closepanel();
                });
            });
        },
        lvsattach: function (retfunc) {
            var curelm = $(this);
            if( $(curelm).find(".ClickUpload").size() == 0 ){
                $(curelm).html( "<div class=\"clickfileupload\"><a class=\"button border-green\">点击上传文件</a></div>" );
            }
            else
                $(curelm).find(".ClickUpload" ).addClass("clickfileupload" );
            $(curelm).find( ".clickfileupload" ).click(function(){
                var clkelm = $(this);
                $(curelm).find('.clickfileupload').each(function(){
                    if( $(this).find( '.upload_preview').size() > 0 ){
                        var picstr = $(this).find( '.upload_preview').html();
                        $(this).parent().html("").html( "<div class=\"clickpicview\">" + picstr + "</div>" );
                    }
                    else
                    {
                        $(this).html("<a class=\"button border-green\">点击上传文件</a>");
                    }
                });
                $(curelm).html("<div class=\"clickfileupload\"></div>");
                GetImageUpload( $(curelm).find(".clickfileupload"), "attach", retfunc );
                $(curelm).find( "input" ).click();
            });
            return this;
        },
        lvsvod: function(){
            var curelm = $(this);
            var showtext = $(this).text();
            var filetype = $(curelm).attr("filetype");
            if( showtext == "" )
                showtext = "点击上传视频";
            if( $(this).hasClass("BaseUploadImg")){
                $(curelm).html( "<div class=\"clickfileupload\">" + $(curelm).html() + "</div>" );
            }
            else if( $(this).find("img").size() > 0 )
            {
                $(this).find(".clickfileupload").remove();
                $(curelm).html( "<div class=\"clickfileupload\"><a>" + $(this).html() + "上传视频</a></div>" );
                $(curelm).find("img").addClass("UploadResImg" );
                filetype = "../";
            }
            else if( filetype != "video" ){
                filetype = "../";
                $(curelm).html( "<div class=\"clickfileupload\"><a><img src=\"../Image/addphoto.jpg\"/><br/><span class=\"small\">" + showtext + "</span></a></div>" );
            }
            $(curelm).find( ".clickfileupload" ).one("click", function(){
                var clkelm = $(this);
                if( $(clkelm).find( '.upload_preview').size() > 0 ){
                    var picstr = $(this).find( '.upload_preview').html();
                    $(this).find( '.upload_preview').html( "" );
                }
                else if( $('.UploadResImg').size() == 0 )
                {
                    $(clkelm).html("<a><img src=\"../Image/add.png\"></a>");
                }
                GetVodUpload( $(clkelm), function( vodurl ){
                    $(curelm).attr("returl", vodurl );
                });
                $(curelm).find( "input" ).click();
            });
            return curelm;
        },
        piclist: function () {
            var ret = "";
            var container = $(this).find('.upload_preview');
            if( $(this).find(".UploadResImg").size() > 0 )
                return $(this).find(".UploadResImg").attr("picid");
            else if( $(this).hasClass("AddPics"))
                container = $(this);
            else if( $(this).find('.upload_preview').size() == 0 )
                container = $(this).find('.clickpicview');
            $(container).find( "img" ).each(function(){
                var picid = $(this).attr("picid");
                if( picid != undefined && picid > 0 ){
                    if( ret != "" )
                        ret += ",";
                    ret += picid;
                }
            });
            return ret;
        },
        curimg: function(){
            var src = "";
            $(this).find( ".upload_success" ).each(function(){
                if( src == "" )
                    src = $(this).attr("src");
            });
            return src;
        },
        picclear:function(){
            $(this).find( ".clickpicview").html("");
            $(this).find( ".upload_preview").html("");
            return this;
        },
        showres:function(){
            var imgs = "";
            $(this).find( ".upload_success" ).each(function(){
                imgs += "<img width=\"100%\" style=\"margin:8px\" picid=\"" + $(this).attr("picid") + "\" src=\"" + $(this).attr("src") + "\"/>";
            });
            $(this).find( ".upload_preview").html("");
            $(this).after( imgs );
            return this;
        }
    });
})(jQuery);
