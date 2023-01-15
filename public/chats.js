
const sendbtn = document.getElementById('sendbtn');

let chatsarrFinal = [];

let messageInput = document.getElementById('message');

let currentGroup;

const chatbox = document.getElementById('chatbox');
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
  
    axios.get(`http://localhost:3000/groups`, { headers: { Authorization: token } })

        .then( groups => {

            console.log(groups);
            groups.data.groups.forEach(group => {

                displayGroup(group);
            });
        }
        ).catch(err => {

            console.log(err);
        })


});



sendbtn.addEventListener('click', (e) => {

    e.preventDefault();
    //get group id from inner html of group link
    let gid = currentGroup;
    console.log(gid);
    const message = document.getElementById('message').value;
    const token = localStorage.getItem('token');
    axios.post(`http://localhost:3000/chats/${gid}`, { message }, { headers: { Authorization: token } }).then(response => {

        console.log(response);


}).catch(err => {

        console.log(err);
    })
})

function displayMessage(row) {

    const div = document.createElement('div');
    div.setAttribute('id', 'chat-item');
    div.innerHTML = `${row.User.name} : ${row.message}`;
    chatbox.appendChild(div);
}

function displayGroup(group) {
    
    console.log(group);
    const groupbox = document.getElementById('groupbox');
    const li = document.createElement('li');+
    li.classList.add('group-item');
    li.innerHTML = `<a href="#${group.id}" id="group-link-${group.id}">${group.name}</a>`;
    groupbox.appendChild(li);
    const groupLink = document.getElementById(`group-link-${group.id}`);
    
    groupLink.addEventListener('click', (e) => {
        
        e.preventDefault();
        const token = localStorage.getItem('token');
        const groupid = e.target.getAttribute('href').slice(1);
        currentGroup = groupid;
        axios.get(`http://localhost:3000/chats/${groupid}` , { headers: { Authorization: token } })
        .then(response => {
                chatbox.innerHTML = '';
                console.log(response);
                const chats = response.data.chats;
                chats.forEach(chat => {
                    
                    displayMessage(chat);
                });
           
        })
        .catch(err => {
            console.log(err);
        });
    });

}

const notificationBar = document.getElementById("notification-bar");
const notificationMessage = document.getElementById("notification-message");
const closeBtn = document.getElementById("close-btn");

// show the notification bar
notificationBar.style.display = "block";
notificationMessage.innerHTML = "Welcome to the Group Chat Application!";

// close the notification bar when the close button is clicked
closeBtn.addEventListener("click", function() {
    notificationBar.style.display = "none";
});


    








// const token = localStorage.getItem('token');
//     // const lastMessageId = localStorage.getItem('lastMessageId');
//     // console.log(lastMessageId);
//     // let oldMessages = localStorage.getItem('oldMessages');
    

//     axios.get(`http://localhost:3000/groups`, { headers: { Authorization: token } })

//         .then(response => {

//             console.log(response);
//             // const newmessages = response.data.chats; //new messages
            
//             if (oldMessages) {

//                 const oldMessagesParsed  = JSON.parse(oldMessages);
//                 chatsarrFinal = [...oldMessagesParsed, ...newmessages];
//                 console.log(chatsarrFinal);
                
//                 chatsarrFinal.forEach(chat => {

//                     displayMessage(chat);


//                 });
//             }
//             else {

//                 chatsarrFinal = newmessages;
//                 chatsarrFinal.forEach(chat => {

//                     displayMessage(chat);

//                 });

//             }
//             if(chatsarrFinal.length > 10) {

//                     chatsarrFinal = chatsarrFinal.slice(chatsarrFinal.length - 10);
//                     localStorage.setItem('oldMessages', JSON.stringify(chatsarrFinal));
//                     localStorage.setItem('lastMessageId', chatsarrFinal[chatsarrFinal.length - 1].id);
//             }
            
            
//         })
//         .catch(err => {

//             console.log(err);
//         });
// });


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