(function (jQuery) {
   jQuery.fn.extend({
       lvs_cnMap:function (token,idxid,curdata) {
           //地图大小
           curdata.width = "800px";
           curdata.height = "800px";
            $(this).find("[lvs_elm=eMap]").attr("style","height:"+curdata.height+";"+"width:"+curdata.width)
           //tooltip内容
           curdata.data = [
               { name: "江苏", value: 1000 },
               { name: "北京", value: 1000 },
           ];
           //边框颜色
           curdata.borderColor = "rgba(104, 152, 190, 1)";
           //阴影颜色
           curdata.shadowColor = "rgba(128, 217, 248, 1)";
           //选中时的颜色
           curdata.emphasis = {
               label: {
                   color: "#ffffff",
               },
               itemStyle: {
                   areaColor: "#a5d4fe",
               },
           };
           //阴影渐变色
           curdata.colorStops = [
               {
                   offset: 0,
                   color: "rgba(223, 231, 242, 1)", // 0% 处的颜色
               },
               {
                   offset: 1,
                   color: "rgba(2, 99, 206, 1)", // 100% 处的颜色
               },
           ];

           let mapEcharts = null;
           let historyList = [];
           let timeFn = null;

           if (mapEcharts) {
               mapEcharts.dispose(); // 销毁实例，实例销毁后无法再被使用。
           }
           // 初始化图表
           mapEcharts = echarts.init(document.getElementById("3dMap"));

           historyList.push({
               code: "china",
               name: "中国",
           });

           // 加载效果
           mapEcharts.showLoading();

           initMap(china, "china", "中国");

           mapEcharts.on("click", (params) => {
               // 当双击事件发生时，清除单击事件，仅响应双击事件
               clearTimeout(timeFn);
               timeFn = setTimeout(function () {
                   if (
                       allAreaCode.filter((item) => item.name.indexOf(params.name) > -1)[0]
                   ) {
                       $("body").find("[lvs_elm=return]").css("display","")
                       let areaCode = allAreaCode.filter(
                           (item) => item.name.indexOf(params.name) > -1
                       )[0].code;
                       loadMap(
                           `https://geo.datav.aliyun.com/areas_v3/bound/${areaCode}_full.json`
                       )
                           .then((data) => {
                               initMap(data, areaCode);
                           })
                           .catch(() => {
                               loadMap(
                                   `https://geo.datav.aliyun.com/areas_v3/bound/${areaCode}.json`
                               )
                                   .then((res) => {
                                       initMap(res, areaCode);
                                   })
                                   .catch(() => {});
                           });

                       historyList.push({
                           code: areaCode,
                           name: params.name,
                       });

                       let result = [];
                       let obj = {};
                       for (let i = 0; i < historyList.length; i++) {
                           if (!obj[historyList[i].code]) {
                               result.push(historyList[i]);
                               obj[historyList[i].code] = true;
                           }
                       }
                       historyList = result;
                   }
               }, 250);
           });
           // mapEcharts.on("dblclick", (params) => {
           // 当双击事件发生时，清除单击事件，仅响应双击事件
           $("body").find("[lvs_elm=return]").click(function () {
               clearTimeout(timeFn);
               // if (historyList.length == 1) {
               //     $("body").find("[lvs_elm=return]").css("display","none");
               //     alert("已经到达最上一级地图了");
               //     return;
               // }
               let map = historyList.pop();
               if (historyList[historyList.length - 1].code == "china") {
                   initMap(china, "china", "中国");
                   $("body").find("[lvs_elm=return]").css("display","none");
               } else {
                   loadMap(
                       `https://geo.datav.aliyun.com/areas_v3/bound/${
                           historyList[historyList.length - 1].code
                       }_full.json`
                   )
                       .then((data) => {
                           initMap(data, historyList[historyList.length - 1].code);
                       })
                       .catch(() => {
                           loadMap(
                               `https://geo.datav.aliyun.com/areas_v3/bound/${
                                   historyList[historyList.length - 1].code
                               }.json`
                           )
                               .then((res) => {
                                   initMap(res, historyList[historyList.length - 1].code);
                               })
                               .catch(() => {});
                       });
               }
           });

           // 地图数据请求
           async function loadMap(url, pathName) {
               return await $.getJSON(url);
           }

           // 地图初始化
           function initMap(mapData, mapName) {
               // 注册地图
               echarts.registerMap(mapName, mapData);

               // 配置项
               let options = {
                   tooltip: {
                       show: true,
                       trigger: 'item',
                       showDelay: 0,
                       transitionDuration: 0.2
                   },
                   series: [
                       {
                           name: "中国",
                           type: "map", // 地图
                           map: mapName, // 加载注册的地图
                           selectedMode: false, // 不让单独选中
                           roam: false, // 开始鼠标事件，scale缩放、move移动
                           // 图形上的文本标签
                           label: {
                               show: true,
                               color: "#000a3c",
                           },
                           // 地图样式
                           itemStyle: {
                               // 区域样式
                               areaColor: {
                                   type: "radial",
                                   x: 0.5,
                                   y: 0.5,
                                   r: 3,
                                   colorStops: [
                                       {
                                           offset: 0,
                                           color: "rgba(223, 231, 242, 1)", // 0% 处的颜色
                                       },
                                       {
                                           offset: 1,
                                           color: "rgba(2, 99, 206, 1)", // 100% 处的颜色
                                       },
                                   ],
                                   globalCoord: false, // 缺省为 false
                               },
                               borderWidth: 1, // 边框大小
                               borderColor: curdata.borderColor, // 边框样式
                               shadowColor: curdata.shadowColor, // 阴影颜色
                               shadowOffsetX: -2, // 阴影水平方向上的偏移距离
                               shadowOffsetY: 2, // 阴影垂直方向上的偏移距离
                               shadowBlur: 10, // 文字块的背景阴影长度
                           },
                           // 选中状态下样式
                           emphasis: curdata.emphasis,
                           data: curdata.data,
                       },
                   ],
               };
               mapEcharts.setOption(options); // 实例配置项与数据

               // 隐藏loading
               mapEcharts.hideLoading();
           }
       }
   }) 
})(jQuery)