import React, { useState, useRef } from 'react';
import { MangaData } from '../types';
import MangaPage from './MangaPage';
import ExportControls from './ExportControls';
import Icon from './Icon';

interface MangaPreviewProps {
    mangaData: MangaData;
    updatePanelText: (pageId: string, panelId: string, newText: string, type: 'dialogue' | 'narration', dialogueIndex?: number) => void;
}

const MangaPreview: React.FC<MangaPreviewProps> = ({ mangaData, updatePanelText }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const mangaPagesRef = useRef<(HTMLDivElement | null)[]>([]);

    const goToNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, mangaData.pages.length - 1));
    };

    const goToPrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 0));
    };
    
    return (
        <div className="w-full mt-8 flex flex-col items-center">
            <h2 className="text-3xl font-bold mb-4 text-center">{mangaData.title}</h2>
            
            <div className="w-full max-w-4xl relative">
                {/* Book Container */}
                <div className="aspect-[2/1.414] w-full relative">
                    {mangaData.pages.map((page, index) => (
                        <div
                            key={page.id}
                            className={`absolute w-full h-full transition-transform duration-700 ease-in-out ${currentPage === index ? 'translate-x-0 opacity-100 z-10' : currentPage > index ? '-translate-x-full opacity-0 z-0' : 'translate-x-full opacity-0 z-0'}`}
                        >
                            <MangaPage 
                                // FIX: Corrected the ref callback to have a void return type, resolving the TypeScript error. The arrow function body is wrapped in curly braces to prevent returning the result of the assignment.
                                ref={el => { mangaPagesRef.current[index] = el; }}
                                page={page} 
                                updatePanelText={updatePanelText} 
                            />
                        </div>
                    ))}
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center mt-4 px-2">
                    <button
                        onClick={goToPrevPage}
                        disabled={currentPage === 0}
                        className="px-4 py-2 bg-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-600 transition"
                    >
                       <Icon name="arrowLeft" />
                    </button>
                    <span className="text-lg font-semibold">{`Page ${currentPage + 1} of ${mangaData.pages.length}`}</span>
                    <button
                        onClick={goToNextPage}
                        disabled={currentPage === mangaData.pages.length - 1}
                        className="px-4 py-2 bg-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-600 transition"
                    >
                        <Icon name="arrowRight" />
                    </button>
                </div>
            </div>

            <ExportControls mangaPagesRef={mangaPagesRef} mangaData={mangaData} />
        </div>
    );
};

export default MangaPreview;