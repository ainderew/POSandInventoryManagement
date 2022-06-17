import { SetStateAction } from 'react'
import check from '../assets/images/check.svg'

interface props {
    description: string
    setter?: React.Dispatch<SetStateAction<boolean>>
}

const ModalSuccess: React.FC<props> = ({ description, setter = ()=>{} }: props) => {
    return (
        <div className="w-[341.5px] min-h-[25rem] shadow-2xl bg-white grid grid-rows-2 absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] z-20">
            <div className="bg-green-100 flex items-center justify-center p-12">
                <img src={check} alt="" className="object-cover h-full" />
            </div>
            <div className="flex flex-col items-center justify-around py-8 px-3 gap-4">
                <p className="font-bold text-xl">Success!</p>
                <p className="text-center">{description}</p>
                <button
                onClick={() => setter(false)}
                className="bg-green-400 px-10 py-2 text-white rounded-lg shadow-md">CONTINUE</button>
            </div>
        </div>

    )
}

export default ModalSuccess