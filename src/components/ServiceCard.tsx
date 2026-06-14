import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { ServiceCardData } from "../types";

interface ServiceCardProps {
  card: ServiceCardData;
  onSelect: (id: string) => void;
  key?: React.Key;
}

export default function ServiceCard({ card, onSelect }: ServiceCardProps): React.JSX.Element {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Magnetic cursor tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // High performance spring
  const springX = useSpring(mouseX, { stiffness: 80, damping: 18, mass: 0.6 });
  const springY = useSpring(mouseY, { stiffness: 80, damping: 18, mass: 0.6 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xVal = (e.clientX - rect.left) / rect.width - 0.5;
    const yVal = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xVal);
    mouseY.set(yVal);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  // 12-column x 8-row grid blocks for pixelated dissolve hover state
  const blocks = Array.from({ length: 96 }).map((_, i) => {
    const row = Math.floor(i / 12);
    const col = i % 12;
    return { row, col, id: i };
  });

  // Calculate magnetic square shift
  const shiftX = useTransform(springX, (v) => v * 40);
  const shiftY = useTransform(springY, (v) => v * 40);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelect(card.id)}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="group relative aspect-[4/3] w-full overflow-hidden bg-zinc-900 cursor-pointer select-none"
      id={`card-${card.id}`}
    >
      {/* Background Image with slight scale on hover */}
      <motion.img
        src={card.image}
        alt={card.title}
        referrerPolicy="no-referrer"
        animate={{ scale: isHovered ? 1.05 : 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Dark gradient readability overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/15 to-transparent z-10" />

      {/* Grid of pixel-block overlays */}
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-8 w-full h-full pointer-events-none overflow-hidden z-10">
        {blocks.map((block) => {
          // Delay calculations from user specs
          const delayIn = (block.row + block.col) * 0.018;
          const delayOut = ((8 - block.row) + (12 - block.col)) * 0.012;

          return (
            <motion.div
              key={block.id}
              className="bg-black/85"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: isHovered ? 1 : 0,
                opacity: isHovered ? 1 : 0,
              }}
              transition={{
                duration: 0.25,
                ease: [0.22, 1, 0.36, 1],
                delay: isHovered ? delayIn : delayOut,
              }}
              style={{
                originX: 0.5,
                originY: 0.5,
              }}
            />
          );
        })}
      </div>

      {/* Magnetic construction squares */}
      {card.positions.map((sq, index) => (
        <motion.div
          key={index}
          style={{
            x: shiftX,
            y: shiftY,
            left: `${sq.x}%`,
            top: `${sq.y}%`,
            width: sq.s,
            height: sq.s,
          }}
          className="absolute bg-white border border-black/40 pointer-events-none z-20"
          initial={{ opacity: 0.8 }}
          animate={{
            scale: isHovered ? 1.25 : 1,
            rotate: isHovered ? 45 : 0,
            backgroundColor: isHovered ? "#ffffff" : "#000000",
            borderColor: isHovered ? "#000000" : "#ffffff",
          }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}

      {/* Plus button detail marker top right */}
      <motion.div
        animate={{ rotate: isHovered ? 90 : 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="absolute right-4 top-4 z-30 flex h-7 w-7 items-center justify-center border border-white/50 text-xs text-white bg-black/30 backdrop-blur-xs font-semibold"
      >
        +
      </motion.div>

      {/* Info Plate Bottom Left */}
      <div 
        className="absolute bottom-0 left-0 bg-white px-5 pb-4 pt-3.5 z-30 shadow-md border-r border-t border-black/5"
        style={{ maxWidth: "74%" }}
      >
        <h4 className="text-[clamp(1.2rem,2vw,1.75rem)] font-light leading-tight text-black tracking-tight">
          {card.title}
        </h4>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="text-[12px] text-black/60 font-medium">
            {card.category}
          </span>
          <div className="h-1.5 w-1.5 rounded-full bg-black/20" />
          <span className="text-[12px] font-bold text-black uppercase tracking-wider">
            {card.year}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
