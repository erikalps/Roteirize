import { useState } from 'react'
import api from '../services/api'
import { Link } from 'react-router'

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
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Email inválido'
      valid = false
    }

    if (!password) {
      newErrors.password = 'Senha é obrigatória'
      valid = false
    } else if (password.length < 8) {
      newErrors.password = 'Senha deve ter no mínimo 8 caracteres'
      valid = false
    } else if (!/\d/.test(password)) {
      newErrors.password = 'Senha deve ter pelo menos um número'
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
    !!email &&
    !!password &&
    !!confirmPassword 

  async function handleSubmit() {
    if (!validate()) return

    setLoading(true)
    setGeneralError('')
    setSuccessMessage('')

    try {
      await api.post('/users', { name, email, password })
      setSuccessMessage('Cadastro realizado com sucesso!')
    } catch (err: any) {
      if (err.response?.status === 409) {
        setErrors(prev => ({ ...prev, email: 'Este email já está cadastrado' }))
      } else if (err.response?.status === 400) {
        const fields = err.response.data.fields
        setErrors(prev => ({
          ...prev,
          ...(fields.name && { name: fields.name[0] }),
          ...(fields.email && { email: fields.email[0] }),
          ...(fields.password && { password: fields.password[0] }),
        }))
      } else {
        setGeneralError('Não foi possível concluir o cadastro')
        console.log(err)
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