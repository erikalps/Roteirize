import { useState } from 'react'
import axios from 'axios'
import api from '../services/api'
import { Link } from 'react-router'
import { isValidEmail, isValidPassword, hasPasswordNumber, MIN_PASSWORD_LENGTH } from '../utils/validation'
import { useAuth } from '../features/auth/AuthContext'
import { Navigate } from 'react-router'
import './auth.css'




export default function SignUp() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [generalError, setGeneralError] = useState('')

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const { user, loading: authLoading } = useAuth()

  if (authLoading) return <p>Carregando...</p>
  if (user) return <Navigate to="/dashboard" replace />

  function validate() {
    const newErrors = { name: '', email: '', password: '', confirmPassword: '' }
    let valid = true

    if (!name) {
      newErrors.name = 'Nome é obrigatório'
      valid = false
    }

    if (!email) {
      newErrors.email = 'Email é obrigatório'
      valid = false
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Email inválido'
      valid = false
    }

    if (!password) {
      newErrors.password = 'Senha é obrigatória'
      valid = false
    } else if (password.length < MIN_PASSWORD_LENGTH) {
      newErrors.password = 'Senha deve ter no mínimo 8 caracteres'
      valid = false
    } else if (!hasPasswordNumber(password)) {
      newErrors.password = 'Senha deve conter pelo menos 1 número'
      valid = false
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirme sua senha'
      valid = false
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem'
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const isFormValid =
    !!name &&
    isValidEmail(email) &&
    isValidPassword(password) &&
    confirmPassword === password

  async function handleSubmit() {
    if (!validate()) return

    setLoading(true)
    setGeneralError('')
    setSuccessMessage('')

    try {
      await api.post('/users', { name, email, password })
      setSuccessMessage('Cadastro realizado com sucesso!')
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        setErrors(prev => ({ ...prev, email: 'Este email já está cadastrado' }))
      } else if (axios.isAxiosError(err) && err.response?.status === 400 && err.response.data.fields) {
        const fields = err.response.data.fields
        setErrors(prev => ({
          ...prev,
          ...(fields.name && { name: fields.name[0] }),
          ...(fields.email && { email: fields.email[0] }),
          ...(fields.password && { password: fields.password[0] }),
        }))
      } else {
        setGeneralError('Não foi possível concluir o cadastro')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='auth-page'>
      <div className='auth-form'>
        <h1 className='auth-title'>Cadastro</h1>

        {successMessage && <p className='success-message'>{successMessage}</p>}
        {generalError && <p className='general-error'>{generalError}</p>}

        <div className='input-container'>
          <input
            placeholder="Nome"
            aria-label="Nome"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          {errors.name && <p className='field-error'>{errors.name}</p>}
        </div>

        <div className='input-container'>
          <input
            placeholder="Email"
            aria-label="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          {errors.email && <p className='field-error'>{errors.email}</p>}
        </div>

        <div className='input-container'>
          <input
            type="password"
            placeholder="Senha"
            aria-label="Senha"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {errors.password && <p className='field-error'>{errors.password}</p>}
        </div>

        <div className='input-container'>
          <input
            type="password"
            placeholder="Confirmar senha"
            aria-label="Confirmar senha"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
          {errors.confirmPassword && <p className='field-error'>{errors.confirmPassword}</p>}
        </div>

        <button className='submit-button' onClick={handleSubmit} disabled={!isFormValid || loading}>
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </div>

      <div className='auth-panel'>
        <span className='auth-brand'>Roteirize</span>
        <svg className='plane-icon' width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
        </svg>
        <h2>Sua próxima viagem começa aqui</h2>
        <p>Monte roteiros com seus amigos, vote nas paradas e organize tudo num só lugar.</p>
        <p className='auth-panel-link'>Já tem conta?<Link to="/login">Entrar</Link></p>
      </div>
    </div>
  )
}