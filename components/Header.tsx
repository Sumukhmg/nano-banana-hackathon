
import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="w-full text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                AI Manga Maker
            </h1>
            <p className="text-gray-400 mt-2 text-lg">Turn your stories into stunning manga pages.</p>
        </header>
    );
};

export default Header;
