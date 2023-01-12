
const sendbtn = document.getElementById('sendbtn');

let chatsarrFinal = [];

let messageInput = document.getElementById('message');
// let lastChecked = null;


// let isTyping = false;

// messageInput.addEventListener('input', () => {
//     isTyping = true;
// });

// messageInput.addEventListener('blur', () => {
//     isTyping = false;
// });

window.addEventListener('load', () => {

    const token = localStorage.getItem('token');
    const lastMessageId = localStorage.getItem('lastMessageId');
    console.log(lastMessageId);
    let oldMessages = localStorage.getItem('oldMessages');
    

    axios.get(`http://localhost:3000/chats?lastMessageID=${lastMessageId}`, { headers: { Authorization: token } })

        .then(response => {

            console.log(response);
            const newmessages = response.data.chats; //new messages
            
            if (oldMessages) {

                const oldMessagesParsed  = JSON.parse(oldMessages);
                chatsarrFinal = [...oldMessagesParsed, ...newmessages];
                console.log(chatsarrFinal);
                
                chatsarrFinal.forEach(chat => {

                    displayMessage(chat);


                });
            }
            else {

                chatsarrFinal = newmessages;
                chatsarrFinal.forEach(chat => {

                    displayMessage(chat);

                });

            }
            if(chatsarrFinal.length > 10) {

                    chatsarrFinal = chatsarrFinal.slice(chatsarrFinal.length - 10);
                    localStorage.setItem('oldMessages', JSON.stringify(chatsarrFinal));
                    localStorage.setItem('lastMessageId', chatsarrFinal[chatsarrFinal.length - 1].id);
            }
            
            
        })
        .catch(err => {

            console.log(err);
        });
});
// function checkForUpdates() {
    
//     if (!isTyping) {
//         //make the request to server
//         const currentTime = Date.now();
//         if (!lastChecked || currentTime - lastChecked > 1000) {
//             lastChecked = currentTime;
//             const token = localStorage.getItem('token');
//             axios.get('http://localhost:3000/chats', { headers: { Authorization: token } })
//                 .then(response => {
//                     console.log(response);
//                     chatsarrFinal = response.data.chats;
//                     chatsarrFinal.forEach(chat => {
//                         displayMessage(chat);
//                     });
//                 })
//                 .catch(err => {
//                     console.log(err);
//                 });
//         }
//     }
// }
// setInterval(checkForUpdates, 1000);


sendbtn.addEventListener('click', (e) => {

    e.preventDefault();
    const message = document.getElementById('message').value;
    const token = localStorage.getItem('token');
    axios.post('http://localhost:3000/chats', { message }, { headers: { Authorization: token } }).then(response => {

        console.log(response);

        //reload the page
        window.location.reload();

}).catch(err => {

        console.log(err);
    })
})

function displayMessage(row) {

    const chatbox = document.getElementById('chatbox');
    const div = document.createElement('div');
    div.setAttribute('id', 'chat-item');
    div.innerHTML = `${row.User.name} : ${row.message}`;
    chatbox.appendChild(div);
}