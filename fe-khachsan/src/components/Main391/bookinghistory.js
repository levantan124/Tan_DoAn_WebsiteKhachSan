/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useEffect, useContext } from 'react';
import { authAPI } from '../../configs391/API391';
import { MyUserContext } from "../../configs391/Context391";
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import { FaStar } from 'react-icons/fa';

const BookingHistory = () => {
  const [reservations, setReservations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const user = useContext(MyUserContext);

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

  const openModal = (reservation) => {
    setSelectedReservation(reservation);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReservation(null);
    setRating(0);
    setFeedback('');
  };

  const handleRating = (rate) => {
    setRating(rate);
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    try {
      // Post feedback to server
      await authAPI().post(`/feedbacks/`, {
        reservation: selectedReservation.id,
        guest: user.id,
        rating: rating,
        comment: feedback,
      });
      // Close modal after submission
      closeModal();
    } catch (error) {
      console.error("Failed to submit feedback:", error);
    }
  };

  return (
    <>
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
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation.id}>
                <td>{reservation.id}</td>
                <td>{reservation.room}</td>
                <td>{new Date(reservation.book_date).toLocaleDateString()}</td>
                <td>{new Date(reservation.checkin).toLocaleDateString()}</td>
                <td>{new Date(reservation.checkout).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => openModal(reservation)} css={detailsButtonStyle}>
                    Đánh giá
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Modal for Feedback */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={modalStyles}
        contentLabel="Feedback Modal"
      >
        <h2>Đánh giá đặt phòng</h2>
        <form onSubmit={handleSubmitFeedback}>
          <div css={ratingContainerStyle}>
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                size={24}
                color={star <= rating ? '#ffa500' : '#e4e5e9'}
                onClick={() => handleRating(star)}
                css={starStyle}
              />
            ))}
          </div>
          <div css={feedbackContainerStyle}>
            <textarea
              css={textareaStyle}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Nhập feedback của bạn"
              required
            />
          </div>
          <button type="submit" css={submitButtonStyle}>Gửi</button>
          <button type="button" onClick={closeModal} css={cancelButtonStyle}>Hủy</button>
        </form>
      </Modal>
    </>
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
  background-color: #ff6347;
  color: #fff;
  border-radius: 20px;
  text-decoration: none;
  font-size: 0.875rem;
  text-align: center;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    padding: '30px',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '500px',
    backgroundColor: '#fff',
    boxShadow: '0 10px 25px rgba(169 0 0 / 50%)',
    alignItems: 'center',
  },
};

const ratingContainerStyle = css`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const starStyle = css`
  cursor: pointer;
  margin: 0 8px;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.2);
  }
`;

const feedbackContainerStyle = css`
   width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const textareaStyle = css`
  width: 100%;
  height: 120px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  resize: none;
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.05);
`;

const submitButtonStyle = css`
  background-color: #28a745;
  color: #fff;
  border: none;
  padding: 12px 20px;
  border-radius: 10px;
  font-size: 15px;
  cursor: pointer;
  margin-right: 15px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #218838;
  }
`;

const cancelButtonStyle = css`
  background-color: #dc3545;
  color: #fff;
  border: none;
  padding: 12px 20px;
  border-radius: 10px;
  font-size: 15px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #c82333;
  }
`;


export default BookingHistory;
