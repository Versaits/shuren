(function (jQuery) {
    jQuery.fn.extend({
        lvs_el_slider: function (token, idxid, curdata) {
            var slider = $(this);
            curdata.curval = parseInt(curdata.curval) || 0;
            curdata.min = parseInt(curdata.min) || 0;
            curdata.max = parseInt(curdata.max) || 100;
            curdata.step = parseInt(curdata.step) || 1;
            
            if(curdata.curval != 0)
            {
                 $(this).find(".el_slider_button_wrapper").setPosition(curdata.curval,curdata);
            }

//            if(curdata.step != 1)
//            {
//                var num =  ((curdata.max - curdata.min) / curdata.step);
//                for(var i=0; i<num; i++ )
//                {
//                    $(this).find(".el_slider_runway").append("<div class=\"el_slider_stop\" style=\"left:"+i*curdata.step+"%\"></div>");
//                }
//            }           


            $(slider).find(".el_sub").click(function(event){
                 if (curdata.curval > 0) {
                    if (curdata.curval <curdata.min) {
                         alert("已到达最小数量！");
                    return;
                    }
                    curdata.curval--;
                    $(slider).SetData( curdata, {"InputNum": curdata.curval});   
                     console.log("a");
                     $(slider).find(".el_slider_button_wrapper").setPosition(curdata.curval,curdata);
                    } else 
                    {
                        alert("请输入有效数量！");
                    }
            });

            $(slider).find(".el_plus").click(function(event){
                 if (curdata.curval >= 0) {
                    if (curdata.curval > curdata.max) {
                         alert("已到达最大数量！");
                    return;
                    }
                    curdata.curval++;
                    $(slider).SetData( curdata, {"InputNum": curdata.curval});   
                    console.log("b");
                     $(slider).find(".el_slider_button_wrapper").setPosition(curdata.curval,curdata);
                    } else 
                    {
                        alert("请输入有效数量！");
                    }
            });

            $(slider).find("[lvs_bind=InputNum]").change(function(event){
                  var reg = /^[0-9]*$/;
                  curdata.curval=$(this).val();
                  reg.test(curdata.curval);
                  if (reg.test(curdata.curval) == false) {
                        alert("请输入有效数量！");        
                    }
                    console.log("c");
                  var newPosition = parseInt(curdata.curval*100/(curdata.max-curdata.min));
                  $(slider).find(".el_slider_button_wrapper").setPosition(newPosition,curdata);
                });

            $(slider).find(".el_slider").mousedown(function (event) {
                $(this).find(".el_slider_button_wrapper").onDragStart(event, curdata);
            });
            $(slider).find(".el_slider").mousemove(function (event) {
                $(this).find(".el_slider_button_wrapper").onDragging(event, curdata);
            });
            $(slider).find(".el_slider").mouseup(function (event) {
                $(this).find(".el_slider_button_wrapper").onDragEnd(event, curdata);
            });
          
         
            return this;
        },
        currentPosition: function (curdata) {
            return parseInt((curdata.value - curdata.min) / (curdata.max - curdata.min) * 100);
        },
        onButtonDown: function (event, curdata) {
            if (curdata.disabled) return;
            event.preventDefault();
            curdata.onDragStart(event);            
        },
        onDragStart: function (event, curdata) {
            curdata.dragging = true;
            curdata.isClick = true;
            //手机操作
            if (event.type === 'touchstart') {
                event.clientY = event.touches[0].clientY;
                event.clientX = event.touches[0].clientX;
            }
            if (curdata.vertical) {
                curdata.startY = event.clientY;
            } else {
                curdata.startX = event.clientX;
            }
            curdata.startPosition = parseFloat((event.clientX - $(this).parent().offset().left )  * 100/$(this).parent().width());
            curdata.newPosition = curdata.startPosition;
        },
        onDragging: function (event, curdata) {
            if (curdata.dragging) {
                curdata.isClick = false;
               // curdata.displayTooltip();
               // curdata.$parent.resetSize();

                var diff = 0;
                if (event.type === 'touchmove') {
                    event.clientY = event.touches[0].clientY;
                    event.clientX = event.touches[0].clientX;
                }
                if (curdata.vertical) {
                    curdata.currentY = event.clientY;
                    diff = (curdata.startY - curdata.currentY) / $(this).parent().width() * 100;
                } else {
                    curdata.currentX = event.clientX;
                    diff = (curdata.currentX - curdata.startX)  * 100/$(this).parent().width();
                }
                curdata.newPosition = curdata.startPosition + diff;
             
                $(this).setPosition(curdata.newPosition,curdata);
            }
        },
        onDragEnd: function (event, curdata) {
            if (curdata.dragging) {
                curdata.dragging = false;
             //如果是click直接设置值  
              curdata.currentX = event.clientX;
          //    if( (curdata.currentX - curdata.startX)< -10 ||(curdata.currentX - curdata.startX)>10) { 
               // curdata.newPosition = curdata.startPosition;
                $(this).setPosition(curdata.newPosition,curdata);    
                //根据位置算出value值，然后设置到input中
                curdata.value = curdata.newPosition*curdata.max/100;
                $(this).closest("component").SetData( curdata, {"InputNum": parseInt(curdata.value.toFixed())});      
        //      }
                        
            }
        },
        onSliderClick: function (event, curdata) {
            curdata.dragging= false;
            curdata.currentX = event.clientX;
            diff = (curdata.currentX - curdata.startX)  * 100/$(this).parent().width();
            curdata.newPosition = curdata.startPosition + diff;     
            console.log("f");       
            $(this).find(".el_slider_button_wrapper").setPosition(curdata.newPosition,curdata);            
            
        },
        setPosition:function(newPosition,curdata) {
        if (newPosition === null ||newPosition === undefined) return;
        if (newPosition < 0) {
          newPosition = 0;
        } else if (newPosition > 100) {
          newPosition = 100;
        }
        //算出每步长的长度，进行四舍五入
        const lengthPerStep = 100 / ((curdata.max - curdata.min) / curdata.step);        
        const steps = Math.round(newPosition / lengthPerStep);
        let   value = steps * lengthPerStep * (curdata.max - curdata.min) * 0.01 + curdata.min;
        value = parseInt(value.toFixed());
 //       curdata.$('input', value);
        curdata.curval = value;
        curdata.currentPosition = newPosition;
        console.log(newPosition,curdata);
        if(curdata.step == 1){
            
            if(newPosition<60 && curdata.slidegrade==1){
                 $(this).parent().find(".el_slider_bar").css("background-color","#F56C6C");
            }else if(newPosition<70 && curdata.slidegrade == 1){
                 $(this).parent().find(".el_slider_bar").css("background-color","#67C23A");
            }else if(newPosition<85 && curdata.slidegrade==1){
                $(this).parent().find(".el_slider_bar").css("background-color","#409EFF");                
            }else if(newPosition<100 && curdata.slidegrade == 1){
                 $(this).parent().find(".el_slider_bar").css("background-color","#4b5cc4");
            }
            $(this).attr("title", value).css("left",value + "%");
            $(this).parent().find(".el_slider_bar").css("width",newPosition + "%");   
        }
        else{
            $(this).attr("title", value).css("left",value + "%");
            $(this).parent().find(".el_slider_bar").css("width",value + "%");
        }
        if (!curdata.dragging && curdata.value !== curdata.oldValue) {
          curdata.oldValue = curdata.value;
        }
      },
      getSliderValue: function(){
        return $(this).getbind("InputNum");
      },
     
        InputTest:function (curdata) {
    
            var reg = /^[0-9]*$/;
            reg.test(curdata.curvalue);
            if (reg.test(curdata.curvalue) == false) {
                alert("请输入有效数量！");
        
            }
        }
    });
})(jQuery);
