(function (jQuery) {
    jQuery.fn.extend({
        lvs_el_cascader: function (token, idxid, curdata) {

            var Grade = [{ id: '幼儿园', name: '幼儿园', children: [{ id: 3, name: "幼儿园小班" }, { id: 5, name: "幼儿园中班" }, { id: 7, name: "幼儿园大班"}] },
        { id: '小学', name: '小学', children: [{ id: 11, name: "小学一年级" }, { id: 13, name: "小学二年级" }, { id: 15, name: "小学三年级" }, { id: 17, name: "小学四年级" }, { id: 19, name: "小学五年级" }, { id: 21, name: "小学六年级"}] },
        { id: '初中', name: '初中', children: [{ id: 22, name: "初中预科" }, { id: 23, name: "初中一年级" }, { id: 25, name: "初中二年级" }, { id: 27, name: "初中三年级"}] },
        { id: '高中', name: '高中', children: [{ id: 29, name: "高中一年级" }, { id: 31, name: "高中二年级" }, { id: 33, name: "高中三年级"}] },
        { id: '大学', name: '大学', children: [{ id: 41, name: "大学本科" }, { id: 51, name: "硕士研究生" }, { id: 61, name: "博士研究生"}]}];

            var TestData = [{
                id: 'zhinan',
                name: '指南',
                children: [{
                    id: 'shejiyuanze',
                    name: '设计原则',
                    children: [{
                        id: 'yizhi',
                        name: '一致'
                    }, {
                        id: 'fankui',
                        name: '反馈'
                    }, {
                        id: 'xiaolv',
                        name: '效率'
                    }, {
                        id: 'kekong',
                        name: '可控'
                    }]
                }, {
                    id: 'daohang',
                    name: '导航',
                    children: [{
                        id: 'cexiangdaohang',
                        name: '侧向导航'
                    }, {
                        id: 'dingbudaohang',
                        name: '顶部导航'
                    }]
                }]
            }, {
                id: 'zujian',
                name: '组件',
                children: [{
                    id: 'basic',
                    name: 'Basic',
                    children: [{
                        id: 'layout',
                        name: 'Layout 布局'
                    }, {
                        id: 'color',
                        name: 'Color 色彩'
                    }, {
                        id: 'typography',
                        name: 'Typography 字体'
                    }, {
                        id: 'icon',
                        name: 'Icon 图标'
                    }, {
                        id: 'button',
                        name: 'Button 按钮'
                    }]
                }, {
                    id: 'form',
                    name: 'Form',
                    children: [{
                        id: 'radio',
                        name: 'Radio 单选框'
                    }, {
                        id: 'checkbox',
                        name: 'Checkbox 多选框'
                    }, {
                        id: 'input',
                        name: 'Input 输入框'
                    }, {
                        id: 'input-number',
                        name: 'InputNumber 计数器'
                    }, {
                        id: 'select',
                        name: 'Select 选择器'
                    }, {
                        id: 'cascader',
                        name: 'Cascader 级联选择器'
                    }, {
                        id: 'switch',
                        name: 'Switch 开关'
                    }, {
                        id: 'slider',
                        name: 'Slider 滑块'
                    }, {
                        id: 'time-picker',
                        name: 'TimePicker 时间选择器'
                    }, {
                        id: 'date-picker',
                        name: 'DatePicker 日期选择器'
                    }, {
                        id: 'datetime-picker',
                        name: 'DateTimePicker 日期时间选择器'
                    }, {
                        id: 'upload',
                        name: 'Upload 上传'
                    }, {
                        id: 'rate',
                        name: 'Rate 评分'
                    }, {
                        id: 'form',
                        name: 'Form 表单'
                    }]
                }, {
                    id: 'data',
                    name: 'Data',
                    children: [{
                        id: 'table',
                        name: 'Table 表格'
                    }, {
                        id: 'tag',
                        name: 'Tag 标签'
                    }, {
                        id: 'progress',
                        name: 'Progress 进度条'
                    }, {
                        id: 'tree',
                        name: 'Tree 树形控件'
                    }, {
                        id: 'pagination',
                        name: 'Pagination 分页'
                    }, {
                        id: 'badge',
                        name: 'Badge 标记'
                    }]
                }, {
                    id: 'notice',
                    name: 'Notice',
                    children: [{
                        id: 'alert',
                        name: 'Alert 警告'
                    }, {
                        id: 'loading',
                        name: 'Loading 加载'
                    }, {
                        id: 'message',
                        name: 'Message 消息提示'
                    }, {
                        id: 'message-box',
                        name: 'MessageBox 弹框'
                    }, {
                        id: 'notification',
                        name: 'Notification 通知'
                    }]
                }, {
                    id: 'navigation',
                    name: 'Navigation',
                    children: [{
                        id: 'menu',
                        name: 'NavMenu 导航菜单'
                    }, {
                        id: 'tabs',
                        name: 'Tabs 标签页'
                    }, {
                        id: 'breadcrumb',
                        name: 'Breadcrumb 面包屑'
                    }, {
                        id: 'dropdown',
                        name: 'Dropdown 下拉菜单'
                    }, {
                        id: 'steps',
                        name: 'Steps 步骤条'
                    }]
                }, {
                    id: 'others',
                    name: 'Others',
                    children: [{
                        id: 'dialog',
                        name: 'Dialog 对话框'
                    }, {
                        id: 'tooltip',
                        name: 'Tooltip 文字提示'
                    }, {
                        id: 'popover',
                        name: 'Popover 弹出框'
                    }, {
                        id: 'card',
                        name: 'Card 卡片'
                    }, {
                        id: 'carousel',
                        name: 'Carousel 走马灯'
                    }, {
                        id: 'collapse',
                        name: 'Collapse 折叠面板'
                    }]
                }]
            }, {
                id: 'ziyuan',
                name: '资源',
                children: [{
                    id: 'axure',
                    name: 'Axure Components'
                }, {
                    id: 'sketch',
                    name: 'Sketch Templates'
                }, {
                    id: 'jiaohu',
                    name: '组件交互文档'
                }]
            }];


            var cascader = $(this);

            $('body').click(function (event) {
                if ($(".el_cascader:hover").size() == 0 && $(".el_cascader_menu_wrap:hover").size() == 0)
                    $(cascader).find(".el_cascader_panel").css("display", "none");

            });

            $(cascader).find("[lvs_bind=SelectData]").focus(function (event) {
                curdata.menuNum = 0;

                //生成了列表
                console.log("upfirstList", TestData, curdata.menuNum);
                $(cascader).upNextList(curdata, TestData, curdata.menuNum);
                $(cascader).find(".el_cascader_panel").css("display", "flex");

                //如果已经有值就按照已有值显示列表
                if ($(this).val() != "") {
                    console.log("已有值", $(this).val());
                    var arr = $(this).val().split('/');
                    for (var i = 0; i < arr.length; i++) {
                        $(cascader).find("[labelname=" + arr[i] + "]").addClass("is_active");

                    }

                }

            });



        },
        upNextList: function (curdata, Level, num) {
            var formbox = $(this);
            var childrenData = Level;
            var levelid = parseInt(num);

            console.log("upNextList", Level, num, "levelid=", levelid);
            var ListStr = "<ul class=\"el_scrollbar_view el_cascader_menu_list\">";
            for (var i = 0; i < Level.length; i++) {
                if (num != 0) {
                    ListStr += "<li class=\"el_cascader_node\" labelname=" + childrenData[i].name + " arrayindex=" + i + " levelid=" + levelid + " levelname=\"" + curdata.clickLevelname + "/" + childrenData[i].name + "\">";
                }
                else {
                    ListStr += "<li class=\"el_cascader_node\" labelname=" + childrenData[i].name + " arrayindex=" + i + " levelid=" + levelid + " levelname=\"" + childrenData[i].name + "\">";
                }
                ListStr += "<span class=\"el_cascader_node_label\">" + childrenData[i].name + "</span>";
                if (childrenData[i].hasOwnProperty("children"))
                    ListStr += "<img class=\"el_icon_right\"  src=\"./icon/el_icon_right.png\"  />";
                ListStr += "</li>";
            }
            ListStr += "</ul>";


            $("#menu" + levelid).html(ListStr);
            $("#menu" + levelid).css("display", "");

            $("#menu" + num).find("li").click(function (event) {

                $(this).closest(".el_cascader_menu_wrap").find(".is_active").removeClass("is_active");
                $(this).addClass("is_active");
                var nextLevel = $(this).attr("id");
                var levelname = $(this).attr("levelname");
                var arrayIndex = $(this).attr("arrayindex");
                var levelid = parseInt($(this).attr("levelid"));

                //清除所有的子级菜单
                $(this).closest(".el_cascader_panel").find(".el_cascader_menu_wrap").each(function () {
                    if (parseInt($(this).attr("levelid")) > levelid) {
                        $(this).css("display","none");
                        $(this).html("");
                    }
                });

                isNextLevel = childrenData[arrayIndex].hasOwnProperty('children');


                if (num == 0) {
                    curdata.clickLevelname = $(this).text();
                } else {
                    curdata.clickLevelname = curdata.clickLevelname + "/" + $(this).text();
                }


                if (isNextLevel) {
                    curdata.menuNum = levelid + 1;
                    $("#menu" + num).upNextList(curdata, childrenData[arrayIndex].children, levelid + 1);
                }
                else { //直接将当前值返回


                    $(this).closest("[lvs_component=cn_el_cascader]").SetData(curdata, { "SelectData": $(this).attr("levelname") });
                    $(this).closest(".el_cascader_panel").css("display", "none");
                    curdata.menuNum = 0;
                }

            });
        }

    });
})(jQuery);