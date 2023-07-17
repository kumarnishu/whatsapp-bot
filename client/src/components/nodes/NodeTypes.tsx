import { Position } from "reactflow"
import CustomHandle from "./CustomHandle"
import { styled } from "styled-components"


const MenuDiv = styled.div`
background-color:#0040ff;
font-size:10px;
`
const StartDiv = styled.div`
background-color:#c72246;
font-size:10px;

`
const DefaultDiv = styled.div`
background-color:#5e635f;
font-size:10px;
    `
const CommonDiv = styled.div`
background-color:#ff8080;
font-size:10px;
    `
const OutPutDiv = styled.div`
background-color:#32CD32;
font-size:10px;
max-width:200px;
overflow:hidden;

`

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

export function CommonNode({ data }: { data: any }) {
    return (
        <>
            <CustomHandle className=" bg-info border border-2 white" type="target" position={Position.Top} isConnectable={2} />
            <CommonDiv className="d-flex gap-1 p-1 rounded ">
                <div className="rounded text-light ">
                    {data.media_value || "Common"}
                </div>
            </CommonDiv>
            <CustomHandle className=" bg-secondary border border-2 rounded white" type="source" position={Position.Bottom} />
        </>
    )
}

export function MenuNode({ data }: { data: any }) {
    return (
        <>
            <CustomHandle className=" bg-warning border border-2 white rounded" type="target" position={Position.Top} />
            <MenuDiv className="react-flow-menu-node d-flex gap-1 p-1 rounded">
                <div className="rounded text-light ">
                    {data.media_value || "Menu"}
                </div>
            </MenuDiv>
            <CustomHandle className="bg-secondary border border-2 white" type="source" position={Position.Bottom} />
        </>
    )
}

export function DefaultNode({ data }: { data: any }) {
    return (
        <>
            <CustomHandle className=" bg-info border border-2 white" type="target" position={Position.Top} isConnectable={2} />
            <DefaultDiv className="d-flex gap-1 p-1 rounded ">
                {
                    data.index ?
                        <div style={{ width: 15, height: 15, borderRadius: '50% ' }} className="d-flex align-items-center  bg-light  text-dark p-1">{data.index}
                        </div> : null

                }


                <div className="rounded text-light ">
                    {data.media_value || "Default"}
                </div>
            </DefaultDiv>
            <CustomHandle className=" bg-secondary border border-2 rounded white" type="source" position={Position.Bottom} />
        </>
    )
}

export function OutputNode({ data }: { data: any }) {
    return (
        <>
            <CustomHandle className=" bg-info border border-2 white" type="target" position={Position.Top} isConnectable={1} />
            <OutPutDiv className="d-flex gap-1 p-1 rounded text-light ">
                {
                    data.index ?
                        <div style={{ width: 15, height: 15, borderRadius: '50% ' }} className="d-flex align-items-center  bg-light  text-dark p-1">{data.index}
                        </div> : null

                }
                <div className="rounded text-light ">
                    {data.media_type === "media" ? "media" : data.media_value}
                </div>
            </OutPutDiv>
        </>
    )
}

