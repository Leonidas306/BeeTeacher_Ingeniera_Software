import { ShieldCheck, Sparkles, Users } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-amber-500/20 mt-12 bg-slate-900/40 dark:bg-[#070A12]">
      <div className="max-w-6xl mx-auto px-6 pt-12 pb-32 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 font-black text-sm shadow">
              🐝
            </div>
            <span className="text-base font-black tracking-tight text-slate-900 dark:text-white">
              Bee<span className="text-amber-500">Teacher</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Plataforma estudiantil creada para conectar a la comunidad con
            asesores académicos, integrando filtrado por etiquetas de materias,
            consulta de salones vacíos en tiempo real y coordinación directa
            por WhatsApp.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Distintivos de la Colmena
          </h3>
          <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
            <li>
              <strong className="text-indigo-400">#DICIS:</strong> Tutor
              verificado perteneciente a la comunidad universitaria de la UG.
            </li>
            <li>
              <strong className="text-emerald-400">★ #TutorPar:</strong> Becario
              del programa institucional de Asesorías Entre Pares UG (cuenta con
              horas de apoyo gratuito además de sus tarifas para horas extra).
            </li>
            <li>
              <strong className="text-amber-400">#Externo:</strong> Asesor
              independiente externo a la universidad.
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Registro y Verificación por NUA
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Todos los perfiles de la comunidad se validan mediante su{" "}
            <strong className="text-slate-300">NUA único de 6 dígitos</strong>{" "}
            para evitar perfiles duplicados, y las reseñas quedan asociadas al
            NUA de cada tutor.
          </p>
          <div className="pt-1 flex items-center gap-2 text-[11px] font-bold text-slate-400">
            <Users className="w-3.5 h-3.5 text-amber-500" />
            <span>Proyecto Desarrollado por el Equipo BeeTeacher · DICIS UG</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
