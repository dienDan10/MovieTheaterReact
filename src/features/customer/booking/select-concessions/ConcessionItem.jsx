import { useDispatch } from "react-redux";
import {
  decreaseConcessionCount,
  increaseConcessionCount,
} from "../../../../redux/bookingSlice";

function ConcessionItem({ item }) {
  const dispatch = useDispatch();

  const handleIncreaseQuantity = () => {
    dispatch(increaseConcessionCount(item.id));
  };

  const handleDecreaseQuantity = () => {
    if (item.count <= 0) return;
    dispatch(decreaseConcessionCount(item.id));
  };

  return (
    <div key={item.id} className="flex justify-between items-center">
      <div className="flex items-center flex-1">
        <img
          src={item.imageUrl || "https://placehold.co/64x64?text=No+Image"}
          alt={item.name}
          className="w-16 h-16 rounded-lg object-cover mr-4"
        />
        <div>
          <h3 className="font-semibold text-gray-800 mb-1">{item.name}</h3>
          <p className="text-sm text-blue-500">{item.description}</p>
        </div>
      </div>

      <div className="flex items-center space-x-8">
        <span className="text-lg font-semibold text-gray-800">
          {item.price}
        </span>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleDecreaseQuantity}
            className="w-8 h-8 rounded-full border text-red-600 hover:text-neutral-50 border-red-600 flex items-center justify-center hover:cursor-pointer hover:bg-red-600 transition-colors duration-200 pb-1"
          >
            -
          </button>
          <span className="w-8 text-center text-red-600">
            {item.count || 0}
          </span>
          <button
            onClick={handleIncreaseQuantity}
            className="w-8 h-8 rounded-full border text-red-600 hover:text-neutral-50 border-red-600 flex items-center justify-center hover:cursor-pointer hover:bg-red-600 transition-colors duration-200 pb-1"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConcessionItem;
