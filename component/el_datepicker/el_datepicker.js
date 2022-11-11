(function (jQuery) {
    jQuery.fn.extend({
        lvs_el_datepicker: function (token, idxid, curdata) {

            var datepicker = $(this);
            var date = new Date();

            $('body').click(function (event) {
                if ($(".el_datepicker:hover").size() == 0 && $(".el_date_rangepicker:hover").size() == 0)
                    $(datepicker).find(".data").css("display", "none");

            });
            if (curdata.todayYear == undefined) {
                $(this).SetData(curdata, { "todayYear": date.getFullYear(), "todayMonth": date.getMonth() + 1 });
            }
            curdata.today = date.getDate();
            curdata.minYear = parseInt(curdata.todayYear / 10) * 10;
            curdata.maxYear = curdata.minYear + 9;

            //单个日期
            $(datepicker).find("[lvs_bind=InputData]").focus(function (event) {

                if ($(this).val() != "") {
                    var InputDay = new Date($(this).val());
                    curdata.todayYear = InputDay.getFullYear();
                    curdata.todayMonth = InputDay.getMonth() + 1;
                    curdata.today = InputDay.getDate();
                }
                //生成了日历
                $(datepicker).upCalendar(curdata);
                $(datepicker).find(".data").css("display", "block");

            });

            //如果带范围值，就直接出现两个日历，然后点击不同的日历得到不同的时间
            $(datepicker).find(".dateRange").focus(function (event) {

                if ($(datepicker).find("[lvs_bind=StartData]").val() != "") {

                    var startdate = new Date(Date.parse($(datepicker).find("[lvs_bind=StartData]").val().replace(/-/g, "/")));      //转换成Data(); 

                    curdata.startYear = startdate.getFullYear();
                    curdata.startMonth = startdate.getMonth() + 1;
                    curdata.startDay = startdate.getDate();
                    curdata.endYear = curdata.startYear;
                    curdata.endMonth = curdata.startMonth + 1;

                }
                else {
                    curdata.startYear = date.getFullYear();
                    curdata.startMonth = date.getMonth() + 1;
                    curdata.startDay = date.getDate();
                    curdata.endYear = curdata.startYear;
                    curdata.endMonth = curdata.startMonth + 1;
                }

                $(datepicker).upRangeCalendar(curdata);

                //设置今天的css

                $(datepicker).find("#" + $(this).formatDate(date.getFullYear(), date.getMonth() + 1, date.getDate())).addClass("today");
                //设置起始日期的css
                if ($(datepicker).find("[lvs_bind=EndData]").val() != "" || $(datepicker).find("[lvs_bind=StartData]").val() != "") {
                    $(datepicker).find("#" + $(datepicker).find("[lvs_bind=EndData]").val()).addClass("end_date");
                    $(datepicker).find("#" + $(datepicker).find("[lvs_bind=StartData]").val()).addClass("start_date");

                    $(datepicker).find(".available").each(function () {
                        var curdate = parseInt($(this).attr("year")) * 10000 + parseInt($(this).attr("month")) * 100 + parseInt($(this).attr("day"));
                        var begdate = parseInt($(".start_date").attr("year")) * 10000 + parseInt($(".start_date").attr("month")) * 100 + parseInt($(".start_date").attr("day"));
                        var enddate = parseInt($(".end_date").attr("year")) * 10000 + parseInt($(".end_date").attr("month")) * 100 + parseInt($(".end_date").attr("day"));
                        console.log(curdate, begdate, enddate);
                        if (curdate > begdate && curdate < enddate)
                            $(this).addClass("in_range");
                    });
                }


                $(datepicker).find(".data").css("display", "block");
                // $(datepicker).find(".el_date_rangepicker_body").css("display", "block");

            });

            //如果带范围值，就直接出现两个日历，点击前一个月，两个日历都改变
            $(datepicker).find(".el_range_prevYear").click(function (event) {
                //生成了年历
                $(datepicker).SetData(curdata, { "startYear": curdata.startYear - 1 });
                $(datepicker).SetData(curdata, { "endYear": curdata.endYear - 1 });
                console.log("el_range_prevYear", curdata.startYear);
                $(datepicker).upRangeCalendar(curdata);
            });
            $(datepicker).find(".el_range_nextYear").click(function (event) {
                //生成了年历
                $(datepicker).SetData(curdata, { "startYear": curdata.startYear + 1 });
                $(datepicker).SetData(curdata, { "endYear": curdata.endYear + 1 });

                $(datepicker).upRangeCalendar(curdata);
            });


            //如果带范围值，就直接出现两个日历，点击前一个月，两个日历都改变
            //如果点击前一个月，更新日历
            $(datepicker).find(".el_range_prevMonth").click(function (event) {
                console.log("startMonth", curdata.startMonth);
                if (curdata.startMonth == 1) {
                    $(datepicker).SetData(curdata, { "startYear": curdata.startYear - 1, "startMonth": 12 });
                    $(datepicker).SetData(curdata, { "endMonth": curdata.endMonth - 1 });
                } else if (curdata.startMonth == 12) {
                    $(datepicker).SetData(curdata, { "startMonth": curdata.startMonth - 1 });
                    $(datepicker).SetData(curdata, { "endYear": curdata.endYear - 1, "endMonth": 12 });
                }
                else {
                    $(datepicker).SetData(curdata, { "startMonth": curdata.startMonth - 1 });
                    $(datepicker).SetData(curdata, { "endMonth": curdata.endMonth - 1 });
                }
                $(datepicker).upRangeCalendar(curdata);
            });

            //如果点击后一个月，更新日历
            $(datepicker).find(".el_range_nextMonth").click(function (event) {
                if (curdata.startMonth == 12) {
                    $(datepicker).SetData(curdata, { "startYear": curdata.startYear + 1, "startMonth": 1 });
                    $(datepicker).SetData(curdata, { "endMonth": curdata.endMonth + 1 });
                } else if (curdata.startMonth == 11) {
                    $(datepicker).SetData(curdata, { "startMonth": curdata.startMonth + 1 });
                    $(datepicker).SetData(curdata, { "endYear": curdata.endYear + 1, "endMonth": 1 });
                }
                else {
                    $(datepicker).SetData(curdata, { "startMonth": curdata.startMonth + 1 });
                    $(datepicker).SetData(curdata, { "endMonth": curdata.endMonth + 1 });
                }
                $(datepicker).upRangeCalendar(curdata);
            });

            //点击清除，可以重新选择
            $(datepicker).find(".el_input_clear").click(function (event) {
                $(datepicker).find("[lvs_bind=InputData]").val('');
                $(datepicker).find("[lvs_bind=StartData]").val('');
                $(datepicker).find("[lvs_bind=EndData]").val('');
                $(datepicker).find(".el_input_clear").css("display", "none");
                $(datepicker).find(".data").css("display", "none");

            });

            //如果双击，就是当前天既是开始又是结束

            //如果点击前一年，更新日历
            $(datepicker).find(".el_datatable_prevYear").click(function (event) {
                //生成了年历
                $(datepicker).prevDateYear(curdata);
            });
            $(datepicker).find(".el_datatable_nextYear").click(function (event) {
                //生成了年历
                $(datepicker).nextDateYear(curdata);
            });

            //如果点击前一个月，更新日历
            $(datepicker).find(".el_datatable_prevMonth").click(function (event) {
                $(datepicker).prevDateMonth(curdata);
            });
            //如果点击后一个月，更新日历
            $(datepicker).find(".el_datatable_nextMonth").click(function (event) {
                $(datepicker).nextDateMonth(curdata);
            });
            //点击年份，显示年历
            $(datepicker).find("[lvs_bind=todayYear]").click(function (event) {
                $(datepicker).find(".data").css("display", "none");
                $(datepicker).upTableYear(curdata);
                $(datepicker).find(".year").css("display", "block");
            });
            //点击前十年
            $(datepicker).find(".el_yeartable_prevYear").click(function (event) {
                $(datepicker).prevYear(curdata);
            });
            $(datepicker).find(".el_yeartable_nextYear").click(function (event) {
                $(datepicker).nextYear(curdata);
            });

        },

        upCalendar: function (curdata) {
            var formbox = $(this);

            var arr = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
            var months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

            if ($(this).isLeapYear(curdata.todayYear)) {
                months[1] = 29;
            };

            var firstMonthDay = new Date(curdata.todayMonth + "/" + 1 + "/" + curdata.todayYear);
            var firstDayWeekId = firstMonthDay.getDay();
            var firstMonthDate = arr[firstMonthDay.getDay()];
            var nextMonthDay = new Date(curdata.todayMonth + "/" + 1 + "/" + curdata.todayYear);

            var lastMonthDay = new Date(nextMonthDay.setMonth(nextMonthDay.getMonth() + 1)).getDay() - 1;
            if (lastMonthDay < 0) {
                lastMonthDay = 6;
            }

            var CalendarStr = " <table class=\"el_date_table\"><tbody><tr><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr><tr>";
            for (var i = 0; i < firstDayWeekId; i++) { //表格的行
                var Day = new Date(curdata.todayMonth + "/" + 1 + "/" + curdata.todayYear);
                CalendarStr += "<td class=\"prev_month\">" + new Date(Day.setDate(Day.getDate() - 7 + i)).getDate() + "</td>";
            }
            for (var i = 0; i < months[curdata.todayMonth - 1]; i++) {
                if ((firstDayWeekId + i) % 7 == 0)
                    CalendarStr += "</tr><tr>";
                var Day = new Date(curdata.todayMonth + "/" + 1 + "/" + curdata.todayYear);
                if ((i + 1) == curdata.today) {
                    CalendarStr += "<td class=\"available today\">" + $(this).dateAddDay(Day, i).getDate() + "</td>";
                } else {
                    CalendarStr += "<td class=\"available\">" + $(this).dateAddDay(Day, i).getDate() + "</td>";
                }

            }
            for (var i = lastMonthDay + 1; i < 7; i++) {
                CalendarStr += "<td class=\"next_month\">" + (i - lastMonthDay) + "</td>";
            }
            CalendarStr += "</tr></table>";
            $("#datetable").html(CalendarStr);
            $(formbox).SetData(curdata, { "todayYear": curdata.todayYear, "todayMonth": curdata.todayMonth });

            $("#datetable").find("td").click(function (event) {
                curdata.today = $(this).text();
                $(formbox).find(".data").css("display", "none");
                $(formbox).find(".el_input_clear").css("display", "block");
                //日期格式为YYYY-MM-DD
                $(formbox).SetData(curdata, { "InputData": $(this).formatDate(curdata.todayYear, curdata.todayMonth, curdata.today) });

            });



            //点击input后生成当月的表格（算出当月第一天是礼拜几，每周的日期，增加补位的数据，然后写入表格里面）
            //点击某一天之后，获取当前的数据，写入进去
            //如果已经选中了某一天再点击，那么选中的那一天类别要变一下

        },
        upTableYear: function (curdata) {
            var formbox = $(this);

            TableYearStr = "<table class=\"el_year_table\"><tbody><tr>";
            for (var i = 0; i < 10; i++) {

                if ((curdata.minYear + i) == curdata.todayYear) {
                    TableYearStr += "<td class=\"available todayYear\">" + (curdata.minYear + i) + "</td>";
                }
                else {
                    TableYearStr += "<td class=\"available\">" + (curdata.minYear + i) + "</td>";
                }
                if ((i + 1) % 4 == 0)
                    TableYearStr += "</tr><tr>";
            }
            $("#yeartable").html(TableYearStr);
            $(this).SetData(curdata, { "minYear": curdata.minYear, "maxYear": curdata.maxYear });
            $("#yeartable").find("td").click(function (event) {
                curdata.todayYear = $(this).text();
                $(formbox).find(".year").css("display", "none");
                $(formbox).upTableMonth(curdata);
                $(formbox).find(".month").css("display", "block");

            });
        },
        upTableMonth: function (curdata) {
            var formbox = $(this);
            $(this).SetData(curdata, { "todayYear": curdata.todayYear });
            TableMonthStr = "<table class=\"el_month_table\"><tbody><tr>";
            for (var i = 0; i < 12; i++) {
                if ((i + 1) == curdata.todayMonth) {
                    TableMonthStr += "<td class=\"available todayMonth\">" + (i + 1) + "月</td>";
                }
                else {
                    TableMonthStr += "<td class=\"available\" monthid=\"" + (i + 1) + "\">" + (i + 1) + "月</td>";
                }
                if ((i + 1) % 4 == 0)
                    TableMonthStr += "</tr><tr>";
            }
            $("#monthtable").html(TableMonthStr);
            $("#monthtable").find("td").click(function (event) {
                curdata.todayMonth = $(this).attr("monthid");
                $(formbox).find(".month").css("display", "none");
                console.log("upmonthtable", curdata.todayYear, curdata.todayMonth);
                $(formbox).upCalendar(curdata);
                $(formbox).find(".data").css("display", "block");
            });
        },
        prevYear: function (curdata) { //前十年
            console.log(curdata.todayYear);
            $(this).SetData(curdata, { "minYear": curdata.minYear - 10, "maxYear": curdata.maxYear - 10 });
            $(this).upTableYear(curdata);
        },
        nextYear: function (curdata) { //后十年
            console.log(curdata.todayYear);
            $(this).SetData(curdata, { "minYear": curdata.minYear + 10, "maxYear": curdata.maxYear + 10 });
            $(this).upTableYear(curdata);
        },
        prevDateYear: function (curdata) { //去年这个时间
            console.log(curdata.todayYear);
            $(this).SetData(curdata, { "todayYear": curdata.todayYear - 1 });
            $(this).upCalendar(curdata);
        },
        nextDateYear: function (curdata) { //去年这个时间
            console.log(curdata.todayYear);
            $(this).SetData(curdata, { "todayYear": curdata.todayYear + 1 });
            $(this).upCalendar(curdata);
        },

        prevDateMonth: function (curdata) { //上一个月
            console.log(curdata.todayMonth);
            if (curdata.todayMonth == 1) {
                $(this).SetData(curdata, { "todayYear": curdata.todayYear - 1, "todayMonth": 12 });
            } else {
                $(this).SetData(curdata, { "todayMonth": curdata.todayMonth - 1 });
            }
            $(this).upCalendar(curdata);

        },
        nextDateMonth: function (curdata) { //下一个月
            if (curdata.todayMonth >= 12) {
                $(this).SetData(curdata, { "todayYear": curdata.todayYear + 1, "todayMonth": 1 });
            } else {
                $(this).SetData(curdata, { "todayMonth": curdata.todayMonth + 1 });
            }
            $(this).upCalendar(curdata);
        },


        isLeapYear: function (year) {
            return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);
        },
        dateAddDay: function (curdate, addday) {
            var newdate = new Date(curdate.setDate(curdate.getDate() + addday));
            return newdate;
        },
        calculateDays: function (year, month) {
            var days = months[month];
            // 2月比较特殊，非闰年28天，闰年29天，如2008年2月为29天
            if (1 == month && isLeapYear(year)) {
                days = 29;
            }
            return days;
        },
        formatDate: function (year, month, day) {

            //var year = curdata.todayYear, month = curdata.todayMonth, day = curdata.today;
            var preArr = Array.apply(null, Array(10)).map(function (elem, index) {
                return '0' + index;
            }); ////开个长度为10的数组 格式为 00 01 02 03

            var newDate = year + '-' +
                (preArr[month] || month) + '-' +
                (preArr[day] || day);

            return newDate;
        },

        upRangeCalendar: function (curdata) {
            var formbox = $(this);
            var varClickNum = 0;

            if (curdata.startMonth != curdata.endMonth) {
                CalendarStr = $(formbox).showDays(curdata.startYear, curdata.startMonth, curdata.startDay);
                $("#startTable").html(CalendarStr);
                $(formbox).SetData(curdata, { "startYear": curdata.startYear, "startMonth": curdata.startMonth });

                endStr = $(formbox).showDays(curdata.endYear, curdata.endMonth, curdata.endDay);
                $("#endTable").html(endStr);

                $(formbox).SetData(curdata, { "endYear": curdata.endYear, "endMonth": curdata.endMonth });
            }
            else {
                CalendarStr = $(formbox).showDays(curdata.startYear, curdata.startMonth, curdata.startDay);
                $("#startTable").html(CalendarStr);
                $(formbox).SetData(curdata, { "startYear": curdata.startYear, "startMonth": curdata.startMonth });

                endStr = $(formbox).showDays(curdata.endYear, curdata.endMonth + 1, 0);
                $("#endTable").html(endStr);
                $(formbox).SetData(curdata, { "endYear": curdata.endYear, "endMonth": curdata.endMonth + 1 });
            }

            var firstclickyear = 0; var firstclickmonth = 0; var firstclickday = 0;
            $(".el_date_table").find("td").click(function (event) {
                var year = parseInt($(this).attr("year"));
                var month = parseInt($(this).attr("month"));
                var day = parseInt($(this).text());
                console.log("click", year, month, day);
                var tableId = $(this).closest(".el_date_table").attr("id");
                console.log("tableid", tableId);
                if (varClickNum == 0) {
                    $(formbox).find(".start_date").removeClass("start_date");
                    $(formbox).find(".end_date").removeClass("end_date");
                    $(formbox).find(".in_range").removeClass("in_range");
                    curdata.startDay = $(this).text();
                    //日期格式为YYYY-MM-DD
                    $(formbox).SetData(curdata, { "StartData": $(this).formatDate(year, month, day) });
                    varClickNum++;
                    firstclickyear = year;
                    firstclickmonth = month;
                    firstclickday = day;
                    $(formbox).find("#" + $(this).formatDate(year, month, day)).addClass("start_date");
                    //增加鼠标移动的事件处理
                    $(".el_date_table").find("td").mousemove(function (event) {
                        console.log("mousemove");
                        $(formbox).find("#" + $(this).formatDate($(this).attr("year"), $(this).attr("month"), $(this).text())).addClass("end_date");
                        $(formbox).find(".available").each(function () {
                            var curdate = parseInt($(this).attr("year")) * 10000 + parseInt($(this).attr("month")) * 100 + parseInt($(this).attr("day"));
                            var begdate = parseInt($(".start_date").attr("year")) * 10000 + parseInt($(".start_date").attr("month")) * 100 + parseInt($(".start_date").attr("day"));
                            var enddate = parseInt($(".end_date").attr("year")) * 10000 + parseInt($(".end_date").attr("month")) * 100 + parseInt($(".end_date").attr("day"));
                            console.log(curdate, begdate, enddate);
                            if (curdate > begdate && curdate < enddate)
                                $(this).addClass("in_range");
                        });

                    });
                    $(".el_date_table").find("td").mouseout(function (event) {
                        console.log("mousemove");
                        $(formbox).find(".end_date").removeClass("end_date");
                        $(formbox).find(".available").each(function () {
                                $(this).removeClass("in_range");
                        });
                    });
                }
                else if (varClickNum == 1) {
                    curdata.endDay = $(this).text();
                    //如果第二次点击年月都相等就判断日期是否小于，如果小于，那么开始日期和结束日期需要更换一下
                    if (year == firstclickyear && month == firstclickmonth && firstclickday > day) {
                        $(formbox).SetData(curdata, { "StartData": $(this).formatDate(year, month, day) });
                        $(formbox).SetData(curdata, { "EndData": $(this).formatDate(firstclickyear, firstclickmonth, firstclickday) });
                        $(formbox).find("#" + $(this).formatDate(firstclickyear, firstclickmonth, firstclickday)).addClass("start_date");
                    }
                    else {
                        $(formbox).SetData(curdata, { "EndData": $(this).formatDate(year, month, day) });
                        $(formbox).find("#" + $(this).formatDate(year, month, day)).addClass("start_date");
                    }
                    $(formbox).find(".el_date_rangepicker_body").css("display", "none");
                    $(formbox).find(".el_input_clear").css("display", "block");
                    varClickNum = 0;
                }

            });





        },
        showDays: function (year, month, day) {

            var arr = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
            var months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];


            //判断是不是闰年
            if ($(this).isLeapYear(year)) {
                months[1] = 29;
            };

            var firstStartDay = new Date(month + "/" + 1 + "/" + year);
            var firstDayWeekId = firstStartDay.getDay();
            var firstStartDate = arr[firstDayWeekId];
            var nextMonthDay = new Date(month + "/" + 1 + "/" + year);

            var lastMonthDay = new Date(nextMonthDay.setMonth(nextMonthDay.getMonth() + 1)).getDay() - 1;
            if (lastMonthDay < 0) {
                lastMonthDay = 6;
            }
            var varRows = 0;
            //开始月份的日历
            var CalendarStr = " <table class=\"el_date_table\"><tbody><tr><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr><tr>";
            for (var i = 0; i < (firstDayWeekId == 0 ? 7 : firstDayWeekId); i++) { //表格的行
                var Day = new Date(month + "/" + 1 + "/" + year);
                Day.setDate(Day.getDate() - (firstDayWeekId == 0 ? 7 : firstDayWeekId) + i);
                CalendarStr += "<td class=\"prev_month\">" + new Date(Day).getDate() + "</td>";

            }
            for (var i = 0; i < months[month - 1]; i++) {
                if ((firstDayWeekId + i) % 7 == 0) {
                    CalendarStr += "</tr><tr>";
                    varRows++;
                }
                var Day = new Date(month + "/" + 1 + "/" + year);

                CalendarStr += "<td class=\"available\" id=\"" + $(this).formatDate(year, month, i + 1) + "\"year=\"" + year + "\" month=\"" + month + "\" day=\"" + (i + 1) + "\">" + $(this).dateAddDay(Day, i).getDate() + "</td>";


            }
            for (var i = lastMonthDay + 1; i < 7; i++) {
                CalendarStr += "<td class=\"next_month\">" + (i - lastMonthDay) + "</td>";
            }

            if (varRows < 5) {
                CalendarStr += "</tr></tr>";
                for (var i = 0; i < 7; i++) {
                    CalendarStr += "<td class=\"next_month\">" + (i + 7 - lastMonthDay) + "</td>";
                }
                varRows++;
            }
            console.log("varRows", varRows);
            CalendarStr += "</tr></table>";

            return CalendarStr;
        }

    });
})(jQuery);