import axios from "axios";
import moment from "moment";
import cookie from "react-cookies";

export const BASE_URL = 'http://127.0.0.1:8000/';

export const formatNS = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
};

export const formatDate = (date) => {
    return moment(date).format(' HH:mm - DD/MM/YYYY');
};

export const endpoints = {
    'login': '/o/token/',
    'current_user': '/accounts/current-user/',
    'ac': '/accounts/',
    'rt': '/roomtypes/',
    'r': '/rooms/',
    'rp': (id) => `/room-images/${id}/`,

    
    // 'signup': '/accounts/',
    // 'list_reservations' : '/reservations/',
    // 'deactivate_reservation': (id) => `/reservations/${id}/deactivate/`, // Thêm hàm cho deactivate với tham số id
    // 'update_reservation': (id) => `/reservations/${id}/`, // Update reservation endpoint
    // 'roomtypes': '/roomtypes/',
    // 'reservation_service' : '/reservation_services/',
    // 'services_of_reservation': (id) => `/reservations/${id}/services/`,
    // 'services' : '/services/',
    // 'deactive_service': (id) => `/reservation_services/${id}/`, 
    // 'bills' : '/bills/'

};


// Hàm tạo instance axios với Authorization header
export const authAPI = () => {
    const token = cookie.load('token');
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            'Authorization': `Bearer ${token}`,
            // "Content-Type": `Application/json`
        }
    });
};

// Hàm tạo instance axios không có Authorization header
export const  api = axios.create({
    baseURL: BASE_URL
});

// // Hàm gửi yêu cầu đặt phòng
// export const createReservation = async (reservationData) => {
//     try {
//         // console.log(reservationData);
//         const response = await authAPI().post(endpoints.reservations, reservationData);
//         return response; // Return the entire response object
//     } catch (error) {
//         console.error('Failed to create reservation:', error);
//         throw error; 
//     }
// };


export default api;
