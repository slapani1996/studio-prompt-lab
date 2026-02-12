"use client";

import { useState, useEffect, useCallback } from "react";
import Lottie from "lottie-react";
import type { AIGenerationLoaderProps } from "./types";
import animationData from "./animation.json";
import ringAnimationData from "./ringAnimation.json";

const DEFAULT_STATUS_MESSAGES = [
  "Preparing your creative canvas...",
  "AI is analyzing your inputs...",
  "Generating stunning visuals...",
  "Adding finishing touches...",
  "Almost there, magic happening...",
];

export function AIGenerationLoader({
  isVisible,
  statusMessages = DEFAULT_STATUS_MESSAGES,
}: AIGenerationLoaderProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [showLoader, setShowLoader] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  // Handle visibility transitions
  useEffect(() => {
    if (isVisible) {
      setShowLoader(true);
      setIsAnimatingOut(false);
    } else if (showLoader) {
      setIsAnimatingOut(true);
      const timer = setTimeout(() => {
        setShowLoader(false);
        setIsAnimatingOut(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible, showLoader]);

  // Reset state when becoming visible
  useEffect(() => {
    if (isVisible) {
      setCurrentMessageIndex(0);
      setDisplayedText("");
      setIsTyping(true);
    }
  }, [isVisible]);

  // Typewriter effect
  useEffect(() => {
    if (!isVisible) return;

    const currentMessage = statusMessages[currentMessageIndex];

    if (isTyping) {
      if (displayedText.length < currentMessage.length) {
        const timeout = setTimeout(() => {
          setDisplayedText(currentMessage.slice(0, displayedText.length + 1));
        }, 40);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setIsTyping(false);
        }, 2000);
        return () => clearTimeout(timeout);
      }
    } else {
      const timeout = setTimeout(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % statusMessages.length);
        setDisplayedText("");
        setIsTyping(true);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [isVisible, displayedText, isTyping, currentMessageIndex, statusMessages]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  if (!showLoader) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${isAnimatingOut ? "opacity-0" : "opacity-100"
        }`}
      onClick={handleBackdropClick}
    >
      {/* Backdrop - theme aware */}
      <div className="absolute inset-0 bg-gray-50 dark:bg-[#0a0a1a]" />

      {/* Colorful gradient orbs spread across the screen */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Top left - Blue */}
        <div className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-[150px]" />
        {/* Top right - Purple */}
        <div className="absolute -top-[5%] right-[10%] w-[450px] h-[450px] bg-purple-600/20 dark:bg-purple-600/10 rounded-full blur-[140px]" />
        {/* Center left - Pink */}
        <div className="absolute top-[30%] -left-[5%] w-[400px] h-[400px] bg-pink-500/15 dark:bg-pink-500/8 rounded-full blur-[130px]" />
        {/* Center right - Orange */}
        <div className="absolute top-[40%] right-[5%] w-[350px] h-[350px] bg-orange-500/15 dark:bg-orange-500/8 rounded-full blur-[120px]" />
        {/* Bottom left - Purple */}
        <div className="absolute bottom-[5%] left-[15%] w-[450px] h-[450px] bg-purple-500/15 dark:bg-purple-500/8 rounded-full blur-[140px]" />
        {/* Bottom right - Blue */}
        <div className="absolute -bottom-[10%] right-[20%] w-[500px] h-[500px] bg-blue-600/15 dark:bg-blue-600/8 rounded-full blur-[150px]" />
      </div>

      {/* Main content */}
      <div
        className={`relative flex flex-col items-center transition-all duration-500 ${isAnimatingOut ? "scale-95 opacity-0" : "scale-100 opacity-100"
          }`}
      >
        {/* Glow effect behind animation */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-blue-500/20 dark:bg-blue-500/10 blur-3xl ai-loader-glow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-purple-600/25 dark:bg-purple-600/15 blur-2xl ai-loader-glow-inner" />

        {/* Lottie Animation */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          {/* Ring animation (outer frame) */}
          <Lottie
            animationData={ringAnimationData}
            loop
            className="absolute inset-0 w-full h-full"
          />
          {/* Inner animation */}
          <Lottie
            animationData={animationData}
            loop
            className="w-40 h-40 ai-loader-image-icon"
          />
        </div>

        {/* Status text with typewriter and shine effect */}
        <div className="-mt-2 min-h-[60px] flex flex-col items-center">
          <p className="text-xl font-medium text-center px-4 ai-loader-shine flex items-center gap-2 text-gray-800 dark:text-white">
            {displayedText}
            <span className="ai-loader-cursor">|</span>
          </p>
        </div>
      </div>
    </div>
  );
}
