
import React, { useState } from 'react';

interface SpeechBubbleProps {
    character: string;
    text: string;
    onTextChange: (newText: string) => void;
}

const SpeechBubble: React.FC<SpeechBubbleProps> = ({ character, text, onTextChange }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editableText, setEditableText] = useState(text);

    const handleBlur = () => {
        setIsEditing(false);
        onTextChange(editableText);
    };

    if (isEditing) {
        return (
            <textarea
                value={editableText}
                onChange={(e) => setEditableText(e.target.value)}
                onBlur={handleBlur}
                autoFocus
                className="bg-white text-black p-2 border-2 border-black rounded-lg shadow-lg font-bold text-sm resize-none"
                style={{ fontFamily: "'Comic Sans MS', cursive, sans-serif" }}
            />
        );
    }

    return (
        <div 
            onClick={() => setIsEditing(true)}
            className="bg-white text-black p-2 m-1 border-2 border-black rounded-lg shadow-lg max-w-[60%] cursor-pointer hover:bg-gray-100 transition"
        >
            <p className="font-bold text-xs">{character}:</p>
            <p className="text-sm" style={{ fontFamily: "'Comic Sans MS', cursive, sans-serif" }}>
                {text}
            </p>
        </div>
    );
};

export default SpeechBubble;
