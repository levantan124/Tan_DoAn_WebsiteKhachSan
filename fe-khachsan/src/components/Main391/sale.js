/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useEffect } from 'react';
import { authAPI, endpoints } from '../../configs391/API391';

const Sale = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [promotions, setPromotions] = useState([]);
  const [flippedBubbleIndex, setFlippedBubbleIndex] = useState(null);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code)
      .then(() => {
        alert(`Copied to clipboard: ${code}`);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await authAPI().get(endpoints.sale);
        if (response.data) {
          setPromotions(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch promotions:", error);
      }
    };

    fetchPromotions();

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible || promotions.length === 0) return null;

  return (
    <div css={styles.container}>
      <div css={styles.card}>
        <button css={styles.closeButton} onClick={handleClose}>
          ×
        </button>
        <div css={styles.imageContainer}>
          <img
            src="https://res.cloudinary.com/vantan/image/upload/v1726747588/r1ck6fkj7ddwajpylmkw.jpg"
            css={styles.mainImage}
            alt="Promotion"
          />
          <div css={styles.logoContainer}>
            <p css={styles.logoTextBold}>Tan_Hotel</p>
            <p css={styles.logoTextSmall}>Cung cấp nơi lưu trú tốt nhất Việt Nam</p>
          </div>

          <div css={styles.offerContainer}>
            <p css={styles.offerTitle}>ƯU ĐÃI lên đến</p>
          </div>

          <div css={styles.discountRow}>
            {promotions.map((promotion, index) => {
            // Tính kích thước dựa trên discount
            const bubbleSize = promotion.discount < 20 ? styles.smallBubble : promotion.discount < 50 ? styles.mediumBubble : styles.largeBubble;
            return (
              <div
                key={promotion.id}
                css={[
                  styles.discountContainer,
                  bubbleSize,
                  {
                    transform: flippedBubbleIndex === index ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  },
                ]}
                onClick={() => setFlippedBubbleIndex(flippedBubbleIndex === index ? null : index)}
              >
                <div css={styles.frontSide}>
                  <p css={styles.discountText}>{`-${promotion.discount}%`}</p>
                  <p css={styles.discountDetails}>{`${promotion.title} - ${promotion.description}`}</p>
                </div>
                <div css={styles.backSide} onClick={() => handleCopyCode(promotion.code)}>         
                  <p css={styles.discountText}>{promotion.code}</p>
                </div>
              </div>
            );
           })}
          </div>


          <div css={styles.freeContainer}>
            <p css={styles.freeText}>MIỄN PHÍ</p>
            <p css={styles.freeDetails}>Phụ thu rượu mang từ ngoài vào (Tối đa 5 chai)</p>
            <p css={styles.freeDetails}>NHÓM TRÊN 10 KHÁCH</p>
          </div>
        </div>

        <div css={styles.foodImagesContainer}>
          <img
            src="https://res.cloudinary.com/vantan/image/upload/v1726747588/r1ck6fkj7ddwajpylmkw.jpg"
            css={styles.foodImage}
            alt="Hotel dish 1"
          />
          <img
            src="https://res.cloudinary.com/vantan/image/upload/v1726747548/xzu9zallqe23dkl67kt0.jpg"
            css={styles.foodImage}
            alt="Hotel dish 2"
          />
          <img
            src="https://res.cloudinary.com/vantan/image/upload/v1726747587/is9h9ad1ilrsfq8btyjh.jpg"
            css={styles.foodImage}
            alt="Hotel dish 3"
          />
          <img
            src="https://res.cloudinary.com/vantan/image/upload/v1726747547/lul7nlsxb1r7rdvivtsh.jpg"
            css={styles.foodImage}
            alt="Hotel dish 4"
          />
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: css`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    backdrop-filter: blur(10px);
  `,
  card: css`
    width: 900px;
    border-radius: 24px;
    background-color: #f9fafb;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    position: relative;
    z-index: 2000;
  `,
  closeButton: css`
    position: absolute;
    top: 10px;
    right: 10px;
    width: 40px;
    height: 40px;
    background: #fff;
    border: none;
    border-radius: 50%;
    font-size: 30px;
    cursor: pointer;
    color: #333;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
    &:hover {
      color: #ff0000;
    }
  `,
  imageContainer: css`
    position: relative;
    width: 100%;
    height: 280px;
  `,
  mainImage: css`
    object-fit: cover;
    width: 100%;
    height: 100%;
    border-radius: 24px;
  `,
  logoContainer: css`
    position: absolute;
    top: 16px;
    left: 16px;
  `,
  logoTextBold: css`
    font-weight: 900;
    font-size: 25px;
    color: white;
  `,
  logoTextSmall: css`
    font-size: 15px;
    color: white;
    font-weight: bold;
  `,
  offerContainer: css`
    position: absolute;
    top: 7rem;
    left: 10px;
    color: white;
    text-align: left;
  `,
  offerTitle: css`
    margin-top: 5rem;
    font-size: 30px;
    font-weight: bold;
    line-height: 16px;
    text-decoration: underline;
  `,
  discountRow: css`
    display: flex;
    justify-content: center;
    gap: 10px;
    position: absolute;
    top: 14rem;
    left: 10px;
  `,
  discountContainer: css`
    border-radius: 50%;
    padding: 8px;
    color: white;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%);
    cursor: pointer;
    perspective: 1000px;
    transition: transform 0.6s;
    transform-style: preserve-3d;
    animation: sparkle 1.5s infinite;
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
  `,
  largeBubble: css`
    width: 120px;
    height: 120px;
  `,
  mediumBubble: css`
    width: 130px;
    height: 130px;
  `,
  smallBubble: css`
    width: 80px;
    height: 80px;
  `,
  frontSide: css`
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  `,
  backSide: css`
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    transform: rotateY(180deg);
    display: flex;
    justify-content: center;
    align-items: center;
    color: #ff6347;
    background: #333;
    border-radius: 50%;
  `,
  discountText: css`
    font-size: 27px;
    font-weight: bold;
  `,
  discountDetails: css`
    font-size: 12px;
  `,
  freeContainer: css`
    position: absolute;
    top: 1rem;
    right: 14rem;
    width: 180px;
    height: 180px;
    background-image: linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%);
    border-radius: 50%;
    padding: 8px;
    color: white;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  `,
  freeText: css`
    font-size: 18px;
    font-weight: bold;
  `,
  freeDetails: css`
    font-size: 14px;
    font-weight: 300;
  `,
  foodImagesContainer: css`
    display: flex;
    gap: 33px;
    margin-top: 16px;
    overflow-x: auto;
  `,
  foodImage: css`
    width: 200px;
    height: 200px;
    border-radius: 12px;
  `,
  '@keyframes sparkle': {
    '0%': { transform: 'scale(1)' },
    '50%': { transform: 'scale(1.1)', boxShadow: '0 0 25px rgba(255, 255, 255, 0.8)' },
    '100%': { transform: 'scale(1)' },
  },
};

export default Sale;
