
const sendbtn = document.getElementById('sendbtn');
let messageInput = document.getElementById('message');
const userModal = document.getElementById('user-modal');
const closeModal = document.getElementById('close-modal');
const createGroupBtn = document.getElementById('create-group-btn');


let currentGroup;
let intervalId;
let chatsarrFinal = [];

const chatbox = document.getElementById('chatbox');
const fileInput = document.getElementById('file-input');
const uploadBtn = document.getElementById('upload-btn');

const getusersinfo = document.getElementById('getinfo-btn');
const addusertogroup = document.getElementById('addusertogroup-btn');
const deleteuserfromgroup = document.getElementById('deleteuserfromgroup-btn');
const makeadmin = document.getElementById('makeadmin-btn');
const admininvite = document.getElementById('invite-btn');


function startPolling() {
    intervalId = setInterval(() => {
        const token = localStorage.getItem('token');
        axios.get(`http://localhost:3000/chats/${currentGroup}` , { headers: { Authorization: token } })
            .then(response => {
                const chats = response.data.chats;
                if (chats.length > chatsarrFinal.length) {
                    chatsarrFinal = chats;
                    chatbox.innerHTML = "";
                    chats.forEach(chat => {
                        displayMessage(chat);
                    });
                }
            })
            .catch(err => {
                console.log(err);
            });
    }, 1000);
}

function stopPolling() {
    clearInterval(intervalId);
}


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
    
    // Example call to get and display notifications
    axios.get(`http://localhost:3000/chats/getnotifications`, { headers: { Authorization: localStorage.getItem('token') } })
    .then(response => {
      const notifications = response.data.notifications;
      console.log(notifications);
      displayNotifications(notifications);
    })
    .catch(err => {
      console.log(err);
    });

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
    //if row is url then display image

    if(row.message.includes('.pdf')) {

        // display link to pdf
        const div = document.createElement('div');
        div.setAttribute('id','chat-item');
        div.innerHTML = `${row.User.name} : <a href="${row.message}" class="chat-img">Download PDF</a>`;
        chatbox.appendChild(div);
        


    }
    else if(row.message.includes('https://')) {

       
        const div = document.createElement('div');
        div.setAttribute('id','chat-item');
        div.innerHTML = `${row.User.name} : <img src="${row.message}" class="chat-img">`;
        chatbox.appendChild(div);

        

    }else {

        const div = document.createElement('div');
        div.setAttribute('id','chat-item');
        div.innerHTML = `${row.User.name} : ${row.message}`;
        chatbox.appendChild(div);

    }



    
}

//CREATE GROUP

createGroupBtn.addEventListener('click', () => {
    // Create the form element
    const form = document.createElement('form');
    form.setAttribute('id', 'create-group-form');
    form.innerHTML = `
        <label for="group-name">Group Name:</label>
        <input type="text" id="group-name" placeholder="Enter group name">
        <button id="submitgroupbtn">Create</button>
        <button type="button" id="cancel-create-group-btn">Cancel</button>
    `;
    form.style.display = 'block';
    form.style.position = 'fixed';
    form.style.top = '50%';
    form.style.left = '50%';
    form.style.transform = 'translate(-50%, -50%)';
    form.style.backgroundColor = 'white';
    form.style.padding = '20px';
    form.style.borderRadius = '10px';
    form.style.zIndex = '1000';
    // Append the form to the body
    document.body.appendChild(form);

    // Add event listener for the cancel button
    const cancelBtn = document.getElementById('cancel-create-group-btn');
    cancelBtn.addEventListener('click', () => {
        form.remove();
    });

    // Add event listener for the submit button

    const submitBtn = document.getElementById('submitgroupbtn');
    submitBtn.addEventListener('click', (e) => {

        e.preventDefault();
        const token = localStorage.getItem('token');
        const groupName = document.getElementById('group-name').value;
        axios.post('http://localhost:3000/creategroup', { name: groupName }, { headers: { Authorization: token } })
            .then(response => {
                console.log(response);
                form.remove();
                displayGroup(response.data.group);
            })
            .catch(err => {
                console.log(err);
            });
    });
});



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
    startPolling();


}

//admin superpowers frontend

getusersinfo.addEventListener('click', (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    axios.get(`http://localhost:3000/admin/getusers/${currentGroup}`, { headers: { Authorization: token } })
    .then(response => {
        const users = response.data.users;
        
        const userList = document.getElementById('user-list');
        userList.innerHTML = '';
        users.forEach(user => {
            const li = document.createElement('li');
            li.innerHTML = `${user.name} : ${user.email} - ${user.phone}`;
            userList.appendChild(li);
        });
        userModal.style.display = 'block';
    })
    .catch(err => {
        const alertodisp = err.response.data.message;
        alert(alertodisp);
    });
});


closeModal.addEventListener('click', (e) => {
    e.preventDefault();
    userModal.style.display = 'none';
});


addusertogroup.addEventListener('click', (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const emailphone = document.getElementById('search-field').value;
    const gid = currentGroup;
    axios.post(`http://localhost:3000/admin/adduser`, { emailphone, gid }, { headers: { Authorization: token } })
    .then(response => { 
        console.log(response);
        const alertodisp = response.data.message;
        alert(alertodisp);
    })
    .catch(err => {
        const alertodisp = err.response.data.message;
        alert(alertodisp);
     });
});

//delete user from group

deleteuserfromgroup.addEventListener('click', (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const emailphone = document.getElementById('search-field').value;
    const gid = currentGroup;
    axios.post(`http://localhost:3000/admin/removeuser`, { emailphone, gid }, { headers: { Authorization: token } })
    .then(response => {

        const alertodisp = response.data.message;
        alert(alertodisp);
    })
    .catch(err => {
        const alertodisp = err.response.data.message;
        alert(alertodisp);
    });
});

//makeadmin

makeadmin.addEventListener('click', (e) => {

    e.preventDefault();
    const token = localStorage.getItem('token');
    const emailphone = document.getElementById('search-field').value;
    const gid = currentGroup;
    axios.post(`http://localhost:3000/admin/makeadmin`, { emailphone, gid }, { headers: { Authorization: token } })
    .then(response => {

        console.log(response);
        const alertodisp = response.data.message;
        alert(alertodisp);
    })
    .catch(err => {

        const alertodisp = err.response.data.message;
        alert(alertodisp);
    });
});

admininvite.addEventListener('click', (e) => {

    e.preventDefault();
    const token = localStorage.getItem('token');
    const email = document.getElementById('search-field').value;
    const gid = currentGroup;

    //if email is not valid
    if(!email.includes('@')) {

        alert('Please enter a valid email');
        return;
    }

    axios.post(`http://localhost:3000/invitemember`, { email, gid }, { headers: { Authorization: token } })
    .then(response => {

        console.log(response);
        const alertodisp = response.data.message;
        alert(alertodisp);
    })
    .catch(err => {

        const alertodisp = err.response.data.message;
        alert(alertodisp);
    });
});


//notifications

const notificationsBtn = document.getElementById('notifications-btn');
const notificationsPopup = document.getElementById('notifications-popup');
const closePopupBtn = document.getElementById('close-popup-btn');
const notificationsList = document.getElementById('notifications-list');

notificationsBtn.addEventListener('click', () => {
  notificationsPopup.style.display = 'block';
});

closePopupBtn.addEventListener('click', () => {
  notificationsPopup.style.display = 'none';
});

const displayNotifications = (notifications) => {
  notificationsList.innerHTML = '';
  notifications.forEach(notification => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${notification.message}<button id="accept-btn" onClick=acceptresponse('${notification.id}','${notification.invitedGID}')>Accept</button><button id="decline-btn" onClick=declineresponse('${notification.id}','${notification.invitedGID}')>Decline</button>`;
    notificationsList.appendChild(li);
  });
}


function acceptresponse(nid, gid) {
    const token = localStorage.getItem('token');
    const response = 'accept';
    axios.post(`http://localhost:3000/inviteresp`, { nid, response, gid }, { headers: { Authorization: token } })
    .then(response => {

        console.log(response);
        const alertodisp = response.data.message;
        alert(alertodisp);
    })
    .catch(err => {

        const alertodisp = err.response.data.message;
        alert(alertodisp);
    });
}

function declineresponse(nid,gid) {
    const token = localStorage.getItem('token');
    const response = 'decline';
    axios.post(`http://localhost:3000/inviteresp`, { nid, response, gid }, { headers: { Authorization: token } })
    .then(response => {

        console.log(response);
        const alertodisp = response.data.message;
        alert(alertodisp);
    })
    .catch(err => {

        const alertodisp = err.response.data.message;
        alert(alertodisp);
    });
}


const hamburgerBtn = document.getElementById('hamburger-btn');
const menuOptions = document.getElementById('menu-options');
hamburgerBtn.addEventListener('click', () => {
    menuOptions.style.display = menuOptions.style.display === 'none' ? 'block' : 'none';
});



uploadBtn.addEventListener('click', (event) => {
    event.preventDefault();

    const file = fileInput.files[0];
    const filename = file.name;
    const formData = new FormData();
    const gid = currentGroup;

    formData.append('file', file);
    formData.append('filename', filename);

    axios.post(`http://localhost:3000/chats/upload/${gid}`, formData, {
        headers: {
            Authorization: localStorage.getItem('token'),
            'Content-Type': 'multipart/form-data'
        }
    })
    .then(response => {
        console.log(response.data);
    })
    .catch(err => {
        console.log(err);
    });
});


window.addEventListener('beforeunload', stopPolling);
