import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import { Button } from "@mui/material";
import TimerIcon from "@mui/icons-material/Timer";
import Switch from "@mui/material/Switch";

export default function DiscreteSlider(props) {
  const [value, setValue] = React.useState(15);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [selectedButton, setSelectedButton] = useState(null);

  const handleButtonClick = (buttonIndex) => {
    setSelectedButton(buttonIndex);
  };
  function valuetext(value) {
    return `${value} mins`; // Custom function to format the value text
  }

  const [selectedProficiency, setSelectedProficiency] = useState("Novice");
  const [isOpen, setIsOpen] = useState(false);

  const handleDropdownToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleProficiencySelect = (proficiency) => {
    setSelectedProficiency(proficiency);
    setIsOpen(false);
  };
  const [isVeg, setIsVeg] = useState(true);

  const handleToggle = () => {
    setIsVeg(!isVeg);
  };



  // Generate Recipe
  const generateRecipe = async () => {
    try {
       const response = await fetch('http://localhost:3000/generate-recipe', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({
           dietRestrictions: isVeg ? 'veg' : 'non-veg',
           ingredients: props.ingredients, // Assuming ingredients is passed as a prop
           cooking_time: value,
           people: selectedButton,
           difficulty: selectedProficiency.toLowerCase(),
         }),
       });
   
       if (!response.ok) {
         throw new Error('Network response was not ok');
       }
   
       const recipe = await response.json();
       console.log(recipe);
       // Handle the received recipe here
    } catch (error) {
       console.error('Error:', error);
       // Handle errors here
    }
   };

   
  return (
    <div>
      <div className="bg-primary-100 mt-15 pt-10 max-w-4xl mx-auto rounded-xl flex flex-col items-center  content-center gap-10 shadow-md my-8 h-screen">
        <h1 className="text-xl font-bold mb-4">How much time do you have?</h1>
        <div className="w-80 flex justify-end">
          <Slider
            aria-label="Temperature"
            value={value}
            onChange={handleChange}
            getAriaValueText={valuetext}
            step={15}
            marks
            min={5}
            max={120}
            sx={{color:'#34693a'}}
          />
          <div className="flex flex-row">
          <TimerIcon className="ml-5" sx={{color:'#34693a'}}></TimerIcon>
          <Typography variant="body1" > {value}mins</Typography>
          </div>
        </div>
        <div className="number-of-ppl">
          <h1 className="text-xl font-bold mb-5">
            How many people do you have to serve?
          </h1>
          <div className="buttons flex items-center justify-between text-xl font-bold">
            {[2, 4, 6].map((buttonValue) => (
              <Button
                key={buttonValue}
                sx={{backgroundColor:'#34693a', color:'black'}}
                style={{
                  
                  border:
                    selectedButton === buttonValue ? "2px solid black" : "none",
                  marginRight: buttonValue < 2 ? "8px" : "0",
                  
                  width: "30%",
                }}
                onClick={() => handleButtonClick(buttonValue)}
              >
                {buttonValue} People
              </Button>
            ))}
          </div>
        </div>
        <div className="rounded-lg p-6">
          <h2 className="text-xl font-bold text-center mb-5">
            Are you a good chef?
          </h2>
          <div>
            <div className="relative">
              <Button
              sx={{backgroundColor:'#34693a', color:'black'}}
                className="bg-primary-300 px-4 py-2 rounded-md text-center w-full"
                onClick={handleDropdownToggle}
              >
                {selectedProficiency}
              </Button>
              <div
                className={`absolute z-10 top-full left-0 w-full bg-white rounded-md shadow-lg ${
                  isOpen ? "block" : "hidden"
                }`}
              >
                <ul className="py-1 text-base w-full">
                  <li
                    className="px-4 hover:bg-gray-100 cursor-pointer w-full"
                    onClick={() => handleProficiencySelect("Novice")}
                  >
                    Novice
                  </li>
                  <li
                    className="px-4 hover:bg-gray-100 cursor-pointer w-full"
                    onClick={() => handleProficiencySelect("Intermediate")}
                  >
                    Intermediate
                  </li>
                  <li
                    className="px-4 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleProficiencySelect("Expert")}
                  >
                    Expert
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="flex  justify-center space-x-4">
          <span className="text-xl font-bold mb-4">Veg </span> 
          <Switch
            onClick={handleToggle}
            className={`rounded-full  ${isVeg ? "bg-green-400" : "bg-red-500"}`}
            label="isVeg ? 'Veg' : 'Non Veg'"
          ></Switch>
          <span className="text-xl font-bold mb-4">Non-Veg </span>
        </div>
        <div>
        <Button
                size="large"
                onClick={generateRecipe}
                sx={{backgroundColor:'#34693a', color:'black', width:8/9, height:4/5}}
                
              >
                Generate Recipe!
              </Button>
        </div>
      </div>
    </div>
  );
}
