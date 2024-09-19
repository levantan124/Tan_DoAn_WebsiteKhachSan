import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CaptchaButton = () => {
    const [captchaToken, setCaptchaToken] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Tạo và thêm thẻ script vào DOM
        const script = document.createElement('script');
        script.src = 'https://www.google.com/recaptcha/api.js?render=6LfIuEEqAAAAAJ0blbtnwm1pQ_xddxWSLdKTCyMy';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        // Xử lý khi script được tải thành công
        script.onload = () => {
            console.log('reCAPTCHA script loaded successfully.');
            if (window.grecaptcha) {
                console.log('grecaptcha is available.');
            } else {
                setError('reCAPTCHA is not loaded.');
            }
        };

        // Xử lý khi có lỗi trong việc tải script
        script.onerror = () => {
            setError('Failed to load reCAPTCHA script.');
        };

        // Xóa thẻ script khi component bị gỡ bỏ
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const onLoadCaptcha = async () => {
        try {
            if (window.grecaptcha) {
                const token = await window.grecaptcha.execute();
                setCaptchaToken(token);

                const response = await axios.post('/accounts/verify-captcha/', {
                    'g-recaptcha-response': token,
                });

                if (response.data.success) {
                    // Xử lý khi CAPTCHA được xác minh thành công
                } else {
                    setError('Captcha verification failed.');
                }
            } else {
                setError('reCAPTCHA is not loaded.');
            }
        } catch (error) {
            setError('Error verifying CAPTCHA.');
        }
    };

    return (
        <div>
            <button onClick={onLoadCaptcha} type="button">Verify CAPTCHA</button>
            {error && <p>{error}</p>}
        </div>
    );
};

export default CaptchaButton;
