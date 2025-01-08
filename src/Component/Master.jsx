import React, { useState, useEffect } from "react";
import { getFirestore, doc, updateDoc, arrayUnion, onSnapshot } from "firebase/firestore";
import { app } from "./firebase";

const firestore = getFirestore(app);

function Master() {
  
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [timer, setTimer] = useState(null);
  const [arrayRandom, setArrayRandom] = useState([]);
  const arr = Array.from({ length: 90 }, (_, i) => i + 1);
  const [isWinner, setIsWinner] = useState(false);

  const startGame = async () => {
    try {  
      await updateDoc(doc(firestore, "randomArray", "zKAYBuMbPk9gcgj9R2XP"), {
        arr: [],
        winner: false,
        isGameEnded: false,
        gameRunning: true,
      });
      setIsGameStarted(true);
      setIsWinner(false);
      setArrayRandom([]);
      generateNumber();
    } catch (error) {
      console.error("Error starting game:", error);
    }
  };
  
  const generateNumber = async () => {
    
    if (isWinner && !isGameStarted) {
      stopGame();
      return;
    }
    if (arrayRandom.length < 90) {
      const newNumber = randomNumGen();

      if(isWinner===false){
        console.log(isWinner,"huhds")
        if (!arrayRandom.includes(newNumber)) {
          const updatedArray = [...arrayRandom, newNumber];
          setArrayRandom(updatedArray);
          try {
            await updateDoc(doc(firestore, "randomArray", "zKAYBuMbPk9gcgj9R2XP"), {
              arr: arrayUnion(newNumber),
            });
          } catch (error) {
            console.error("error in saving", error);
          }
        }
      }
      
      
      if (arrayRandom.length < 90 && !isWinner) {
        setTimer(setTimeout(generateNumber, 1000));
      }
    } else {
      stopGame();
    }
  };
  
  const stopGame = async () => {
    clearTimeout(timer);
    setTimer(null);
    setIsGameStarted(false);
    try {
      await updateDoc(doc(firestore, "randomArray", "zKAYBuMbPk9gcgj9R2XP"), {      
        gameRunning: false,
        isGameEnded: true,
      });
    } catch (error) {
      console.error("Error stopping the game:", error);
    }
  };
  
  useEffect(() => {
    
    const unsubscribe = onSnapshot(doc(firestore, "randomArray", "zKAYBuMbPk9gcgj9R2XP"), (doc) => {
      const data = doc.data();
      if (data) {
        setIsGameStarted(data.gameRunning || false);
        if (data.winner) {
          setIsWinner(true);
          stopGame(); 
        }
      }  
    });
    return () => {
      unsubscribe();
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [timer]);

 
  const randomNumGen = () => {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  };
  

  useEffect(() => {
    if (!isWinner) {
      clearTimeout(timer);
      stopGame();
    }
  }, [isWinner]);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      {!isGameStarted ? (
        <button onClick={startGame}>Start Game</button>
      ) : (
        <p>Game Is Running</p>
      )}
    </div>
  );
}


export default Master;
