import React, { useState } from "react";
import styled from "styled-components";

const PayContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: white;
  
  #webcrumbs {
    width: 1000px;
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    gap: 1.5rem;
    padding: 1.5rem;
    position: relative;
  }
`;

const LeftSection = styled.div`
  width: 350px;
  background-color: #f9fafb;
  border-radius: 0.375rem;
  padding: 1.5rem;

  div > p:first-of-type {
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 0.1rem;
  }

  div > p:nth-of-type(2) {
    font-size: inherit;
    color: inherit;
    margin-top: 0;
  }
`;

const RightSection = styled.div`
  width: 600px;
  background-color: #f9fafb;
  border-radius: 0.375rem;
  padding: 1.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: white;
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.375rem;
  cursor: pointer;
`;

const CancelButton = styled(Button)`
  background-color: #d1d5db;
  color: black;
`;

const ContinueButton = styled(Button)`
  background-color: #3b82f6;
  color: white;
`;

const ButtonGroup = styled.div`
  padding-top: 2rem;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
`;

const Pay = () => {
  const [expiryDate, setExpiryDate] = useState("");
  const [cardHolder, setCardHolder] = useState("");

  // Handle expiry date formatting
  const handleExpiryDateChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
    if (value.length >= 3) {
      value = value.substring(0, 2) + "/" + value.substring(2, 4); // Insert '/' after MM
    }
    setExpiryDate(value);
  };

  // Handle cardholder input - convert to uppercase and remove accents
  const handleCardHolderChange = (e) => {
    let value = e.target.value
      .toUpperCase() // Convert to uppercase
      .normalize("NFD") // Normalize the string to decompose accentuated characters
      .replace(/[\u0300-\u036f]/g, ""); // Remove diacritical marks (accents)
    
    setCardHolder(value);
  };

  return (
    <PayContainer>
      <div id="webcrumbs">
        <LeftSection>
          <h3 className="font-title mb-6">Thông tin đơn hàng</h3>
          <div className="mb-4">
            <p className="mb-1">Số tiền thanh toán</p>
            <p className="text-2xl text-blue-600 font-bold">
              10.000<span className="text-sm align-top">VND</span>
            </p>
          </div>

          <div className="mb-4">
            <p className="mb-1">Giá trị đơn hàng</p>
            <p className="text-xl font-bold">
              10.000<span className="text-sm align-top">VND</span>
            </p>
          </div>

          <div className="mb-4">
            <p className="mb-1">Phí giao dịch</p>
            <p>0<span className="text-sm align-top">VND</span></p>
          </div>

          <div className="mb-4">
            <p className="mb-1">Mã đơn hàng</p>
            <p>9737</p>
          </div>

          <div>
            <p className="mb-1">Nhà cung cấp</p>
            <p>VNPAY - TryItNow</p>
          </div>
        </LeftSection>

        <RightSection>
          <div className="mb-4">
            <h3 className="font-title">Thanh toán qua Ngân hàng</h3>
            <Select>
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
            </Select>
          </div>

          <hr className="border-t-2 border-blue-600 mb-6" />

          <div className="mb-4">
            <label htmlFor="cardNumber" className="block mb-1">Số thẻ</label>
            <div className="relative">
                <Input 
                id="cardNumber" 
                type="text" 
                inputMode="numeric" 
                placeholder="Nhập số thẻ" 
                onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')} // Only allow digits
                />
            </div>
            </div>


          <div className="mb-4">
            <label htmlFor="cardHolder" className="block mb-1">Tên chủ thẻ</label>
            <Input
              id="cardHolder"
              type="text"
              placeholder="Nhập tên chủ thẻ (không dấu)"
              value={cardHolder}
              onChange={handleCardHolderChange}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="expiryDate" className="block mb-1">
              Ngày phát hành
            </label>
            <Input
              id="expiryDate"
              type="text"
              placeholder="MM/YY"
              maxLength="5"
              value={expiryDate}
              onChange={handleExpiryDateChange}
            />
            </div>

          <div className="flex justify-between items-center mb-4">
            <a href="#" className="text-blue-600">Điều kiện sử dụng dịch vụ</a>
          </div>

          <ButtonGroup>
            <CancelButton>Hủy thanh toán</CancelButton>
            <ContinueButton>Tiếp tục</ContinueButton>
          </ButtonGroup>
        </RightSection>
      </div>
    </PayContainer>
  );
};

export default Pay;
