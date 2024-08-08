/** @jsxImportSource @emotion/react */
import { css, keyframes } from '@emotion/react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { endpoints, authAPI } from '../../configs391/API391';

const Popular = () => {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const cloudinaryBaseUrl = 'https://res.cloudinary.com/vantan';

  // Fetch room types
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

  // Fetch rooms
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await authAPI().get(endpoints.r);
        setRooms(response.data);
      } catch (error) {
        console.error("Failed to fetch rooms:", error);
      }
    };

    fetchRooms();
  }, []);

  // Create a mapping of room types by ID
  const roomTypeMap = roomTypes.reduce((map, roomType) => {
    map[roomType.id] = roomType;
    return map;
  }, {});

  // Slice the rooms to show a limited number
  const displayedRooms = showAll ? rooms : rooms.slice(0, 6);

  return (
    <section css={sectionContainerStyle}>
      <h2 className="section-header reveal">Danh sách phòng</h2>
      <div css={popularGridStyle}>
        {displayedRooms.map((room) => {
          const roomType = roomTypeMap[room.room_type] || {};
          const imageUrl = room.image 
            ? `${cloudinaryBaseUrl}/${room.image}` 
            : null; // Không có hình ảnh mặc định
          return (
            <div key={room.id} className="popular-card reveal">
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt={room.name}
                  css={imageStyle}
                />
              )}
              <div className="popular-content">
                <div className="popular-card-header">
                  <h4>{room.name}</h4>
                  <h4>{roomType.price ? `${roomType.price} VND` : 'Price not available'}</h4>
                </div>
                <p>{roomType.name || 'No details available'}</p>
                <div css={quantityAndButtonStyle}>
                  <p>Số lượng người: {roomType.quantity || 'N/A'}</p>
                  <Link to={`/room/${room.id}`} css={bookingButtonStyle}>Đặt phòng</Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div css={buttonContainerStyle}>
        <button css={moreButtonStyle} onClick={() => setShowAll(!showAll)}>
          {showAll ? 'Ẩn bớt' : 'Xem thêm'}
        </button>
      </div>
    </section>
  );
};

const sectionContainerStyle = css`
  text-align: center; /* Căn giữa văn bản trong phần tử chứa */
  padding-left: 10rem;
  padding-right: 10rem;
  padding-bottom: 10rem;
  margin-top: 10rem;
`;

const popularGridStyle = css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;

  .popular-card {
    overflow: hidden;
    border-radius: 1rem;
    box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(0, 0, 0, 0.1);
    transition: 0.5s;
    &:hover {
      box-shadow: none;
    }
    .popular-content {
      padding: 1rem;
      text-align: left; /* Căn trái nội dung */
      .popular-card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        margin-bottom: 0.5rem;
        h4 {
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--text-dark);
        }
      }
    }
  }
`;

const quantityAndButtonStyle = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const hoverAnimation = keyframes`
  0% {
    transform: scale(0.7, 1.3);
  }
  25% {
    transform: scale(1.1, 0.9);
  }
  50% {
    transform: scale(0.9, 1.1);
  }
  75% {
    transform: scale(1.1, 0.9);
  }
  100% {
    transform: scale(1, 1);
  }
`;

const bookingButtonStyle = css`
  touch-action: manipulation;
  display: inline-block;
  outline: none;
  font-family: inherit;
  font-size: 1em;
  box-sizing: border-box;
  border: none;
  border-radius: 0.3em;
  height: 2.4em;
  line-height: 2.5em;
  text-transform: uppercase;
  padding: 0 1em;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(110, 80, 20, 0.4),
    inset 0 -2px 5px 1px rgba(139, 66, 8, 1),
    inset 0 -1px 1px 3px rgba(250, 227, 133, 1);
  background-image: linear-gradient(
    160deg,
    #a54e07,
    #b47e11,
    #fef1a2,
    #bc881b,
    #a54e07
  );
  border: 1px solid #a55d07;
  color: rgb(120, 50, 5);
  text-shadow: 0 2px 2px rgba(250, 227, 133, 1);
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  background-size: 100% 100%;
  background-position: center;

  &:hover {
    background-size: 150% 150%;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23),
      inset 0 -2px 5px 1px #b17d10, inset 0 -1px 1px 3px rgba(250, 227, 133, 1);
    border: 1px solid rgba(165, 93, 7, 0.6);
    color: rgba(120, 50, 5, 0.8);
  }

  &:active {
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(110, 80, 20, 0.4),
      inset 0 -2px 5px 1px #b17d10, inset 0 -1px 1px 3px rgba(250, 227, 133, 1);
  }
`;

const imageStyle = css`
  width: 100%;
  height: auto;
  object-fit: cover; /* Đảm bảo ảnh không bị méo */
`;

const buttonContainerStyle = css`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`;

const moreButtonStyle = css`
  position: relative;
  padding: 7px 18px;
  border-radius: 7px;
  border: 2px solid #b47e11;
  font-size: 14px;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 2px;
  background: transparent;
  color: #b47e11;
  overflow: hidden;
  box-shadow: 0 0 0 0 transparent;
  transition: all 0.2s ease-in;

  &:hover {
    background: rgb(61, 106, 255);
    box-shadow: 0 0 30px 5px rgba(0, 142, 236, 0.815);
    color: yellow;
    transition: all 0.2s ease-out;
  }

  &:hover::before {
    animation: sh02 0.5s 0s linear;
  }

  &::before {
    content: '';
    display: block;
    width: 0px;
    height: 86%;
    position: absolute;
    top: 7%;
    left: 0%;
    opacity: 0;
    background: #fff;
    box-shadow: 0 0 50px 30px #fff;
    transform: skewX(-20deg);
  }

  @keyframes sh02 {
    from {
      opacity: 0;
      left: 0%;
    }
    50% {
      opacity: 1;
    }
    to {
      opacity: 0;
      left: 100%;
    }
  }

  &:active {
    box-shadow: 0 0 0 0 transparent;
    transition: box-shadow 0.2s ease-in;
  }
`;

export default Popular;
