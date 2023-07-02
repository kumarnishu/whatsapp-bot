import { Position } from "reactflow"
import CustomHandle from "./CustomHandle"
import { styled } from "styled-components"


const MenuDiv = styled.div`
background-color:#0040ff;
font-size:10px;
`
const StartDiv = styled.div`
background-color:#ff8000;
font-size:10px;

`
const DefaultDiv = styled.div`
background-color:#ff8080;
font-size:10px;
    `
const OutPutDiv = styled.div`
font-size:10px;
max-width:200px;
overflow:hidden;

`
export function MenuNode({ data }: { data: any }) {
    return (
        <>
            <CustomHandle className=" bg-warning border border-2 white rounded-pill" type="target" position={Position.Top} />
            <MenuDiv className="react-flow-menu-node  text-light rounded-pill p-1 ">
                {data.media_value || "type something"}
            </MenuDiv>
            <CustomHandle className="bg-secondary border border-2 white" type="source" position={Position.Bottom} />
        </>
    )
}

export function DefaultNode({ data }: { data: any }) {
    return (
        <>
            <CustomHandle className=" bg-info border border-2 white" type="target" position={Position.Top} isConnectable={2} />
            <DefaultDiv className="d-flex gap-1 p-1 rounded-pill ">
                <div style={{ width: 15, height: 15, borderRadius: '50% ' }} className="d-flex align-items-center  bg-light  text-dark p-1">{data.index}
                </div>

                <div className="rounded-pill text-light ">
                    {data.media_value || "type something"}
                </div>
            </DefaultDiv>
            <CustomHandle className=" bg-secondary border border-2 rounded-pill white" type="source" position={Position.Bottom} isConnectable={2} />
        </>
    )
}

export function OutputNode({ data }: { data: any }) {
    return (
        <>
            <CustomHandle className="bg-info border border-2 white" type="target" position={Position.Top} />
            <OutPutDiv className="bg-success text-light rounded-pill p-1 px-2">
                {data.media_value||"type reply"}
            </OutPutDiv>
        </>
    )
}

export function StartNode({ data }: { data: any }) {
    return (
        <>
            <StartDiv className="p-1 rounded-5 text-light  white" >
                {data.media_value || "type trigger keywords"}
            </StartDiv>
            <CustomHandle className="bg-secondary border border-2 white" type="source" position={Position.Bottom} isConnectable={1} />
        </>
    )
}