import React from "react"

interface props {
    label: string,
    value: string | number,
    type: string,
    setter: React.Dispatch<React.SetStateAction<string>> | React.Dispatch<React.SetStateAction<number>>
    ref_input: any
}

const errorStyle ={
    border: "1px solid red"
  }

const InputRow: React.FC<props> = ({ label, value, type, setter, ref_input }: props) => {
    return (
        <div className="row flex flex-col gap-2 h-full">
            <p className="text-sm font-medium">{label}</p>
            <input
                ref={ref_input}
                onChange={(e:any) => setter(e.target.value)}
                value={value}
                type={type}
                className="w-full h-full px-4 text-sm border-[1px] border-gray-300"
            />
        </div>
    )
}

export default InputRow