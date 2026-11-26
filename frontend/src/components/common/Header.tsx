"use client";

import { Clock, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import WantTutorModal from "@/components/tutors/WantTutorModal";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [wantModalOpen, setWantModalOpen] = useState(false);

  useEffect(() => {
    setCurrentTime(new Date());
    const interval = setInterval(() => setCurrentTime(new Date()), 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <header className="max-w-6xl mx-auto px-6 pt-6 pb-4 w-full space-y-5">
        {/* Barra superior de identidad BeeTeacher */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/25 text-slate-950 text-xl font-black">
              🐝
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                  Bee<span className="text-amber-500">Teacher</span>
                </h1>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                  Colmena DICIS
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Mentoría académica, etiquetas por materia y salones libres
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right pr-3 border-r border-slate-200 dark:border-white/10">
              <div className="text-base font-bold tabular-nums text-slate-900 dark:text-white">
                {currentTime
                  ? currentTime.toLocaleTimeString("es-MX", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "--:--"}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 capitalize flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-500" />
                {currentTime
                  ? currentTime.toLocaleDateString("es-MX", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    })
                  : "Cargando..."}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setWantModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-extrabold uppercase tracking-wider shadow-md shadow-amber-500/20 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              Quiero ser Tutor
            </button>

            <ThemeToggle />
          </div>
        </div>

        {/* Hero Card BeeTeacher */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-[#111827] to-amber-950/85 border border-amber-500/25 p-5 sm:p-6 text-white shadow-xl">
          <div className="pointer-events-none absolute -right-12 -top-12 w-56 h-56 rounded-full bg-amber-500/15 blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-amber-400 mb-1">
                🐝 La Colmena de Asesorías · UG
              </p>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                Encuentra a tu tutor ideal y un salón vacío en un solo paso
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                Filtra por etiquetas (
                <span className="text-amber-300 font-semibold">
                  #Cálculo, #Probabilidad, #Programación
                </span>
                ), identifica compañeros con beca{" "}
                <span className="text-emerald-300 font-semibold">
                  ★ #TutorPar
                </span>{" "}
                o asesores{" "}
                <span className="text-amber-300 font-semibold">#Externo</span> y
                agenda directo por WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </header>

      <WantTutorModal
        open={wantModalOpen}
        onClose={() => setWantModalOpen(false)}
      />
    </>
  );
}
