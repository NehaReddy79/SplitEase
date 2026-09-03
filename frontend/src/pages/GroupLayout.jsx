import {Outlet , Link , useParams} from 'react-router-dom'

export function GroupLayout(){
    const {groupId} = useParams()

    return(
        <div>
            <h2>Group</h2>
            <nav>
                <Link to={`/groups/${groupId}`}>Overview</Link> || {' '}
                <Link to={`/groups/${groupId}/expenses`}>Expenses</Link> || {' '}
                <Link to={`/groups/${groupId}/balances`}>Balances</Link> || {' '}
                <Link to={`/groups/${groupId}/settlements`}>Settlements</Link> || {' '}
            </nav>
            <hr />
            <Outlet />
        </div>
    )
}