/** @jsxImportSource @emotion/react */
import { useState, useEffect } from "react";
import { FaCamera } from 'react-icons/fa';
import { css } from "@emotion/react";
import { authAPI, endpoints } from "../../../configs391/API391";

const ExistingRooms = () => {
    const [rooms, setRooms] = useState([]);
    const [roomTypes, setRoomTypes] = useState([]);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [currentRoom, setCurrentRoom] = useState(null);
    const [updatedRoom, setUpdatedRoom] = useState({ name: '', image: '', room_type: '' });
    const [newRoom, setNewRoom] = useState({ name: '', image: '', room_type: '' });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [roomToDelete, setRoomToDelete] = useState(null);
    const [pictureFile, setPictureFile] = useState(null);
    const [picturePreview, setPicturePreview] = useState(null);
    const cloudinaryBaseUrl = 'https://res.cloudinary.com/vantan';
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const roomsResponse = await authAPI().get(endpoints.r);
                setRooms(roomsResponse.data);

                const typesResponse = await authAPI().get(endpoints.rt);
                setRoomTypes(typesResponse.data);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };

        fetchData();
    }, []);

    const getRoomTypeName = (roomTypeId) => {
        const type = roomTypes.find((type) => type.id === roomTypeId);
        return type ? type.name : 'Unknown';
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedRoom(prev => ({ ...prev, [name]: value }));
    };

    const handleChooseImage = (e) => {
        const file = e.target.files[0];
        setPictureFile(file);
        if (file) {
            setPicturePreview(URL.createObjectURL(file));
        }
    };

    const handleEditFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            if (pictureFile) {
                formData.append('image', pictureFile);
            }
            formData.append('name', updatedRoom.name);
            formData.append('room_type', updatedRoom.room_type);

            const response = await authAPI().patch(`/rooms/${currentRoom.id}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Room updated:', response.data);
            setRooms((prevRooms) =>
                prevRooms.map((room) =>
                    room.id === currentRoom.id ? response.data : room
                )
            );
            closeEditPopup();
        } catch (error) {
            console.error('Failed to update room:', error);
        }
    };

    const handleAddFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            if (pictureFile) {
                formData.append('image', pictureFile);
            }
            formData.append('name', newRoom.name);
            formData.append('room_type', newRoom.room_type);

            const response = await authAPI().post('/rooms/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Room added:', response.data);
            setRooms([...rooms, response.data]);
            closeAddPopup();
        } catch (error) {
            console.error('Failed to add room:', error);
        }
    };

    const openEditPopup = (room) => {
        setCurrentRoom(room);
        setUpdatedRoom({ name: room.name, image: room.image, room_type: room.room_type });
        setPicturePreview(room.image ? `${cloudinaryBaseUrl}/${room.image}` : null);
        setShowEditPopup(true);
    };

    const closeEditPopup = () => {
        setShowEditPopup(false);
        setCurrentRoom(null);
    };

    const openAddPopup = () => {
        setShowAddPopup(true);
    };

    const closeAddPopup = () => {
        setShowAddPopup(false);
        setNewRoom({ name: '', image: '', room_type: '' });
        setPicturePreview(null);
    };

    const openDeleteConfirm = (room) => {
      setRoomToDelete(room);
      setShowDeleteConfirm(true);
  };
  
  const closeDeleteConfirm = () => {
      setShowDeleteConfirm(false);
      setRoomToDelete(null);
  };
  
  const handleDeleteRoom = async () => {
      if (roomToDelete) {
          try {
              const response = await authAPI().patch(`/rooms/${roomToDelete.id}/delete-room/`);
              console.log('Room deleted:', response.data);
              setRooms((prevRooms) => prevRooms.filter((room) => room.id !== roomToDelete.id));
          } catch (error) {
              console.error('Failed to delete room:', error);
          }
          closeDeleteConfirm();
      }
  };
  
    return (
        <section css={styles.sectionContainer}>
            <h2 css={styles.header}>Danh sách phòng</h2>
            <button onClick={openAddPopup} css={styles.addButton}>Thêm phòng</button>
            <table css={styles.table}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên phòng</th>
                        <th>Hình ảnh</th>
                        <th>Loại phòng</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {rooms.map((room) => {
                        const imageUrl = room.image ? `${cloudinaryBaseUrl}/${room.image}` : null;
                        return (
                            <tr key={room.id}>
                                <td>{room.id}</td>
                                <td>{room.name}</td>
                                <td>{imageUrl && <img src={imageUrl} alt={room.name} css={styles.image} />}</td>
                                <td>{getRoomTypeName(room.room_type)}</td>
                                <td>
                                    <button onClick={() => openEditPopup(room)} css={styles.editButton}>Chỉnh sửa</button>
                                    <button onClick={() => openDeleteConfirm(room)} css={styles.deleteButton}>Xóa</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {/* Edit Popup */}
            {showEditPopup && (
                <div css={styles.popupOverlay}>
                    <div css={styles.popupContent}>
                        <h3 css={styles.popupTitle}>Chỉnh sửa phòng</h3>
                        <form onSubmit={handleEditFormSubmit} css={styles.form}>
                            <div css={styles.pictureSection}>
                                <div css={styles.PicturesContainer}>
                                    <img
                                        src={picturePreview || 'placeholder-image-url'}
                                        alt="Room"
                                        css={styles.picture}
                                    />
                                    <div css={styles.cameraOverlay}>
                                        <FaCamera />
                                        <input
                                            type="file"
                                            name="image"
                                            onChange={handleChooseImage}
                                            css={styles.fileInput}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div css={styles.formGroup}>
                                <label><strong>Tên phòng:</strong></label>
                                <input
                                    type="text"
                                    name="name"
                                    value={updatedRoom.name}
                                    onChange={handleChange}
                                    css={styles.input}
                                />
                            </div>
                            <div css={styles.formGroup}>
                                <label><strong>Loại phòng:</strong></label>
                                <select
                                    name="room_type"
                                    value={updatedRoom.room_type}
                                    onChange={handleChange}
                                    css={styles.select}
                                >
                                    <option value="">Chọn loại phòng</option>
                                    {roomTypes.map((type) => (
                                        <option key={type.id} value={type.id}>{type.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div css={styles.popupActions}>
                                <button type="submit" css={styles.saveButton}>Lưu</button>
                                <button type="button" onClick={closeEditPopup} css={styles.cancelButton}>Hủy</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Popup */}
            {showAddPopup && (
                <div css={styles.popupOverlay}>
                    <div css={styles.popupContent}>
                        <h3 css={styles.popupTitle}>Thêm phòng</h3>
                        <form onSubmit={handleAddFormSubmit} css={styles.form}>
                            <div css={styles.pictureSection}>
                                <div css={styles.PicturesContainer}>
                                    <img
                                        src={picturePreview || 'placeholder-image-url'}
                                        alt="Room"
                                        css={styles.picture}
                                    />
                                    <div css={styles.cameraOverlay}>
                                        <FaCamera />
                                        <input
                                            type="file"
                                            name="image"
                                            onChange={handleChooseImage}
                                            css={styles.fileInput}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div css={styles.formGroup}>
                                <label><strong>Tên phòng:</strong></label>
                                <input
                                    type="text"
                                    name="name"
                                    value={newRoom.name}
                                    onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                                    css={styles.input}
                                />
                            </div>
                            <div css={styles.formGroup}>
                                <label><strong>Loại phòng:</strong></label>
                                <select
                                    name="room_type"
                                    value={newRoom.room_type}
                                    onChange={(e) => setNewRoom({ ...newRoom, room_type: e.target.value })}
                                    css={styles.select}
                                >
                                    <option value="">Chọn loại phòng</option>
                                    {roomTypes.map((type) => (
                                        <option key={type.id} value={type.id}>{type.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div css={styles.popupActions}>
                                <button type="submit" css={styles.saveButton}>Lưu</button>
                                <button type="button" onClick={closeAddPopup} css={styles.cancelButton}>Hủy</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

             {/* Delete Popup */}
             {showDeleteConfirm && (
    <div css={styles.popupOverlay}>
        <div css={styles.popupContent}>
            <h3 css={styles.popupTitle}>Xác nhận xóa phòng</h3>
            <p>Bạn có chắc chắn muốn xóa phòng này không?</p>
            <div css={styles.popupActions}>
                <button onClick={handleDeleteRoom} css={styles.saveButton}>Xóa</button>
                <button onClick={closeDeleteConfirm} css={styles.cancelButton}>Hủy</button>
            </div>
        </div>
    </div>
)}

        </section>
    );
};

const styles = {
    sectionContainer: css`
        padding: 10px;
    `,
    header: css`
        font-size: 2rem;
        margin-bottom: 20px;
    `,
    addButton: css`
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
    `,
    table: css`
        width: 100%;
        border-collapse: collapse;
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f4f4f4;
        }
    `,
    image: css`
      width: 120px;
      height: 75px;
      object-fit: cover;
      border-radius: 5px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: auto;
    `,

    editButton: css`
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
    `,
    deleteButton: css`
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
    `,
    popupOverlay: css`
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.6);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `,
    popupContent: css`
        background-color: #fff;
        padding: 20px;
        border-radius: 10px;
        width: 400px;
    `,
    popupTitle: css`
        font-size: 1.5rem;
        margin-bottom: 10px;
    `,
    pictureSection: css`
        display: flex;
        justify-content: center;
        margin-bottom: 10px;
    `,
    PicturesContainer: css`
        position: relative;
        width: 230px;
        height: 150px;
        &:hover img {
            filter: brightness(0.8);
        }
    `,
    picture: css`
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: filter 0.3s;
        border-radius: 10px;
    `,
    cameraOverlay: css`
        position: absolute;
        bottom: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.6);
        color: #fff;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
    `,
    fileInput: css`
        opacity: 0;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        cursor: pointer;
    `,
    form: css`
        display: flex;
        flex-direction: column;
    `,
    formGroup: css`
        margin-bottom: 15px;
    `,
    input: css`
        width: 100%;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 5px;
    `,
    select: css`
        width: 100%;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 5px;
    `,
    popupActions: css`
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
    `,
    saveButton: css`
        padding: 8px 15px;
        background-color: #28a745;
        color: #fff;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s;
        &:hover {
            background-color: #218838;
        }
    `,
    cancelButton: css`
        padding: 8px 15px;
        background-color: #6c757d;
        color: #fff;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s;
        &:hover {
            background-color: #5a6268;
          }
    `,

};

export default ExistingRooms;
