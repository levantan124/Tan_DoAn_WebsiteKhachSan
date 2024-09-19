import React, {useEffect, useContext} from "react"  
import { useLocation, useNavigate } from "react-router-dom"
import cookie from "react-cookies";
import { MyDispatchContext } from '../../configs391/Context391';
import { authAPI,endpoints } from "../../configs391/API391"
import NavBar from "../Navbar391/navbar";
import Header from "../Main391/header";
import Popular from "../Main391/popular";
import Client from "../Main391/client";
import Reward from "../Main391/reward";
import Footer from "../Footer391/footer";


// import { useAuth } from "../auth/AuthProvider"
const Home = () => {
	const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useContext(MyDispatchContext);

    useEffect(() => {
        const fetchData = async () => {
            const queryParams = new URLSearchParams(window.location.search);
            const token = queryParams.get("token");
			const expires = new Date();
			expires.setDate(expires.getDate() + 7); // Token expires in 7 days
            if (token) {
                // Lưu token vào cookie với thời gian sống (expires) và đường dẫn (path)
				cookie.save("token", token);

                try {
                    // Yêu cầu thông tin người dùng từ API
                    let userdata = await authAPI(token).get(endpoints['current_user']);

                    // Lưu thông tin người dùng vào cookie
                    cookie.save('user', userdata.data);
                    // Cập nhật trạng thái người dùng trong Redux store
                    dispatch({
                        type: "login",
                        payload: userdata.data
                    });
                } catch (error) {
                    console.error("Lỗi khi lấy thông tin người dùng:", error);
                }

                // Sau khi lưu token, có thể xoá token khỏi URL để giữ sạch
                // queryParams.delete("token");
                window.history.replaceState(null, null, window.location.pathname);
				// window.history.replaceState(null, '', `${window.location.pathname}?${queryParams.toString()}`);
            } 
            // Điều hướng tới trang chủ
            navigate("/");
        };

        fetchData();
    }, [navigate, dispatch]);
	const message = location.state && location.state.message
	const currentUser = localStorage.getItem("userId")
	return (
		<section>
			{message && <p className="text-warning px-5">{message}</p>}
			{currentUser && (
				<h6 className="text-success text-center"> You are logged-In as {currentUser}</h6>
			)}
			<div className="container">
                <Header />
				<Popular />
				{/* <Client />
				<Reward /> */}
				<Footer />
			</div>
		</section>
	)
}

export default Home