/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useEffect } from 'react';
import { authAPI } from '../../configs391/API391';

const ServiceList391 = () => {
    const [services, setServices] = useState([]);
    const [loadingServices, setLoadingServices] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await authAPI().get('/services/');
                setServices(response.data);
                console.log('API response status:', response.status);
                console.log('API response data:', response.data);
            } catch (err) {
                setError('Failed to fetch services');
                console.error('Error fetching services:', err);
            } finally {
                setLoadingServices(false);
            }
        };

        fetchServices();
    }, []);

    if (loadingServices) {
        return <div>Loading services...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div css={styles}>
            <h1>Danh sách dịch vụ</h1>
            <div css={groupStyle}>
                <h2 css={groupTitleStyle}>Danh sách dịch vụ đang có</h2>
                <div css={cardContainerStyle}>
                    {services.map((service, index) => (
                        <div key={index} css={cardStyle}>
                            <div css={cardContentStyle}>
                                <p css={cardTitleStyle}>{service.name}</p>
                                <p css={cardTextStyle}>
                                    Giá: {parseFloat(service.price).toLocaleString()} VND
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const styles = css`
    padding: 40px;
    background-color: #f9f9f9;
    h1 {
        margin-bottom: 40px;
        text-align: center;
        font-size: 2rem;
        color: #333;
    }
`;

const groupStyle = css`
    margin-bottom: 40px;
    padding: 15px; /* Reduced padding */
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-width: 1200px; /* Reduced maximum width */
    margin: 0 auto; /* Center align the container */
`;

const groupTitleStyle = css`
    font-size: 1.75rem;
    color: #333;
    margin-bottom: 20px;
    border-bottom: 2px solid #007bff;
    padding-bottom: 10px;
`;

const cardContainerStyle = css`
    display: flex;
    flex-wrap: wrap;
    gap: 15px; /* Reduced gap */
    justify-content: center; /* Center align the cards */
`;

const cardStyle = css`
    width: 250px; /* Reduced width */
    height: 150px; /* Reduced height */
    background-color: #4158D0;
    background-image: linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%);
    border-radius: 8px; /* Reduced border radius */
    color: white;
    overflow: hidden;
    position: relative;
    transform-style: preserve-3d;
    perspective: 1000px;
    transition: all 0.5s cubic-bezier(0.23, 1, 0.320, 1);
    cursor: pointer;

    &:hover {
        transform: rotateY(10deg) rotateX(10deg) scale(1.05);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    }

    &:before,
    &:after {
        content: "";
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(transparent, rgba(0, 0, 0, 0.1));
        transition: transform 0.5s cubic-bezier(0.23, 1, 0.320, 1);
        z-index: 1;
    }

    &:before {
        left: 0;
    }

    &:hover:before {
        transform: translateX(-100%);
    }

    &:after {
        right: 0;
    }

    &:hover:after {
        transform: translateX(100%);
    }
`;

const cardContentStyle = css`
    padding: 15px; /* Reduced padding */
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;
    color: white;
    align-items: center;
    justify-content: center;
    text-align: center;
    height: 100%;
`;

const cardTitleStyle = css`
    font-size: 1.25rem; /* Reduced font size */
    font-weight: 700;
    text-transform: uppercase;
    color: inherit;
`;

const cardTextStyle = css`
    color: inherit;
    opacity: 0.8;
    font-size: 0.9rem; /* Reduced font size */
`;

export default ServiceList391;
