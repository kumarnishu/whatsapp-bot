import { useContext, useEffect, useState } from 'react'
import { AppChoiceActions, ChoiceContext } from '../../../contexts/DialogContext'
import { Button, Container, Modal } from 'react-bootstrap'
import { AxiosResponse } from 'axios'
import { useMutation } from 'react-query'
import { BackendError } from '../../../types'
import { SetUpWhatsapp } from '../../../services/BotServices'
import { socket } from '../../../socket'
import QRCode from 'react-qr-code'
import { WhatsappSessionContext } from '../../../contexts/WhatsappContext'
import AlertBar from '../../alert/AlertBar'


function RefreshWhatsappModal() {
    const { choice, setChoice } = useContext(ChoiceContext)
    const { whatsapp_session, setWhatsappSession } = useContext(WhatsappSessionContext)
    const { mutate, isSuccess, isLoading, isError, error } = useMutation
        <AxiosResponse<any>,
            BackendError>(SetUpWhatsapp)
    const [qrCode, setQrCode] = useState<string | undefined>()
    const [loading, setLoading] = useState(false)



    useEffect(() => {
        if (isError) setLoading(false)
    }, [isError])
    
    useEffect(() => {
        if (socket) {
            socket.on("qr", (qr) => {
                setLoading(false)
                setQrCode(qr)
            })
            socket.on("ready", () => {
                setLoading(false)
                setQrCode(undefined)
                setWhatsappSession(true)
            })
            socket.on("loading", () => {
                setLoading(true)
                setQrCode(undefined)
            })
        }
    }, [setWhatsappSession])
    return (
        <Modal
            show={choice === AppChoiceActions.refresh_whatsapp ? true : false}
            onHide={() => setChoice({ type: AppChoiceActions.close_app })}
            centered
        >
            {
                isError ? (
                    <AlertBar variant="danger" message={error?.response.data.message} />


                ) : null
            }
            {
                isSuccess ? (
                    <AlertBar variant="success" message={
                        "logged in Whatsapp"
                    } />

                ) : null
            }
            <Container className='p-4'>
                {!loading ?
                    <>
                        <Button size="lg" className='w-100'
                            disabled={Boolean(isLoading)}
                            onClick={() => {
                                mutate()
                                setLoading(true)
                            }}>Check Whatsapp Status
                        </Button>

                        <Container className='p-4'>
                            <>
                                {whatsapp_session ? <p className='p-2'>Congrats ! Connected,Click Above Button to confirm</p> : null}
                                {isLoading && !qrCode ? <h1>Loading qr code...</h1> : null}
                                {qrCode ?
                                    <>
                                        <p className='p-2'>logged out ? Scan to login !</p>
                                        <QRCode value={qrCode} />
                                    </> :
                                    null
                                }
                            </>
                        </Container>
                    </>
                    :
                    <h1>working on it .....</h1>}
            </Container>
        </Modal>
    )
}

export default RefreshWhatsappModal