import React, { useRef, useState, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";

function QrScanner({ onScan, onClose }) {
  const [showScanner, setShowScanner] = useState(true);
  const scannerRef = useRef(null);

  // QR code scan handler
  const handleScanSuccess = (decodedText) => {
    if (decodedText) {
      // Ngay khi quét thành công, dừng scanner và ẩn camera
      if (scannerRef.current) {
        try {
          scannerRef.current.stop().catch(() => {});
        } catch {}
      }
      setShowScanner(false);
      onScan(decodedText);
    }
  };

  // Start QR scanner
  const startScanner = () => {
    setShowScanner(true);
    setTimeout(() => {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode("qr-reader");
      }
      if (!scannerRef.current._isScanning) {
        scannerRef.current
          .start(
            { facingMode: "environment" },
            { fps: 10, qrbox: 250 },
            handleScanSuccess,
            () => {}
          )
          .catch(() => {
            setShowScanner(false);
          });
      }
    }, 20); // Giảm thời gian khởi tạo xuống 20ms để phản hồi nhanh hơn
  };

  // Stop QR scanner
  const stopScanner = () => {
    setShowScanner(false);
    if (scannerRef.current) {
      try {
        scannerRef.current.stop().catch(() => {});
      } catch {
        // Ignore error
      }
    }
    if (onClose) onClose();
  };

  useEffect(() => {
    startScanner();
    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.stop().catch(() => {});
        } catch {
          // Ignore error
        }
      }
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div className="mb-4">
      {showScanner ? (
        <>
          <div id="qr-reader" style={{ width: 300, margin: "0 auto" }} />
          <div className="text-center text-gray-500 text-sm mt-2">
            Place the QR code within the camera frame to scan the ticket
          </div>
          <button
            onClick={stopScanner}
            className="mt-2 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition w-full"
          >
            Close camera
          </button>
        </>
      ) : (
        <button
          onClick={startScanner}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition w-full"
        >
          Scan QR code
        </button>
      )}
    </div>
  );
}

export default QrScanner;
