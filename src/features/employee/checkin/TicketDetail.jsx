import {
  FaCalendarAlt,
  FaChair,
  FaCheckCircle,
  FaDoorOpen,
  FaDownload,
  FaExclamationTriangle,
  FaFilm,
  FaMapMarkerAlt,
  FaReceipt,
  FaTheaterMasks,
  FaTimesCircle,
  FaTag,
  FaCoins,
} from "react-icons/fa";
import { LuPopcorn } from "react-icons/lu";
import { Alert, Badge, Spin } from "antd";
import { format } from "date-fns";
import {
  PROMOTION_TYPE_PERCENTAGE,
  POINTS_TO_VND_RATIO,
} from "../../../utils/constant";

function TicketDetail({
  bookingData,
  isLoading,
  checkinStatus = "Not Checked In",
  errorType,
}) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Spin size="large" />
      </div>
    );
  }

  if (!bookingData) return null;

  const {
    payment,
    booking,
    movie,
    theater,
    screen,
    seats,
    concessions,
    showTime,
    promotion,
  } = bookingData;

  // Format date and time
  const showDate = format(new Date(showTime.date), "dd/MM/yyyy");
  const showTimeFormatted = showTime.startTime.substring(0, 5);
  const paymentDate = format(new Date(payment.paymentDate), "dd/MM/yyyy HH:mm");

  // Generate seat names
  const seatNames = seats.map((seat) => `${seat.seatRow}${seat.seatNumber}`);

  // Calculate concessions total
  const concessionsWithSubtotal = concessions.map((item) => ({
    ...item,
    subtotal: item.price * item.quantity,
  }));

  // // Generate barcode text
  // const barcodeText =
  //   "CineMax_Ticket_" +
  //   payment.id +
  //   "_" +
  //   dayjs(payment.paymentDate).format("YYYYMMDDHHmmss");

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md border-2 border-dashed border-gray-300">
      {/* Header */}
      <div className="text-center pb-3 border-b-2 border-blue-600">
        <div className="text-2xl font-bold">🎟️ Ticket Details</div>
        {payment.userId && (
          <div className="text-sm mt-1 text-blue-600">
            Registered Customer ID: {payment.userId}
          </div>
        )}
      </div>

      {/* Movie Details */}
      <div className="py-4 border-b border-dashed border-gray-300 space-y-1">
        <h5 className="text-lg font-semibold flex items-center">
          <FaFilm className="mr-2 text-blue-500" /> {movie.title}
        </h5>
        <p className="flex items-center">
          <FaTheaterMasks className="mr-2 text-purple-500" /> {theater.name}
        </p>
        <p className="flex items-center">
          <FaMapMarkerAlt className="mr-2 text-red-500" /> {theater.address}
        </p>
        <p className="flex items-center">
          <FaDoorOpen className="mr-2 text-yellow-500" /> Screen: {screen.name}
        </p>
        <p className="flex items-center">
          <FaCalendarAlt className="mr-2 text-green-500" /> {showDate} at{" "}
          {showTimeFormatted}
        </p>
      </div>

      {/* Seats */}
      <div className="py-4 border-b border-dashed border-gray-300">
        <h5 className="text-lg font-semibold mb-2 flex items-center">
          <FaChair className="mr-2 text-indigo-500" /> Seats
        </h5>
        <div className="flex flex-wrap gap-2">
          {seatNames.map((seat, idx) => (
            <span
              key={idx}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
            >
              {seat}
            </span>
          ))}
        </div>
      </div>

      {/* Concessions */}
      <div className="py-4 border-b border-dashed border-gray-300">
        <h5 className="text-lg font-semibold mb-2 flex items-center">
          <LuPopcorn className="mr-2 text-orange-500" /> Concessions
        </h5>
        {concessionsWithSubtotal.map((item, idx) => (
          <p key={idx}>
            {item.name} x {item.quantity} -{" "}
            <strong>{item.subtotal.toLocaleString()} đ</strong>
          </p>
        ))}
      </div>

      {/* Payment Summary */}
      <div className="py-4 border-b border-dashed border-gray-300 space-y-1">
        <h5 className="text-lg font-semibold mb-2 flex items-center">
          <FaReceipt className="mr-2 text-pink-500" /> Payment Summary
        </h5>
        <p>
          <strong>Payment Method:</strong> {payment.paymentMethod}
        </p>
        <p>
          <strong>Paid On:</strong> {paymentDate}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span className="inline-block bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">
            {payment.paymentStatus}
          </span>
        </p>

        {/* Price Breakdown */}
        <div className="mt-3 border-t border-dashed pt-2 space-y-1">
          {/* Subtotal */}
          {payment.totalAmount && (
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{payment.totalAmount.toLocaleString()} đ</span>
            </div>
          )}

          {/* Discounts */}
          {payment.discountAmount > 0 && (
            <div className="text-red-600">
              {/* Promotion discount */}
              {promotion && (
                <div className="flex justify-between items-center">
                  <span className="flex items-center">
                    <FaTag className="mr-1" /> Promotion:
                    {promotion.discountType === PROMOTION_TYPE_PERCENTAGE
                      ? ` (${bookingData.promotion.discountValue}%)`
                      : ""}
                  </span>
                  <span>
                    -{" "}
                    {(promotion.discountType === PROMOTION_TYPE_PERCENTAGE
                      ? (
                          payment.totalAmount *
                          (bookingData.promotion.discountValue / 100)
                        ).toFixed(0)
                      : bookingData.promotion.discountValue
                    ).toLocaleString()}{" "}
                    đ
                  </span>
                </div>
              )}

              {/* Points used */}
              {payment.bonusPointsUsed > 0 && (
                <div className="flex justify-between items-center">
                  <span className="flex items-center">
                    <FaCoins className="mr-1" /> Points:{" "}
                    {payment.bonusPointsUsed.toLocaleString()}
                  </span>
                  <span>
                    -{" "}
                    {(
                      payment.bonusPointsUsed * POINTS_TO_VND_RATIO
                    ).toLocaleString()}{" "}
                    đ
                  </span>
                </div>
              )}

              {/* Total discount if both promotion and points */}
              {promotion && payment.bonusPointsUsed > 0 && (
                <div className="flex justify-between border-t border-dashed border-red-300 pt-1 mt-1">
                  <span>Total Discount:</span>
                  <span>- {payment.discountAmount.toLocaleString()} đ</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Final Total */}
        <p className="text-right text-lg font-bold mt-2 pt-2 border-t border-dashed">
          Total Paid: {payment.finalAmount.toLocaleString()} đ
        </p>
      </div>

      {/* Barcode
      <div className="pt-4 text-center">
        <img
          src={`https://api.qrserver.com/v1/create-qr-code/?data=${
            "CineMax_Ticket_" +
            payment.id +
            "_" +
            dayjs(payment.paymentDate).format("YYYYMMDDHHmmss")
          }&size=150x150`}
          alt="Ticket Barcode"
          className="mx-auto mb-2"
        />
        <p className="text-gray-500 text-sm">{barcodeText}</p>
        <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200 inline-flex items-center">
          <FaDownload className="mr-2" /> Download Ticket
        </button>
      </div> */}

      {/* Customer Info */}
      {payment.userId && (
        <div className="pt-4 border-b border-dashed border-gray-300">
          <h5 className="text-lg font-semibold mb-2 flex items-center">
            <FaCoins className="mr-2 text-amber-500" /> Loyalty Points
          </h5>
          <div className="flex flex-col space-y-1 mb-2">
            {payment.bonusPointsUsed > 0 && (
              <div className="flex justify-between">
                <span>Points Used:</span>
                <span className="text-red-600">
                  -{payment.bonusPointsUsed.toLocaleString()}
                </span>
              </div>
            )}
            {booking.pointsEarned > 0 && (
              <div className="flex justify-between">
                <span>Points Earned:</span>
                <span className="text-green-600">
                  +{booking.pointsEarned.toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Check-in Status */}
      <div className="mt-4 pt-4 border-t border-dashed border-gray-300 text-center">
        <h5 className="text-lg font-semibold mb-2">Check-in Status</h5>

        {/* Error: Already checked in */}
        {errorType === "ALREADY_CHECKED_IN" && (
          <Alert
            message="Ticket Already Checked In"
            description={
              <div>
                <p>This ticket has already been checked in.</p>
                {booking && (
                  <p className="font-semibold mt-2">
                    Checked in at:{" "}
                    {format(
                      new Date(booking.lastUpdatedAt),
                      "dd/MM/yyyy HH:mm:ss"
                    )}
                  </p>
                )}
              </div>
            }
            type="warning"
            showIcon
            icon={<FaExclamationTriangle />}
            className="mb-4"
          />
        )}

        {/* General error */}
        {errorType === "GENERAL_ERROR" && (
          <Alert
            message="Check-in Error"
            description="An error occurred during the check-in process. Please try again or contact support."
            type="error"
            showIcon
            className="mb-4"
          />
        )}

        {/* Normal check-in status */}
        {!errorType && (
          <Badge
            status={checkinStatus === "Checked In" ? "success" : "warning"}
            text={
              <span
                className={`text-lg ${
                  checkinStatus === "Checked In"
                    ? "text-green-600"
                    : "text-yellow-600"
                }`}
              >
                {checkinStatus === "Checked In" ? (
                  <span className="flex items-center justify-center">
                    <FaCheckCircle className="mr-2" /> Checked In
                  </span>
                ) : (
                  "Not Checked In"
                )}
              </span>
            }
          />
        )}
      </div>
    </div>
  );
}

export default TicketDetail;
