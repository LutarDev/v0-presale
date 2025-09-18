"use client"

import React from 'react'

interface CountdownTimerProps {
  timeLeft: number
  className?: string
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  timeLeft,
  className
}) => {
  const formatTime = (time: number) => {
    const days = Math.floor(time / (1000 * 60 * 60 * 24))
    const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((time % (1000 * 60)) / 1000)

    return { days, hours, minutes, seconds }
  }

  const { days, hours, minutes, seconds } = formatTime(timeLeft)

  return (
    <div className={`w-full ${className || ''}`}>
      <div className="flex flex-col items-center mb-2">
        <span className="text-white text-sm">Next price increase in</span>
      </div>
      
      <div className="border border-[rgba(255,255,255,0.1)] rounded-[10px] overflow-hidden">
        <div className="grid grid-cols-4 w-full p-[15px]">
          <div className="flex flex-col items-center gap-1">
            <span className="text-[rgba(255,255,255,0.65)] text-[10px] uppercase tracking-wide">
              Days
            </span>
            <span className="text-white text-[18px] font-semibold">
              {days.toString().padStart(2, '0')}
            </span>
          </div>
          
          <div className="flex flex-col items-center gap-1">
            <span className="text-[rgba(255,255,255,0.65)] text-[10px] uppercase tracking-wide">
              Hours
            </span>
            <span className="text-white text-[18px] font-semibold">
              {hours.toString().padStart(2, '0')}
            </span>
          </div>
          
          <div className="flex flex-col items-center gap-1">
            <span className="text-[rgba(255,255,255,0.65)] text-[10px] uppercase tracking-wide">
              Minutes
            </span>
            <span className="text-white text-[18px] font-semibold">
              {minutes.toString().padStart(2, '0')}
            </span>
          </div>
          
          <div className="flex flex-col items-center gap-1">
            <span className="text-[rgba(255,255,255,0.65)] text-[10px] uppercase tracking-wide">
              Seconds
            </span>
            <span className="text-white text-[18px] font-semibold">
              {seconds.toString().padStart(2, '0')}
            </span>
          </div>
        </div>
        
        <div className="text-[rgba(255,255,255,0.65)] text-[12px] text-center bg-[rgba(255,255,255,0.05)] w-full p-1">
          Presale ends in 30 days
        </div>
      </div>
    </div>
  )
}
