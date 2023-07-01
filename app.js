const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const { v4 } = require('uuid')
const port = process.env.PORT || 3000;


app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
})

const offers = [];

io.on('connection', socket => {
    console.log("Client connecté");
    
    socket.on('join-room', roomId => {
        // Le client rejoint la room socket
        socket.join(roomId);

        // Garde l'id de la room avec l'objet du canal
        socket.roomId = roomId
        console.log(`Client joined room ${socket.roomId}`);

        socket.on('new_user', id => {
            // Notifie les clients connectés qu'un nouveau client vient d'arriver
            socket.to(socket.roomId).emit('new_user', id);
        })
    
        socket.on('init-offer', offerData => {
            // Diffuse l'offre
            socket.to(socket.roomId).emit('process-offer', offerData);
        })
    
        socket.on('init-answer', answerData => {
            // Diffuse la réponse
            socket.to(socket.roomId).emit('process-answer', answerData);
        })
    })
    
    
})

server.listen(port, console.log(`Server opened on port ${port}`));

//Room 1 26654273-3db6-4c7f-95c1-96bcaeafe14c
//Room 2 26654273-3db6-4c7f-95c1-96bcaeafe14e