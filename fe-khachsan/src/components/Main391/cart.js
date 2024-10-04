/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';
import { authAPI, endpoints } from '../../configs391/API391';

const CLOUDINARY_BASE_URL = 'https://res.cloudinary.com/vantan/';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
  }, []);

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

  const handleRemoveFromCart = (roomId) => {
    const confirmRemoval = window.confirm('Are you sure you want to remove this item from your cart?');
  
    if (confirmRemoval) {
      const updatedCart = cart.filter(room => room.id !== roomId);
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
  };

  const formatPrice = (price) => {
    const number = Math.round(price);
    return number.toLocaleString('vi-VN') + ' VND';
  };

  const getRoomDetails = (room) => {
    const roomType = roomTypes.find(rt => rt.id === room.room_type);
    return {
      name: roomType ? roomType.name : 'Not available',
      price: roomType ? formatPrice(roomType.price) : 'Price not available',
      quantity: roomType ? `Số lượng người: ${roomType.quantity}` : 'Not available',
      imageUrl: room.image ? `${CLOUDINARY_BASE_URL}${room.image}` : null,
    };
  };

  return (
    <section css={sectionContainerStyle}>
      <h2 className="section-header">Giỏ hàng của bạn</h2>
      {cart.length === 0 ? (
        <p>Giỏ hàng của bạn đang trống.</p>
      ) : (
        <ul css={listStyle}>
          {cart.map((room) => {
            const { name, price, quantity, imageUrl } = getRoomDetails(room);

            return (
              <li key={room.id} css={listItemStyle}>
                <div css={imageContainerStyle}>
                  {imageUrl && (
                    <img src={imageUrl} alt={room.name} css={imageStyle} />
                  )}
                </div>
                <div css={contentContainerStyle}>
                  <h3 css={roomNameStyle}>{room.name}</h3>
                  <p css={roomPriceStyle}>{price}</p>
                  <p css={roomTypeStyle}>{name}</p>
                  <p css={roomTypeStyle}>{quantity}</p>
                </div>
                <div css={actionButtonsStyle}>
                  <Link to={`/room/${room.id}`} css={bookingButtonStyle}>
                    Xem chi tiết
                  </Link>
                  <div css={iconStyle} onClick={() => handleRemoveFromCart(room.id)}>
                    <MdDelete />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
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
  color: red;
  cursor: pointer;
`;

export default Cart;
