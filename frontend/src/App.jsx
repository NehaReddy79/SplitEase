import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Signup } from "./pages/Signup"
import { Login } from "./pages/Login"
import { Dashboard } from "./pages/Dashboard"
import { GroupLayout } from './pages/GroupLayout';
import { GroupOverview } from './pages/GroupOverview';
import { ExpensesPage } from './pages/ExpensesPage';
import { BalancesPage } from './pages/BalancesPage';
import { SettlementsPage } from './pages/SettlementPage';

function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/groups/:groupId" element={<GroupLayout />}>
          <Route index element={<GroupOverview />} />
          <Route path="expenses" element={<ExpensesPage />} />
          <Route path="balances" element={<BalancesPage />} />
          <Route path="settlements" element={<SettlementsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App