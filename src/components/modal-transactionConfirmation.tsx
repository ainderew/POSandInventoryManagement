interface props {
  totalAmount: number;
  customerPayment: string;
  modalSetter: Function;
  processOrder: Function;
}

const ModalTransactionConfirmation: React.FC<props> = ({
  totalAmount,
  customerPayment,
  modalSetter,
  processOrder,
}: props) => {
  const handleCloseModal = (): void => {
    modalSetter(false);
  };

  const handleNext = () => {
    processOrder();
    handleCloseModal();
  };

  return (
    <div className="w-full h-full absolute left-0 bg-blurredBG flex justify-center items-center">
      <div className="header bg-white min-w-[25rem] min-h-[2rem] grid grid-rows-[4rem_1fr_3rem]">
        <div className="flex justify-between items-center px-4 ">
          <p className="font-medium text-sm">Verify Transaction</p>
          <p
            onClick={handleCloseModal}
            className="font-medium cursor-pointer hover:text-red-500"
          >
            X
          </p>
        </div>

        <div className="body px-8">
          <table className="w-full ">
            <tbody>
              <tr className="">
                <td className=" text-lg-">Payment</td>
                <td className="text-right text-lg-">Php {customerPayment}</td>
              </tr>
              <tr>
                <td className="font-bold text-lg- text-main">TOTAL</td>
                <td className="font-bold text-right text-lg- text-main">
                  Php {totalAmount}
                </td>
              </tr>
              <tr className="h-20">
                <td className=" text-lg-">Change</td>
                <td className="text-right text-lg-">
                  Php {parseFloat(customerPayment) - totalAmount}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="footer bg-gray-100 flex items-center px-4 justify-end gap-2">
          <button onClick={handleCloseModal} className="px-2 hover:text-main">
            Cancel
          </button>
          <button
            onClick={handleNext}
            className="px-8 py-1 bg-main text-white rounded-md"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalTransactionConfirmation;
