import React, { useReducer } from "react"

// choices
type AppChoices = "new_user" | "close_app" | "new_task" | null | "delete_user" | "update_user" | "block_user" | "unblock_user" | "make_admin" | "remove_admin" | "update_password" |"refresh_whatsapp"

type TaskChoices = "new_task" | "delete_task" | "close_task" | "edit_task" | "start_task" | "stop_task" | "view_task"

type MessageChoices = "new_message" | "delete_message" | "close_message" | "edit_message" | "start_message" | "stop_message" | "view_message"

// initial state
type ChoiceState = AppChoices | TaskChoices | MessageChoices

const initialState: ChoiceState = null

export enum AppChoiceActions {
    new_user = "new_user",
    delete_user = "delete_user",
    update_user = "update_user",
    block_user = "block_user",
    unblock_user = "unblock_user",
    update_password = "update_password",
    make_admin = "make_admin",
    remove_admin = "remove_admin",
    close_app = "close_app",
    refresh_whatsapp ="refresh_whatsapp"
}
export enum TaskChoiceActions {
    new_task = "new_task",
    delete_task = "delete_task",
    edit_task = "edit_task",
    close_task = "close_task",
    start_task = "start_task",
    stop_task = "stop_task",
    view_task = "view_task"
}
export enum MessageChoiceActions {
    new_message = "new_message",
    delete_message = "delete_message",
    edit_message = "edit_message",
    start_message = "start_message",
    stop_message = "stop_message",
    view_message = "view_message",
    close_message = "close_message"
}

type Action = {
    type: AppChoiceActions | TaskChoiceActions | MessageChoiceActions
}

// reducer
function reducer(state: ChoiceState, action: Action) {
    let type = action.type
    switch (type) {
        //users dialog choices
        case AppChoiceActions.new_user: return type
        case AppChoiceActions.delete_user: return type
        case AppChoiceActions.update_user: return type
        case AppChoiceActions.remove_admin: return type
        case AppChoiceActions.make_admin: return type
        case AppChoiceActions.block_user: return type
        case AppChoiceActions.unblock_user: return type
        case AppChoiceActions.update_password: return type
        case AppChoiceActions.refresh_whatsapp: return type
        case AppChoiceActions.close_app: return type

        // task dialog choices
        case TaskChoiceActions.new_task: return type
        case TaskChoiceActions.delete_task: return type
        case TaskChoiceActions.edit_task: return type
        case TaskChoiceActions.start_task: return type
        case TaskChoiceActions.stop_task: return type
        case TaskChoiceActions.view_task: return type
        case TaskChoiceActions.close_task: return type

        // message dialog choices
        case MessageChoiceActions.new_message: return type
        case MessageChoiceActions.delete_message: return type
        case MessageChoiceActions.edit_message: return type
        case MessageChoiceActions.start_message: return type
        case MessageChoiceActions.stop_message: return type
        case MessageChoiceActions.view_message: return type
        case MessageChoiceActions.close_message: return type
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