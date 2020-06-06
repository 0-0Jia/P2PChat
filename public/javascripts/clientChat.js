var socket = io();

socket.on('offline', function (serverUser) {
    console.log(serverUser)
    addAlert("uk-alert-danger",serverUser.name? serverUser.name:"游客","离开聊天");
    removeDom(serverUser.id);
    userOnline.splice(userOnline.indexOf(serverUser.id), 1);
    setTimeout(() => {
        UIkit.alert(document.getElementsByClassName("uk-alert-danger")[0]).close();
    }, 2000);
})

socket.on('login', function (serverUser) {
    userOnline.push(serverUser.id);
    addAlert("uk-alert-primary",serverUser.name,"加入聊天");
    addMember("beforeend", serverUser.src, serverUser.name, serverUser.group, serverUser.id);
    setTimeout(() => {
        UIkit.alert(document.getElementsByClassName("uk-alert-primary")[0]).close();
    }, 2000);
})

socket.on('loginOne', function (users) {
    for(let i = 0; i < users.length; i++){
        if(userOnline.indexOf(users[i].id) == -1){
            userOnline.push(users[i].id);
            if(socket.id == users[i].id){
                addMember("afterbegin", users[i].src, users[i].name, users[i].group, users[i].id);
            }else {
                addMember("beforeend", users[i].src, users[i].name,users[i].group, users[i].id);
            }
        }
    }
})

socket.on('chat message', function (serverUser) {
    if(userOnline.indexOf(serverUser.id) == -1){
        userOnline.push(serverUser.id);
        addMember("beforeend", serverUser.src, serverUser.name, serverUser.group, serverUser.id);
    }
    if(socket.id == serverUser.id){
        addMessage( "cright", serverUser.src, serverUser.name, serverUser.msg);
    }else{
        addMessage( "cleft", serverUser.src, serverUser.name, serverUser.msg);
    }
});

socket.on('sendImg', function (server) {
    if(userOnline.indexOf(server.user.id) == -1){
        userOnline.push(server.user.id);
        addMember("beforeend", server.user.src, server.user.name, server.user.group, server.user.id);
    }
    if(socket.id == server.user.id){
        addImg( "cright", server.user.src, server.user.name, server.uploadImg);
    }else{
        addImg( "cleft", server.user.src, server.user.name, server.uploadImg);
    }
});

socket.on('receiveOne', function (msgObj) {
    UIkit.notification({
        message: msgObj.from.name + "(" + msgObj.from.group + ")" + "： " + msgObj.msg,
        status: 'primary',
        pos: 'bottom-right',
        timeout: 10000
    });
});

socket.on('fromOne', function () {
    alert("发送成功啦~")
});

