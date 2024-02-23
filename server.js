//uuid - library
//ejs - viewengine/pakage
//express-framework
//peerjs
//nodemon-pakage

const express = require('express');            //import express framework
const app = express();
const server = require('http').Server(app);   //import http and make express instance server.
const { v4: uuid4 } = require('uuid');        //uuid helps to generate the unique id
const io = require('socket.io')(server);
const { ExpressPeerServer } = require('peer');
// const Peer = require('peerjs');
const peerServer = ExpressPeerServer(server, {
  debug: true
});

app.set('view engine', 'ejs');
app.use(express.static('public'))   //saying server that public file is there and we are gone to put the js and css files oveerthere and take it them from there

app.use('/peerjs', peerServer);

app.get('/', (req, res) => {    //ed6 req and res
  res.redirect(`/${uuid4()}`);    //Its going to generate the new id and redirect it to client

})

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room }); //which file we are going to render simply which .ejs file we are going to read
})

//Telling socket that we join room  
io.on('connection', (socket) => { //when user connect
  socket.on('join-room', (roomId, userId) => {
    console.log('joinroom')
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', userId);
    socket.on('message',message=>{
      io.to(roomId).emit('createMessage',message);
    })
  })
});

server.listen(3030);    //3030 number na port pr server have server accept krse requests or connection

