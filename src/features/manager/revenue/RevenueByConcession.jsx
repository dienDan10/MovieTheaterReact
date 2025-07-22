import { useState } from "react";
import ConcessionRevenueItem from "./ConcessionRevenueItem";
import RevenueByConcessionModal from "./RevenueByConcessionModal";

function RevenueByConcession({ revenue }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Aggregate revenue data by concession
  const concessionStats = {};
  revenue.forEach(({ concessions }) => {
    if (!concessions || concessions.length === 0) return;
    concessions.forEach(({ id, name, quantity, amount }) => {
      if (!concessionStats[id]) {
        concessionStats[id] = {
          concessionId: id,
          name: name.trim(),
          totalQuantity: 0,
          totalRevenue: 0,
        };
      }

      concessionStats[id].totalQuantity += quantity;
      concessionStats[id].totalRevenue += amount;
    });
  });

  const result = Object.values(concessionStats).sort(
    (a, b) => b.totalRevenue - a.totalRevenue
  );

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-md mb-6 mt-6">
      <div className="flex justify-between items-center border-b border-neutral-200">
        <h2 className="text-lg font-semibold mb-4">
          Doanh thu theo combo bỏng nước
        </h2>
        <p
          className="text-gray-600 hover:underline cursor-pointer"
          onClick={handleOpenModal}
        >
          Xem tất cả
        </p>
      </div>
      {result.slice(0, 3).map((concession) => (
        <ConcessionRevenueItem
          key={concession.concessionId}
          concession={concession}
        />
      ))}

      <RevenueByConcessionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        concessionStats={result}
      />
    </div>
  );
}

export default RevenueByConcession;
