import { AppHelper } from "@/lib/helper";
import React, { useEffect, useRef, useState } from "react";

type ParsedTime = {
  minutes: number;
  seconds: number;
  addedTime: number;
  isValid: boolean;
};

const SPECIAL_STATES = [
  "HT",
  "FT",
  "AET",
  "PEN",
  "INT",
  "Pause",
  "Ended",
  "NS",
  "TBA",
];

const parseGameTime = (time: string): ParsedTime => {
  if (!time || SPECIAL_STATES.includes(time)) {
    return { minutes: 0, seconds: 0, addedTime: 0, isValid: false };
  }

  const cleaned = time.replace(/'/g, "").trim();

  if (/^\d+:\d{1,2}(\+\d+)?$/.test(cleaned)) {
    const [main, added] = cleaned.split("+");
    const [min, sec] = main.split(":");

    return {
      minutes: Number(min),
      seconds: Number(sec),
      addedTime: added ? Number(added) : 0,
      isValid: true,
    };
  }

  const [min, added] = cleaned.split("+");

  return {
    minutes: Number(min),
    seconds: 0,
    addedTime: added ? Number(added) : 0,
    isValid: !isNaN(Number(min)),
  };
};

const formatGameTime = (
  minutes: number,
  seconds: number,
  addedTime: number
): string => {
  const sec = seconds.toString().padStart(2, "0");
  return addedTime > 0
    ? `${minutes}'+${addedTime}:${sec}`
    : `${minutes}':${sec}`;
};

interface LiveTimeDisplayProps {
  eventTime: string;
  isLive?: boolean;
}

const LiveTimeDisplay: React.FC<LiveTimeDisplayProps> = ({
  eventTime: _event_time,
  isLive = true,
}) => {
  const eventTime =
    _event_time === "--:--"
      ? _event_time
      : AppHelper.extractCleanTime(_event_time);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [addedTime, setAddedTime] = useState(0);
  const [display, setDisplay] = useState(AppHelper.extractCleanTime(eventTime));

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Always clear previous interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!isLive) {
      setDisplay(eventTime);
      return;
    }

    const parsed = parseGameTime(eventTime);
    if (!parsed.isValid) {
      setDisplay(eventTime);
      return;
    }

    setMinutes(parsed.minutes);
    setSeconds(parsed.seconds);
    setAddedTime(parsed.addedTime);
    setDisplay(
      formatGameTime(parsed.minutes, parsed.seconds, parsed.addedTime)
    );

    intervalRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s < 59) return s + 1;
        setMinutes((m) => m + 1);
        return 0;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [eventTime, isLive]);

  useEffect(() => {
    setDisplay(formatGameTime(minutes, seconds, addedTime));
  }, [minutes, seconds, addedTime]);

  return <>{display}</>;
};

export default LiveTimeDisplay;
