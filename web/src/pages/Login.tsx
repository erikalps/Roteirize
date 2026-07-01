import { useState } from "react";
import { Link } from 'react-router'



function Login(){

    const [passWord, setPassWord] = useState('');
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({ email: '', password: '' })



    function validate(){
        const newErrors = {email:'', password:''}
        
        let valid = true

        if(!email){
            newErrors.email = 'Email é Obrigatório!'
            valid = false
        } else if  (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
            newErrors.email  = "Emai Inválido!!"
            valid = false
        }

        if(!passWord){
            newErrors.password = ' A senha é Obrigatória!'
            valid = false;
        } 

        setErrors(newErrors)
        return valid
    }

    const isFormValid = 
        !!email && !!passWord &&  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

    
        function handleSubmit(){
            if(!validate()) return
             console.log({ email, passWord })
        }

    return(
        <div className="container-login">
               <div>
                <label htmlFor="email">Email</label>
                <input type= "email" id="email" required value={email} onChange={(e)=> setEmail(e.target.value)}/>
                {errors.email && <p>{errors.email}</p>}
               </div>
                <div>
                    <label htmlFor="passWord">Senha</label>
                    <input type="password" id="passWord" required value={passWord} onChange ={(e) => setPassWord(e.target.value)}/>
                    {errors.password && <p>{errors.password}</p>}
                </div>
                <button onClick={handleSubmit} disabled = {!isFormValid}>Entrar</button>
                 <p>Não tem conta? <Link to="/signup">Cadastre-se</Link></p>
        </div>
    )
}


export default Login;