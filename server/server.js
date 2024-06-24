import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs/promises";
import dotenv from "dotenv";
dotenv.config();
 
const gemini_api_key = process.env.API_KEY;
// console.log(gemini_api_key)
const googleAI = new GoogleGenerativeAI(gemini_api_key);
const geminiConfig = {
  temperature: 0,
  maxOutputTokens: 4096,
};
 
const geminiModel = googleAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  geminiConfig,
});

const generationConfig = {
  temperature: 0.5,
};

const model = googleAI.getGenerativeModel({ model: "gemini-1.5-pro",  generationConfig });
 
export const generateIngredients = async (b64) => {
  try {
    // Read image file
    const filePath = "family.jpg";
    const imageFile = await fs.readFile(filePath);
    const imageBase64 = imageFile.toString("base64");
 
    const promptConfig = [
      { text: "Recognise the ingredients and give me a space separated list of ingredients without any other information or formatting, if there are no ingredients output a single word ERROR" },
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: imageBase64,
        },
      },
    ];
 
    const result = await geminiModel.generateContent({
      contents: [{ role: "user", parts: promptConfig }],
    });
    const response = await result.response;
    console.log(response.text())
    return response.text()
  } catch (error) {
    console.log(" response error", error);
  }
};

const generateInfo = async () => {
  try {
    // Read image file
    const filePath = "family.jpg";
    const imageFile = await fs.readFile(filePath);
    const imageBase64 = imageFile.toString("base64");
 
    const promptConfig = [
      { text: "Recognise the food item/s in this image. Only the name of the food item do not mention the quantity or anything else" },
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: imageBase64,
        },
      },
    ];
 
    const result = await geminiModel.generateContent({
      contents: [{ role: "user", parts: promptConfig }],
    });
    const response = await result.response;
    console.log(response.text());
  } catch (error) {
    console.log(" response error", error);
  }
};

async function generateRecipe(dietRestrictions, ingredients, cooking_time, people, difficulty) {
  // const dietRestrictions = 'vegetarian'
  // const ingredients = await generateIngredients()
  // const cooking_time = '30'
  // const people = '3'
  // const difficulty = 'easy'

  const prompt = `You are an expert culinary chef who has cooked for the best restaurants in the world.
  Craft a delightful, creative and unique recipe with the following considerations:

  Rules:
    - Response must be in JSON format.
    - Recipe must have a creative Title.
    - Include detailed instructions with estimated cooking times for each step.
    - Adhere to the following dietary preferences: ${dietRestrictions}
    - Utilize only the available ingredients (${ingredients}).
      Avoid incompatible ingredients based on the specified diet.
    - Ensure the cooking time is under ${cooking_time} minutes.
    - Design the recipe to serve ${people} people.
    - Evaluate the difficulty of execution as ${difficulty}.
    - Recipe must have a short description.
    - Be creative with the cooking techniques and flavor combinations
    - Feel free to incorporate herbs and spices for an extra burst of flavor


  The JSON object must include the following fields:
  - "title": [string]
  - "description": [string]
  - "people": [number] (based on the provided input)
  - "difficulty": [string] (based on the provided input)
  - "cooking_time": [number] (based on the provided input)
  - "low_calori": [string] (based on the provided input)
  - "vegan": [string] (based on the provided input)
  - "paleo": [string] (based on the provided input)
  - "calories": [number],
  - "macros": {"protein": [number], "fats": [number], "carbs": [number]},
  - "ingredients": [{"name": [string], "amount": [string]}, ...] (based on the provided diet type and ingredients provided),
  - "instructions": [{"step": [number], "description": [string]}, ...]

  
  Format the response as a valid JSON object with all fields filled. Here is the structure for reference:
  
  {
    "title": /* details */,
    "description":  /* details */,
    "people":  /* details */,
    "difficulty":  /* details */,
    "cooking_time":  /* details */,
    "low_calori":  /* details */,
    "vegan":  /* details */, 
    "paleo":  /* details */,
    "calories":  /* details */,
    "macros": { /* details */ },
    "ingredients": { /* details */ },
    "instructions": { /* details */ }
  }
  
  Respond only with the completed JSON object, without any additional explanatory or descriptive text. The JSON should be complete and ready for parsing`

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  console.log(text);
}

generateRecipe();
