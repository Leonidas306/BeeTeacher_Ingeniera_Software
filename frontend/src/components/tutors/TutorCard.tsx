"use client";

import { CheckCircle2, GraduationCap, Heart, Mail, Star } from "lucide-react";
import { useState } from "react";
import { TutorService } from "@/backend/services/tutor.service";
import type { TutorProfile } from "@/backend/types";

interface TutorCardProps {
  tutor: TutorProfile;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onSelectTag?: (tag: string) => void;
  onClick: () => void;
  delay?: number;
}

export default function TutorCard({
  tutor,
  isFavorite,
  onToggleFavorite,
  onSelectTag,
  onClick,
}: TutorCardProps) {
  const [avatarError, setAvatarError] = useState(false);
  const [coverError, setCoverError] = useState(false);

  const rating = TutorService.getAverageRating(tutor);
  const initials = tutor.fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  const gradient =
    tutor.coverGradient ||
    (tutor.isExternal
      ? "from-amber-600 via-orange-600 to-rose-700"
      : "from-indigo-600 via-emerald-600 to-teal-700");

  const showCoverImage = Boolean(tutor.coverUrl && !coverError);
  const showAvatarImage = Boolean(tutor.avatarUrl && !avatarError);

  return (
    <div
      onClick={onClick}
      className="group relative rounded-2xl bg-white dark:bg-[#0D1322] border border-slate-200 dark:border-white/10 hover:border-amber-500/50 dark:hover:border-amber-400/40 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col overflow-hidden h-full"
    >
      {/* Banner de Portada estilo Facebook con Etiquetas #DICIS, #TutorPar y Carrera */}
      <div
        className={`relative h-28 w-full bg-gradient-to-r ${gradient} p-3 flex items-start justify-between overflow-hidden`}
      >
        {showCoverImage && (
          <img
            src={tutor.coverUrl}
            alt={`Portada de ${tutor.fullName}`}
            referrerPolicy="no-referrer"
            onError={() => setCoverError(true)}
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/25 pointer-events-none" />

        <div className="flex flex-wrap gap-1.5 z-10 pr-2">
          {tutor.isExternal ? (
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-amber-500 text-slate-950 shadow-sm">
              #Externo
            </span>
          ) : (
            <span
              className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider text-white shadow-sm ${
                tutor.communityTag === "DEM"
                  ? "bg-cyan-600"
                  : tutor.communityTag === "DCEA"
                    ? "bg-purple-600"
                    : "bg-indigo-600"
              }`}
            >
              #{tutor.communityTag}
            </span>
          )}

          {tutor.isTutorPar && (
            <span
              title="Programa Asesorías Entre Pares UG: cuenta con horas de asesoría gratuita institucional"
              className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500 text-white shadow-sm flex items-center gap-1"
            >
              ★ #TutorPar
            </span>
          )}

          {tutor.career && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/55 text-amber-300 border border-amber-400/30 backdrop-blur-sm max-w-[200px] truncate">
              <GraduationCap className="w-3 h-3 shrink-0" />
              <span className="truncate">{tutor.career}</span>
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          aria-label="Guardar en favoritos"
          className="z-10 p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition-transform active:scale-90 shrink-0"
        >
          <Heart
            className={`w-4 h-4 ${
              isFavorite ? "fill-rose-500 text-rose-500" : "text-white"
            }`}
          />
        </button>
      </div>

      {/* Cuerpo con Avatar superpuesto */}
      <div className="px-5 pt-0 pb-5 flex-1 flex flex-col">
        <div className="flex items-end justify-between -mt-9 mb-3 relative z-10">
          {showAvatarImage ? (
            <img
              src={tutor.avatarUrl}
              alt={tutor.fullName}
              referrerPolicy="no-referrer"
              onError={() => setAvatarError(true)}
              className="w-16 h-16 rounded-2xl object-cover object-center border-4 border-white dark:border-[#0D1322] shadow-md bg-white"
            />
          ) : (
            <div
              className={`w-16 h-16 rounded-2xl ${
                tutor.isExternal ? "bg-amber-600" : "bg-indigo-600"
              } border-4 border-white dark:border-[#0D1322] shadow-md flex items-center justify-center text-white font-extrabold text-lg`}
            >
              {initials}
            </div>
          )}

          <div className="flex items-center gap-1.5">
            {tutor.modalities.map((mod) =>
              mod === "PRESENCIAL" ? (
                <span
                  key={mod}
                  className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300"
                >
                  #Presencial
                </span>
              ) : (
                <span
                  key={mod}
                  className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20"
                >
                  #Virtual
                </span>
              ),
            )}
          </div>
        </div>

        <div className="mb-2.5 space-y-1">
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight line-clamp-1">
              {tutor.fullName}
            </h3>
            {tutor.verified && (
              <CheckCircle2
                className="w-3.5 h-3.5 text-emerald-500 shrink-0"
                aria-label="Tutor verificado"
              />
            )}
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
            {tutor.career} · {tutor.semester} ·{" "}
            <span className="font-semibold">ID/NUA: {tutor.id}</span>
          </p>

          {tutor.email && (
            <a
              href={`mailto:${tutor.email}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline max-w-full truncate"
              title={`Enviar correo a ${tutor.email}`}
            >
              <Mail className="w-3 h-3 shrink-0" />
              <span className="truncate">{tutor.email}</span>
            </a>
          )}
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">
          {tutor.bio}
        </p>

        {/* Etiquetas de Materias */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tutor.subjectTags.map((tag) => (
            <button
              type="button"
              key={tag}
              onClick={(e) => {
                e.stopPropagation();
                onSelectTag?.(tag);
              }}
              className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-amber-500/10 dark:bg-amber-400/10 text-amber-800 dark:text-amber-300 border border-amber-500/20 hover:bg-amber-500 hover:text-slate-950 transition-colors"
            >
              #{tag}
            </button>
          ))}
        </div>

        {/* Pie de tarjeta: Precios y Estrellas */}
        <div className="mt-auto pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
              {tutor.isTutorPar ? "Beca Gratis + Tarifa Extra" : "Tarifa Base"}
            </span>
            {tutor.price30 === 0 && tutor.price60 === 0 ? (
              <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                Gratuito (100% #TutorPar)
              </span>
            ) : (
              <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                ${tutor.price30}{" "}
                <span className="text-[10px] font-normal text-slate-500">
                  / 30m
                </span>{" "}
                · ${tutor.price60}{" "}
                <span className="text-[10px] font-normal text-slate-500">
                  / 1h
                </span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{rating.count > 0 ? rating.average : "Nuevo"}</span>
            <span className="text-[10px] text-slate-400">({rating.count})</span>
          </div>
        </div>
      </div>
    </div>
  );
}
