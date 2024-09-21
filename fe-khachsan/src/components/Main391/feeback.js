/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { authAPI } from '../../configs391/API391';
import { useParams } from 'react-router-dom';

const Feedback391 = ({ onAverageRatingChange }) => {
  const { id } = useParams(); // Get the room ID from the URL
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reservationIds, setReservationIds] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const response = await authAPI().get(`/rooms/${id}/reservations/`);
        const reservations = response.data;
        const ids = reservations.map(reservation => reservation.id);
        setReservationIds(ids);
      } catch (error) {
        console.error("Failed to fetch reservation:", error);
        setError("Failed to load reservation.");
      }
    };

    fetchReservation();
  }, [id]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      if (reservationIds.length === 0) return;

      try {
        const feedbackRequests = reservationIds.map(reservationId =>
          authAPI().get(`/reservations/${reservationId}/feedbacks/`)
        );
        const responses = await Promise.all(feedbackRequests);
        const feedbacksData = responses.flatMap(response => response.data);

        const feedbacksWithCustomerInfo = await Promise.all(
          feedbacksData.map(async feedback => {
            const customerResponse = await authAPI().get(`/feedbacks/${feedback.id}/customer_info/`);
            const rating = feedback.rating !== undefined ? feedback.rating : 5;
            return { ...feedback, guestName: customerResponse.data.name, avatar: customerResponse.data.avatar };
          })
        );

        feedbacksWithCustomerInfo.sort((a, b) => b.rating - a.rating);
        setFeedbacks(feedbacksWithCustomerInfo);

        // Calculate and set average rating
        const averageRating = feedbacksWithCustomerInfo.length > 0
          ? feedbacksWithCustomerInfo.reduce((acc, feedback) => acc + feedback.rating, 0) / feedbacksWithCustomerInfo.length
          : 5;
        onAverageRatingChange(averageRating);

      } catch (error) {
        console.error("Failed to fetch feedbacks:", error);
        setError("Failed to load feedbacks.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [reservationIds, onAverageRatingChange]);

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <div css={starContainerStyle}>
        {[...Array(fullStars)].map((_, index) => (
          <span key={`full-${index}`} css={starStyle}>★</span>
        ))}
        {halfStar && <span css={starStyle}>☆</span>}
        {[...Array(emptyStars)].map((_, index) => (
          <span key={`empty-${index}`} css={emptyStarStyle}>☆</span>
        ))}
      </div>
    );
  };

  if (loading) return <p>Loading feedbacks...</p>;
  if (error) return <p>{error}</p>;

  const displayedFeedbacks = showAll ? feedbacks : feedbacks.slice(0, 2);

  return (
    <section css={feedbackSectionStyle}>
      <div css={feedbackCardStyle}>
        <h2 css={headerStyle}>Đánh giá</h2>
        {feedbacks.length === 0 ? (
          <p css={noFeedbackStyle}>No feedbacks available for this room.</p>
        ) : (
          <>
            <ul css={feedbackListStyle}>
              {displayedFeedbacks.map(feedback => (
                <li key={feedback.id} css={feedbackItemStyle}>
                  <div css={feedbackHeaderStyle}>
                    <img
                      src={feedback.avatar || 'https://res.cloudinary.com/vantan/image/upload/v1725874989/avt_avej6j.jpg'}
                      alt={feedback.guestName}
                      css={avatarStyle}
                    />
                    <p css={feedbackAuthorStyle}>{feedback.guestName}</p>
                  </div>
                  <p css={feedbackBodyStyle}>{feedback.comment}</p>
                  {renderStars(feedback.rating)}
                </li>
              ))}
            </ul>
            {feedbacks.length > 2 && (
              <button onClick={() => setShowAll(!showAll)} css={toggleButtonStyle}>
                {showAll ? 'Ẩn bớt' : 'Xem thêm'}
              </button>
            )}
          </>
        )}
      </div>
    </section>
  );
};

const feedbackSectionStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  border-radius: 8px;
  max-width: 1000px;
  margin: 2rem auto;
`;

const feedbackCardStyle = css`
  width: 100%;
  background-color: #ffffff;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

const headerStyle = css`
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: #007bff;
  text-align: center;
`;

const noFeedbackStyle = css`
  text-align: center;
  color: #333;
`;

const feedbackListStyle = css`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const feedbackItemStyle = css`
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  background: #f8f9fa;
  border-radius: 6px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
`;

const feedbackHeaderStyle = css`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const feedbackBodyStyle = css`
  margin: 0.5rem 0;
  font-size: 0.875rem;
  color: #333;
`;

const feedbackAuthorStyle = css`
  margin-left: 0.5rem;
  font-size: 0.875rem;
  font-weight: bold;
  color: #333;
`;

const avatarStyle = css`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
`;

const starContainerStyle = css`
  display: flex;
  justify-content: center;
  margin: 0.5rem 0;
`;

const starStyle = css`
  color: #fbbf24;
  font-size: 1rem;
  margin-right: 0.1rem;
`;

const emptyStarStyle = css`
  color: #e5e7eb;
  font-size: 1rem;
  margin-right: 0.1rem;
`;

const toggleButtonStyle = css`
  display: block;
  margin: 1rem auto;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 20px;
  background-color: #007bff;
  color: #fff;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 0.3s ease;
  &:hover {
    background-color: #0056b3;
  }
`;

export default Feedback391;
