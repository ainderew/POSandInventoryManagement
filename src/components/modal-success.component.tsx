import check from '../assets/images/check.svg'

const ModalSuccess: React.FC = () =>{
    return(
        <div className="tilt-in-fwd-tr h-[10rem] w-[25vw] bg-white flex flex-col justify-center items-center absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] z-20">
            <div className="absolute -top-1/4 h-1/2" >
                <img className='object-cover h-full' src={check} alt="" />
            </div>
            <p className="">Success</p>
        </div>
    )
}

export default ModalSuccess