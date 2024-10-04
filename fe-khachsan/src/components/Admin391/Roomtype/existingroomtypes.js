/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useEffect } from 'react';
import { authAPI, endpoints } from '../../../configs391/API391';

const ExistingRoomType = () => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [currentRoomType, setCurrentRoomType] = useState(null);
  const [newRoomType, setNewRoomType] = useState({ name: '', price: '', quantity: '' });
  const [updatedRoomType, setUpdatedRoomType] = useState({ name: '', price: '', quantity: '' });

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  const fetchRoomTypes = async () => {
    try {
      const response = await authAPI().get(endpoints.rt);
      setRoomTypes(response.data);
    } catch (error) {
      console.error("Failed to fetch room types:", error);
    }
  };

  const openAddPopup = () => {
    setShowAddPopup(true);
  };

  const closeAddPopup = () => {
    setShowAddPopup(false);
    setNewRoomType({ name: '', price: '', quantity: '' });
  };

  const openEditPopup = (roomType) => {
    setCurrentRoomType(roomType);
    setUpdatedRoomType({ name: roomType.name, price: roomType.price, quantity: roomType.quantity });
    setShowEditPopup(true);
  };

  
  const formatPrice = (price) => {
    // Chuyển đổi giá thành số nguyên
    const number = Math.round(price); 
    return number.toLocaleString('vi-VN') + ' VND';
  };

  const closeEditPopup = () => {
    setShowEditPopup(false);
    setCurrentRoomType(null);
  };

  const handleAddFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authAPI().post(endpoints.rt, newRoomType);
      console.log('Room type added:', response.data);
      fetchRoomTypes(); // Refresh the list after adding
      closeAddPopup();
    } catch (error) {
      console.error('Failed to add room type:', error);
    }
  };

  const handleEditFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authAPI().patch(`${endpoints.rt}${currentRoomType.id}/`, updatedRoomType);
      console.log('Room type updated:', response.data);
      fetchRoomTypes(); // Refresh the list after updating
      closeEditPopup();
    } catch (error) {
      console.error('Failed to update room type:', error);
    }
  };

  return (
    <section css={sectionContainerStyle}>
      <h2>Danh sách loại phòng</h2>
      <button onClick={openAddPopup} css={addButtonStyle}>Thêm loại phòng</button>
      <table css={tableStyle}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên loại phòng</th>
            <th>Giá</th>
            <th>Số lượng</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {roomTypes.map((roomType) => (
            <tr key={roomType.id}>
              <td>{roomType.id}</td>
              <td>{roomType.name}</td>
              <td>{formatPrice(roomType.price)}</td>
              <td>{roomType.quantity}</td>
              <td>
                <button onClick={() => openEditPopup(roomType)} css={editButtonStyle}>Chỉnh sửa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Popup */}
      {showAddPopup && (
        <div css={popupOverlayStyle}>
          <div css={popupContentStyle}>
            <h3>Thêm loại phòng</h3>
            <form onSubmit={handleAddFormSubmit} css={formStyle}>
              <div css={formGroupStyle}>
                <label><strong>Tên loại phòng:</strong></label>
                <input
                  type="text"
                  value={newRoomType.name}
                  onChange={(e) => setNewRoomType({ ...newRoomType, name: e.target.value })}
                  css={inputStyle}
                />
              </div>
              <div css={formGroupStyle}>
                <label><strong>Giá:</strong></label>
                <input
                  type="number"
                  step="0.01"
                  value={newRoomType.price}
                  onChange={(e) => setNewRoomType({ ...newRoomType, price: e.target.value })}
                  css={inputStyle}
                />
              </div>
              <div css={formGroupStyle}>
                <label><strong>Số lượng:</strong></label>
                <input
                  type="number"
                  value={newRoomType.quantity}
                  onChange={(e) => setNewRoomType({ ...newRoomType, quantity: e.target.value })}
                  css={inputStyle}
                />
              </div>
              <div css={popupActionsStyle}>
                <button type="submit" css={saveButtonStyle}>Lưu</button>
                <button type="button" onClick={closeAddPopup} css={cancelButtonStyle}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Popup */}
      {showEditPopup && (
        <div css={popupOverlayStyle}>
          <div css={popupContentStyle}>
            <h3>Chỉnh sửa loại phòng</h3>
            <form onSubmit={handleEditFormSubmit} css={formStyle}>
              <div css={formGroupStyle}>
                <label><strong>Tên loại phòng:</strong></label>
                <input
                  type="text"
                  value={updatedRoomType.name}
                  onChange={(e) => setUpdatedRoomType({ ...updatedRoomType, name: e.target.value })}
                  css={inputStyle}
                />
              </div>
              <div css={formGroupStyle}>
                <label><strong>Giá:</strong></label>
                <input
                  type="number"
                  step="0.01"
                  value={updatedRoomType.price}
                  onChange={(e) => setUpdatedRoomType({ ...updatedRoomType, price: e.target.value })}
                  css={inputStyle}
                />
              </div>
              <div css={formGroupStyle}>
                <label><strong>Số lượng:</strong></label>
                <input
                  type="number"
                  value={updatedRoomType.quantity}
                  onChange={(e) => setUpdatedRoomType({ ...updatedRoomType, quantity: e.target.value })}
                  css={inputStyle}
                />
              </div>
              <div css={popupActionsStyle}>
                <button type="submit" css={saveButtonStyle}>Lưu</button>
                <button type="button" onClick={closeEditPopup} css={cancelButtonStyle}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

const sectionContainerStyle = css`
  padding: 20px;
  margin: 1rem auto;
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
  transition: background-color 0.3s;

  &:hover {
    background-color: #218838;
  }
`;

const editButtonStyle = css`
  display: inline-block;
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  background-color: #17a2b8;
  color: #fff;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  text-align: center;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;


const popupOverlayStyle = css`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const popupContentStyle = css`
  background-color: #fff;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
`;

const formStyle = css`
  display: flex;
  flex-direction: column;
`;

const formGroupStyle = css`
  margin-bottom: 1rem;
`;

const inputStyle = css`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 0.25rem;
`;

const popupActionsStyle = css`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const saveButtonStyle = css`
  padding: 0.5rem 1rem;
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #218838;
  }
`;

const cancelButtonStyle = css`
  padding: 0.5rem 1rem;
  background-color: #6c757d;
  color: #fff;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #5a6268;
  }
`;

export default ExistingRoomType;
