import {useState , useEffect} from 'react'
import api from './api/axios'

function App(){
  const [message , setMessage] = useState('')

  useEffect(() =>{
    api.get('/../')
    .then((res) => setMessage(res.data))
    .catch((err) => console.error(err))
  } , [])

  return(
    <>
      <div>
        <h1>Frontend-Backend Connection Test</h1>
        <p>{message || 'Loading...'}</p>
      </div>
    </>
  )
}

export default App