/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react';
import { css } from '@emotion/react';
import { useParams } from 'react-router-dom';
import { authAPI, endpoints } from '../../configs391/API391';
import { useNavigate } from 'react-router-dom';

const ExportBill391 = () => {
  const { id } = useParams();
  const [reservation, setReservation] = useState(null);
  const [guest, setGuest] = useState(null);
  const [services, setServices] = useState([]);
  const [serviceCounts, setServiceCounts] = useState({});
  const [roomTypes, setRoomTypes] = useState([]);
  const [roomDetails, setRoomDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [roomCost, setRoomCost] = useState(0);
  const [totalDays, setTotalDays] = useState(0);
  const navigate = useNavigate();
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await authAPI().get(`/reservations/${id}/`);
        setReservation(response.data);
  
        const guestResponse = await authAPI().get(`/accounts/${response.data.guest}/`);
        setGuest(guestResponse.data);
  
        const servicesResponse = await authAPI().get(`/services/`);
        setServices(servicesResponse.data);
  
        const roomTypesResponse = await authAPI().get(endpoints.rt);
        const fetchedRoomTypes = roomTypesResponse.data;
        setRoomTypes(fetchedRoomTypes);
  
        const roomIds = response.data.room;
        if (roomIds.length > 0) {
          const roomDetailsPromises = roomIds.map(roomId => authAPI().get(`/rooms/${roomId}/`));
          const roomDetailsResponses = await Promise.all(roomDetailsPromises);
          const fetchedRoomDetails = roomDetailsResponses.map(res => res.data);
          setRoomDetails(fetchedRoomDetails);
  
          const checkinDate = new Date(response.data.checkin);
          const checkoutDate = new Date(response.data.checkout);
          const days = Math.ceil((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24));
          setTotalDays(days);
  
          const roomCost = roomIds.reduce((sum, roomId) => {
            const r = fetchedRoomDetails.find(rd => rd.id === roomId);
            if (r) {
              const roomType = fetchedRoomTypes.find(rt => rt.id === r.room_type);
              if (roomType) {
                return sum + (roomType.price * days);
              }
            }
            return sum;
          }, 0);
          setRoomCost(roomCost);
        }
  
        const serviceCount = {};
        response.data.services.forEach(serviceId => {
          serviceCount[serviceId] = (serviceCount[serviceId] || 0) + 1;
        });
        setServiceCounts(serviceCount);
      } catch (error) {
        setError('Error fetching reservation details');
      } finally {
        setLoading(false);
      }
    };
  
    fetchDetails();
  }, [id]);

  const calculateTotalAmount = () => {
    let total = roomCost;
    services.forEach(service => {
      if (serviceCounts[service.id]) {
        total += service.price * serviceCounts[service.id];
      }
    });
    return total;
  };

  useEffect(() => {
    if (!loading) {
      setTotalAmount(calculateTotalAmount());
    }
  }, [services, serviceCounts, roomCost, loading]);

  const handleExportBill = async () => {
    try {
      // Xuất hóa đơn
      await authAPI().post('/bills/', {
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString(),
        total_amount: totalAmount,
        reservation: id,
      });

      // Đặt trạng thái phòng thành "trống"
      const roomIds = reservation.room; // Lấy danh sách ID phòng từ đặt phòng
      await Promise.all(roomIds.map(roomId => 
        authAPI().post(`/rooms/${roomId}/set-empty/`)
      ));

      alert('Hóa đơn đã được xuất thành công và phòng đã được đặt thành trống!');
      navigate(`/bill/${id}`);
    } catch (error) {
      setError('Error exporting bill');
    }
  };

  const handlePrintBill = () => {
    window.print();
  };
  

  const handlePayment = async () => {
    setPaymentLoading(true);
    try {
      const response = await authAPI().post('/create_payment/', {
        order_type: 'payment',
        order_id: reservation.id,
        amount: totalAmount,
        order_desc: `Thanh toán hóa đơn #${reservation.id}`,
        bank_code: '',
        language: 'vn',
      });

      const paymentUrl = response.data[0];
      window.location.href = paymentUrl;
    } catch (error) {
      setError('Error initiating payment');
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) return <div css={loadingStyle}>Loading...</div>;
  if (error) return <div css={errorStyle}>{error}</div>;

  return (
    <div css={[containerStyle, printStyle]} id="printable">
      <h1 css={titleStyle}>HÓA ĐƠN</h1>
      {reservation && guest && (
        <div css={billContainerStyle}>
          <h2 css={sectionTitleStyle}>Thông tin hóa đơn</h2>
          <div css={infoStyle}>
            <p><strong>ID Đặt Phòng:</strong> {reservation.id}</p>
            <p><strong>Ngày đặt:</strong> {new Date(reservation.book_date).toLocaleDateString()}</p>
            <p><strong>Ngày nhận phòng:</strong> {new Date(reservation.checkin).toLocaleDateString()}</p>
            <p><strong>Ngày trả phòng:</strong> {new Date(reservation.checkout).toLocaleDateString()}</p>
            <p><strong>Số ngày ở:</strong> {totalDays} ngày</p>
          </div>

          <h2 css={sectionTitleStyle}>Thông tin khách hàng</h2>
          <div css={infoStyle}>
            <p><strong>Tên khách hàng:</strong> {guest.name}</p>
            <p><strong>Địa chỉ:</strong> {guest.address}</p>
            <p><strong>Số điện thoại:</strong> {guest.phone}</p>
          </div>

          <h2 css={sectionTitleStyle}>Chi tiết hóa đơn</h2>
          <table css={tableStyle}>
            <thead>
              <tr>
                <th>Loại</th>
                <th>Chi tiết</th>
                <th>Đơn giá (VND)</th>
                <th>Số lượng</th>
                <th>Thành tiền (VND)</th>
              </tr>
            </thead>
            <tbody>
              {services.map(service => (
                serviceCounts[service.id] > 0 && (
                  <tr key={service.id}>
                    <td>Dịch vụ</td>
                    <td>{service.name}</td>
                    <td>{service.price.toLocaleString()}</td>
                    <td>{serviceCounts[service.id]}</td>
                    <td>{(service.price * serviceCounts[service.id]).toLocaleString()}</td>
                  </tr>
                )
              ))}
              <tr>
                <td colSpan="4" css={totalRowStyle}>Tiền phòng ({totalDays} ngày)</td>
                <td>{roomCost.toLocaleString()}</td>
              </tr>
              <tr>
                <td colSpan="4" css={totalRowStyle}>Tổng cộng</td>
                <td>{totalAmount.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>

          <div css={actionContainerStyle} className="actionContainer">
            <button css={exportButtonStyle} onClick={handleExportBill}>Xuất Hóa Đơn</button>
            <button css={paymentButtonStyle} onClick={handlePayment}>Thanh Toán VNPAY</button>
            <button css={printButtonStyle} onClick={handlePrintBill}>In Hóa Đơn</button>
          </div>
        </div>
      )}
    </div>
  );
};

const printStyle = css`
  @media print {
    body > * {
      display: none !important; /* Ẩn tất cả các phần tử */
    }

    #printable {
      display: block !important; /* Chỉ hiện phần tử có ID là "printable" */
      font-size: 0.8em; /* Giảm kích thước font để làm cho hóa đơn nhỏ hơn */
      width: 100%; /* Đặt chiều rộng 100% để sử dụng tối đa không gian trang */
    }

    table {
      font-size: 0.8em; /* Giảm kích thước font trong bảng */
    }

    th, td {
      padding: 4px; /* Giảm khoảng cách padding trong bảng */
    }

    /* Ẩn các nút khi in */
    .actionContainer {
      display: none !important; /* Ẩn container chứa các nút */
    }
  }
`;

const containerStyle = css`
  width: 600px;
  background-color: #fafafa;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-radius: 24px;
  padding: 100px;
  margin: 50px auto;
`;

const billContainerStyle = css`
  margin-top: 20px;
`;

const titleStyle = css`
  text-align: center;
  font-size: 24px;
  color: #fa5b30;
  background: linear-gradient(to right, #fa5b30, #3e8e41);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const sectionTitleStyle = css`
  font-size: 20px;
  margin-bottom: 10px;
  color: #333;
`;

const infoStyle = css`
  margin-bottom: 20px;
  color: #555;
`;

const tableStyle = css`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  
  th, td {
    padding: 8px;
    border: 1px solid #ccc;
    text-align: left;
  }

  th {
    background-color: #f4f4f4;
  }
`;

const totalRowStyle = css`
  font-weight: bold;
`;

const actionContainerStyle = css`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const exportButtonStyle = css`
  padding: 10px 15px;
  background-color: #fa5b30;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #e94e24;
  }
`;

const printButtonStyle = css`
  padding: 10px 15px;
  background-color: #4caf50;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

const paymentButtonStyle = css`
  padding: 10px 15px;
  background-color: #2196F3;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0b7dda;
  }
`;

const loadingStyle = css`
  text-align: center;
  font-size: 20px;
  margin-top: 50px;
`;

const errorStyle = css`
  color: red;
  text-align: center;
  margin-top: 50px;
`;

export default ExportBill391;
