
const loginbtn = document.getElementById('loginbtn');

loginbtn.addEventListener('click', (e) => {
    // Get the values of the input elements
    e.preventDefault();
    const emailphone = document.getElementById('emailorphone').value;
    const password = document.getElementById('password').value;
  
    // Send a POST request to the server with the input values as the request body
    axios.post('http://13.233.133.166:3000/login', {
    
      emailphone,
      password
    })
    .then(response => {
   
        alert(response.data.message);
        console.log(response);
        localStorage.setItem('token', response.data.token);
        window.location.href = 'http://13.233.133.166:3000/chats.html';
        
      
    })
    .catch(error => {
      alert(error.response.data.message);
    });
  });
  