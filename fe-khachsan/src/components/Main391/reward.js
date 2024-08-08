/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';


const Reward = () => (
  <section css={rewardContainerStyle}>
    <h2 className="section-header reveal">Reward Program</h2>
    <p className="reveal">
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quaerat sint esse aliquam minus magni.
    </p>
    <h4 className="reveal">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat, voluptatibus.
    </h4>
  </section>
);

const rewardContainerStyle = css`
  padding: 2rem;
  text-align: center;
  border-radius: 2rem;
  box-shadow: 5px 5px 30px rgba(0, 0, 0, 0.2);
  p {
    margin-bottom: 1rem;
    font-weight: 600;
    color: var(--text-light);
  }
  h4 {
    max-width: 500px;
    margin: auto;
    margin-bottom: 1rem;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-dark);
  }
`;

export default Reward;