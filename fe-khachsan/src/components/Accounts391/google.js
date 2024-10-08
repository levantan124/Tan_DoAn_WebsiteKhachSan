/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { endpoints } from '../../configs391/API391';

const GoogleButton = () => {

    const handleGoogleLogin = async () => {
        const googleCallbackLogin = endpoints['googleCallbackLogin'];
        const redirectUri = encodeURIComponent(googleCallbackLogin);

        const clientId = '391738320330-jdk2bbm8gmlf682ih1a5tgqbhrd3k300.apps.googleusercontent.com';

        // Lấy URL frontend hiện tại để truyền qua backend
        const currentFrontendUrl = encodeURIComponent(window.location.origin);

        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=openid%20https://www.googleapis.com/auth/userinfo.email%20https://www.googleapis.com/auth/userinfo.profile&access_type=offline&prompt=select_account&state=${currentFrontendUrl}`;

        window.location.href = authUrl;
    };

    const inputSubmitStyles = css`
        border: none;
        background: #ff6347;
        color: #fff;
        height: 40px;
        border-radius: 20px;
        cursor: pointer;
        font-size: 16px;
        font-weight: bold;
        margin: 10px 0;
        width: 100%;
        max-width: 100%;

        &:hover {
            background: #e5533d;
        }
    `;

    return (
        <button type="button" onClick={handleGoogleLogin} css={inputSubmitStyles}>
            Google
        </button>
    );
};

export default GoogleButton;
