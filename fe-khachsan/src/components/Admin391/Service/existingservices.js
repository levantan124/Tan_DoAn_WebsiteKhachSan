/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useEffect } from 'react';
import { authAPI } from '../../../configs391/API391';

const ExistingServices = () => {
  const [services, setServices] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [updatedService, setUpdatedService] = useState({ name: '', price: '' });
  const [newService, setNewService] = useState({ name: '', price: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await authAPI().get(`/services/`);
        console.log('Fetched services:', response.data); // Log dữ liệu để kiểm tra
        setServices(response.data);
      } catch (error) {
        console.error("Failed to fetch services:", error);
      }
    };

    fetchServices();
  }, []);

  // Handle opening the edit popup
  const openPopup = (service) => {
    setCurrentService(service);
    setUpdatedService({ name: service.name, price: service.price });
    setShowPopup(true);
  };

  // Handle closing the edit popup
  const closePopup = () => {
    setShowPopup(false);
    setCurrentService(null);
  };

  // Handle form submission for updating a service
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authAPI().patch(`/services/${currentService.id}/`, updatedService);
      console.log('Service updated:', response.data);
      setServices((prevServices) =>
        prevServices.map((service) =>
          service.id === currentService.id ? response.data : service
        )
      );
      closePopup();
    } catch (error) {
      console.error('Failed to update service:', error);
    }
  };

  // Handle opening the add service popup
  const openAddPopup = () => {
    setShowAddPopup(true);
  };

  // Handle closing the add service popup
  const closeAddPopup = () => {
    setShowAddPopup(false);
    setNewService({ name: '', price: '' });
  };

  // Handle form submission for adding a service
  const handleAddService = async (e) => {
    e.preventDefault();
    try {
      const response = await authAPI().post('/services/', newService);
      console.log('Service added:', response.data);
      setServices([...services, response.data]);
      closeAddPopup();
    } catch (error) {
      console.error('Failed to add service:', error);
    }
  };

  // Handle opening the delete confirmation popup
  const openDeleteConfirm = (service) => {
    setCurrentService(service);
    setShowDeleteConfirm(true);
  };

  // Handle closing the delete confirmation popup
  const closeDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    setCurrentService(null);
  };

  // Handle service deletion
  const handleDeleteService = async () => {
    try {
      await authAPI().post(`/services/${currentService.id}/delete-service/`);
      setServices((prevServices) =>
        prevServices.filter((service) => service.id !== currentService.id)
      );
      closeDeleteConfirm();
    } catch (error) {
      console.error('Failed to delete service:', error);
    }
  };

  return (
    <section css={sectionContainerStyle}>
      <h2>Danh sách dịch vụ</h2>
      <button onClick={openAddPopup} css={addButtonStyle}>Thêm dịch vụ</button>
      <table css={tableStyle}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên dịch vụ</th>
            <th>Giá</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.id}>
              <td>{service.id}</td>
              <td>{service.name}</td>
              <td>{service.price} VND</td>
              <td>
                <button onClick={() => openPopup(service)} css={editButtonStyle}>Chỉnh sửa</button>
                <button onClick={() => openDeleteConfirm(service)} css={deleteButtonStyle}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Service Popup */}
      {showPopup && (
        <div css={popupOverlayStyle}>
          <div css={popupContentStyle}>
            <h3 css={popupTitleStyle}>Chỉnh sửa dịch vụ</h3>
            <form onSubmit={handleFormSubmit} css={formStyle}>
              <label css={labelStyle}>
                Tên dịch vụ:
                <input
                  type="text"
                  value={updatedService.name}
                  onChange={(e) => setUpdatedService({ ...updatedService, name: e.target.value })}
                  required
                  css={inputStyle}
                />
              </label>
              <label css={labelStyle}>
                Giá:
                <input
                  type="number"
                  value={updatedService.price}
                  onChange={(e) => setUpdatedService({ ...updatedService, price: e.target.value })}
                  required
                  css={inputStyle}
                />
              </label>
              <div css={popupActionsStyle}>
                <button type="submit" css={saveButtonStyle}>Lưu</button>
                <button type="button" onClick={closePopup} css={cancelButtonStyle}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Service Popup */}
      {showAddPopup && (
        <div css={popupOverlayStyle}>
          <div css={popupContentStyle}>
            <h3 css={popupTitleStyle}>Thêm dịch vụ</h3>
            <form onSubmit={handleAddService} css={formStyle}>
              <label css={labelStyle}>
                Tên dịch vụ:
                <input
                  type="text"
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  required
                  css={inputStyle}
                />
              </label>
              <label css={labelStyle}>
                Giá:
                <input
                  type="number"
                  value={newService.price}
                  onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                  required
                  css={inputStyle}
                />
              </label>
              <div css={popupActionsStyle}>
                <button type="submit" css={saveButtonStyle}>Lưu</button>
                <button type="button" onClick={closeAddPopup} css={cancelButtonStyle}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {showDeleteConfirm && (
        <div css={popupOverlayStyle}>
          <div css={popupContentStyle}>
            <h3 css={popupTitleStyle}>Xác nhận xóa dịch vụ</h3>
            <p>Bạn có chắc chắn muốn xóa dịch vụ "{currentService.name}" không?</p>
            <div css={popupActionsStyle}>
              <button onClick={handleDeleteService} css={saveButtonStyle}>Xóa</button>
              <button onClick={closeDeleteConfirm} css={cancelButtonStyle}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

// CSS styles
const sectionContainerStyle = css`
  padding: 2rem;
  margin: 7rem auto;
  max-width: 1200px;
  background-color: #f9f9f9;
  border-radius: 0.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const tableStyle = css`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;

  th, td {
    border: 1px solid #ddd;
    padding: 0.75rem;
    text-align: center;
  }

  th {
    background-color: #f4f4f4;
  }
`;

const addButtonStyle = css`
  display: inline-block;
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  background-color: #28a745;
  color: #fff;
  border-radius: 0.25rem;
  text-decoration: none;
  font-size: 1rem;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #218838;
  }
`;

const editButtonStyle = css`
   padding: 12px 12px;
  background-color: #17a2b8;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
  margin-right: 10px;

  &:hover {
    background-color: #138496;
    transform: scale(1.05);
  }
`;

const deleteButtonStyle = css`
  padding: 12px 12px;
  background-color: #dc3545;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
  &:hover {
      background-color: #c82333;
      transform: scale(1.05);
  }
`;

const popupOverlayStyle = css`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

// Popup Content
const popupContentStyle = css`
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 0.5rem;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

// Popup Title
const popupTitleStyle = css`
  font-size: 1.25rem;
  margin-bottom: 1rem;
`;

// Form
const formStyle = css`
  display: flex;
  flex-direction: column;
`;

const labelStyle = css`
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const inputStyle = css`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 0.25rem;
`;

// Popup Actions
const popupActionsStyle = css`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
`;

// Buttons in Popup
const saveButtonStyle = css`
  background-color: #28a745;
  color: #fff;
  border: none;
  padding: 0.75rem 1.25rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: #218838;
  }
`;

const cancelButtonStyle = css`
  background-color: #6c757d;
  color: #fff;
  border: none;
  padding: 0.75rem 1.25rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: #5a6268;
  }
`;



export default ExistingServices;
