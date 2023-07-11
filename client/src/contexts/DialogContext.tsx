import React, { useReducer } from "react"

// choices
type AppChoices = "close_app" |  null |  "update_password" | "refresh_whatsapp" | "delete_flow" | "create_flow" | "update_flow"

// initial state
type ChoiceState = AppChoices 

const initialState: ChoiceState = null

export enum AppChoiceActions {
    update_password = "update_password",
    close_app = "close_app",
    create_flow = "create_flow",
    refresh_whatsapp = "refresh_whatsapp",
    update_flow = "update_flow",
    delete_flow = "delete_flow"
}


type Action = {
    type: AppChoiceActions 
}

// reducer
function reducer(state: ChoiceState, action: Action) {
    let type = action.type
    switch (type) {
        //users dialog choices
        case AppChoiceActions.update_password: return type
        case AppChoiceActions.refresh_whatsapp: return type
        case AppChoiceActions.delete_flow: return type
        case AppChoiceActions.update_flow: return type
        case AppChoiceActions.create_flow: return type
        case AppChoiceActions.close_app: return type
        default: return state
    }
}
// context
type Context = {
    choice: ChoiceState,
    setChoice: React.Dispatch<Action>
}
export const ChoiceContext = React.createContext<Context>(
    {
        choice: null,
        setChoice: () => null
    }
)
// provider
export function ChoiceProvider(props: { children: JSX.Element }) {
    const [choice, setChoice] = useReducer(reducer, initialState)
    return (
        <ChoiceContext.Provider value={{ choice, setChoice }}>
            {props.children}
        </ChoiceContext.Provider>
    )

}