import { Routes, Route } from 'react-router'
import SingUp from "./pages/SignUp"
import Login from "./pages/Login"



function App() {


  return (

        <Routes>
          <Route path="/signup" element={<SingUp />} />
          <Route  path="/login" element={<Login />} />
       </Routes>

    
  )
}

export default App
