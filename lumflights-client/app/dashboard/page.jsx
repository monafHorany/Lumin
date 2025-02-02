"use client";
import { DataTable } from "@/components/DataTable";
import Modal from "@/components/Modal";
import { API_URL } from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role");

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastDocId, setLastDocId] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (!role) {
      router.push("/login");
      return;
    }
    fetchReservations();
    const interval = setInterval(() => {
      fetchReservations(true);
    }, 10000);
    return () => clearInterval(interval);
  }, [role]);
  const fetchReservations = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/reservations/paginate?pageSize=5${
          lastDocId ? `&lastDocId=${lastDocId}` : ""
        }`
      );
      const data = await res.json();

      if (!data || !data.data) {
        console.error("Invalid API response:", data);
        setHasMore(false);
        return;
      }

      if (data.data.length === 0) {
        setHasMore(false);
      } else {
        setReservations((prevReservations) => {
          const updatedReservations = prevReservations.map((prevRes) => {
            const newRes = data.data.find((newRes) => newRes.id === prevRes.id);
            if (newRes) {
              return { ...prevRes, ...newRes };
            }
            return prevRes;
          });
          const newReservations = data.data.filter(
            (newRes) =>
              !prevReservations.some((prevRes) => prevRes.id === newRes.id)
          );

          return [...updatedReservations, ...newReservations];
        });

        setLastDocId(data.lastDocId || null);
      }
    } catch (err) {
      console.error("Error fetching reservations:", err);
      setHasMore(false);
    }
    setLoading(false);
  };

  const columns = [
    {
      accessorKey: "id",
      header: "Rezervasyon ID",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "flight_number",
      header: "Uçuş No",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "created_at",
      header: "Tarih",
      cell: (info) => {
        const dateValue = info.getValue();
        return dateValue ? new Date(dateValue).toLocaleString() : "N/A"; // ✅ Ensure Date Format
      },
    },
    role === "admin" && {
      accessorKey: "customers",
      header: "Müşteriler",
      cell: (info) => info.getValue()?.length || 0,
    },
  ].filter(Boolean);
  const handleRowClick = (reservation) => {
    if (role === "admin") {
      setSelectedReservation(reservation);
      setModalOpen(true);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedReservation(null);
  };

  if (!hydrated) return null;
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Dashboard ({role})</h1>

      {loading ? (
        <p>Yükleniyor...</p>
      ) : (
        <DataTable
          columns={columns}
          data={reservations}
          fetchNextPage={fetchReservations}
          hasMore={hasMore}
          onRowClick={handleRowClick}
        />
      )}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        customers={selectedReservation ? selectedReservation.customers : []}
      />
    </div>
  );
}
