import { useEffect, useState } from "react";

export default function CountdownTimer({ targetDate }) {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex justify-center gap-3 md:gap-6">
      <div className="flex flex-col items-center" role="timer" aria-label={`${timeLeft.days} days`}>
        <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-100 tabular-nums">{String(timeLeft.days).padStart(2, '0')}</span>
        <span className="text-xs md:text-sm text-blue-200 mt-1 font-medium">Days</span>
      </div>
      <div className="flex flex-col items-center" role="timer" aria-label={`${timeLeft.hours} hours`}>
        <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-100 tabular-nums">{String(timeLeft.hours).padStart(2, '0')}</span>
        <span className="text-xs md:text-sm text-blue-200 mt-1 font-medium">Hours</span>
      </div>
      <div className="flex flex-col items-center" role="timer" aria-label={`${timeLeft.minutes} minutes`}>
        <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-100 tabular-nums">{String(timeLeft.minutes).padStart(2, '0')}</span>
        <span className="text-xs md:text-sm text-blue-200 mt-1 font-medium">Minutes</span>
      </div>
      <div className="flex flex-col items-center" role="timer" aria-label={`${timeLeft.seconds} seconds`}>
        <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-100 tabular-nums">{String(timeLeft.seconds).padStart(2, '0')}</span>
        <span className="text-xs md:text-sm text-blue-200 mt-1 font-medium">Seconds</span>
      </div>
    </div>
  );
}