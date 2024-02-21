//uuid - library
//ejs - viewengine/pakage
//express-framework
//nodemon-pakage

const express = require('express');            //import express framework
const { ExpressPeerServer } = require('peer');
const app = express();
const server = require('http').Server(app);   //import http and make express instance server.
const { v4: uuid4 } = require('uuid');        //uuid helps to generate the unique id
const io = require('socket.io')(server);

const PeerServer=ExpressPeerServer(server,{
    debug:true
});

app.set('view engine', 'ejs');
app.use(express.static('public'))   //saying server that public file is there and we are gone to put the js and css files oveerthere and take it them from there

app.use('/peerjs',PeerServer);

app.get('/', (req, res) => {    //ed6 req and res
    res.redirect(`/${uuid4()}`);    //Its going to generate the new id and redirect it to client

})

app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room }); //which file we are going to render simply which .ejs file we are going to read
})

//Telling socket that we join room  
io.on('connection', (socket) => { //when user connect
    socket.on('join-room', (roomId,userId) => {
        console.log('joinroom')
        socket.join(roomId);
        socket.to(roomId).emit('user-connected',userId);
    })
});

server.listen(3030);    //3030 number na port pr server have server accept krse requests or connection


/*
const express = require('express')
const app = express()
// const cors = require('cors')
// app.use(cors())
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});
const { v4: uuidV4 } = require('uuid')

app.use('/peerjs', peerServer);

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId);
    // messages
    socket.on('message', (message) => {
      //send message to the same room
      io.to(roomId).emit('createMessage', message)
  }); 

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
})

server.listen(process.env.PORT||3030)*/