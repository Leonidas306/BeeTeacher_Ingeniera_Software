"use client";

import { Lock, ShieldCheck, X } from "lucide-react";

interface WantTutorModalProps {
  open: boolean;
  onClose: () => void;
  dicisFormUrl?: string;
  externalFormUrl?: string;
}

export default function WantTutorModal({
  open,
  onClose,
  dicisFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLSdR6tTjNqU8pc0-CNwON0gYwofGucKZA9UPJXVoJOYqQ7y39w/viewform?usp=sharing&ouid=107964336684634540613",
  externalFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLSdVV-mz7cIXQlAPFq3Tz-2XoYQSuvzEnrXMwNLWvgOQbrQn2A/viewform?usp=sharing&ouid=107964336684634540613",
}: WantTutorModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/65 backdrop-blur-sm"
      />
      <div className="relative z-10 w-full max-w-xl bg-white dark:bg-[#0D1322] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-white/10">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500">
              BeeTeacher · Verificación de Comunidad
            </span>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
              ¿Quieres registrarte como Tutor?
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-xs leading-relaxed text-amber-900 dark:text-amber-200 flex gap-3">
            <Lock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold mb-1">
                Formularios bajo solicitud previa a los Administradores:
              </p>
              <p>
                Al abrir el formulario correspondiente a tu perfil, Google Forms
                te mostrará el botón <strong>"Solicitar acceso"</strong>. Así
                los administradores verifican tu pertenencia a la UG (asignando{" "}
                <strong>#DICIS</strong> y <strong>#TutorPar</strong>) o te
                clasifican en el padrón de asesores <strong>#Externo</strong>.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-indigo-500/30 bg-indigo-500/[0.04] flex flex-col justify-between space-y-4">
              <div>
                <div className="flex flex-wrap items-center gap-1.5 mb-2">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-indigo-600 text-white">
                    #DICIS
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-cyan-600 text-white">
                    #DEM
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-purple-600 text-white">
                    #DCEA
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-500 text-white">
                    ★ #TutorPar
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  1. Comunidad UG (DICIS, DEM, DCEA y Tutor Par)
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Requiere NUA de 6 dígitos (usado como ID único irrepetible) y
                  correo institucional <code>@ugto.mx</code>.
                </p>
              </div>
              <a
                href={dicisFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-extrabold uppercase tracking-wider text-center transition-colors"
              >
                Solicitar Form #DICIS / #TutorPar
              </a>
            </div>

            <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/[0.04] flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-500 text-slate-950">
                    #Externo
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  2. Asesor Independiente (#Externo)
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Para asesores particulares ajenos a la UG. Tu perfil se
                  mostrará separado con la etiqueta <code>#Externo</code>.
                </p>
              </div>
              <a
                href={externalFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-extrabold uppercase tracking-wider text-center transition-colors"
              >
                Solicitar Form #Externo
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>
              Recuerda: no se permite registrar dos perfiles con el mismo NUA.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
