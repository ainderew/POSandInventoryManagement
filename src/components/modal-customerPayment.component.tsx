import React, { useState } from "react";

interface props {
  customerPayment: string;
  setCustomerPayment: React.Dispatch<React.SetStateAction<string>>;
  setModalFlag: Function;
  nextModalFlag: Function;
}

const ModalCustomerPayment: React.FC<props> = ({
  customerPayment,
  setCustomerPayment,
  setModalFlag,
  nextModalFlag,
}: props) => {
  const [errorFlag, setErrorFlag] = useState<boolean>(false);
  const [localInputValue, setLocalInputValue] = useState<string>("") //Handle input value baing cleared when closed and not affecting customer payment value

  const errorStyle = {
    border: "1px solid red",
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setLocalInputValue(e.target.value);
    return;
  };

  const closeModal = (): void => {
    setModalFlag(false);
  };

  const openNextModal = () => {
    nextModalFlag(true);
  };

  const handleNext = (): void => {
    if (localInputValue === "") {
      setErrorFlag(true);
      return;
    }
    setCustomerPayment(localInputValue)
    openNextModal();
    closeModal();
  };
  return (
    <div className="absolute w-full h-full bg-blurredBG left-0 flex justify-center items-center">
      <div className="modal min-w-[25rem] min-h-[14rem] bg-white grid grid-rows-[3rem_1fr_3rem] rounded-md">
        <div className="header w-full flex justify-between items-center px-4 shadow-md">
          <p className="font-medium">Customer's Payment</p>
          <p onClick={() => closeModal()} className="font-bold text-gray-400">
            X
          </p>
        </div>

        <div className="body px-4 flex justify-center items-center">
          <input
            value={localInputValue}
            onChange={handleOnChange}
            autoFocus={true}
            type="number"
            placeholder="Enter payment"
            className="w-full h-12  px-4 border-2 border-gray-200 rounded-md outline-none"
            style={errorFlag ? errorStyle : {}}
          />
        </div>

        <div className="footer bg-gray-100 flex justify-end items-center gap-1 px-4 rounded-b-md">
          <button onClick={closeModal} className="text-black px-8">
            Cancel
          </button>
          <button
            onClick={handleNext}
            className="text-white bg-main py-1 px-8 rounded-lg"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalCustomerPayment;
