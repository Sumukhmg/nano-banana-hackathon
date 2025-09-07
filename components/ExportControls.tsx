
import React, { RefObject, useState } from 'react';
import { MangaData } from '../types';
import Icon from './Icon';

declare const jspdf: any;
declare const html2canvas: any;
declare const JSZip: any;


interface ExportControlsProps {
    mangaPagesRef: RefObject<(HTMLDivElement | null)[]>;
    mangaData: MangaData;
}

const ExportControls: React.FC<ExportControlsProps> = ({ mangaPagesRef, mangaData }) => {
    const [isExporting, setIsExporting] = useState<string | null>(null);

    const exportAsPDF = async () => {
        setIsExporting('PDF');
        // @ts-ignore
        const { jsPDF } = jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pages = mangaPagesRef.current.filter(p => p !== null) as HTMLDivElement[];

        for (let i = 0; i < pages.length; i++) {
            const pageElement = pages[i];
            const canvas = await html2canvas(pageElement, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const ratio = canvasWidth / canvasHeight;
            const width = pdfWidth;
            const height = width / ratio;

            if (i > 0) {
                pdf.addPage();
            }
            pdf.addImage(imgData, 'PNG', 0, (pdfHeight - height) / 2, width, height);
        }

        pdf.save(`${mangaData.title.replace(/\s/g, '_')}.pdf`);
        setIsExporting(null);
    };

    const exportAsZIP = async () => {
        setIsExporting('ZIP');
        const zip = new JSZip();
        
        mangaData.pages.forEach(page => {
            page.panels.forEach(panel => {
                if (panel.imageUrl) {
                    zip.file(`page_${page.pageNumber}_panel_${panel.id}.png`, panel.imageUrl, { base64: true });
                }
            });
        });

        const content = await zip.generateAsync({ type: "blob" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(content);
        link.download = `${mangaData.title.replace(/\s/g, '_')}_panels.zip`;
        link.click();
        URL.revokeObjectURL(link.href);
        setIsExporting(null);
    };
    
    // Mock for slideshow functionality
    const playSlideshow = () => {
        alert("Playing narrated slideshow! (Audio functionality is mocked)");
    };

    return (
        <div className="w-full max-w-4xl mt-8 p-4 bg-gray-800 border border-gray-700 rounded-lg flex flex-col sm:flex-row items-center justify-center gap-4">
            <h3 className="text-lg font-semibold text-gray-300">Export Options</h3>
            <div className="flex gap-4">
                <button onClick={exportAsPDF} disabled={!!isExporting} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition disabled:opacity-50">
                    <Icon name="pdf" />
                    {isExporting === 'PDF' ? 'Exporting...' : 'Export as PDF'}
                </button>
                <button onClick={exportAsZIP} disabled={!!isExporting} className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition disabled:opacity-50">
                    <Icon name="zip" />
                    {isExporting === 'ZIP' ? 'Zipping...' : 'Download Panels'}
                </button>
                <button onClick={playSlideshow} disabled={!!isExporting} className="flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 rounded-lg transition disabled:opacity-50">
                    <Icon name="play" />
                    Play Slideshow
                </button>
            </div>
        </div>
    );
};

export default ExportControls;
