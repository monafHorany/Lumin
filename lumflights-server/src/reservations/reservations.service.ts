import { Injectable } from '@nestjs/common';

@Injectable()
export class ReservationsService {
  private reservations = Array.from({ length: 1000 }, (_, i) => ({
    id: i + 1,
    flightNumber: `FL-${Math.floor(1000 + Math.random() * 9000)}`,
    customer: `Müşteri ${i + 1}`,
    date: new Date().toISOString(),
  }));

  private aiComments = [
    'Bu rezervasyon için erken check-in önerilir.',
    'Hava durumu kontrol edilmelidir.',
    'Yoğun bir uçuş olabilir, biniş süresi uzun sürebilir.',
    'Özel yemek talebi olan bir müşteriniz var.',
    'Kolay erişimli bir koltuk öneriyoruz.',
  ];

  getReservations(role: string) {
    if (role === 'admin') {
      return this.reservations;
    } else if (role === 'staff') {
      return this.reservations.map(({ id, flightNumber, date }) => ({
        id,
        flightNumber,
        date,
      }));
    }
    return [];
  }

  getReservationById(id: number) {
    const reservation = this.reservations.find((res) => res.id === id);
    if (!reservation) return null;

    const aiRecommendation =
      this.aiComments[Math.floor(Math.random() * this.aiComments.length)];
    return { ...reservation, aiRecommendation };
  }
}
