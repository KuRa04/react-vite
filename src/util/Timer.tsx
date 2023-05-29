import React, { useState, useEffect } from 'react';

type Props = {
  time: number
  isPlaying: boolean
}

const Timer: React.FC<Props> = ({ time, isPlaying }) => {
  const [seconds, setSeconds] = useState(time);

  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      setSeconds(prevSeconds => {
        if (prevSeconds === 0) {
          clearInterval(interval);
          return prevSeconds;
        }
        return prevSeconds - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [isPlaying]);

  return (
    <div>
      <h1>Countdown Timer</h1>
      <div>{seconds} seconds</div>
    </div>
  );
};

export default Timer;
