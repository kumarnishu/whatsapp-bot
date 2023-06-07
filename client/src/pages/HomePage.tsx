import { useState, useEffect, useContext } from 'react';
import { socket } from '../socket';
import { useMutation } from 'react-query';
import { AxiosResponse } from 'axios';
import { BackendError } from '../types';
import { SetUpWhatsapp } from '../services/BotServices';
import { IUser } from '../types/user.types';
import { UserContext } from '../contexts/UserContext';
import QRCode from 'react-qr-code';
import LogoutWhatsappButton from '../components/buttons/LogoutWhatsappButton';
import { Button } from 'react-bootstrap';

export default function HomePage() {
  const { mutate, isLoading } = useMutation
    <AxiosResponse<IUser>,
      BackendError,
      string
    >(SetUpWhatsapp)

  const { user, setUser } = useContext(UserContext)
  const [qrCode, setQrCode] = useState<string | undefined>()


  useEffect(() => {
    if (user) {
      socket.on("qr", (qr) => {
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

    <>
      <h1>Whatsapp BOt</h1>
      {
        user && !user.whatsapp.is_active ?
          <Button
            disabled={Boolean(isLoading)}
            onClick={() => {
              user && mutate(user.whatsapp.client_id)
            }}>Reconnect Whatsapp</Button> : null
      }
      {
        user && user.whatsapp.is_active ?
          <>
            <h1>whatsapp connected</h1>
            <LogoutWhatsappButton />
          </>
          :
          <>
            {isLoading && !qrCode ? <h1>Loading qr code...</h1> : null}
            {qrCode ?
              <>
                <h1>scan QR code with your phone</h1>
                <QRCode value={qrCode} />
              </> :
              null
            }
          </>
      }
      
    </>
  );
}