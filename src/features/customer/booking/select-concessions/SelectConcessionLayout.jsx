import { useState } from "react";

const combos = [
  {
    id: 1,
    title: "Beta Combo 69oz",
    description: "TIẾT KIỆM 28K! Gồm: 1 Bắp (69oz) + 1 Nước có gaz (92oz)",
    price: "68.000 đ",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=80&h=80&fit=crop&crop=center",
  },
  {
    id: 2,
    title: "Family Combo 69oz",
    description:
      "TIẾT KIỆM 95K! Gồm: 2 Bắp (69oz) + 4 Nước có gaz (92oz) + 2 Snack Oishi (80g)",
    price: "213.000 đ",
    image:
      "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=80&h=80&fit=crop&crop=center",
  },
  {
    id: 3,
    title: "Sweet Combo 69oz",
    description: "TIẾT KIỆM 46K! Gồm: 1 Bắp (69oz) + 2 Nước có gaz (92oz)",
    price: "88.000 đ",
    image:
      "https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=80&h=80&fit=crop&crop=center",
  },
];

function SelectConcessionLayout() {
  const [quantities, setQuantities] = useState(
    combos.reduce((acc, combo) => ({ ...acc, [combo.id]: 0 }), {})
  );

  const increment = (id) => {
    setQuantities((prev) => ({ ...prev, [id]: prev[id] + 1 }));
  };

  const decrement = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(prev[id] - 1, 0),
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex-[2]">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 flex-2">COMBO</h2>
        <div className="flex space-x-8 flex-1 justify-around">
          <span className="text-sm font-medium text-gray-600">GIÁ TIỀN</span>
          <span className="text-sm font-medium text-gray-600">SỐ LƯỢNG</span>
        </div>
      </div>

      {/* Menu Items */}
      <div className="space-y-6">
        {combos.map((combo) => (
          <div key={combo.id} className="flex justify-between items-center">
            <div className="flex items-center flex-1">
              <img
                src={combo.image}
                alt={combo.title}
                className="w-16 h-16 rounded-lg object-cover mr-4"
              />
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">
                  {combo.title}
                </h3>
                <p className="text-sm text-blue-500">{combo.description}</p>
              </div>
            </div>

            <div className="flex items-center space-x-8">
              <span className="text-lg font-semibold text-gray-800">
                {combo.price}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => decrement(combo.id)}
                  className="w-8 h-8 rounded-full border text-red-600 hover:text-neutral-50 border-red-600 flex items-center justify-center hover:cursor-pointer hover:bg-red-600 transition-colors duration-200 pb-1"
                >
                  -
                </button>
                <span className="w-8 text-center text-red-600">
                  {quantities[combo.id]}
                </span>
                <button
                  onClick={() => increment(combo.id)}
                  className="w-8 h-8 rounded-full border text-red-600 hover:text-neutral-50 border-red-600 flex items-center justify-center hover:cursor-pointer hover:bg-red-600 transition-colors duration-200 pb-1"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SelectConcessionLayout;
