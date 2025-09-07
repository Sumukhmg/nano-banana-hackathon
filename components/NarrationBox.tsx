
import React, { useState } from 'react';

interface NarrationBoxProps {
    text: string;
    onTextChange: (newText: string) => void;
}

const NarrationBox: React.FC<NarrationBoxProps> = ({ text, onTextChange }) => {
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
                className="w-full bg-white text-black p-2 border-2 border-dashed border-black text-sm italic resize-none"
            />
        );
    }
    
    return (
        <div 
            onClick={() => setIsEditing(true)}
            className="self-end bg-white text-black p-2 m-1 border-2 border-dashed border-black max-w-[80%] cursor-pointer hover:bg-gray-100 transition"
        >
            <p className="text-sm italic">{text}</p>
        </div>
    );
};

export default NarrationBox;
