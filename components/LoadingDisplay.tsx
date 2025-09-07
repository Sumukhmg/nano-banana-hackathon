
import React from 'react';

interface LoadingDisplayProps {
    message: string;
}

const LoadingSpinner: React.FC = () => (
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
);

const LoadingDisplay: React.FC<LoadingDisplayProps> = ({ message }) => {
    return (
        <div className="flex flex-col items-center justify-center text-center mt-12 p-4">
            <LoadingSpinner />
            <p className="text-xl text-gray-300 mt-6 font-semibold tracking-wide">{message}</p>
            <p className="text-gray-500 mt-2">Please wait, the AI is hard at work...</p>
        </div>
    );
};

export default LoadingDisplay;
