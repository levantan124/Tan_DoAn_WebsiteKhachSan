/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useEffect } from 'react';
import { authAPI } from '../../../configs391/API391';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import * as XLSX from 'xlsx'; // Import XLSX

const ExistingBills = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState('total'); // Change chart type

  const formatPrice = (price) => {
    const number = Math.round(price);
    return number.toLocaleString('vi-VN') + ' VND';
  };

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await authAPI().get('/payments/get_all_payments/');
        setBills(response.data);
      } catch (err) {
        setError('Failed to fetch bills');
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, []);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(bills.map((bill) => ({
      'ID Hóa Đơn': bill.bill_info.id,
      'Tên Khách': bill.reservation_info.guest_name,
      'Phòng': bill.reservation_info.room_names,
      'Ngày Đặt': new Date(bill.reservation_info.book_date).toLocaleString(),
      'Ngày Nhận': new Date(bill.reservation_info.checkin).toLocaleString(),
      'Ngày Trả': new Date(bill.reservation_info.checkout).toLocaleString(),
      'Thành Tiền': formatPrice(bill.bill_info.total_amount),
      'Trạng Thái': bill.bill_info.status,
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Hóa Đơn');

    // Export the Excel file
    XLSX.writeFile(workbook, 'Danh_Sach_Hoa_Don.xlsx');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // Calculate data for the charts
  const totalChartData = bills.map((bill) => ({
    name: bill.reservation_info.guest_name,
    total_amount: Math.floor(Number(bill.bill_info.total_amount)),
  }));

  const dailyRevenueData = bills.reduce((acc, bill) => {
    const date = new Date(bill.reservation_info.book_date).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += Math.floor(Number(bill.bill_info.total_amount));
    return acc;
  }, {});

  const dailyRevenueChartData = Object.keys(dailyRevenueData).map((date) => ({
    name: date,
    total_amount: dailyRevenueData[date],
  }));

  const monthlyRevenueData = bills.reduce((acc, bill) => {
    const month = new Date(bill.reservation_info.book_date).toLocaleString('default', { month: 'long' });
    if (!acc[month]) {
      acc[month] = 0;
    }
    acc[month] += Math.floor(Number(bill.bill_info.total_amount));
    return acc;
  }, {});

  const monthlyRevenueChartData = Object.keys(monthlyRevenueData).map((month) => ({
    name: month,
    total_amount: monthlyRevenueData[month],
  }));

  // Calculate revenue by room
  const roomRevenueData = bills.reduce((acc, bill) => {
    const roomNames = bill.reservation_info.room_names.split(', '); // Assuming room names are comma-separated
    roomNames.forEach((room) => {
      if (!acc[room]) {
        acc[room] = 0;
      }
      acc[room] += Math.floor(Number(bill.bill_info.total_amount));
    });
    return acc;
  }, {});

  const roomRevenueChartData = Object.keys(roomRevenueData).map((room) => ({
    name: room,
    total_amount: roomRevenueData[room],
  }));

  // Calculate top 5 customers
  const customerData = bills.reduce((acc, bill) => {
    const customerName = bill.reservation_info.guest_name;
    if (!acc[customerName]) {
      acc[customerName] = 0;
    }
    acc[customerName] += Math.floor(Number(bill.bill_info.total_amount));
    return acc;
  }, {});

  const topCustomers = Object.entries(customerData)
    .sort(([, a], [, b]) => b - a) // Sort by total amount descending
    .slice(0, 5) // Get top 5
    .map(([name, total_amount]) => ({ name, total_amount }));

  const getChartData = () => {
    switch (chartType) {
      case 'total':
        return totalChartData;
      case 'daily':
        return dailyRevenueChartData;
      case 'monthly':
        return monthlyRevenueChartData;
      case 'room':
        return roomRevenueChartData;
      case 'topCustomers':
        return topCustomers;
      default:
        return totalChartData;
    }
  };

  return (
    <div css={containerStyle}>
      <h1 css={headerStyle}>DANH SÁCH HÓA ĐƠN</h1>

      {/* Buttons to select chart type */}
      <div css={buttonGroupStyle}>
        <button onClick={() => setChartType('total')}>Tổng Hóa Đơn</button>
        <button onClick={() => setChartType('daily')}>Doanh Thu Theo Ngày</button>
        <button onClick={() => setChartType('monthly')}>Doanh Thu Theo Tháng</button>
        <button onClick={() => setChartType('room')}>Doanh Thu Theo Phòng</button>
        <button onClick={() => setChartType('topCustomers')}>Top 5 Khách Hàng</button>
        {/* Button to export bills to Excel */}
        <button onClick={exportToExcel}>Xuất Hóa Đơn</button>
      </div>

      <h2 css={chartHeaderStyle}>Biểu đồ thống kê</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={getChartData()}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="total_amount" fill="#ff6347" />
        </BarChart>
      </ResponsiveContainer>

      <div css={tableWrapperStyle}>
        <table css={tableStyle}>
          <thead>
            <tr>
              <th>ID Hóa Đơn</th>
              <th>Tên Khách</th>
              <th>Phòng</th>
              <th>Ngày Đặt</th>
              <th>Ngày Nhận</th>
              <th>Ngày Trả</th>
              <th>Thành Tiền</th>
              <th>Trạng Thái</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill) => (
              <tr key={bill.bill_info.id}>
                <td>{bill.bill_info.id}</td>
                <td>{bill.reservation_info.guest_name}</td>
                <td>{bill.reservation_info.room_names}</td>
                <td>{new Date(bill.reservation_info.book_date).toLocaleString()}</td>
                <td>{new Date(bill.reservation_info.checkin).toLocaleString()}</td>
                <td>{new Date(bill.reservation_info.checkout).toLocaleString()}</td>
                <td>{formatPrice(bill.bill_info.total_amount)}</td>
                <td>{bill.bill_info.status}</td>
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
  padding-top: 0px;
  background-color: #f9f9fb;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const headerStyle = css`
  margin-bottom: 2rem;
  font-size: 24px;
  color: #333;
  text-align: center;
`;

const chartHeaderStyle = css`
  margin: 2rem 0;
  font-size: 20px;
  color: #333;
  text-align: center;
`;

const buttonGroupStyle = css`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;

  button {
    padding: 0.5rem 1rem;
    background-color: #ff6347;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: #ff4500;
    }
  }
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

export default ExistingBills;
