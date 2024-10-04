// import React, { useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom';


// const PaymentResult = () => {
//     const location = useLocation();

//     const [paymentResult, setPaymentResult] = useState(null);

//     useEffect(() => {
//         const queryParams = new URLSearchParams(location.search);
        
//         const result = queryParams.get('vnp_TransactionStatus');

//         if (result) {
//             const isSuccess = result === '00';
//             setPaymentResult({
//                 title: result === '00' ? "Payment Success" : "Payment Failure",
//                 result: result === '00' ? "Success" : "Failed",
//                 orderId: queryParams.get('vnp_TxnRef'),
//                 amount: queryParams.get('vnp_Amount'),
//                 orderDesc: queryParams.get('vnp_OrderInfo'),
//                 vnpTransactionNo: queryParams.get('vnp_TransactionNo'),
//                 vnpResponseCode: queryParams.get('vnp_ResponseCode'),
//                 msg: queryParams.get('vnp_Message') || "No message provided"
//             });

            
//         }
//     }, [location.search]);

//     return (
//         <div className="container" style={{marginTop:"100px", padding:"20px", maxWidth:"500px"}}>
//             {paymentResult ? (
//                 <div>
//                     <h3>{paymentResult.title}</h3>
//                     <div className="payment-result-details">
//                         <p><strong>Transaction Result:</strong> {paymentResult.result}</p>
//                         <p><strong>Order ID:</strong> {paymentResult.orderId}</p>
//                         <p><strong>Amount:</strong> {paymentResult.amount} VND</p>
//                         <p><strong>Order Description:</strong> {paymentResult.orderDesc}</p>
//                         <p><strong>VNPay Transaction No:</strong> {paymentResult.vnpTransactionNo}</p>
//                         <p><strong>VNPay Response Code:</strong> {paymentResult.vnpResponseCode}</p>
//                         <p><strong>Message:</strong> {paymentResult.msg}</p>
//                         <p><strong>VUI LÒNG CHỤP LẠI ĐẾN QUẦY LỄ TÂN XÁC NHẬN ĐÃ THANH TOÁN</strong></p>
//                     </div>
//                 </div>
//             ) : (
//                 <p>Loading payment result...</p>
//             )}
//         </div>
//     );
// };

// export default PaymentResult;

/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { css } from '@emotion/react';

const PaymentResult = () => {
    const location = useLocation();
    const [paymentResult, setPaymentResult] = useState(null);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
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
                msg: queryParams.get('vnp_Message') || "No message provided",
            });
        }
    }, [location.search]);

    return (
        <div css={containerStyle}>
            {paymentResult ? (
                <div css={resultContainerStyle}>
                    <h1 css={titleStyle}>{paymentResult.title}</h1>
                    <div css={resultDetailsStyle}>
                        <p><strong>Transaction Result:</strong> {paymentResult.result}</p>
                        <p><strong>Order ID:</strong> {paymentResult.orderId}</p>
                        <p><strong>Amount:</strong> {paymentResult.amount} VND</p>
                        <p><strong>Order Description:</strong> {paymentResult.orderDesc}</p>
                        <p><strong>VNPay Transaction No:</strong> {paymentResult.vnpTransactionNo}</p>
                        <p><strong>VNPay Response Code:</strong> {paymentResult.vnpResponseCode}</p>
                        <p><strong>Message:</strong> {paymentResult.msg}</p>
                        <p css={importantMessageStyle}><strong>Vui lòng chụp lại đến quầy lễ tân để xác nhận thanh toán.</strong></p>
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
  width: 600px;
  background-color: #fafafa;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-radius: 24px;
  padding: 50px;
  margin: 50px auto;
  text-align: center;
`;

const resultContainerStyle = css`
  margin-top: 20px;
`;

const titleStyle = css`
  font-size: 24px;
  color: #fa5b30;
  background: linear-gradient(to right, #fa5b30, #3e8e41);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 30px;
`;

const resultDetailsStyle = css`
  font-size: 18px;
  color: #555;
  text-align: left;

  p {
    margin: 10px 0;
    padding: 8px;
    background-color: #f4f4f4;
    border-radius: 8px;
  }
`;

const importantMessageStyle = css`
  font-weight: bold;
  background-color: #fffbe6;
  color: #f39c12;
  border: 1px solid #f39c12;
  padding: 10px;
  border-radius: 8px;
  margin-top: 20px;
`;

const loadingStyle = css`
  font-size: 20px;
  color: #888;
`;

export default PaymentResult;
