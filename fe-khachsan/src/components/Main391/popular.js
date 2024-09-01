/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import { endpoints, authAPI } from '../../configs391/API391';

const CLOUDINARY_BASE_URL = 'https://res.cloudinary.com/vantan/';

const Popular = () => {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [showAll, setShowAll] = useState(false);

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
        setRooms(response.data);
      } catch (error) {
        console.error("Failed to fetch rooms:", error);
      }
    };

    fetchRoomTypes();
    fetchRooms();
  }, []);

  const roomTypeMap = roomTypes.reduce((map, roomType) => {
    map[roomType.id] = roomType;
    return map;
  }, {});

  const displayedRooms = showAll ? rooms : rooms.slice(0, 6);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 3,
    slidesToScroll: 1,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />
  };

  return (
    <section css={sectionContainerStyle}>
      <h2 className="section-header reveal">Danh sách phòng</h2>
      <div css={sliderWrapperStyle}>
        {showAll ? (
          <div css={gridStyle}>
            {displayedRooms.map((room) => {
              const roomType = roomTypeMap[room.room_type] || {};
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
        ) : (
          <Slider {...sliderSettings}>
            {displayedRooms.map((room) => {
              const roomType = roomTypeMap[room.room_type] || {};
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
          </Slider>
        )}
      </div>
      <div css={buttonContainerStyle}>
        <button css={moreButtonStyle} onClick={() => setShowAll(!showAll)}>
          {showAll ? 'Ẩn bớt' : 'Xem thêm'}
        </button>
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

const sectionContainerStyle = css`
  text-align: center;
  padding: 5rem 0;
  margin-top: 5rem;
`;

const sliderWrapperStyle = css`
  max-width: 1200px;
  margin: auto;
`;

const slideCardStyle = css`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 0.8rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  max-width: 300px;
  margin: 0 10px; /* Thay đổi khoảng cách giữa các thẻ trong slider */

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
  margin-bottom: 0.5rem;

  h4 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-dark);
  }
`;

const quantityAndButtonStyle = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const bookingButtonStyle = css`
  display: inline-block;
  padding: 0.4em 0.8em;
  border-radius: 0.3em;
  border: none;
  background: linear-gradient(160deg, #a54e07, #b47e11, #fef1a2, #bc881b, #a54e07);
  color: rgb(120, 50, 5);
  text-transform: uppercase;
  font-weight: 600;
  cursor: pointer;
  transition: background-size 0.2s ease-in-out, box-shadow 0.2s ease-in-out, transform 0.2s ease-in-out;

  // Initial shadow and elevation
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  &:hover {
    background-size: 150% 150%;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    color: rgba(120, 50, 5, 0.8);
    transform: translateY(-2px); 
  }
`;

const buttonContainerStyle = css`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`;

const moreButtonStyle = css`
  padding: 0.5em 1em;
  border-radius: 0.3em;
  border: 2px solid #b47e11;
  background: transparent;
  color: #b47e11;
  font-weight: 600;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;

  &:hover {
    background: rgb(61, 106, 255);
    color: yellow;
  }
`;

const gridStyle = css`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem; /* Thay đổi khoảng cách giữa các thẻ trong grid */
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

export default Popular;
