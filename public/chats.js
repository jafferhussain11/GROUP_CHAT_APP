
const sendbtn = document.getElementById('sendbtn');

let chatsarr = [];
window.addEventListener('load', () => {

    const token = localStorage.getItem('token');
    axios.get('http://localhost:3000/chats', { headers: { Authorization: token } }).then(response => {

        console.log(response);
        chatsarr = response.data.chats;
        
        chatsarr.forEach(chat => {

            displayMessage(chat);
        })

    }).catch(err => {

        console.log(err);
    })
})

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