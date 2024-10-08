/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { css } from '@emotion/react';
import api from '../../configs391/API391'; // Import your API module
import Cookies from 'react-cookies';

const PaymentResult = ({ 
    title, 
    result, 
    orderId, 
    amount, 
    orderDesc, 
    vnpTransactionNo, 
    vnpResponseCode, 
    msg, 
    bookingId // Accept bookingId as a prop
}) => {
    const location = useLocation();
    const [paymentResult, setPaymentResult] = useState(null);
    const csrftoken = Cookies.load('csrftoken'); // Load CSRF token

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const transactionStatus = queryParams.get('vnp_TransactionStatus');

        if (transactionStatus) {
            const isSuccess = transactionStatus === '00';
            setPaymentResult({
                title: isSuccess ? "Payment Successful" : "Payment Failed",
                result: isSuccess ? "Success" : "Failed",
                orderId: queryParams.get('vnp_TxnRef'),
                amount: queryParams.get('vnp_Amount'),
                orderDesc: queryParams.get('vnp_OrderInfo'),
                vnpTransactionNo: queryParams.get('vnp_TransactionNo'),
                vnpResponseCode: queryParams.get('vnp_ResponseCode'),
                msg: queryParams.get('vnp_Message') || "No message provided",
            });

            // Update booking status if payment is successful
            if (isSuccess) {
                updateBookingStatus(queryParams.get('vnp_OrderInfo')); // Use orderDesc for the API call
            }
        }
    }, [location.search]);

    const updateBookingStatus = async (orderDesc) => {
        try {
            const url = `/bills/${orderDesc}/change-status/`; // Construct the URL using orderDesc
            const response = await api.post(url, {
                status: 'paid' // Set the status to 'paid'
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken
                }
            });

            if (response) {
                console.log('Booking status updated successfully:', response.data);
            } else {
                console.error('Failed to update booking status.');
            }
        } catch (error) {
            console.error('Error updating booking status:', error);
        }
    };

    return (
        <div css={containerStyle}>
            {paymentResult ? (
                <div css={resultContainerStyle}>
                    <h1 css={titleStyle}>{title}</h1>
                    <div css={resultDetailsStyle}>
                        <p><strong>Transaction Result:</strong> {result}</p>
                        <p><strong>Order ID:</strong> {orderId}</p>
                        <p><strong>Amount:</strong> {amount} VND</p>
                        <p><strong>Order Description:</strong> {orderDesc}</p>
                        <p><strong>VNPay Transaction No:</strong> {vnpTransactionNo}</p>
                        <p><strong>VNPay Response Code:</strong> {vnpResponseCode}</p>
                        <p><strong>Message:</strong> {msg}</p>
                        <p css={importantMessageStyle}><strong>Vui lòng chụp lại đến quầy lễ tân để xác nhận thanh toán.</strong></p>
                        <p><strong>Booking ID:</strong> {bookingId}</p> {/* Display bookingId */}
                    </div>
                </div>
            ) : (
                <p css={loadingStyle}>Loading payment result...</p>
            )}
        </div>
    );
};

// Emotion CSS styles
const containerStyle = css`
  max-width: 600px;
  margin: 50px auto;
  padding: 40px;
  border-radius: 16px;
  background: linear-gradient(to right, #ffffff, #f8f9fa);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const resultContainerStyle = css`
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #dee2e6;
  border-radius: 12px;
  background-color: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const titleStyle = css`
  font-size: 28px;
  color: #28a745;
  margin-bottom: 15px;
`;

const resultDetailsStyle = css`
  font-size: 16px;
  color: #343a40;
  text-align: left;

  p {
    margin: 12px 0;
    padding: 10px;
    background-color: #e9ecef;
    border-radius: 8px;
    transition: background-color 0.3s ease;
    
    &:hover {
      background-color: #dee2e6;
    }
  }
`;

const importantMessageStyle = css`
  font-weight: bold;
  background-color: #fff3cd;
  color: #856404;
  border: 1px solid #ffeeba;
  padding: 12px;
  border-radius: 8px;
  margin-top: 20px;
`;

const loadingStyle = css`
  font-size: 18px;
  color: #6c757d;
`;

export default PaymentResult;
