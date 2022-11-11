//即时消息组件
(function (jQuery) {
    jQuery.fn.extend({
        lvslesnim: function (token, idxid, curdata) {
            var imbox = $(this);
            var Lvs = LvsCore.Create();
            $('[lvs_bind=MessageList]').css("height", parseInt( $(window).height() ) - parseInt($('[lvs_bind=MessageList]').offset().top) - 48);
            InitLocalInfo(token, curdata);
            InitRtcTim(token, curdata.sdkappid, idxid, curdata.liveuid, curdata.usersig);
            $(imbox).find("[lvs_elm=SendMesOk]").click(function () {
                SendMessage({ lesnid: idxid, userid: curdata.liveuid, mestext: $(imbox).find('[lvs_bind=MessageText]').val() })
            });
            return this;
        }
    });
})(jQuery);

var rtc = { localInfo: null, tim: null };
function InitLocalInfo(token, resdata) {
    var istch = 0;
    if (resdata.liveuid == resdata.tchuid)
        istch = 1;
    rtc.localInfo = { token: token, istch: istch, name: (istch > 0) ? resdata.tname : resdata.uname, lesnid: resdata.id, userid: resdata.liveuid, tchuserid: resdata.tchuid };
}
function _RecvMessage( event ){
    const meslist = event.data;
    console.log( "收到消息", event );
    let mesdata = new Array();
    for( let i = 0;i< meslist.length; i ++ ){
        if( meslist[i].to == rtc.localInfo.lesnid || meslist[i].to == rtc.localInfo.userid ){
            if( meslist[i].type == TIM.TYPES.MSG_TEXT ){
                const recvmes = meslist[i].payload.text;
                const recvuser = recvmes.split(':')[0];
                const recvtext = recvmes.substring( recvuser.length + 1 );
                let recvtype = "群消息";
                if( meslist[i].conversationType == TIM.TYPES.CONV_C2C )
                    recvtype = "私信";
                let caps = "";
                if( meslist[i].from.split('_').length>2 && meslist[i].from.split('_')[2] == "1" )
                    caps = "主讲师";
                else if(meslist[i].from.split('_').length>2 && meslist[i].from.split('_')[2] == "2")
                    caps = "嘉宾";
                mesdata.push( { myuid: rtc.localInfo.userid, uid: meslist[i].from, name: recvuser, message: recvtext, caps: caps, type: recvtype });
                if( recvtext == "开始课程直播" || recvtext == "完成课程直播" ){
                    LesnStateShow( recvtext );
                    if( recvtext == "开始课程直播" ){
                        var tips = ErrorTip.Create();
                        tips.Show("当前已开始课程直播，请注意", function(){
                            if( $('.CoursePanel').size() > 0)
                                location.reload();
                        });
                    }
                }
                else if( recvtext == "静音" ){
                    SetLocalMute( "audio", 0, function( curmute ){
                        $('.MuteAudio').attr("mute", curmute).text( "解除静音" );
                    });
                }
                else if( recvtext.indexOf( "改名：" ) == 0 ){
                    var userlvl = meslist[i].from.split('_')[2];
                    if( userlvl == 1 )
                        $('#Player_' + meslist[i].from ).parent().find(".PlayerTitle").text( recvtext.substring( "改名：".length ) );
                    else
                        $('[lvs_bind=TchName]').text( recvtext.substring( "改名：".length ) );
                }
            }
        }
    }
    InitMesList( mesdata );
}
function InitMesList( mesdata ){
    if($('[lvs_bind=MessageList]').size()>0){
        var DataEng = LvsData.Create();
        DataEng.BindTmpl( "cn.im.meslist", $('[lvs_bind=MessageList]'), "", 0, {mesdata: mesdata}, function(){
            $('[lvs_bind=MessageList]').scrollTop($('[lvs_bind=MessageList]').height());
            $('[lvs_bind=MessageList]').find('[lvs_elm=VoicePlay]').each(function () {
                $(this).lvsplayvoice(function () {
                    $(this).voicestop();
                });
            });
            $('[lvs_bind=MessageList]').find(".MesItem").click(function(){
                $('.SendTo').html( "发送私信给" + $(this).attr("idxname") + "<img class=\"SendToAll\" src=\"../Image/del.gif\"/>" ).attr("idxid", $(this).attr("idxid")).attr("idxname", $(this).attr("idxname"));
                $('.SendToAll').click(function(){
                    $('.SendTo').html("发送群消息" ).attr("idxid", 0);
                });
            });
        });
    }
    if( $('[lvs_bind=LesnRemark]').size() > 0 ){
        $('[lvs_bind=LesnRemark]').lvsremark( mesdata );
    }
}
function InitMessage( token, sdkappid, lesnid, userid){
    if( rtc.tim ){
        let promise = rtc.tim.getMessageList({ conversationID: 'GROUP' + lesnid, count: 20 });
        promise.then(function( imResp ){
            const meslist = imResp.data.messageList;
            const mesdata = new Array();
            meslist.forEach(( item )=>{
                if( item.payload.text != undefined ){
                    const mesinfo = item.payload.text;
                    const mesuser = mesinfo.split(':')[0];
                    const mestext = mesinfo.substring( mesuser.length + 1);
                    let caps = "";
                    if( item.from.split('_').length > 2 && item.from.split('_')[2] == "1" )
                        caps = "主讲师";
                    else if(item.from.split('_').length > 2 && item.from.split('_')[2] == "2")
                        caps = "嘉宾";
                    mesdata.push({myuid: userid, uid: item.from, name: mesuser, message: mestext, caps: caps, type: "群消息"} );
                }
            });
            InitMesList( mesdata );
        });
    }
}
function SendMessage( params ){
    if( params.mestext == "" )
        return;
    const message = rtc.tim.createTextMessage({
        to: (params.lesnid>0)? params.lesnid + '':params.touser,
        conversationType: (params.lesnid>0)?TIM.TYPES.CONV_GROUP:TIM.TYPES.CONV_C2C,
        payload: {
            text: rtc.localInfo.name + ((rtc.localInfo.istch>0)?"(老师)":"") + ":" + params.mestext
        },
    })
    const promise = rtc.tim.sendMessage(message)
    promise.then(function(imResponse) {
    // 发送成功
    console.log('sendGroupTextMessage success', imResponse)
        const mesdata = new Array();
        mesdata.push( { myuid: params.userid, uid: params.userid, name: rtc.localInfo.name + ((rtc.localInfo.istch>0)?"(老师)":""), message: ((params.touname==""||params.touname==undefined)?"":"@"+ params.touname + ":") + params.mestext, type: (params.lesnid>0) ? "群消息":"私信" });
        InitMesList( mesdata );
        $('[lvs_bind=MessageText]').val("");
    }).catch(function(imError) {
    // 发送失败
        console.warn('sendGroupTextMessage error:', imError)
        alert( "发送失败：" + imError );
    })
}
function InitRtcTim(token, sdkappid, lesnid, userid, usersig){
    let options = { SDKAppID: sdkappid };
    rtc.tim = TIM.create( options );
    rtc.tim.setLogLevel( 1 );
    rtc.tim.on(TIM.EVENT.SDK_READY, function(event) {
    // 收到离线消息和会话列表同步完毕通知，接入侧可以调用 sendMessage 等需要鉴权的接口
        const promise = rtc.tim.searchGroupByID( lesnid );
        promise.then(function(resp){
            const prm = rtc.tim.joinGroup( { groupID: lesnid, type: TIM.TYPES.GRP_CHATROOM } );
            prm.then(function( joinres ){
                InitMessage( token, sdkappid, lesnid, userid );
            });
        }).catch(()=>{
            const addprm = rtc.tim.createGroup( { groupID: lesnid,name: lesnid, type: TIM.TYPES.GRP_CHATROOM });
            addprm.this( function( addresp ){
                const joinprm = rtc.tim.joinGroup({groupID: lesnid, type: TIM.TYPES.GRP_CHATROOM} );
                joinprm.this(function( joinres ){
                    InitMessage( token, sdkappid, lesnid );
                });
            });
        });
    });
    rtc.tim.on(TIM.EVENT.MESSAGE_RECEIVED, _RecvMessage);
    // 收到推送的单聊、群聊、群提示、群系统通知的新消息，可通过遍历 event.data 获取消息列表数据并渲染到页面
    rtc.tim.on(TIM.EVENT.MESSAGE_REVOKED, function(event) {
    // 收到消息被撤回的通知
    // event.name - TIM.EVENT.MESSAGE_REVOKED
    // event.data - 存储 Message 对象的数组 - [Message] - 每个 Message 对象的 isRevoked 属性值为 true
    });
    rtc.tim.on(TIM.EVENT.MESSAGE_READ_BY_PEER, function(event) {
    // SDK 收到对端已读消息的通知，即已读回执。使用前需要将 SDK 版本升级至 v2.7.0 或以上。仅支持单聊会话。
    // event.name - TIM.EVENT.MESSAGE_READ_BY_PEER
    // event.data - event.data - 存储 Message 对象的数组 - [Message] - 每个 Message 对象的 isPeerRead 属性值为 true
    });
    rtc.tim.on(TIM.EVENT.CONVERSATION_LIST_UPDATED, function(event) {
    // 收到会话列表更新通知，可通过遍历 event.data 获取会话列表数据并渲染到页面
    // event.name - TIM.EVENT.CONVERSATION_LIST_UPDATED
    // event.data - 存储 Conversation 对象的数组 - [Conversation]
    });
    rtc.tim.on(TIM.EVENT.GROUP_LIST_UPDATED, function(event) {
    // 收到群组列表更新通知，可通过遍历 event.data 获取群组列表数据并渲染到页面
    // event.name - TIM.EVENT.GROUP_LIST_UPDATED
    // event.data - 存储 Group 对象的数组 - [Group]
    });
    rtc.tim.on(TIM.EVENT.SDK_NOT_READY, function(event) {
    // 收到 SDK 进入 not ready 状态通知，此时 SDK 无法正常工作
    // event.name - TIM.EVENT.SDK_NOT_READY
    });
    rtc.tim.on(TIM.EVENT.KICKED_OUT, function(event) {
    // 收到被踢下线通知
    // event.name - TIM.EVENT.KICKED_OUT
    // event.data.type - 被踢下线的原因，例如:
    //    - TIM.TYPES.KICKED_OUT_MULT_ACCOUNT 多实例登录被踢
    //    - TIM.TYPES.KICKED_OUT_MULT_DEVICE 多终端登录被踢
    //    - TIM.TYPES.KICKED_OUT_USERSIG_EXPIRED 签名过期被踢 （v2.4.0起支持）。 
    });
    rtc.tim.on(TIM.EVENT.NET_STATE_CHANGE, function(event) { 
    //  网络状态发生改变（v2.5.0 起支持）。 
    // event.name - TIM.EVENT.NET_STATE_CHANGE 
    // event.data.state 当前网络状态，枚举值及说明如下： 
    //     \- TIM.TYPES.NET_STATE_CONNECTED - 已接入网络 
    //     \- TIM.TYPES.NET_STATE_CONNECTING - 连接中。很可能遇到网络抖动，SDK 在重试。接入侧可根据此状态提示“当前网络不稳定”或“连接中” 
    //    \- TIM.TYPES.NET_STATE_DISCONNECTED - 未接入网络。接入侧可根据此状态提示“当前网络不可用”。SDK 仍会继续重试，若用户网络恢复，SDK 会自动同步消息  
    });
    // 开始登录 
    rtc.tim.login({userID: userid, userSig: usersig}); 
    $('[lvs_bind=MessageText]').keydown( function( e ){
        if( e.keyCode == 13 ){
            SendMessage( {lesnid: lesnid, userid: userid, mestext: $('[lvs_bind=MessageText]').val()});
            return false;
        }
    });
}
