"use client";

import { MapPin, ShieldCheck } from "lucide-react";
import { useHeadquarters } from "@/context/Headquarters/useHeadquarters";

export default function TopBanner() {
  const { selectedHeadquarters, setSelectedHeadquarters } = useHeadquarters();
  const isDem = selectedHeadquarters === "Yuriria";

  return (
    <div className="w-full bg-amber-500/10 dark:bg-amber-500/[0.07] border-b border-amber-500/20">
      <div className="w-full max-w-6xl mx-auto px-6 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <p className="text-[11px] sm:text-xs text-slate-700 dark:text-slate-300 flex items-center justify-center sm:justify-start gap-1.5">
          <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
          <span>
            <strong className="text-amber-600 dark:text-amber-400">
              BeeTeacher UG:
            </strong>{" "}
            Directorio de asesorías entre pares (#TutorPar), tutores #DICIS y
            #DEM, asesores #Externo y salones vacíos en tiempo real.
          </span>
        </p>

        <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 p-0.5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider pl-2.5 pr-1 text-amber-700 dark:text-amber-300 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            Sede Aulas:
          </span>
          <button
            type="button"
            onClick={() => setSelectedHeadquarters("Salamanca")}
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all ${
              !isDem
                ? "bg-amber-500 text-slate-950 shadow-sm"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            DICIS
          </button>
          <button
            type="button"
            onClick={() => setSelectedHeadquarters("Yuriria")}
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all ${
              isDem
                ? "bg-cyan-500 text-slate-950 shadow-sm"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            DEM
          </button>
        </div>
      </div>
    </div>
  );
}
