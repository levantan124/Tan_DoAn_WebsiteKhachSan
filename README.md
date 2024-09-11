# HỆ THỐNG QUẢN LÝ KHÁCH SẠN
## Cài Đặt và Sử Dụng
### Backend (Django API)

1. Clone repository:   
```
git clone https://github.com/levantan124/Tan_DoAn_WebsiteKhachSan.git
```

2. Tạo và kích hoạt môi trường ảo:
```
python3 -m venv env
source env/bin/activate
```

3. Cài đặt các thư viện cần thiết:
```
 pip install -r requirements.txt
```

4. Thiết lập cơ sở dữ liệu: Tạo mới cơ sở dữ liệu với tên là: hoteldb
>Cập nhật mật khẩu và user name csdl trong file setting.py

```
python3 manage.py migrate
```

5. Chạy server:
```
python3 manage.py runserver
```


### Frontend (ReactJs)

1. Cài đặt 
```
npm install react-scripts

```

2. Chạy chương trình
```
npm start
```
