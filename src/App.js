import "./App.css";
import { useState } from "react";

function App() {
  const [displayTime, setdisplayTime] = useState(25 * 60);
  const [breakTime, setbreakTime] = useState(5 * 60);
  const [sessionTime, setsessionTime] = useState(25 * 60);
  const [timerOn, settimerOn] = useState(false);
  const [onBreak, setonBreak] = useState(false);
  const [breakAudio, setBreakAudio] = useState(
    new Audio(
      "https://cdn.ytsservice.com/cdn-resource/yt/461d3ab3f7384828a26d76ffc13c7dac_140.mp3?secure=fdidrB9lEoTIkhw8qTLjmA==,1656935522&response-content-disposition=filename=Censor%20Beep%20Sound%20Effect.mp3&response-content-type=application/octet-stream"
    )
  );

  const playBreakSound = () => {
    breakAudio.currentTime = 0;
    breakAudio.play();
  };
  const formatTime = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    return (
      (minutes < 10 ? "0" + minutes : minutes) +
      ":" +
      (seconds < 10 ? "0" + seconds : seconds)
    );
  };
  const changeTime = (amount, type) => {
    if (type === "break") {
      if (breakTime <= 60 && amount < 0) {
        return;
      }
      setbreakTime((prev) => prev + amount);
    } else {
      if (sessionTime <= 60 && amount < 0) {
        return;
      }
      setsessionTime((prev) => prev + amount);
      if (!timerOn) {
        setdisplayTime(sessionTime + amount);
      }
    }
  };
  const controlTime = () => {
    let second = 1000;
    let date = new Date().getTime();
    let nextDate = new Date().getTime() + second;
    let onBreakVariable = onBreak;
    if (!timerOn) {
      let interval = setInterval(() => {
        date = new Date().getTime();
        if (date > nextDate) {
          setdisplayTime((prev) => {
            if (prev <= 0 && !onBreakVariable) {
              playBreakSound();
              onBreakVariable = false;
              setonBreak(true);
              return breakTime;
            } else if (prev <= 0 && onBreakVariable) {
              playBreakSound();
              onBreakVariable = false;
              setonBreak(false);
              return sessionTime;
            }
            return prev - 1;
          });
          nextDate += second;
        }
      }, 30);
      localStorage.clear();
      localStorage.setItem("interval-id", interval);
    }
    if (timerOn) {
      clearInterval(localStorage.getItem("interval-id"));
    }
    settimerOn(!timerOn);
  };
  const reset = () => {
    setdisplayTime(25 * 60);
    setbreakTime(5 * 60);
    setsessionTime(25 * 60);
  };
  return (
    <div className="App center-align">
      <h1>Pomodoro clock</h1>
      <div className="dual-container">
        <Length
          title={"break length"}
          changeTime={changeTime}
          type={"break"}
          time={breakTime}
          titleID={"break-label"}
          decrement={"break-decrement"}
          increment={"break-increment"}
          length={"break-length"}
          formatTime={formatTime}
        />
        <Length
          title={"session length"}
          changeTime={changeTime}
          type={"session"}
          time={sessionTime}
          titleID={"session-label"}
          decrement={"session-decrement"}
          increment={"session-increment"}
          length={"session-length"}
          formatTime={formatTime}
        />
      </div>
      <h3 id="timer-label">{onBreak ? "Break" : "Session"}</h3>
      <h1 id="time-left">{formatTime(displayTime)}</h1>
      <button
        id="start_stop"
        className="btn-large deep-purple lighten-2"
        onClick={controlTime}
      >
        {timerOn ? (
          <i className="material-icons">pause_circle_filled</i>
        ) : (
          <i className="material-icons">play_circle_filled</i>
        )}
      </button>
      <button
        id="reset"
        className="btn-large deep-purple lighten-2"
        onClick={reset}
      >
        <i className="material-icons">autorenew</i>
      </button>
    </div>
  );
}

function Length({
  title,
  changeTime,
  type,
  formatTime,
  time,
  titleID,
  decrement,
  increment,
  length,
}) {
  return (
    <div>
      <h3 id={titleID}>{title}</h3>
      <div className="time-sets">
        <button
          className="btn-small deep-purple lighten-2"
          onClick={() => changeTime(-60, type)}
        >
          <i className="material-icons" id={decrement}>
            arrow_downward
          </i>
        </button>
        <h3 id={length}>{formatTime(time)}</h3>
        <button
          id={increment}
          className="btn-small deep-purple lighten-2"
          onClick={() => changeTime(60, type)}
        >
          <i className="material-icons">arrow_upward</i>
        </button>
      </div>
    </div>
  );
}

export default App;
