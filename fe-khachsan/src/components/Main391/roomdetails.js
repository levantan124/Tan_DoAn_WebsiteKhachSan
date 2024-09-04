/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Slider from 'react-slick';
import { authAPI, endpoints } from '../../configs391/API391';
import cookie from "react-cookies";

const CLOUDINARY_BASE_URL = 'https://res.cloudinary.com/vantan/';
const DEFAULT_IMAGE_URL = `${CLOUDINARY_BASE_URL}image/upload/v1723024658/rye5zrow3vckdxfp7f0k.jpg`;

const RoomDetails = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [roomTypes, setRoomTypes] = useState([]);
  const [roomImages, setRoomImages] = useState(null);
  const [checkInDate, setCheckInDate] = useState('');
  const [numberOfNights, setNumberOfNights] = useState(1);
  const [checkOutDate, setCheckOutDate] = useState('');

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await authAPI().get(`${endpoints.r}${id}/`);
        setRoom(response.data);
      } catch (error) {
        console.error("Failed to fetch room details:", error);
      }
    };

    const fetchRoomImages = async () => {
      try {
        const response = await authAPI().get(`/room-images/${id}/`);
        setRoomImages(response.data);
      } catch (error) {
        console.error("Failed to fetch room images:", error);
      }
    };

    fetchRoomDetails();
    fetchRoomImages();
  }, [id]);

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const response = await authAPI().get(endpoints.rt);
        setRoomTypes(response.data);
      } catch (error) {
        console.error("Failed to fetch room types:", error);
      }
    };

    fetchRoomTypes();
  }, []);

  useEffect(() => {
    if (checkInDate && numberOfNights > 0) {
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkIn.setDate(checkIn.getDate() + numberOfNights));
      setCheckOutDate(checkOut.toISOString().split('T')[0]);
    }
  }, [checkInDate, numberOfNights]);

  if (!room || !roomTypes.length) return <p>Loading...</p>;

  const roomType = roomTypes.find(rt => rt.id === room.room_type);
  const price = roomType ? roomType.price : 'N/A';

  const imageUrls = roomImages
    ? [roomImages.image1, roomImages.image2, roomImages.image3, roomImages.image4].map(img => `${CLOUDINARY_BASE_URL}${img}`)
    : [DEFAULT_IMAGE_URL, DEFAULT_IMAGE_URL,DEFAULT_IMAGE_URL,DEFAULT_IMAGE_URL]; 

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToScroll: 1,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />
  };

  const handleBookRoom = async () => {
    try {
      const token = cookie.load('token');
      const response = await authAPI().post('/reservations/', {
        room: room.id,
        book_date: new Date().toISOString().split('T')[0],
        checkin: checkInDate,
        checkout: checkOutDate,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          "Content-Type": `Application/json`
        }
      });
      alert("Đặt phòng thành công!");
      console.log("Reservation response:", response.data);
    } catch (error) {
      console.error("Failed to book room:", error);
      alert("Đặt phòng thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <section css={containerStyle}>
      <h2>Thông tin phòng</h2>
      <div css={detailsStyle}>
        <div css={sliderWrapperStyle}>
          <Slider {...sliderSettings}>
            {imageUrls.map((url, index) => (
              <div key={index} css={slideStyle}>
                <img src={url} alt={`Room Image ${index + 1}`} css={imageStyle} />
              </div>
            ))}
          </Slider>
        </div>
        <div css={infoStyle}>
          <h3>{room.name}</h3>
          <p css={descriptionStyle}>{room.description}</p>
          <p css={priceStyle}>Giá: {price} VND</p>
          <div css={inputGroupStyle}>
            <label>
              Ngày nhận phòng:
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                css={inputStyle}
              />
            </label>
            <label>
              Số ngày ở:
              <input
                type="number"
                value={numberOfNights}
                min="1"
                onChange={(e) => setNumberOfNights(e.target.value)}
                css={inputStyle}
              />
            </label>
            <label>
              Ngày trả phòng:
              <input
                type="date"
                value={checkOutDate}
                readOnly
                css={inputStyle}
              />
            </label>
          </div>
          <button onClick={handleBookRoom} css={bookButtonStyle}>Đặt phòng</button>
        </div>
      </div>
    </section>
  );
};

const CustomPrevArrow = (props) => (
  <button {...props} css={[arrowStyle, css`left: 10px;`]}>
    &#9664;
  </button>
);

const CustomNextArrow = (props) => (
  <button {...props} css={[arrowStyle, css`right: 10px;`]}>
    &#9654;
  </button>
);

const containerStyle = css`
  padding: 3rem 2rem;
  text-align: center;
  background-color: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const detailsStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  max-width: 1200px;
  margin: auto;
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const sliderWrapperStyle = css`
  position: relative;
  flex: 1;
  width: 100%;
  max-width: 600px;
  border-radius: 10px;
  overflow: hidden;
  max-height: 400px;
`;

const slideStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
`;

const imageStyle = css`
  width: 100%;
  height: auto;
  object-fit: cover;
  max-height: 400px;
`;

const infoStyle = css`
  flex: 2;
  text-align: left;
  padding: 1rem;
`;

const descriptionStyle = css`
  margin: 1rem 0;
  font-size: 1rem;
  line-height: 1.6;
`;

const priceStyle = css`
  font-size: 1.2rem;
  font-weight: bold;
  color: #007bff;
  margin-bottom: 1rem;
`;

const inputGroupStyle = css`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const inputStyle = css`
  display: block;
  width: 100%;
  padding: 0.75rem;
  border-radius: 5px;
  border: 1px solid #ddd;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
  font-size: 1rem;
  transition: border-color 0.2s ease;
  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const bookButtonStyle = css`
  padding: 12px 24px;
  border-radius: 5px;
  border: none;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  background: #007bff;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.3s ease;
  &:hover {
    background: #0056b3;
    transform: scale(1.05);
  }
  &:active {
    transform: scale(1);
  }
`;

const arrowStyle = css`
  color: white;
  border: none;
  border-radius: 50%;
  padding: 10px;
  font-size: 18px;
  cursor: pointer;
  transition: background 0.3s ease;
  &:hover {
    background: #0056b3;
  }
`;

export default RoomDetails;
