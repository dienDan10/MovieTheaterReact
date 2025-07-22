import { useRef, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";

function QrScanner({ onScan, onClose }) {
  const scannerRef = useRef(null);

  // Initialize scanner when component mounts
  useEffect(() => {
    // Define the success handler inside useEffect to avoid dependency issues
    const handleScanSuccess = (decodedText) => {
      if (decodedText) {
        onScan(decodedText);
        onClose();
      }
    };

    // Create and initialize scanner
    const scanner = new Html5Qrcode("qr-reader");

    // Start scanner
    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        handleScanSuccess,
        () => {}
      )
      .then(() => {
        scannerRef.current = scanner;
      })
      .catch((err) => {
        console.error("Error starting scanner:", err);
        if (onClose) onClose();
      });

    // Cleanup on unmount
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch((err) => {
          console.error("Error stopping scanner:", err);
        });
      }
    };
  }, [onScan, onClose]);

  return (
    <div className="mb-4">
      <div id="qr-reader" style={{ width: 300, margin: "0 auto" }} />
      <div className="text-center text-gray-500 text-sm mt-2">
        Place the QR code within the camera frame to scan the ticket
      </div>
      <button
        onClick={onClose}
        className="mt-2 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition w-full"
      >
        Close camera
      </button>
    </div>
  );
}

export default QrScanner;
