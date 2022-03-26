const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = require('express')();
var http = require('http').Server(app);
const io = require('socket.io')(http);
const fs = require('fs');

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

let Rooms = [];
let Ani = fs.readFileSync("./src/animais.txt").toString('utf-8').split("\n");

io.on('connection', function(socket) {
   
    socket.on('join_room', async (data) => {
        let room = Rooms.find(Element => Element.RoomCode === data.RoomCode);
        let User = data.User;
        User.point = 0;
        if(room){
            room.Users.push(User);
            Rooms[Rooms.findIndex(Element => Element.RoomCode === data.RoomCode)] = room;
            socket.join(data.RoomCode);
            io.sockets.in(data.RoomCode).emit('connectToRoom', {room, User});
            io.sockets.in(data.RoomCode).emit('messege', {name:'Game',msg: User.username + " Joined in the game"});  
            console.log(User.username + " joined in : " + data.RoomCode);
        } else {
            Rooms.push({
                RoomCode : data.RoomCode,
                Users:[User]
            })

            let room = Rooms.find(Element => Element.RoomCode === data.RoomCode);
            room.MasterUser = User._id;
            socket.join(data.RoomCode);
            io.sockets.in(data.RoomCode).emit('connectToRoom', {room, User});
            io.sockets.in(data.RoomCode).emit('messege', {name:'Game',msg: User.username + " Joined in the game"});
            console.log(User.username + " created a room :  " + data.RoomCode);
        }
    })

    socket.on('messegeSend', async(data) => {
        io.sockets.in(data.RoomCode).emit('messege', {name:data.User.username, msg:data.msg});
    })
    
    socket.on('startGameRoom', async(data) =>{
        data.objective = RandoAnimal();
        io.sockets.in(data.RoomCode).emit('startGame', data);
    });

    socket.on('game_turn_next_send', async(data) => {
        let room = data;
        room.objective = RandoAnimal();
        if(room.turnId === room.Users.length-1)
            room.turnId = 0;
        else
            room.turnId += 1;

        io.sockets.in(data.RoomCode).emit('game_turn_next', room);
    })

    socket.on('add_pointer', async(data) => {
            if(data.Room.Users[data.Room.turnId]._id !== data.UserId)
                return
            io.sockets.in(data.Room.RoomCode).emit('broadcast', data);
    });

    socket.on('u_add_point', async(data) => {
        io.sockets.in(data.RoomCode).emit('add_u_point', data);
    })

});

const RandoAnimal = () => Ani[Math.floor(random(1, Ani.length)-1)];
const random = (mn, mx) => Math.random() * (mx - mn) + mn;  

require('./app/controllers/index')(app);
require('./view/auth')(app);

http.listen(process.env.PORT, () => {

    console.log('listening on *:' + process.env.PORT);

});
