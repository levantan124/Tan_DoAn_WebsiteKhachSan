/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useEffect } from 'react';
import { authAPI } from '../../configs391/API391';
import { useParams } from 'react-router-dom';
import { damp } from 'three/src/math/MathUtils.js';

const Feedback = () => {
  const { id } = useParams(); // Get the reservation ID from the URL
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [reservationIds, setReservationIds] = useState([]);


  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const response = await authAPI().get(`/rooms/${id}/reservations/`);
        const reservations = response.data;
        const ids = reservations.map(reservation => reservation.id);
        setRoomId(response.data);
        setReservationIds(ids);
        console.log(response.data)
      } catch (error) {
        console.error("Failed to fetch reservation:", error)
        setError("Failed to load reservation.");
      }
    };

    fetchReservation();
  }, [id]);

//   useEffect(() => {
//     if (id) {
//       const fetchFeedbacks = async () => {
//         try {
//           const response = await authAPI().get(`/reservations/${id}/feedbacks/`);
//           setFeedbacks(response.data);
//           console.log(response.data)
//         } catch (error) {
//           console.error("Failed to fetch feedbacks:", error);
//           setError("Failed to load feedbacks.");
//         } finally {
//           setLoading(false);
//         }
//       };

//       fetchFeedbacks();
//     }
//   }, [id]);
useEffect(() => {
    if (reservationIds.length > 0) {
      const fetchFeedbacks = async () => {
        try {
          // Create requests for each reservation ID
          const feedbackRequests = reservationIds.map(reservationId =>
            authAPI().get(`/reservations/${reservationId}/feedbacks/`)
          );
          const responses = await Promise.all(feedbackRequests);
          const feedbacksData = responses.flatMap(response => response.data);
          setFeedbacks(feedbacksData);
        } catch (error) {
          console.error("Failed to fetch feedbacks:", error);
          setError("Failed to load feedbacks.");
        } finally {
          setLoading(false);
        }
      };

      fetchFeedbacks();
    }
  }, [reservationIds]);

  if (loading) return <p>Loading feedbacks...</p>;
  if (error) return <p>{error}</p>;

  return (
    <section css={feedbackContainerStyle}>
      <h2>Feedbacks</h2>
      {feedbacks.length === 0 ? (
        <p>No feedbacks available for this room.</p>
      ) : (
        <ul css={feedbackListStyle}>
          {feedbacks.map(feedback => (
            <li key={feedback.id} css={feedbackItemStyle}>
              <p css={feedbackBodyStyle}>{feedback.comment}</p>
              <p css={feedbackAuthorStyle}>Rating: {feedback.rating} - {feedback.guest}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

const feedbackContainerStyle = css`
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const feedbackListStyle = css`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const feedbackItemStyle = css`
  padding: 1rem;
  margin-bottom: 1rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const feedbackBodyStyle = css`
  margin: 0.5rem 0;
  font-size: 1rem;
`;

const feedbackAuthorStyle = css`
  text-align: right;
  font-style: italic;
  font-size: 0.9rem;
`;

export default Feedback;
