
import React from 'react';
import { MangaStyle } from '../types';

interface MangaFormProps {
    story: string;
    setStory: (story: string) => void;
    mangaStyle: MangaStyle;
    setMangaStyle: (style: MangaStyle) => void;
    numPages: number;
    setNumPages: (pages: number) => void;
    onGenerate: () => void;
    isLoading: boolean;
    onSurpriseMe: () => void;
}

const MangaForm: React.FC<MangaFormProps> = ({ story, setStory, mangaStyle, setMangaStyle, numPages, setNumPages, onGenerate, isLoading, onSurpriseMe }) => {
    return (
        <div className="w-full max-w-2xl bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-700">
            <div className="space-y-6">
                <div>
                    <label htmlFor="story" className="block text-sm font-medium text-gray-300 mb-2">
                        Your Story Idea
                    </label>
                    <textarea
                        id="story"
                        rows={5}
                        className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-gray-200 placeholder-gray-500"
                        placeholder="e.g., A time-traveling cat saves ancient Japan..."
                        value={story}
                        onChange={(e) => setStory(e.target.value)}
                    />
                    <div className="text-right mt-2">
                         <button
                            type="button"
                            onClick={onSurpriseMe}
                            className="text-sm text-purple-400 hover:text-purple-300 transition"
                         >
                           ✨ Surprise Me!
                         </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="manga-style" className="block text-sm font-medium text-gray-300 mb-2">
                            Manga Style
                        </label>
                        <select
                            id="manga-style"
                            className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                            value={mangaStyle}
                            onChange={(e) => setMangaStyle(e.target.value as MangaStyle)}
                        >
                            {Object.values(MangaStyle).map((style) => (
                                <option key={style} value={style}>{style}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="num-pages" className="block text-sm font-medium text-gray-300 mb-2">
                            Number of Pages ({numPages})
                        </label>
                         <input
                            type="range"
                            id="num-pages"
                            min="1"
                            max="5"
                            value={numPages}
                            onChange={(e) => setNumPages(parseInt(e.target.value, 10))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                        />
                    </div>
                </div>

                <div>
                    <button
                        onClick={onGenerate}
                        disabled={isLoading || !story}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                    >
                        {isLoading ? 'Creating...' : 'Generate Manga'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MangaForm;
