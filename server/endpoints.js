import express from 'express';
import fs from "fs/promises";
import cors from 'cors';
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(cors()); 
app.use(express.json({limit: '50mb'}));


const googleAI = new GoogleGenerativeAI('AIzaSyDwFpFuzIOP94lBQy99OczN0uJkUubTqas');
const geminiConfig = {
  temperature: 0,
  maxOutputTokens: 4096,
};
 
const geminiModel = googleAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  geminiConfig,
});

const generationConfig = {
  temperature: 0,
};

const model = googleAI.getGenerativeModel({ model: "gemini-1.5-pro",  generationConfig });

const generateIngredients = async (b64) => {
    try {
      // Read image file
    //   const imageFile = await fs.readFile("./server/cake-ing.jpg");
    //   const imageBase64 = imageFile.toString("base64");
      //console.log(imageBase64)
    const imageBase64 = b64
   
      const promptConfig = [
        { text: "Recognise the ingredients and give me a space separated list of ingredients without any other information or formatting " },
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

app.post('/generate-ingredients', async (req, res) => {
 try {
    const b64 = req.body.b64.split(',')[1];

    // console.log("TEST:\n\n\n\n\n\n\n\n\n" + b64)
    const ingredients = await generateIngredients(b64);
    // console.log(ingredients)
    res.status(200).send(ingredients);
 } catch (error) {
    console.error('Error generating ingredients:', error);
    res.status(500).send('An error occurred while generating ingredients');
 }
});





// Recipe Generation

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
    return text;
  }

  app.post('/generate-recipe', async (req, res) => {
    try {
       const { dietRestrictions, ingredients, cooking_time, people, difficulty } = req.body;
   
       // Call the generateRecipe function with the provided parameters
       const recipe = await generateRecipe(dietRestrictions, ingredients, cooking_time, people, difficulty);
   
       // Send the generated recipe back to the client
       res.status(200).send(recipe);
    } catch (error) {
       console.error('Error generating recipe:', error);
       res.status(500).send('An error occurred while generating the recipe');
    }
   });




   const generateInfo = async (b64) => {
    try {
      // Read image file
    //   const filePath = "family.jpg";
    //   const imageFile = await fs.readFile(filePath);
    //   const imageBase64 = imageFile.toString("base64");

    const imageBase64 = b64
   
      const promptConfig = [
        { text: `Recognise the food item/s in this image. 
          Give in json format the name the number of calories, protein, carbs, sugars, fats, sodium per 100 grams. Just give a numerical value with no unit. 
          Respond in a valid json string with no extra information or formatting

          JSON format:
          {
            "name": "info",
            "calories": "info",
            "protein": "info",
            "carbs": "info",
            "sugars": "info",
            "fats": "info",
            "sodium": "info",
          }
          Respond only with the completed JSON object, without any additional explanatory or descriptive text. The JSON should be complete and ready for parsing`
          },
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
      return response.text()
    } catch (error) {
      console.log(" response error", error);
    }
  };

  app.post('/generate-info', async (req, res) => {
    try {
       const b64 = req.body.b64.split(',')[1];
   
       // console.log("TEST:\n\n\n\n\n\n\n\n\n" + b64)
       const ingredients = await generateInfo(b64);
       // console.log(ingredients)
       res.status(200).send(ingredients);
    } catch (error) {
       console.error('Error recognising food:', error);
       res.status(500).send('An error occurred while generating the food');
    }
   });

const port = process.env.PORT || 3000;
app.listen(port, () => {
 console.log(`Server listening on port ${port}`);
});
