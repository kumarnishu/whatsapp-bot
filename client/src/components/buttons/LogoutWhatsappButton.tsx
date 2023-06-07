import { useContext, useEffect } from 'react'
import { useMutation } from 'react-query'
import { UserContext } from '../../contexts/UserContext'
import { Button } from 'react-bootstrap'
import { LogoutWhatsapp } from '../../services/BotServices'

function LogoutWhatsappButton() {
    const { user, setUser } = useContext(UserContext)
    const { mutate, isSuccess } = useMutation(LogoutWhatsapp)

    //handle logout success
    useEffect(() => {
        if (isSuccess) {
            if (user) {
                setUser({
                    ...user,
                    whatsapp: {
                        client_id: user.whatsapp.client_id,
                        is_active: false
                    }
                })
            }
        }
    }, [user, isSuccess])

    return (
        <Button variant="text" className='p-0 m-0' size="sm" onClick={() => {
            if (user && user.whatsapp.client_id) {
                mutate(user.whatsapp.client_id)
            }
        }}>
            <img height="40" width="40" title="logout from whatsapp" className="m-1" alt="icon" src="https://img.icons8.com/external-tal-revivo-tritone-tal-revivo/64/external-whatsapp-messenger-cross-platform-mobile-devices-messaging-application-logo-tritone-tal-revivo.png" />
            Logout Whatsapp
        </Button>
    )

}

export default LogoutWhatsappButton