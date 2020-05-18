const path=require('path')
const http =require('http')
const express= require('express')
const socketio=require('socket.io')
const Filter=require('bad-words')
const {generateMessage,generateLocationMessage}=require('./utils/messages')
const{addUser,removeUser,getUser,getUserInRoom}=require('./utils/users')







const app = express()
const server = http.createServer(app)


const port = process.env.PORT||3000
const publicDirectPath=path.join(__dirname,'../public')

app.use(express.static(publicDirectPath))



server.listen(port,()=>{
    console.log(`Server is up on port ${port}`)
})

//Chat Server

var io = socketio.listen(server)

io.on('connection',function(socket) {

    //The moment one of your client connected to socket.io server it will obtain socket id
    //Let's print this out.
    console.log(`Connection : SocketId = ${socket.id}`)
    //Since we are going to use userName through whole socket connection, Let's make it global.   
    var userName = '';
    var roomName = '';
    
    socket.on('subscribe', function(data) {
        console.log('subscribe trigged')
        var room_data=data;
        try{
            room_data = JSON.parse(data)
            console.log("OnSubscribe: It is a mobile user");
        }catch(e){
            console.log("OnSubscribe: It is a web user");
        }
        
        console.log(data);
        userName = room_data.userName;
        roomName = room_data.roomName;
    
        socket.join(`${roomName}`)
        console.log(`User joined, username : ${userName} joined Room Name : ${roomName}`)
        
       

         socket.broadcast.to(`${roomName}`).emit('newUserToChatRoom',userName);
       // io.to(`${roomName}`).emit('newUserToChatRoom',userName);

    })

    socket.on('unsubscribe',function(data) {
        console.log('unsubscribe trigged')
        var room_data = data;

        try{
            room_data = JSON.parse(data)
            console.log("on Unsubscribe: It is a mobile user");
        }catch(e){
            console.log(e);
            console.log("on Unubscribe: It is a web user");
        }
        const userName = room_data.userName;
        const roomName = room_data.roomName;
    
        console.log(`Username : ${userName} leaved Room Name : ${roomName}`)
        socket.broadcast.to(`${roomName}`).emit('userLeftChatRoom',`${userName}`)
        socket.leave(`${roomName}`)
    })

    socket.on('newMessage',function(data) {
        console.log('newMessage triggered')
        var messageData = data;
        try{
            messageData = JSON.parse(data)
            console.log("It is a mobile app user message");
        }catch(e){
            console.log(e);
            console.log("It is a web app user message");
        }

        console.log('newMessage data passed: ' + messageData);
        const messageContent = messageData.messageContent
        const roomName = messageData.roomName

        console.log(`Room Name: ${roomName} ${userName} : ${messageContent}`)
        
        // Just pass the data that has been passed from the writer socket
        const chatData = {
            userName : userName,
            messageContent : messageContent,
            roomName : roomName
        }
        //io.to(`${roomName}`).emit('updateChat',JSON.stringify(chatData)) // Need to be parsed into Kotlin object in Kotlin
        socket.broadcast.to(`${roomName}`).emit('updateChat',JSON.stringify(chatData)) // Need to be parsed into Kotlin object in Kotlin
    })


    socket.on('disconnect', function () {
        console.log("One of sockets disconnected from our server.")
        console.log(`Username : ${userName} leaved Room Name : ${roomName}`)
        socket.broadcast.to(`${roomName}`).emit('userLeftChatRoom',`${userName}`)
        socket.leave(`${roomName}`)
    });
})