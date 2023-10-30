import React from 'react';

const AboutUs = () => {
    return (
        <div className="bg-white text-white min-h-screen flex flex-col justify-center items-center">
            <div className="bg-red-500 p-4 rounded-md">
                <h1 className="text-3xl font-bold">About Us</h1>
            </div>
            <div className="bg-black text-black p-4 mt-4 rounded-md text-white">
                <p className="text-lg">
                    Welcome to our company! We are a team of dedicated professionals working together to provide high-quality services and products.
                </p>
                <p className="text-lg">
                    Our core values are reflected in our commitment to excellence, innovation, and customer satisfaction.
                </p>
            </div>
        </div>
    );
};

export default AboutUs;
