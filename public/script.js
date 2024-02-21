const socket=io('/');
const videoGrid=document.getElementById('video-grid');
console.log(videoGrid);
const myvideo=document.createElement('video');
myvideo.muted=true;

var peer=new Peer(undefined,{
    path:'/peerjs',
    host:'/',
    port:'3030'
})

let myvideoStream;

navigator.mediaDevices.getUserMedia({ //we can attemp to access the webcame and mike of client through this.
    video:true,
    audio:true
}).then(stream=>{
    addvideostream(myvideo,stream);
})


peer.on('open',id=>{
    socket.emit('join-room',ROOM_ID,id);
    
});

//Telling socket that we join room 

socket.on('user-connected',(userId)=>{
// socket.emit('join-room',ROOM_ID);
    connectToNewUser(userId);
    // console.log(userId);
});


const connectToNewUser=(userId)=>{
    console.log(userId);
}

const addvideostream=(video,stream)=>{
    video.srcObject=stream;
    video.addEventListener('loadedmetadata',()=>{
        video.play();
    })
    videoGrid.append(video);
}
