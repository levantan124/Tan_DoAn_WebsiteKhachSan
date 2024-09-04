/** @jsxImportSource @emotion/react */
import React, { useState } from "react";
import { css } from "@emotion/react";
import { useNavigate } from "react-router-dom";

function Admin() {
	const [selected, setSelected] = useState("");
	const navigate = useNavigate();

	const handleClick = (path) => {
		setSelected(path);
		navigate(path);
	};

	return (
		<section css={containerStyle}>
			<h2 css={titleStyle}>Welcome to Admin Panel</h2>
			<hr css={dividerStyle} />
			<div css={btnGroupStyle}>
				{[
					{ label: "QL Phòng", path: "/existing-rooms" },
					{ label: "QL Loại Phòng", path: "/existing-roomtypes" },
					{ label: "QL Dịch Vụ", path: "/existing-services" },
					{ label: "QL Tài khoản", path: "/existing-accounts" },
          { label: "QL Phiếu Đặt Phòng", path: "/existing-reservations" }
				].map((option) => (
					<button
						key={option.label}
						css={btnStyle(selected === option.path)}
						onClick={() => handleClick(option.path)}
					>
						{option.label}
					</button>
				))}
			</div>
		</section>
	);
}

const containerStyle = css`
  max-width: 1000px;
  margin: 9rem auto;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const titleStyle = css`
  font-size: 2rem;
  color: #333;
  margin-bottom: 1.5rem;
`;

const dividerStyle = css`
  margin-bottom: 2rem;
  border: none;
  height: 1px;
  background-color: #ddd;
`;

const btnGroupStyle = css`
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const btnStyle = (isActive) => css`
  position: relative;
  padding: 0.75rem 1.5rem;
  background-color: ${isActive ? "#e8e8e8" : "#70c489"};
  color: ${isActive ? "#1d1d29" : "#fff"};
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.15s ease-in-out, color 0.15s ease-in-out;

  &:hover {
    background-color: ${isActive ? "#d0d0d0" : "#5aaf73"};
    color: ${isActive ? "#333" : "#fff"};
  }
`;

export default Admin;