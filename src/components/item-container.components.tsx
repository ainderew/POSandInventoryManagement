import { toCurrencyString } from "../scripts/common";

interface props {
  name: string;
  quantity: number;
  price: string;
  addToOrder: Function
}
const ItemContainer: React.FC<props> = ({ name, quantity, price, addToOrder }) => {
  return (
    <div
    onClick={()=>addToOrder()}
    className="neumorphism grid grid-cols-[3fr_1fr] p-4">
      <div className="flex flex-col ">
        <div className="name flex-grow">
          <p className="font-medium">{name}</p>
        </div>
        <div className="qty flex-grow">
          <p className="text-xs">
            In Stock:{" "}
            <span style={quantity < 1 ? { color: "red" } : {}} className="">
              {quantity}
            </span>
          </p>
        </div>
      </div>
      <div className="price flex justify-center items-center">
        <p className="text-sm font-semibold">{toCurrencyString(parseFloat(price))}</p>
      </div>
    </div>
  );
};

export default ItemContainer;
