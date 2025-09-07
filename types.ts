
export enum MangaStyle {
    SHONEN = "Shonen",
    SHOJO = "Shojo",
    SEINEN = "Seinen",
    CHIBI = "Chibi",
}

export interface Dialogue {
    character: string;
    text: string;
}

export interface Panel {
    id: string;
    description: string;
    dialogue: Dialogue[];
    narration: string;
    imageUrl?: string;
}

export interface Page {
    id: string;
    pageNumber: number;
    panels: Panel[];
    layout: string;
}

export interface CharacterProfile {
    name: string;
    description: string;
    referenceImage?: string;
}

export interface MangaData {
    title: string;
    characters: CharacterProfile[];
    pages: Page[];
}
