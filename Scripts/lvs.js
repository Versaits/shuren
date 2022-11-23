const CmntVersion = 23;
var LvsCore = {
    Create: function () {
        var lvscore = {};
        lvscore.RegScripts = function (pars, loaded) {
            var list = [{name:"../scripts/jquery.tmpl.min.js",type:"js"}, 
                        {name:"../scripts/jquery.timers-1.2.js",type:"js"}, 
                        {name:"../scripts/jweixin.js",type:"js"}];
            if( pars != undefined && pars.file != undefined && pars.file > 0 )
                list.push( {name:"../scripts/html5upload.js",type:"js"} );
            if( pars != undefined && pars.video > 0 ){
                list.push( {name:"http://imgcache.qq.com/open/qcloud/video/vcplayer/TcPlayer-2.3.2.js", type: "js" });
                list.push( {name:"../component/play/swf2js.js", type: "js" });
            }
            if( pars != undefined && pars.richedit > 0 ){
                list.push( {name:"../kedit/kindeditor-all-min.js", type: "js" });
                list.push( {name:"../kedit/lang/zh-CN.js", type: "js" });
            }
            if( pars != undefined && pars.vod >0 ){
                list.push( {name: "https://cdn.bootcdn.net/ajax/libs/axios/0.18.1/axios.min.js", type: "js" });
                list.push( {name: "https://cdn-go.cn/cdn/vod-js-sdk-v6/latest/vod-js-sdk-v6.js", type: "js"});
            }
            if( pars != undefined && pars.ppt > 0 ){
                list.push( {name:"../Scripts/pptx2json.js", type: "js" });
                list.push( {name:"../Scripts/tinycolor.js", type: "js" });
                list.push( {name:"../Scripts/tXml.min.js", type: "js" });
                list.push( {name:"../Scripts/jszip.min2.js", type: "js" });
            }
            if( pars != undefined && pars.modules != undefined ){
                for( var i = 0; i < pars.modules.length; i ++ ){
                    list.push( {name:"../component/" + pars.modules[i] + "/" + pars.modules[i] + ".js?v=" + CmntVersion, type:"js"} );
                    list.push( {name:"../component/" + pars.modules[i] + "/" + pars.modules[i] + ".css?v=" + CmntVersion, type:"css"} );
                    if( pars.modules[i] == "elmind" ){
                        list.push( {name:"../component/" + pars.modules[i] + "/jsmind.js", type:"js"} );
                        list.push( {name:"../component/" + pars.modules[i] + "/jsmind.css", type:"css"} );
                        list.push( {name:"../component/" + pars.modules[i] + "/jsmind.screenshot.js", type:"js"} );
                        list.push( {name:"../component/" + pars.modules[i] + "/jsmind.draggable.js", type:"js"} );
                    }
                    else if(pars.modules[i] == "elchart" ){
                        list.push( {name:"../component/" + pars.modules[i] + "/echarts.min.js", type:"js"} );
                    }
                    else if(pars.modules[i] == "elmind" ){
                        list.push( {name:"../component/" + pars.modules[i] + "/jsmind.js", type:"js"} );
                        list.push( {name:"../component/" + pars.modules[i] + "/jsmind.draggable.js", type:"js"} );
                        list.push( {name:"../component/" + pars.modules[i] + "/jsmind.screenshot.js", type:"js"} );
                        list.push( {name:"../component/" + pars.modules[i] + "/jsmind.css", type:"css"} );
                    }
                    else if( pars.modules[i] == "play" && pars.vod != 1 ){
                        list.push( {name:"http://imgcache.qq.com/open/qcloud/video/vcplayer/TcPlayer-2.3.2.js", type: "js" });
                        list.push( {name:"../component/play/swf2js.js", type: "js" });
                    }
                }
            }
            for (var i = 0, len = list.length; i < len; i++) {
                var script = list[i].type == "js" ? document.createElement("script") : document.createElement("link");
                script.type = list[i].type == "js" ? "text/javascript" : "text/css";
                if( i == len - 1){
                    if( script.readyState ){
                        script.onreadystatechange = function () { // IE 加载完成
                            if (script.readyState == 'loaded' || script.readyState == 'complete') {
                                script.onreadystatechange = null;
                                if( loaded != undefined )
                                    loaded();
                            }
                        };
                    }
                    else{
                        script.onload = function(){
                            if( loaded != undefined )
                                loaded();
                        };
                    }
                }
                if( list[i].type == "css" ){
                    script.rel = "stylesheet";
                    script.href = list[i].name;
                }
                else
                    script.src = list[i].name;
                document.getElementsByTagName('head')[0].appendChild(script);
            }
        };
        lvscore.RegToken = function (defapp, regtype, regok) {
            let apptype = lvscore.GetUrlParam("st") == "" ? defapp :lvscore.GetUrlParam("st");
            if( regtype == "none" ){
                if( regok != undefined ){
                    regok( apptype, "" );
                }
            }
            else{
                let tkname = lvscore.GetUrlParam("tn");
                let basetk = apptype == "Stem" ? "foken" : apptype + "_ken";
                let curtoken = (tkname!=""&&tkname != undefined) ? lvscore.GetCookie( tkname ) : lvscore.GetCookie( basetk );
                
                if( curtoken == undefined || curtoken == "" )
                    curtoken = lvscore.GetCookie( "hippoken" );
                if( tkname != "" && tkname != basetk && curtoken != "" )
                    lvscore.SetCookie( basetk, curtoken, 1 );
                let wxcode = lvscore.GetUrlParam( "code" );
                let tttoken = lvscore.GetUrlParam("tt");
                if( (curtoken == "" || curtoken == undefined||curtoken == null) && wxcode == "" && tttoken == "" ){
                    let paridx = location.href.indexOf( "?" );
                    let pathurl = paridx == -1 ? location.href : location.href.split('?')[0];
                    let stavars = decodeURI(window.location.search.substr(1)).split( "&" );
                    let statestr = "";
                    for( var i = 0; i < stavars.length; i ++ ){
                    var pair = stavars[i].split("=");
                        if (pair[0] != "state"&&pair[0] != "code"&&pair[0] != "in"&&pair[0] != "tt") {
                            statestr += (statestr==""?"":"!") + pair[0] + "*" + pair[1];
                        }
                    }
                    let appid = lvscore.GetAppid(apptype);
                    location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + appid + "&redirect_uri=" + pathurl + "&response_type=code&scope=" + (regtype=="user"?"snsapi_userinfo":"snsapi_base") + "&state=" + statestr + "#wechat_redirect";
                }
                else if( (curtoken == "" || curtoken == undefined) && wxcode != "" ){
                    var LvsAjax = LvsData.Create();
                    LvsAjax.StoleData( "customer/login", { wxcode: wxcode, apptype: apptype, chk: 1, logintype: "atoken" }, function( apiname, params, result ){
                        if( regok != undefined )
                            regok( apptype, result.access_token );
                    });
                }
                else if( tttoken != undefined && tttoken != "" && regok != undefined )
                {
                    lvscore.SetCookie( apptype == "Stem" ? "foken" : apptype + "_ken", tttoken, 1 );
                    regok( apptype, tttoken );
                }
                else{
                    if( regok != undefined )
                        regok( apptype, curtoken );
                }
            }
        };
        lvscore.InitPage = function ( elm, initparams, modules, retfunc) {
            lvscore.RegScripts( modules, function(){
                setTimeout( function(){
                    var LvsAjax = LvsData.Create();
                    lvscore.RegToken(initparams.apptype, initparams.regtype, function (apptype, token, idxid) {
                        if( apptype == undefined || apptype == "" )
                            apptype = initparams.apptype || "com";
                        initparams.apptype = apptype;
                        if( token == undefined || token == "" )
                            token = initparams.access_token;
                        else{
                            if (token != undefined && token != ""){
                                lvscore.SetCookie( apptype + "_ken", token, 1 );
                            }
                            else {
                                token = lvscore.GetCookie(apptype + "_ken");
                            }
                            initparams.access_token = token;
                        }
                        if( initparams.role == undefined || initparams.role == "" ){
                            initparams.role = lvscore.GetCookie("defrole") || "";
                            initparams.roleid = lvscore.GetCookie( "defroleid") || "0";
                            if( initparams.role == "Tch" || initparams.role == "Teacher")
                                initparams.userid=(0-initparams.roleid).toString();
                            else if( initparams.role == "Stud" )
                                initparams.userid = initparams.roleid;
                            
                         }
                         else{
                            lvscore.SetCookie("defrole", initparams.role, 1);
                            lvscore.GetCookie("defroleid", initparams.roleid, 1);
                         }
                         let tmplname = initparams.tmplname || "com.BaseTmpl";
                         for( var key in initparams ){
                            if( initparams[key].toString().indexOf ( "url." ) == 0 ){
                                initparams[key] = lvscore.GetUrlParam( initparams[key].toString().split(".")[1] );
                            }
                         }
                         if (initparams.apiname == undefined || initparams.apiname == "") {
                             if (retfunc != undefined && retfunc != "") {
                                 retfunc(token, initparams.idxid, initparams);
                             }
                         }
                         else{
                             LvsAjax.GetData(initparams.apiname, $(elm), initparams, function (apiname, params, result) {
                                 result.params = params;
                                 result.role = params.role;
                                 result.roleid = params.roleid;
                                 result.userid = params.userid;
                                 if( result.hasOwnProperty("apptype") == false )
                                    result.apptype = apptype;
                                 if (result.params.hasOwnProperty("shareurl"))
                                     result.cururl = result.params.shareurl;
                                 if (result.params.hasOwnProperty("intror"))
                                     result.intror = result.params.intror;
                                 if (retfunc != undefined)
                                     retfunc(token, (params.idxid == 0)?result.id: params.idxid, result);
                             });
                         }
                    });
                }, 600);
            });
        };
        lvscore.SetPageData = function (pagedata, oridata, orikeys) {
            if( oridata == undefined )
                return;
            if( Array.isArray( pagedata ) && Array.isArray( oridata ) ){
                for( var i = 0; i < oridata.length; i ++ ){
                    let curitem = {};
                    for( var j = 0; j < Object.keys( pagedata[0] ).length; j ++ ){
                        curitem[Object.keys(pagedata[0])[j]] =  orikeys.length > j ? lvscore.ReplaceData( orikeys[j], oridata[i] ): "";
                    }
                    if( i == 0 )
                        pagedata[0] = curitem;
                    else
                        pagedata.push( curitem );
                }
            }
            else{
                for( var i = 0; i < Object.keys(pagedata).length; i ++ ){
                    pagedata[Object.keys(pagedata)[i]] = orikeys.length > i ? lvscore.ReplaceData( orikeys[i], oridata ): "";
                }
            }
        };
        lvscore.ReplaceData = function( oristr, oridata ){
            var oriurl = oristr.split( "$" );
            var deststr = oriurl[0];
            for( var i = 1; i < oriurl.length; i ++ ){
                if( oriurl[i].indexOf( "[" ) != 0 || oriurl[i].indexOf("]") == -1 ){
                    deststr += "$" + oriurl[i];
                    continue;
                }
                let keyname = oriurl[i].substr( 1, oriurl[i].indexOf( "]" ) - 1 );
                if( keyname != "" ){
                    deststr += oridata[keyname] + oriurl[i].substr( oriurl[i].indexOf( "]" ) + 1 );
                    continue;
                }
            }
            return deststr;
        };
        lvscore.BindTab = function( pagedata, tablist ){
            if( Array.isArray( pagedata )){
                for( var i = 0; i < pagedata.length; i ++ ){
                    for( var j = 0; j < Object.keys( tablist ).length; j ++ ){
                        pagedata[i][Object.keys(tablist)[j]] = lvscore.ReplaceData( Object.values( tablist )[j], pagedata[i] );
                    }
                }
            }
            else{
                for( var i = 0; i < Object.keys( tablist ).length; i ++ ){
                    pagedata[Object.keys( tablist )[i]] = lvscore.ReplaceData( Object.values( tablist )[i], pagedata );
                }
            }
        };
        lvscore.BindTmpl = function (tmplname, container, token, idxid, curdata, onres) {
            var LvsAjax = LvsData.Create();
            if( tmplname.indexOf( "#" ) != 0)
                tmplname = "#" + tmplname;
            var tmpls = tmplname.split('.');
            if( curdata == undefined )
                curdata = {};
            curdata.ismobile = (LvsAjax.isMobile() ? 1 : 0);
            curdata.isweixin = (LvsAjax.isWeixin() ? 1 : 0);
            if (tmpls[0] == "#common" || tmpls[0] == "#compc" || tmpls[0] == "#cn" || tmpls[0] == "#cmpn") {
                var curname = "";
                var idname = "cn";
                for (var i = 1; i < tmpls.length; i++) {
                    if (curname != "")
                        curname += "/";
                    curname += tmpls[i];
                    idname += "_" + tmpls[i];
                }
                var pathname = "hpcommon";
                if (tmpls[0] == "#compc")
                    pathname = "com_pc";
                else if( tmpls[0] == "#cmpn" || tmpls[0] == "#cn" )
                    pathname = "component";
                $.get("../" + pathname + "/" + curname + ".htm" + ($(container).attr("version")==undefined?"?v=" + CmntVersion:"?v=" + $(container).attr("version")), function (tmplate) {
                    console.log( "BindTmpl", tmplname, curdata );
                    $.tmpl(tmplate, curdata).appendTo($(container));
                    $(container).find("[lvs_component]").attr("lvs_name", idname ).attr("id", "id_" + idname + "_" + (curdata.id || "0") );
                    $(container).lvsclick(token, idxid, curdata);
                    $(container).lvsformat(token, idxid, curdata, function () {
                        lvscore.GetComponent( container, token, idxid, curdata, function(){
                            if (onres != undefined)
                                onres();
                        });
                    });
                });
            }
            else {
                var curname = tmplname;
                console.log( "BindTmpl", tmplname, curdata );
                $(curname).tmpl(curdata).appendTo($(container));
                $(container).lvsclick(token, idxid, curdata);
                $(container).lvsformat(token, idxid, curdata, function () {
                    lvscore.GetComponent(container, token, idxid, curdata, function(){
                        if (onres != undefined)
                            onres();
                    });
                });
            }
        };
        lvscore.LoadTmpl = function( container, cmntname, tmplname, curdata, okfunc ){
            $(container).loadtmpl( cmntname, tmplname, curdata, okfun );
        };
        lvscore.GetComponent = function( container, token, idxid, curdata, okfunc ){
            var cpnnum = $(container).find("component").size();
            if( cpnnum == 0 && okfunc != undefined )
                okfunc();
            var curcpn = 0;
            $(container).find("component").each( function(){
                if( $(this).attr("load") != undefined && $(this).attr("load") != curdata.loadmode ){
                }
                else{
                    var compbox = $(this);
                    if( $(this).attr("apiname") != undefined && $(this).attr("apiname") != "" ){
                        var TData = LvsData.Create();
                        var getparams = { access_token: token, gettype: $(this).attr("gettype") || "Serial" };
                        if( $(this).attr("baseidx") != undefined )
                            getparams[$(this).attr("baseidx")] = $(this).attr("idxid");
                        if( $(this).attr("idxkey2") != undefined )
                            getparams[$(this).attr("idxkey2")] = $(this).attr("idxid");
                        if( $(this).attr("idxkey") != undefined )
                            getparams[$(this).attr("idxkey")] = idxid;
                        var othpars = $(this)[0].dataset;
                        for( var i = 0; i < Object.keys( othpars ).length; i ++ ){
                            getparams[Object.keys(othpars)[i]] = Object.values( othpars )[i];
                        }
                        TData.GetData( $(this).attr("apiname"), $(this), getparams, function( apiname, params, result ){
                            var basedata = ($(compbox).attr("list1") != undefined && $(compbox).attr("list1") != "") ? { list : result[$(compbox).attr("list1")], subname: $(compbox).attr("list2")} : result;
                            basedata.selref = $(compbox).attr("data-itemsel");
                            basedata.params = getparams;
                            var cpnname = $(compbox).attr("name");
                            lvscore.BindTmpl( "#" + $(compbox).attr("name"), $(compbox), token, idxid, basedata, function(){
                                curcpn ++;
                                console.log( "Ok." + cpnname, curcpn, cpnnum );
                                if( curcpn >= cpnnum && okfunc != undefined )
                                    okfunc();
                            });
                        });
                    }
                    else if( $(this).attr("lvs_prexec") != undefined && $(this).attr("lvs_prexec") != "" ){
                        var cmpndata = $(this)[0].dataset;
                        $(this)[$(this).attr("lvs_prexec")]( token, idxid, curdata, function( resdata ){
                            for( var i = 0; i < Object.keys( cmpndata ).length; i ++ ){
                                let key = Object.keys( cmpndata )[i].split(".");
                                if( key.length > 1 )
                                    resdata[key[0]][key[1]] = lvscore.ReplaceData( Object.values( cmpndata )[i], curdata[key[0]]);
                                else if( curdata[key[0]] != undefined && Array.isArray( curdata[key[0]] )){
                                    for( var n = 0; n < curdata[key[0]].length; n ++ ){
                                        resdata[key[0]][n] = lvscore.ReplaceData( Object.values( cmpndata )[i], curdata[key[0]][n] );
                                    }
                                }
                                else
                                    resdata[key[0]] = lvscore.ReplaceData( Object.values( cmpndata )[i],curdata );
                            }
                            var cpnname = $(compbox).attr("name");
                            lvscore.BindTmpl( "#" + cpnname, $(compbox).html(""), token, idxid, resdata, function(){
                                curcpn ++;
                                if( curcpn >= cpnnum && okfunc != undefined )
                                    okfunc();
                            });
                        });
                    }
                    else
                    {
                        var basedata = curdata||{};
                        if( ( $(this).attr("basedata") != undefined && $(this).attr("basedata") != "" ) ){
                            if( $(this).attr("basedata").indexOf(":") != -1 ){
                                basedata = {};
                                var datastr = $(this).attr("basedata").split(":")[1];
                                if( datastr.indexOf("[" ) == -1 )
                                    basedata[$(this).attr("basedata").split(':')[0]] = curdata[datastr];
                                else{
                                    var dataidx = parseInt( datastr.substr( datastr.indexOf("[") + 1, datastr.indexOf("]") - datastr.indexOf("[") -1 ));
                                    if( datastr.indexOf( "." ) != -1 )
                                        basedata[$(this).attr("basedata").split(':')[0]] = curdata[datastr.substr( 0, datastr.indexOf("["))][dataidx][datastr.substr(datastr.indexOf(".") + 1)];
                                    else
                                        basedata[$(this).attr("basedata").split(':')[0]] = curdata[datastr.substr( 0, datastr.indexOf("["))][dataidx];
                                }
                            }
                            else if( $(this).attr("basedata") == "$result" ){
                            }
                            else if( $(this).attr("basedata").indexOf(".") != -1 ){
                                var datakey = $(this).attr("basedata").split('.');
                                for( var i = 0; i < datakey.length; i ++ ){
                                    if( datakey[i].indexOf("[") == -1 )
                                        basedata = basedata[datakey[i]];
                                    else
                                    {
                                        console.log( "component", $(compbox).attr("name"), $(compbox).parent().html(),  basedata );
                                        let curbaseidx = parseInt(datakey[i].substr( datakey[i].indexOf("[") + 1, datakey[i].indexOf("]") - datakey[i].indexOf("[") -1 ))
                                        basedata = basedata[datakey[i].substr( 0, datakey[i].indexOf("["))][curbaseidx];
                                    }
                                }
                            }
                            else if( $(this).attr("basedata").indexOf( "[" ) == -1 ){
                                if( curdata[$(this).attr("basedata")] == undefined )
                                    curdata[$(this).attr("basedata")] = {};
                                basedata = curdata[$(this).attr("basedata")];
                            }
                            else{
                                var baseidx = parseInt($(this).attr("basedata").substr( $(this).attr("basedata").indexOf("[") + 1, $(this).attr("basedata").indexOf("]") - $(this).attr("basedata").indexOf("[") -1 ));
                                basedata = curdata[$(this).attr("basedata").substr( 0, $(this).attr("basedata").indexOf( "[" ) )][baseidx];
                            }
                        }
                        else{
                        }
                        var cmpndata = $(this)[0].dataset;
                        for( var i = 0; i < Object.keys( cmpndata ).length; i ++ ){
                            let key = Object.keys( cmpndata )[i].split(".");
                            if( key[0].indexOf( "[]" ) != -1 )
                                basedata = basedata[key[0].substr(0, key[0].indexOf("[]"))][Object.values( cmpndata )[i]];
                            else if( key.length > 1 && Array.isArray( basedata[key[0]] ) ){
                                for( var n = 0; n < basedata[key[0]].length; n ++ ){
                                    curdata[key[0]][n][key[1]] = lvscore.ReplaceData( Object.values( cmpndata )[i], basedata[key[0]][n]);
                                }
                            }
                            else if( key.length > 1 )
                                basedata[key[0]][key[1]] = lvscore.ReplaceData( Object.values( cmpndata )[i], basedata[key[0]]);
                            else if( basedata[key[0]] != undefined && Array.isArray( basedata[key[0]] )){
                                for( var n = 0; n < basedata[key[0]].length; n ++ ){
                                    basedata[key[0]][n] = lvscore.ReplaceData( Object.values( cmpndata )[i], basedata[key[0]][n] );
                                }
                            }
                            else
                                basedata[key[0]] = lvscore.ReplaceData( Object.values( cmpndata )[i],basedata );
                        }
                    
                        var cpnname = $(this).attr("name");
                        lvscore.BindTmpl( "#" + cpnname, $(this).html(""), token, idxid, basedata, function(){
                            curcpn ++;
                            console.log( "Ok." + cpnname, curcpn, cpnnum );
                            if( curcpn >= cpnnum && okfunc != undefined )
                                okfunc();
                        });
                    }
                }
            });
            $(container).find(".InnerTmpl").each(function () {
                if ($(this).attr("apiname") == undefined) {
                    lvscore.BindTmpl( "#" + $(this).attr("tmplname"), $(this), token, idxid, curdata, function(){
                    });
                }
                else {
                    var TData = LvsData.Create();
                    var dataget = { access_token: token, idxid: idxid, gettype: $(this).attr("datatype") };
                    dataget[$(this).attr("idxkey")] = idxid;
                    dataget[$(this).attr("idxkey2")] = $(this).attr("idxid");
                    var datacontainer = $(this);
                    TData.StoleData($(this).attr("apiname"), dataget, function (apiname, params, datares) {
                        lvscore.BindTmpl( "#" + $(datacontainer).attr("tmplname"), $(datacontainer), token, idxid, datares, function(){
                        });
                    });
                }
            });
        };
        lvscore.GetAppid = function( apptype ){
            var appid = { Mayi: "wx1230b3a8b6eef6ff", Xxc: "wxe7935d2c3b96ad29", Edu: "wx5ee8edcd246ee5ba", Share: "wx8d7ca3074d512d74", Hippo: "wxfa37e2111aa4589a", Stem: "wxf4f4fc77f9a2a35d", Fzstem: "wx20b7fbdd2e2834cf"};
            return appid[ apptype ];
        };
        lvscore.GetUrlParam = function (queryname) {
            var query = decodeURI(window.location.search.substr(1));
            var vars = query.split("&");
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split("=");
                if (pair[0] == queryname) {
                    return pair[1];
                }
                else if (pair[0] == "state") {
                    var sts = pair[1].split("!");
                    for (var j = 0; j < sts.length; j++) {
                        var prs = sts[j].split("*");
                        if (prs[0] == queryname)
                            return prs[1];
                    }
                }
            }
            return "";
        };
        lvscore.LvsAddRout = function( routdata ){
            if( routdata == undefined )
                return;
            routdata.isadd = 1;
            if( window.PageData.router == undefined )
                window.PageData.router = [];
            var isfind = false;
            for( var i = 0; i < window.PageData.router.length;  i ++ ){
                if( window.PageData.router[i].name == routdata.name ){
                    window.PageData.router[i] = routdata;
                    isfind = true;
                }
            }
            if( isfind == false )
                window.PageData.router.push( routdata );
        };
        lvscore.LvsRout = function( rootname, token, idxid, rootid, curdata ){
            var oripars = {};
            if( rootname.indexOf( "?" ) != -1 ){
                let parlist = rootname.substr( rootname.indexOf( "?" ) + 1 ).split('&');
                for( var i = 0; i < parlist.length; i ++ ){
                    if( parlist[i].indexOf( "=" ) != -1 ){
                        oripars[parlist[i].split('=')[0]] = parlist[i].split('=')[1];
                    }
                }
                rootname = rootname.split('?')[0];
            }
            if( rootname == "tabfresh" ){
                $(rootid).find(".active").click();
                return;
            }
            if( window.PageData == undefined || window.PageData.router == undefined )
                alert( "本页面未配置路由数据" );
            else{
                var router = {};
                for( var i = 0; i < window.PageData.router.length; i ++ ){
                    if( window.PageData.router[i].name == rootname ){
                        router = window.PageData.router[i];
                        break;
                    }
                }
                if( router.name == undefined ){
                    alert( "未配置本类型路由：" + rootname );
                }
                else{
                    if( router.isadd != 1 && router.linkurl == undefined ){
                        if( rootid == "" || rootid == undefined)
                            location.hash = "#" + rootname;
                        else
                            location.hash = "#" + rootname + "*" + rootid;
                    }
                    if( router.clickelm != undefined ){
                        $(router.clickelm).click();
                    }
                    else if( router.apiname != undefined && router.apiname != "" && router.tmplname != undefined){
                        var getparams = { access_token: token, gettype: router.gettype,...router.data, ...oripars };
                        if( router.idxkey != undefined )
                            getparams[ router.idxkey] = idxid;
                        if( router.idxkey2 != undefined )
                            getparams[ router.idxkey2] = rootid;
                        var DataEng = LvsData.Create();
                        if( router.container.indexOf( "##" ) == 0 ){
                            if( $(router.container.substr(1)).size() == 0 && $('#ListContainer').size() == 0 ){
                                alert("未配置容器（Container），本路由数据无效");
                                return;
                            }
                            if( $(router.container.substr(1)).size() == 0 && $('#ListContainer').size() > 0 ){
                                $('#ListContaier').after("<div class=\"Container\" id=\"" + router.container.substr(2) + "\" style=\"display:none\"></div>" );
                            }
                            if( router.hasOwnProperty( "apiname" ) )
                                $(router.container.substr( 1 )).html("");
                            $(router.container.substr( 1 )).lvstoggle(function(){
                                DataEng.GetData( router.apiname, $(router.container.substr(1)), getparams, function( apiname, params, result ){
                                    result.params = params;
                                    lvscore.BindTmpl( "#" + router.tmplname, $(router.container.substr(1)), token, idxid, result, function(){
                                    });
                                });
                            });
                        }
                        else{
                            var showid = "";
                            $('.Container').each(function(){
                                if( $(this).find(router.container).size() > 0 && $(this).css("display") != "none" )
                                    showid = $(this).attr("id");
                                else if( $(this).find(router.container).size() > 0 && showid == "" )
                                    showid = $(this).attr("id");
                            });
                            if( showid == "" ){
                                DataEng.GetData( router.apiname, $(router.container).html(""), getparams, function( apiname, params, result ){
                                    result.params = params;
                                    lvscore.BindTmpl( "#" + router.tmplname, $(router.container), token, idxid, result, function(){
                                    });
                                });
                            }
                            else{
                                if( router.hasOwnProperty("apiname"))
                                    $("#" + showid ).find(router.container).html("");
                                $("#" + showid ).lvstoggle(function(){
                                    DataEng.GetData( router.apiname, $("#" + showid ).find(router.container), getparams, function( apiname, params, result ){
                                        lvscore.BindTmpl( "#" + router.tmplname, $("#" + showid).find(router.container), token, idxid, result, function(){
                                        });
                                    });
                                });
                            }
                        }
                    }
                    else if( router.linkurl != undefined && router.linkurl != "" ){
                        if( router.target == "_blank" ){
                            if( isIos()){
                                $('body').append( "<a href=\"" + router.linkurl.replace("$ID", rootid).replace("$PID", idxid)  + "\" target=\"_blank\" id=\"newBlankUrl\">.</a>" );
                                $('#newBlankUrl').click();
                                $('#newBlankUrl').remove();
                            }
                            else{
                                window.open( router.linkurl.replace("$ID", rootid).replace("$PID", idxid), "_blank", "resizable,scrollbars,status,width=" + (screen.availWidth - 10) + ",height=" + (screen.availHeight - 50) );
                            }
                        }
                        else
                            location.href = router.linkurl.replace( "$ID", rootid ).replace("$PID", idxid);
                    }
                    else if( router.tmplname != undefined && router.tmplname != "" ){
                        curdata.params = oripars;
                        if( router.container.indexOf( "##" ) == 0 ){
                            if( $(router.container.substr(1)).size() == 0 && $('#ListContainer').size() == 0 ){
                                alert("未配置容器（Container），本路由数据无效");
                                return;
                            }
                            $(router.container.substr(1)).html("");
                            $(router.container.substr( 1 )).lvstoggle(function(){
                                lvscore.BindTmpl( "#" + router.tmplname, $(router.container.substr(1)), token, idxid, curdata, function(){
                                });
                            });
                        }
                        else{
                            lvscore.BindTmpl( "#" + router.tmplname, $(router.container), token, idxid, curdata, function(){
                            });
                        }
                    }
                    else
                        alert("非法的路由数据" );
                }
            }
        };
        lvscore.SetRout = function (routdata) {
        };
        lvscore.WxShare = function( shareinfo, sharetitle, sharedesc, shareimg ){
            if( shareinfo != undefined ){
                var WxShare = LvsShare.Create();
                WxShare.Share(shareinfo, sharetitle, sharedesc, shareimg, sharetitle);
            }
        };
        lvscore.SetCookie = function( c_name, c_value, expires ){
            var DataEng = LvsData.Create();
            if( DataEng.isMobile() || DataEng.isWeixin() ){
                var extdate = new Date();
                extdate.setDate( extdate.getDate() + expires );
                document.cookie = c_name + "=" + escape( c_value ) + ((expires == null) ? "": ";expires=" + extdate.toGMTString());
            }
            else
                $.cookie( c_name, c_value, {expires: expires, path: "/" });
        };
        lvscore.GetCookie = function( c_name ){
            var DataEng = LvsData.Create();
            if( DataEng.isMobile() || DataEng.isWeixin() ){
                if( document.cookie.length > 0 ){
                    var c_start = document.cookie.indexOf( c_name + "=" );
                    if( c_start != -1 ){
                        c_start = c_start + c_name.length + 1;
                        var c_end = document.cookie.indexOf( ";", c_start );
                        if( c_end == -1 )
                            c_end = document.cookie.length;
                        return unescape( document.cookie.substring( c_start, c_end ));
                    }
                }
                return "";
            }
            else
                return $.cookie( c_name );
        };
        return lvscore;
    }
};

var LvsData = {
    loadStatus: 0,
    Create: function () {
        var Data = {};
        Data.GetData = function (apiname, container, params, onsuccessret, onfail) {
            if (LvsData.loadStatus >= 0) {
                $(container).loading();
                LvsData.loadStatus = 1;
                params.ismobile = (Data.isMobile() ? 1 : 0);
                params.isweixin = (Data.isWeixin() ? 1 : 0);
                $.ajax({
                    type: "POST",
                    url: "http://tuanju.js.cn/api/" + apiname + ".aspx",
                    data: params,
                    dataType: "json",
                    success: function (result) {
                        $(container).loaded();
                        LvsData.loadStatus = 0;
                        if (result.hasOwnProperty("errorcode") && result.errorcode > 0) {
                            var mes = result.reason;
                            if (result.errorcode == 20099) {
                                if (Data.isWeixin() && Data.isMobile()) {
                                    var Lvs = LvsCore.Create();
                                    if (Lvs.GetCookie("fwxcode") == undefined || Lvs.GetCookie("fwxcode") == "") {
                                        Lvs.SetCookie("foken", "");
                                        Lvs.SetCookie("Share_ken", "");
                                        Lvs.SetCookie("Fzstem_ken", "");
                                        Lvs.SetCookie("Stem_ken", "");
                                        Lvs.SetCookie("Hippo_ken", "");
                                        Lvs.SetCookie("Xxc_ken", "");
                                        if( location.href.indexOf( "code=" ) !=-1 ){
                                            var Lvs = LvsCore.Create();
                                            var pars = Lvs.GetUrlParam( "state" ).split('!');
                                            var newloc = "";
                                            for( var i = 0; i < pars.length; i ++){
                                                if( newloc != "" )
                                                    newloc += "&";
                                                newloc += pars[i].split('*')[0] + "=" + pars[i].split('*')[1];
                                            }
                                            location.href = location.href.split('?')[0] + "?" + newloc;
                                        }
                                        else
                                            location.reload();
                                    }
                                    else {
                                        var TData = LvsData.Create();
                                        TData.StoleData("customer/login", { logintype: "atoken", wxcode: Lvs.GetCookie("fwxcode"), apptype: Lvs.GetCookie("fapptype") }, function (uapiname, uparams, uresult) {
                                            if (uresult.access_token != undefined) {
                                                Lvs.SetCookie("foken", uresult.access_token, 1);
                                                Lvs.GetCookie(uparams.apptype + "_ken", uresult.access_token, 1 );
                                                params.access_token = uresult.access_token;
                                                TData.GetData(apiname, container, params, onsuccessret);
                                            }
                                        });
                                    }
                                }
                                else if ($('[lvs_bind=ReLogin]').size() > 0)
                                    $('[lvs_bind=ReLogin]').click();
                                else if ($('[lvs_ref=GoLogout]').size() > 0)
                                    $('[lvs_ref=GoLogout]').click();
                                else if ($.cookie("loginpage") != undefined && $.cookie("loginpage") != ""){
                                    location.href = $.cookie("loginpage");
                                }
                                else if ($.cookie("fapptype") == "Stem" || $.cookie("fapptype") == "Sg") {
                                    //$('body').basedialog("", "#com.mblogin", function (curbt, curbox) {
                                    //});
                                    //$.cookie("lastpage", location.href, { expires: 1, path: "/" });
                                    //location.href = "../fstem/login.aspx?st=" + $.cookie("fapptype");
                                }
                                else {
                                    //$('body').basedialog("", "#com.login", function (curbt, curbox) {
                                    //});
                                }
                                return;
                            }
                            var tip = ErrorTip.Create();
                            tip.Show(result.reason + "(" + result.errorcode + ")");
                            if (onfail != undefined)
                                onfail( result );
                        }
                        else if (result.hasOwnProperty("foloinfo")) {
                            $('body').showdialog("#com.folo", function (curbt, curbox) {
                            }, result.foloinfo);
                        }
                        else {
                            onsuccessret(apiname, params, result);
                        }
                    },
                    error: function (result, status) {
                        $(container).loaded();
                        LvsData.loadStatus = 0;
                        var errtip = ErrorTip.Create();
                        errtip.Show(result.responseText);
                    }
                });
            }
        };
        Data.StoleData = function (apiname, params, onsuccessret, onerror) {
            params.ismobile = (Data.isMobile() ? 1 : 0);
            params.isweixin = (Data.isWeixin() ? 1 : 0);
            $.ajax({
                type: "POST",
                url: "http://tuanju.js.cn/api/" + apiname + ".aspx",
                data: params,
                dataType: "json",
                success: function (result) {
                    if (result.hasOwnProperty("errorcode") && result.errorcode > 0) {
                        if (onerror != undefined)
                            onerror(result.reason);
                    }
                    else {
                        onsuccessret(apiname, params, result);
                    }
                },
                error: function (result, status) {
                    var errtip = ErrorTip.Create();
                    errtip.Show(result.responseText);
                }
            });
        };
        Data.GetList = function (apiname, container, tmplname, params, cursor, count, onsuccessret) {
            if (LvsData.loadStatus == 0) {
                $(container).loading();
                LvsData.loadStatus = 1;
                params.cursor = cursor;
                params.count = count;
                $.ajax({
                    type: "POST",
                    url: "http://tuanju.js.cn/api/" + apiname + ".aspx",
                    data: params,
                    dataType: "json",
                    success: function (result) {
                        $(container).loaded();
                        LvsData.loadStatus = 0;
                        if (result.hasOwnProperty("errorcode") && result.errorcode > 0) {
                            var tip = ErrorTip.Create();
                            tip.Show(result.reason);
                        }
                        else {
                            result.curcursor = cursor;
                            result.ismobile = (Data.isMobile() ? 1 : 0);
                            result.isweixin = (Data.isWeixin() ? 1 : 0);
                            if (tmplname.split('.')[0] == "#common" || tmplname.split('.')[0] == "#compc") {
                                var allname = "";
                                var tmpls = tmplname.split('.');
                                for (var i = 1; i < tmpls.length; i++) {
                                    if (allname != "")
                                        allname += "/";
                                    allname += tmpls[i];
                                }
                                var pathname = "hpcommon";
                                if (tmplname.split('.')[0] == "#compc")
                                    pathname = "com_pc";
                                $.get("../" + pathname + "/" + allname + ".htm", function (tmplate) {
                                    $.tmpl(tmplate, result).appendTo($(container));
                                    $(container).find(".htmlformat").each(function () {
                                        $(this).html($(this).text());
                                    });
                                    $(container).find('[perheit]').each(function () {
                                        $(this).css("height", parseInt($(this).width()) * parseInt($(this).attr("perheit")) / 100);
                                    });
                                    if (result.hasOwnProperty("nextcursor") && result.nextcursor > 0) {
                                        var getmore = $('<div/>');
                                        $(getmore).addClass("GetMoreData").attr("id", "MoreData" + result.nextcursor).html("更多..");
                                        $(container).append(getmore);
                                        $(document).bind("scroll", function () {
                                            var viewH = $(document).height(), contentH = $(window).height(), scrollT = $(document).scrollTop();
                                            var scrollres = viewH - contentH - scrollT;
                                            if (scrollres < 80) {
                                                $(document).unbind("scroll");
                                                $('.GetMoreData').click();
                                            }
                                        });
                                        $('.GetMoreData').one("click", function () {
                                            $('#MoreData' + result.nextcursor).removeClass("GetMoreData");
                                            Data.GetList(apiname, $('#MoreData' + result.nextcursor), tmplname, params, result.nextcursor, count, onsuccessret);
                                        });
                                    }
                                    if (onsuccessret != undefined)
                                        onsuccessret(container, apiname, params, result);
                                });
                            }
                            else {
                                $(tmplname).tmpl(result).appendTo(container);
                                $(container).find(".htmlformat").each(function () {
                                    $(this).html($(this).text());
                                });
                                $(container).find('[perheit]').each(function () {
                                    $(this).css("height", parseInt($(this).width()) * parseInt($(this).attr("perheit")) / 100);
                                });
                                if (result.hasOwnProperty("nextcursor") && result.nextcursor > 0) {
                                    var getmore = $('<div/>');
                                    $(getmore).addClass("GetMoreData").attr("id", "MoreData" + result.nextcursor).html("更多..");
                                    $(container).append(getmore);
                                    $(document).bind("scroll", function () {
                                        var viewH = $(document).height(), contentH = $(window).height(), scrollT = $(document).scrollTop();
                                        var scrollres = viewH - contentH - scrollT;
                                        if (scrollres < 80) {
                                            $(document).unbind("scroll");
                                            $('.GetMoreData').click();
                                        }
                                    });
                                    $('.GetMoreData').one("click", function () {
                                        $('#MoreData' + result.nextcursor).removeClass("GetMoreData");
                                        Data.GetList(apiname, $('#MoreData' + result.nextcursor), tmplname, params, result.nextcursor, count, onsuccessret);
                                    });
                                }
                                if (onsuccessret != undefined)
                                    onsuccessret(container, apiname, params, result);
                            }
                        }
                    },
                    error: function (result, status) {
                        $(container).loaded();
                        LvsData.loadStatus = 0;
                        var errtip = ErrorTip.Create();
                        errtip.Show(result.responseText);
                    }
                });
            }
        };
        Data.CheckParams = function (container) {
            var iserr = 0;
            $(container).find("[lvs_bind]").each(function () {
                if ($(this).closest(".tabcontent").css("display") != "none") {
                    if ($(this).attr("need") > 0 && $(container).getbind($(this).attr("lvs_bind")) == "") {
                        $(this).css("border", "Red 1px solid");
                        iserr = 1;
                    }
                }
            });
            if (iserr > 0) {
                var tips = ErrorTip.Create();
                tips.Show("请注意以上内容的必须填写");
                return false;
            }
            var errshow = "";
            $(container).find("[lvs_bind]").each(function () {
                if ($(this).closest(".tabcontent").css("display") != "none") {
                    if ($(this).attr("validate") != undefined) {
                        var valres = $(this).lvsvalidate($(this).attr("validate"));
                        if (valres != "") {
                            $(this).css("border", "Red 1px solid");
                            errshow += valres + ";";
                        }
                    }
                }
            });
            if (errshow != "") {
                var tips = ErrorTip.Create();
                tips.Show(errshow);
                return false;
            }
            return true;
        };
        Data.AddCache = function( opetype, opemodule, opeidx, opedata ){
            if( window.PageData.cache == undefined )
                window.PageData.cache = [];
            var cachedata = {};
            $('body').extend(true,cachedata, opedata ); 
            window.PageData.cache.push( { opetype: opetype, opemodule: opemodule, opeidx: opeidx, opedata: cachedata} );
            if( window.PageData.cache.length > 30 )
                window.PageData.cache.splice( 0, 1 );
        };
        Data.GetCache = function( ){
            if( window.PageData.cache != undefined && window.PageData.cache.length > 0 )
                return window.PageData.cache[ window.PageData.cache.length -1 ];
            else
                return { opetype: "", opemodule: "", opeidx: -1, opedata: {}};
        };
        Data.DropCache = function(){
            if( window.PageData.cache != undefined && window.PageData.cache.length > 0 )
                window.PageData.cache.splice( window.PageData.cache.length - 1, 1 );
        };
        Data.GetById = function( oridatas, dataid ){
            for( var i = 0; i < oridatas.length; i ++ ){
                var isfind = true;
                Object.keys( dataid ).forEach( function( key ){
                    if( oridatas[i][key] != dataid[key] )
                        isfind = false;
                });
                if( isfind == true )
                    return oridatas[i];
            }
            return undefined;
        };
        Data.GetParams = function (oriparams, container, endfunc) {
            $(container).find("[lvs_bind]").each(function () {
                if ($(this).closest(".tabcontent").css("display") != "none")
                    oriparams[$(this).attr("lvs_bind")] = $(this).attr("encode") == "url" ? encodeURI($(container).getbind($(this).attr("lvs_bind"))) : $(container).getbind($(this).attr("lvs_bind"));
            });
            if (endfunc != undefined)
                endfunc(oriparams);
            return oriparams;
        };
        Data.GetDataBind = function( oridata, bindval ){
            if( bindval == undefined || bindval == "" )
                return "";
            let idxname = bindval.split('.');
            var remdata = oridata;
            for( var i = 0;i < idxname.length; i ++ ){
                if( idxname[i].indexOf("[") != -1 ){
                    let key = idxname[i].substr( 0, idxname[i].indexOf("[") );
                    let keyidx = parseInt(idxname[i].substr( idxname[i].indexOf("[") + 1, idxname[i].indexOf("]") - idxname[i].indexOf("[") - 1 ));
                    remdata = remdata[key][keyidx];
                }
                else
                    remdata = remdata[idxname[i]];
                if( remdata == undefined )
                    return undefined;
            }
            return remdata;
        };
        Data.isMobile = function(){
             var userAgentInfo = navigator.userAgent;

             var mobileAgents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];

             var mobile_flag = false;

             //根据userAgent判断是否是手机
             for (var v = 0; v < mobileAgents.length; v++) {
                 if (userAgentInfo.indexOf(mobileAgents[v]) > 0) {
                     mobile_flag = true;
                     break;
                 }
             }
             if (mobile_flag)
                 return mobile_flag;

             var screen_width = window.screen.width;
             var screen_height = window.screen.height;

             //根据屏幕分辨率判断是否是手机
             if (screen_width < 800) {
                 mobile_flag = true;
             }

             return mobile_flag;
        };
        Data.isWeixin = function(){
             var ua = navigator.userAgent.toLowerCase();
             if (ua.match(/MicroMessenger/i) == "micromessenger") {
                 return true;
             }
             return false;
        };
        return Data;
    }
};
var LvsShare = {
    Create: function () {
        var Data = {};
        Data.Share = function (shareinfo, title, desc, imgurl, sharetitle) {
            wx.config({ debug: false, appId: shareinfo.appid, timestamp: shareinfo.timestamp, nonceStr: shareinfo.nonce, signature: shareinfo.signature, jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ"] });
            wx.ready(function () {
                if (sharetitle == undefined)
                    sharetitle = title;
                wx.onMenuShareTimeline({ title: sharetitle, link: shareinfo.url, imgUrl: imgurl, success: function () { }, cancel: function () { } });
                wx.onMenuShareAppMessage({ title: title, desc: desc, link: shareinfo.url, imgUrl: imgurl, type: '', dataUrl: '', success: function () { }, cancel: function () { } });
                wx.onMenuShareQQ({ title: title, desc: desc, link: shareinfo.url, imgUrl: imgurl, success: function () { }, cancel: function () { } });
            });
            wx.error(function (mes) {
                //alert(mes);
            });
        };
        Data.MiniNavi = function (shareinfo) {
            wx.config({ debug: false, appId: shareinfo.appid, timestamp: shareinfo.timestamp, nonceStr: shareinfo.nonce, signature: shareinfo.signature, jsApiList: ["updateAppMessageShareData"], openTagList: ["wx-open-launch-weapp"] });
            wx.ready(function () {
                console.log("MiniNavi ready");
            });
            wx.error(function (mes) {
                console.log("MiniNavi Fail", mes);
            });
        };
        return Data;
    }
};

var ErrorTip = {
    Create: function () {
        var Tip = {};
        Tip.Show = function (mes, endfunc) {
            $('#divTipContainer').remove();
            var newDiv = $('<div/>');
            $(newDiv).html(mes).attr("id", 'divTipContainer').addClass("TipContainer").css({
                "position": "absolute",
                "left": 0,
                "width": "100%",
                "top": Math.max(0, (($(window).height() - 50) / 2) + $(window).scrollTop()),
                "z-index": 1901
            });
            $('body').append(newDiv);
            $(newDiv).fadeIn(200, function () {
                setTimeout(function () {
                    $('#divTipContainer').fadeOut(300, function () { $('.TipContainer').remove(); if (endfunc != undefined) endfunc(); });
                }, 2500);
            });
            $('#divTipContainer').click(function () {
                alert($(this).text());
            });
        };
        Tip.Wait = function (mes) {
            $('#divTipContainer').remove();
            var newDiv = $('<div/>');
            $(newDiv).html("<img src=\"../Image/loading_b.gif\"/>" + mes).attr("id", 'divTipContainer').addClass("TipContainer").css({
                "position": "absolute",
                "left": 0,
                "width": "100%",
                "top": Math.max(0, (($(window).height() - 50) / 2) + $(window).scrollTop()),
                "z-index": 1901
            });
            $('body').append(newDiv);
            $('#divTipContainer').fadeIn(200, function () {
            });
        };
        Tip.Stop = function () {
            $('#divTipContainer').fadeOut(100, function () { $(this).remove(); });
        }
        return Tip;
    }
};

 //事件处理
(function (jQuery) {
    jQuery.fn.extend({
        lvsclick: function ( token, idxid, resdata ) {
            var DataEng = LvsData.Create();
                $(this).find('[lvs_ref]').click(function(){
                    LvsClick( $(this), 0, token, idxid, resdata );
                });
            return this;
        }
    });
})(jQuery);

//获得组件Dom对象
(function (jQuery) {
    jQuery.fn.extend({
        selcomponent: function ( name, id ) {
            let ids = name.split( '.' );
            var idname = ids[0] + "_" + ids[1] + ( ids.length>2 ? "_" + ids[2] : "" ) + ( ids.length>3 ? "_" + ids[3] : "" );
            if( $(this).find("[lvs_name=" + idname + "]").size() == 1 )
                return $(this).find("[lvs_name=" + idname + "]");
            else if( $(this).find("[lvs_name=" + idname + "]").size() > 0 ){
                return $(this).find("#id_" + idname + "_" + id );
            }
            return $(this).find("[lvs_component=" + name + "]");
        },
        cpn: function( name, id ){
            if( $(this).find("#" + name ).size() > 0 )
                return $(this).find("#" + name );
            else{
                let ids = name.split( '.' );
                var idname = ids[0] + "_" + ids[1] + ( ids.length>2 ? "_" + ids[2] : "" ) + ( ids.length>3 ? "_" + ids[3] : "" );
                if( $(this).find("[lvs_name=" + idname + "]").size() == 1 )
                    return $(this).find("[lvs_name=" + idname + "]");
                else if( $(this).find("[lvs_name=" + idname + "]").size() > 0 ){
                    return $(this).find("#id_" + idname + "_" + id );
                }
                else if($(this).find("[lvs_component=" + idname + "]").size() == 1 )
                    return $(this).find("[lvs_component=" + idname + "]");
                else if( ids.length <= 1 )
                    return $(this).find("[lvs_component=" + name + "]");
                else
                    return $('#' + id );
            }
        },
        loadtmpl: function( cnname, tmplname, curdata, okfunc ){
            var cnlist = cnname.split('.');
            var tmplbox = $(this);
            $.get( "../component/" + cnlist[1] + "/" + cnlist[2] + ".htm?v=" + CmntVersion , function(template){
                $.tmpl(template, curdata).appendTo($(tmplbox).html(""));
                var formstr = $(tmplbox).find(tmplname).html();
                $(tmplbox).html(formstr);

                if( okfunc != undefined )
                    okfunc( );
            });
        }
    });
})(jQuery);


//HTML重新渲染格式与操作
(function($){
    $.fn.lvsformat=function(token, idxid, curdata, okfunc){
        var curpanel = $(this);
        $(this).find('[perheit]').each(function () {
            if( $(this).is( "img" ) && $(this).complete==false){
                $(this).one("load", function(){
                    $(this).css("height", parseInt($(this).width()) * parseInt($(this).attr("perheit")) / 100);
                });
                $(this).css("height", parseInt($(this).width()) * parseInt($(this).attr("perheit")) / 100);
            }
            else{
                var perheit = parseInt($(this).attr("perheit"));
                var curwid = parseInt($(this).width());
                var curheit = parseInt($(this).width()) * perheit / 100;
                $(this).css("height", curheit );
                $(this).find("[heittop]").each(function(){
                    $(this).css("margin-top", parseInt($(this).attr("heittop")) - curheit );
                }); 
            }
        });
        
        $(window).resize(function(){
            $(curpanel).find('[perheit]').each(function () {
                var perheit = parseInt($(this).attr("perheit"));
                var curwid = parseInt($(this).width());
                var curheit = parseInt($(this).width()) * perheit / 100;
                if( $(this).is( "img" ) && $(this).complete==false){
                    $(this).one("load", function(){
                        $(this).css("height", curheit);
                    });
                    $(this).css("height", curheit);
                }
                else{
                    $(this).css("height", curheit );
                    $(this).find("[heittop]").each(function(){
                        $(this).css("margin-top", parseInt($(this).attr("heittop")) - curheit );
                    }); 
                }
            });
        });
        $(this).find("[parheit]").each(function(){
            $(this).css("height", parseInt($(this).attr("parheit")) * parseInt($(this).parent().width()) / 100 );
        });
        var cmpnnum = $(this).find("[lvs_jqexec]").size();
        var cmpnexeced = 0;
        $(this).find("[lvs_jqexec]").each(function(){
            var execname = $(this).attr("lvs_jqexec");
            if( execname != undefined && execname != "" ){
                console.log( "内部方法执行", execname, curdata );
                try{
                    $(this)[execname]( token, idxid, curdata );
                }
                catch(err){
                    console.log( "方法执行错误", err );
                }
            }
            cmpnexeced ++;
            if( cmpnexeced >= cmpnnum && okfunc != undefined )
                okfunc( );
        });
        $(this).find("select").each(function(){
            var bindname = $(this).attr("lvs_bind");
            if( bindname != undefined && bindname != "" && curdata[bindname] != undefined ){
                $(this).val( curdata[bindname] );
            }
        });
        $(this).find("[winheit]").each(function(){
            $(this).css("height", parseInt($(window).width()) * parseInt($(this).attr("winheit")) / 100);
        });
        $(this).find("[flexheit]").each(function () {
            $(this).css("height", parseInt($(this).parent().find(".BaseHeight").height()) * parseInt($(this).attr("flexheit")) / 100).css("overflow", "auto");
        });
        $(this).find(".FlexBottom").each(function(){
            $(this).css("height", parseInt( $(window).height()) - parseInt( $(this).position().top ) );
        });
        $(this).find(".MarginMask").each(function(){
            $(this).css({"top": $('#' + $(this).attr("dest")).offset().top, "left": $('#' + $(this).attr("dest")).offset().left, "width": $('#' + $(this).attr("dest")).width()});
        });
        $(this).find("[type=date]").each(function(){
            if( $(this).is("input")){
                var curdate = $(this).attr("value");
                if( curdate != "" ){
                    var newdate = new Date( curdate );
                    var newmnt = newdate.getMonth() + 1;
                    var newday = newdate.getDate();
                    $(this).attr("value", newdate.getFullYear() + "-" + (newmnt < 10?"0":"") + newmnt + "-" + (newday < 10?"0":"") + newday);
                }
            }
        });
        $(this).find('[def_ref]').click();
        $(this).find('.defclick').click();
        $(this).find('.htmlformat').each(function () {
            $(this).html($(this).text());
            $(this).removeClass("htmlformat");
            $(this).lvsclick(token, idxid, "");
        });
        $(this).find(".CustName").each(function(){
            $(this).html(decodeURIComponent( $(this).text() ));
        });
        $(this).find(".Checkbox").click(function(){
            if( $(this).hasClass("Uncheck") ){
                $(this).removeClass("Uncheck").addClass("Checked");
                if( $(this).attr("idxid") == 0 )
                    $('.CheckPanel').find(".Uncheck").removeClass("Uncheck").addClass("Checked");
            }
            else{
                $(this).removeClass("Checked").addClass("Uncheck");
                if( $(this).attr("idxid") == 0 )
                    $('.CheckPanel').find(".Checked").removeClass("Checked").addClass("Uncheck");
            }
        });
        $(this).find(".Circliful").each(function () {
            $(this).easyPieChart({
                barColor: function (percent) {
                    percent /= 100;
                    return "rgb(" + Math.round(200 * (1 - percent)) + ", " + Math.round(200 * percent) + ", 0)";
                },
                trackColor: '#e2e2e2',
                scaleColor: '#dfe0e0',
                lineCap: 'butt',
                size:80,
                lineWidth: 5,
                animate: false
            });
            $(this).data('easyPieChart').update( $(this).attr("data-percent") );
            $(this).css("margin-left", (parseInt($(this).parent().width()) - 80) /2 );
        });
        $(this).find(".PicText").each(function(){
            $(this).lvspictext();
        });
        $(this).find(".PicFile").each(function(){
            $(this).lvsfile();
        });
        $(this).find(".VodFile").each(function(){
            $(this).lvsvod();
        });
        $(this).find(".WxImage").each(function(){
            $(this).wximage( token, $('#ListContainer').attr("cururl"), 1, function(){
            });
        });
        $(this).find("[lvs_elm=WxImages]").each(function(){
            $(this).wximage( token, $('#ListContainer').attr("cururl"), 1, function(){
            });
        });
        $(this).find(".AttachFile").each(function(){
            var attelm = $(this);
            $(this).lvsattach(function(curelm, src, picid){
                $(attelm).parent().find("[lvs_bind=AttachOk]").attr("attachid", picid).click();
            });
        });
        $(this).find("[lvs_elm=Percent]").each(function(){
            var maxnum = $(this).attr("max");
            var curnum = $(this).attr("num");
            var modeIdx = $(this).attr("mode");
            if( modeIdx == 2 )
                $(this).html( "<div class=\"PercentNum\"></div><div class=\"PercentProg\" style=\"height:4px;border-radius:4px;background-color:#C5CDD4;\"></div>" );
            else
                $(this).css("border", "#a1ff9c 1px solid").css("border-radius", "4px" ).css("background-image", "linear-gradient(0deg, #dffcdd 0%, #aefcaa 25%, #ffffff 100%)").css("overflow", "hidden");
            var curperc = 0;
            if( maxnum > 0 ){
                curperc = parseInt(curnum * 100 / maxnum);
                if( curperc > 100 )
                    curperc = 100;
            }
            if( maxnum == 0 || maxnum == undefined )
                curperc = "";
            if( modeIdx == 2 ){
                $(this).find(".PercentNum").html("<div style=\"font-size:10px;color:#6A79DF;width:" + ((curperc=="")?"0":curperc) + "%\">" + ((curperc=="")?"":curperc+"%") + "</div>");
                $(this).find(".PercentProg").html("<div style=\"height:4px;border-radius:4px;background-color:#6A79DF;width:" + ((curperc=="")?"0":curperc) + "%\"></div>" );
            }
            else{
                if( curperc > 50 )
                    $(this).html( "<div style=\"width:" + curperc + "%;color:White;text-align:right;font-size:9pt;background-image:linear-gradient(0deg, #0a8a04 0%, #0cba03 25%, #065901 100%)\">" + curperc + "%</div>");
                else
                    $(this).html( "<div style=\"width:" + curperc + "%;color:White;text-align:right;font-size:9pt;background-image:linear-gradient(0deg, #0a8a04 0%, #0cba03 25%, #065901 100%)\"><span style=\"float:left;color:Black\">" + curperc + "%</span></div>");
                }
        });
        $(this).find("[lvs_elm=SetPass]").each(function(){
                $(this).find('input').focus(function () {
                    $(this).closest(".InputBox").css("border", "#E96777 1px solid");
                });
                $(this).find('input').blur(function () {
                    $(this).closest(".InputBox").css("border", "#C5CDD4 1px solid");
                });
                $(this).find('[lvs_bind=SetPass]').keyup(function () {
                    var curval = $(this).val();
                    if (curval.length < 6 || curval.length > 15) {
                        $('[lvs_bind=PassError]').html("请输入6-15位长密码");
                        $('[lvs_bind=PassTip1]').attr("src", "../Image/fedu/err.png").css("display", "");
                        $('[lvs_bind=SetPassOk]').removeClass("InputButton").addClass("GreyButton");
                    }
                    else if (/^[a-zA-Z0-9]{6,15}$/.test(curval) == false) {
                        $('[lvs_bind=PassError]').html("密码不能使用特殊字符");
                        $('[lvs_bind=PassTip1]').attr("src", "../Image/fedu/err.png").css("display", "");
                        $('[lvs_bind=SetPassOk]').removeClass("InputButton").addClass("GreyButton");
                    }
                    else {
                        $('[lvs_bind=PassError]').html("");
                        $('[lvs_bind=PassTip1]').attr("src", "../Image/fedu/allok.png").css("display", "");
                    }
                });
                $(this).find('[lvs_bind=SetPass2]').keyup(function () {
                    var curval2 = $(this).val();
                    if (curval2 != $('[lvs_bind=SetPass]').val()) {
                        $('[lvs_bind=PassError]').html("确认密码和第一次输入不一致");
                        $('[lvs_bind=PassTip2]').attr("src", "../Image/fedu/err.png").css("display", "");
                        $('[lvs_bind=SetPassOk]').removeClass("InputButton").addClass("GreyButton");
                    }
                    else {
                        $('[lvs_bind=PassError]').html("");
                        $('[lvs_bind=PassTip2]').attr("src", "../Image/fedu/allok.png").css("display", "");
                        $('[lvs_bind=SetPassOk]').removeClass("GreyButton").addClass("InputButton");
                    }
                });
        });
        $(this).find(".SerialSel").click(function(){
            if( $(this).hasClass("MultSelecting") && $(this).hasClass("MultSelected" ) )
                $(this).attr("idxid", "");
            else{
                if( $(this).attr("idxserial" ) != undefined ){
                    var selbox = $(this);
                    $('body').basepanel({left:$(this).offset().left,width:200,bottom: $(this).offset().top,padding:0}, function( curbox ){
                        $(curbox).addClass("CurPanelBox");
                        var serials = $(selbox).attr("idxserial").split(',');
                        var serval = "";
                        for( var i = 0; i < serials.length; i ++ ){
                            if( serials[i].indexOf( "-" ) == -1 )
                                serval += "<div class=\"ListItem\" idxid=\"" + serials[i] + "\">" + serials[i] + "</div>";
                            else
                                serval += "<div class=\"ListItem\" idxid=\"" + serials[i].split('-')[0] + "\">" + serials[i].split('-')[1] + "</div>";
                        }
                        if( serval == "" )
                            serval += "<span class=\"txt-grey\">暂没有数据</span>";
                        $(curbox).html(serval);
                        $(curbox).find(".ListItem").click(function(){
                            $(selbox).attr("idxid", $(this).attr("idxid") + "-" + $(this).text());
                            $('body').closepanel();
                            $('body').unbind("click");
                        });
                    });
                    $('body').unbind("click");
                    $('body').bind("click", function(){
                        if( $('.CurPanelBox:hover').size() == 0 && $('.SerialSel:hover').size() == 0 ){
                            $('body').closepanel();
                            $('body').unbind("click");
                        }
                    });
                }
            }
        });
        $(this).find(".MultSelecting").click(function(){
            if( $(this).hasClass("MultSelected") )
                $(this).removeClass("MultSelected");
            else
                $(this).addClass("MultSelected");
        });
        $(this).find(".Selecting").click(function(){
            $(this).closest(".SelBox").find(".Selected").removeClass("Selected");
            $(this).addClass("Selected");
        });
        $(this).find( "[lvs_elm=Check]" ).bind("click", function(){
            if( $(this).hasClass("Uncheck") )
                $(this).removeClass("Uncheck").addClass("Checked");
            else
                $(this).removeClass("Checked").addClass("Uncheck");
        });
        $(this).find("[setval]").each(function(){
            $(this).val($(this).attr("setval"));
        });
        $(this).find(".ExcelData").each(function(){
            $(this).DataTable({ dom: 'B<"right"fl>rtip<"clear">', language: { search: "检索", zeroRecords:'没有匹配数据', bLengthChange: true , displayLength: 30, iDisplayLength: 30, aLengthMenu:[10,20,30,50,100,200], paginate:{'first':'第一页','last':'最后一页','next':'下一页','previous':'上一页'}, info:'第_PAGE_页/总_PAGES_页',infoEmpty:'没有匹配数据',lengthMenu: '显示_MENU_项数据',infoFiltered:'(过滤总_MAX_条)'}, bLengthChange:true, bFilter:true, buttons:[ {extend:'excelHtml5',title:$(this).attr("tabletitle"), exportOptions:{ columns: ':not(.nexp)', rows: ':not(.trnexp)'}},{extend:'print', title: $(this).attr("tabletitle")} ] });
            $('.buttons-excel').text("导出到EXCEL").addClass("button").addClass("bg-green");
            $('.buttons-print').text("打印").addClass("button").addClass("bg-red");
        });
        $(this).find(".DateTime").each(function(){
            var dtype = $(this).attr("datetype");
            if( dtype == undefined || dtype == "" )
                dtype = "datetime";
            var curdateval = $(this).val().split( ' ' );
            var curdate = "";
            if( curdateval[0] != "" && curdateval[0].indexOf( "-" ) != -1 && curdateval.length>1 && curdateval[1] != "")
                curdate = [ curdateval[0].split('-')[0], curdateval[0].split('-')[1], curdateval[0].split('-')[2], curdateval[1].split(':')[0], curdateval[1].split(':')[1] ];
            else if( curdateval[0] != "" && curdateval[0].indexOf('/') != -1 && curdateval.length>1 && curdateval[1] != "" )
                curdate = [ curdateval[0].split('/')[0], curdateval[0].split('/')[1], curdateval[0].split('/')[2], curdateval[1].split(':')[0], curdateval[1].split(':')[1] ];
            else if(curdateval[0] != "" && curdateval[0].indexOf('-') != -1)
                curdate = [ curdateval[0].split('-')[0], curdateval[0].split('-')[1], curdateval[0].split('-')[2] ];
            else if(curdateval[0] != "" && curdateval[0].indexOf('/') != -1)
                curdate = [ curdateval[0].split('/')[0], curdateval[0].split('/')[1], curdateval[0].split('/')[2] ];
            else
                curdate = [2020,12,10,2,2];
            //$(this).datetime( { type: "datetime", value: [2020, 12, 10, 2, 2] } );
        });
        $(this).find(".Serial").focus(function(){
            var DataEng = LvsData.Create();
            var curinp = $(this);
            var curval = $(this).val();
            if( $(this).attr("serial") != undefined && $(this).attr("serial") != "" ){
                $(this).val("加载中..." );
                var curparam = $(this).attr("serial").split( '.' );
                var apiname = "";
                if( curparam.length > 0 )
                    apiname = curparam[0];
                if( apiname == "common" ){
                    if( $(this).attr("serialdata") == undefined )
                        $(curinp).lvssel( DataEng.GetSerial( curparam[1], $(this).attr("seq") ), function(){
                        });
                    else
                        $(curinp).lvssel( DataEng.GetSerialData( $(this).attr("serialdata"), "" ), function(){
                        });
                }
                else
                {
                    DataEng.StoleData( apiname, { access_token: token, idxid: $(this).attr("serialidx"), idxdata: $(curpanel).find('.' + $(this).attr("idxbind")).attr("idxid"), gettype: curparam[1]}, function( apiname, params, result ){
                        $(curinp).val( curval );
                        var sels = "";
                        sels += "<div style=\"text-align:right\"><a class=\"CloseSelItemBox\"><img width=\"24px\" height=\"24px\" src=\"../Image/close.png\"/></a></div>";
                        for( var i = 0; i < result.list.length; i ++ ){
                            sels += "<div class=\"SelItem" + ((result.list[i].hasOwnProperty( "sub" ) && result.list[i].sub.length>0) ? " SelSub":"") + "\" dataidx=\"" + i + "\" idxid=\"" + result.list[i].id + "\">" + result.list[i].sname + ((result.list[i].hasOwnProperty("sub") && result.list[i].sub.length>0) ? " >":"") + "</div>";
                        }
                        if( result.list.length == 0)
                            sels += "<div><span class=\"txt-grey\">没有找到数据</span></div>";
                        else
                        {
                            var adiv = $('<div/>');
                            $(adiv).css({"position":"absolute","left":$(curinp).position().left, "top":parseInt($(curinp).position().top)+parseInt($(curinp).height()) + 5,"z-index": 1902}).html( sels );
                            $(curinp).parent().append( $(adiv) );
                        }
                        $(adiv).addClass("SelItemBox").find(".SelItem").click(function(){
                            $(".ClickItem").removeClass("ClickItem" );
                            $(this).addClass("ClickItem");
                            if( $(this).hasClass("SelSub") ){
                                $(curinp).val( $(this).text() );
                                $(this).closest( ".SelItemBox" ).subsel( token, curinp, result.list[$(this).attr("dataidx")].sub );
                            }
                            else
                            {
                                $(curinp).attr("idxid", $(this).attr("idxid")).val( $(this).text() );
                                $('.SubItemBox').remove();
                                $('.SelItemBox').remove();
                            }
                        });
                        $(adiv).find(".SelSub").hover( function(){
                            if( $(this).parent().find(".ClickItem").size() == 0 ){
                                $(curinp).val($(this).text());
                                $(this).closest(".SelItemBox").subsel( token, curinp, result.list[$(this).attr("dataidx")].sub );
                            }
                        });
                        $(adiv).find(".CloseSelItemBox").click(function(){
                            $('.SubItemBox').remove();
                            $('.SelItemBox').remove();
                        });
                    });
                }
            }
            $(this).blur(function(){
                if( $('.SubItem:hover').size() == 0 && $('.SelItem:hover').size() == 0 ){
                    $('.SubItemBox').remove();
                    $('.SelItemBox').remove();
                }
            });
        });
        $(this).find(".Serial").keyup(function(){
            var curinp = $(this).val();
            $(this).attr("idxid", "null");
            $('.SubItemBox').remove();
            var itemnum = 0;
            $('.SelItemBox').find(".SelItem").each(function(){
                if( $(this).text().indexOf( curinp ) == -1 )
                    $(this).css("display", "none");
                else{
                    $(this).css("display", "");
                    itemnum ++;
                }
            });
            if( itemnum == 0 )
                $('.SelItemBox').css("display", "none");
            else {
                $('.SelItemBox').css("display", "")
            }
        });
        if( okfunc != undefined && cmpnnum == 0 )
            okfunc();
        return this;
    },
    $.fn.subsel = function(token, curinp, subdata){
        if( $('.SubItemBox:hover').size() == 0 )
        {
            $('.SubItemBox').remove();
            var subs = "";
            for( var j = 0; j < subdata.length; j ++){
                subs += "<div class=\"SubItem\" idxid=\"" + subdata[j].id + "\">" + subdata[j].sname + "</div>";
            }
            var subdiv = $('<div/>');
            $(subdiv).css({"position":"absolute", "left":$(this).offset().left + $(this).width(), "top": parseInt($(".SelItem:hover").offset().top), "z-index":1902}).html(subs);
            $('body').append($(subdiv));
            $(subdiv).addClass("SubItemBox").find('.SubItem').click(function(){
                $(curinp).attr("idxid", $(this).attr("idxid")).val( $(curinp).val() + $(this).text() );
                $('body').animate( { scrollTop: $(curinp).offset().top }, 500 );
                $('.SubItemBox').remove();
                $('.SelItemBox').remove();
            });
        }
    }
})(jQuery);

//场景切换插件
(function($){
    $.fn.lvstoggle=function(okfunc, curdata){
        var curcontainer = "ListContainer";
        $(this).parent().find('.Container').each(function(){
            if( $(this).css("display") != "none")
                curcontainer = $(this).attr("id");
        });
        var newcontainer = $(this);
        if( $(newcontainer).attr("apiname" ) != undefined && $(newcontainer).attr("apiname" ) != "" )
            $(newcontainer).html("");
        $(this).parent().find("#" + curcontainer).fadeOut( 500, function(){
            $(newcontainer).fadeIn( 500, function(){
                if( $(newcontainer).attr("apiname" ) != undefined ){
                    var DataEng = LvsData.Create();
                    var dataparams = { access_token: curdata.token, gettype: $(newcontainer).attr("gettype")};
                    if( $(newcontainer).attr("idxkey") != undefined )
                        dataparams[$(newcontainer).attr("idxkey")] = curdata.idxid;
                    if( $(newcontainer).attr("idxkey2") != undefined )
                        dataparams[$(newcontainer).attr("idxkey2")] = $(newcontainer).attr("idxid");
                    var dataext = $(newcontainer)[0].dataset;
                    for( var i = 0; i < Object.keys( dataext).length; i ++ ){
                        dataparams[Object.keys(dataext)[i]] = Object.values( dataext )[i];
                    }
                    DataEng.GetData($(newcontainer).attr("apiname"), $(newcontainer).html(""), dataparams, function( apiname, params, result ){
                        var Lvs = LvsCore.Create();
                        Lvs.BindTmpl( "#" + $(newcontainer).attr("tmplname"), $(newcontainer), curdata.token, curdata.idxid, result, function(){
                        });
                    });
                }
                $("html,body").animate({scrollTop:0},100);
                if( okfunc != undefined )
                    okfunc();
            });
        });
        return $(this);
    }
})(jQuery);
//表单验证插件
(function($){
    $.fn.lvsvalidate=function(valtype){
        if( valtype == "mobile" ){
            var mblno = $(this).val();
            var myreg=myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(17[0-9]{1})|(19[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
            if(mblno != "" && mblno.length !=11)
                return "请输入有效的手机号码！";
            else if(mblno != "" && !myreg.test(mblno))
                return "请输入有效的手机号码！";
            else
                return "";
        }
        else if( valtype == "email"){
            var mailaddr = $(this).val();
            var mailreg = /^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
            if( mailaddr != "" && !mailreg.test( mailaddr ) )
                return "请输入有效的邮箱地址";
            else
                return "";
        }
        return "";
    },
    $.fn.lvscheckinp = function(){
        var isfinish = true;
        var formbox = $(this);
        $(formbox).find('[need]').each(function(){
            if( $(formbox).getbind($(this).attr("lvs_bind")) == "" ){
                $(this).css("border", "Red 1px solid" );
                $(this).after("<span class=\"ErrorTipInfo\">请输入对应的内容</span>");
                isfinish = false;
            }
        });
        $(formbox).find('[maxlen]').each(function(){
            if( $(this).val().length > $(this).attr("maxlen") ){
                $(this).val("border", "Orange 1px solid" );
                $(this).after("<span class=\"ErrorTipInfo\">超过了要求的长度：" + $(this).attr("maxlen") + "</span>");
                isfinish = false;
            }
        });
        $(formbox).find('[max]').each(function(){
            if( parseInt($(this).val()) > parseInt($(this).attr("max")) ){
                $(this).val("border", "Orange 1px solid" );
                $(this).after("<span class=\"ErrorTipInfo\">超过了最大值：" + $(this).attr("max") + "</span>");
                isfinish = false;
            }
        });
        $(formbox).find('[min]').each(function(){
            if( parseInt($(this).val()) < parseInt($(this).attr("min")) ){
                $(this).val("border", "Orange 1px solid" );
                $(this).after("<span class=\"ErrorTipInfo\">低于最小值：" + $(this).attr("min") + "</span>");
                isfinish = false;
            }
        });
        return isfinish;
    }
})(jQuery);

//加载器插件
(function (jQuery) {
    jQuery.fn.extend({
        loading: function () {
            $('#divLoadContainer').remove();
            var newDiv = $('<div/>');
            $(newDiv).html("<img src=\"../Image/loading6.gif\"/>请稍候...").attr("id", 'divLoadContainer').css({
                "position": "fixed",
                "bottom": 60,
                "left": 0,
                "width": "100%",
                "background-color": "White",
                "z-index": 1901
            });
            $('body').append(newDiv);
            if ($(this).is('a'))
                $(this).attr("oldval", $(this).text()).attr("disable", "true").text("提交中");
            else
                $(this).html("加载中...");
            return this;
        },
        loaded: function () {
            $('#divLoadContainer').remove();
            if ($(this).is('a'))
                $(this).attr("disable", "false").text($(this).attr("oldval"));
            else
                $(this).html("");
            return this;
        }
    });
})(jQuery);

//手指滑动事件
(function (jQuery) {
    jQuery.fn.extend({
        lvsswipe: function( leftfunc, rightfunc, upfunc, downfunc ){
            var swipebox = $(this);
            $(this).bind("touchstart", function( e ){
                event.preventDefault();
                e = e.originalEvent.touches[0];
                var begx = e.pageX;
                var begy = e.pageY;
                $(this).bind("touchend", function( e ){
                    var telm = e.target;
                    e = e.originalEvent.changedTouches[0];
                    if( begx - e.pageX > 50 && leftfunc != undefined)
                        leftfunc();
                    else if( e.pageX - begx > 50 && rightfunc != undefined )
                        rightfunc();
                    else if( begy - e.pageY >50 && upfunc != undefined )
                        upfunc();
                    else if( e.pageY - begy > 50 && downfunc != undefined )
                        downfunc();
                    else{
                        if( $(telm).attr("lvs_ref") != undefined ){
                            $(telm).click();
                        }
                    }
                    $(this).unbind("touchend");
                });
            });
            return this;
        },
        swipeleft: function ( okfunc) {
            $(this).bind("touchstart", function( e ){
                event.preventDefault();
                e = e.originalEvent.touches[0];
                var begx = e.pageX;
                $(this).bind("touchend", function( e ){
                    e = e.originalEvent.changedTouches[0];
                    if( begx - e.pageX > 50 && okfunc != undefined)
                        okfunc();
                    $(this).unbind("touchend");
                });
            });
            return this;
        },
        swiperight: function ( okfunc) {
            $(this).bind("touchstart", function( e ){
                event.preventDefault();
                e = e.originalEvent.touches[0];
                var begx = e.pageX;
                $(this).bind("touchend", function( e ){
                    e = e.originalEvent.changedTouches[0];
                    if( e.pageX - begx  > 50 && okfunc != undefined)
                        okfunc();
                    $(this).unbind("touchend");
                });
            });
            return this;
        },
        swipeup: function ( okfunc) {
            $(this).bind("touchstart", function( e ){
                event.preventDefault();
                e = e.originalEvent.touches[0];
                var begy = e.pageY;
                $(this).bind("touchend", function( e ){
                    e = e.originalEvent.changedTouches[0];
                    if( begy - e.pageY  > 50 && okfunc != undefined)
                        okfunc();
                    $(this).unbind("touchend");
                });
            });
            return this;
        },
        swipedown: function ( okfunc) {
            $(this).bind("touchstart", function( e ){
                event.preventDefault();
                e = e.originalEvent.touches[0];
                var begy = e.pageY;
                $(this).bind("touchend", function( e ){
                    e = e.originalEvent.changedTouches[0];
                    if(  e.pageY - begy > 50 && okfunc != undefined)
                        okfunc();
                    $(this).unbind("touchend");
                });
            });
            return this;
        }
    });
})(jQuery);


function LvsClick(elm, showelm, token, idxid, resdata) {
     var tglpars = $(elm).attr("lvs_ref").split('.');
     if (tglpars[0] == "toggle") {
         $('#' + tglpars[1] + 'Container').lvstoggle(function () {
             $(this).find("[lvs_ref]").attr("idxid", $(elm).attr("idxid"));
         }, { token: token, idxid:idxid});
     }
     else if( tglpars[0] == "router" ){
        var Lvs = LvsCore.Create();
        Lvs.LvsRout( tglpars[1], token, idxid, $(elm).attr("idxid"));
     }
     else if( tglpars[0] == "baserouter" ){
        $('#ListContainer').lvstoggle(function(){
            var Lvs = LvsCore.Create();
            Lvs.LvsRout( tglpars[1], token, idxid, $(elm).attr("idxid"));
        });
     }
     else if (tglpars[0] == "data") {
         var DataEng = LvsData.Create();
         var dataparams = { access_token: token, id: idxid, gettype: tglpars[1] + ((tglpars.length > 2) ? "." + tglpars[2] : "") };
         if ($(elm).attr("idxkey") != undefined)
             dataparams[$(elm).attr("idxkey")] = idxid;
         if ($(elm).attr("idxkey2") != undefined)
             dataparams[$(elm).attr("idxkey2")] = $(elm).attr("idxid");
         DataEng.GetData($(elm).attr("apiname"), $("[lvs_elm=" + $(elm).attr("datares") + "]").html(""), dataparams, function (apiname, params, result) {
            var Lvs = LvsCore.Create();
             Lvs.BindTmpl("#" + $(elm).attr("tmplname"), $("[lvs_elm=" + $(elm).attr("datares") + "]"), token, idxid, result, function () {
             });
         });
     }
     else if (tglpars[0] == "datatgl") {
     $('#UpdateContainer').html("").lvstoggle(function () {
         var DataEng = LvsData.Create();
         var getparams = { access_token: token, id: idxid, projid: $(elm).attr("projid"), idxid: $(elm).attr("idxid"), gettype: ($(elm).attr("datatype") != undefined ? $(elm).attr("datatype") : $(elm).attr("gettype")) };
         if ($(elm).attr("idxkey") != undefined)
             getparams[$(elm).attr("idxkey")] = idxid;
         if ($(elm).attr("idxkey2") != undefined)
             getparams[$(elm).attr("idxkey2")] = $(elm).attr("idxid");
         DataEng.GetData($(elm).attr("apiname"), $('#UpdateContainer'), getparams, function (apiname, params, result) {
             var Lvs = LvsCore.Create();
             Lvs.BindTmpl("#" + $(elm).attr("tmplname"), $('#UpdateContainer'), token, idxid, result, function () {
             });
         });
     });
     }
     else if( tglpars[0] == "dataset" ){
        var getparams = { access_token: token, idxid: idxid, opetype: $(elm).attr("opetype") };
        var DataEng = LvsData.Create();
         if ($(elm).attr("idxkey") != undefined)
             getparams[$(elm).attr("idxkey")] = idxid;
         if ($(elm).attr("idxkey2") != undefined)
             getparams[$(elm).attr("idxkey2")] = $(elm).attr("idxid");
        if( DataEng.CheckParams( $(elm).closest(".Container") ) == false )
            return;
        DataEng.GetData( $(elm).attr("apiname"), $(elm), DataEng.GetParams( getparams, $(elm).closest(".Container")), function( apiname, params, result ){
            if( $(elm).attr("retmode" ) == "reload" )
                location.reload();
            else if( $(elm).attr("retmode") == "tipstgl" ){
                var tips = ErrorTip.Create();
                tips.Show( $(elm).attr("tips"), function(){
                    $('#ListContainer').lvstoggle(function(){
                    });
                });
            }
            else if( $(elm).attr("retmode") == "tipsreload"){
                var tips = ErrorTip.Create();
                tips.Show( $(elm).attr("tips"), function(){
                    location.reload();
                });
            }
            else{
                location.href = $(elm).attr("retmode").replace("$ID", result.id);
            }
        });
     }
     else if (tglpars[0] == "wx") {
         wx.miniProgram.navigateTo({ url: '/' + tglpars[1] });
     }
     else if (tglpars[0] == "dlgsel") {
         $('body').showdialog("#" + tglpars[1] + "Form", function (curbt, curbox) {
             $(elm).attr("idxid", $(curbt).attr("idxid"));
             if( $(elm).is( "input" ) )
                 $(elm).attr("idxname", $(curbt).attr("idxname")).val($(curbt).attr("idxname"));
             else
                 $(elm).attr("idxname", $(curbt).attr("idxname")).html($(curbt).attr("idxname"));
             $('body').closeshowdialog();
         }, { token: token, idxid: idxid });
     }
     else if (tglpars[0] == "dialog") {
         var DataEng = LvsData.Create();
         if ($(elm).attr("tmplname") == undefined) {
            if( DataEng.isMobile() ){
                $('body').showdialog("#" + tglpars[1] + "Form", function (curbt, curbox) {
                    DialogOk( curbt, curbox, token, idxid, $(elm) );
                }, { token: token, idxid: idxid });
             }
             else{
                $('body').basedialog(token, idxid, "#" + tglpars[1] + "Form", function (curbt, curbox) {
                    DialogOk( curbt, curbox, token, idxid, $(elm) );
                });
             }
         }
         else {
             var getparams = { access_token: token, gettype: $(elm).attr("datatype") };
             getparams[$(elm).attr("idxkey")] = idxid;
             getparams[$(elm).attr("idxkey2")] = $(elm).attr("idxid");
             DataEng.GetData($(elm).attr("apiname"), $('#OperateForm').html(""), getparams, function (apiname, params, result) {
                 $('#' + $(elm).attr("tmplname")).tmpl(result).appendTo($('#OperateForm'));
                 if( DataEng.isMobile() ){
                    $('body').showdialog( "#OperateForm", function( curbt, curbox ){
                        DialogOk( curbt, curbox, token, idxid, $(elm) );
                     }, { token: token, idxid: idxid });
                 }
                 else{
                    $('body').basedialog( token, idxid, "#OperateForm", function( curbt, curbox ){
                        DialogOk( curbt, curbox, token, idxid, $(elm) );
                    });
                 }
             });
         }
     }
     else if (tglpars[0] == "help") {
         var helpnum = $('[helpidx]').size();
         if (helpnum > 0) {
             var curhelpidx = 0;
             if ($('#newSelectPanel').size() > 0)
                 $('#newSelectPanel').remove();
             if ($('#overlayBack').size() > 0)
                 $('#overlayBack').remove();
             var background = $('<div/>');
             var avalwid = $(this).width();
             var opa = ".8";
             $(background).attr("id", "overlayBack").animate({ 'opacity': opa }, 500).css({
                 'width': avalwid, 'height': $(document).height(), 'position': 'absolute', 'background-color': '#aaaaaa', 'left': 0, 'top': 0, 'z-index': 2010
             });
             $('body').append(background);
             var stepbutton = $('<div/>');
             $(stepbutton).html("<a class=\"button bg-green GetNextItem\" addidx=\"-1\">上一项</a>&nbsp;<a class=\"button bg-green GetNextItem DefNextItem\" addidx=\"1\">下一项</a>");
             $(stepbutton).attr("id", "newNextItem").css({ "position": "fixed", "bottom": 60, "text-align": "center", "width": "100%", "z-index": 2011 });
             $('body').append(stepbutton);
             $('.GetNextItem').click(function () {
                 $('#newHelpItem').remove();
                 $('#newHelpLink').remove();
                 curhelpidx += parseInt($(this).attr("addidx"));
                 if (curhelpidx < 1)
                     curhelpidx = helpnum;
                 if (curhelpidx > helpnum)
                     curhelpidx = 1;
                 var curitem = $('[helpidx=' + curhelpidx + ']');
                 var newitem = $(curitem).clone();
                 $(newitem).attr("id", "newHelpItem").css({ "position": "absolute", "left": $(curitem).offset().left, "top": $(curitem).offset().top, "width": $(curitem).width(), "height": $(curitem).height(), "z-index": 2011, "display": "none" });
                 $('body').append(newitem);
                 $('body,html').animate({ scrollTop: $(newitem).offset().top - 100 }, 800, "", function () {
                     $(newitem).show(300);
                     var newDiv = $('<div/>');
                     var showhtml = "<div class=\"LifeClassBox\" style=\"background-color:White\"><div class=\"LitTitle\" style=\"font-size:13px\">" + $(curitem).attr("helptitle") + "</div>";
                     if ($(curitem).attr("helppage") != undefined)
                         showhtml += "<a class=\"float-right\">详情</a>";
                     if ($(curitem).attr("helpdesc") != undefined)
                         showhtml += "<div style=\"font-size:11px;color:#828282;line-height:180%;text-align:left\">" + $(curitem).attr("helpdesc") + "</div>";
                     showhtml += "</div>";
                     $(newDiv).attr("id", "newHelpLink").html(showhtml).addClass("ShowHelpLink").css({
                         "position": "absolute",
                         "width": "45%",
                         "left": ($(curitem).offset().left + $(curitem).width() < $(window).width() / 2) ? $(curitem).offset().left + $(curitem).width() + 10 : $(curitem).offset().left - $(window).width() * 40 / 100,
                         "top": $(curitem).offset().top,
                         "z-index": 2011
                     });
                     $('body').append(newDiv);
                     if ($(curitem).attr("helppage") != undefined) {
                         $('.ShowHelpLink').click(function () {
                             location.href = $(curitem).attr("helppage");
                         });
                     }
                 });
             });
             $('.DefNextItem').click();
             $('#overlayBack').click(function () {
                 $('#overlayBack').remove();
                 $('#newNextItem').remove();
                 $('#newHelpLink').remove();
                 $('#newHelpItem').remove();
             });
         }
         else {
             alert("暂没有可以显示的在线帮助项");
         }
     }
     else if (tglpars[0] == "mulsel") {
         if ($(elm).hasClass("Selected")) {
             $(elm).removeClass("Selected");
         }
         else {
             $(elm).addClass("Selected");
         }
     }
     else if (tglpars[0] == "sigsel") {
         $(elm).closest(".SelBox").find(".Selected").removeClass("Selected");
         $(elm).addClass("Selected");
         $(elm).closest(".SelBox").parent().find('.SelPanel' + $(elm).closest(".SelBox").attr("lvs_bind")).css("display", "none");
         $(elm).closest(".SelBox").parent().find('[lvs_bind=' + $(elm).closest(".SelBox").attr("lvs_bind") + $(elm).attr("idxid") + ']').css("display", "");
     }
     else if( tglpars[0] == "switch"){
        if( $(elm).hasClass("PowerOn"))
        {
            $(elm).removeClass("PowerOn").addClass("PowerOff");
            $('[elm_bind=' + $(elm).attr("lvs_bind") + ']').hide(300);
        }
        else{
            $(elm).removeClass("PowerOff").addClass("PowerOn");
            $('[elm_bind=' + $(elm).attr("lvs_bind") + ']').show(300);
        }
     }
     else if (tglpars[0] == "more") {
         if ($(elm).attr("ismore") == 0 || $(elm).attr("ismore") == undefined) {
             if($(elm).attr("destelm") != undefined ){
                $('[lvs_elm=' + $(elm).attr("destelm") + ']').fadeIn(500, function () { $(elm).attr("ismore", 1);  });
             }
             else{
                $(elm).parent().find(".MoreBox").fadeIn(500, function () { $(elm).attr("ismore", 1);  });
             }
             var tglname = $(elm).attr("togglename");
             if( tglname != undefined )
                $(elm).attr("togglename", $(elm).text()).text( tglname );
         }
         else {
             if($(elm).attr("destelm") != undefined ){
                $('[lvs_elm=' + $(elm).attr("destelm") + ']').fadeOut(300, function () { $(elm).attr("ismore", 0); });
             }
             else
                 $(elm).parent().find(".MoreBox").fadeOut(300, function () { $(elm).attr("ismore", 0); });
             var tglname = $(elm).attr("togglename");
             if( tglname != undefined )
                $(elm).attr("togglename", $(elm).text()).text( tglname );
         }
     }
     else if( tglpars[0] == "tag" ){
        if( tglpars[1] == "sel"){
            if( $(elm).attr("dest1") != undefined )
                $('[lvs_bind=' + $(elm).attr("dest1") + ']').val( $(elm).attr("val1"));
            if( $(elm).attr("dest2") != undefined )
                $('[lvs_bind=' + $(elm).attr("dest2") + ']').val( $(elm).attr("val2"));
        }
     }
     else if( tglpars[0] == "grant" ){
        var DataEng = LvsData.Create();
        DataEng.StoleData("common/remark_set", { access_token: token, opetype: "Grant", idxtype: $(elm).attr("idxtype"), idxid: $(elm).attr("idxid") }, function( apiname, params, result ){
        });
     }
     else if (tglpars[0] == "expand") {
         if ($(elm).hasClass("Expanding")) {
             $(elm).removeClass("Expanding").addClass("Expanded");
             $(elm).closest(".ExpBox").find(".ExpListBody").css("display", "");
         }
         else {
             $(elm).removeClass("Expanded").addClass("Expanding");
             $(elm).closest(".ExpBox").find(".ExpListBody").css("display", "none");
         }
     }
     else if (tglpars[0] == "expsel") {
         $(elm).parent().find(".expbody").css("display", "").find(".Selecting").one("click", function () {
             $(this).closest(".expbody").find(".Selected").removeClass("Selected");
             $(this).addClass("Selected");
             $(elm).val($(this).text()).attr("idxid", $(this).attr("idxid")).attr("selid", $(this).attr("idxid"));
             $(elm).parent().find(".expbody").css("display", "none");
         });
     }
     else if (tglpars[0] == "closefoot") {
         $('.FootContainer').hide(300).css("display", "none");
     }
     else if (tglpars[0] == "page") {
         $('#divMainInfo').html("");
         var DataEng = LvsData.Create();
         DataEng.GetData("edu/fsproj_list", $('#divMainInfo'), { access_token: token, projid: idxid, pageid: $(elm).attr("idxid"), gettype: "Proj.Page" }, function (apiname, params, result) {
             $('#divMainInfo').html(result.desc);
         });
     }
     else if (tglpars[0] == "share") {
         if ($('#newSelectPanel').size() > 0) {
             $('#newSelectPanel').remove();
             $('#overlayBack').remove();
         }
         var background = $('<div/>');
         var opa = ".8";
         $(background).attr("id", "overlayBack").animate({ 'opacity': opa }, 500).css({
             'width': "100%", 'height': $(document).height(), 'position': 'absolute', 'background-color': '#aaaaaa', 'left': $('body').offset().left, 'top': $('body').offset().top, 'z-index': 1903
         });
         var newDiv = $('<div/>');
         var dlghtml = "<div class=\"FootTitle\">请选择您的分享方式</div><div class=\"flexbox\" style=\"padding:12px 0\"><div class=\"flex1 ShareMode padding\" mode=\"poster\"><img width=\"20px\" height=\"20px\" src=\"../Image/poster_ico.png\"/><br/>专属海报</div><div class=\"flex1 ShareMode padding\" mode=\"weixin\"><img width=\"20px\" height=\"20px\" src=\"../Image/weixin_ico.png\"/><br/>微信分享</div><div class=\"flex1 ShareMode padding\" mode=\"ercode\"><img width=\"20px\" height=\"20px\" src=\"../Image/ercode_ico.png\"/><br/>专属二维码</div><div class=\"flex1 ShareMode padding\" mode=\"link\"><img width=\"20px\" height=\"20px\" src=\"../Image/link_ico.png\"/><br/>复制链接</div></div><div class=\"FootCancel\">取消操作</div>";
         $(newDiv).html(dlghtml).addClass("FootDialog").attr("id", 'newSelectPanel').css({
             "position": "fixed",
             "left": 0,
             "bottom": -200,
             "width": "100%",
             "z-index": 1904
         });
         //alert($(elm).position().left + "-" + $(elm).position().top + "-" + $(elm).height());
         $('body').append(newDiv).find("#newSelectPanel");
         $('#newSelectPanel').animate({ bottom: ($('.FootMenu').size() > 0 ? $('.FootMenu').height() : 0) }, 500, "", function () {
             $('body').append(background);
             $(background).click(function () {
                 $(this).remove();
                 $('#newSelectPanel').remove();
             });
             $('.FootCancel').click(function () {
                 $('#overlayBack').remove();
                 $('#newSelectPanel').remove();
             });
             $(this).find(".ShareMode").click(function () {
                 if ($(this).attr("mode") == "poster") {
                     var DataEng = LvsData.Create();
                     DataEng.GetData("mayi/matrl_list", $('.CurElm'), { access_token: token, matrltype: tglpars[1], idxid: idxid, url: $('#ListContainer').attr("cururl"), gettype: "Poster" }, function (apiname, params, result) {
                         $('#newSelectPanel').css("width", "72%").css("margin-left", "14%").html("请长按并复制图片到相册后分享<br/><img width=\"100%\" src=\"" + result.posterimg + "\"/>");
                     });
                 }
                 else if ($(this).attr("mode") == "weixin") {
                     $('body').showdialog("ShareForm", function () {
                     });
                 }
                 else if ($(this).attr("mode") == "ercode") {
                     var DataEng = LvsData.Create();
                     DataEng.GetData("mayi/matrl_list", $('.CurElm'), { access_token: token, matrltype: tglpars[1], idxid: idxid, url: $('#ListContainer').attr("cururl"), gettype: "ShareCode" }, function (apiname, params, result) {
                         $('#newSelectPanel').html("请长按并复制图片到相册<br/><img width=\"100%\" src=\"" + result.ercodeimg + "\"/>");
                     });
                 }
                 else if ($(this).attr("mode") == "link") {
                     $('#newSelectPanel').html("<input type=\"text\" id=\"CopyText\" value=\"" + $('#ListContainer').attr("cururl") + "\"/>");
                     $('#CopyText').focus();
                     $('#CopyText').select();
                     document.execCommand("Copy");
                     $(background).remove();
                     $('#newSelectPanel').remove();
                     var tips = ErrorTip.Create();
                     tips.Show("链接复制到粘贴板成功");
                 }
             });
         });
     }
     else if (tglpars[0] == "edit") {
         $('.EditOk').css("display", "");
         if( tglpars[1] == "form" ){
                var bindbox = $(elm);
                var formdata = { token: token, idxid: idxid, idxkey: $(elm).attr("lvs_bind"), idxval: $(elm).parent().getbind($(elm).attr("lvs_bind")), idxname: $(elm).attr("idxname"), idxtype: $(elm).attr("idxtype"), idxserial: $(elm).attr("idxserial") };
                $('body').formdialog( formdata, function(curbt, curbox){
                    var DataEng = LvsData.Create();
                    var updparams = { access_token: token, opetype: $(elm).attr("opetype"), updval: $(curbox).getbind(formdata.idxkey) };
                    updparams[$(elm).attr("idxkey")] = idxid;
                    if( $(elm).attr("idxkey2") != undefined )
                        updparams[$(elm).attr("idxkey2")] = $(elm).attr("idxid");
                    DataEng.GetData($(elm).attr("apiname"), $(curbt), updparams, function( apiname, params, result ){
                        $('body').closedialog();
                        var setdata = {};
                        setdata[ formdata.idxkey ] = params.updval;
                        $(elm).parent().SetData( formdata, setdata );
                    });
                });
         }
         else if (tglpars[1] == "text") {
             $(elm).attr("contentEditable", "true").addClass("EditDiv").focus();
         }
         else if (tglpars[1] == "img") {
             $(elm).lvsfile(function (curelm, src, picid) {
                 $(elm).attr("picid", picid).find("img").attr("src", src);
             });
         }
     }
     else if (tglpars[0] == "sel") {
         var seldata = "";
         if (tglpars[1] == "baselevel") {
             var DataEng = LvsData.Create();
             seldata = DataEng.GetSerail("levels");
         }
         else if (tglpars[1] == "common") {
             var DataEng = LvsData.Create();
             seldata = DataEng.GetSerial(tglpars[2]);
         }
         else if (tglpars[1] == "param") {
             var serparam = $(elm).attr("serialdata").split(',');
             seldata = new Array();
             for (var i = 0; i < serparam.length; i++) {
                 if (serparam[i].split(':').length > 1)
                     seldata.push({ id: serparam[i].split(':')[0], name: serparam[i].split(':')[1] });
                 else
                     seldata.push({ id: serparam[i], name: serparam[i] });
             }
         }
         $(elm).lvssel(seldata);
     }
     else if (tglpars[0] == "tab") {
         $(elm).parent().find(".active").removeClass("active");
         $(elm).addClass("active");
         if (tglpars[1] == "GetData") {
             var DataEng = LvsData.Create();
             var getparams = { access_token: token, idxid: idxid, gettype: $(elm).attr("gettype") };
             if( $(elm).attr("idxkey") != undefined )
                getparams[$(elm).attr("idxkey")] = idxid;
             if( $(elm).attr("idxkey2") != undefined )
                getparams[$(elm).attr("idxkey2")] = $(elm).attr("idxid");
             $(elm).parent().parent().find(".tabcontent").hide(300);
             var curtc = $(elm).parent().parent().find("[tabcontainer=data]");
             if( $(curtc).size() == 0 )
                curtc = $(elm).parent().parent().parent().find("[tabcontainer=data]");
             DataEng.GetData($(elm).attr("apiname"), $(curtc), getparams, function (apiname, params, result) {
                 $(curtc).html("").show( 500, function(){
                     var Lvs = LvsCore.Create();
                     if( $(elm).attr("lvs_prexec") != undefined ){
                        $(this)[$(elm).attr("lvs_prexec")]( token, idxid, result, function(newdata){
                            if( newdata )
                                result = newdata;
                        });
                        Lvs.BindTmpl("#" + $(elm).attr("tmplname"), $(curtc).html(""), token, idxid, result, function () {
                        });
                     }
                     else
                         Lvs.BindTmpl("#" + $(elm).attr("tmplname"), $(curtc).html(""), token, idxid, result, function () {
                         });
                 });
             });
         }
         else if (tglpars[1] == "SelPanel") {
             var tabcontent = $(elm).parent().parent();
             if( tabcontent.find(".tabcontent").size() == 0 )
                tabcontent = $(elm).closest(".TabBox");
             if( tabcontent.find(".tabcontent").size() == 0 )
                tabcontent = $(elm).parent().parent().parent();
             $(elm).parent().find("[lvs_ref]" ).each(function(){
                if( $(this).attr("lvs_ref") == "tab.GetData" )
                    $(tabcontent).find("[tabcontainer=data]").hide(200);
                else
                    $(tabcontent).find("[tabcontainer=" + $(this).attr("idxid") + "]").hide(200);
             });
             $(tabcontent).find('[tabcontainer=' + $(elm).attr("idxid") + ']').show(500,function(){
                if( $(elm).attr("apiname") != undefined ){
                    var DataEng = LvsData.Create();
                    var dataparams = { access_token: token, idxid: idxid, gettype: $(elm).attr("gettype") };
                    dataparams[$(elm).attr("idxkey")] = idxid;
                    dataparams[$(elm).attr("idxkey2")] = $(elm).attr("idxid");
                    DataEng.GetData( $(elm).attr("apiname"), $(this).html(""), dataparams, function( apiname, params, result ){
                        var Lvs = LvsCore.Create();
                        Lvs.BindTmpl( $(elm).attr("tmplname"), $('[tabcontainer=' + $(elm).attr("idxid") + ']'), token, idxid, result, function(){
                            $(elm).closest('.Container').animate({scrollTop: $(elm).offset().top - $(elm).closest('.Container').offset().top}, 200 );
                            $(tabcontent).find('[tabcontainer=' + $(elm).attr("idxid") + ']').find("[tabdef=1]").click();
                        });
                    });
                }
                else{
                    $(this).find("[perheit]").each(function(){
                        $(this).css("height", parseInt($(this).width()) * parseInt($(this).attr("perheit")) / 100);
                    });
                    if( $(elm).closest(".Container").size() > 0 ){
                        $(elm).closest('.Container').animate({scrollTop: $(elm).offset().top - $(elm).closest('.Container').offset().top}, 200,function(){
                            $(tabcontent).find('[tabcontainer=' + $(elm).attr("idxid") + ']').find("[tabdef=1]").click();
                        });
                    }
                    $(this).find(".tabdef").each(function(){
                        if( $(this).is("select") )
                            $(this).change();
                        else
                            $(this).click();
                    });
                    
                    if( $(this).find(".RichText").size() > 0 && window.editor == undefined ){
                        var K = window.KindEditor;
                        window.editor = K.create( '#'+ $(this).find(".RichText").attr("id"), 
                        {
                            autoHeightMode : true,
                            uploadJson : '../UploadKedit.ashx',
                            //items:['html', 'forecolor', 'hilitecolor', 'bold','italic', 'underline',  'removeformat',  'undo', 'redo', '|','justifyleft', 'justifycenter', 'justifyright', 'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'formatblock', 'fontname', 'fontsize', '|',  'image', 'multiimage','emoticons', 'link'],
                            cssPath:'../kedit/user.css'
                        });
                    }
                }
             });
         }
     }
     else if (tglpars[0] == "set" || tglpars[0] == "dlg") {
         switch (tglpars[1]) {
             case "quit":
                 $('#ListContainer').lvstoggle();
                 break;
             case "return":
                 $(elm).closest(".Container").parent().find("#ListContainer").lvstoggle();
                 break;
             case "rettab":
                 $(elm).closest(".Container").parent().find("#ListContainer").lvstoggle(function () {
                     $('MenuTab').find(".vactive").click();
                 });
                 break;
             case "close":
                 $('#newSelectPanel').remove();
                 break;
             case "reload":
                 location.reload();
                 break;
             case "edu":
                 LvsEduDirect(elm, showelm, token, idxid);
                 break;
             case "mayi":
                 LvsMayiDirect(elm, token, idxid);
                 break;
             case "em":
                 LvsEdumanClick(elm, showelm, token, idxid, resdata);
                 break;
             case "lc":
                 LvsLegclgClick(elm, showelm, token, idxid, resdata);
                 break;
             case "life":
                 LvsLifeDirect(elm, token, idxid, resdata);
                 break;
             case "ua":
                 LvsUaDirect(elm, token, idxid);
                 break;
             case "fstem":
                 LvsFstemDirect(elm, idxid, resdata);
                 break;
             case "leag":
                 LvsLeagDirect(elm, showelm, token, idxid, 0, resdata);
                 break;
             case "buk":
                 LvsBukDirect(elm, showelm, token, idxid);
                 break;
             case "class":
                 LvsClassDirect(elm, showelm, token, idxid);
                 break;
             case "min":
                 LvsMinDirect(elm, showelm, token, idxid);
                 break;
             case "oam":
                 LvsOamDirect(elm, idxid, resdata);
                 break;
             default:
                 window[tglpars[1]]( elm, token, idxid );
                 break;
         }
     }
     else if (tglpars[0] == "link") {
         location.href = lvsref.substr(5);
     }
     else {
         var param = $(elm).attr("lvs_ref").split('?');
         var urladdr = "", addpar = "t=" + token;
         var oriparam = param[1];
         urladdr = param[0];
         if ($(elm).attr("target") == "_blank") {
             var tempwindow = window.open('_blank');
             tempwindow.location = urladdr + ((param.length > 1) ? ("?" + oriparam + "&" + addpar) : "?" + addpar);
         }
         else
             location.href = urladdr + ((param.length > 1) ? ("?" + oriparam + "&" + addpar) : "?" + addpar);
     }
}

function DialogOk( curbt, curbox, token, idxid, elm ){
    var DataEng = LvsData.Create();
    if ($(curbt).attr("apiname") != undefined) {
        var curparams = { access_token: token };
        curparams["opetype"] = $(curbt).attr("opetype");
        curparams[$(curbt).attr("idxkey")] = idxid;
        curparams[$(curbt).attr("idxkey2")] = $(curbt).attr("idxid")||$(elm).attr("idxid");
        curparams[$(curbt).attr("idxname")] = $(elm).attr("idxid");
        DataEng.GetData($(curbt).attr("apiname"), $(curbt), DataEng.GetParams(curparams, $(curbox)), function (apiname, params, result) {
            if( DataEng.isMobile() )
                $('body').closeshowdialog();
            else
                $('body').closedialog();
            if( result.hasOwnProperty("tokenname") && result.hasOwnProperty("curtoken") )
                LvsCore.Create().SetCookie( result.tokenname, result.curtoken, 1 );
            if( result.hasOwnProperty("pay") ){
                var tips = ErrorTip.Create();
                var payEng = LvsPay.Create();
                payEng.WeixinPay(result.pay, tips, result.returl);
            }
            else{
                if ($(curbt).attr("retmode") == "tab") {
                    if ($('.MenuTab').find(".active").size() > 0)
                        $('.MenuTab').find(".active").click();
                    else if ($('.MenuTab').find(".vactive").size() > 0)
                        $('.MenuTab').find(".vactive").click();
                }
                else if( $(curbt).attr("retmode").indexOf("router") == 0 ){
                    var Lvs = LvsCore.Create();
                    Lvs.LvsRout( $(curbt).attr("retmode").split('.')[1], token, idxid, $(curbt).attr("idxid") || result.id);
                }
                else if ($(curbt).attr("retmode") == "reload") {
                    location.reload();
                }
                else if ($(curbt).attr("retmode") == "trremove") {
                    $(curbt).closest("tr").remove();
                }
                else if ($(curbt).attr("retmode") == "dlgtrremove") {
                    $(elm).closest("tr").remove();
                }
                else if ($(curbt).attr("retmode") == "tips") {
                    var tips = ErrorTip.Create();
                    tips.Show($(curbt).attr("tips"));
                }
                else if ($(curbt).attr("retmode") == "tipsreload") {
                    var tips = ErrorTip.Create();
                    tips.Show($(curbt).attr("tips"), function () {
                        location.reload();
                    });
                }
                else {
                    location.href = $(curbt).attr("retmode").replace("$ID", result.id).replace("$PAGEIDX", idxid );
                }
            }
        });
    }
    else {
        if( $(curbt).attr("retmode") == "selok" ){
            $(elm).attr( "idxid", $(curbt).attr("idxid")).attr("idxname", $(curbt).attr("idxname") );
        }
        if( DataEng.isMobile() )
            $('body').closeshowdialog();
        else
            $('body').closedialog();
    }
}
//对话框插件
(function (jQuery) {
    jQuery.fn.extend({
        unidialog: function( formname, formdata, okfunc ){
            var formbox = $(this);
            if( formname.indexOf( "#" ) != 0 )
                formname = "#" + formname;
            if( formname.indexOf( "#cn." ) == 0 ){
                var cnstr = formname.split('.');
                $.get( "../component/" + cnstr[1] + "/" + cnstr[2] + ".htm", function( template ){
                    if( $(formbox).find("#OperateForm").size() == 0 )
                        $(formbox).append("<div class=\"BaseForm\" id=\"OperateForm\" style=\"display:none\"></div>" );
                    $.tmpl( template, formdata.curdata ).appendTo( $(formbox).find("#OperateForm").html("") );
                    $(formbox).basedialog( formdata.token, formdata.idxid, "#OperateForm", okfunc, formdata );
                });
            }
            else{
                $(this).basedialog( formdata.token, formdata.idxid, formname, okfunc, formdata  );
                return $(this);
            }
        },
        basedialog: function (token, idxid, formname, okfunc, formdata) {
            if ($('#newSelectPanel').size() > 0)
                $('#newSelectPanel').remove();
            if($('#overlayBack').size() > 0 )
                $('#overlayBack').remove();
            var background = $('<div/>');
            var avalwid = $(this).width();
            $(background).attr("id", "overlayBack" ).animate({'opacity': '.3'}, 500).css({
                'width': avalwid, 'height': $(document).height(), 'position': 'fixed', 'background-color': '#aaaaaa', 'left': $(this).offset().left, 'top': $(this).offset().top, 'z-index': 1900
            });
            var newDiv = $('<div/>');
            var dlgtitle = "";
            var dlghtml = "";
            var dlgwidth = formdata != undefined && formdata.dlgwidth != undefined ? formdata.dlgwidth : ( $(formname).attr("dlgwidth")||80);
            dlgtitle = $(formname).attr("title");
            dlghtml = $(formname).html();
            if( dlgtitle == undefined )
                dlgtitle = "操作确认";
            var showindiv = "<div class=\"DialogBox\"><div class=\"HeadTitle\">" + dlgtitle;
            if( formdata == undefined || formdata.closing > 0 )
                showindiv += "<a href=\"javascript:;\" style=\"font-size:12pt;float:right\" id=\"btClosePanel\"><img width=\"24px\" heigh=\"24px\" style=\"margin-right:5px\" src=\"../Image/close.png\"/></a>";
            showindiv += "</div>";
            showindiv += "<div class=\"BaseBody\"><div class=\"DialogBodyInfo\">" + dlghtml + "</div></div>";
            showindiv += "<div class=\"Foot\"></div></div>";
            var scrolltop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
            $(newDiv).html(showindiv).attr("id", 'newSelectPanel').css({
                "position": "absolute",
                "left": $(this).offset().left + avalwid * (100-dlgwidth) / 2 / 100,
                "top": scrolltop + 100,
                "width": avalwid * dlgwidth / 100,
                "z-index": 1901
            });
            //alert($(elm).position().left + "-" + $(elm).position().top + "-" + $(elm).height());
            $(this).append(newDiv).find( "#newSelectPanel" ).hide();
            $(newDiv).fadeIn(300, function () {
            });
            $(this).append(background);
            var keyidx = idxid;
            if( formdata != undefined )
                keyidx = formdata.idxid;
            $('#newSelectPanel').find(".DialogBox").lvsformat( token, keyidx, formdata, function(){
               
            });
            $('#newSelectPanel').find(".DialogBox").find(".RichEdit").each(function(){
                $(this).loadcomponent( "cn.form.richedit", token, idxid, {text:$(this).attr("richdata")},function(){
                });
            });
            var Lvs = LvsCore.Create();
            if( !formdata )
                formdata = {};
            formdata.loadmode = "dialog";
            Lvs.GetComponent( $(newDiv), token, idxid, formdata, function(){
            }); 
            $('#newSelectPanel').find(".DialogBox").find("[component]").each(function(){
                $(this).loadcomponent( $(this).attr("component"), token, idxid, formdata.data || formdata.formdata,function(){
                });
            });
            $('#newSelectPanel').find(".DialogBox").lvsclick( token, keyidx, formdata );
            $('#btClosePanel').click(function () {
                $('#newSelectPanel').remove();
                $('#overlayBack').remove();
                $('body').trigger("dialogclose",[]);
            });
            $('#overlayBack').click(function () {
                if( formdata.noclose == 1 ){
                }
                else{
                    $('#newSelectPanel').remove();
                    $('#overlayBack').remove();
                    $('body').trigger("dialogclose",[]);
                }
            });
            $('#newSelectPanel').find(".DialogBox").on("click", ".FormCancel", function(){
                $('#newSelectPanel').remove();
                $('#overlayBack').remove();
                $('body').trigger("dialogclose",[]);
            });
            $('#newSelectPanel').find(".DialogBox").on("click", ".FormOk", function(){
                var isformok = true;
                if( $(this).attr("opetype") && $(this).attr("opetype") != "AddOk" )
                    isformok = false;
                var isfinish = isformok ? $('#newSelectPanel').find(".DialogBox").lvscheckinp() : true;
                if( isfinish && okfunc != undefined )
                    okfunc($(this), $('#newSelectPanel').find(".DialogBox"));
            });
        },
        formdialog: function( formdata, okfunc ){
            if( $('#OperateForm').size() == 0 )
                $('body').append("<div class=\"BaseForm\" id=\"OperateForm\" style=\"display:none\"></div>" );
            var formstr = "<div class=\"FormBaseBox\">";
            formstr += "<div class=\"BaseDesc\">" + formdata.idxname + "</div>";
            if( formdata.idxtype == "textarea" )
                formstr += "<div class=\"BaseInput\"><textarea lvs_bind=\"" + formdata.idxkey + "\">" + formdata.idxval + "</textarea></div>";
            else if( formdata.idxtype == "pic" || formdata.idxtype=="image")
                formstr += "<div class=\"BaseInput\"><div class=\"PicFile\" lvs_bind=\"" + formdata.idxkey + "\"><img width=\"30%\" src=\"" + formdata.idxval + "\"/></div></div>";
            else if( formdata.idxtype == "date")
                formstr += "<div class=\"BaseInput\"><input type=\"date\" value=\"" + formdata.idxval + "\" lvs_bind=\"" + formdata.idxkey + "\"/></div>";
            else if( formdata.idxtype == "time")
                formstr += "<div class=\"BaseInput\"><input type=\"time\" value=\"" + formdata.idxval + "\" lvs_bind=\"" + formdata.idxkey + "\"/></div>";
            else if( formdata.idxserial != undefined )
                formstr += "<div class=\"BaseInput\"><component name=\"cn.button.serial\" lvs_bind=\"" + formdata.idxkey + "\" data-curval=\"" + formdata.idxval + "\" data-serial=\"" + formdata.idxserial + "\"></component></div>";
            else
                formstr += "<div class=\"BaseInput\"><input type=\"text\" value=\"" + formdata.idxval + "\" lvs_bind=\"" + formdata.idxkey + "\"/></div>";
            formstr += "<div class=\"BaseDesc\"><a class=\"FormOk button bg-green\">确认设置</a><a class=\"FormCancel button bg-grey\">取消操作</a></div>";
            formstr += "</div>";
            $('#OperateForm').html( formstr );
            $(this).unidialog( "#OperateForm", { token: formdata.token, idxid: formdata.idxid, fresh: 1, dlgwidth: $(window).width()>1000 ? 35: 80 }, okfunc );
        },
        closedialog: function () {
            $('#newSelectPanel').remove();
            $('#overlayBack').remove();
            $('body').trigger("dialogclose",[]);
        },
        showdialog: function( formname, okfunc, formdata){
            $(this).basedialog( formdata.token, formdata.idxid, formname, okfunc, formdata );
        },
        closeshowdialog: function(){
            $(this).closedialog();
        },
        loadform: function( formname, formdata, okfunc ){
            var dlghtml = "";
            var formbox = $(this);
            if( formname.indexOf( "cn." ) == 0 || formname.indexOf("#cn.") == 0 ){
                $(this).loadcomponent( formname.indexOf( "#" ) == 0 ? formname.substr( 1 ): formname, formdata.token, formdata.idxid, formdata, function(){
                    $(formbox).trigger("formloaded", []);
                    $(formbox).on("click", ".FormOk", function(){
                        var isfinish = $(formbox).lvscheckinp();
                        if( isfinish && okfunc != undefined )
                            okfunc($(this), $(formbox));
                    });
                    $(formbox).on("click", ".FormCancel", function(){
                        $(formbox).trigger("formcancel", [$(this)]);
                        $(formbox).remove();
                    });
                });
            }
            else{
                dlghtml = $(formname).html();
                var showindiv = "";
                showindiv += "<div class=\"BaseBody\"><div class=\"DialogBodyInfo\">" + dlghtml + "</div></div>";
                $(formbox).html(showindiv);
                $('body').animate({scrollTop: $('body').prop("scrollHeight")}, 500);
                var keyidx = 0;
                if( formdata != undefined )
                    keyidx = formdata.idxid;
                var token = formdata.token;
                $(this).find(".DialogBodyInfo").lvsformat( token, keyidx, formdata, function(){
               
                });
                $(this).find(".DialogBodyInfo").find(".RichEdit").each(function(){
                    $(this).loadcomponent( "cn.form.richedit", token, keyidx, {text:$(this).attr("richdata")},function(){
                    });
                });
                var Lvs = LvsCore.Create();
                Lvs.GetComponent( formbox, token, keyidx, formdata, function(){
                }); 
                $(this).find(".DialogBodyInfo").find("[component]").each(function(){
                    $(this).loadcomponent( $(this).attr("component"), token, keyidx, formdata.data || formdata.formdata,function(){
                    });
                });
                $(this).trigger("formloaded", []);
                $(this).find(".DialogBodyInfo").lvsclick( token, keyidx, formdata );
                $(this).find(".DialogBodyInfo").on("click", ".FormCancel", function(){
                    $(formbox).trigger("formcancel", [$(this)]);
                    $(formbox).remove();
                });
                $(this).find(".DialogBodyInfo").on("click", ".FormOk", function(){
                    var isfinish = $(formbox).find(".DialogBodyInfo").lvscheckinp();
                    if( isfinish && okfunc != undefined )
                        okfunc($(this), $(formbox).find(".DialogBodyInfo"));
                });
            }
        }
    });
})(jQuery);

//显示板插件
(function (jQuery) {
    jQuery.fn.extend({
        basepanel: function (styleset,okfunc) {
            if ($('#newBasePanel').size() > 0)
                $('#newBasePanel').remove();
            var newDiv = $('<div/>');
            var showindiv = "<div class=\"PanelBox\"" + (styleset.hasOwnProperty("padding")?" style=\"padding:" + styleset.padding + "px\"":"") + ">";
            if( styleset.close > 0 )
                showindiv += "<img lvs_elm=\"PanelClose\" style=\"width:30px;height:30px;margin-right:-20px;margin-top:-5px;float:right;border-radius:999px\" src=\"../Image/close.png\"/>";
            showindiv += "<div class=\"BaseBody\"><div class=\"PanelBodyInfo\"></div></div>";
            showindiv += "</div>";
            var left = styleset.left || "30%";
            var width = styleset.width || "40%";
            var top = styleset.top || 100;
            var bottom = styleset.bottom || 100;
            var right = styleset.right || "10%";
            var position = styleset.position || "absolute";
            $(newDiv).html(showindiv).attr("id", 'newBasePanel').css({
                "position": position,
                "width": width,
                "z-index": 1901
            });
            if( styleset.left != undefined )
                $(newDiv).css("left", left );
            if( styleset.right != undefined )
                $(newDiv).css("right", right );
            if( styleset.top != undefined)
                $(newDiv).css("top", top );
            if( styleset.bottom != undefined )
                $(newDiv).css("bottom", bottom );
            $(this).append(newDiv).find( "#newBasePanel" ).hide();
            $(newDiv).fadeIn(300, function () {
                okfunc( $('#newBasePanel').find(".PanelBodyInfo") );
            });
            $('[lvs_elm=PanelClose]').click(function(){
                $('#newBasePanel').fadeOut(500, function(){
                    $(this).remove();
                    $('body').unbind("click");
                    $('body').trigger("panelclose", []);
                });
            });
            $('.PanelCancel').click(function(){
                $('#newBasePanel').fadeOut(500, function(){
                    $(this).remove();
                    $('body').unbind("click");
                    $('body').trigger("panelclose", []);
                });
            });
            return $(this);
        },
        closepanel: function(curelm){
            if( curelm != undefined ){
                $(curelm).closest( "#newBasePanel" ).fadeOut( 500, function(){
                    $(this).remove();
                });
            }
            else{
                $('#newBasePanel').fadeOut(500, function(){
                    $(this).remove();
                });
            }
            $('body').unbind("click");
            $('body').trigger("panelclose", []);
        }
    });
})(jQuery);

//组件操作插件
(function (jQuery) {
    jQuery.fn.extend({
        getcomponent: function ( comptype ) {
            return $(this).find("[lvs_component=" + comptype + "]");
        },
        loadcomponent: function(cnname, token, idxid, curdata, okfunc){
            var Lvs = LvsCore.Create();
            Lvs.BindTmpl( "#" + cnname, $(this).html(""), token, idxid, curdata, okfunc );
            return this;
        }
    });
})(jQuery);

//页面画图并弹框
(function (jQuery) {
    jQuery.fn.extend({
        lvs_canvas: function ( ) {
            if( html2canvas == undefined ){
                alert("未加载画布组件" );
            }
            else{
                html2canvas( $(this)[0], {allowTaint: true,useCORS: true} ).then( canvas =>{
                    var dataUrl = canvas.toDataURL("image/png");
                    if( $("#OperateForm").size() == 0 )
                        $('body').append( "<div class=\"BaseForm\" id=\"OperateForm\" style=\"display:none\"></div>");
                    $('#OperateForm').html("<img width=\"100%\" src=\"" + dataUrl + "\"/>");
                    $('body').unidialog( "#OperateForm", { token: "", idxid: 0}, function( curbt, curbox){
                    });
                });
            }
        }
    });
})(jQuery);


//全屏插件
(function (jQuery) {
    jQuery.fn.extend({
        fullscreen: function () {
            return this;
        },
        exitfullscreen: function(){
            return this;
        }
    });
})(jQuery);

//数据设置插件
(function (jQuery) {
    jQuery.fn.extend({
        SetData: function (curdata, setpars) {
            var databox = $(this);
            if( curdata == undefined )
                curdata = {};
            Object.keys( setpars ).forEach( function( key ){
                curdata[key] = setpars[key];
                $(databox).find("[lvs_bind=" + key + "]").each(function(){
                    $(this).parent().setbind( key, curdata[key] );
                });
            });
            return this;
        },
        getbind: function(bindname){
            if( $(this) == undefined )
                return "";
            if( $(this).find("[lvs_bind=" + bindname + "]").hasClass("Serial") || $(this).find("[lvs_bind=" + bindname + "]").attr("idxserial") != undefined ){
                if( $(this).find("[lvs_bind=" + bindname + "]").attr("idxid") == undefined || $(this).find("[lvs_bind=" + bindname + "]").attr("idxid") == "null")
                    return $(this).find("[lvs_bind=" + bindname + "]").val();
                else
                    return $(this).find("[lvs_bind=" + bindname + "]").attr("idxid");
            }
            else if( $(this).find("[lvs_bind=" + bindname + "]").hasClass("RichText")){
                window.editor.sync();
                return $(this).find("[lvs_bind=" + bindname + "]").html();
            }
            else if( $(this).find("[lvs_bind=" + bindname + "]").hasClass("PicText"))
                return $(this).find("[lvs_bind=" + bindname + "]").pictextval();
            else if( $(this).find("[lvs_bind=" + bindname + "]").hasClass("Checkbox"))
                return $(this).find("[lvs_bind=" + bindname + "]").hasClass("Checked") ? 1: 0;
            else if( $(this).find("[lvs_bind=" + bindname + "]").is('input'))
                return $(this).find("[lvs_bind=" + bindname + "]").val();
            else if( $(this).find("[lvs_bind=" + bindname + "]").is('select'))
                return $(this).find("[lvs_bind=" + bindname + "]").val();
            else if( $(this).find("[lvs_bind=" + bindname + "]").hasClass( "Editable" ) )
                return $(this).find("[lvs_bind=" + bindname + "]").html();
            else if( $(this).find("[lvs_bind=" + bindname + "]").is('span'))
                return $(this).find("[lvs_bind=" + bindname + "]").text();
            else if( $(this).find("[lvs_bind=" + bindname + "]").is('textarea'))
                return $(this).find("[lvs_bind=" + bindname + "]").val();
            else if( $(this).find("[lvs_bind=" + bindname + "]").hasClass("MultSelecting"))
                return $(this).find("[lvs_bind=" + bindname + "]").hasClass("MultSelected") ? 1: 0;
            else if( $(this).find("[lvs_bind=" + bindname + "]").hasClass("SelBox")){
                if( $(this).find("[lvs_bind=" + bindname + "]").find(".MultSelecting").size() > 0 ){
                    var selres = "";
                    $(this).find("[lvs_bind=" + bindname + "]").find(".MultSelected").each( function(){
                        if( selres != "" )
                            selres += ",";
                        selres += $(this).attr("idxid");
                    });
                    return selres;
                }
                else
                    return $(this).find("[lvs_bind=" + bindname + "]").find(".Selected").attr("idxid");
            }
            else if( $(this).find("[lvs_bind=" + bindname + "]").hasClass("TypeTab"))
                return $(this).find("[lvs_bind=" + bindname + "]").find(".active").attr("tabidx") || $(this).find("[lvs_bind=" + bindname + "]").find(".active").attr("idxid");
            else if( $(this).find("[lvs_bind=" + bindname + "]").hasClass("PicFile"))
                return $(this).find("[lvs_bind=" + bindname + "]").piclist();
            else if( $(this).find("[lvs_bind=" + bindname + "]").hasClass("VodFile"))
                return $(this).find("[lvs_bind=" + bindname + "]").attr("returl");
            else if( $(this).find("[lvs_bind=" + bindname + "]").hasClass("WxImage"))
                return $(this).find("[lvs_bind=" + bindname + "]").images();
            else if( $(this).find("[lvs_bind=" + bindname + "]").hasClass("AttachFile"))
                return $(this).find("[lvs_bind=" + bindname + "]").piclist();
            else if( $(this).find("[lvs_bind=" + bindname + "]").hasClass("PowerX"))
                return $(this).find("[lvs_bind=" + bindname + "]").hasClass("PowerOn")?1:0;
            else if( $(this).find("[lvs_bind=" + bindname + "]").hasClass("RichEdit"))
                return encodeURI( $(this).find("[lvs_bind=" + bindname + "]" ).getrichtext())
            else if( $(this).find("[lvs_bind=" + bindname + "]").is("div"))
                return $(this).find("[lvs_bind=" + bindname + "]").text();
            else if( $(this).find("[lvs_bind=" + bindname + "]" ).is("component")){
                if( $(this).find("[lvs_bind=" + bindname + "]" ).attr("name") == "cn.form.richedit" )
                    return encodeURI( $(this).find("[lvs_bind=" + bindname + "]" ).getrichtext());
                else if( $(this).find("[lvs_bind=" + bindname + "]" ).attr("name") == "cn.intact.taskans" )
                    return encodeURI( $(this).find("[lvs_bind=" + bindname + "]" ).gettaskans());
                else if($(this).find("[lvs_bind=" + bindname + "]" ).attr("name") == "cn.button.checkbtn")
                    return $(this).find("[lvs_bind=" + bindname + "]" ).getchecked() == "on" ? 1: 0;
                else if($(this).find("[lvs_bind=" + bindname + "]" ).attr("name") == "cn.button.serial")
                    return $(this).find("[lvs_bind=" + bindname + "]" ).attr("idxid") ? $(this).find("[lvs_bind=" + bindname + "]" ).attr("idxid"): $(this).find("[lvs_bind=" + bindname + "]" ).find("input").val();
                else if($(this).find("[lvs_bind=" + bindname + "]" ).attr("name") == "cn.el_slider.el_slider_input")
                    return $(this).find("[lvs_bind=" + bindname + "]" ).getSliderValue();
                else if($(this).find("[lvs_bind=" + bindname + "]" ).attr("name") == "cn.elmind.editmind" )
                    return $(this).find("[lvs_bind=" + bindname + "]" ).get_nodearray_data( {} );
                else
                    return $(this).find("[lvs_bind=" + bindname + "]" ).find("[lvs_component]").attr("idxid");
            }
            else
                return "";
        },
        setbind: function(bindname, bindval){
            if( $(this) == undefined )
                return;
            if( $(this).find("[lvs_bind=" + bindname + "]").hasClass("Serial")){
                $(this).find("[lvs_bind=" + bindname + "]").attr("idxid", bindval.split('-')[0]).val(bindval.split('-')[1] );
            }
            else if( $(this).find("[lvs_bind=" + bindname + "]").attr("idxserial") != undefined && $(this).find("[lvs_bind=" + bindname + "]").attr("idxserial") != "" ){
                var idxes = $(this).find("[lvs_bind=" + bindname + "]").attr("idxserial").split(',');
                for( var i = 0; i < idxes.length; i ++ ){
                    if( idxes[i].split('-')[0] == bindval ){
                        var idxval = idxes[i].indexOf("-") == -1 ? idxes[i] : idxes[i].split('-')[1];
                        $(this).find("[lvs_bind=" + bindname + "]").attr("idxid", idxes[i].split('-')[0]).val( idxval ).text( idxval ) ;
                        break;
                    }
                }
            }
            else if( $(this).find("[lvs_bind=" + bindname + "]").hasClass("RichText")){
                $(this).find("[lvs_bind=" + bindname + "]").html( bindval );
            }
            else if( $(this).find("[lvs_bind=" + bindname + "]").hasClass("PicText"))
                $(this).find("[lvs_bind=" + bindname + "]").html( bindval );
            else if( $(this).find("[lvs_bind=" + bindname + "]").is('input'))
                $(this).find("[lvs_bind=" + bindname + "]").val(bindval);
            else if( $(this).find("[lvs_bind=" + bindname + "]").is('select'))
                $(this).find("[lvs_bind=" + bindname + "]").val(bindval);
            else if( $(this).find("[lvs_bind=" + bindname + "]").is('span'))
                $(this).find("[lvs_bind=" + bindname + "]").text(bindval);
            else if( $(this).find("[lvs_bind=" + bindname + "]").is('textarea'))
                $(this).find("[lvs_bind=" + bindname + "]").val(bindval);
            else if( $(this).find("[lvs_bind=" + bindname + "]").is('img'))
                $(this).find("[lvs_bind=" + bindname + "]").attr("src", bindval);
            else if( $(this).find("[lvs_bind=" + bindname + "]").hasClass( "Editable" ) )
                $(this).find("[lvs_bind=" + bindname + "]").text(bindval);
            else if( $(this).find("[lvs_bind=" + bindname + "]").hasClass("SelBox")){
                $(this).find("[lvs_bind=" + bindname + "]").find(".Selected").removeClass("Selected");
                $(this).find("[lvs_bind=" + bindname + "]").find(".Selecting").each(function(){
                    if( $(this).attr("idxid") == bindval )
                        $(this).addClass("Selected");
                });
            }
            else if( $(this).find("[lvs_bind=" + bindname + "]").hasClass("TypeTab"))
            {
                $(this).find("[lvs_bind=" + bindname + "]").find(".active").removeClass("active");
                $(this).find("[lvs_bind=" + bindname + "]").find(".TypeItem").each(function(){
                    if( $(this).attr("tabidx") == bindval )
                        $(this).addClass("TypeTab");
                });
            }
            else if( $(this).find("[lvs_bind=" + bindname + "]").hasClass("PicFile"))
                $(this).find("[lvs_bind=" + bindname + "]").piclist( bindval );
            else if( $(this).find("[lvs_bind=" + bindname + "]").hasClass("VodFile"))
                $(this).find("[lvs_bind=" + bindname + "]").attr("returl", bindval);
            else if( $(this).find("[lvs_bind=" + bindname + "]").hasClass("WxImage"))
                $(this).find("[lvs_bind=" + bindname + "]").images(bindval);
            else if( $(this).find("[lvs_bind=" + bindname + "]").hasClass("AttachFile"))
                $(this).find("[lvs_bind=" + bindname + "]").piclist(bindval);
            else if( $(this).find("[lvs_bind=" + bindname + "]").hasClass("PowerX"))
                bindval == 1 ? $(this).find("[lvs_bind=" + bindname + "]").removeClass("PowerOff").addClass("PowerOn"):$(this).find("[lvs_bind=" + bindname + "]").removeClass("PowerOn").addClass("PowerOff");
            else if($(this).find("[lvs_bind=" + bindname + "]").is("div"))
                $(this).find("[lvs_bind=" + bindname + "]").html( bindval );
            else if( $(this).find("[lvs_bind=" + bindname + "]" ).is("component")){
                if( $(this).find("[lvs_bind=" + bindname + "]" ).attr("name") == "cn.form.richedit" )
                    $(this).find("[lvs_bind=" + bindname + "]" ).setrichtext(bindval);
                else if( $(this).find("[lvs_bind=" + bindname + "]" ).attr("name") == "cn.intact.taskans" )
                    $(this).find("[lvs_bind=" + bindname + "]" ).settaskans(bindval);
                else if($(this).find("[lvs_bind=" + bindname + "]" ).attr("name") == "cn.button.checkbtn")
                    $(this).find("[lvs_bind=" + bindname + "]" ).setchecked( bindval );
                else
                    return $(this).find("[lvs_bind=" + bindname + "]" ).find("[lvs_component]").attr("idxid");
            }
            else
                $(this).find("[lvs_bind=" + bindname + "]").val( bindval );
            return $(this);
        }
    });
})(jQuery);

function isIos(){
     var userAgentInfo = navigator.userAgent;

     var mobileAgents = [ "iPhone", "iPad", "iPod"];

     var mobile_flag = false;

     //根据userAgent判断是否是手机
     for (var v = 0; v < mobileAgents.length; v++) {
         if (userAgentInfo.indexOf(mobileAgents[v]) > 0) {
             mobile_flag = true;
             break;
         }
     }
     return mobile_flag;
}