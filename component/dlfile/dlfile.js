(function (jQuery){
    jQuery.fn.extend({
        lvs_dlFile:function (token,idxid,curdata) {
            var dlbox = $(this);
            curdata.url = "http://tuanju.js.cn/attach/proj/15/39a3_README.md"
            curdata.fn = "data.md"
            $(this).url = curdata.url;
            $(dlbox).find("[lvs_elm=dlFile]").click(function () {
                handleFileDownload = (curdata.url, curdata.filename) => {
                    // 创建 a 标签
                    let a = document.createElement('a');
                    a.href = url;
                    a.download = filename;
                    a.click();
                }
            })
            handlePdfLink = (url, filename) => {
                fetch(url, {
                    method: 'get',
                    responseType: 'arraybuffer',
                })
                    .then(function (res) {
                        if (res.status !== 200) {
                            return res.json()
                        }
                        return res.arrayBuffer()
                    })
                    .then((blobRes) => {
                        // 生成 Blob 对象，设置 type 等信息
                        const e = new Blob([blobRes], {
                            type: 'application/octet-stream',
                            'Content-Disposition':'attachment'
                        })
                        // 将 Blob 对象转为 url
                        const link = window.URL.createObjectURL(e)
                        handleFileDownload(link, filename)
                    }).catch(err => {
                    console.error(err)
                })
            }

        }
    })
})(jQuery)