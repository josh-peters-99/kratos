import React from 'react';

const CircularProgress = ({ value, max = 100 }) => {
  const radius = 50;
  const strokeWidth = 10;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset =
    circumference - (value / max) * circumference;

  return (
    <div className='flex flex-col items-center'>
      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform rotate-[-90deg]"
      >
        <circle
          stroke="#2c2f36"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="#3b82f6"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference + ' ' + circumference}
          strokeLinecap="round"
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="transition-all duration-300"
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy=".3em"
          className="text-lg font-semibold text"
          fill="white"
          transform="rotate(90, 50, 50)"
        >
          {`${Math.round((value / max) * 100)}%`}
        </text>
      </svg>
    </div>
  );
};

export default CircularProgress;
