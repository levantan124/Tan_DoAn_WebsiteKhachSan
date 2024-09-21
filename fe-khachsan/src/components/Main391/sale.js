/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState } from 'react';

const Sale = () => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div css={styles.container}>
      <div css={styles.card}>
        <button css={styles.closeButton} onClick={handleClose}>
          ×
        </button>
        <div css={styles.imageContainer}>
          <img
            src="https://tools-api.webcrumbs.org/image-placeholder/900/300/restaurant/1"
            css={styles.mainImage}
            alt="Vietnamese Cuisine Promotion"
          />
          <div css={styles.logoContainer}>
            <p css={styles.logoTextBold}>Tan_Hotel</p>
            <p css={styles.logoTextSmall}>Vietnamese Cuisine</p>
          </div>

          <div css={styles.offerContainer}>
            <p css={styles.offerTitle}>ƯU ĐÃI<p css={styles.offerSubtitle}>lên đến</p>
            20%</p>
          </div>

          <div css={styles.discountContainerLarge}>
            <p css={styles.discountText}>-15%</p>
            <p css={styles.discountDetails}>NHÓM TRÊN 20 KHÁCH</p>
          </div>

          <div css={styles.discountContainerMedium}>
            <p css={styles.discountText}>-10%</p>
            <p css={styles.discountDetails}>NHÓM TỪ 10-19 KHÁCH</p>
          </div>

          <div css={styles.discountContainerSmall}>
            <p css={styles.discountTextSmall}>-5%</p>
            <p css={styles.discountDetailsSmall}>
              GIẢM THÊM CHO THẺ VÀNG &amp; BẠC
            </p>
          </div>

          <div css={styles.freeContainer}>
            <p css={styles.freeText}>MIỄN PHÍ</p>
            <p css={styles.freeDetails}>Phụ thu rượu mang từ ngoài</p>
            <p css={styles.freeDetails}>vào (Tối đa 5 chai)</p>
            <p css={styles.freeDetails}>NHÓM TRÊN 10 KHÁCH</p>
          </div>
        </div>

        <div css={styles.foodImagesContainer}>
          <img
            src="https://tools-api.webcrumbs.org/image-placeholder/200/200/pho/2"
            css={styles.foodImage}
            alt="Food dish 1"
          />
          <img
            src="https://tools-api.webcrumbs.org/image-placeholder/200/200/pho/3"
            css={styles.foodImage}
            alt="Food dish 2"
          />
          <img
            src="https://tools-api.webcrumbs.org/image-placeholder/200/200/pho/4"
            css={styles.foodImage}
            alt="Food dish 3"
          />
          <img
            src="https://tools-api.webcrumbs.org/image-placeholder/200/200/pho/5"
            css={styles.foodImage}
            alt="Food dish 4"
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
    z-index: 1000; /* Đảm bảo popup nằm trên các thành phần khác */
  `,
  card: css`
    width: 900px;
    border-radius: 24px;
    background-color: #f9fafb;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
    position: relative; /* Để nút đóng nằm trong phạm vi card */
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
    z-index: 2000; /* Đảm bảo nút đóng nằm trên các thành phần khác */
    &:hover {
      color: #ff0000;
    }
  `,
  imageContainer: css`
    position: relative;
    width: 100%;
    height: 300px;
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
  logo: css`
    object-fit: cover;
    width: 50px;
    height: 50px;
  `,
  logoTextBold: css`
    font-weight: bold;
  `,
  logoTextSmall: css`
    font-size: 12px;
  `,
  offerContainer: css`
    position: absolute;
    top: 3.5rem;
    left: 10px;
    color: white;
    text-align: left;
  `,
  offerTitle: css`
    font-size: 48px;
    font-weight: bold;
    line-height: 16px;
  `,
  offerSubtitle: css`
    font-size: 30px;
    font-weight: 600;
  `,
  discountContainerLarge: css`
    position: absolute;
    top: 40px;
    right: 25rem;
    width: 120px;
    height: 120px;
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
  discountContainerMedium: css`
    position: absolute;
    top: 9rem;
    right: 8rem;
    width: 100px;
    height: 100px;
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
  discountContainerSmall: css`
    position: absolute;
    top: 40px;
    right: 5rem;
    width: 80px;
    height: 80px;
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
  discountText: css`
    font-size: 30px;
    font-weight: bold;
  `,
  discountTextSmall: css`
    font-size: 20px;
    font-weight: bold;
  `,
  discountDetails: css`
    font-size: 12px;
  `,
  discountDetailsSmall: css`
    font-size: 10px;
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
    font-size: 11px;
  `,
  foodImagesContainer: css`
    display: flex;
    gap: 8px;
    margin-top: 16px;
    overflow-x: auto;
  `,
  foodImage: css`
    width: 200px;
    height: 200px;
    border-radius: 12px;
  `,
};

export default Sale;
