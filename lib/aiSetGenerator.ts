import {
  GoogleGenerativeAI,
  GenerativeModel,
  SchemaType,
} from "@google/generative-ai";

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
  responseSchema: {
    type: SchemaType.OBJECT,
    properties: {
      cards: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            term: {
              type: SchemaType.STRING,
            },
            definition: {
              type: SchemaType.STRING,
            },
          },
          required: ["term", "definition"],
        },
      },
      cards_set_name: {
        type: SchemaType.STRING,
      },
    },
    required: ["cards", "cards_set_name"],
  },
};

class AISetGenerator {
  private model: GenerativeModel;

  constructor() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    this.model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction:
        "You will be given a prompt, and you will need to generate a set of flashcards, that contain a term and a definiton. Generate a minimum as 10 flashcards. The term should be 1-2 words long, the definiton should be 1-2 sentences long. You will also need to generate a name for the set. The name should not be long.",
    });
  }

  async generate(prompt: string) {
    const chatSession = this.model.startChat({
      generationConfig,
      history: [],
    });
    const result = await chatSession.sendMessage(prompt);

    return JSON.parse(result.response.text());
  }
}

export default AISetGenerator;
