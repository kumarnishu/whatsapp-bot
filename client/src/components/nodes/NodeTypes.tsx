import { Position } from "reactflow"
import CustomHandle from "./CustomHandle"
import { styled } from "styled-components"


const MenuDiv = styled.div`
background-color:#0040ff;
`
const StartDiv = styled.div`
background-color:#ff8000

`
const DefaultDiv = styled.div`
background-color:  #ff8080
    `
const OutPutDiv = styled.div`
background-color:#ff00bf	

`
export function MenuNode({ data }: { data: any }) {
    return (
        <>
            <CustomHandle className=" bg-warning border border-2 white rounded" type="target" position={Position.Top} />
            <MenuDiv className="react-flow-menu-node  text-light rounded p-1 ">
                {data.label || "menu"}
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

                <div style={{ width: 30, height: 30, borderRadius: '50% ' }} className="d-flex align-items-center  bg-light  text-dark p-2">{data.index}
                </div>

                <div className="rounded text-light p-1">
                    {data.label || "Default"}
                </div>
            </DefaultDiv>
            <CustomHandle className=" bg-secondary border border-2 rounded white" type="source" position={Position.Bottom} isConnectable={2} />
        </>
    )
}

export function OutputNode({ data }: { data: any }) {
    return (
        <>
            <CustomHandle className="bg-info border border-2 white" type="target" position={Position.Top} isConnectable={1} />
            <OutPutDiv className="text-light rounded p-2">
                {data.label || "output"}
            </OutPutDiv>
        </>
    )
}

export function StartNode({ data }: { data: any }) {
    return (
        <>
            <StartDiv className="p-1 text-light rounded-circle p-2 white" >
                {data.label}
            </StartDiv>
            <CustomHandle className="bg-secondary border border-2 white" type="source" position={Position.Bottom} isConnectable={1} />
        </>
    )
}