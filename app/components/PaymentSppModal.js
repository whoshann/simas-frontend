import React, { useEffect } from "react";

export default function PaymentSppModal({ isOpen, onClose, studentData }) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", "SB-Mid-client-ayobOM2NMVsUNeLf");
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSnapPayment = async () => {
    try {
      console.log('Sending payment request with data:', {
        orderId: `ORDER-${Date.now()}`,
        grossAmount: parseInt(String(studentData.amount).replace(/\D/g, "")),
        customerDetails: {
          name: studentData?.studentName || "Student",
          school_class: studentData?.className || "Unknown Class",
          studentId: studentData?.studentId || null,
        },
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/school-payment/create-transaction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: `ORDER-${Date.now()}`,
          grossAmount: parseInt(String(studentData.amount).replace(/\D/g, "")),
          customerDetails: {
            name: studentData?.studentName || "Student",
            school_class: studentData?.className || "Unknown Class",
          },
          studentId: studentData?.studentId || null,
        }),
      });

      const data = await response.json();
      console.log('Response from backend:', data);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (data && data.data && data.data.token) {
        console.log('Token received:', data.token);
        if (window.snap) {
          window.snap.pay(data.data.token, {
            onSuccess: function (result) {
              console.log("Success:", result);
              alert("Pembayaran berhasil!");
              onClose();
            },
            onPending: function (result) {
              console.log("Pending:", result);
              alert("Pembayaran tertunda.");
            },
            onError: function (result) {
              console.error("Payment Error:", result);
              alert("Pembayaran gagal.");
            },
            onClose: function () {
              alert("Popup ditutup tanpa pembayaran.");
            },
          });
        } else {
          console.error('Snap is not initialized!');
          alert("Terjadi kesalahan: Snap belum siap");
        }
      } else {
        console.error('No token in response:', data);
        throw new Error('Token tidak ditemukan dalam response');
      }
    } catch (err) {
      console.error("Payment Error:", err);
      alert(err.message || "Terjadi kesalahan saat memproses pembayaran.");
    }
  };

  // Rest of the component remains the same...
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
            <strong className="block mb-1">Nama:</strong>
            {studentData?.studentName || "-"}
          </p>
          <p className="text-gray-700">
            <strong className="block mb-1">Kelas:</strong>
            {studentData?.className || "-"}
          </p>
          <p className="text-gray-700">
            <strong className="block mb-1">Jumlah:</strong>
            {studentData?.amount
              ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(studentData.amount)
              : "-"}
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
