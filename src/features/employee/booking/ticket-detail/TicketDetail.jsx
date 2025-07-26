import { useSelector } from "react-redux";
import dayjs from "dayjs";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  DownloadOutlined,
  UserOutlined,
  HomeOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  ClockCircleFilled,
  TagOutlined,
  CoffeeOutlined,
  BarcodeOutlined,
} from "@ant-design/icons";
import { GiFilmSpool } from "react-icons/gi";
import { IoReceiptOutline } from "react-icons/io5";
import {
  SEAT_TYPE_VIP,
  PROMOTION_TYPE_PERCENTAGE,
} from "../../../../utils/constant";

function TicketDetail() {
  const { paymentDetails } = useSelector((state) => state.employeeBooking);

  if (!paymentDetails) return null;

  const { payment, showTime, movie, theater, screen, seats, concessions } =
    paymentDetails;
  const formattedDate = dayjs(showTime.date).format("DD/MM/YYYY");
  const formattedPaymentDate = dayjs(payment.paymentDate).format(
    "DD/MM/YYYY HH:mm"
  );

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      {/* Confirmation Header */}
      <div className="bg-gray-100 rounded-lg p-6 mb-8 text-center">
        <h1 className="text-green-600 text-3xl font-bold">
          <CheckCircleOutlined className="mr-2" /> Booking Confirmed!
        </h1>
        <p className="text-lg mt-2">
          {payment.userId ? "Customer" : "Guest"} booking for {payment.name}
        </p>
        <div className="flex justify-center gap-4 mt-2">
          <p className="text-sm text-gray-500">
            Booking #{paymentDetails.booking?.id || payment.id}
          </p>
          <p className="text-sm text-gray-500">Payment #{payment.id}</p>
          <p className="text-sm text-gray-500">
            {payment.paymentStatus === "Pending" ? (
              <span className="inline-block bg-yellow-200 text-yellow-800 text-xs font-medium px-2 py-1 rounded">
                <ClockCircleOutlined className="mr-1" /> Pending
              </span>
            ) : (
              <span className="inline-block bg-green-200 text-green-800 text-xs font-medium px-2 py-1 rounded">
                <CheckCircleOutlined className="mr-1" /> Success
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Movie Details */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="bg-red-600 text-white rounded-t-md px-4 py-2">
              <h3 className="text-lg font-semibold flex items-center">
                <GiFilmSpool className="mr-2" /> Movie Details
              </h3>
            </div>
            <div className="flex flex-col md:flex-row gap-4 mt-4">
              <div className="w-full md:w-1/3 bg-gray-100 h-40 flex items-center justify-center overflow-hidden rounded">
                <img
                  src={movie.posterUrl}
                  alt={`${movie.title} Poster`}
                  className="object-cover h-full w-full"
                />
              </div>
              <div className="w-full md:w-2/3">
                <h2 className="text-2xl font-semibold">{movie.title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 mt-4 gap-2 text-sm">
                  <div className="space-y-1">
                    <p>
                      <strong>
                        <HomeOutlined className="mr-2" /> Theater:
                      </strong>{" "}
                      {theater.name}
                    </p>
                    <p>
                      <strong>
                        <EnvironmentOutlined className="mr-2" /> Location:
                      </strong>{" "}
                      {theater.address}
                    </p>
                    <p>
                      <strong>
                        <TagOutlined className="mr-2" /> Screen:
                      </strong>{" "}
                      {screen.name}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p>
                      <strong>
                        <CalendarOutlined className="mr-2" /> Date:
                      </strong>{" "}
                      {formattedDate}
                    </p>
                    <p>
                      <strong>
                        <ClockCircleFilled className="mr-2" /> Time:
                      </strong>{" "}
                      {showTime.startTime.slice(0, 5)}
                    </p>
                    <p>
                      <strong>
                        <TagOutlined className="mr-2" /> Seats:
                      </strong>
                      {seats.map((seat) => (
                        <span
                          key={seat.id}
                          className={`inline-block px-2 py-1 rounded text-xs mr-2 mb-1 ${
                            seat.seatType === SEAT_TYPE_VIP
                              ? "bg-amber-200 text-amber-800 border border-amber-400"
                              : "bg-gray-200 text-gray-800"
                          }`}
                        >
                          {seat.seatRow}
                          {seat.seatNumber}
                          {seat.seatType === "VIP" && (
                            <span className="ml-1">★</span>
                          )}
                        </span>
                      ))}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Concessions */}
          {concessions.length > 0 && (
            <div className="bg-white rounded-lg shadow p-4">
              <div className="bg-red-600 text-white rounded-t-md px-4 py-2">
                <h3 className="text-lg font-semibold">
                  <CoffeeOutlined className="mr-2" /> Concessions
                </h3>
              </div>
              <div className="mt-4 space-y-4 text-sm">
                {concessions.map((item) => (
                  <div
                    key={item.id}
                    className="border-b border-dashed pb-2 flex justify-between"
                  >
                    <span>
                      {item.name} x{item.quantity}
                    </span>
                    <span>
                      {(item.price * item.quantity).toLocaleString()} đ
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Payment Summary */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="bg-red-600 text-white rounded-t-md px-4 py-2">
              <h3 className="text-lg font-semibold flex items-center">
                <IoReceiptOutline className="mr-2" /> Payment Summary
              </h3>
            </div>
            <div className="mt-4 text-sm space-y-2">
              <p>
                <strong>Payment Method:</strong> {payment.paymentMethod}
              </p>
              <p>
                <strong>Payment Date:</strong> {formattedPaymentDate}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {payment.paymentStatus === "Pending" ? (
                  <span className="inline-block bg-yellow-200 text-yellow-800 text-xs font-medium px-2 py-1 rounded">
                    <ClockCircleOutlined className="mr-1" /> Pending
                  </span>
                ) : (
                  <span className="inline-block bg-green-200 text-green-800 text-xs font-medium px-2 py-1 rounded">
                    <CheckCircleOutlined className="mr-1" /> Success
                  </span>
                )}
              </p>

              <hr className="my-4" />

              <h5 className="font-semibold mb-2">Order Summary</h5>
              <div className="text-sm space-y-2">
                {seats.map((seat) => (
                  <div key={seat.id} className="flex justify-between">
                    <span>
                      Seat {seat.seatRow}
                      {seat.seatNumber}
                      {seat.seatType === SEAT_TYPE_VIP && (
                        <span className="ml-1 text-amber-600 font-medium">
                          ★ VIP
                        </span>
                      )}
                    </span>
                    <span>
                      {seat.seatType === SEAT_TYPE_VIP
                        ? showTime.vipTicketPrice.toLocaleString()
                        : showTime.ticketPrice.toLocaleString()}{" "}
                      đ
                    </span>
                  </div>
                ))}

                {concessions.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>
                      {item.name} x{item.quantity}
                    </span>
                    <span>
                      {(item.price * item.quantity).toLocaleString()} đ
                    </span>
                  </div>
                ))}

                <hr />

                {/* Subtotal */}
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{payment.totalAmount?.toLocaleString() || "0"} đ</span>
                </div>

                {/* Discount section */}
                {payment.discountAmount > 0 && (
                  <div className="text-red-600">
                    {/* Promotion discount */}
                    {paymentDetails.promotion && (
                      <div className="flex justify-between">
                        <span>
                          Promotion: <br />
                          <span className="text-xs italic">
                            ({paymentDetails.promotion.description})
                          </span>
                          {paymentDetails.promotion.discountType ===
                          PROMOTION_TYPE_PERCENTAGE
                            ? ` (${paymentDetails.promotion.discountValue}%)`
                            : ""}
                        </span>
                        <span>
                          -{" "}
                          {(paymentDetails.promotion.discountType ===
                          PROMOTION_TYPE_PERCENTAGE
                            ? (
                                payment.totalAmount *
                                (paymentDetails.promotion.discountValue / 100)
                              ).toFixed(0)
                            : paymentDetails.promotion.discountValue
                          ).toLocaleString()}{" "}
                          đ
                        </span>
                      </div>
                    )}

                    {/* Points used */}
                    {payment.bonusPointsUsed > 0 && (
                      <div className="flex justify-between">
                        <span>
                          Points used:{" "}
                          {payment.bonusPointsUsed.toLocaleString()} points
                        </span>
                        <span>
                          - {(payment.bonusPointsUsed * 10).toLocaleString()} đ
                        </span>
                      </div>
                    )}

                    {/* Total discount */}
                    <div className="flex justify-between font-medium">
                      <span>Total Discount</span>
                      <span>- {payment.discountAmount.toLocaleString()} đ</span>
                    </div>
                  </div>
                )}

                <hr />
                <div className="flex justify-between font-semibold text-base">
                  <span>Final Total</span>
                  <span>
                    {payment.finalAmount?.toLocaleString() ||
                      payment.amount?.toLocaleString() ||
                      "0"}{" "}
                    đ
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Barcode */}
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="bg-red-600 text-white rounded-t-md px-4 py-2">
              <h3 className="text-lg font-semibold">
                <BarcodeOutlined className="mr-2" /> Your Ticket
              </h3>
            </div>
            <div className="mt-4">
              <div className="bg-gray-100 h-30 flex items-center justify-center rounded mb-2">
                {/* Create QR code with the format CineMax_Ticket_{payment.Id}_{yyyyMMddHHmmss} using payment date */}
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?data=${
                    "CineMax_Ticket_" +
                    payment.id +
                    "_" +
                    dayjs(payment.paymentDate).format("YYYYMMDDHHmmss")
                  }&size=150x150`}
                  alt="Barcode"
                  className="h-24"
                />
              </div>
              <p className="text-xs text-gray-500">
                CineMax_Ticket_{payment.id}_
                {dayjs(payment.paymentDate).format("YYYYMMDDHHmmss")}
              </p>
              <button
                className="inline-block mt-4 px-4 py-2 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white hover:cursor-pointer rounded transition"
                onClick={() => window.print()}
              >
                <DownloadOutlined /> Download Ticket
              </button>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="bg-red-600 text-white rounded-t-md px-4 py-2">
              <h3 className="text-lg font-semibold">
                <UserOutlined className="mr-2" /> Customer Information
              </h3>
            </div>
            <div className="mt-4 text-sm">
              <p>
                <strong>Name:</strong> {payment.name}
              </p>
              <p>
                <strong>Email:</strong> {payment.email}
              </p>
              <p>
                <strong>Phone:</strong> {payment.phoneNumber}
              </p>

              {payment.userId && payment.bonusPointsUsed >= 0 && (
                <div className="mt-2 pt-2 border-t border-dashed">
                  <p className="flex justify-between">
                    <span className="text-gray-600">Loyalty Points Used:</span>
                    <span className="font-medium">
                      {payment.bonusPointsUsed.toLocaleString()}
                    </span>
                  </p>
                  {paymentDetails.booking?.pointsEarned > 0 && (
                    <p className="flex justify-between text-green-600">
                      <span>Points Earned:</span>
                      <span className="font-medium">
                        +{paymentDetails.booking.pointsEarned.toLocaleString()}
                      </span>
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketDetail;
