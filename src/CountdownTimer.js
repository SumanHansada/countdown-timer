import React, { Fragment, useState, useEffect, useCallback } from "react";

function CountdownTimer() {
  const [initialTimerValue, setInitialTimerValue] = useState({
    minutes: 0,
    seconds: 0,
  });
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [timer, setTimer] = useState("00:00");
  const [timerInMS, setTimerInMs] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(true);

  const getTimeRemaining = useCallback(() => {
    const timeDiff = Date.parse(timerInMS) - Date.parse(new Date());
    const minutes = Math.floor((timeDiff / 1000 / 60) % 60);
    const seconds = Math.floor((timeDiff / 1000) % 60);
    console.log(timeDiff, minutes, seconds);
    return {
      timeDiff,
      minutes,
      seconds,
    };
  }, [timerInMS]);

  const getTimerTimeInMs = () => {
    let timerTime = new Date();
    let timerTimeInMs = Date.parse(timerTime);
    timerTimeInMs += minutes * 60000;
    timerTimeInMs += seconds * 1000;
    return new Date(timerTimeInMs);
  };

  useEffect(() => {
    let interval = null;
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        let { timeDiff, minutes, seconds } = getTimeRemaining();
        if (timeDiff >= 0) {
          setMinutes(minutes);
          setSeconds(seconds);
          setTimer(
            (minutes < 10 ? "0" + minutes : minutes) +
              ":" +
              (seconds < 10 ? "0" + seconds : seconds)
          );
        } else {
          clearInterval(interval);
          setIsActive(false);
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isActive, isPaused, getTimeRemaining]);

  const handleStart = () => {
    setTimerInMs(() => getTimerTimeInMs());
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePauseResume = () => {
    setTimerInMs(() => getTimerTimeInMs());
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    setTimer("00:00");
    setMinutes(initialTimerValue.minutes);
    setSeconds(initialTimerValue.seconds);
    setIsActive(false);
  };

  const setInputFields = (e) => {
    if (e.target.value < 0 || e.target.value === undefined) {
      return "00";
    } else if (e.target.value < 10) {
      return "0" + e.target.value;
    } else return e.target.value;
  };

  return (
    <Fragment>
      <label>
        <input
          type="number"
          onChange={(e) =>
            setMinutes(() => {
              setTimer((prev) => {
                let min = setInputFields(e);
                let sec = prev.split(":")[1] || "00";
                return min + ":" + sec;
              });
              setInitialTimerValue({
                ...initialTimerValue,
                minutes: +setInputFields(e),
              });
              return +setInputFields(e);
            })
          }
        />
        Minutes
      </label>
      <label>
        <input
          type="number"
          onChange={(e) =>
            setSeconds(() => {
              setTimer((prev) => {
                let min = prev.split(":")[0] || "00";
                let sec = setInputFields(e);
                return min + ":" + sec;
              });
              setInitialTimerValue({
                ...initialTimerValue,
                seconds: +setInputFields(e),
              });
              return +setInputFields(e);
            })
          }
        />
        Seconds
      </label>

      <button onClick={handleStart}>START</button>
      <button onClick={handlePauseResume}>PAUSE / RESUME</button>
      <button onClick={handleReset}>RESET</button>

      <h1 data-testid="running-clock">{timer}</h1>
    </Fragment>
  );
}

export default CountdownTimer;
