import React from "react";
import loader from '../LoadingSpinner/images/loader.gif';
import './LoadingSpinner.css';


const LoadingSpinner = () => {
    return (
        <div className="loading-spinner">
            <div className="spinner-wrapper">
                <img src={loader} alt="Loading" className="spinner-image" />
            </div>
        </div>
    );
}

export default LoadingSpinner;
