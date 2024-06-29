import React, { useEffect } from "react";

export default function TimerTwo({ dispatch, secondsRemaining }) {
    const mins = Math.floor(secondsRemaining / 60);
    const seconds = secondsRemaining % 60;
  useEffect(
    function () {
      const id = setInterval(function () {
        dispatch({type :"ticktack"});
      }, 1000);
      return () => clearInterval(id);
    },
    [dispatch]
  );

  return <div className="timer">{mins < 10 ? "0" : null}{mins}:{seconds < 10 ? "0" : null}{seconds}</div>;
}
