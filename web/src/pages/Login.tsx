import { useState } from "react";
import { Link, useNavigate } from 'react-router'
import api from "../services/api";


function Login(){

    const [passWord, setPassWord] = useState('');
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({ email: '', password: '' })
    const [loading, setLoading] = useState(false)
    const [generalError, setGeneralError] = useState('')

    const navigate = useNavigate()


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

    
         async function handleSubmit(){
            if(!validate()) return
             
            setLoading(true)
            setGeneralError('')
            
            try {
                
                const response = await api.post('/auth/login', {email, password: passWord })
                localStorage.setItem('roteirize_token', response.data.token)
                navigate('/dashboard')


            } catch (err: any) {
                if(err.response?.status === 401){
                    setGeneralError('Email ou senha inválidos')
                } else {
                    setGeneralError('Erro ao conectar com o servidor')
                }
            } finally {
                setLoading(false)
            }
        }

    return(
        <div className="container-login">
            {generalError && <p>{generalError}</p>}
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
                <button onClick={handleSubmit} disabled = {!isFormValid || loading}>{loading ? 'Entrando..': 'Entrar'}</button>
                 <p>Não tem conta? <Link to="/signup">Cadastre-se</Link></p>
        </div>
    )
}


export default Login;