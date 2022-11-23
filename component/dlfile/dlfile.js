(function (jQuery){
    jQuery.fn.extend({
        lvs_dlFile:function (token,idxid,curdata) {
            var dlbox = $(this);
            curdata.url = "http://tuanju.js.cn/attach/proj/18/35a9_%E6%9B%B4%E6%96%B0%E6%97%A5%E5%BF%97.txt"
            curdata.fn = "LICENSE.txt"
            $(this).url = curdata.url
            $(dlbox).find("[lvs_elm=dlFile]").click(function () {
                handleFileLink(curdata.url,curdata.fn);
            })
            handleFileDownload = (url, filename) => {
                // 创建 a 标签
                let a = document.createElement('a');
                a.href = url;
                a.download = filename;
                a.click();
            }
            handleFileLink = (url, filename) => {
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