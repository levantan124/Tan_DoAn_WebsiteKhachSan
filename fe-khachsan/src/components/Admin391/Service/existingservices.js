/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useEffect } from 'react';
import { authAPI, endpoints } from '../../../configs391/API391';
import { Link } from 'react-router-dom';

const ExistingServices = () => {
  const [services, setServices] = useState([]);

  // Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await authAPI().get(`/services/`);
        setServices(response.data);
      } catch (error) {
        console.error("Failed to fetch services:", error);
      }
    };

    fetchServices();
  }, []);

  return (
    <section css={sectionContainerStyle}>
      <h2>Danh sách dịch vụ</h2>
      <Link to="/add-service" css={addButtonStyle}>Thêm dịch vụ</Link>
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
                <Link to={`/edit-service/${service.id}`} css={editButtonStyle}>Chỉnh sửa</Link>
                <button css={deleteButtonStyle}>Xóa</button>
              </td>
            </tr>
          ))}
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

export default ExistingServices;
