import { useState } from "react";
import { Link, useNavigate } from 'react-router'
import axios from 'axios'
import api from "../services/api";
import { isValidEmail } from '../utils/validation'
import { useAuth } from "../features/auth/AuthContext";
import { Navigate } from "react-router";

function Login() {

    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({ email: '', password: '' })
    const [loading, setLoading] = useState(false)
    const [generalError, setGeneralError] = useState('')

    const navigate = useNavigate()
    const { user, loading: authLoading, login } = useAuth()


    if (authLoading) return <p>Carregando...</p>
    if (user) return <Navigate to="/dashboard" replace />

    function validate() {
        const newErrors = { email: '', password: '' }

        let valid = true

        if (!email) {
            newErrors.email = 'Email é obrigatório!'
            valid = false
        } else if (!isValidEmail(email)) {
            newErrors.email = "Email inválido!"
            valid = false
        }

        if (!password) {
            newErrors.password = 'A senha é obrigatória!'
            valid = false;
        }

        setErrors(newErrors)
        return valid
    }

    const isFormValid = isValidEmail(email) && !!password


    async function handleSubmit() {
        if (!validate()) return

        setLoading(true)
        setGeneralError('')

        try {

            const response = await api.post('/auth/login', { email, password })
            login(response.data.token, response.data.user)
            navigate('/dashboard')


        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 401) {
                setGeneralError('Email ou senha inválidos')
            } else if (axios.isAxiosError(err) && err.response?.status === 400 && err.response.data.fields) {
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

    return (
        <div className="auth-page auth-page--login">
            <div className="auth-form">
                <h1 className="auth-title">Entrar</h1>

                {generalError && <p className="general-error">{generalError}</p>}

                <div className="input-container">
                    <input
                        type="email"
                        placeholder="Email"
                        aria-label="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    {errors.email && <p className="field-error">{errors.email}</p>}
                </div>

                <div className="input-container">
                    <input
                        type="password"
                        placeholder="Senha"
                        aria-label="Senha"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    {errors.password && <p className="field-error">{errors.password}</p>}
                </div>

                <button className="submit-button" onClick={handleSubmit} disabled={!isFormValid || loading}>
                    {loading ? 'Entrando...' : 'Entrar'}
                </button>
            </div>

            <div className="auth-panel">
                <span className="auth-brand">Roteirize</span>
                <svg className="plane-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
                <h2>Bem-vinda de volta</h2>
                <p>Seus roteiros e viagens em grupo estão esperando por você.</p>
                <p className="auth-panel-link">Não tem conta?<Link to="/signup">Cadastre-se</Link></p>
            </div>
        </div>
    )
}


export default Login;