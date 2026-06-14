import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Check, Calculator, Phone, MapPin, Sparkles } from "lucide-react";
import { CalculationRequest } from "../types";

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedServiceId: string;
  onAddRequest: (req: CalculationRequest) => void;
}

export default function LeadModal({ isOpen, onClose, preSelectedServiceId, onAddRequest }: LeadModalProps) {
  const [serviceId, setServiceId] = useState("roof-repair");
  const [area, setArea] = useState(150);
  const [tier, setTier] = useState<"standard" | "elite" | "premium">("elite");
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("+996 ");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Sync state if preSelectedServiceId changes
  useEffect(() => {
    if (preSelectedServiceId) {
      setServiceId(preSelectedServiceId);
    }
  }, [preSelectedServiceId, isOpen]);

  if (!isOpen) return null;

  // Base pricing metrics in KGS
  const pricingData: Record<string, { title: string; base: number }> = {
    "roof-repair": { title: "Ремонт кровли", base: 450 },
    "roof-installation": { title: "Монтаж крыши", base: 1200 },
    "facade-works": { title: "Фасадные работы", base: 650 },
    "industrial-climbing": { title: "Промальпинизм", base: 800 },
  };

  const tierMultipliers = {
    standard: { label: "Эконом-пакет (базовые материалы, гарантия 3 года)", mult: 1.0 },
    elite: { label: "Бизнес-стандарт (улучшенные материалы, гарантия 7 лет)", mult: 1.4 },
    premium: { label: "Индустриальный премиум (сверхпрочные материалы, гарантия 15 лет)", mult: 1.9 },
  };

  const currentService = pricingData[serviceId] || pricingData["roof-repair"];
  const currentTier = tierMultipliers[tier];
  
  // Calculate final estimate
  const rawCost = currentService.base * area * currentTier.mult;
  const estimatedCost = Math.round(rawCost);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Keep +996 prefix
    let val = e.target.value;
    if (!val.startsWith("+996 ")) {
      val = "+996 " + val.replace(/^\+?9?9?6?\s?/, "");
    }
    setClientPhone(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || clientPhone.length < 10) return;

    setIsSubmitting(true);
    // Simulate API delay
    setTimeout(() => {
      const newRequest: CalculationRequest = {
        id: "REQ-" + Math.floor(100000 + Math.random() * 900000),
        serviceId,
        serviceTitle: currentService.title,
        area,
        tier,
        tierLabel: currentTier.label,
        estimatedCost,
        clientName,
        clientPhone,
        submittedAt: new Date().toLocaleTimeString("ru-RU", { hour: '2-digit', minute: '2-digit' }),
        status: "pending"
      };

      onAddRequest(newRequest);
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1200);
  };

  const handleReset = () => {
    setIsSuccess(false);
    setClientName("");
    setClientPhone("+996 ");
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative bg-white text-black border border-black/10 w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
          id="calculation-modal"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-50 p-1 bg-white hover:bg-neutral-100 border border-black/10 transition"
          >
            <X size={16} />
          </button>

          {!isSuccess ? (
            <>
              {/* Left Column - Diagnostic parameters */}
              <div className="flex-1 p-6 md:p-8 border-b md:border-b-0 md:border-r border-black/10">
                <div className="flex items-center gap-2 mb-6">
                  <Calculator size={18} className="text-black" />
                  <h3 className="text-lg font-medium tracking-tight text-black uppercase">
                    Интерактивный Расчёт
                  </h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Service selector */}
                  <div>
                    <label className="block text-xs font-bold tracking-wider text-black/55 uppercase mb-2">
                      Выберите тип услуги
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(pricingData).map(([id, info]) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setServiceId(id)}
                          className={`px-3 py-2 text-[12px] font-medium text-left transition border ${
                            serviceId === id
                              ? "bg-black text-white border-black"
                              : "bg-white text-black border-black/10 hover:border-black/30"
                          }`}
                        >
                          {info.title}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Area input with custom slider */}
                  <div>
                    <div className="flex justify-between items-center text-xs font-bold text-black/55 uppercase mb-1">
                      <span>Площадь объекта</span>
                      <span className="text-black normal-case font-mono text-sm">{area} м²</span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="1500"
                      step="10"
                      value={area}
                      onChange={(e) => setArea(Number(e.target.value))}
                      className="w-full accent-black cursor-pointer bg-neutral-200 h-1 rounded-lg"
                    />
                    <div className="flex justify-between text-[10px] text-zinc-400 font-mono mt-1">
                      <span>30 м²</span>
                      <span>500 м²</span>
                      <span>1000 м²</span>
                      <span>1500 м²</span>
                    </div>
                  </div>

                  {/* Pricing tier list */}
                  <div>
                    <label className="block text-xs font-bold tracking-wider text-black/55 uppercase mb-2">
                      Класс надежности & гарантия
                    </label>
                    <div className="space-y-2">
                      {Object.entries(tierMultipliers).map(([id, detail]) => (
                        <div
                          key={id}
                          onClick={() => setTier(id as any)}
                          className={`p-2.5 border cursor-pointer transition flex items-center justify-between ${
                            tier === id
                              ? "bg-stone-50 border-black"
                              : "bg-white border-black/10 hover:border-black/25"
                          }`}
                        >
                          <div className="text-left select-none">
                            <p className="text-[12px] font-semibold text-black capitalize">
                              {id === "standard" ? "Базовый Стандарт" : id === "elite" ? "Бизнес Премиум" : "Супер-Прочность"}
                            </p>
                            <p className="text-[11px] text-black/50 leading-tight">
                              {detail.label.split(" (")[0]}
                            </p>
                          </div>
                          <div
                            className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ${
                              tier === id ? "border-black bg-black text-white" : "border-neutral-300"
                            }`}
                          >
                            {tier === id && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Client Contacts */}
                  <div className="space-y-2 pt-2 border-t border-black/5">
                    <div>
                      <input
                        type="text"
                        required
                        placeholder="Ваше имя"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full text-xs bg-white text-black rounded-none border border-black/15 px-3 py-2.5 focus:outline-hidden focus:border-black placeholder:text-zinc-400 font-medium"
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        placeholder="Номер телефона"
                        value={clientPhone}
                        onChange={handlePhoneChange}
                        className="w-full text-xs bg-white text-black rounded-none border border-black/15 px-3 py-2.5 focus:outline-hidden focus:border-black font-semibold tracking-wider"
                      />
                    </div>
                  </div>
                </form>
              </div>

              {/* Right Column - Cost breakdown and submit */}
              <div className="w-full md:w-[240px] bg-neutral-50 p-6 md:p-8 flex flex-col justify-between">
                <div>
                  <h4 className="text-[11px] font-bold tracking-widest text-black/45 uppercase mb-4">
                    Предварительный чек
                  </h4>

                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] uppercase text-black/50 block font-medium">Объект</span>
                      <span className="text-[13px] font-medium text-black block truncate">
                        {currentService.title}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase text-black/50 block font-medium">Размер</span>
                      <span className="text-[13px] font-mono font-medium text-black block">
                        {area} м²
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase text-black/50 block font-medium">Тариф</span>
                      <span className="text-[12px] font-medium text-zinc-700 block line-clamp-2">
                        {tier === "standard" ? "Базовый Стандарт 3г" : tier === "elite" ? "Бизнес Премиум 7л" : "Индустриал 15л"}
                      </span>
                    </div>

                    <div className="pt-4 border-t border-black/10">
                      <span className="text-[10px] uppercase text-black/55 block font-bold">Ориентировочно</span>
                      <span className="text-xl font-bold font-mono text-black">
                        {estimatedCost.toLocaleString("ru-RU")} сом
                      </span>
                      <span className="text-[10px] text-black/40 block mt-0.5">
                        *включая высококачественные материалы и работу
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-2">
                  <button
                    disabled={isSubmitting || clientName.trim() === "" || clientPhone.length < 13}
                    onClick={handleSubmit}
                    className={`w-full py-3 mx-auto text-xs font-semibold uppercase tracking-wider text-white transition-all flex items-center justify-center gap-2 ${
                      clientName.trim() === "" || clientPhone.length < 13
                        ? "bg-zinc-300 pointer-events-none cursor-not-allowed"
                        : "bg-black hover:bg-black/85"
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <>Отправить запрос</>
                    )}
                  </button>

                  <div className="flex items-center gap-1.5 justify-center text-[10px] text-zinc-400 font-medium">
                    <MapPin size={9} />
                    <span>Бишкек & Чуйская область</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Success State screen */
            <div className="w-full p-8 md:p-12 text-center flex flex-col items-center justify-center bg-white">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="h-12 w-12 rounded-full bg-black text-white flex items-center justify-center mb-6"
              >
                <Check size={24} className="stroke-[3]" />
              </motion.div>

              <h3 className="text-xl font-light tracking-tight text-black mb-3">
                ЗАЯВКА УСПЕШНО ПРИНЯТА
              </h3>
              
              <div className="max-w-md mx-auto text-[14px] leading-relaxed text-black/60 mb-8 space-y-3">
                <p>
                  Спасибо за доверие, <strong>{clientName}</strong>. Спецификация для объекта на <strong>{area} м²</strong> сформирована.
                </p>
                <p className="bg-neutral-50 py-3 px-4 text-xs text-black border border-black/5 font-mono text-left">
                  Номер заявки: <span className="font-bold text-black">RQ-{Math.floor(1000 + Math.random() * 9000)}-BH</span><br />
                  Предварительный расчёт: <span className="font-bold text-green-700">{estimatedCost.toLocaleString("ru-RU")} сом</span><br />
                  Услуга: {currentService.title} ({tier === "standard" ? "стандарт" : tier === "elite" ? "бизнес" : "премиум"})
                </p>
                <p>
                  Мастер отдела замера свяжется с вами по номеру <strong className="text-black">{clientPhone}</strong> в ближайшие 20 минут для согласования даты бесплатного выезда на замер.
                </p>
              </div>

              <button
                onClick={handleReset}
                className="bg-black hover:bg-zinc-800 text-white font-semibold text-xs uppercase tracking-widest px-6 py-3 transition"
              >
                Вернуться к сайту
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
