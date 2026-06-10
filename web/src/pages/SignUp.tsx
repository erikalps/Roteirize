import { useState } from "react"


function SingUp() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [passWord, setPassWord] = useState('')
    const [confirmPassWord, setConfirmPassWord] = useState('')


    const [errors, setErrors] = useState({
        name: '',
        email: '',
        passWord: '',
        confirmPassWord: ' '

    })


    function validate() {
        const newErros = { name: '', email: '', passWord: '', confirmPassWord: '' }

        let valid = true

        if (!name) {
            newErros.name = 'Nome é obrigatório'
            valid = false
        }

        if (!email) {
            newErros.email = 'Email é obrigatório'
            valid = false
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErros.email = 'Email invalido'
            valid = false
        }

        if (!passWord) {
            newErros.passWord = 'Senha é obrigatória'
            valid = false
        } else if (passWord.length < 8) {
            newErros.passWord = 'A senha deve ter no mínimo 8 caracters'
        }

        if (!confirmPassWord) {
            newErros.confirmPassWord = 'Confirme sua senha'
            valid = false
        } else if (confirmPassWord != passWord) {
            newErros.confirmPassWord = 'As senhas não coincidem'
            valid = false
        }

        setErrors(newErros)
        return valid

    }
    const isFormValid =
        !!name &&
        !!email &&
        !!passWord &&
        !!confirmPassWord &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
        passWord.length >= 8 &&
        passWord === confirmPassWord

    function handleSubmit() {
        if (!validate()) return
        console.log({ name, email, passWord })
    }

    return (
        <div className="singUp-container">
            <h1>Cadastro</h1>
            <form action="">
                <div className="SingUp-input">
                    <label htmlFor="name">Nome</label>
                    <input
                        type="text" placeholder="Nome"
                        required value={name} id="name"
                        onChange={e => setName(e.target.value)}
                    />
                       {errors.name && <p>{errors.name}</p>}
                </div>
                <div className="SingUp-input">
                    <label htmlFor="email">Email</label>
                    <input type="email" placeholder="Email:" required value={email} id="email"
                        onChange={e => setEmail(e.target.value)}
                    />
                    {errors.email && <p>{errors.email}</p>}
                </div>
                <div className="SingUp-input">
                    <label htmlFor="passWord" >PassWord</label>
                    <input type="text" placeholder="Senha:" required value={passWord} id="PassWord"
                        onChange={e => setPassWord(e.target.value)}
                    />
                     {errors.passWord && <p>{errors.passWord}</p>}
                </div>
                <div className="SingUp-input">
                    <label htmlFor="confiPass">Confirme a senha</label>
                    <input type="text" placeholder="Confirme a senha" required value={confirmPassWord} id="confiPass"
                        onChange={e => setConfirmPassWord(e.target.value)}
                    />
                     {errors.confirmPassWord && <p>{errors.confirmPassWord}</p>}
                </div>

                <button onClick={handleSubmit} disabled={!isFormValid}>Cadastrar</button>

            </form>
        </div>
    )
}

export default SingUp;