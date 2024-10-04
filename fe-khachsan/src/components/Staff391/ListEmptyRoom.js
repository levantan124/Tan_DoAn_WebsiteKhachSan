/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { endpoints, authAPI } from '../../configs391/API391';
import { MdOutlineLocalGroceryStore } from "react-icons/md";

const CLOUDINARY_BASE_URL = 'https://res.cloudinary.com/vantan/';

const ListEmptyRoom = () => {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const response = await authAPI().get(endpoints.rt);
        setRoomTypes(response.data);
      } catch (error) {
        console.error("Failed to fetch room types:", error);
      }
    };

    const fetchRooms = async () => {
      try {
        const response = await authAPI().get(endpoints.r);
        const availableRooms = response.data.filter(room => room.status === 0);
        setRooms(availableRooms);
      } catch (error) {
        console.error("Failed to fetch rooms:", error);
      }
    };

    fetchRoomTypes();
    fetchRooms();
  }, []);

  const formatPrice = (price) => {
    // Chuyển đổi giá thành số nguyên
    const number = Math.round(price); 
    return number.toLocaleString('vi-VN') + ' VND'; // Định dạng theo kiểu Việt Nam
  };

  const roomTypeMap = roomTypes.reduce((map, roomType) => {
    map[roomType.id] = roomType;
    return map;
  }, {});

  const handleSaveRoom = (room) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const roomExists = cart.find(item => item.id === room.id);

    if (!roomExists) {
      cart.push(room);
      localStorage.setItem('cart', JSON.stringify(cart));
      alert('Phòng đã được thêm vào giỏ hàng!');
    } else {
      alert('Phòng đã có trong giỏ hàng.');
    }
  };

  return (
    <section css={sectionContainerStyle}>
      <h2 className="section-header reveal">DANH SÁCH PHÒNG TRỐNG</h2>
      <ul css={listStyle}>
        {rooms.map((room) => {
          const roomType = roomTypeMap[room.room_type] || {};
          const imageUrl = room.image ? `${CLOUDINARY_BASE_URL}${room.image}` : null;

          return (
            <li key={room.id} css={listItemStyle}>
              <div css={imageContainerStyle}>
                {imageUrl && (
                  <img src={imageUrl} alt={room.name} css={imageStyle} />
                )}
              </div>
              <div css={contentContainerStyle}>
                <div css={roomDetailsStyle}>
                  <h3 css={roomNameStyle}>{room.name}</h3>
                  <p css={roomTypeStyle}>{roomType.name || 'No details available'}</p>
                  <p css={roomPriceStyle}>{roomType.price ? formatPrice(roomType.price) : 'Price not available'}</p>
                </div>
                <div css={actionButtonsStyle}>
                  <Link to={`/room/${room.id}`} css={bookingButtonStyle}>
                    Đặt phòng
                  </Link>
                  <div css={iconStyle} onClick={() => handleSaveRoom(room)}>
                    <MdOutlineLocalGroceryStore />
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

// Styles
const sectionContainerStyle = css`
  text-align: center;
  margin-top: 5rem;
`;

const listStyle = css`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
  padding: 0;
`;

const listItemStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 300px;
  padding: 1.5rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
`;

const imageContainerStyle = css`
  width: 100%;
  height: 180px;
  margin-bottom: 1rem;
`;

const imageStyle = css`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
`;

const contentContainerStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;
`;

const roomDetailsStyle = css`
  flex: 1;
`;

const roomNameStyle = css`
  font-size: 1.2rem;
  font-weight: bold;
`;

const roomTypeStyle = css`
  font-size: 1rem;
  color: #555;
  margin-bottom: 0.5rem;
`;

const roomPriceStyle = css`
  font-size: 1rem;
  color: var(--text-dark);
`;

const actionButtonsStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`;

const bookingButtonStyle = css`
  padding: 0.6em 1.2em;
  border-radius: 20px;
  background-color: #ff7a00;
  color: #fff;
  text-transform: uppercase;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
`;

const iconStyle = css`
  font-size: 24px;
  color: black;
  cursor: pointer;
`;

export default ListEmptyRoom;
