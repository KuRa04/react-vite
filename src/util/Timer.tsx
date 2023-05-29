import React, { useState, useEffect } from 'react';

type Props = {
  time: number
}

const Timer: React.FC<Props> = ({ time }) => {
  const [seconds, setSeconds] = useState(time);

  useEffect(() => {
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
  }, []);

  return (
    <div>
      <h1>Countdown Timer</h1>
      <div>{seconds} seconds</div>
    </div>
  );
};

export default Timer;
