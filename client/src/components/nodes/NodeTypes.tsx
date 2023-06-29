import { Position } from "reactflow"
import CustomHandle from "./CustomHandle"


export function MenuNode({ data }: { data: any }) {
    return (
        <>
            <CustomHandle  className="p-1 bg-danger border border-2 white" type="target" position={Position.Top} isConnectable={2} />
            <div className="react-flow-menu-node bg-danger text-light rounded p-4">
                Menu:{data.label}
            </div>
            <CustomHandle  className="p-1 bg-dark border border-2 white" type="source" position={Position.Bottom} isConnectable={2} />
        </>
    )
}

export function DefaultNode({ data }: { data: any }) {
    return (
        <>
            <CustomHandle className="p-1 bg-danger border border-2 white" type="target" position={Position.Top} isConnectable={2} />
            <div className="d-flex gap-1 react-flow-default-node bg-success text-light rounded ">
            <div className="id border p-2 ">{data.index}</div>
                <div className="label border p-2">
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quos quo, illum vel, culpa, nulla voluptate nostrum doloribus blanditiis quam tenetur esse amet iure a quibusdam eaque aut hic ab suscipit!
               </div>
           
            </div>
            <CustomHandle  className="p-1 bg-dark border border-2 white" type="source" position={Position.Bottom} isConnectable={2} />
        </>
    )
}

export function OutputNode({ data }: { data: any }) {
    return (

        <>
            <CustomHandle  className="p-1 bg-danger border border-2 white" type="source" position={Position.Top} isConnectable={1} />
            <div className="react-flow-output-node bg-warning rounded p-2">
                Output:{data.id}
            </div>
        </>
    )
}

export function StartNode({ data }: { data: any }) {
    return (

        <>
            <div className="react-flow-start-node bg-warning rounded-circle p-2">
                {data.label}
            </div>
            <CustomHandle className="p-1 bg-secondary border border-2 white" type="source" position={Position.Bottom} isConnectable={1} />
        </>
    )
}