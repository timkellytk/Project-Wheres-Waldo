import React, { useState, useEffect } from "react";
import OutsideClickHandler from "react-outside-click-handler";
import firebase, { firestore } from "../firebase";
import GameWrapper from "../components/GameWrapper/GameWrapper";
import CharacterDropdown from "../components/CharacterDropdown/CharacterDropdown";
import Modal from "../components/Modal";

const Game = ({ level, username, updateUsername }) => {
  const getLocationImageClick = (e) => {
    const xCoord = Math.round(
      (e.nativeEvent.offsetX / e.nativeEvent.target.offsetWidth) * 100
    );
    const yCoord = Math.round(
      (e.nativeEvent.offsetY / e.nativeEvent.target.offsetHeight) * 100
    );
    const coords = { xCoord, yCoord };
    return coords;
  };

  const updateClickLocation = (coords) => {
    const { xCoord, yCoord } = coords;
    const updatedCoords = { left: xCoord + "%", top: yCoord + "%" };
    setClickLocation(updatedCoords);
    setShowDropdown(true);
  };

  const imageClick = (e) => {
    const coords = getLocationImageClick(e);
    setCoords(coords);
    updateClickLocation(coords);
  };

  const hideDropdown = () => setShowDropdown(false);

  const dropdownClick = (character) => {
    const gameSelection = { coords, character, gameId, level };
    firestore.collection("playerSelection").add(gameSelection);
    hideDropdown();
  };

  const submitScore = async () => {
    const highscoreRef = await firestore.collection("games").doc(gameId).get()
    const highscoreData = highscoreRef.data();
    const newHighscore = { gameId, level: highscoreData.level, time: highscoreData.elapsedSeconds, name: username };
    firestore.collection("highscores").add(newHighscore);
  };

  const [gameId, setgameId] = useState(null);
  const [image, setImage] = useState("");
  const [characters, setCharacters] = useState([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [coords, setCoords] = useState(null);
  const [clickLocation, setClickLocation] = useState({ left: "0%", top: "0%" });

  useEffect(() => {
    // Load level
    firestore
      .collection("levels")
      .where("level", "==", level)
      .get()
      .then(function (querySnapshot) {
        let charactersObj;
        querySnapshot.forEach(function (doc) {
          const { image, characters } = doc.data();
          charactersObj = characters.map((character) => {
            const obj = { character: character.name, found: false };
            return obj;
          });
          setImage(image);
          setCharacters(charactersObj);
        });
        return charactersObj;
      })
      .then((loadedCharacters) => {
        // Create game
        const timestamp = firebase.firestore.FieldValue.serverTimestamp();
        firestore
          .collection("games")
          .add({
            startTime: timestamp,
            level,
            characters: loadedCharacters,
          })
          .then((docRef) => {
            setgameId(docRef.id);
            firestore
              .collection("games")
              .doc(docRef.id)
              .onSnapshot((doc) => {
                const data = doc.data();
                setCharacters(data?.characters);
                setElapsedSeconds(data?.elapsedSeconds);
              });
          });
      });
  }, [level]);

  return (
    <GameWrapper characters={characters}>
      <div className="relative">
        <OutsideClickHandler onOutsideClick={hideDropdown}>
          <img
            className="w-full h-full"
            src={image}
            alt="Game Level"
            onClick={imageClick}
          />
          <CharacterDropdown
            show={showDropdown}
            characters={characters}
            clickLocation={clickLocation}
            clicked={dropdownClick}
          />
        </OutsideClickHandler>
      </div>
      <Modal
        showModal={elapsedSeconds}
        seconds={elapsedSeconds}
        username={username}
        updateUsername={updateUsername}
        submitScore={submitScore}
      />
    </GameWrapper>
  );
};

export default Game;
