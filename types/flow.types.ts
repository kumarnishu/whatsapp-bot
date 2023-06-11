type IMenuItem = {
    _id: string,
    index: number,
    description: string
}

type IMenu = {
    _id: string,
    is_main: boolean,
    items: IMenuItem[]
}

type IFlow = {
    _id: string,
    flow_name: string,
    menu: IMenu[]
}

type IResponse = {
    _id: string,
    flow: IFlow,
    menu: IMenu,
    menu_item: IMenuItem
}

type IMessage = ""
type IPoll = ""
type ICataLouge = ""
type IContact = ""
type IDocument = ""
type ISticker = ""
type IImage = ""
type ILocation = ""

type IReply = {
    _id: string,
    reply: IMessage[] | IPoll[] | ICataLouge[] | IContact[] | IDocument[] | ISticker[] | IImage[] | ILocation[]
}
