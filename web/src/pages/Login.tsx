import { useState } from "react";
import { Link, useNavigate } from 'react-router'
import axios from 'axios'
import api from "../services/api";
import { isValidEmail} from '../utils/validation'
import { useAuth } from "../features/auth/AuthContext";
import { Navigate } from "react-router";

function Login(){

    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({ email: '', password: '' })
    const [loading, setLoading] = useState(false)
    const [generalError, setGeneralError] = useState('')

    const navigate = useNavigate()
    const { user, loading: authLoading, login } = useAuth()


    if(authLoading) return <p>Carregando...</p>
    if(user) return <Navigate to="/dashboard" replace />

    function validate(){
        const newErrors = {email:'', password:''}
        
        let valid = true

        if(!email){
            newErrors.email = 'Email é obrigatório!'
            valid = false
        } else if  (!isValidEmail(email)){
            newErrors.email  = "Email inválido!"
            valid = false
        }

        if(!password){
            newErrors.password = 'A senha é obrigatória!'
            valid = false;
        } 

        setErrors(newErrors)
        return valid
    }

    const isFormValid = isValidEmail(email) && !!password

    
         async function handleSubmit(){
            if(!validate()) return
             
            setLoading(true)
            setGeneralError('')
            
            try {
                
                const response = await api.post('/auth/login', {email, password })
                 login(response.data.token, response.data.user)
                navigate('/dashboard')


            } catch (err) {
                if(axios.isAxiosError(err) && err.response?.status === 401){
                    setGeneralError('Email ou senha inválidos')
                } else if(axios.isAxiosError(err) && err.response?.status === 400 && err.response.data.fields){
                    const fields = err.response.data.fields
                    setErrors(prev => ({
                        ...prev,
                        ...(fields.email && { email: fields.email[0] }),
                        ...(fields.password && { password: fields.password[0] }),
                    }))
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
                    <label htmlFor="password">Senha</label>
                    <input type="password" id="password" required value={password} onChange ={(e) => setPassword(e.target.value)}/>
                    {errors.password && <p>{errors.password}</p>}
                </div>
                <button onClick={handleSubmit} disabled = {!isFormValid || loading}>{loading ? 'Entrando...': 'Entrar'}</button>
                 <p>Não tem conta? <Link to="/signup">Cadastre-se</Link></p>
        </div>
    )
}


export default Login;