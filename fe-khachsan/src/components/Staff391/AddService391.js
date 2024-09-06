/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react';
import { css } from '@emotion/react';
import { authAPI } from '../../configs391/API391';
import { useParams, useNavigate } from 'react-router-dom';

const AddService391 = () => {
  const { id } = useParams(); // Lấy id từ URL
  const [reservation, setReservation] = useState(null);
  const [guest, setGuest] = useState(null);
  const [services, setServices] = useState([]);
  const [serviceCounts, setServiceCounts] = useState({});
  const [selectedService, setSelectedService] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservationDetails = async () => {
      try {
        // Lấy thông tin chi tiết Reservation
        const response = await authAPI().get(`/reservations/${id}/`);
        setReservation(response.data);
        
        // Lấy thông tin khách hàng
        const guestResponse = await authAPI().get(`/accounts/${response.data.guest}/`);
        setGuest(guestResponse.data);
        
        // Lấy thông tin dịch vụ
        const servicesResponse = await authAPI().get(`/services/`);
        setServices(servicesResponse.data);

        // Cập nhật số lượng dịch vụ hiện tại
        const serviceCount = {};
        response.data.services.forEach(serviceId => {
          if (serviceCount[serviceId]) {
            serviceCount[serviceId]++;
          } else {
            serviceCount[serviceId] = 1;
          }
        });
        setServiceCounts(serviceCount);

      } catch (error) {
        setError('Error fetching reservation details');
      } finally {
        setLoading(false);
      }
    };

    fetchReservationDetails();
  }, [id]);

  const handleAddService = async () => {
    try {
      if (selectedService) {
        await authAPI().post('/reservation_services/', {
          reservation: id,
          service: selectedService
        });

        // Cập nhật số lượng dịch vụ
        setServiceCounts(prevCounts => ({
          ...prevCounts,
          [selectedService]: (prevCounts[selectedService] || 0) + 1
        }));

        // Hiển thị thông báo thành công
        alert('Dịch vụ đã được thêm thành công');
      } else {
        alert('Vui lòng chọn dịch vụ');
      }
    } catch (error) {
      setError('Error adding service');
    }
  };

  const handleGenerateInvoice = () => {
    if (reservation && reservation.status_checkin) {
      // Điều hướng đến trang xuất hóa đơn với id của reservation
      navigate(`/bill/${id}`);
    } else {
      alert('Khách chưa nhận phòng. Vui lòng kiểm tra lại.');
    }
  };

  const handleRemoveService = async (serviceId) => {
    try {
      await authAPI().patch(`/reservation_services/${serviceId}/`, {
        // Xóa dịch vụ bằng cách gửi PATCH request
      });

      // Cập nhật số lượng dịch vụ
      setServiceCounts(prevCounts => {
        const newCounts = { ...prevCounts };
        if (newCounts[serviceId]) {
          newCounts[serviceId]--;
          if (newCounts[serviceId] === 0) delete newCounts[serviceId];
        }
        return newCounts;
      });

      // Hiển thị thông báo thành công
      alert('Dịch vụ đã được xóa thành công');
    } catch (error) {
      setError('Error removing service');
    }
  };

  const calculateTotalAmount = () => {
    let total = 0;
  
    // Tính tổng chi phí dịch vụ
    services.forEach(service => {
      if (serviceCounts[service.id]) {
        total += service.price * serviceCounts[service.id];
      }
    });
  
    // Tính tổng chi phí phòng
    if (reservation && reservation.rooms) {
      const totalDays = (new Date(reservation.checkout) - new Date(reservation.checkin)) / (1000 * 60 * 60 * 24);
      const totalRoomCost = reservation.rooms.reduce((sum, room) => {
        return sum + (room.room_type.price * totalDays);
      }, 0);
      total += totalRoomCost;
    }
  
    return total;
  };

  if (loading) return <div css={loadingStyle}>Loading...</div>;
  if (error) return <div css={errorStyle}>{error}</div>;

  return (
    <div css={containerStyle}>
      <h1 css={titleStyle}>Thêm Dịch Vụ Cho Đặt Phòng</h1>
      {reservation && guest && (
        <div css={detailsStyle}>
          <h2 css={sectionTitleStyle}>Thông tin Đặt Phòng</h2>
          <div css={infoStyle}>
            <p><strong>ID:</strong> {reservation.id}</p>
            <p><strong>Ngày đặt:</strong> {new Date(reservation.book_date).toLocaleDateString()}</p>
            <p><strong>Ngày nhận phòng:</strong> {new Date(reservation.checkin).toLocaleDateString()}</p>
            <p><strong>Ngày trả phòng:</strong> {new Date(reservation.checkout).toLocaleDateString()}</p>
            <p><strong>Trạng thái nhận phòng:</strong> {reservation.status_checkin ? 'Đã nhận phòng' : 'Chưa nhận phòng'}</p>
          </div>
          
          <h2 css={sectionTitleStyle}>Thông tin Khách Hàng</h2>
          <div css={infoStyle}>
            <p><strong>Tên khách hàng:</strong> {guest.name}</p>
            <p><strong>Địa chỉ:</strong> {guest.address}</p>
            <p><strong>Số điện thoại:</strong> {guest.phone}</p>
          </div>

          <h2 css={sectionTitleStyle}>Dịch Vụ</h2>
          <ul css={servicesStyle}>
            {services.map(service => (
              <li key={service.id} css={serviceItemStyle}>
                {service.name} - {service.price.toLocaleString()} VND
                {serviceCounts[service.id] && ` (x${serviceCounts[service.id]})`}
                <button 
                  css={removeButtonStyle} 
                  onClick={() => handleRemoveService(service.id)}
                >
                  Xóa
                </button>
              </li>
            ))}
          </ul>

          <div css={addServiceContainerStyle}>
            <select 
              css={selectStyle} 
              value={selectedService} 
              onChange={(e) => setSelectedService(e.target.value)}
            >
              <option value="">Chọn dịch vụ</option>
              {services.map(service => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
            <button css={buttonStyle} onClick={handleAddService}>Thêm Dịch Vụ</button>
          </div>
          
          <h3 css={totalAmountStyle}>Tổng số tiền dịch vụ: {calculateTotalAmount().toLocaleString()} VND</h3>
          <div css={actionContainerStyle}>
            <button css={generateInvoiceButtonStyle} onClick={handleGenerateInvoice}>
              Trả phòng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const containerStyle = css`
  padding: 30px;
  max-width: 1000px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  margin-top: 5rem;
`;

const titleStyle = css`
  font-size: 28px;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
  font-weight: bold;
`;

const detailsStyle = css`
  font-size: 16px;
  color: #444;
`;

const sectionTitleStyle = css`
  font-size: 22px;
  color: #2a9d8f;
  margin-bottom: 15px;
  font-weight: 600;
`;

const infoStyle = css`
  background: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const servicesStyle = css`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const serviceItemStyle = css`
  padding: 10px;
  border-bottom: 1px solid #ddd;
  color: #555;
  transition: background-color 0.3s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  &:hover {
    background-color: #f1f1f1;
  }
`;

const addServiceContainerStyle = css`
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const selectStyle = css`
  padding: 10px;
  font-size: 16px;
  border-radius: 4px;
  border: 1px solid #ddd;
  flex: 1;
`;

const buttonStyle = css`
  padding: 10px 20px;
  font-size: 16px;
  color: #fff;
  background-color: #2a9d8f;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #1f8a77;
  }
`;

const removeButtonStyle = css`
  padding: 5px 10px;
  font-size: 14px;
  color: #fff;
  background-color: #e63946;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #d62839;
  }
`;

const totalAmountStyle = css`
  font-size: 20px;
  color: #333;
  font-weight: bold;
  margin-top: 20px;
`;

const loadingStyle = css`
  font-size: 18px;
  text-align: center;
  color: #666;
`;

const errorStyle = css`
  font-size: 18px;
  text-align: center;
  color: #d9534f;
`;

const actionContainerStyle = css`
  margin-top: 20px;
  display: flex;
  justify-content: center;
`;

const generateInvoiceButtonStyle = css`
  padding: 10px 20px;
  font-size: 16px;
  color: #fff;
  background-color: #2a9d8f;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #1f8a77;
  }
`;



export default AddService391;
