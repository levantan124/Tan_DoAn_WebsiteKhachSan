/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useEffect } from 'react';
import { authAPI } from '../../configs391/API391';
import { Link } from 'react-router-dom';

const BookingHistory = () => {
  const [reservations, setReservations] = useState([]);

  // Fetch reservations
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await authAPI().get('/reservations/get-reservation-guest/');
        setReservations(response.data);
      } catch (error) {
        console.error("Failed to fetch reservations:", error);
      }
    };

    fetchReservations();
  }, []);

  return (
    <section css={sectionContainerStyle}>
      <h2>Lịch sử đặt phòng</h2>
      <table css={tableStyle}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Phòng</th>
            <th>Ngày đặt</th>
            <th>Ngày nhận</th>
            <th>Ngày trả</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation) => (
            <tr key={reservation.id}>
              <td>{reservation.id}</td>
              <td>{reservation.room.name}</td>
              <td>{new Date(reservation.book_date).toLocaleDateString()}</td>
              <td>{new Date(reservation.checkin).toLocaleDateString()}</td>
              <td>{new Date(reservation.checkout).toLocaleDateString()}</td>
              <td>{reservation.active ? 'Đang hoạt động' : 'Đã hủy'}</td>
              <td>
                <Link to={`/reservation-details/${reservation.id}`} css={detailsButtonStyle}>Chi tiết</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

const sectionContainerStyle = css`
  padding: 20px;
  margin: 20px auto;
  max-width: 1200px;
  background-color: #f9f9f9;
  border-radius: 0.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const tableStyle = css`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;

  th, td {
    border: 1px solid #ddd;
    padding: 0.75rem;
    text-align: center;
  }

  th {
    background-color: #f4f4f4;
  }
`;

const detailsButtonStyle = css`
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: #fff;
  border-radius: 0.25rem;
  text-decoration: none;
  font-size: 0.875rem;
  text-align: center;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

export default BookingHistory;
