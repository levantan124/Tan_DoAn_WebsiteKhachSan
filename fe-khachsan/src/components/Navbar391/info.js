/** @jsxImportSource @emotion/react */
import { useContext, useState, useEffect } from "react";
import { MyUserContext } from "../../configs391/Context391";
import { FaCamera } from 'react-icons/fa';
import { css } from "@emotion/react";
import { authAPI, endpoints } from "../../configs391/API391";
import cookie from "react-cookies";

const Info = () => {
    const user = useContext(MyUserContext);

    const [editableUser, setEditableUser] = useState({
        name: user?.name || '',
        address: user?.address || '',
        phone: user?.phone || '',
        dob: user?.DOB || '',
        sex: user?.sex || 1,
    });

    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(user?.avatar ? `https://res.cloudinary.com/your-cloud-name/${user.avatar}` : 'placeholder-image-url');
    const [notification, setNotification] = useState({ type: '', message: '' });

    useEffect(() => {
        setEditableUser({
            name: user?.name || '',
            address: user?.address || '',
            phone: user?.phone || '',
            dob: user?.DOB || '',
            sex: user?.sex || 1,
        });
        setAvatarPreview(user?.avatar ? `https://res.cloudinary.com/vantan/${user.avatar}` : 'placeholder-image-url');
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditableUser(prev => ({ ...prev, [name]: value }));
    };

    const handleChooseAvatar = (e) => {
        const file = e.target.files[0];
        setAvatarFile(file);
        if (file) {
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            if (avatarFile) {
                formData.append('avatar', avatarFile);
            }
            formData.append('name', editableUser.name);
            formData.append('address', editableUser.address);
            formData.append('phone', editableUser.phone);
            formData.append('DOB', editableUser.dob);
            formData.append('sex', editableUser.sex);

            const res = await authAPI().patch(endpoints['current_user'], formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (res.status === 200) {
                let userdata = await authAPI().get(endpoints['current_user']);
                cookie.save('user', userdata.data);

                setNotification({ type: 'success', message: 'Cập nhật thông tin thành công' });
            } else {
                setNotification({ type: 'error', message: 'Cập nhật không thành công' });
            }
        } catch (error) {
            setNotification({ type: 'error', message: 'Cập nhật không thành công' });
        }
    };

    if (!user) {
        return <p>Vui lòng đăng nhập để xem thông tin của bạn.</p>;
    }

    return (
        <div css={styles.container}>
            <h1 css={styles.header}>Thông tin cá nhân</h1>
            {notification.message && (
                <div css={notification.type === 'success' ? styles.successAlert : styles.errorAlert}>
                    {notification.message}
                </div>
            )}
            <div css={styles.avatarSection}>
                <div css={styles.avatarContainer}>
                    <img
                        src={avatarPreview}
                        alt={`${user.name}'s avatar`}
                        css={styles.avatar}
                    />
                    <div css={styles.cameraOverlay}>
                        <FaCamera />
                        <input
                            type="file"
                            name="avatar"
                            onChange={handleChooseAvatar}
                            css={styles.fileInput}
                        />
                    </div>
                </div>
            </div>
            <form css={styles.infoSection} onSubmit={handleSubmit}>
                <div css={styles.formGroup}>
                    <label><strong>Tên:</strong></label>
                    <input
                        type="text"
                        name="name"
                        value={editableUser.name}
                        onChange={handleChange}
                        css={styles.input}
                    />
                </div>
                <div css={styles.formGroup}>
                    <label><strong>Tên đăng nhập:</strong></label>
                    <input
                        type="text"
                        value={user.username}
                        readOnly
                        css={styles.input}
                    />
                </div>
                <div css={styles.formGroup}>
                    <label><strong>Địa chỉ:</strong></label>
                    <input
                        type="text"
                        name="address"
                        value={editableUser.address}
                        onChange={handleChange}
                        css={styles.input}
                    />
                </div>
                <div css={styles.formGroup}>
                    <label><strong>Số điện thoại:</strong></label>
                    <input
                        type="text"
                        name="phone"
                        value={editableUser.phone}
                        onChange={handleChange}
                        css={styles.input}
                    />
                </div>
                <div css={styles.formGroup}>
                    <label><strong>Ngày sinh:</strong></label>
                    <input
                        type="date"
                        name="dob"
                        value={editableUser.dob}
                        onChange={handleChange}
                        css={styles.input}
                    />
                </div>
                <div css={styles.formGroup}>
                    <label><strong>Giới tính:</strong></label>
                    <select
                        name="sex"
                        value={editableUser.sex}
                        onChange={handleChange}
                        css={styles.select}
                    >
                        <option value={1}>Nam</option>
                        <option value={2}>Nữ</option>
                    </select>
                </div>
                <div css={styles.formGroup}>
                    <label><strong>Email:</strong></label>
                    <input
                        type="email"
                        value={user.email}
                        readOnly
                        css={styles.input}
                    />
                </div>
                <button type="submit" css={styles.button}>Cập nhật thông tin</button>
            </form>
        </div>
    );
};

const styles = {
    container: css`
        max-width: 500px;
        margin: 20px auto;
        padding: 20px;
        padding-top: 100px;
        background: #ffffff;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        text-align: center;
    `,
    header: css`
        font-size: 2rem;
        margin-bottom: 20px;
        color: #333;
        font-weight: 700;
        position: relative;
        &:before {
            content: '';
            position: absolute;
            width: 50px;
            height: 3px;
            background-color: #007BFF;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
        }
    `,
    avatarSection: css`
        display: flex;
        justify-content: center;
        margin-bottom: 20px;
    `,
    avatarContainer: css`
        position: relative;
        width: 150px;
        height: 150px;
        &:hover img {
            filter: brightness(0.8);
        }
    `,
    avatar: css`
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
        transition: filter 0.3s;
    `,
    cameraOverlay: css`
        position: absolute;
        bottom: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.6);
        color: #fff;
        border-radius: 50%;
        width: 40px;
        height: 40px;
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
    infoSection: css`
        display: flex;
        flex-direction: column;
        align-items: center;
    `,
    formGroup: css`
        width: 100%;
        margin-bottom: 15px;
        text-align: left;
    `,
    input: css`
        width: 100%;
        padding: 10px;
        font-size: 1rem;
        border: 1px solid #ddd;
        border-radius: 5px;
        &:focus {
            outline: none;
            border-color: #007BFF;
        }
    `,
    select: css`
        width: 100%;
        padding: 10px;
        font-size: 1rem;
        border: 1px solid #ddd;
        border-radius: 5px;
        &:focus {
            outline: none;
            border-color: #007BFF;
        }
    `,
    button: css`
        padding: 10px 20px;
        font-size: 1rem;
        border: none;
        border-radius: 5px;
        background-color: #007BFF;
        color: #fff;
        cursor: pointer;
        transition: background-color 0.3s;
        &:hover {
            background-color: #0056b3;
        }
    `,
    successAlert: css`
        background-color: #d4edda;
        color: #155724;
        padding: 10px;
        border-radius: 5px;
        margin-bottom: 20px;
    `,
    errorAlert: css`
        background-color: #f8d7da;
        color: #721c24;
        padding: 10px;
        border-radius: 5px;
        margin-bottom: 20px;
    `,
};

export default Info;
