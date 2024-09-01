import React from "react"
import { Link } from "react-router-dom"

const Admin = () => {

	return (
		<section className="container mt-5">
			<h2>Welcome to Admin Panel</h2>
			<hr />
			<div className="btn-group">
				<Link to={"/existing-rooms"} className="btn">QL Phòng</Link>
				{/* <Link to={"/existing-roomTypes"} className="btn">QL Loại Phòng</Link>
				<Link to={"/existing-bookings"} className="btn">QL Đặt Phòng</Link>
				<Link to={"/existing-employees"} className="btn">QL Nhân Viên</Link> */}
			</div>
		</section>
	);

}

export default Admin