import { useContext } from 'react'
import { UserContext } from '../../contexts/UserContext'
import { Button } from 'react-bootstrap'
import { AppChoiceActions, ChoiceContext } from '../../contexts/DialogContext'
import RefreshWhatsappModal from '../modals/whatsapp/RefreshWhatsappModal'

function RefreshWhatsappButton() {
    const { setChoice } = useContext(ChoiceContext)
    const { user } = useContext(UserContext)
    return (
        <>
            <RefreshWhatsappModal />
            <Button variant="text" className='p-0 m-0' size="sm" onClick={() => {
                setChoice({ type: AppChoiceActions.refresh_whatsapp })
            }}>
                {
                    user?.whatsapp.is_active ? <img width="30" height="30" src="https://img.icons8.com/cute-clipart/64/whatsapp.png" alt="whatsapp" />
                        :
                        <img height="30" width="30" title="active" className="m-1" alt="icon" src="https://img.icons8.com/external-tal-revivo-tritone-tal-revivo/64/external-whatsapp-messenger-cross-platform-mobile-devices-messaging-application-logo-tritone-tal-revivo.png" />

                }
            </Button>
        </>

    )

}

export default RefreshWhatsappButton