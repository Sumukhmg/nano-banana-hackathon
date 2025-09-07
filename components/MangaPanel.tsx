
import React from 'react';
import { Panel } from '../types';
import SpeechBubble from './SpeechBubble';
import NarrationBox from './NarrationBox';

interface MangaPanelProps {
    panel: Panel;
    onTextUpdate: (type: 'dialogue' | 'narration', newText: string, dialogueIndex?: number) => void;
}

const PanelSpinner: React.FC = () => (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-70">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
    </div>
);


const MangaPanel: React.FC<MangaPanelProps> = ({ panel, onTextUpdate }) => {
    return (
        <div className="relative w-full h-full bg-gray-200 border-2 border-black overflow-hidden">
            {panel.imageUrl ? (
                <img src={`data:image/png;base64,${panel.imageUrl}`} alt={panel.description} className="w-full h-full object-cover" />
            ) : (
                <PanelSpinner />
            )}
            <div className="absolute inset-0 p-2 flex flex-col flex-wrap justify-between">
                {panel.dialogue.map((dialogue, index) => (
                    <SpeechBubble 
                        key={index} 
                        character={dialogue.character} 
                        text={dialogue.text} 
                        onTextChange={(newText) => onTextUpdate('dialogue', newText, index)}
                    />
                ))}
                {panel.narration && (
                     <NarrationBox 
                        text={panel.narration} 
                        onTextChange={(newText) => onTextUpdate('narration', newText)}
                     />
                )}
            </div>
        </div>
    );
};

export default MangaPanel;
