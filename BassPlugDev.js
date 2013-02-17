var version = "Running BassPlug version 2.0.1 <br>Type '/change' for the changes made.<br>Use '/cmd' to show all commands.";
var changeLog = "Version 2.0.1 - Woo final release! | Made some huge changes to response/emotes | Autojoin is now disabled for bouncers+ | Added the ability to turn off audience animation | Added stream and alert buttons | Made the userlist change size automatically and scroll instead of making the page larger | Added a slightly different look to plug | Fixed a few bugs";
appendToChat(version, null, "#58FAF4");

var recent = false,
    awaymsg = "",
    autowoot = true,
    autoqueue = false,
    hideVideo = false,
    userList = true,
    autorespond = false,
    recentEmote = false,
    afkdisable = false,
    stream = true,
    animation = true,
    menu = true,
    alerts = true,
    mehcount = 0;

function initAPIListeners()
{
    API.addEventListener(API.DJ_ADVANCE, djAdvanced);
    API.addEventListener(API.VOTE_UPDATE, function(obj) {
        if (API.getUser(obj.user.id).vote == -1)
            API.getUser(obj.user.id).mehcount ++
        if (userList)
            populateUserlist();
    });
    API.addEventListener(API.CURATE_UPDATE, function(obj) {
        if (alerts) {
            var media = API.getMedia();
            log(obj.user.username + " added " + media.author + " - " + media.title)
            API.getUser(obj.user.id).curated=true;
            if (userList)
                populateUserlist();
        }
    });
    API.addEventListener(API.USER_JOIN, function(user) {
        if (alerts){
            appendToChat(user.username + " joined the room", null, "#A9D033");
        }
        if(API.getUser(user.id).mehcount===undefined){
            API.getUser(user.id).mehcount=0
        }
        if (userList)
            populateUserlist();
    });
    API.addEventListener(API.USER_LEAVE, function(user) {
        if (alerts){
            appendToChat(user.username + " left the room", null, "#A9D033");
        }
        if (userList)
            populateUserlist();
    });
    API.addEventListener(API.CHAT, disable);
}

function displayUI(data) {

    if (Models.room.data.staff[API.getSelf().id] >= Models.user.BOUNCER) {
        $('#user-container').prepend('<div id="plugbot-ui"></div>');
        $('#plugbot-ui').append(
            '<p id="plugbot-btn-menu" style="color:#58FAF4; ">BassPlug</p>' +
                '<div style="visibility:visible">' +
                '<p id="plugbot-btn-woot" style="color:#3FFF00">Autowoot</p>' +
                '<p id="plugbot-btn-hidevideo" style="color:#ED1C24">Hide Video</p>' +
                '<p id="plugbot-btn-userlist" style="color:#3FFF00">Userlist</p>' +
                '<p id="plugbot-btn-animationoff" style="color:#3FFF00">Animation</p>' +
                '<p id="plugbot-btn-stream" style="color:#3FFF00">Stream</p>' +
                '<p id="plugbot-btn-alerts" style="color:#3FFF00">Alerts</p>' +
                '<p id="plugbot-btn-autorespond" style="color:#ED1C24">Respond</p>' +
                '</div>'
        );
    }else{
        $('#user-container').prepend('<div id="plugbot-ui"></div>');
        $('#plugbot-ui').append(
            '<p id="plugbot-btn-menu" style="color:#58FAF4 ">BassPlug</p>' +
                '<div style="visibility:visible">' +
                '<p id="plugbot-btn-woot" style="color:#3FFF00">Autowoot</p>' +
                '<p id="plugbot-btn-queue" style="color:#ED1C24">Autojoin</p>' +
                '<p id="plugbot-btn-hidevideo" style="color:#ED1C24">Hide Video</p>' +
                '<p id="plugbot-btn-userlist" style="color:#3FFF00">Userlist</p>' +
                '<p id="plugbot-btn-autorespond" style="color:#ED1C24">Respond</p>' +
                '<p id="plugbot-btn-animationoff" style="color:#3FFF00">Animation</p>' +
                '<p id="plugbot-btn-stream" style="color:#3FFF00">Stream</p>' +
                '<p id="plugbot-btn-alerts" style="color:#3FFF00">Alerts</p>' +
                '</div>'
        );
    }
}
function initUIListeners()
{
    $("#plugbot-btn-menu") .hover(function(){
            $(this).css("background-color", "rgba(39, 39, 39, 0.83)");
        },
        function(){
            $(this).css("background-color", "rgba(10, 10, 10, 0.83)");
        });
    $("#plugbot-btn-woot") .hover(function(){
    $(this).css("background-color", "rgba(39, 39, 39, 0.83)");
    },
        function(){
        $(this).css("background-color", "rgba(10, 10, 10, 0.83)");
});
    $("#plugbot-btn-queue") .hover(function(){
            $(this).css("background-color", "rgba(39, 39, 39, 0.83)");
        },
        function(){
            $(this).css("background-color", "rgba(10, 10, 10, 0.83)");
        });
    $("#plugbot-btn-hidevideo") .hover(function(){
            $(this).css("background-color", "rgba(39, 39, 39, 0.83)");
        },
        function(){
            $(this).css("background-color", "rgba(10, 10, 10, 0.83)");
        });
    $("#plugbot-btn-userlist") .hover(function(){
            $(this).css("background-color", "rgba(39, 39, 39, 0.83)");
        },
        function(){
            $(this).css("background-color", "rgba(10, 10, 10, 0.83)");
        });
    $("#plugbot-btn-autorespond") .hover(function(){
            $(this).css("background-color", "rgba(39, 39, 39, 0.83)");
        },
        function(){
            $(this).css("background-color", "rgba(10, 10, 10, 0.83)");
        });
    $("#plugbot-btn-animationoff") .hover(function(){
            $(this).css("background-color", "rgba(39, 39, 39, 0.83)");
        },
        function(){
            $(this).css("background-color", "rgba(10, 10, 10, 0.83)");
        });
    $("#plugbot-btn-stream") .hover(function(){
            $(this).css("background-color", "rgba(39, 39, 39, 0.83)");
        },
        function(){
            $(this).css("background-color", "rgba(10, 10, 10, 0.83)");
        });
    $("#plugbot-btn-alerts") .hover(function(){
            $(this).css("background-color", "rgba(39, 39, 39, 0.83)");
        },
        function(){
            $(this).css("background-color", "rgba(10, 10, 10, 0.83)");
        });

    $("#plugbot-btn-menu").on("click", function() {
        menu = !menu;
        $("#plugbot-btn-woot") .css("visibility", menu ? ("visible") : ("hidden"));
        $("#plugbot-btn-queue") .css("visibility", menu ? ("visible") : ("hidden"));
        $("#plugbot-btn-hidevideo") .css("visibility", menu ? ("visible") : ("hidden"));
        $("#plugbot-btn-userlist") .css("visibility", menu ? ("visible") : ("hidden"));
        $("#plugbot-btn-autorespond").css("visibility", menu ? ("visible") : ("hidden"));
        $("#plugbot-btn-animationoff").css("visibility", menu ? ("visible") : ("hidden"));
        $("#plugbot-btn-stream").css("visibility", menu ? ("visible") : ("hidden"));
        $("#plugbot-btn-alerts").css("visibility", menu ? ("visible") : ("hidden"));
    });
    $("#plugbot-btn-userlist").on("click", function() {
        userList = !userList;
        $(this).css("color", userList ? "#3FFF00" : "#ED1C24");
        $("#plugbot-userlist").css("visibility", userList ? ("visible") : ("hidden"));
        if (!userList)
            $("#plugbot-userlist").empty();
        else
            populateUserlist();
    });
    $("#plugbot-btn-woot").on("click", function() {
        autowoot = !autowoot;
        $(this).css("color", autowoot ? "#3FFF00" : "#ED1C24");
        if (autowoot) $("#button-vote-positive").click();
    });
    $("#plugbot-btn-hidevideo").on("click", function() {
        hideVideo = !hideVideo;
        $(this).css("color", hideVideo ? "#3FFF00" : "#ED1C24");
        $("#yt-frame").animate({"height": (hideVideo ? "0px" : "271px")}, {duration: "fast"});
    });
    $("#plugbot-btn-queue").on("click", function() {
        autoqueue = !autoqueue;
        $(this).css("color", autoqueue ? "#3FFF00" : "#ED1C24");
        $("#button-dj-waitlist-" + (autoqueue ? "join" : "leave")).click();
    });
    $("#plugbot-btn-autorespond").on("click", function() {
        autorespond = !autorespond;
        $(this).css("color", autorespond ? "#3FFF00" : "#ED1C24");
        if (!autorespond) {
            API.removeEventListener(API.CHAT,chat);
        } else {
            awaymsg = prompt("The message the you enter here will be sent if someone mentions you.\nAdd /user/ to the beginning of your afk message if you want to reply to the person who mentions you.","/me is away from keyboard.");
            if(awaymsg === ""){
                !autorespond;
                $(this).css("color", autorespond, "#3FFF00");
            }
            API.addEventListener(API.CHAT,chat);
        }
    });
    $("#plugbot-btn-animationoff").on("click", function() {
        animation = !animation;
        $(this).css("color", !animation ? "#ED1C24" : "#3FFF00");
        if (!animation) {
            animSpeed = 999999999;
        } else {
            animSpeed = 83;
        }
    });
    $("#plugbot-btn-stream").on("click", function() {
       stream = !stream;
        $(this).css("color", !stream ? "#3FFF00" : "#ED1C24");
        if(stream){
        API.sendChat("/stream off");
        }else{
            API.sendChat("/stream on");
        }
    });
    $("#plugbot-btn-alerts").on("click", function() {
       $(this).css("color", !alerts ? "#3FFF00" : "#ED1C24");
        if(alerts){
            API.sendChat("/alertsoff");
        }else{
            API.sendChat("/alertson");
        }
    });
}
function addGlobalStyle(css){
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if(!head){
        return;
    }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
{
    //Changes the look of plug
    addGlobalStyle('#button-chat-collapse, #button-chat-collapse {background: url(http://i.imgur.com/jqbkAOH.png);');
    addGlobalStyle('#button-chat-expand, #button-chat-expand {background: url(http://i.imgur.com/6dFswPF.png);');
    addGlobalStyle('#chat, #chat {border-style: solid; border-width: 1px; border-color: #000; ');
    addGlobalStyle('#playback, #playback {border-style: solid; border-width: 1px; border-color: #000; ');
    addGlobalStyle('#meta-frame, #meta-frame {border-style: solid; border-width: 1px; border-color: #000; ');
    addGlobalStyle('#user-container, #user-container {border-style: solid; border-width: 1px; border-color: #000; ');
    addGlobalStyle('#meta-frame, #meta-frame {width: 349px;}');
    addGlobalStyle('.frame-background, .frame-background {opacity: 0.83;}');
//Changes the color of user's names in chat
    addGlobalStyle('.chat-from-featureddj, .chat-from-featureddj {color: #00C4FF;}');
    addGlobalStyle('.chat-from-manager, .chat-from-manager {color: #16BF00;}');
    addGlobalStyle('.chat-from-cohost, .chat-from-cohost {color: #FF4000;}');
    addGlobalStyle('.chat-from-host, .chat-from-host {color: #FF0004;}');
//Changes the icons and background color
    addGlobalStyle('.chat-host, .chat-host {background-image: url(http://i.imgur.com/p2FzDNP.png); no repeat 0 5px);}');
    addGlobalStyle('.chat-cohost, .chat-cohost {background-image: url(http://i.imgur.com/Vf1KvPO.png); no repeat 0 5px;}');
    addGlobalStyle('.chat-manager, .chat-manager {background-image: url(http://i.imgur.com/aeEE6jF.png); no repeat 0 5px;}');
    addGlobalStyle('.chat-message:nth-child(2n), .chat-message:nth-child(2n) {background-color: rgba(0, 0, 0, 0.45);}');
    addGlobalStyle('.chat-update:nth-child(2n), .chat-update:nth-child(2n) {background-color: rgba(0, 0, 0, 0.45);}');
    addGlobalStyle('.chat-mention:nth-child(1n), .chat-mention:nth-child(1n) {background-color: rgba(82, 0, 255, 0.12);}');
    addGlobalStyle('.chat-moderation:nth-child(1n), .chat-moderation:nth-child(1n) {background-color: rgba(255, 0, 0, 0.09);}');
    addGlobalStyle('.chat-skip:nth-child(1n), .chat-skip:nth-child(1n) {background-color: rgba(255, 0, 0, 0.09);}');
    addGlobalStyle('.chat-emote:nth-child(2n), .chat-emote:nth-child(2n) {background-color: rgba(0, 0, 0, 0.45);}');
}

function djAdvanced(obj) {
    setTimeout(function() {
        if (hideVideo) {
            $("#yt-frame").css("height", "0px");
            $("#playback .playback-container").css("opacity", "0.0");
        }
        if (autowoot) {
            var dj = API.getDJs()[0];
            if (dj === null) return;
            if (dj == API.getSelf()) return;
            $('#button-vote-positive').click();
        }
        if ($("#button-dj-waitlist-join").css("display") === "block" && autoqueue)
            $("#button-dj-waitlist-join").click();
    },100);
    if (userList)
        populateUserlist();
}

function populateUserlist()
{

    $('#plugbot-userlist').html(' ');
    $('#plugbot-userlist').append('<h1 style="text-indent:12px;color:#58FAF4;font-size:14px;font-variant:small-caps;">Users: ' + API.getUsers().length + '</h1>');
    if ($('#button-dj-waitlist-view').attr('title') !== '') {
        if ($('#button-dj-waitlist-leave').css('display') === 'block' && ($.inArray(API.getDJs(), API.getSelf()) == -1)) {
            var spot = $('#button-dj-waitlist-view').attr('title').split('(')[1];
            spot = spot.substring(0, spot.indexOf(')'));
            $('#plugbot-userlist').append('<h1 id="plugbot-queuespot"><span style="font-variant:small-caps">Waitlist:</span> ' + spot);
        }
    }
    var users = new Array();
    for (user in API.getUsers())
    {
        users.push(API.getUsers()[user]);
    }
    for (user in users)
    {
        var user = users[user];
        appendUser(user);
    }
}
{
    API.addEventListener(API.USER_SKIP, skip)
    API.addEventListener(API.USER_JOIN, join)
    API.addEventListener(API.USER_LEAVE, leave)
    API.addEventListener(API.VOTE_UPDATE, vote)
    API.addEventListener(API.VOTE_SKIP, voteskip)
    API.addEventListener(API.MOD_SKIP, modskip)
    API.addEventListener(API.DJ_ADVANCE, advance)
    function modskip(data)
    {
        populateUserlist()
    }
    function voteskip(data)
    {
        populateUserlist()
    }
    function advance(data)
    {
        populateUserlist()
    }
    function vote(data)
    {
        populateUserlist()
    }
    function leave(data)
    {
        populateUserlist()
    }
    function join(data)
    {
        populateUserlist()
    }
    function skip(data)
    {
        populateUserlist()
    }
}
function appendUser(user)
{
    var username = user.username;
    var permission = user.permission;
    if (user.admin) {
        permission = 99;
    }
    var imagePrefix;
    switch (permission) {
        case 0:		// Normal user
            imagePrefix = 'normal'
            break;
        case 1:		// Featured DJ
            imagePrefix = 'featured';
            break;
        case 2:		// Bouncer
            imagePrefix = 'bouncer';
            break;
        case 3:		// Manager
            imagePrefix = 'manager';
            break;
        case 4:
        case 5: 	// Co-host
            imagePrefix = 'host';
            break;
        case 99:	// Admin
            imagePrefix = 'admin';
            break;
    }
    if (API.getDJs()[0].username == username) {
        if (imagePrefix === 'normal') {
            drawUserlistItem('void', '#42A5DC', username);
        } else {
            drawUserlistItem(imagePrefix + '_current.png', '#42A5DC', username);
        }
    } else if (imagePrefix === 'normal') {
        drawUserlistItem('void', colorByVote(user.vote), username);
    } else {
        drawUserlistItem(imagePrefix + imagePrefixByVote(user.vote), colorByVote(user.vote), username);
    }
}
function colorByVote(vote) {
    if (!vote)	{
        return '#fff'; // blame Boycey
    }
    switch (vote) {
        case -1: 	return '#F43636';
        case 0:		return '#FFFFF';
        case 1:		return '#95F436';
    }
}
function imagePrefixByVote(vote) {
    if (!vote) {
        return '_undecided.png'; // blame boycey again
    }
    switch (vote) {
        case -1:	return '_meh.png';
        case 0:		return '_undecided.png';
        case 1:		return '_woot.png';
    }
}
function drawUserlistItem(imagePath, color, username) {
    if (imagePath !== 'void') {
        var realPath = 'http://www.theedmbasement.com/basebot/userlist/' + imagePath;
        $('#plugbot-userlist').append('<img src="' + realPath + '" align="left" style="margin-left:6px; position: absolute; margin-top: .3%;" />');
    }
    $('#plugbot-userlist').append(
        '<p style="cursor:pointer;' + (imagePath === 'void' ? '' : 'text-indent:24px !important;')
            + 'color:' + color + ';'
            + ((API.getDJs()[0].username == username) ? 'font-size:12px;font-weight:bold;' : '')
            + '" onclick="$(\'#chat-input-field\').val($(\'#chat-input-field\').val() + \'@' + username + ' \').focus();">' + username + '</p>'
    );
}

/*AppendToChat*/
function appendToChat(message, from, color){
    style = "";
    if (color) style = 'style="color:' + color + ';"';
    if (from)
        div = $('<div class="chat-message"><span class="chat-from" ' + style + '>' + from + '</span><span class="chat-text" ' + style + '>: ' + message + '</span></div>')[0];
    else
        div = $('<div class="chat-message"><span class="chat-text" ' + style + ' >' + message + '</span></div>')[0];
    scroll = false;
    if ($("#chat-messages")[0].scrollHeight - $("#chat-messages").scrollTop() == $("#chat-messages").outerHeight())
        scroll = true;
    var curChatDiv = Popout ? Popout.Chat.chatMessages : Chat.chatMessages;
    var s = curChatDiv.scrollTop()>curChatDiv[0].scrollHeight-curChatDiv.height()-20;
    curChatDiv.append(div);
    if (s)
        curChatDiv.scrollTop(curChatDiv[0].scrollHeight);
}
/*Different chat message types*/
var systemChat = function(from, message){
    Models.chat.receive({
        type: "system",
        from: from,
        message: message,
        language: Models.user.data.language
    })
};
var messageChat = function(from, message){
    Models.chat.receive({
        type: "message",
        from: from,
        message: message,
        language: Models.user.data.language
    })
};
var emoteChat = function(from, message){
    Models.chat.receive({
        type: "emote",
        from: from,
        message: message,
        language: Models.user.data.language
    })
};
var modChat = function(from, message){
    Models.chat.receive({
        type: "moderation",
        from: from,
        message: message,
        language: Models.user.data.language
    })
};
var mentionChat = function(from, message){
    Models.chat.receive({
        type: "mention",
        from: from,
        message: message,
        language: Models.user.data.language
    })
};
var skipChat = function(from, message){
    Models.chat.receive({
        type: "skip",
        from: from,
        message: message,
        language: Models.user.data.language
    })
};
var updateChat = function(from, message){
    Models.chat.receive({
        type: "update",
        from: from,
        message: message,
        language: Models.user.data.language
    })
};
/*ChatCommands*/
var customChatCommand = function(value) {
    if (Models.chat._chatCommand(value) === true)
        return true;
    if (value.indexOf("/cmd") === 0) {
        appendToChat("<center><strong>User Commands -</strong></center><br>" +
        "<strong>'/change'</strong> - <em>displays the changelog for this version</em><br>" +
        "<strong>'/deltab'</strong> - <em>Deletes the P.P userlist tab</em><br>" +
        "<strong>'/nick'</strong> - <em>change username</em>" +
        "<strong>'/avail'</strong> - <em>set status available</em><br>" +
        "<strong>'/afk'</strong> - <em>set status afk</em><br>" +
        "<strong>'/work'</strong> - <em>set status working</em><br>" +
        "<strong>'/sleep'</strong> - <em>set status sleeping</em><br>" +
        "<strong>'/join'</strong> - <em>joins dj booth/waitlist</em><br>" +
        "<strong>'/leave'</strong> - <em>leaves dj booth/waitlist</em><br>" +
        "<strong>'/woot'</strong> - <em>woots current song</em><br>" +
        "<strong>'/meh'</strong> - <em>mehs current song</em><br>" +
        "<strong>'/emotes'</strong> - <em>prints the commands for chat responses</em><br>" +
        "<strong>'/hide'</strong> - <em>hides the video without muting the sound</em><br>" +
        "<strong>'/ref'</strong> - <em>refreshes the video/soundcloud</em><br>" +
        "<strong>'/alertsoff'</strong> - <em>turns curate notices and user join/leave messages off</em><br>" +
        "<strong>'/alertson'</strong> - <em>turns curate notices and user join/leave messages on</em><br>" +
        "<strong>'/getpos'</strong> - <em>get current waitlist position</em><br>" +
        "<strong>'/version'</strong> - <em>displays version number</em><br>", null, "#F700FA");
        if (Models.room.data.staff[API.getSelf().id] && Models.room.data.staff[API.getSelf().id] > 1) {
            appendToChat("<center><strong>Moderation Commands -</strong></center><br>" +
            "<strong>'/skip'</strong> - <em>skips current song</em><br>" +
            "<strong>'/kick (username)'</strong> - <em>kicks targeted user</em><br>" +
            "<strong>'/add (username)'</strong> - <em>adds targeted user to dj booth/waitlist</em><br>" +
            "<strong>'/remove (username)'</strong> - <em>removes targeted user from dj booth/waitlist</em><br>" +
            "<strong>'/whois (username)'</strong> - <em>gives general information about user</em><br>" +
            "<strong>'/history'</strong> - <em>skips the current song and announces that it was in the history</em><br>", null, "#FF0000");
        }
        return true;
    }
    if (value.indexOf("/emotes") === 0) {
        appendToChat("<center><strong>Emotes -</strong></center>" +
            "<strong>'/wut'</strong> - <em>Willett must have said something, you give a look of disgust</em><br>" +
            "<strong>'/eyeroll'</strong> - <em>You roll your eyes in dissaproval</em><br>" +
            "<strong>'/boxofwats'</strong> - <em>You lack the vocabulary to describe how weird that last post was, so you provide a box of wats instead</em><br>" +
            "<strong>'/420'</strong> - <em>You look a little high...</em><br>" +
            "<strong>'/yuno'</strong> - <em>Y U NO USE THIS EMOTES!?</em><br>" +
            "<strong>'/fans'</strong> - <em>That random foreign guy keeps asking for fans again, help him out!</em><br>" +
            "<strong>'/cry'</strong> - <em>Dem feels</em><br>" +
            "<strong>Protip: </strong>Replace the slash in front of a command with a '.' and put a message after it to add the emote to the message!"
            , null, "#66FFFF");
        return true;
    }
//Response commands
    if (value.indexOf("^") === 0) {
        API.sendChat("↑");
        return true;
    }
   if (/^.wut (.*)$/.exec(value)) {
        if(!recentEmote){
        setTimeout(function() {API.sendChat(RegExp.$1+" ಠ_ಠ")}, 50);
       recentEmote = true;
       setTimeout(function(){ recentEmote = false; },60000);
        return true;
        }else{
            appendToChat("Wait until the emote timer is done!", null, "#C50000");
            return true;
        }
    }
    if (/^.eyeroll (.*)$/.exec(value)) {
        if(!recentEmote){
        setTimeout(function(){API.sendChat(RegExp.$1+" ¬_¬")}, 50);
        recentEmote = true;
        setTimeout(function(){ recentEmote = false; },60000);
            return true;
        }else{
            appendToChat("Wait until the emote timer is done!", null, "#C50000");
            return true;
        }
    }
    if (/^.cry (.*)$/.exec(value)) {
        if(!recentEmote){
            setTimeout(function(){API.sendChat(RegExp.$1+"  ಥ_ಥ")}, 50);
            recentEmote = true;
            setTimeout(function(){ recentEmote = false; },60000);
            return true;
        }else{
            appendToChat("Wait until the emote timer is done!", null, "#C50000");
            return true;
        }
    }
    if (/^.420 (.*)$/.exec(value)) {
        if(!recentEmote){
            setTimeout(function(){API.sendChat(RegExp.$1+" ≖‿≖")}, 50);
            recentEmote = true;
            setTimeout(function(){ recentEmote = false; },60000);
            return true;
        }else{
            appendToChat("Wait until the emote timer is done!", null, "#C50000");
            return true;
        }
    }
    if (/^.yuno (.*)$/.exec(value)) {
        if(!recentEmote){
            setTimeout(function(){API.sendChat(RegExp.$1+" ლ(ಥ益ಥლ)")}, 50);
            recentEmote = true;
            setTimeout(function(){ recentEmote = false; },60000);
            return true;
        }else{
            appendToChat("Wait until the emote timer is done!", null, "#C50000");
            return true;
        }
    }
    /*if (/^.flip (.*)$/.exec(value)) {
        if(!recentEmote){
        setTimeout(function(){API.sendChat("(╯°□°）╯︵ ┻━┻ "+ RegExp.$1)}, 50);
        recentEmote = true;
        setTimeout(function(){ recentEmote = false; },60000);
            return true;
        }else{
            appendToChat("Wait until the emote timer is done!", null, "#C50000");
            return true;
        }
    }*/
    if (/^.boxofwats (.*)$/.exec(value)) {
        if(!recentEmote){
        setTimeout(function(){API.sendChat(RegExp.$1+" (>-_-)>[wats]")}, 50);
        recentEmote = true;
        setTimeout(function(){ recentEmote = false; },60000);
            return true;
        }else{
            appendToChat("Wait until the emote timer is done!", null, "#C50000");
            return true;
        }
    }
/*    if (/^.replace (.*)$/.exec(value)) {
        if(!recentEmote){
        setTimeout(function () {API.sendChat("┬─┬ノ( º _ ºノ) "+ RegExp.$1)}, 50);
        recentEmote = true;
        setTimeout(function(){ recentEmote = false; },60000);
            return true;
        }else{
            appendToChat("Wait until the emote timer is done!", null, "#C50000");
            return true;
        }
    }
    if (/^.hitlerflip (.*)$/.exec(value)) {
        if(!recentEmote){
        setTimeout(function() {API.sendChat("(ﾉಥ益ಥ）ﾉ﻿ ┻━┻ "+ RegExp.$1)}, 50);
        recentEmote = true;
        setTimeout(function(){ recentEmote = false; },60000);
            return true;
        }else{
            appendToChat("Wait until the emote timer is done!", null, "#C50000");
            return true;
        }
    }*/
        if (value.indexOf("/wut") === 0) {
            if(!recentEmote){
            setTimeout(function(){API.sendChat("/me ಠ_ಠ ")}, 50);
            recentEmote = true;
                setTimeout(function(){ recentEmote = false; },60000);
                return true;
            }else{
            appendToChat("Wait until the emote timer is done!", null, "#C50000");
                return true;
            }
        }
		        if (value.indexOf("/420") === 0) {
            if(!recentEmote){
            setTimeout(function(){API.sendChat("/me ≖‿≖")}, 50);
            recentEmote = true;
                setTimeout(function(){ recentEmote = false; },60000);
                return true;
            }else{
            appendToChat("Wait until the emote timer is done!", null, "#C50000");
                return true;
            }
        }
        if (value.indexOf("/eyeroll") === 0) {
            if(!recentEmote){
            setTimeout(function(){API.sendChat("/me ¬_¬")}, 50);
            recentEmote = true;
            setTimeout(function(){ recentEmote = false; },60000);
            return true;
            }else{
                appendToChat("Wait until the emote timer is done!", null, "#C50000");
                return true;
            }
        }
/*        if (value.indexOf("/flip") === 0) {
            if(!recentEmote){
            setTimeout(function(){API.sendChat("/me (╯°□°）╯︵ ┻━┻ ")}, 50);
            recentEmote = true;
            setTimeout(function(){ recentEmote = false; },60000);
            return true;
            }else{
                appendToChat("Wait until the emote timer is done!", null, "#C50000");
                return true;
            }
        }*/
        if (value.indexOf("/boxofwats") === 0) {
            if(!recentEmote){
            setTimeout(function(){API.sendChat("/me (>-_-)>[wats]")}, 50);
            recentEmote = true;
            setTimeout(function(){ recentEmote = false; },60000);
            return true;
            }else{
                appendToChat("Wait until the emote timer is done!", null, "#C50000");
                return true;
            }
        }
    if (value.indexOf("/yuno") === 0) {
        if(!recentEmote){
            setTimeout(function(){API.sendChat("/me ლ(ಥ益ಥლ)")}, 50);
            recentEmote = true;
            setTimeout(function(){ recentEmote = false; },60000);
            return true;
        }else{
            appendToChat("Wait until the emote timer is done!", null, "#C50000");
            return true;
        }
    }
    if (value.indexOf("/cry") === 0) {
        if(!recentEmote){
            setTimeout(function(){API.sendChat("/me ಥ_ಥ")}, 50);
            recentEmote = true;
            setTimeout(function(){ recentEmote = false; },60000);
            return true;
        }else{
            appendToChat("Wait until the emote timer is done!", null, "#C50000");
            return true;
        }
    }
/*        if (value.indexOf("/replace") === 0) {
            if(!recentEmote){
            setTimeout(function () {API.sendChat("/me ┬─┬ノ( º _ ºノ)")}, 50);
            recentEmote = true;
            setTimeout(function(){ recentEmote = false; },60000);
            return true;
            }else{
                appendToChat("Wait until the emote timer is done!", null, "#C50000");
                return true;
            }
        }
        if (value.indexOf("/hitlerflip") === 0) {
            if(!recentEmote){
            setTimeout(function() {API.sendChat("/me (ﾉಥ益ಥ）ﾉ﻿ ┻━┻ ")}, 50);
            recentEmote = true;
            setTimeout(function(){ recentEmote = false; },60000);
            return true;
            }else{
                appendToChat("Wait until the emote timer is done!", null, "#C50000");
                return true;
            }
        }*/
    //Moderation
    if (value.indexOf("/history") === 0) {
        if (Models.room.data.staff[API.getSelf().id] > 1){
            new ModerationForceSkipService();
            setTimeout(function(){API.sendChat("/me skipped because the song was in the history")}, 200);
            return true;
        }else{
            modChat("", "Sorry, you have to be at least a bouncer to do that.");
            return true;
        }
    }
    if (value.indexOf("/skip") === 0) {
        if (Models.room.data.staff[API.getSelf().id] > 1){
            new ModerationForceSkipService();
        return true;
        }else{
            modChat("","Sorry, you have to be at least a bouncer to do that.");
            return true;
        }
    }
    if (/^\/kick (.*)$/.exec(value)) {
        if (Models.room.data.staff[API.getSelf().id] > 1){
        target = RegExp.$1;
        kick();
        return true;
        }else{
            modChat("","Sorry, you have to be at least a bouncer to do that.");
            return true;
        }
    }
/*    if (/^\/afkkick (.*)$/.exec(value)) {
        target = RegExp.$1;
        afkkick();
        return true;
    }*/
    if (/^\/remove (.*)$/.exec(value)) {
        if (Models.room.data.staff[API.getSelf().id] > 1){
        target = RegExp.$1;
        removedj();
        return true;
        }else{
            modChat("","Sorry, you have to be at least a bouncer to do that.");
            return true;
        }
    }
    if (/^\/add (.*)$/.exec(value)) {
        if (Models.room.data.staff[API.getSelf().id] > 1){
        target = RegExp.$1;
        adddj();
        return true;
        }else{
            modChat("","Sorry, you have to be at least a bouncer to do that.");
            return true;
        }
    }
    if (/^\/whois (.*)$/.exec(value)) {
        if (Models.room.data.staff[API.getSelf().id] > 1){
        target = RegExp.$1;
        getuserinfo();
        return true;
        }else{
            modChat("","Sorry, you have to be at least a bouncer to do that.");
            return true;
        }
    }
        if (value.indexOf("/lock") === 0) {
            if (Models.room.data.staff[API.getSelf().id] > 2){
            new RoomPropsService(Slug,true,Models.room.data.waitListEnabled,Models.room.data.maxPlays,Models.room.data.maxDJs);
            return true;
        }else{
            modChat("","Sorry, you have to be at least a manager to do that.");
                return true;
            }
        }
        if (value.indexOf("/unlock") === 0) {
            if (Models.room.data.staff[API.getSelf().id] > 2){
            new RoomPropsService(Slug,false,Models.room.data.waitListEnabled,Models.room.data.maxPlays,Models.room.data.maxDJs);
            return true;
        }else{
            modChat("","Sorry, you have to be at least a manger to do that");
            return true;
        }
    }
    //Misc

    if (value.indexOf("/change") === 0) {
        appendToChat(changeLog, null, "#BAFFAB");
        return true;
    }
    if (value.indexOf("/deltab") === 0) {
        var div = document.getElementById("pdpUsersToggle");
        div.parentNode.removeChild(div);
        return true;
    }
    if (value.indexOf("/hide") === 0) {
        $("#plugbot-btn-hidevideo").click();
        return true;
    }
    if (value.indexOf("/fans") === 0) {
        API.sendChat("Have some fans http://i.imgur.com/XHyZS.jpg , http://i.imgur.com/4g3Ir.jpg , http://i.imgur.com/VSn0o.jpg");
        return true;
    }
    if (value == "/avail" || value == "/available") {
        Models.user.changeStatus(0);
        return true;
    }
    if (value == "/brb" || value == "/away") {
        Models.user.changeStatus(1);
        return true;
    }
    if (value == "/work" || value == "/working") {
        Models.user.changeStatus(2);
        return true;
    }
    if (value == "/sleep" || value == "/sleeping") {
        Models.user.changeStatus(3);
        return true;
    }
    if (value == "/idle" || value == "/gaming") {
        Models.user.changeStatus(-1);
        return true;
    }
    if (value.indexOf("/ref") === 0) {
        $("#button-refresh").click();
        return true;
    }
    if (value.indexOf("/join") === 0) {
        API.waitListJoin();
        return true;
    }
    if (value.indexOf("/leave") === 0) {
        API.waitListLeave();
        return true;
    }
    if (value.indexOf("/woot") === 0) {
        $("#button-vote-positive").click();
        return true;
    }
    if (value.indexOf("/meh") === 0) {
        $("#button-vote-negative").click();
        return true;
    }
    if (value.indexOf("/version") === 0) {
        appendToChat(version, null, "#FFFF00");
        return true;
    }
    if (/\/nick (.*)$/.exec(value)) {
        Models.user.changeDisplayName(RegExp.$1);
        return true;
    }
    var playlistID = Models.playlist.selectedPlaylistID
    if (value.indexOf("/curate") === 0) {
        new DJCurateService("playlistID");
        setTimeout(function(){Dialog.closeDialog();},500);
        return true;
    }
    if (value.indexOf("/alertsoff") === 0)
        if (alerts){
            appendToChat("Join/leave/curate alerts disabled", null, "#FFFF00");
            alerts = false;
            return true;
        }
    if (value.indexOf("/getpos") === 0) {
        var spot = $('#button-dj-waitlist-view').attr('title').split('(')[1];
        spot = spot.substring(0, spot.indexOf(')'));
        if (spot !== undefined){
            appendToChat("Waitlist " + spot, null, "#66FFFF");
        }
        else
            appendToChat("Waitlist " + spot, null, "#66FFFF");
        return true;
    }
    if (value.indexOf("/alertson") === 0) {
        if (!alerts){
            appendToChat("Join/leave/curate alerts enabled", null, "#FFFF00");
            alerts = true;
        }
        return true;
    }
    return false;
};

Models.chat._chatCommand = Models.chat.chatCommand;
Models.chat.chatCommand = customChatCommand;
ChatModel._chatCommand = ChatModel.chatCommand;
ChatModel.chatCommand = customChatCommand;

/*AFK Status*/
function chat(data) {
    if (data.type == "mention" && !recent) {
        if (/^\/user\/ (.*)$/.exec(awaymsg)) {
            setTimeout(function() {API.sendChat("@"+data.from+" "+RegExp.$1)}, 50);
        }else{
            API.sendChat(awaymsg);
        recent = true;
        setTimeout(function() { recent = false; },180000);
        }
    }
}
/*AutoJoin Disable/Enable*/
function disable(data) {
    if (data.type == "mention" && Models.room.data.staff[data.fromID] && Models.room.data.staff[data.fromID] >= Models.user.BOUNCER && data.message.indexOf("!disable") > 0) {
        if (autoqueue) {
            $("#plugbot-btn-queue").click();
            setTimeout(function(){ Dialog.closeDialog(); },500);
            API.waitListLeave();
            API.sendChat("@" + data.from + " Autojoin disabled");
        } else
            API.sendChat("@" + data.from + " Autojoin was not enabled");
    }
}

/*Moderation - Kick*/
function kick(data) {
    if (Models.room.data.staff[API.getSelf().id] && Models.room.data.staff[API.getSelf().id] > 1) {
        var usernames = [],id = [],users = API.getUsers();
        for (var i in users) {
            usernames.push(users[i].username);
            id.push(users[i].id);
        }
        if (usernames.indexOf(target) < 0) log("user not found");
        else {
            listlocation = usernames.indexOf(target);
            new ModerationKickUserService(id[listlocation], " ");
        }
    }
}
/*History Check*/
Models.history.load();
var skippedsongs = [];
API.addEventListener(API.DJ_UPDATE, repeatcheck);
function repeatcheck(user) {
    var historylist=Models.history.data;
    var currentID=Models.room.data.media.cid;
    for(var j=1; j<49;j++) {
        if (historylist[j].media.cid == currentID) {
            if ($.inArray(currentID, skippedsongs) == -1) {
                systemChat("","This song is still in the history");
                if (Models.room.data.staff[API.getSelf().id] > 1) {systemChat("", "Type /history to skip this");}
                skippedsongs.push(currentID);
                break;
            }
        }
    }
}

function removedj(data) {
    if (Models.room.data.staff[API.getSelf().id] && Models.room.data.staff[API.getSelf().id] > 1) {
        var usernames = [],id = [],users = API.getUsers();
        for (var i in users) {
            usernames.push(users[i].username);
            id.push(users[i].id);
        }
        if (usernames.indexOf(target) < 0) log("user not found");
        else {
            listlocation = usernames.indexOf(target);
            new ModerationRemoveDJService(id[listlocation]);
        }
    }
}
function adddj(data) {
    if (Models.room.data.staff[API.getSelf().id] && Models.room.data.staff[API.getSelf().id] > 1) {
        var usernames = [],id = [],users = API.getUsers();
        for (var i in users) {
            usernames.push(users[i].username);
            id.push(users[i].id);
        }
        if (usernames.indexOf(target) < 0) log("user not found");
        else {
            listlocation = usernames.indexOf(target);
            new ModerationAddDJService(id[listlocation]);
        }
    }
}
function getuserinfo(data) {
    var usernames = [],atusernames = [],id = [],users = API.getUsers();
    for (var i in users) {
        usernames.push(users[i].username);
        id.push(users[i].id);
    }
    if (usernames.indexOf(target) < 0) log("user not found");
    else {
        listlocation = usernames.indexOf(target);
        var uid = id[listlocation];
        var level = API.getUser(uid).permission;
        var statuscode = API.getUser(uid).status;
        var votecode = API.getUser(uid).vote;
        var mehcount = API.getUser(uid).mehcount;
        if(API.getUser(uid).ambassador == true){
            level = 6
        }
        if(API.getUser(uid).admin == true){
            level = 7
        }

        switch(level){
            case 0:
                var rank = "User";
                break;
            case 1:
                var rank = "Featured DJ";
                break;
            case 2:
                var rank = "Bouncer";
                break;
            case 3:
                var rank = "Manager";
                break;
            case 4:
                var rank = "Co-Host";
                break;
            case 5:
                var rank = "Host";
                break;
            case 6:
                var rank = "Ambassador";
                break;
            case 7:
                var rank = "Admin";
                break;
        }
        switch(statuscode){
            case -1:
                var status = "Idle";
            case 0:
                var status = "Available";
                break;
            case 1:
                var status = "AFK";
                break;
            case 2:
                var status = "Working";
                break;
            case 3:
                var status = "Sleeping";
                break;
        }
        switch(votecode){
            case 0:
                var voted = "Undecided";
                break;
            case -1:
                var voted = "Meh";
                break;
            case 1:
                var voted = "Woot";
                break;
        }

        appendToChat("Name - " + target + "  ||  Rank - " + rank, null, "#cc00cc");
        appendToChat("ID - " + uid, null, "#cc00cc");
        appendToChat("Status - " + status + "  ||  Vote - " + voted, null, "#cc00cc");
        var points = API.getUser(uid).djPoints + API.getUser(uid).curatorPoints + API.getUser(uid).listenerPoints;
        appendToChat("Points - " + points + "  ||  Meh Count - " + mehcount, null, "#cc00cc");

    }


}

/*init*/
$('#plugbot-css').remove();
$('#plugbot-js').remove();
$('body').prepend('<style type="text/css" id="plugbot-css">' +
    '#plugbot-ui { position: absolute; left: 325.9px; top: -601.78px;}' +
    '#plugbot-ui p { border-style: solid; border-width: 1px; border-color: #000; background-color: rgba(10, 10, 10, 0.83); height: 28px; padding-top: 13%; padding-left: 8%; padding-right: 8%; cursor: pointer; font-variant: small-caps; width: 62px; font-size: 13px; margin: 2.5%; }' +
    '#plugbot-userlist {min-width: 8.4%; max-height: 96.96%; overflow-x: hidden; overflow-y: auto; position: absolute; z-index: 99; border-style: solid; border-width: 1px; border-color: #000; background-color: rgba(10, 10, 10, 0.83); border-left: 0 !important; padding: 8px 0px 20px 0px; max-width: 12.5%; position: absolute; }' +
    '#plugbot-userlist p {padding-right: 10px; overflow: scroll; z-index: 100; margin: 0; padding-top: 2px; text-indent: 24px; font-size: 10px; }' +
    '#plugbot-userlist p:first-child { padding-top: 0px !important; }' +
    '#plugbot-queuespot { color: #58FAF4; text-align: left; font-size: 15px; margin-left: 8px }');
for(index in API.getUsers()){if (API.getUsers()[index].mehcount==undefined){API.getUsers()[index].mehcount=0}}


/*init*/

$('#plugbot-userlist').remove();
$('#plugbot-css').remove();
$('#plugbot-js').remove();


$('body').prepend('<style type="text/css" id="plugbot-css">'
    + '#plugbot-ui { position: absolute; left: 325.9px; top: -601.78px;}'
    + '#plugbot-ui p { border-style: solid; border-width: 1px; border-color: #000; background-color: rgba(10, 10, 10, 0.83); height: 28px; padding-top: 13%; padding-left: 8%; padding-right: 8%; cursor: pointer; font-variant: small-caps; width: 62px; font-size: 13px; margin: 2.5%; }'
    + '#plugbot-ui h2 { border-style: solid; border-width:  1px; border-color: #000 ; height: 9000px; width: 156px; margin: 2.5%; color: #fff; font-size: 12px; font-variant: small-caps; padding: 8px 0 0 13px; }'
    + '#plugbot-userlist {min-width: 8.4%; max-height: 96.96%; overflow-x: hidden; overflow-y: auto; position: absolute; z-index: 99; border-style: solid; border-width: 1px; border-color: #000; background-color: rgba(10, 10, 10, 0.83); border-left: 0 !important; padding: 8px 0px 20px 0px; max-width: 12.5%; }'
    + '#plugbot-userlist p {padding-right: 10px; margin: 0; padding-top: 4px; text-indent: 24px; font-size: 10px; }'
    + '#plugbot-userlist p:first-child { padding-top: 0px !important; }'
    + '#plugbot-queuespot { color: #58FAF4; text-align: left; font-size: 15px; margin-left: 8px }');

$("#button-vote-positive").click();

initAPIListeners();
$('body').append('<div id="plugbot-userlist"></div>');
populateUserlist();
displayUI();
initUIListeners();
