import { useEffect } from "react";
import Barcode from "react-barcode";
import { toCurrencyString } from "../scripts/common";

import logo from "../assets/images/logo.svg";

interface props {
  orderData: object[];
  totalOrderPrice: number;
  transactionData: object | any;
  resetCashierFunction: Function;
  customerPayment: string
}

const Receipt: React.FC<props> = ({
  orderData,
  totalOrderPrice,
  transactionData,
  resetCashierFunction,
  customerPayment
}) => {
  useEffect(() => {
    window.print();
    resetCashierFunction();
  }, []);

  const { date, time, transactionID } = transactionData;

  return (
    <div className="bg-white p-4 w-[220px] h-auto absolute right-0 top-0 flex flex-col gap-2">
      <div className="px-6">
        <img src={logo} alt="" />
        <p className="location text-xs text-center">
          Address: Libertad st. Palompon, Leyte
        </p>
        <p className="location text-xs text-center"></p>
      </div>

      <div className="border-t-[1px] border-b-[1px] border-black border-dotted flex flex-col items-center py-2 relative">
        <div className="flex justify-center w-full relative mb-2">
          <Barcode
            height={35}
            className="w-full"
            width={3}
            format="code128"
            displayValue={false}
            renderer="svg"
            value={String(transactionID)}
          />
        </div>
        <div className="w-full flex justify-between">
          <p className="time text-xs">Transaction Date:</p>
          <p className="time text-xs">{date}</p>
        </div>
        <div className="w-full flex justify-between">
          <p className="time text-xs">Transaction Time:</p>
          <p className="time text-xs">{time}</p>
        </div>
        <div className="w-full flex justify-between whitespace-nowrap">
          <p className="time text-xs">Machine ID:</p>
          <p className="time text-xs">1</p>
        </div>
        <div className="w-full flex justify-between whitespace-nowrap mb-3">
          <p className="time text-xs">Cashier:</p>
          <p className="time text-xs">Andrew Pinon</p> {/* add cashier name */}
        </div>
        {/* ----- */}
        <div className="w-full flex justify-between ">
          <p className="time text-xs">Transaction ID:</p>
          <p className="time text-xs">{transactionID}</p>
        </div>
        <div className="w-full flex justify-between">
          <p className="time text-xs">Transaction Type:</p>
          <p className="time text-xs">Cash</p>
        </div>
      </div>

      <div className="item-list">
        <table className="w-full ">
          <colgroup>
            <col span={1} className="w-[10%]" />
            <col span={1} className="w-[65%]" />
            <col span={1} className="w-[25%]" />
          </colgroup>

          <thead className=" w-full border-b-8 border-white text-left">
            <tr className="">
              <th className="w-[10%]  text-xs">Q</th>
              <th className="w-[65%] text-xs">Item Name</th>
              <th className="w-[25%] text-xs whitespace-nowrap">Line Price</th>
            </tr>
          </thead>
          <tbody>
            {orderData.map((item: any) => {
              return (
                <tr key={item.itemID} className="align-top">
                  <td className=" text-xs">{item.quantity}</td>
                  <td className=" text-xs">{item.itemName}</td>
                  <td className="text-xs break-all">
                    {toCurrencyString(item.retailPrice * item.quantity)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="border-t-[1px] border-b-[1px] border-black border-dotted py-4">
        <div className="row flex justify-between">
          <p className="text-sm font-bold">TOTAL</p>
          <p className="text-sm font-bold">
            {toCurrencyString(totalOrderPrice)}
          </p>
        </div>
        <div className="row flex justify-between">
          <p className="text-xs">Cash</p>
          <p className="text-[.70rem]">{toCurrencyString(parseFloat(customerPayment))}</p>
        </div>
        <div className="row flex justify-between">
          <p className="text-xs">Change</p>
          <p className="text-[.70rem]">{toCurrencyString(parseFloat(customerPayment)-totalOrderPrice)}</p>
        </div>
      </div>

      <div className="">
        <p className="text-xs text-center">
          Thank you for shopping at Techpal!
        </p>
      </div>
    </div>
  );
};

export default Receipt;
