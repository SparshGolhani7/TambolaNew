import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  
    <App />
 
)





// import React, { useState, useEffect } from "react";
// import { getFirestore, doc, updateDoc, arrayUnion } from "firebase/firestore";
// import { app } from "./firebase";

// const firestore = getFirestore(app);

// function Master() {
//   const [arrayRandom, setArrayRandom] = useState([]);
//   const arr = Array.from({ length: 90 }, (_, i) => i + 1);

//   useEffect(() => {
//     const timer = setInterval(async () => {
//       if (arrayRandom.length >= 90) {
//         clearInterval(timer); // Stop when all numbers are drawn
//         return;
//       }

//       const newNumber = arr[arrayRandom.length];
//       const updatedArray = [...arrayRandom, newNumber];
//       setArrayRandom(updatedArray);

//       await saveToDB(newNumber, arrayRandom.length);

//       console.log(updatedArray, "Updated random array to Firestore");
//     }, 1000); // 30 seconds

//     return () => clearInterval(timer);
//   }, [arrayRandom]);

//   const saveToDB = async (newNumber, currentIndex) => {
//     try {
//       const docRef = doc(firestore, "randomArray", "zKAYBuMbPk9gcgj9R2XP");
//       await updateDoc(docRef, {
//         arr: arrayUnion(newNumber), // Add the new number to the Firestore array
//         currentIndex: currentIndex + 1, // Increment currentIndex in Firestore
//         winner: false, // Keep winner false unless declared
//       });
//       console.log("Number saved to Firestore:", newNumber);
//     } catch (error) {
//       console.error("Error saving to Firestore:", error);
//     }
//   };

//   return (
//     <div>
//       <h1>Master Game Controller</h1>
//       <div>
//         <h2>Drawn Numbers:</h2>
//         <p>{arrayRandom.join(", ")}</p>
//       </div>
//     </div>
//   );
// }

// export default Master;






// import { useEffect, useState } from "react";
// import { getFirestore, doc, onSnapshot, updateDoc } from "firebase/firestore";
// import { app } from "./firebase";

// const firestore = getFirestore(app);

// function Housie() {
//   const [sheet, setSheet] = useState([]);
//   const [drawnNumber, setDrawnNumber] = useState(null);
//   const [matchedNumbers, setMatchedNumbers] = useState([]);
//   const [isGameStarted, setIsGameStarted] = useState(false);
//   const [winner, setWinner] = useState(false);

//   const arr = Array.from({ length: 90 }, (_, i) => i + 1);

//   useEffect(() => {
//     // Generate a unique random sheet for the player
//     const uniqueNumbers = new Set();
//     while (uniqueNumbers.size < 10) {
//       uniqueNumbers.add(randomNumGen());
//     }
//     setSheet(Array.from(uniqueNumbers));
//   }, []);

//   useEffect(() => {
//     if (isGameStarted && !winner && drawnNumber !== null) {
//       checkWinner();
//     }
//   }, [drawnNumber]);

//   function randomNumGen() {
//     const randomIndex = Math.floor(Math.random() * arr.length);
//     return arr[randomIndex];
//   }

//   function startTheGame() {
//     const unsubscribe = onSnapshot(
//       doc(firestore, "randomArray", "zKAYBuMbPk9gcgj9R2XP"),
//       (doc) => {
//         const data = doc.data();
//         setIsGameStarted(true);
//         setDrawnNumber(data.arr[data.currentIndex]);
//         setWinner(data.winner);

//         if (data.arr[data.currentIndex] && sheet.includes(data.arr[data.currentIndex])) {
//           setMatchedNumbers((prev) => [...prev, data.arr[data.currentIndex]]);
//         }

//         if (data.winner) {
//           alert("Game is finished! A winner has been declared.");
//         }
//       }
//     );
//     return () => unsubscribe();
//   }

//   const checkWinner = async () => {
//     // Check if all numbers in the sheet are matched
//     if (sheet.every((num) => matchedNumbers.includes(num))) {
//       try {
//         await updateDoc(doc(firestore, "randomArray", "zKAYBuMbPk9gcgj9R2XP"), {
//           winner: true,
//         });
//         setWinner(true);
//         alert("You are the winner!");
//       } catch (error) {
//         console.error("Error declaring winner:", error);
//       }
//     }
//   };

//   return (
//     <div>
//       <h1>Housie Game</h1>
//       <button onClick={startTheGame}>START game</button>
//       {isGameStarted && (
//         <div>
//           <h2>Drawn Number: {drawnNumber}</h2>
//           <p>
//             {sheet.map((num) => (
//               <span
//                 key={num}
//                 style={{
//                   color: matchedNumbers.includes(num) ? "red" : "black",
//                   fontWeight: matchedNumbers.includes(num) ? "bold" : "normal",
//                 }}
//               >
//                 {num}{" "}
//               </span>
//             ))}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Housie;

















// import React, { useState, useEffect } from "react";
// import { getFirestore, doc, updateDoc, onSnapshot } from "firebase/firestore";
// import { app } from "./firebase";

// const firestore = getFirestore(app);

// function Master() {
//   const [arrayRandom, setArrayRandom] = useState([]); // Holds the drawn numbers
//   const [currentIndex, setCurrentIndex] = useState(-1); // Tracks the current index
//   const [isGameRunning, setIsGameRunning] = useState(false); // Tracks if the game is running
//   const arr = Array.from({ length: 90 }, (_, i) => i + 1); // Full range of numbers (1 to 90)

//   // Firestore document reference
//   const docRef = doc(firestore, "randomArray", "zKAYBuMbPk9gcgj9R2XP");

//   // Fetch Firestore data on load
//   useEffect(() => {
//     const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
//       if (docSnapshot.exists()) {
//         const data = docSnapshot.data();
//         setArrayRandom(data.arr || []);
//         setCurrentIndex(data.currentIndex ?? -1);
//         setIsGameRunning(!data.winner); // Stop game if a winner is declared
//       } else {
//         console.error("Firestore document does not exist!");
//       }
//     });
//     return () => unsubscribe(); // Cleanup listener
//   }, [docRef]);

//   // Start the game
//   const startGame = () => {
//     if (!isGameRunning) {
//       setIsGameRunning(true);
//       drawNumber(); // Draw the first number
//       const intervalId = setInterval(() => {
//         drawNumber();
//       }, 10000); // Draw numbers every 10 seconds
//       return () => clearInterval(intervalId); // Clear interval when game stops
//     }
//   };

//   // Draw the next number
//   const drawNumber = async () => {
//     if (currentIndex >= 89) {
//       console.log("All numbers have been drawn.");
//       return;
//     }

//     const nextIndex = currentIndex + 1;
//     const nextNumber = arr[nextIndex];

//     try {
//       // Update Firestore
//       await updateDoc(docRef, {
//         arr: [...arrayRandom, nextNumber], // Append the next number
//         currentIndex: nextIndex,
//         winner: false, // Ensure no winner is set yet
//       });

//       // Update local state
//       setArrayRandom((prev) => [...prev, nextNumber]);
//       setCurrentIndex(nextIndex);
//       console.log(`Number ${nextNumber} updated in Firestore.`);
//     } catch (error) {
//       console.error("Error updating Firestore:", error);
//     }
//   };

//   return (
//     <div style={{ textAlign: "center", marginTop: "20px" }}>
//       <h1>Master Game Controller</h1>
//       <button
//         onClick={startGame}
//         disabled={isGameRunning}
//         style={{
//           padding: "10px 20px",
//           fontSize: "16px",
//           cursor: isGameRunning ? "not-allowed" : "pointer",
//           backgroundColor: isGameRunning ? "grey" : "green",
//           color: "white",
//           border: "none",
//           borderRadius: "5px",
//         }}
//       >
//         {isGameRunning ? "Game in Progress..." : "Start Game"}
//       </button>
//       <div style={{ marginTop: "20px" }}>
//         <h2>Drawn Numbers:</h2>
//         <p style={{ fontSize: "18px", fontWeight: "bold" }}>
//           {arrayRandom.join(", ")}
//         </p>
//       </div>
//     </div>
//   );
// }

// export default Master;












// import React, { useState, useEffect } from "react";
// import { getFirestore, doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
// import { app } from "./firebase";
// import Housie from "./Housie";

// const firestore = getFirestore(app);

// function Master() {
//     const [isGameStarted, setIsGameStarted] = useState(false);
//     const [drawnNumbers, setDrawnNumbers] = useState([]);
//     const [winner, setWinner] = useState(false);

//     const arr = Array.from({ length: 90 }, (_, i) => i + 1);

//     // Start the game
//     const startTheGame = async () => {
//         setIsGameStarted(true);

//         const timer = setInterval(async () => {
//             if (winner) {
//                 clearInterval(timer);
//                 return;
//             }

//             try {
//                 const docRef = doc(firestore, "randomArray", "zKAYBuMbPk9gcgj9R2XP");
//                 const docSnap = await getDoc(docRef);

//                 if (docSnap.exists()) {
//                     const data = docSnap.data();
//                     const currentArray = data.arr || [];
//                     const currentWinner = data.winner || false;

//                     // If there's a winner or 90 numbers are drawn, stop the game
//                     if (currentWinner || currentArray.length >= 90) {
//                         setWinner(currentWinner);
//                         clearInterval(timer);
//                         return;
//                     }

//                     // Draw a unique random number
//                     const newNumber = randomNumGen(currentArray);
//                     if (newNumber) {
//                         await saveToDB(newNumber);
//                         setDrawnNumbers((prev) => [...prev, newNumber]);
//                     }
//                 }
//             } catch (error) {
//                 console.error("Error during game execution:", error);
//             }
//         }, 5000);

//         return () => clearInterval(timer);
//     };

//     // Stop the game
//     const stopTheGame = async () => {
//         try {
//             const docRef = doc(firestore, "randomArray", "zKAYBuMbPk9gcgj9R2XP");
//             await updateDoc(docRef, {
//                 arr: [],
//                 winner: false,
//             });

//             setIsGameStarted(false);
//             setDrawnNumbers([]);
//             setWinner(false);

//             console.log("Game stopped and fields cleared.");
//         } catch (error) {
//             console.error("Error stopping the game:", error);
//         }
//     };

//     // Generate a random number not already drawn
//     const randomNumGen = (currentArray) => {
//         const availableNumbers = arr.filter((num) => !currentArray.includes(num));
//         if (availableNumbers.length === 0) return null;
//         const randomIndex = Math.floor(Math.random() * availableNumbers.length);
//         return availableNumbers[randomIndex];
//     };

//     // Save the drawn number to Firestore
//     const saveToDB = async (newNumber) => {
//         try {
//             const docRef = doc(firestore, "randomArray", "zKAYBuMbPk9gcgj9R2XP");
//             await updateDoc(docRef, {
//                 arr: arrayUnion(newNumber),
//                 winner: false,
//             });

//             console.log("Number saved to Firestore:", newNumber);
//         } catch (error) {
//             console.error("Error saving to Firestore:", error);
//         }
//     };

//     useEffect(() => {
//         // Sync drawn numbers and winner status from Firestore
//         const fetchGameState = async () => {
//             const docRef = doc(firestore, "randomArray", "zKAYBuMbPk9gcgj9R2XP");
//             const docSnap = await getDoc(docRef);

//             if (docSnap.exists()) {
//                 const data = docSnap.data();
//                 setDrawnNumbers(data.arr || []);
//                 setWinner(data.winner || false);
//             }
//         };

//         fetchGameState();
//     }, [isGameStarted]);

//     return (
//         <div>
//             <div style={{ display: "flex", gap: "10px" }}>
//                 <button onClick={startTheGame} disabled={isGameStarted || winner}>
//                     Start The Game
//                 </button>
//                 <button onClick={stopTheGame} disabled={!isGameStarted}>
//                     Stop The Game
//                 </button>
//             </div>
//             <Housie drawnNumbers={drawnNumbers || []} winner={winner} />
//             <h4>Last Drawn Number: {drawnNumbers[drawnNumbers.length - 1] || "Waiting..."}</h4>
//             <h3>{winner ? "We have a winner!" : isGameStarted ? "Game in progress..." : "Game not started."}</h3>
//         </div>
//     );
// }

// export default Master;














// import React, { useState, useEffect } from "react";

// function Housie({ drawnNumbers, winner }) {
//     const [sheetNumbers, setSheetNumbers] = useState(generateSheetNumbers());
//     const [matchedNumbers, setMatchedNumbers] = useState([]);

//     // Generate a sheet of 10 random numbers
//     function generateSheetNumbers() {
//         const numbers = new Set();
//         while (numbers.size < 10) {
//             numbers.add(Math.floor(Math.random() * 90) + 1);
//         }
//         return Array.from(numbers);
//     }

//     // Check and highlight matches
//     useEffect(() => {
//         const matches = sheetNumbers.filter((num) => drawnNumbers.includes(num)) || null;
//         setMatchedNumbers(matches);

//         // Check if all numbers are matched (user wins)
//         if (!winner && matches.length === sheetNumbers.length) {
//             console.log("We have a winner!");
//         }
//     }, [drawnNumbers, sheetNumbers, winner]);

//     return (
//         <div>
//             <div className="sheet">
//                 {sheetNumbers.map((num, index) => (
//                     <div
//                         key={index}
//                         style={{
//                             padding: "10px",
//                             margin: "5px",
//                             backgroundColor: matchedNumbers.includes(num)
//                                 ? "red"
//                                 : "white",
//                             border: "1px solid black",
//                             display: "inline-block",
//                         }}
//                     >
//                         {num}
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }

// export default Housie;

//5 6

// import React, { useState, useEffect } from "react";
// import { getFirestore, doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
// import { app } from "./firebase";
// import Housie from "./Housie";

// const firestore = getFirestore(app);

// function Master() {
//   const [isWinner, setIsWinner] = useState(false);
//   const [arrayRandom, setArrayRandom] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(-1);
//   const [isGameStarted, setIsGameStarted] = useState(false);
//   // const [drawnNumber, setDrawnNumber] = useState([]);
//   // const [winner, setWinner] = useState(false);
//   const [isAuthorized, setIsAuthorized] = useState(false); 
//   const [inputPassword, setInputPassword] = useState(""); 

//   const arr = Array.from({ length: 90 }, (_, i) => i + 1);

//   const handleLogin = () => {
//     const myPassword = "master123"; 
//     if (inputPassword === myPassword) {
//       setIsAuthorized(true);
//     } else {
//       alert("Incorrect password!");
//     }
//   };

//   function startTheGame() {
//     // if (winner) return;
//     const timer = setInterval(() => {
//       console.log(isWinner,"winner");
//       if (isWinner==false){
//         console.log("I'm inside");
//         const newNumber = randomNumGen();
//         if (!arrayRandom.includes(newNumber) && arrayRandom.length < 90) {
//           const updatedArray = [...arrayRandom, newNumber];
//           setArrayRandom(updatedArray);
//           setCurrentIndex(updatedArray.length - 1);
//           // setDrawnNumber(updatedArray);
//           saveToDB(newNumber);
//         }

//       } else{
//         console.log("i'm outside");
//         clearInterval(timer);

//       }
      
    

//       if (arrayRandom.length >= 90) {
//         clearInterval(timer);
//       }
//     }, 500);

//     return () => clearInterval(timer);
//   }

//   function randomNumGen() {
//     const randomIndex = Math.floor(Math.random() * arr.length);
//     return arr[randomIndex];
//   }

//   const saveToDB = async (a) => {
//     setIsGameStarted(true);

//     try {
//       const docRef = doc(firestore, "randomArray", "zKAYBuMbPk9gcgj9R2XP");
//       const docSnap = await getDoc(docRef);
     

//       if (docSnap.exists()) {
//         const data = docSnap.data();
//         const currentArray = Array.isArray(data.arr) ? data.arr : [];
//         await updateDoc(docRef, {
//           arr: arrayUnion(a),
//           currentIndex: currentArray.length ,
//           winner: false,
//         });
//       } else {
//         console.error("No document found");
//       }
//     } catch (error) {
//       console.error("Error saving to Firestore:", error);
//     }
//   };

//   const stopTheGame = async () => {
//     // alert("hs")
//     try {
//       const docRef = doc(firestore, "randomArray", "zKAYBuMbPk9gcgj9R2XP");
//       await updateDoc(docRef, {
//         arr: [],
//         currentIndex: -1,
//         winner: false,
//       });
//       setArrayRandom([]);
//       setCurrentIndex(-1);
//       setIsGameStarted(false);
//       // setDrawnNumber([]);
//     } catch (error) {
//       console.error("Unable to clear the field:", error);
//     }
//   };

//   if (!isAuthorized) {
//     return (
//       <div>
//         <h2>hey admin </h2>
//         <input
//           type="password"
//           value={inputPassword}
//           onChange={(e) => setInputPassword(e.target.value)}
//         />
//         <button onClick={handleLogin}>Submit</button>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <button onClick={startTheGame}>Start The Game</button>
//       <button onClick={stopTheGame}>End Game</button>
//       <Housie
//         currentIndex={currentIndex}
//         setCurrentIndex={setCurrentIndex}
//         // winner={winner}
//         // setWinner={setWinner}
//         isGameStarted={isGameStarted}
//         setIsGameStarted={setIsGameStarted}
//         // drawnNumber={drawnNumber}
//         // setDrawnNumber={setDrawnNumber}
//         stopTheGame={stopTheGame}
//         isWinner={isWinner}
//         setIsWinner={setIsWinner}
//       />
//     </div>
//   );
// }

// export default Master;





// import { useEffect, useState } from "react";
// import { getFirestore, doc, onSnapshot, updateDoc } from "firebase/firestore";
// import { app } from "./firebase";

// const firestore = getFirestore(app);
// // winner, setWinner,

// function Housie({  isGameStarted, stopTheGame , isWinner , setIsWinner }) {
//   const [sheet, setSheet] = useState([]);
//   const [drawnNumber, setDrawnNumber] = useState([]);
//   const [matchedNumbers, setMatchedNumbers] = useState([]);
//   const totalNumbers = Array.from({ length: 90 }, (_, i) => i + 1);

//   function randomNumGen() {
//     const randomIndex = Math.floor(Math.random() * totalNumbers.length);
//     return totalNumbers[randomIndex];
//   }

//   useEffect(() => {
//     const uniqueNumbers = new Set();
//     while (uniqueNumbers.size < 10) {
//       uniqueNumbers.add(randomNumGen());
//     }
//     setSheet(Array.from(uniqueNumbers));
//   }, []);

//   useEffect(() => {
//     const unsubscribe = onSnapshot(
//       doc(firestore, "randomArray", "zKAYBuMbPk9gcgj9R2XP"),
//       (doc) => {
//         const data = doc.data();
//         const newDrawnNumber = data.arr || [];
//         setDrawnNumber(newDrawnNumber);

//         const newMatches = sheet.filter((num) => newDrawnNumber.includes(num));
//         setMatchedNumbers(newMatches);

//         if (newMatches.length === sheet.length) {
//           // setWinner(true);
//           handleWinner();
//         }

//       }
//     );
//     return () => unsubscribe();
//   }, [sheet, isGameStarted ,drawnNumber]);

//   const handleWinner = async () => {
//     // if (winner) return;
//     try {
//       await updateDoc(doc(firestore, "randomArray", "zKAYBuMbPk9gcgj9R2XP"), {
//         winner: true,
//       });
//       // setWinner(true);
//       setIsWinner(true);
//       // stopTheGame();
//     } catch (error) {
//       console.error("Error declaring winner:", error);
//     }
//   };

//   return (
//     <div>
//       <h3>Drawn Numbers:</h3>
//       {!isWinner && <p>{drawnNumber.join(", ")}</p>}
//       {isWinner && <p> winner !!</p>}
//       <h3>Your Sheet:</h3>
//       {sheet.map((num) => (
//         <span
//           key={num}
//           style={{
//             color: matchedNumbers.includes(num) ? "red" : "black",
//             fontWeight: matchedNumbers.includes(num) ? "bold" : "normal",
//             marginRight: "10px",
//           }}
//         >
//           {num}
//         </span>
//       ))}
//     </div>
//   );
// }

// export default Housie;






















// finaly my own
// import React, { useState, useEffect } from "react";
// import { getFirestore, doc, updateDoc, arrayUnion, onSnapshot } from "firebase/firestore";
// import { app } from "./firebase";
// import Housie from "./Housie";

// const firestore = getFirestore(app);

// function Master() {
  
//   const [isAuthorized, setIsAuthorized] = useState(false);
//   const [password, setPassword] = useState("");
//   // const [isGameStarted, setIsGameStarted] = useState(false);
//   const [timer, setTimer] = useState(null);
//   const [arrayRandom, setArrayRandom] = useState([]);
//   const arr = Array.from({ length: 90 }, (_, i) => i + 1); 

//   const handleLogin = () => {
//     if (password === "master123") {
//       setIsAuthorized(true);
//       // setIsAdmin(true);
//     } else {
//       alert("Incorrect password!");
//     }
//   };

//   const startGame = () => {
//     // setIsGameStarted(true);
//     const interval = setInterval(async () => {
//        try {

//         const newNumber = randomNumGen();

//         if (!arrayRandom.includes(newNumber) && arrayRandom.length < 90) {
//           const updatedArray = [...arrayRandom, newNumber];
//           setArrayRandom(updatedArray);

//           await updateDoc(doc(firestore, "randomArray", "zKAYBuMbPk9gcgj9R2XP"), {
//             arr: arrayUnion(newNumber), 
//             // currentIndex: updatedArray.length - 1,
//             winner: false,
//             isGameEnded:false,
//           });
//         }

        

//         if (arrayRandom.length >= 90) {
//           clearInterval(interval);
//           stopGame();
//         }
//       } catch (error) {
//         console.error("Error during game:", error);
//       }
//     }, 5000);

//     setTimer(interval);
//   };

//   const stopGame = async () => {
//     clearInterval(timer);
//     // setIsGameStarted(false);
//     setArrayRandom([]);

//     try {
//       await updateDoc(doc(firestore, "randomArray", "zKAYBuMbPk9gcgj9R2XP"), {
//         arr: [],
//         // currentIndex: -1,
//         winner: false,
//         isGameEnded:true,
//       });
//     } catch (error) {
//       console.error("Error stopping the game:", error);
//     }
//   };

//   const randomNumGen = () => {
    
//     const randomIndex = Math.floor(Math.random() * arr.length);
//     return arr[randomIndex];
//   };

//   useEffect(() => {
//     const unsubscribe = onSnapshot(doc(firestore, "randomArray", "zKAYBuMbPk9gcgj9R2XP"), (doc) => {
//       const data = doc.data();
//       if (data && data.winner) {
        
//         alert("Winner has been selected!");
//         stopGame();
//       }
//     });
//     return () => unsubscribe();
//   }, []);

//   // useEffect(()=>{
//   //   if(isWinner){
//   //     return(
//   //      stopGame()
//   //     )
//   //   }
//   // },[isWinner])

//   if (!isAuthorized) {
//     return (
//       <div>
//         <h2>Admin Login</h2>
//         <input
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//         <button onClick={handleLogin}>Submit</button>
//       </div>
//     );
//   }



//   return (
//     <div>
//       <h2>Admin Dashboard</h2>
//       <button onClick={startGame} disabled={isGameStarted}>
//         {}
//         Start Game
//       </button>
//       <button onClick={stopGame}>Stop Game</button>
//     </div>
//   );
// }

// export default Master;

// // housie 
// import { useEffect, useState } from "react";
// import { getFirestore, doc, onSnapshot, updateDoc } from "firebase/firestore";
// import { app } from "./firebase";

// const firestore = getFirestore(app);

// function Housie() {
//   const [sheet, setSheet] = useState([]);
//   const [drawnNumbers, setDrawnNumbers] = useState([]);
//   const [matchedNumbers, setMatchedNumbers] = useState([]);
//   const [isWinnerDeclared, setIsWinnerDeclared] = useState(false);
//   const totalNumbers = Array.from({ length: 90 }, (_, i) => i + 1);

//   const generateRandomSheet = () => {
//     const uniqueNumbers = new Set();
//     while (uniqueNumbers.size < 10) {
//       uniqueNumbers.add(totalNumbers[Math.floor(Math.random() * totalNumbers.length)]);
//     }
//     return Array.from(uniqueNumbers);
//   };

//   useEffect(() => {
//     setSheet(generateRandomSheet());
//   }, []);

//   useEffect(() => {
//     const unsubscribe = onSnapshot(doc(firestore, "randomArray", "zKAYBuMbPk9gcgj9R2XP"), (doc) => {
//       const data = doc.data();
//       if (data) {
//         setDrawnNumbers(data.arr || []);
//         setIsWinnerDeclared(data.winner || false);

//         const matches = sheet.filter((num) => data.arr.includes(num));
//         setMatchedNumbers(matches);

//         if (matches.length === sheet.length) {
//           declareWinner();
//         }
//       }
//     });
//     return () => unsubscribe();
//   }, [sheet]);

//   const declareWinner = async () => {
//     try {
//       await updateDoc(doc(firestore, "randomArray", "zKAYBuMbPk9gcgj9R2XP"), 
//       { winner: true });
//       setIsWinner(true);
     
//     } catch (error) {
//       console.error("Error declaring winner:", error);
//     }
//   };

//   // if (isAdmin) {
//   //   return <div><h2>Admin is logged in</h2></div>;
//   // }

//   return (
//     <div>
//       <h3>Drawn Numbers:</h3>
//       <p>{drawnNumbers.join(", ")}</p>
//       <h3>Your Sheet:</h3>
//       {sheet.map((num) => (
//         <span
//           key={num}
//           style={{
//             color: matchedNumbers.includes(num) ? "red" : "black",
//             fontWeight: matchedNumbers.includes(num) ? "bold" : "normal",
//             marginRight: "10px",
//           }}
//         >
//           {num}
//         </span>
//       ))}
//       {isWinnerDeclared && <h3>Winner Declared!</h3>}
//     </div>
//   );
// }

// export default Housie;



