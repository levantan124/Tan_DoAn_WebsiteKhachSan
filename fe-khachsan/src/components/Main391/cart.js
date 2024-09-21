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

  const getRoomPrice = (room) => {
    const roomType = roomTypes.find(rt => rt.id === room.room_type);
    return roomType ? `${roomType.price} VND` : 'Price not available';
  };

  const getNameRoomType = (room) => {
    const roomType = roomTypes.find(rt => rt.id === room.room_type);
    return roomType ? `${roomType.name}` : 'Not available';
  };

  const getQuantity = (room) => {
    const roomType = roomTypes.find(rt => rt.id === room.room_type);
    return roomType ? `Số lượng người: ${roomType.quantity}` : 'Not available';
  };

  return (
    <section css={sectionContainerStyle}>
      <h2 className="section-header">Giỏ hàng của bạn</h2>
      {cart.length === 0 ? (
        <p>Giỏ hàng của bạn đang trống.</p>
      ) : (
        <div css={gridStyle}>
          {cart.map((room) => {
            const imageUrl = room.image 
              ? `${CLOUDINARY_BASE_URL}${room.image}` 
              : null;

            return (
              <div key={room.id} css={slideCardStyle}>
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt={room.name}
                    css={imageStyle}
                  />
                )}
                <div css={contentStyle}>
                  <div css={headerStyle}>
                    <h4>{room.name}</h4>
                    <h4>{getRoomPrice(room)}</h4>
                  </div>
                  <div css={headerStyle}>
                    <h4>{getNameRoomType(room)}</h4>
                  </div>
                  <div css={headerStyle}>
                    <h4>{getQuantity(room)}</h4>
                  </div>
                  <div css={iconStyle} onClick={() => handleRemoveFromCart(room.id)}>
                    <MdDelete />
                  </div>
                  <Link to={`/room/${room.id}`} css={bookingButtonStyle(true)}>
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

const sectionContainerStyle = css`
  text-align: center;
  margin-top: 4rem;
`;

const slideCardStyle = css`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 0.8rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  max-width: 280px;
  margin: 0 10px;
  position: relative;

  &:hover {
    transform: scale(1.03);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
  }
`;

const imageStyle = css`
  width: 100%;
  height: 180px;
  object-fit: cover;
`;

const contentStyle = css`
  padding: 0.8rem;
  text-align: left;
`;

const headerStyle = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;

  h4 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-dark);
  }
`;

const iconStyle = css`
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  color: red;
  cursor: pointer;
  border-radius: 50%;
  padding: 10px;
`;

const bookingButtonStyle = (isAvailable) => css`
  display: inline-block;
  padding: 0.4em 0.8em;
  border-radius: 0.3em;
  border: none;
  background: ${isAvailable ? 'linear-gradient(160deg, #a54e07, #b47e11, #fef1a2, #bc881b, #a54e07)' : '#e74c3c'};
  color: ${isAvailable ? 'rgb(120, 50, 5)' : '#fff'};
  text-transform: uppercase;
  font-weight: 600;
  cursor: ${isAvailable ? 'pointer' : 'not-allowed'};
  transition: background-size 0.2s ease-in-out, box-shadow 0.2s ease-in-out, transform 0.2s ease-in-out;

  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  &:hover {
    background-size: 150% 150%;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    color: ${isAvailable ? 'rgba(120, 50, 5, 0.8)' : '#fff'};
    transform: ${isAvailable ? 'translateY(-2px)' : 'none'};
  }

  &:disabled {
    background: #d3d3d3;
    color: #a0a0a0;
    cursor: not-allowed;
  }
`;

const gridStyle = css`
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* Adjust to have exactly 3 sections */
  gap: 1.5rem;
  justify-items: center;
`;  


export default Cart;
