import React from 'react';
import Box from '../components/Box';
import girlicon from '../assets/girlicon.png';
import girlfood from '../assets/girl_food.jpeg';
import boy_exercise from '../assets/boy_exercise.avif';
import Navbar from '../components/Navbar';

const Home = () => {
  return (
    <>
    <div>
      <Navbar />
    </div>
    
    <div className="home">
      <Box
        page="Meal.jsx"
        imageSrc= {girlfood}
        altText="meal icon"
        title="Meal Tracking"
        description="Track your daily meals."
      />
      <Box
        page="Activity.jsx"
        imageSrc= {boy_exercise}
        altText="Activity Icon"
        title="Activity Tracker"
        description="Monitor your physical activities and workouts."
      />
      <Box
        page="Stats.jsx"
        imageSrc= {girlicon}
        altText="Stats Icon"
        title="Stats"
        description="View your health and fitness statistics."
      />
    </div>
    </>
  );
};

export default Home;
