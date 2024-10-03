/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useEffect } from 'react';
import { authAPI } from '../../configs391/API391';

const BillList = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 // Function to calculate the total amount
const calculateTotalAmount = (bills) => {
  return bills.reduce((total, bill) => total + Math.floor(Number(bill.total_amount)), 0);
};


  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await authAPI().get('/bills/');
        setBills(response.data);
      } catch (err) {
        setError('Failed to fetch bills');
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // Calculate the total amount of all bills
  const totalAmount = calculateTotalAmount(bills);

  return (
    <div css={containerStyle}>
      <h1 css={headerStyle}>Bill List</h1>
      
      {/* Display the total amount at the top of the page */}
      <div css={totalAmountStyle}>
        Tổng tiền của các phiếu đặt phòng: <strong>{totalAmount.toLocaleString()} VND</strong>
      </div>

      <div css={tableWrapperStyle}>
        <table css={tableStyle}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Ngày tạo</th>
              <th>Ngày cập nhật</th>
              <th>Thành tiền</th>
              <th>Phiếu đặt phòng</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill) => (
              <tr key={bill.id}>
                <td>{bill.id}</td>
                <td>{new Date(bill.created_date).toLocaleString()}</td>
                <td>{new Date(bill.updated_date).toLocaleString()}</td>
                <td>{bill.total_amount.toLocaleString()} VND</td>
                <td>{bill.reservation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Styles
const containerStyle = css`
  padding: 4rem;
  background-color: #f9f9fb;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const headerStyle = css`
  margin-bottom: 2rem;
  font-size: 2rem;
  color: #333;
  text-align: center;
`;

const totalAmountStyle = css`
  margin-bottom: 2rem;
  font-size: 1.5rem;
  color: #333;
  text-align: center;
`;

const tableWrapperStyle = css`
  width: 100%;
  max-width: 1000px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const tableStyle = css`
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 1rem;
    text-align: left;
  }

  th {
    background-color: #f0f0f0;
    font-weight: 600;
    color: #555;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 2px solid #ddd;
  }

  td {
    border-bottom: 1px solid #eee;
    font-size: 1rem;
    color: #333;
  }

  tr:hover {
    background-color: #f7f7f7;
  }

  tr:nth-child(even) {
    background-color: #fafafa;
  }
`;

export default BillList;
