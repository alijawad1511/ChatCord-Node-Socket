// Index Page
const select = document.getElementById('room');

// Chat Page
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');


// Get Username and Room from URL using qs cdn script added in chat.html
const { username,room } = Qs.parse(location.search,{  // location.search = URL in Search Input in Location Window
    ignoreQueryPrefix: true  // ignore extra characters in URL
})



const socket = io();

// Join Chatroom
socket.emit('joinRoom',{ username,room });

// Get Room and Users
socket.on('roomUsers',({ room,users }) => {
    outputRoomName(room);
    outputUsers(user);
});


// Mesasge from Server
socket.on('message',message => {
    console.log(message);
    outputMessage(message);

    chatMessages.scrollTop = chatMessages.scrollHeight;
});


// Message Submit
chatForm.addEventListener('submit',(e) => {
    e.preventDefault();

    // Get message text from input element
    const msg = e.target.elements.msg.value;

    //Emit message to server
    socket.emit('chatMessage',msg);

    // Clear Input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});


// Output Message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}


// Add Room Name to DOM
function outputRoomName(room) {
    roomName.innerHTML = room;
}


// Add Users List to DOM
function outputUsers(users) {
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`.join(''))}
    `;
}