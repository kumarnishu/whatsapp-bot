type IMessage = ""
type IPoll = ""
type ICataLouge = ""
type IContact = ""
type IDocument = ""
type ISticker = ""
type IImage = ""
type ILocation = ""


export type IMenuItem = {
    _id: string,
    index: number,
    description: string,
    reply: IReply
}
export type TMenuItemBody = Request['body'] & IMenuItem;


export type IReply = {
    _id: string,
    reply: IMessage[] | IPoll[] | ICataLouge[] | IContact[] | IDocument[] | ISticker[] | IImage[] | ILocation[]
}
export type TReplyBody = Request['body'] & IReply;


export type IMenu = {
    _id: string,
    is_main: boolean,
    menu_items: IMenuItem[]
}
export type TMenuBody = Request['body'] & IMenu;


export type IFlow = {
    _id: string,
    flow_name: string,
    menus: IMenu[]
}
export type TFlowBody = Request['body'] & IFlow;



