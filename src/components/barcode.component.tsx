import React, { useState } from 'react'
import { getItemUsingBarcode } from '../preload'


interface props {
    inputRef: React.MutableRefObject<HTMLInputElement | null>
    addToOrder: Function
}

const BarcodeInput: React.FC<props> = ({ inputRef, addToOrder }: props) => {
    const [barcode, setBarcode] = useState<string>("")

    const handleSubmit = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== "Enter") return;

        const data: any = await getItemUsingBarcode({ barcode: barcode })
        if (data.length !== 0) addToOrder(data[0]);
        setBarcode("")

    }

    return (
        <input
            ref={inputRef}
            onKeyDown={(e) => handleSubmit(e)}
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            type="text" className="absolute top-[-1000rem]" />)
}

export default BarcodeInput