import { useState } from 'react'
import axios from 'axios'
import api from '../services/api'
import { Link } from 'react-router'
import { isValidEmail, isValidPassword, hasPasswordNumber, MIN_PASSWORD_LENGTH } from '../utils/validation'

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
    <div>
      <h1>Cadastro</h1>

      {successMessage && <p>{successMessage}</p>}
      {generalError && <p>{generalError}</p>}

      <div>
        <input
          placeholder="Nome"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        {errors.name && <p>{errors.name}</p>}
      </div>

      <div>
        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        {errors.email && <p>{errors.email}</p>}
      </div>

      <div>
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        {errors.password && <p>{errors.password}</p>}
      </div>

      <div>
        <input
          type="password"
          placeholder="Confirmar senha"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
        />
        {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
      </div>

      <button onClick={handleSubmit} disabled={!isFormValid || loading}>
        {loading ? 'Cadastrando...' : 'Cadastrar'}
      </button>
      <p>Já tem conta?<Link to="/login">Entrar</Link></p>
    </div>
  )
}