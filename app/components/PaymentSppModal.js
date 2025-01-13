import React, { useEffect } from "react";

export default function PaymentSppModal({ isOpen, onClose, studentData }) {
  useEffect(() => {
    // Load Snap script dynamically
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js"; // Sandbox environment
    script.setAttribute("data-client-key", "SB-Mid-client-ayobOM2NMVsUNeLf"); // Replace with your Client Key
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Handle Snap Payment
  const handleSnapPayment = () => {
    fetch("https://your-backend-url.com/create-transaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + btoa("SB-Mid-server-IezZ7oR06DQeUDl3of6H8aHn"), // Server Key (Base64 encoded)
      },
      body: JSON.stringify({
        transaction_details: {
          order_id: `ORDER-${Date.now()}`, // Unique order ID
          gross_amount: parseInt(studentData.jumlah.replace(/\D/g, "")), // Convert formatted string to number
        },
        customer_details: {
          first_name: "Student", // Replace with real name if available
          email: "student@example.com", // Replace with real email if available
        },
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.token) {
          // Call Snap popup with transaction token
          window.snap.pay(data.token, {
            onSuccess: function (result) {
              alert("Pembayaran berhasil!");
              console.log("Success:", result);
              onClose();
            },
            onPending: function (result) {
              alert("Pembayaran tertunda.");
              console.log("Pending:", result);
            },
            onError: function (result) {
              alert("Pembayaran gagal.");
              console.log("Error:", result);
            },
            onClose: function () {
              alert("Popup ditutup tanpa pembayaran.");
            },
          });
        } else {
          alert("Gagal mendapatkan token transaksi.");
        }
      })
      .catch((err) => {
        console.error("Error:", err);
        alert("Terjadi kesalahan saat memproses pembayaran.");
      });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md transform transition-transform scale-105">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Pembayaran SPP</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition duration-200"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className="text-gray-700">
            <strong className="block mb-1">NIS:</strong>
            {studentData?.nis || "-"}
          </p>
          <p className="text-gray-700">
            <strong className="block mb-1">Kelas:</strong>
            {studentData?.kelas || "-"}
          </p>
          <p className="text-gray-700">
            <strong className="block mb-1">Jumlah:</strong>
            Rp{studentData?.jumlah || "-"}
          </p>
          <p className="text-gray-700">
            <strong className="block mb-1">Bulan:</strong>
            {studentData?.month || "-"}
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition duration-200"
          >
            Batal
          </button>
          <button
            onClick={handleSnapPayment}
            className="px-5 py-2 rounded-lg bg-[var(--main-color)] text-white font-medium"
          >
            Bayar
          </button>
        </div>
      </div>
    </div>
  );
}
