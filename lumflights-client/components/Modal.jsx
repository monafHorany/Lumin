import React from "react";

export default function Modal({ isOpen, onClose, customers }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-1/3">
        <h2 className="text-2xl font-bold mb-4">Müşteri Detayları</h2>
        <ul className="space-y-2">
          {customers.map((customer, index) => (
            <li key={index} className="border-b pb-2">
              <p><strong>Adı Soyadı:</strong> {customer.name}</p>
              <p><strong>Email:</strong> {customer.email}</p>
              <p><strong>Yaş:</strong> {customer.age}</p>
            </li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
        >
          Kapat
        </button>
      </div>
    </div>
  );
}
