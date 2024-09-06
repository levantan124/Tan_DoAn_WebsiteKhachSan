/** @jsxImportSource @emotion/react */
import { css} from '@emotion/react';
import { useState, useEffect } from 'react';
import { authAPI } from '../../configs391/API391';

const BillList = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div css={styles}>
      <h1>Bill List</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Created Date</th>
            <th>Updated Date</th>
            <th>Total Amount</th>
            <th>Active</th>
            <th>Reservation ID</th>
          </tr>
        </thead>
        <tbody>
          {bills.map((bill) => (
            <tr key={bill.id}>
              <td>{bill.id}</td>
              <td>{new Date(bill.created_date).toLocaleString()}</td>
              <td>{new Date(bill.updated_date).toLocaleString()}</td>
              <td>{bill.total_amount}</td>
              <td>{bill.active ? 'Yes' : 'No'}</td>
              <td>{bill.reservation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = css`
  padding: 120px;
  background-color: #f4f4f4;

  h1 {
    margin-bottom: 20px;
    color: #333;
  }

  table {
    width: 100%;
    border-collapse: collapse;

    th, td {
      padding: 10px;
      border: 1px solid #ddd;
      text-align: left;
    }

    th {
      background-color: #f2f2f2;
    }

    tr:nth-child(even) {
      background-color: #f9f9f9;
    }

    tr:hover {
      background-color: #ddd;
    }
  }
`;

export default BillList;
