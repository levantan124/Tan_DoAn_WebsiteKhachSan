/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useEffect } from 'react';
import { authAPI, endpoints } from '../../../configs391/API391';
import { Link } from 'react-router-dom';

const ExistingAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const cloudinaryBaseUrl = 'https://res.cloudinary.com/vantan';

  // Fetch accounts
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await authAPI().get(endpoints.ac);
        setAccounts(response.data);
      } catch (error) {
        console.error("Failed to fetch accounts:", error);
      }
    };

    fetchAccounts();
  }, []);

  // Convert role number to role name
  const getRoleName = (role) => {
    switch (role) {
      case 1:
        return 'Admin';
      case 2:
        return 'Lễ tân';
      case 3:
        return 'Khách hàng';
      default:
        return 'Không xác định';
    }
  };

  // Convert gender to Vietnamese label (1: Nam, 2: Nữ)
  const getGenderLabel = (sex) => {
    return sex === 1 ? 'Nam' : sex === 2 ? 'Nữ' : 'Khác';
  };

  return (
    <section css={sectionContainerStyle}>
      <h2>Danh sách tài khoản</h2>
      <Link to="/add-account" css={addButtonStyle}>Thêm tài khoản</Link>
      <table css={tableStyle}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Avatar</th>
            <th>Tên</th>
            <th>Username</th>
            <th>Ngày sinh</th>
            <th>Địa chỉ</th>
            <th>Role</th>
            <th>Số điện thoại</th>
            <th>Giới tính</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => {
            const imageUrl = account.avatar ? `${cloudinaryBaseUrl}/${account.avatar}` : null;
            return (
              <tr key={account.id}>
                <td>{account.id}</td>
                <td>{imageUrl && <img src={imageUrl} alt={account.name} css={imageStyle} />}</td>
                <td>{account.name}</td>
                <td>{account.username}</td>
                <td>{account.DOB}</td>
                <td>{account.address}</td>
                <td>{getRoleName(account.role)}</td>
                <td>{account.phone}</td>
                <td>{getGenderLabel(account.sex)}</td>
                <td>
                  <Link to={`/edit-account/${account.id}`} css={editButtonStyle}>Chỉnh sửa</Link>
                  <button css={deleteButtonStyle}>Xóa</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
};

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

const imageStyle = css`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
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
  background-color: #007bff;
  color: #fff;
  border-radius: 0.25rem;
  text-decoration: none;
  font-size: 0.875rem;
  text-align: center;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const deleteButtonStyle = css`
  padding: 0.5rem 1rem;
  background-color: #dc3545;
  color: #fff;
  border: none;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #c82333;
  }
`;

export default ExistingAccounts;
