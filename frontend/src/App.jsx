import { BrowserRouter , Routes , Route } from "react-router-dom"
import { Signup } from "./pages/Signup"
import { Login } from "./pages/Login"
import { Dashboard } from "./pages/Dashboard"
import { GroupDetail } from "./pages/GroupDetail"

function App(){


  return(
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/groups/:groupId" element={<GroupDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App