//二级展开列表列表
(function (jQuery) {
    jQuery.fn.extend({
        lvs_minddemo: function (token, idxid, curdata) {
            var mindbox = $(this);
            curdata.mind2 = {};
            curdata.mind1 = {mindsource : {
    /* 元数据，定义思维导图的名称、作者、版本等信息 */
    "meta":{
        "name":"example",
        "author":"hizzgdev@163.com",
        "version":"0.2"
    },
    /* 数据格式声明 */
    "format":"node_array",
    /* 数据内容 */
    "data":[
        {"id":"root", "isroot":true, "topic":"jsMind"},

        {"id":"easy", "parentid":"root", "topic":"Easy", "direction":"right"},
        {"id":"easy1", "parentid":"easy", "topic":"Easy to show"},
        {"id":"easy2", "parentid":"easy", "topic":"Easy to edit"},
        {"id":"easy3", "parentid":"easy", "topic":"Easy to store"},
        {"id":"easy4", "parentid":"easy", "topic":"Easy to embed"},

        {"id":"open", "parentid":"root", "topic":"Open Source", "expanded":false, "direction":"right"},
        {"id":"open1", "parentid":"open", "topic":"on GitHub","background-color":"#eee"},
        {"id":"open2", "parentid":"open", "topic":"BSD License"},

        {"id":"powerful", "parentid":"root", "topic":"Powerful", "direction":"right"},
        {"id":"powerful1", "parentid":"powerful", "topic":"Base on Javascript"},
        {"id":"powerful2", "parentid":"powerful", "topic":"Base on HTML5"},
        {"id":"powerful3", "parentid":"powerful", "topic":"Depends on you"},
    ]}};
            curdata.mind2.mindsource = {
    /* 元数据，定义思维导图的名称、作者、版本等信息 */
    "meta":{
        "name":"example",
        "author":"hizzgdev@163.com",
        "version":"0.2"
    },
    /* 数据格式声明 */
    "format":"node_array",
    /* 数据内容 */
    "data":[
        {"id":"root", "isroot":true, "topic":"新建"}

    ]};
            return this;
        }
    });
})(jQuery);



//二级展开列表列表
(function (jQuery) {
    jQuery.fn.extend({
        lvselmind: function (token, idxid, curdata) {
           var mindtbox = $(this);

       var mind = curdata.mindsource || {
    /* 元数据，定义思维导图的名称、作者、版本等信息 */
    "meta":{
        "name":"example",
        "author":"hizzgdev@163.com",
        "version":"0.2"
    },
    /* 数据格式声明 */
    "format":"node_array",
    /* 数据内容 */
    "data":[
        {"id":"root", "isroot":true, "topic":"jsMind"},

        {"id":"easy", "parentid":"root", "topic":"Easy", "direction":"right"},
        {"id":"easy1", "parentid":"easy", "topic":"Easy to show"},
        {"id":"easy2", "parentid":"easy", "topic":"Easy to edit"},
        {"id":"easy3", "parentid":"easy", "topic":"Easy to store"},
        {"id":"easy4", "parentid":"easy", "topic":"Easy to embed"},

        {"id":"open", "parentid":"root", "topic":"Open Source", "expanded":false, "direction":"right"},
        {"id":"open1", "parentid":"open", "topic":"on GitHub","background-color":"#eee",},
        {"id":"open2", "parentid":"open", "topic":"BSD License"},

        {"id":"powerful", "parentid":"root", "topic":"Powerful", "direction":"right"},
        {"id":"powerful1", "parentid":"powerful", "topic":"Base on Javascript"},
        {"id":"powerful2", "parentid":"powerful", "topic":"Base on HTML5"},
        {"id":"powerful3", "parentid":"powerful", "topic":"Depends on you"},
    ]
};

         var options = {
	    container:'jsmind3_container' + (curdata.id||''),//容器的ID
	    editable:true,				// 是否启用编辑
	    theme:'primary'	,			//主题
	    view:{
	        engine: 'canvas',   // 思维导图各节点之间线条的绘制引擎
	        hmargin:100,        // 思维导图距容器外框的最小水平距离
	        vmargin:50,         // 思维导图距容器外框的最小垂直距离
	        line_width:1,       // 思维导图线条的粗细
	        line_color:'#555'   // 思维导图线条的颜色
	    },
	    layout:{
	        hspace:30,          // 节点之间的水平间距
	        vspace:8,          // 节点之间的垂直间距
	        pspace:13           // 节点与连接线之间的水平间距（用于容纳节点收缩/展开控制器）
	    },
	    shortcut:{
	        enable:false        // 是否启用快捷键
	    }
	};

             //初始化实例
         var jm = new jsMind(options);
 
		jm.show(mind);
		//jm.disable_edit();//禁止编制
		//jm.expand_all();//展开全部节点
	
        }

    });
})(jQuery);

//二级展开列表列表

(function (jQuery) {
    jQuery.fn.extend({
        lvseditmind: function (token, idxid, curdata) {
           var mindbox = $(this);
           var mind = {};
		   
        //点击确定，或者点击其他位置，都需要把弹框关闭
		//创建新的文件
        //打开文件
        //增加节点
        //删除
        //修改节点
         var options = {
                container:'jsmindedit_container'+(curdata.id||''),
                theme:'greensea',
                editable:true,
            };
             //初始化实例
			curdata.jm = new jsMind(options);
            //需要判断是否curdata.mindsource，如果有值直接显示curdata.mindsource;否则只是新建脑图
            console.log("minddata",curdata.mindsource);
            //
            if( curdata.mindstr && !curdata.mindsource)
                curdata.mindsource = $.parseJSON( curdata.mindstr );
                
            var mind = curdata.mindsource ? curdata.mindsource : {
				"meta":{
					"name":"jsMind remote",
					"author":"fancience.com",
					"version":"1.0"
				},
				"format":"node_array",
				"data":[{ "id": "root", "topic": "新建脑图", "isroot": true }]
			};
			curdata.jm.show(mind);

        $(mindbox).find("#getnodearray").click(function(event){
            $(this).get_nodearray_data(curdata);
            });
        
       $(mindbox).find("#openexampel").click(function(event){
            $(this).openfile(curdata);
            });

        $(mindbox).find("#openempty").click(function(event){
            $(this).open_empty(curdata);
            });

         $(mindbox).find("#addchild").click(function(event){
            $(this).addchild(curdata);
            });

         $(mindbox).find("#addbrother").click(function(event){
            $(this).addbrother(curdata);
            });

         $(mindbox).find("#moveup").click(function(event){
            $(this).moveup(curdata);
            });
         $(mindbox).find("#movedown").click(function(event){
            $(this).movedown(curdata);
            });
         $(mindbox).find("#movetofirst").click(function(event){
            $(this).movetofirst(curdata);
            });
        $(mindbox).find("#movetolast").click(function(event){
            $(this).movetolast(curdata);
            });
        $(mindbox).find("#removenode").click(function(event){
            $(this).removenode(curdata);
            });
         
         $(mindbox).find("#changesize").change(function(event){
            $(this).change_text_size(curdata,$(this).val());
            });
        //改变字体颜色
        $(mindbox).find("#changetextcolor").click(function(event){
            $(mindbox).find("#colorselect").css({ "position": "absolute", "top": $(this).position().top + $(this).height(), "left": $(this).position().left }).fadeIn(300);       
            $(mindbox).find("#colorselect").css("display", "block");
            $('body').bind("click",function (event) {
               if($(".mind_menu:hover").size() == 0 && $('#changetextcolor:hover').size()==0){
                   $(mindbox).find(".mind_menu").css("display", "none");
                   $('body').unbind("click");
               }
            });
            $(mindbox).find("#colorselect").find(".ke-colorpicker-cell").bind("click",function(event){ 
                console.log("choose color");
                $(mindbox).find("#colorselect").find(".ke-colorpicker-cell").unbind("click");
                $(mindbox).find("#colorselect").css("display", "none");
                 $('body').unbind("click");
                var textcolor=$(this).attr("title");
                console.log("textcolor",textcolor);
                $(this).change_text_color(curdata,textcolor);
                });
            });
        
        //改变背景颜色,
         $(mindbox).find("#changebgcolor").click(function(event){
            $(mindbox).find("#colorselect").css({ "position": "absolute", "top": $(this).position().top + $(this).height(), "left": $(this).position().left }).fadeIn(300);       
            $(mindbox).find("#colorselect").css("display", "block");
            $('body').bind("click",function (event) {
               if($(".mind_menu:hover").size() == 0 && $('#changebgcolor:hover').size()==0){
                   $(mindbox).find(".mind_menu").css("display", "none");
                   $('body').unbind("click");
               }
            });
             $(mindbox).find("#colorselect").find(".ke-colorpicker-cell").bind("click",function(event){ 
                $(mindbox).find("#colorselect").find(".ke-colorpicker-cell").unbind("click");
                $(mindbox).find("#colorselect").css("display", "none");
                $('body').unbind("click");
                var bgcolor=$(this).attr("title");
                console.log("changebgcolor",$(this).val());
                 $(this).change_background_color(curdata,bgcolor);
                });            
            });

        $(mindbox).find("#expandnode").click(function(event){
            $(this).expandnode(curdata);
            });

        $(mindbox).find("#collapsenode").click(function(event){
            $(this).collapsenode(curdata);
            });

         $(mindbox).find("#expandall").click(function(event){
            $(this).expandall(curdata);
            });

        $(mindbox).find("#collapseall").click(function(event){
            $(this).collapseall(curdata);
            });

        $(mindbox).find("#zoomIn").click(function(event){
            $(this).zoomIn(curdata);
            });

         $(mindbox).find("#zoomOut").click(function(event){            
            $(this).zoomOut(curdata);
            });
        
        $(mindbox).find("#getminddata").click(function(event){            
            $(this).get_nodearray_data(curdata);
            });
        //改变字体大小
         $(mindbox).find("#changesize").click(function(event){ 
             
            $(mindbox).find("#fontsize").css({ "position": "absolute", "top": $(this).position().top + $(this).height(), "left": $(this).position().left }).fadeIn(300);       
            $(mindbox).find("#fontsize").css("display", "block");
             $('body').bind("click",function (event) {
               if($(".mind_menu:hover").size() == 0 && $('#changesize:hover').size()==0){
                   $(mindbox).find(".mind_menu").css("display", "none");
                   $('body').unbind("click");
               }
            });
            $(mindbox).find("#fontsize").find(".fontsizeItem").click(function(event){ 
                $(mindbox).find("#fontsize").css("display", "none");
                $('body').unbind("click");
                
                var fontsize=$(this).attr("fontsize");         
                $(this).change_text_size(curdata,fontsize);
                });
            });
        //点击字体，弹出下拉框,因为jsmind不支持字体变化，所以不提供字体变化
     /*   $("#changefont").click(function(event){ 
             
            $("#fonttype").css({ "position": "absolute", "top": $(this).position().top + $(this).height(), "left": $(this).position().left }).fadeIn(300);       
            $("#fonttype").css("display", "block");
            $("#fonttype").find(".fonttypeItem").click(function(event){ 
                $("#fonttype").css("display", "none");
                console.log("font",$(this).attr("fontname"));  
                var fontname=$(this).attr(fontname);         
                $(this).change_text_font(curdata,fontname);
                });
            });*/
       },
       //导出数据
        get_nodearray_data:function(curdata){
            if( !curdata.jm )
                return ""; 
            var mind_data = curdata.jm.get_data('node_array');
            var mind_string = jsMind.util.json.json2string(mind_data);
            curdata.mindresult=mind_string;
            console.log(mind_string);
            return mind_data;
        },
         zoomOut: function(curdata){          
            if (curdata.jm.view.zoomOut()) {
            console.log("运行zoomOut");
               $("#zoomOut").attr("disabled",false);
            } else {
                $("#zoomOut").attr("disabled",true);
            };
        },
        zoomIn: function(curdata){
            
            if (curdata.jm.view.zoomIn()) {
                $("#zoomIn").attr("disabled",false);
            } else {
                $("#zoomIn").attr("disabled",true);
            };
        },
         collapseall: function(curdata){
           curdata.jm.collapse_all();
        },
        expandall: function(curdata){
            curdata.jm.expand_all();
        },
         collapsenode: function(curdata){
            var selected_node = curdata.jm.get_selected_node();
            if(!selected_node){alert('请先选中一个节点');return;}
 
            curdata.jm.collapse_node(selected_node.id);
        },
        expandnode: function(curdata){
            var selected_node = curdata.jm.get_selected_node();
            if(!selected_node){alert('请先选中一个节点');return;}
 
            curdata.jm.expand_node(selected_node.id);
        },
          change_background_color:function(curdata,color){
            console.log("change_background_color",color);
            var selected_node = curdata.jm.get_selected_node();
            if(!selected_node){alert('请先选中一个节点');return;}

            curdata.jm.set_node_color(selected_node.id, color,null);
        },
         change_text_color:function(curdata,color){
           console.log("change_text_color",color);
            var selected_node = curdata.jm.get_selected_node();
            if(!selected_node){alert('请先选中一个节点');return;}

            curdata.jm.set_node_color(selected_node.id, null, color);
        },
         change_text_size:function(curdata,size){
            var selected_node = curdata.jm.get_selected_node();
            console.log("selected_node",selected_node.id,size);
            if(!selected_node){alert('请先选中一个节点');return;}
            curdata.jm.set_node_font_style(selected_node.id, size);
        },
         change_text_font:function(curdata,type){
           
            var selected_node = curdata.jm.get_selected_node();
            if(!selected_node){alert('请先选中一个节点');return;}

            curdata.jm.set_node_font_style(selected_node.id, null, null,null,type);
        },
        removenode:function(curdata){
            var selected_node = curdata.jm.get_selected_node();
            if(!selected_node){alert('请先选中一个节点');return;}
            // move a node before another
            curdata.jm.remove_node(selected_node);
        },
        moveup:function(curdata){
            var selected_node = curdata.jm.get_selected_node();
            if(!selected_node){alert('请先选中一个节点');return;}
            // move a node before another
            curdata.jm.move_node(selected_node,'_up_');
        },
        movedown:function(curdata){
            var selected_node = curdata.jm.get_selected_node();
            if(!selected_node){alert('请先选中一个节点');return;}
            // move a node before another
            curdata.jm.move_node(selected_node,'_down_');
        },
        movetofirst:function(curdata){
            var selected_node = curdata.jm.get_selected_node();
            if(!selected_node){alert('请先选中一个节点');return;}
            // move a node before another
            curdata.jm.move_node(selected_node,'_first_');
        },
         movetolast:function(curdata){
            var selected_node = curdata.jm.get_selected_node();
            if(!selected_node){alert('请先选中一个节点');return;}
            // move a node before another
            curdata.jm.move_node(selected_node,'_last_');
        },
        addbrother:function (curdata){
            var selected_node = curdata.jm.get_selected_node(); // as parent of new node
            if(!selected_node && !selected_node.isroot){alert('请先选中一个子节点');return;}
            if(selected_node.isroot){alert('无法创建同级根节点');return;}
 
            var nodeid = jsMind.util.uuid.newid();
            var topic='分支主题';
            var node = curdata.jm.insert_node_before(selected_node, nodeid, topic);

        },
        addchild:function (curdata){
            var selected_node = curdata.jm.get_selected_node(); // as parent of new node
            if(!selected_node){alert('请先选中一个节点');return;}
 
            var nodeid = jsMind.util.uuid.newid();
           // var topic = '* Node_'+nodeid.substr(0,5)+' *';
            var topic='分支主题';
            var node = curdata.jm.add_node(selected_node, nodeid, topic);
        },

        open_empty:function(curdata){
            var options = {
                container:'jsmindedit_container',
                theme:'greensea',
                editable:true,
            };
             //初始化实例
			//curdata.jm = new jsMind(options);
            curdata.jm = jsMind.show(options);
        },

        openfile:function(curdata){

			var options = {
				container:'jsmindedit_container',//容器的ID
				editable:true,				// 是否启用编辑
				theme:'primary'	,			//主题
			};

             //初始化实例
			curdata.jm  = new jsMind(options);
            
			var mind = {
				"meta":{
					"name":"jsMind remote",
					"author":"fancience.com",
					"version":"1.0"
				},
				"format":"node_array",
				"data":[
					{"id":"root", "isroot":true, "topic":"jsMind","foreground-color":"green","background-color":"pink"},

					{"id":"easy", "parentid":"root", "topic":"Easy", "direction":"right","font-family":"SimHei"},
					{"id":"easy1", "parentid":"easy", "topic":"Easy to show"},
					{"id":"easy2", "parentid":"easy", "topic":"Easy to edit"},
					{"id":"easy3", "parentid":"easy", "topic":"Easy to store"},
					{"id":"easy4", "parentid":"easy", "topic":"Easy to embed"},

					{"id":"open", "parentid":"root", "topic":"Open Source", "expanded":false, "direction":"right"},
					{"id":"open1", "parentid":"open", "topic":"on GitHub","background-color":"#eee"},
					{"id":"open2", "parentid":"open", "topic":"BSD License"},

					{"id":"powerful", "parentid":"root", "topic":"Powerful", "direction":"right"},
					{"id":"powerful1", "parentid":"powerful", "topic":"Base on Javascript"},
					{"id":"powerful2", "parentid":"powerful", "topic":"Base on HTML5"},
					{"id":"powerful3", "parentid":"powerful", "topic":"Depends on you"},
				]
			};
			curdata.jm.show(mind);
    },


    });
})(jQuery);