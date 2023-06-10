import { useContext, useEffect, useState } from 'react'
import { AppChoiceActions, ChoiceContext } from '../../../contexts/DialogContext'
import { Button, Container, Modal } from 'react-bootstrap'
import { AxiosResponse } from 'axios'
import { useMutation } from 'react-query'
import { BackendError } from '../../../types'
import { SetUpWhatsapp } from '../../../services/BotServices'
import { UserContext } from '../../../contexts/UserContext'
import { socket } from '../../../socket'
import QRCode from 'react-qr-code'


function RefreshWhatsappModal() {
    const { choice, setChoice } = useContext(ChoiceContext)
    const { mutate, isLoading } = useMutation
        <AxiosResponse<any>,
            BackendError,
            string
        >(SetUpWhatsapp)

    const { user, setUser } = useContext(UserContext)
    const [qrCode, setQrCode] = useState<string | undefined>()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (user) {
            socket.on("qr", (qr) => {
                setLoading(false)
                setQrCode(qr)
                setUser({
                    ...user,
                    whatsapp: {
                        client_id: user.whatsapp.client_id,
                        is_active: false
                    }
                })
            })
            socket.on("ready", () => {
                setLoading(false)
                setUser({
                    ...user,
                    whatsapp: {
                        client_id: user.whatsapp.client_id,
                        is_active: true
                    }
                })
                setQrCode(undefined)
            })
            socket.on("loading", () => {
                setLoading(true)
                setUser({
                    ...user,
                    whatsapp: {
                        client_id: user.whatsapp.client_id,
                        is_active: true
                    }
                })
                setQrCode(undefined)
            })
        }
    }, [user, setUser])
    return (
        <Modal
            show={choice === AppChoiceActions.refresh_whatsapp ? true : false}
            onHide={() => setChoice({ type: AppChoiceActions.close_app })}
            centered
        >
            <Container className='p-4'>
                {!loading ?
                    <> 
                    <Button size="lg" className='w-100'
                        disabled={Boolean(isLoading)}
                        onClick={() => {
                            user && mutate(user.whatsapp.client_id)
                            setLoading(true)
                        }}>Refresh
                    </Button>
                        <Container className='p-4'>
                            {
                                user && user.whatsapp.is_active ?
                                    <>
                                        <h1>whatsapp connected</h1>
                                    </>
                                    :
                                    <>
                                        {isLoading && !qrCode ? <h1>Loading qr code...</h1> : null}
                                        {qrCode ?
                                            <>
                                                <QRCode value={qrCode} />
                                            </> :
                                            null
                                        }
                                    </>
                            }
                        </Container>
                    </>
                    :
                    <h1>working on it .....</h1>}
            </Container>
        </Modal>
    )
}

export default RefreshWhatsappModal