/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react';
import { css } from '@emotion/react';
import { authAPI } from '../../configs391/API391';
import { FaEdit } from 'react-icons/fa';

const ReservationList391 = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await authAPI().get('/reservations/');
        setReservations(response.data);
      } catch (error) {
        setError('Error fetching reservations');
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const handleCheckInStatus = async (id, currentStatus) => {
    try {
      await authAPI().patch(`/reservations/${id}/`, { status_checkin: !currentStatus });
      setReservations(reservations.map(reservation =>
        reservation.id === id ? { ...reservation, status_checkin: !currentStatus } : reservation
      ));
    } catch (error) {
      setError('Error updating check-in status');
    }
  };

  if (loading) return <div css={loadingStyle}>Loading...</div>;
  if (error) return <div css={errorStyle}>{error}</div>;

  return (
    <div css={containerStyle}>
      <h1 css={titleStyle}>Danh sách phiếu đặt phòng</h1>
      <div css={tableWrapperStyle}>
        <table css={tableStyle}>
          <thead>
            <tr>
              <th css={thStyle}>ID</th>
              <th css={thStyle}>Ngày đặt</th>
              <th css={thStyle}>Ngày nhận phòng</th>
              <th css={thStyle}>Ngày trả phòng</th>
              <th css={thStyle}>Phòng</th>
              <th css={thStyle}>Trạng thái nhận phòng</th>
              <th css={thStyle}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation.id} css={rowStyle}>
                <td css={tdStyle}>{reservation.id}</td>
                <td css={tdStyle}>{new Date(reservation.book_date).toLocaleDateString()}</td>
                <td css={tdStyle}>{new Date(reservation.checkin).toLocaleDateString()}</td>
                <td css={tdStyle}>{new Date(reservation.checkout).toLocaleDateString()}</td>
                <td css={tdStyle}>{reservation.room.join(', ')}</td>
                <td css={tdStyle}>
                  <input
                    type="checkbox"
                    checked={reservation.status_checkin}
                    onChange={() => handleCheckInStatus(reservation.id, reservation.status_checkin)}
                    css={checkboxStyle}
                  />
                </td>
                <td css={tdStyle}>
                  <button css={iconButtonStyle} onClick={() => alert('Chỉnh sửa thông tin')}>
                    <FaEdit css={iconStyle} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const containerStyle = css`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  background: #f0f4f8;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-top: 10rem;
`;

const titleStyle = css`
  font-size: 24px;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
`;

const tableWrapperStyle = css`
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const tableStyle = css`
  width: 100%;
  border-collapse: collapse;
`;

const thStyle = css`
  background-color: #2d7dd2;
  color: #ffffff;
  padding: 15px;
  text-align: left;
  border-bottom: 2px solid #1b4f72;
`;

const tdStyle = css`
  padding: 15px;
  border-bottom: 1px solid #e0e0e0;
  text-align: center;
  color: #555;
`;

const rowStyle = css`
  &:hover {
    background-color: #f9f9f9;
    transition: background-color 0.3s ease;
  }
`;

const iconButtonStyle = css`
  background: none;
  border: none;
  cursor: pointer;
  color: #2d7dd2;
  transition: color 0.3s;

  &:hover {
    color: #1b4f72;
  }
`;

const iconStyle = css`
  font-size: 20px;
`;

const checkboxStyle = css`
  cursor: pointer;
  transform: scale(1.2);
`;

const loadingStyle = css`
  text-align: center;
  margin-top: 20px;
  font-size: 20px;
  color: #2d7dd2;
`;

const errorStyle = css`
  color: red;
  text-align: center;
  margin-top: 20px;
  font-size: 20px;
`;

export default ReservationList391;
