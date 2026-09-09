import { Outlet, NavLink, useParams } from 'react-router-dom'
import './GroupLayout.css'

export function GroupLayout() {
    const { groupId } = useParams()

    return (
        <div className='group-page'>
            <nav className='group-nav'>
                <h1><span>SplitEase</span></h1>
            </nav>
            <div className='group-content'>
                <div className='group-tabs'>
                        <NavLink to={`/groups/${groupId}`} end className={({isActive}) => isActive ? 'active' : ''}>
                            Overview
                        </NavLink>
                        <NavLink to={`/groups/${groupId}/expenses`} end className={({isActive}) => isActive ? 'active' : ''}>Expenses</NavLink>
                        <NavLink to={`/groups/${groupId}/balances`} end className={({isActive}) => isActive ? 'active' : ''}>Balances</NavLink> 
                        <NavLink to={`/groups/${groupId}/settlements`} end className={({isActive}) => isActive ? 'active' : ''}>Settlements</NavLink> 
                </div>
                <Outlet />
            </div>
        </div>
    )
}