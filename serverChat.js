var io = require('socket.io')();
// 引入underscore库
var _ = require("underscore")._;
global.user = [];

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
        let offUser = _.findWhere(global.user, {id: socket.id});
        io.emit('offline', offUser);
    });

    socket.on('login', (clientUser) => {
        let serverUser = clientUser;
        serverUser.id = socket.id;
        if(global.user.indexOf(serverUser.id) == -1){
            global.user.push(serverUser);
        }
        socket.broadcast.emit('login', serverUser);
        socket.emit('loginOne', global.user);
    });

    socket.on('chat message', (clientUser) => {
        let chatUser = clientUser;
        chatUser.id = socket.id;
        console.log('message: ' + chatUser.msg);
        io.emit('chat message', chatUser);
    });

    socket.on('chatImg', (clientUser) => {
        let chatUser = clientUser;
        chatUser.user.id = socket.id;
        console.log(chatUser);
        io.emit('sendImg', chatUser);
    });

    socket.on('toOne', (oneMsg) => {
        let toSocket = _.findWhere(io.sockets.sockets, {id: oneMsg.id});
        console.log(toSocket);
        let toMsg = oneMsg;
        toSocket.emit('receiveOne', toMsg);
        socket.emit('fromOne', "");
    });

});

exports.listen = function (server) {
    io.listen(server);
}