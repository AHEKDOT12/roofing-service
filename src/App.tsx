/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "motion/react";
import { 
  Phone, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  ChevronRight, 
  MessageSquare, 
  Send, 
  AlertTriangle, 
  Info,
  Calendar,
  Layers,
  FileCheck2,
  Trash2
} from "lucide-react";

import { ServiceCardData, CalculationRequest } from "./types";
import ServiceCard from "./components/ServiceCard";
import LeadModal from "./components/LeadModal";

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [preSelectedServiceId, setPreSelectedServiceId] = useState("roof-repair");
  const [requests, setRequests] = useState<CalculationRequest[]>([]);
  const [showNotification, setShowNotification] = useState<string | null>(null);

  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // Scroll Progress for top floating parallax squares
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Load requests from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("bishkek_roofing_requests");
      if (saved) {
        setRequests(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Local storage is disabled or corrupted", e);
    }
  }, []);

  // Save requests to localStorage when they change
  const saveRequests = (newRequests: CalculationRequest[]) => {
    setRequests(newRequests);
    try {
      localStorage.setItem("bishkek_roofing_requests", JSON.stringify(newRequests));
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddRequest = (req: CalculationRequest) => {
    const updated = [req, ...requests];
    saveRequests(updated);
    
    // Trigger success notification
    setShowNotification(`Заявка ${req.id} создана успешно!`);
    setTimeout(() => {
      setShowNotification(null);
    }, 5000);
  };

  const handleDeleteRequest = (id: string) => {
    const updated = requests.filter(r => r.id !== id);
    saveRequests(updated);
  };

  // Launch modal with requested service
  const handleLaunchModal = (serviceId: string) => {
    setPreSelectedServiceId(serviceId);
    setModalOpen(true);
  };

  // Scroll elements into view
  const scrollToServices = () => {
    const element = document.getElementById("services-grid-anchor");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // 8 parallax squares specs: (x%, y%, size px)
  const squares = [
    { x: 6, y: 20, s: 12 },
    { x: 12, y: 32, s: 8 },
    { x: 8, y: 44, s: 6 },
    { x: 88, y: 18, s: 10 },
    { x: 92, y: 30, s: 14 },
    { x: 85, y: 42, s: 7 },
    { x: 90, y: 52, s: 5 },
    { x: 14, y: 56, s: 5 },
  ];

  // 4 services data
  const services: ServiceCardData[] = [
    {
      id: "roof-repair",
      title: "Ремонт кровли",
      category: "Протечки, мягкая кровля, восстановление покрытия",
      year: "от 1 дня",
      image: "https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=800",
      positions: [
        { x: 5, y: 30, s: 16 },
        { x: 10, y: 42, s: 10 },
        { x: 3, y: 52, s: 7 },
        { x: 80, y: 70, s: 14 },
        { x: 85, y: 82, s: 9 },
        { x: 78, y: 60, s: 6 }
      ]
    },
    {
      id: "roof-installation",
      title: "Монтаж крыши",
      category: "Кровля под ключ для домов и коммерческих объектов",
      year: "под ключ",
      image: "https://images.pexels.com/photos/2800832/pexels-photo-2800832.jpeg?auto=compress&cs=tinysrgb&w=800",
      positions: [
        { x: 82, y: 55, s: 16 },
        { x: 88, y: 68, s: 10 },
        { x: 78, y: 72, s: 7 },
        { x: 85, y: 42, s: 6 },
        { x: 90, y: 80, s: 8 }
      ]
    },
    {
      id: "facade-works",
      title: "Фасадные работы",
      category: "Покраска, очистка, герметизация и ремонт фасадов",
      year: "Бишкек",
      image: "https://images.pexels.com/photos/159306/construction-site-build-construction-work-159306.jpeg?auto=compress&cs=tinysrgb&w=800",
      positions: [
        { x: 4, y: 24, s: 16 },
        { x: 10, y: 36, s: 10 },
        { x: 2, y: 44, s: 7 },
        { x: 78, y: 78, s: 14 },
        { x: 84, y: 88, s: 8 }
      ]
    },
    {
      id: "industrial-climbing",
      title: "Промальпинизм",
      category: "Высотные работы без строительных лесов",
      year: "безопасно",
      image: "https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=800",
      positions: [
        { x: 82, y: 26, s: 14 },
        { x: 88, y: 38, s: 10 },
        { x: 78, y: 44, s: 7 },
        { x: 84, y: 54, s: 5 },
        { x: 90, y: 60, s: 8 }
      ]
    }
  ];

  // Animated elements triggers
  const textInViewRef = useRef(null);
  const isTextInView = useInView(textInViewRef, { once: true, margin: "-60px" });

  const marqueeItems = [
    { name: "Ремонт кровли", iconId: "roof" },
    { name: "Мягкая кровля", iconId: "layers" },
    { name: "Монтаж крыши", iconId: "arrow" },
    { name: "Фасадные работы", iconId: "grid" },
    { name: "Промальпинизм", iconId: "rope" },
    { name: "Герметизация швов", iconId: "lines" },
    { name: "Водостоки", iconId: "wave" },
    { name: "Выезд на объект", iconId: "plus" }
  ];

  // Double items for infinite marquee loop
  const doubledMarquee = [...marqueeItems, ...marqueeItems];

  // Render SVG icons for Marquee
  const renderMarqueeIcon = (id: string) => {
    switch (id) {
      case "roof":
        return (
          <svg width="22" height="18" viewBox="0 0 22 18" className="text-black" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="2,10 11,2 20,10" />
            <path d="M5 9V16H17V9" />
          </svg>
        );
      case "layers":
        return (
          <svg width="22" height="18" viewBox="0 0 22 18" className="text-black" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 5L11 1L20 5L11 9L2 5Z" />
            <path d="M2 10L11 14L20 10" />
            <path d="M2 14L11 18L20 14" />
          </svg>
        );
      case "arrow":
        return (
          <svg width="18" height="18" viewBox="0 0 18 18" className="text-black" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round">
            <line x1="2" y1="16" x2="16" y2="2" />
            <polyline points="7,2 16,2 16,11" />
          </svg>
        );
      case "grid":
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" className="text-black">
            {[3, 10, 17].map((x) =>
              [3, 10, 17].map((y) => (
                <circle key={`${x}-${y}`} cx={x} cy={y} r="2.2" fill="currentColor" />
              ))
            )}
          </svg>
        );
      case "rope":
        return (
          <svg width="22" height="22" viewBox="0 0 22 22" className="text-black" strokeWidth="1.8" stroke="currentColor" fill="none" strokeLinecap="round">
            <circle cx="11" cy="5" r="3" />
            <path d="M11 8V20" />
            <path d="M7 12C9 14 13 14 15 12" />
            <path d="M8 17H14" />
          </svg>
        );
      case "lines":
        return (
          <svg width="24" height="18" viewBox="0 0 24 18" className="text-black" strokeWidth="2.2" stroke="currentColor" fill="none" strokeLinecap="round">
            <line x1="0" y1="3" x2="24" y2="3" />
            <line x1="6" y1="9" x2="24" y2="9" />
            <line x1="0" y1="15" x2="18" y2="15" />
          </svg>
        );
      case "wave":
        return (
          <svg width="22" height="22" viewBox="0 0 22 22" className="text-black" strokeWidth="1.5" stroke="currentColor" fill="none">
            <circle cx="11" cy="11" r="9" />
            <path d="M5 12Q8 8 11 12Q14 16 17 12" />
          </svg>
        );
      case "plus":
        return (
          <svg width="18" height="18" viewBox="0 0 18 18" className="text-black">
            <rect x="7.5" y="0" width="3" height="18" fill="currentColor" />
            <rect x="0" y="7.5" width="18" height="3" fill="currentColor" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <section 
      ref={sectionRef} 
      className="relative bg-white text-black min-h-screen selection:bg-neutral-950 selection:text-white"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Toast Notification for requested quote */}
      {showNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-black text-white px-5 py-4 shadow-xl border border-white/20 text-xs font-mono max-w-sm flex items-center justify-between gap-4 animate-fade-in animate-duration-300">
          <span>{showNotification}</span>
          <button onClick={() => setShowNotification(null)} className="text-white/60 hover:text-white">✕</button>
        </div>
      )}

      {/* Marquee Keyframes Injected Style */}
      <style>{`
        @keyframes marqueeServices {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .marquee-services {
          animation: marqueeServices 28s linear infinite;
        }
        .marquee-services:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Premium Navigation Header block */}
      <header className="sticky top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-40 border-b border-black/[0.06] py-4 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 bg-black" />
            <span className="text-xs font-bold tracking-widest text-black uppercase font-sans">
              BISHKEK ROOFING
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-6 text-xs text-black/60 font-medium">
            <span className="hover:text-black transition cursor-pointer" onClick={scrollToServices}>Услуги</span>
            <span className="hover:text-black transition cursor-pointer" onClick={() => {
              const el = document.getElementById("process-anchor");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}>Процесс работ</span>
            {requests.length > 0 && (
              <span className="hover:text-black transition cursor-pointer font-bold text-black border-b border-black/30" onClick={() => {
                const el = document.getElementById("active-requests-dashboard");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}>
                Заявки ({requests.length})
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <a 
              href="mailto:daniil.tkachei@gmail.com" 
              className="text-xs font-semibold text-black/80 hover:text-black hidden lg:inline-block font-mono"
            >
              daniil.tkachei@gmail.com
            </a>
            <a 
              href="tel:+996555010203" 
              className="px-3 py-1.5 border border-black/10 rounded-sm hover:border-black text-[12px] font-bold text-black flex items-center gap-1.5 transition"
            >
              <Phone size={12} />
              <span className="hidden sm:inline">+996 (555) 01-02-03</span>
              <span className="sm:hidden">Позвонить</span>
            </a>
          </div>
        </div>
      </header>

      {/* Top Area / Hero Header with floating construction squares */}
      <div className="relative px-6 pb-10 pt-32 sm:px-10 lg:px-16 lg:pt-40 overflow-hidden">
        
        {/* Parallax floating squares layer */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {squares.map((sq, index) => {
            // Parallax spring animations
            const rawY = useTransform(scrollYProgress, [0, 1], [0, -(80 + index * 30)]);
            const smoothY = useSpring(rawY, { stiffness: 40, damping: 20 });

            return (
              <motion.div
                key={index}
                style={{
                  position: "absolute",
                  left: `${sq.x}%`,
                  top: `${sq.y}%`,
                  y: smoothY,
                  zIndex: 5,
                }}
              >
                {/* Gentle infinite bob element */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 3 + index * 0.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.3,
                  }}
                  style={{
                    width: sq.s,
                    height: sq.s,
                  }}
                  className="bg-black"
                />
              </motion.div>
            );
          })}
        </div>

        {/* Header Text Group / Dynamic Entry */}
        <div className="relative mx-auto max-w-7xl text-center">
          <motion.div
            ref={textInViewRef}
            initial={{ opacity: 0, y: 24 }}
            animate={isTextInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Custom Location Badge */}
            <span className="mb-5 inline-block bg-black px-4 py-1.5 text-[13px] font-medium tracking-wide text-white uppercase">
              Кровельные работы в Бишкеке
            </span>

            {/* Sharp Architectural Heading */}
            <h1 className="text-[clamp(1.8rem,4.5vw,3.6rem)] font-light leading-[1.15] tracking-tight text-black max-w-4xl mx-auto">
              Ремонт и монтаж крыш <br />
              <span className="text-black/40">без лишних обещаний</span>
            </h1>

            {/* Elegant descriptive subtitle */}
            <p className="mx-auto mt-6 max-w-2xl text-[15px] leading-[1.7] text-black/60 font-light">
              Выполняем профессиональные кровельные, фасадные и высотные работы в Бишкеке и Чуйской области: от точечной локализации протечек до полного монтажа кровли под ключ с гарантией до 15 лет по договору.
            </p>

            {/* Control buttons alignment */}
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button 
                onClick={() => handleLaunchModal("roof-repair")}
                className="bg-black px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-black/85 flex items-center gap-2 cursor-pointer"
              >
                Получить расчёт стоимости
              </button>
              <button 
                onClick={scrollToServices}
                className="border border-black/20 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-black transition hover:bg-black hover:text-white cursor-pointer"
              >
                Посмотреть услуги
              </button>
            </div>
            
            <div className="mt-10 flex items-center justify-center gap-8 text-[11px] text-black/50 font-mono tracking-wider">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                Выезд на замер — 0 сом
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                Договор & Гарантия
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Services Section Grid */}
      <div id="services-grid-anchor" className="mx-auto max-w-7xl px-6 pb-20 pt-10 sm:px-10 lg:px-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 border-b border-black/[0.08] pb-6">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-black/45 font-mono">01 — Основной каталог</span>
            <h2 className="text-2xl font-light tracking-tight text-black mt-1">
              Архитектурные Решения & Монтаж
            </h2>
          </div>
          <p className="text-xs text-black/50 max-w-xs mt-2 md:mt-0 leading-relaxed font-light">
            Кликните на интересующее направление, чтобы перейти в калькулятор сметы и выбрать материалы.
          </p>
        </div>

        {/* 2-column Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {services.map((card, idx) => (
            <ServiceCard 
              key={card.id} 
              card={card} 
              onSelect={handleLaunchModal}
            />
          ))}
        </div>
      </div>

      {/* Trust / Process Area under cards */}
      <div id="process-anchor" className="mx-auto max-w-7xl px-6 pb-20 sm:px-10 lg:px-16">
        <div className="mb-8 border-b border-black/[0.08] pb-6">
          <span className="text-[10px] uppercase tracking-widest text-black/45 font-mono">02 — Регламент взаимодействия</span>
          <h2 className="text-2xl font-light tracking-tight text-black mt-1">
            Как мы строим работу
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Бесплатный осмотр",
              text: "Оцениваем состояние крыши, фасада или объекта и объясняем, какие именно работы действительно требуются для решения задачи без навязывания лишнего.",
            },
            {
              title: "Расчёт сметы",
              text: "Фиксируем детальный объём необходимых работ, качественные материалы, окончательные сроки и стоимость до официального начала проекта.",
            },
            {
              title: "Работа под ключ",
              text: "Берём на себя комплексный монтаж, ремонт, высотные работы промышленными альпинистами, капитальный вывоз мусора и финальный контроль результата.",
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: index * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="border border-black/10 p-6 md:p-8 hover:border-black/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="mb-5 h-3 w-3 bg-black" />
                <h3 className="text-base font-semibold text-black font-sans">{item.title}</h3>
                <p className="mt-3 text-[14px] leading-[1.7] text-black/60 font-light">{item.text}</p>
              </div>
              <div className="mt-6 text-[11px] font-mono text-black/35">
                ЭТАП 0{index + 1}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Active User Requests Dashboard Section (Only if there are requests) */}
      {requests.length > 0 && (
        <div id="active-requests-dashboard" className="bg-neutral-50 border-t border-b border-black/5 py-12 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-black/50">Сохраненные спецификации</span>
                <h3 className="text-lg font-light tracking-tight text-white/90 text-black">Ваши запросы на расчёт ({requests.length})</h3>
              </div>
              <span className="text-xs text-black/50 font-mono hidden sm:inline">Данные сохранены локально на вашем устройстве</span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {requests.map((r) => (
                <div key={r.id} className="bg-white border border-black/10 p-5 shadow-xs relative group">
                  <button 
                    onClick={() => handleDeleteRequest(r.id)} 
                    className="absolute top-3 right-3 text-black/30 hover:text-red-600 transition p-1"
                    title="Удалить расчет"
                  >
                    <Trash2 size={13} />
                  </button>

                  <div className="text-[10px] font-mono text-black/45 mb-1.5 flex items-center justify-between pr-6">
                    <span>{r.id}</span>
                    <span>{r.submittedAt}</span>
                  </div>

                  <h4 className="text-sm font-semibold text-black truncate">{r.serviceTitle}</h4>
                  
                  <div className="mt-2 space-y-1 text-xs text-black/60">
                    <p>Площадь: <strong className="text-black font-mono">{r.area} м²</strong></p>
                    <p className="truncate">Класс: {r.tier === "standard" ? "Эконом" : r.tier === "elite" ? "Бизнес" : "Индустриальный"}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] uppercase text-black/40 block">Ориентир сметы</span>
                      <span className="text-sm font-bold font-mono text-black">{r.estimatedCost.toLocaleString("ru-RU")} сом</span>
                    </div>
                    <span className="bg-green-100 text-green-800 text-[10px] px-2 py-0.5 rounded-sm font-medium flex items-center gap-1">
                      <span className="h-1 w-1 rounded-full bg-green-500 animate-pulse" />
                      На проверке
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer Area / Lead Conversion Block */}
      <div className="mx-auto max-w-7xl px-6 pb-6 pt-12 sm:px-10 lg:px-16 border-t border-black/[0.08]">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          
          {/* Left Side / Action Description */}
          <div className="max-w-md">
            {/* Architectural Plus button */}
            <div className="mb-4 flex h-7 w-7 items-center justify-center border border-black/20 text-xs text-black font-mono">
              +
            </div>
            <p className="text-[14px] leading-[1.7] text-black/60 font-light font-sans">
              Оставьте заявку — мы свяжемся с вами, уточним техническую задачу и бесплатно подготовим предварительный сметный расчёт по кровле, фасаду или высотным монтажным работам. Без давления, лишних обещаний и скрытых условий.
            </p>

            {/* Custom group-hover climbing button */}
            <button 
              onClick={() => handleLaunchModal("roof-repair")}
              className="group mt-6 flex items-end gap-3 cursor-pointer select-none"
            >
              <span className="inline-flex items-center gap-[10px] border border-black/20 bg-black px-5 py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-black/85">
                Заказать расчёт сметы
              </span>
              
              {/* Sliding dynamic marker */}
              <div className="mb-6 flex h-6 w-6 shrink-0 items-center justify-center bg-black transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:mb-9">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M18.75 6V15.75C18.75 15.949 18.671 16.14 18.53 16.28C18.39 16.421 18.199 16.5 18 16.5C17.801 16.5 17.61 16.421 17.47 16.28C17.329 16.14 17.25 15.949 17.25 15.75V7.81L6.53 18.53C6.39 18.671 6.199 18.75 6 18.75C5.801 18.75 5.61 18.671 5.47 18.53C5.329 18.39 5.25 18.199 5.25 18C5.25 17.801 5.329 17.61 5.47 17.47L16.19 6.75H8.25C8.051 6.75 7.86 6.671 7.72 6.53C7.579 6.39 7.5 6.199 7.5 6C7.5 5.801 7.579 5.61 7.72 5.47C7.86 5.329 8.051 5.25 8.25 5.25H18C18.199 5.25 18.39 5.329 18.53 5.47C18.671 5.61 18.75 5.801 18.75 6Z" />
                </svg>
              </div>
            </button>
          </div>

          {/* Right Side / Services Marquee track */}
          <div className="flex-1 overflow-hidden border-t border-black/10 md:ml-12 md:border-t-0">
            <span className="text-[9px] uppercase tracking-wider text-black/40 block mb-2 font-mono">
              НАПРАВЛЕНИЯ РАБОТ / СИСТЕМА ОБЪЕКТОВ
            </span>
            <div className="overflow-hidden py-5 bg-neutral-50/50 border border-black/[0.04]">
              {/* Intermittent scrolling lane */}
              <div className="marquee-services flex w-max">
                {doubledMarquee.map((item, index) => (
                  <div 
                    key={index} 
                    className="flex shrink-0 items-center gap-2.5 px-8 select-none"
                  >
                    {renderMarqueeIcon(item.iconId)}
                    <span className="whitespace-nowrap text-sm font-medium tracking-wide text-black/80 font-sans">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Minimalist industrial copyright and contact */}
        <div className="mt-16 pt-8 border-t border-black/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-black/45 font-mono">
          <div>
            © {new Date().getFullYear()} BISHKEK ROOFING SERVICES. ВСЕ ПРАВА ЗАЩИЩЕНЫ.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Clock size={11} />
              ПН-СБ 08:00 - 20:00
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin size={11} />
              БИШКЕК, КЫРГЫЗСТАН
            </span>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Spacer */}
      <div className="h-12" />

      {/* Diagnostic & Quote calculator lead collection modal */}
      <LeadModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        preSelectedServiceId={preSelectedServiceId}
        onAddRequest={handleAddRequest}
      />
    </section>
  );
}
