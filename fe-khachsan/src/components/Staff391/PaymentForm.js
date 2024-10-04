/** @jsxImportSource @emotion/react */
import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from "react-router-dom";
import api from '../../configs391/API391';
import Cookies from 'react-cookies';
import PaymentResult from './PaymentResult';
import { MyUserContext } from '../../configs391/Context391';
import { css } from '@emotion/react';

const PaymentForm = () => {
    const [paymentResult, setPaymentResult] = useState(null);
    const location = useLocation();
    const user = useContext(MyUserContext);

    const { booking, payment } = location.state || {};
    const [formData, setFormData] = useState({
        order_type: 'topup',
        order_id: new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14),
        amount: payment || 10000,
        order_desc: `Thanh toan don dat phong ${booking.id} thoi gian: ${new Date().toLocaleString()}`,
        bank_code: '',
        language: 'vn',
        reservation: booking.id,
        user: user.id,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const csrftoken = Cookies.load('csrftoken');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/payments/create_payment/', formData, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken
                }
            });

            if (response) {
                window.open(response.data.payment_url,'_blank');
            } else {
                console.error('Payment URL is not available in response.');
            }
        } catch (error) {
            console.error('Error submitting payment form:', error);
        }
    };

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const result = queryParams.get('vnp_TransactionStatus');
        if (result) {
            const isSuccess = result === '00';
            setPaymentResult({
                title: isSuccess ? "Payment Success" : "Payment Failure",
                result: isSuccess ? "Success" : "Failed",
                orderId: queryParams.get('vnp_TxnRef'),
                amount: queryParams.get('vnp_Amount'),
                orderDesc: queryParams.get('vnp_OrderInfo'),
                vnpTransactionNo: queryParams.get('vnp_TransactionNo'),
                vnpResponseCode: queryParams.get('vnp_ResponseCode'),
                msg: queryParams.get('vnp_Message') || "No message provided"
            });
        }
    }, [location.search]);

    return (
        <div css={containerStyle}>
            <img src="/path/to/vnpay-logo.png" alt="VNPAY Logo" css={logoStyle} />
            <h3>Thanh toán VNPAY</h3>
            <form onSubmit={handleSubmit}>
                <div css={formGroupStyle}>
                    <label htmlFor="booking_id">Mã xác nhận</label>
                    <input
                        css={inputStyle}
                        id="booking_id"
                        name="booking_id"
                        type="text"
                        value={booking.id}
                        onChange={handleChange}
                        readOnly
                    />
                </div>
                <div css={formGroupStyle}>
                    <label htmlFor="order_type">Loại giao dịch</label>
                    <select
                        name="order_type"
                        id="order_type"
                        css={inputStyle}
                        value={formData.order_type}
                        onChange={handleChange}
                    >
                        <option value="billpayment">Thanh toán hóa đơn</option>
                        <option value="other">Khác - Xem thêm tại VNPAY</option>
                    </select>
                </div>
                <div css={formGroupStyle}>
                    <label htmlFor="order_id">Mã đơn hàng</label>
                    <input
                        css={inputStyle}
                        id="order_id"
                        name="order_id"
                        type="text"
                        value={formData.order_id}
                        onChange={handleChange}
                    />
                </div>
                <div css={formGroupStyle}>
                    <label htmlFor="amount">Số tiền</label>
                    <input
                        css={inputStyle}
                        id="amount"
                        name="amount"
                        type="number"
                        value={formData.amount}
                        onChange={handleChange}
                    />
                </div>
                <div css={formGroupStyle}>
                    <label htmlFor="order_desc">Nội dung thanh toán</label>
                    <textarea
                        css={inputStyle}
                        id="order_desc"
                        name="order_desc"
                        rows="2"
                        value={formData.order_desc}
                        onChange={handleChange}
                    />
                </div>
                <div css={formGroupStyle}>
                    <label htmlFor="bank_code">Ngân hàng</label>
                    <select
                        name="bank_code"
                        id="bank_code"
                        css={inputStyle}
                        value={formData.bank_code}
                        onChange={handleChange}
                    >
                        <option value="">Không chọn</option>
                        <option value="NCB">Ngân hàng NCB</option>
                        <option value="AGRIBANK">Ngân hàng Agribank</option>
                        <option value="SCB">Ngân hàng SCB</option>
                        <option value="SACOMBANK">Ngân hàng SacomBank</option>
                        <option value="EXIMBANK">Ngân hàng EximBank</option>
                        <option value="MSBANK">Ngân hàng MSBANK</option>
                        <option value="NAMABANK">Ngân hàng NamABank</option>
                        <option value="VNMART">Ví điện tử VnMart</option>
                        <option value="VIETINBANK">Ngân hàng Vietinbank</option>
                        <option value="VIETCOMBANK">Ngân hàng VCB</option>
                        <option value="HDBANK">Ngân hàng HDBank</option>
                        <option value="DONGABANK">Ngân hàng Dong A</option>
                        <option value="TPBANK">Ngân hàng TPBank</option>
                        <option value="OJB">Ngân hàng OceanBank</option>
                        <option value="BIDV">Ngân hàng BIDV</option>
                        <option value="TECHCOMBANK">Ngân hàng Techcombank</option>
                        <option value="VPBANK">Ngân hàng VPBank</option>
                        <option value="MBBANK">Ngân hàng MBBank</option>
                        <option value="ACB">Ngân hàng ACB</option>
                        <option value="OCB">Ngân hàng OCB</option>
                        <option value="IVB">Ngân hàng IVB</option>
                        <option value="VISA">Thanh toán qua VISA/MASTER</option>
                    </select>
                </div>
                <div css={formGroupStyle}>
                    <label htmlFor="language">Ngôn ngữ</label>
                    <select
                        name="language"
                        id="language"
                        css={inputStyle}
                        value={formData.language}
                        onChange={handleChange}
                    >
                        <option value="vn">Tiếng Việt</option>
                        <option value="en">English</option>
                    </select>
                </div>
                <button type="submit" css={buttonStyle}>Thanh toán</button>
            </form>
            {paymentResult && (
                <PaymentResult
                    title={paymentResult.title}
                    result={paymentResult.result}
                    orderId={paymentResult.orderId}
                    amount={paymentResult.amount}
                    orderDesc={paymentResult.orderDesc}
                    vnpTransactionNo={paymentResult.vnpTransactionNo}
                    vnpResponseCode={paymentResult.vnpResponseCode}
                    msg={paymentResult.msg}
                />
            )}
        </div>
    );
};

const containerStyle = css`
  width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const logoStyle = css`
  display: block;
  margin: 0 auto 20px;
  width: 150px; /* Thay đổi kích thước logo nếu cần */
`;

const formGroupStyle = css`
  margin-bottom: 15px;
`;

const inputStyle = css`
  width: 100%;
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 16px;

  &:focus {
    border-color: #007bff;
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

const buttonStyle = css`
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

export default PaymentForm;
