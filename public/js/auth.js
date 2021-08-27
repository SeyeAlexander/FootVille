const loginBtn = document.querySelector('.form')
const signupBtn = document.querySelector('.sform')

if (signupBtn) {
  signupBtn.addEventListener("submit", async(e) => {
    e.preventDefault();
    const name = document.getElementById("fullname").value
    const username = document.getElementById("username").value
    const email = document.getElementById("email").value
    const shippingAddress = document.getElementById("shipping").value
    const postalCode = document.getElementById("postal").value
    const password = document.getElementById("pass").value
    const passwordConfirm = document.getElementById("confirm").value
    
    try {
      const res = await axios({
        method: 'POST',
        url: 'api/v1/users/signup',
        data: {
          name,
          username,
          email,
          shippingAddress,
          postalCode,
          password,
          passwordConfirm
        }
      });
  
      if (res.data.status === 'success') {
        location.assign('/')
      }
    } 
    catch (err) {
      console.log(err)
    }
  })
}

if (loginBtn) {
  loginBtn.addEventListener("submit", async(e) => {
    e.preventDefault();
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    
    try {
      const res = await axios({
        method: 'POST',
        url: '/api/v1/users/login',
        data: {
          email,
          password
        }
      });
  
      if (res.data.status === 'success') {
        location.assign('/')
      }
    } 
    catch (err) {
      console.log(err)
    }
  })
}