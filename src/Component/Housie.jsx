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
//       // setIsWinnerDeclared(true);
     
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
//       <p>{drawnNumbers[drawnNumbers.length-1]}</p>
//       <h3>Your Sheet:</h3>
//       {sheet.map((num) => (
//         <span
//           key={num}
//           style={{
//             color: matchedNumbers.includes(num) ? "red" : "black",
//             fontWeight: matchedNumbers.includes(num) ? "bold" : "normal",
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


import React, { useEffect, useState } from "react";
import { getFirestore, doc, onSnapshot, updateDoc,getDoc } from "firebase/firestore";
import { app } from "./firebase";

const firestore = getFirestore(app);

function Housie() {
  const [sheet, setSheet] = useState([]);
  const [drawnNumbers, setDrawnNumbers] = useState([]);
  const [matchedNumbers, setMatchedNumbers] = useState([]);
  const [isWinnerDeclared, setIsWinnerDeclared] = useState(false);
  const totalNumbers = Array.from({ length: 90 }, (_, i) => i + 1);

  const generateRandomSheet = () => {
    const uniqueNumbers = new Set();
    while (uniqueNumbers.size < 10) {
      uniqueNumbers.add(totalNumbers[Math.floor(Math.random() * totalNumbers.length)]);
    }
    return Array.from(uniqueNumbers);
  };

  useEffect(() => {
    setSheet(generateRandomSheet());
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(firestore, "randomArray", "zKAYBuMbPk9gcgj9R2XP"), (doc) => {
      const data = doc.data();
      if (data) {
        setDrawnNumbers(data.arr || []);
        setIsWinnerDeclared(data.winner || false);

        const matches = sheet.filter((num) => data.arr.includes(num));
        setMatchedNumbers(matches);

        if (matches.length === sheet.length && !data.winner ) {
          declareWinner();
        }
      }
    });
    return () => unsubscribe();
  }, [sheet]);
  const declareWinner = async () => {
    try {
      const gameDocRef = doc(firestore, "randomArray", "zKAYBuMbPk9gcgj9R2XP");
      const gameDoc = await getDoc(gameDocRef);
      const gameState = gameDoc.data();
  
      if (gameState && gameState.gameRunning && !gameState.winner) {
        await updateDoc(gameDocRef, {
          winner: true,
          gameRunning: false,
          isGameEnded: true,
        });
        setIsWinnerDeclared(true);
      }
    } catch (error) {
      console.error("Error declaring winner:", error);
    }
  };

  return (
    <div>
      <h3>Drawn Numbers:</h3>
      <h3>{drawnNumbers.join(", ")}</h3>
      <p>{drawnNumbers[drawnNumbers.length - 1]}</p>

      <h3>Your Sheet:</h3>
      {sheet.map((num) => (
        <span
          key={num}
          style={{
            color: matchedNumbers.includes(num) ? "red" : "black",
            fontWeight: matchedNumbers.includes(num) ? "bold" : "normal",
          }}
        >
          {` ${num}`}
        </span>
      ))}

      {isWinnerDeclared && (
        <h3>
          Winner Declared!
        </h3>
      )}
    </div>
  );
}

export default Housie;