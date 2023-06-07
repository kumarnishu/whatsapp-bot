import { useEffect, useState } from 'react'
import styled from 'styled-components'


function AlertBar({ message, variant }: { message: string, variant: "success" | "danger" | "info" }) {
    const [display, setDisplay] = useState(true)

    const StyledBar = styled.div`
    width:300px;
    padding:10px;
    position:absolute;
    bottom:100px;
    right:50px;
    color:white;
    background:${variant === "success" ? "green" : null || variant === "danger" ? "red" : null || "black"}
`

    useEffect(() => {
        if (message) {
            setTimeout(() => {
                setDisplay(false)
            }, 2000)
        }
    }, [message])
    return (
        <>
            {
                display ?
                    <StyledBar className="shadow-lg rounded m-2">{message}</StyledBar> : null
            }
        </>

    )
}

export default AlertBar