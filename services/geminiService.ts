import { GoogleGenAI, Type, GenerateContentResponse, Modality } from "@google/genai";
import { MangaStyle, MangaData, CharacterProfile } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const mangaScriptSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "A catchy manga title for the story." },
        characters: {
            type: Type.ARRAY,
            description: "A list of main characters in the story.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "Character's name." },
                    description: { type: Type.STRING, description: "A detailed visual description of the character's appearance, clothing, and personality for the artist." }
                },
                required: ["name", "description"]
            }
        },
        pages: {
            type: Type.ARRAY,
            description: "The pages of the manga.",
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING, description: "A unique ID for the page, e.g., 'page-1'." },
                    pageNumber: { type: Type.INTEGER, description: "The page number, starting from 1." },
                    layout: { type: Type.STRING, description: "A layout style for this page based on panel count. E.g., '2-panel-vertical', '3-panel-pyramid', '4-panel-grid'." },
                    panels: {
                        type: Type.ARRAY,
                        description: "The panels on this page.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                id: { type: Type.STRING, description: "A unique ID for the panel, e.g., 'page-1-panel-1'." },
                                description: { type: Type.STRING, description: "A detailed visual description of the scene, characters, actions, and mood for the artist. Be specific about camera angles and character expressions." },
                                dialogue: {
                                    type: Type.ARRAY,
                                    description: "Dialogue spoken by characters in this panel.",
                                    items: {
                                        type: Type.OBJECT,
                                        properties: {
                                            character: { type: Type.STRING, description: "The name of the character speaking." },
                                            text: { type: Type.STRING, description: "The dialogue text." }
                                        },
                                        required: ["character", "text"]
                                    }
                                },
                                narration: { type: Type.STRING, description: "Narration text for a narrator box, if any." }
                            },
                            required: ["id", "description", "dialogue", "narration"]
                        }
                    }
                },
                required: ["id", "pageNumber", "layout", "panels"]
            }
        }
    },
    required: ["title", "characters", "pages"]
};

export const generateMangaScript = async (story: string, style: MangaStyle, numPages: number): Promise<MangaData> => {
    const prompt = `You are a professional manga scriptwriter. Based on the following story idea, create a script for a ${numPages}-page manga in the ${style} style. The story should be engaging and visually interesting. Distribute the story across the pages and panels appropriately.

Story Idea: "${story}"

Generate a complete JSON object that follows the provided schema. Ensure every field is filled out correctly. The number of pages must be exactly ${numPages}. Each page can have between 2 to 6 panels.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: mangaScriptSchema,
            },
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as MangaData;

    } catch (error) {
        console.error("Error generating manga script:", error);
        throw new Error("Failed to generate the manga script from the story idea.");
    }
};

export const generateCharacterImage = async (description: string, style: MangaStyle): Promise<string> => {
    const prompt = `Create a full-body character reference sheet for a manga character in a ${style} style. The character is: "${description}". The background should be a simple, plain white to isolate the character. The character should have a neutral expression.`;

    try {
        // FIX: Switched to the `generateImages` API with the 'imagen-4.0-generate-001' model for text-to-image generation, adhering to the updated API guidelines. This is more appropriate than using the image editing model for creating a new character image from a text description.
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/png', // Using PNG for consistency with panel generation
                aspectRatio: '3:4', // Character sheets are often taller than they are wide
            },
        });
        
        if (response.generatedImages && response.generatedImages.length > 0) {
            return response.generatedImages[0].image.imageBytes;
        }
        throw new Error("No image was generated for the character.");
    } catch (error) {
        console.error("Error generating character image:", error);
        throw new Error("Failed to generate character reference image.");
    }
};


export const generatePanelImage = async (panelDescription: string, characters: CharacterProfile[], style: MangaStyle): Promise<string> => {
    
    const parts: any[] = [{ 
        text: `Generate a single manga panel in a black and white ${style} style. The panel must be detailed and visually compelling.
        
        Scene description: "${panelDescription}"
        
        The characters involved are described below. Use their reference images to ensure consistency.
        ${characters.map(c => `- ${c.name}: ${c.description}`).join('\n')}
        `
    }];

    for (const char of characters) {
        if(char.referenceImage) {
            parts.push({
                inlineData: {
                    mimeType: 'image/png',
                    data: char.referenceImage,
                }
            });
        }
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: { parts },
            config: {
                // FIX: Updated `responseModalities` to include both `Modality.IMAGE` and `Modality.TEXT` as required by the 'gemini-2.5-flash-image-preview' model for image editing tasks.
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        // FIX: Implemented a safer response parsing logic. Instead of assuming the first part is an image, the code now iterates through all response parts to reliably find and return the image data.
        const responseParts = response.candidates?.[0]?.content?.parts;
        if (responseParts) {
            for (const part of responseParts) {
                if (part.inlineData) {
                    return part.inlineData.data;
                }
            }
        }
        
        throw new Error("No image was generated for the panel.");
    } catch (error) {
        console.error("Error generating panel image:", error);
        throw new Error(`Failed to generate panel image for description: ${panelDescription.substring(0, 50)}...`);
    }
};