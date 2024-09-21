/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import 'font-awesome/css/font-awesome.min.css';
import { FaAward } from "react-icons/fa";

const Reward = () => {
  return (
    <div css={webcrumbsStyle}>
      <div css={containerStyle}>
        <h2 css={titleStyle}>TẠI SAO NÊN CHỌN CHÚNG TÔI</h2>
        <div css={dividerStyle}></div>
        <div css={flexContainerStyle}>
          <div css={cardStyle}>
            <i className="fa fa-tag" css={iconStyle}></i>
            <h3 css={cardTitleStyle}>Giá cạnh tranh</h3>
            <p css={cardTextStyle}>
              Với hơn 200 dịch vụ khi sử dụng khách sạn và hơn 300 nhân viên làm việc nhiều năm tại đây!
            </p>
          </div>
          <div css={cardStyle}>
            <FaAward css={iconStyle}/>
            <h3 css={cardTitleStyle}>Tin tưởng</h3>
            <p css={cardTextStyle}>
              Lưu trú không cần phải lo lắng vì khi biết rằng chúng tôi luôn ở đây nếu bạn cần 24/7.
            </p>
          </div>
          <div css={cardStyle}>
            <i className="fa fa-globe" css={iconStyle}></i>
            <h3 css={cardTitleStyle}>Phủ sóng toàn cầu</h3>
            <p css={cardTextStyle}>
              Hơn 1.200.000 khách sạn tại hơn 200 quốc gia và khu vực. Chính sách đãi ngộ là như nhau.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const webcrumbsStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #9ca3af;
`;

const containerStyle = css`
  background-color: white;
  margin: auto;
  padding: 100px 0;
`;

const titleStyle = css`
  text-align: center;
  font-family: 'Lato', sans-serif;
  font-size: 24px;
  color: #333; 
  margin-bottom: 9px;
`;

const dividerStyle = css`
  width: 5rem;
  height: 3px;
  background-color: #fa5b30;
  margin: auto;
  margin-bottom: 30px;
`;

const flexContainerStyle = css`
  display: flex;
  gap: 48px;
  justify-content: center;
`;

const cardStyle = css`
  text-align: center;
`;

const iconStyle = css`
  color: #fa5b30; /* text-primary */
  font-size: 60px; /* text-6xl */
  margin-bottom: 16px; /* mb-4 */
`;

const cardTitleStyle = css`
  font-size: 18px; /* text-lg */
  font-weight: bold; /* font-bold */
  color: #333; /* text-neutral-800 */
  margin-bottom: 8px; /* mb-2 */
`;

const cardTextStyle = css`
  color: #666; /* text-neutral-600 */
`;

export default Reward;
