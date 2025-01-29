"use client";

import { FC, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from '../../context/LanguageContext';
import { getTranslation } from '@/app/utils/translations';
import {
  FaGraduationCap,
  FaLaptopCode,
  FaBalanceScale,
  FaPaintBrush,
  FaHeartbeat,
  FaFlask,
  FaCogs,
  FaSeedling,
  FaBook,
  FaUserGraduate,
  FaCog,
} from "react-icons/fa";

interface SmallCirclesProps {
  animate: boolean;
  onSelect: (majorKey: string) => void;
}

interface CircleContent {
  icon: any;
  text: string;
  majorKey: string;
  position: {
    angle: number;
    radius: number;
    offsetX?: number;
    offsetY?: number;
    rotate?: number;
  };
}

const SmallCircles: FC<SmallCirclesProps> = ({ animate, onSelect }) => {
  const { language } = useLanguage();
  const [activeCircle, setActiveCircle] = useState(0);
  const router = useRouter();

  const handleCircleClick = (index: number, majorKey: string) => {
    setActiveCircle(index);
    onSelect(majorKey);
    router.push(`/majors?major=${encodeURIComponent(majorKey)}`);
  };

  const circleContent: CircleContent[] = [
    {
      icon: FaGraduationCap,
      text: getTranslation("Education", language),
      majorKey: "Education",
      position: { angle: -82, radius: 250, offsetX: 2, offsetY: 0, rotate: 10 },
    },
    {
      icon: FaLaptopCode,
      text: getTranslation("Information Technology", language),
      majorKey: "Communications and Information Technology",
      position: { angle: -49, radius: 250, offsetX: 0, rotate: 30 },
    },
    {
      icon: FaBalanceScale,
      text: getTranslation("Business and Law", language),
      majorKey: "Business, administration and law",
      position: { angle: -16, radius: 250, offsetX: 0, rotate: -5 },
    },
    {
      icon: FaPaintBrush,
      text: getTranslation("Arts and Humanities", language),
      majorKey: "Arts and Humanities",
      position: { angle: 17, radius: 250, offsetX: 0, rotate: 15 },
    },
    {
      icon: FaHeartbeat,
      text: getTranslation("Health and Welfare", language),
      majorKey: "Health and Welfare",
      position: { angle: 50, radius: 250, offsetX: 0, rotate: -40 },
    },
    {
      icon: FaFlask,
      text: getTranslation("Sciences and Mathematics", language),
      majorKey: "Natural Sciences, Mathematics and Statistics",
      position: { angle: 83, radius: 250, offsetX: 0, rotate: 0 },
    },
    {
      icon: FaCogs,
      text: getTranslation("Engineering", language),
      majorKey: "Engineering, manufacturing and construction",
      position: { angle: 116, radius: 250, offsetX: 0, rotate: 30 },
    },
    {
      icon: FaSeedling,
      text: getTranslation("Agriculture", language),
      majorKey: "Agriculture, Forestry, Fisheries and Veterinary",
      position: { angle: 149, radius: 250, offsetX: 0, rotate: -35 },
    },
    {
      icon: FaBook,
      text: getTranslation("Social Sciences", language),
      majorKey: "Social Sciences, Journalism, Information",
      position: { angle: 182, radius: 250, offsetX: 0, rotate: 0 },
    },
    {
      icon: FaUserGraduate,
      text: getTranslation("Generic Programs", language),
      majorKey: "Generic Programs and Qualifications",
      position: { angle: 215, radius: 250, offsetX: 0, rotate: 30 },
    },
    {
      icon: FaCog,
      text: getTranslation("Services", language),
      majorKey: "Services",
      position: { angle: 248, radius: 250, offsetX: -5, rotate: -30 },
    },
  ];

  useEffect(() => {
    if (animate) {
      const interval = setInterval(() => {
        setActiveCircle((prev) => {
          const nextCircle = (prev + 1) % circleContent.length;
          if (animate) {
            // Wrap the state update in a setTimeout to avoid render phase updates
            setTimeout(() => {
              onSelect(circleContent[nextCircle].majorKey);
            }, 0);
          }
          return nextCircle;
        });
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [animate, circleContent, onSelect]);

  useEffect(() => {
    if (animate) {
      onSelect(circleContent[activeCircle].majorKey);
    }
  }, [activeCircle, animate, onSelect]);

  const getBubbleDirection = (angle: number) => {
    const normalizedAngle = ((angle % 360) + 360) % 360;

    if (normalizedAngle >= 315 || normalizedAngle < 45)
      return "chat-bubble-left";
    if (normalizedAngle >= 45 && normalizedAngle < 135)
      return "chat-bubble-top";
    if (normalizedAngle >= 135 && normalizedAngle < 225)
      return "chat-bubble-right";
    return "chat-bubble-bottom";
  };

  const getGradientDirection = (angle: number) => {
    const normalizedAngle = ((angle % 360) + 360) % 360;

    if (normalizedAngle >= 315 || normalizedAngle < 45)
      return "bg-gradient-to-l from-[#477495]/20 via-[#477495]/10 to-[#477495]/90";
    if (normalizedAngle >= 45 && normalizedAngle < 135)
      return "bg-gradient-to-t from-[#477495]/20 via-[#477495]/10 to-[#477495]/90";
    if (normalizedAngle >= 135 && normalizedAngle < 225)
      return "bg-gradient-to-r from-[#477495]/20 via-[#477495]/10 to-[#477495]/90";
    return "bg-gradient-to-b from-[#477495]/20 via-[#477495]/10 to-[#477495]/90";
  };

  return (
    <div className="relative w-[100%] h-[65%] flex items-center justify-center mt-10 2xl:h-[70%]">
      {circleContent.map((content, index) => {
        const angleInRadians = (content.position.angle * Math.PI) / 180;
        const x =
          content.position.radius * Math.cos(angleInRadians) +
          (content.position.offsetX || 0);
        const y =
          content.position.radius * Math.sin(angleInRadians) +
          (content.position.offsetY || 0);
        const bubbleDirection = getBubbleDirection(content.position.angle);
        const GradientDirection = getGradientDirection(content.position.angle);
        const Icon = content.icon;
        const rotation = content.position.rotate || 0;

        return (
          <div
            key={index}
            className="absolute transition-all duration-1000 "
            style={{
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
              opacity: animate ? 1 : 0,
              transform: `translate(-50%, -50%) scale(${animate ? 1 : 0})`,
              transitionDelay: `${index * 100}ms`,
            }}
          >
            <div
              className={`w-[135px] h-[135px] chat-bubble ${bubbleDirection} small-circle border border-[#2ab1bb] rounded-full ${
                activeCircle === index ? "small-circle-glow" : ""
              } ${GradientDirection} cursor-pointer hover:scale-110 transition-transform duration-300`}
              style={{
                transform: `rotate(${rotation}deg)`,
                animationDelay: `${index * 100}ms`,
              }}
              onClick={() => {
                setActiveCircle(index);
                onSelect(content.majorKey);
                handleCircleClick(index, content.majorKey);
              }}
            >
              <div
                className="absolute inset-0 flex flex-col items-center justify-center border border-[#2ab1bb] rounded-full"
                style={{ transform: `rotate(${-rotation}deg)` }}
              >
                <Icon className="text-[#4EC9ED] text-2xl mb-1" size={35} />
                <span className="text-[#FFFFFF] text-lg font-medium px-2 leading-tight">
                  {content.text}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SmallCircles;
