import React, { useState } from 'react'


const Signin = () => {
    const [credential, setCredential] = useState({email: "", password: ""});
    const host = "http://localhost:5000";
    // const navigate = useNavigate();
    const handleSubmit = async (e)=>{
        e.preventDefault();
        const response = await fetch(`${host}/api/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              },
            body: JSON.stringify({email: credential.email, password: credential.password}),
          });
          const json = await response.json();
          console.log(json);
          if(json.success){
            // save the auth token and  redirect the another page
            localStorage.setItem('token', json.authtoken);
            //  i need to implement redirect function here.

          }
          else{
            alert("Invalid credential...");
          }
    }

    const onChange = (e) => {
        setCredential({ ...credential, [e.target.name]: e.target.value })
    }
      
  return (
    <div>
      <form onSubmit={ handleSubmit }>
        <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input type="email" autoComplete='current-password' className="form-control my-2" id="email" name='email' aria-describedby="emailHelp" onChange={onChange} value={credential.email} placeholder="Enter email" />
        </div>
        <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" autoComplete='current-password'  className="form-control my-2" id="password" name='password'  onChange={onChange} value={credential.password} placeholder="Password" />
        </div>
       
        <button type="submit" className="btn btn-primary my-3"  >Submit</button>
    </form>
    </div>
  )
}

export default Signin
