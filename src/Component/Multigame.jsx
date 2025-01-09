import React, { useEffect, useState } from "react";
import { getFirestore, doc, onSnapshot, updateDoc,getDoc } from "firebase/firestore";
import { app } from "./firebase";

const firestore = getFirestore(app);

function Multigame() {
  const [sheets, setSheets] = useState([[]]);
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
    setSheets([generateRandomSheet()]);
    
  }, []);


  useEffect(() => {
    const unsubscribe = onSnapshot(doc(firestore, "randomArray", "zKAYBuMbPk9gcgj9R2XP"), (doc) => {
      const data = doc.data();
      if (data) {
        setDrawnNumbers(data.arr || []);
        setIsWinnerDeclared(data.winner || false);

        const matches = sheets.map((sheet)=>
          sheet.filter((num) => data.arr.includes(num))
        )
            
        setMatchedNumbers(matches);

        
        if (matches.some((match,index)=>(
            match.length === sheets[index].length
        )) && !data.winner){
            
            declareWinner();
           
        } 

      }
      
    });

    return () => unsubscribe();
  }, [sheets]);
  

  const declareWinner = async (a) => {
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

  const addSheet =()=>{
    if(sheets.length<5){
        setSheets([...sheets,generateRandomSheet()])
      }
  }
  return (
    <div>
      <h3>Drawn Numbers:</h3>
      <h3>{drawnNumbers.join(", ")}</h3>
      <p>{drawnNumbers[drawnNumbers.length - 1]}</p>

      <h3>Your Sheet:</h3>
      
      
      {
        sheets.map((sheet,sheetIndex)=>(
            <div key={sheetIndex}>
              <h4>Sheet {sheetIndex +1}:</h4>
                {sheet.map((num)=>(
                  <span
                  key={num}
                  style={{
                    color:matchedNumbers[sheetIndex]?.includes(num) ? "red" :"black",
                    fontWeight: matchedNumbers[sheetIndex]?.includes(num) ? "bold" :"normal"
                  }}
                  >  
                  
                    {` ${num}`}
                  </span>
                ))} 
            </div>

        ))
      }  
   <button onClick={()=>addSheet()}>Add Sheet</button>

      

      {isWinnerDeclared && (
        <h3>
          
          Winner Declared!
        </h3>
      )}
    </div>
  );
}

export default Multigame;