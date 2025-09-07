
import React, { forwardRef } from 'react';
import { Page } from '../types';
import MangaPanel from './MangaPanel';

interface MangaPageProps {
    page: Page;
    updatePanelText: (pageId: string, panelId: string, newText: string, type: 'dialogue' | 'narration', dialogueIndex?: number) => void;
}

const getGridLayout = (panelCount: number, layoutHint: string): string => {
    switch (panelCount) {
        case 2: return 'grid-cols-1 grid-rows-2';
        case 3: return 'grid-cols-2 grid-rows-2'; // requires special panel spans
        case 4: return 'grid-cols-2 grid-rows-2';
        case 5: return 'grid-cols-2 grid-rows-3'; // requires special panel spans
        case 6: return 'grid-cols-2 grid-rows-3';
        default: return 'grid-cols-1 grid-rows-1';
    }
}

const getPanelSpan = (panelCount: number, index: number): string => {
    if (panelCount === 3) {
        return index === 0 ? 'col-span-2' : '';
    }
    if (panelCount === 5) {
        return index === 0 || index === 1 ? 'col-span-1' : (index === 2 ? 'col-span-2' : '');
    }
    return '';
}

const MangaPage = forwardRef<HTMLDivElement, MangaPageProps>(({ page, updatePanelText }, ref) => {
    const gridClass = getGridLayout(page.panels.length, page.layout);

    return (
        <div ref={ref} className="bg-white p-2 w-full h-full shadow-lg border-4 border-gray-600">
            <div className={`grid ${gridClass} gap-2 h-full`}>
                {page.panels.map((panel, index) => (
                    <div key={panel.id} className={getPanelSpan(page.panels.length, index)}>
                        <MangaPanel 
                            panel={panel}
                            onTextUpdate={(type, newText, dialogueIndex) => updatePanelText(page.id, panel.id, newText, type, dialogueIndex)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
});

MangaPage.displayName = "MangaPage";
export default MangaPage;
