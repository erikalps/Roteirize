import { useAuth } from "../features/auth/AuthContext";

function Dashboard (){
    const {user, logout} = useAuth();

    return(
        <>
            <h1>Bem vindo {user?.name}!! </h1>
            <button onClick={logout} >Sair</button>
        </>
    )
}


export default Dashboard;