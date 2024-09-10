import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
// import { useUser } from '../../configs391/Context391';
import APIs, { endpoints, authAPI2 } from '../../configs391/API391';
import cookie from 'react-cookies';


const GoogleButton = () => {
    // const navigate = useNavigate();
    // const { loginWithToken } = useUser();
    const nav = useNavigate();


    // const handleLoginSuccess = async (response) => {
    //     try {
    //         console.log('Google login response:', response);
    //         const { credential } = response.credential;
    //         if (!credential) {
    //             throw new Error('Không tìm thấy mã xác thực trong phản hồi từ Google');
    //         }
    //         const res = await APIs.post(endpoints['login-google'], {
    //             id_token: credential
    //         });
    //         console.log(res)
    //         const { user, token, created } = res.data;
    //         // loginWithToken(token);
    //         // let resp = await APIs.post(endpoints['login'], new URLSearchParams({
    //         //     'username': res.user.username,
    //         //     'password': password,
    //         //     'client_id': '5j5685BlfLjZ1SZ50c59oM6C57M2lQnhMXmK9b7e',
    //         //     'client_secret': 'kQW8noCmtlgt1r0S9NsNAgpMmERDJDlbVbplYBvKWepg6kQOE4GWH3zaE9go6tGndYFVafZy7ApxisTieYurUGQuGxwfduM50YK8Q1l9fiUj3bPRcVcdF6cUOBhXhhp9',
    //         //     'grant_type': 'password',
    //         //   }), {
    //         //     headers: {
    //         //       'Content-Type': 'application/x-www-form-urlencoded',
    //         //     }
    //         //   });
        
    //           if (res.status === 200) {
    //             cookie.save('token', token);
    //             let userdata = await authAPI().get(endpoints['current_user'], token);
    //             cookie.save('user', userdata.data);
        
    //             // Redirect based on role
    //             if (userdata.data.role === 2) {
    //               nav('/staff');
    //             } else if (userdata.data.role === 1) {
    //               nav('/admin');
    //             } else {
    //               nav('/');
    //             }
    //         }
    //     }catch (error) {
    //         console.error('Login failed:', error);
    //         alert(`Đăng nhập thất bại. Vui lòng kiểm tra thông tin và thử lại.\nDetails: ${error.message}`);
    //     }
    // };

    const handleLoginSuccess = async (response) => {
        try {
            // Kiểm tra cấu trúc của đối tượng response
            console.log('Google login response:', response);
            const credential = response.credential;
            if (!credential) {
                throw new Error('Không tìm thấy mã xác thực trong phản hồi từ Google');
            }
    
            const res = await APIs.post(endpoints['login-google'], {
                id_token: credential
            });
    
            console.log(res);
            const { user, token, created } = res.data;
            console.log(token.access_token)

            if (res.status === 200) {
                cookie.save('token', token.access_token);
                let userdata = await authAPI2(token.access_token).get(endpoints['current_user']);
                cookie.save('user', userdata.data);
    
                // Redirect based on role
                if (userdata.data.role === 2) {
                    nav('/staff');
                } else if (userdata.data.role === 1) {
                    nav('/admin');
                } else {
                    nav('/');
                }
            }
        } catch (error) {
            console.error('Login failed:', error);
            alert(`Đăng nhập thất bại. Vui lòng kiểm tra thông tin và thử lại.\nDetails: ${error.message}`);
        }
    };
    
    const handleLoginFailure = (error) => {
        console.error('Login failed:', error);
        alert("Google login failed");
    };

    return (
        <GoogleOAuthProvider clientId='391738320330-6qn6mo8tras1b4uqa9bbuehmjip44lir.apps.googleusercontent.com'>
            <GoogleLogin
                onSuccess={handleLoginSuccess}
                onFailure={handleLoginFailure}
                shape="circle"
                size="large"
                theme="filled_black"
                text="signin_with"
                width="400"
            />
        </GoogleOAuthProvider>
    );
};

export default GoogleButton;
