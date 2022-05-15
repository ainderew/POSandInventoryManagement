import { toCurrencyString } from "../scripts/common";
interface props {
  orderedItemData: any;
}

const OrderedItemContainer: React.FC<props> = ({ orderedItemData }) => {
  const totalPrice = orderedItemData.retailPrice * orderedItemData.quantity;
  return (
    <div className="w-full min-h-[5rem] border-b-2 border-gray-300 p-4 flex justify-between">
      <div className="flex flex-col">
        <p className="itemName">{orderedItemData.itemName}</p>
        <p className="itemPrice text-xs">
          Price: {toCurrencyString(orderedItemData.retailPrice)}
        </p>
        <p className="itemPrice text-xs">Qty: {orderedItemData.quantity}</p>
      </div>
      <div className="">
        <p className="totalPrice text-sm">{toCurrencyString(totalPrice)}</p>
      </div>
    </div>
  );
};

export default OrderedItemContainer;
