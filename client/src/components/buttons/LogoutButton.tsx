import { useContext, useEffect } from 'react'
import { useMutation } from 'react-query'
import { Logout } from '../../services/UserServices'
import { useNavigate } from 'react-router-dom'
import { paths } from '../../Routes'
import { UserContext } from '../../contexts/UserContext'
import { Button } from 'react-bootstrap'

function LogoutButton() {
    const goto = useNavigate()
    const { setUser } = useContext(UserContext)
    const { mutate, isSuccess } = useMutation(Logout)
    useEffect(() => {
        if (isSuccess) {
            goto(paths.login)
        }
    }, [goto, isSuccess])
    return (
        <Button variant="text" className='p-0 m-0' size="sm" onClick={() => {
            mutate()
            setUser(undefined)
        }}>
            <img title="logout" className="m-1" alt="icon" src="https://img.icons8.com/plasticine/100/logout-rounded.png" height="24" width="24" />
            Logout
        </Button>
    )

}

export default LogoutButton