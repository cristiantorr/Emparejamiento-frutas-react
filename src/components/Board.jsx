import { useState, useEffect } from "react";
import "../styles/Board.css";
import { Fruits } from "../assets/Fruits";
function Board() {
  // Estado para manejar el tablero, contiene una matriz 4x5

  const [board, setBoard] = useState([
    [
      [" ", 0],
      [" ", 0],
      [" ", 0],
      [" ", 0],
      [" ", 0],
    ],
    [
      [" ", 0],
      [" ", 0],
      [" ", 0],
      [" ", 0],
      [" ", 0],
    ],
    [
      [" ", 0],
      [" ", 0],
      [" ", 0],
      [" ", 0],
      [" ", 0],
    ],
    [
      [" ", 0],
      [" ", 0],
      [" ", 0],
      [" ", 0],
      [" ", 0],
    ],
  ]);

  // 0 -> hidden amarillo
  // 1 -> visible verde
  //-1 -> focus azul

  // Estado para contar los pares emparejados

  const [matched, setMatched] = useState(0);
  // Estado que indica si es el segundo clic

  const [secondClick, setSecondClick] = useState(false);

  // Estado para almacenar la posición de la carta anterior seleccionada

  const [previousData, setPreviousData] = useState([]);

  // Estado para guardar el tiempo de inicio

  const [time, setTime] = useState();

  // useEffect que se ejecuta solo una vez al inicio, para configurar el juego
  useEffect(() => {
    setGame();
  }, []);

  // useEffect que se ejecuta cuando se emparejan todas las cartas
  // Aparece un mensaje de ganador con el tiempo en el cuál se demoro emparejando todas las cartas
  useEffect(() => {
    if (matched == 10) {
      setTimeout(() => {
        const totalTime = (Date.now() - time) / 1000;
        window.alert(
          `CONGRATUALATIONS , YOU WON ! TIME : ${totalTime} SECONDS`
        );
        window.location.href = "/";
      }, 250);
    }
  }, [matched]);

  // Función para inicializar el tablero con frutas aleatorias
  function setGame() {
    //console.log(Fruits);
    var i, fruitLoopCounter;
    // Se hace una copia del tablero en la constante bufferBoard
    const bufferBoard = [...board];
    // Primer bucle de frutas que cuenta de 0 menor 5, es como dividir 20 / 4, entonces todas las frutas se duplican 4 veces
    for (fruitLoopCounter = 0; fruitLoopCounter < 5; fruitLoopCounter++) {
      // Aca el bucle se ejecuta 4 veces
      for (i = 0; i < 4; i++) {
        // Aquí ponemos las frutas en los lugares correspondientes
        var a = Math.floor(Math.random() * 4);
        var b = Math.floor(Math.random() * 5);
        // Busca una celda vacía para colocar la fruta
        while (bufferBoard[a][b][0] != " ") {
          a = Math.floor(Math.random() * 4);
          b = Math.floor(Math.random() * 5);
        }
        // Si esta vacío simplemente se pone la fruta enel bucle
        bufferBoard[a][b][0] = Fruits[fruitLoopCounter];
      }
    }

    // Se actualiza el tablero cada vez que le damos actualizar
    setBoard(bufferBoard);
    setTime(Date.now());
  }

  // Función que maneja el clic en las cartas
  function handleClick(event) {
    // Verifica si la carta es oculta
    if (event.target.className == "row-value-hidden") {
      event.target.classList.add("row-value-hidden-animation");

      setTimeout(() => {
        // Se obtiene las cordenadas filas - columnas donde están las frutas
        const i = event.target.parentElement.id;
        const j = event.target.id;
        // Si el empajeramiento es 0 tenemos una validación seconClick
        var matched = 0;

        // Si es el segundo clic, se compara la carta seleccionada con la anterior

        if (secondClick) {
          if (board[previousData[0]][previousData[1]][0] == board[i][j][0]) {
            setMatched((previousScore) => previousScore + 1);
            matched = 1;
            const revertBoard = [...board];
            revertBoard[previousData[0]][previousData[1]][1] = 1;
            revertBoard[i][j][1] = 1;
            setBoard(revertBoard);
            setPreviousData([]);
          } else {
            // Si la fruta no coincide entonces se hace en medio segundo la animación de esconder las frutas
            setTimeout(() => {
              const revertBoard = [...board];
              revertBoard[previousData[0]][previousData[1]][1] = 0;
              revertBoard[i][j][1] = 0;
              setBoard(revertBoard);
              setPreviousData([]);
            }, 500);
          }
        }

        // Cambia el estado del segundo clic
        setSecondClick((prevState) => !prevState);
        event.target.classList.add("row-value-focus");

        // Actualiza la visibilidad del tablero

        const newVisiblityBoard = [...board];
        if (matched == 0) newVisiblityBoard[i][j][1] = -1;
        setPreviousData([i, j]);

        setBoard(newVisiblityBoard);
      }, 250);
    } else return;
  }
  return (
    <>
      <div className="main-wrapper">
        {board.map((row, rowIndex) => {
          return (
            <div className="row-wrapper" key={rowIndex} id={rowIndex}>
              {row.map((value, valueIndex) => {
                // Hacemos validaciones ternarias
                return value[1] == 0 ? (
                  <div
                    key={valueIndex}
                    className="row-value-hidden"
                    id={valueIndex}
                    onClick={handleClick}
                  >
                    {" "}
                  </div>
                ) : // Hacemos validaciones ternarias
                value[1] == 1 ? (
                  <div
                    key={valueIndex}
                    className="row-value-visible"
                    id={valueIndex}
                    onClick={handleClick}
                  >
                    {" "}
                    {value[0]}
                  </div>
                ) : (
                  <div
                    key={valueIndex}
                    className="row-value-focus"
                    id={valueIndex}
                    onClick={handleClick}
                  >
                    {value[0]}{" "}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Board;
