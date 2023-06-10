import React, { createContext, useState } from "react";


// whatsapp_sessioncontext
type Context = {
    whatsapp_session: boolean | undefined;
    setWhatsappSession: React.Dispatch<React.SetStateAction<boolean | undefined>>;
};
export const WhatsappSessionContext = createContext<Context>({
    whatsapp_session: undefined,
    setWhatsappSession: () => null,
});


// whatsapp_session provider
export function WhatsappSessionProvider(props: { children: JSX.Element }) {
    const [whatsapp_session, setWhatsappSession] = useState<boolean>();
    return (
        <WhatsappSessionContext.Provider value={{ whatsapp_session, setWhatsappSession }}>
            {props.children}
        </WhatsappSessionContext.Provider>
    );
}


