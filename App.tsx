
import React, { useState, useCallback } from 'react';
import { MangaStyle, MangaData, Page, Panel } from './types';
import { generateMangaScript, generateCharacterImage, generatePanelImage } from './services/geminiService';
import Header from './components/Header';
import MangaForm from './components/MangaForm';
import MangaPreview from './components/MangaPreview';
import LoadingDisplay from './components/LoadingDisplay';
import { JSZip } from 'jszip';

const App: React.FC = () => {
    const [story, setStory] = useState<string>('');
    const [mangaStyle, setMangaStyle] = useState<MangaStyle>(MangaStyle.SHONEN);
    const [numPages, setNumPages] = useState<number>(2);
    const [mangaData, setMangaData] = useState<MangaData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingMessage, setLoadingMessage] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const handleGenerateManga = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setMangaData(null);

        try {
            setLoadingMessage('Generating manga script and storyboard...');
            const script = await generateMangaScript(story, mangaStyle, numPages);
            
            setLoadingMessage('Creating character designs...');
            const characterProfilesWithImages = await Promise.all(
                script.characters.map(async (char) => {
                    const image = await generateCharacterImage(char.description, mangaStyle);
                    return { ...char, referenceImage: image };
                })
            );
            
            const mangaWithCharacters = { ...script, characters: characterProfilesWithImages };
            setMangaData(mangaWithCharacters); // Show characters as they are generated

            let totalPanels = script.pages.reduce((acc, page) => acc + page.panels.length, 0);
            let currentPanel = 0;

            const pagesWithImages: Page[] = [];
            for (const page of script.pages) {
                const panelsWithImages: Panel[] = [];
                for (const panel of page.panels) {
                    currentPanel++;
                    setLoadingMessage(`Drawing panel ${currentPanel} of ${totalPanels}...`);
                    const panelImage = await generatePanelImage(panel.description, mangaWithCharacters.characters, mangaStyle);
                    panelsWithImages.push({ ...panel, imageUrl: panelImage });

                    // Update state incrementally to show panels as they are generated
                    setMangaData(prev => prev ? ({
                        ...prev,
                        pages: prev.pages.map(p => p.id === page.id ? {
                            ...p,
                            panels: p.panels.map(pa => pa.id === panel.id ? { ...pa, imageUrl: panelImage } : pa)
                        } : p)
                    }) : null);
                }
                pagesWithImages.push({ ...page, panels: panelsWithImages });
            }

            setMangaData({ ...mangaWithCharacters, pages: pagesWithImages });
            
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
            setLoadingMessage('');
        }
    }, [story, mangaStyle, numPages]);

    const updatePanelText = (pageId: string, panelId: string, newText: string, type: 'dialogue' | 'narration', dialogueIndex?: number) => {
        if (!mangaData) return;

        const updatedPages = mangaData.pages.map(page => {
            if (page.id !== pageId) return page;
            const updatedPanels = page.panels.map(panel => {
                if (panel.id !== panelId) return panel;
                if (type === 'narration') {
                    return { ...panel, narration: newText };
                }
                if (type === 'dialogue' && dialogueIndex !== undefined) {
                    const updatedDialogue = panel.dialogue.map((d, i) => i === dialogueIndex ? { ...d, text: newText } : d);
                    return { ...panel, dialogue: updatedDialogue };
                }
                return panel;
            });
            return { ...page, panels: updatedPanels };
        });

        setMangaData({ ...mangaData, pages: updatedPages });
    };
    
    const surpriseMe = () => {
        const stories = [
            "A time-traveling cat saves ancient Japan from a meteor.",
            "A rookie space pilot discovers a sentient nebula.",
            "A baker whose cakes predict the future.",
            "Two rival student detectives solve a mystery at their high school festival.",
            "A lonely robot tends to a garden on a post-apocalyptic Earth."
        ];
        setStory(stories[Math.floor(Math.random() * stories.length)]);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center p-4 sm:p-6 lg:p-8">
            <Header />
            <main className="w-full max-w-7xl mx-auto flex flex-col items-center">
                {!mangaData && !isLoading && (
                    <MangaForm
                        story={story}
                        setStory={setStory}
                        mangaStyle={mangaStyle}
                        setMangaStyle={setMangaStyle}
                        numPages={numPages}
                        setNumPages={setNumPages}
                        onGenerate={handleGenerateManga}
                        isLoading={isLoading}
                        onSurpriseMe={surpriseMe}
                    />
                )}
                
                {isLoading && <LoadingDisplay message={loadingMessage} />}

                {error && <div className="mt-8 bg-red-900 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-center">
                    <h3 className="font-bold">Generation Failed</h3>
                    <p>{error}</p>
                </div>}

                {mangaData && (
                    <MangaPreview mangaData={mangaData} updatePanelText={updatePanelText} />
                )}
            </main>
        </div>
    );
};

export default App;
