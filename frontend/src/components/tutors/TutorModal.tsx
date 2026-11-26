"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Copy,
  ExternalLink,
  GraduationCap,
  Mail,
  MessageCircle,
  Star,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import type { RoomsWithState } from "@/backend/services/room.service";
import { TutorService } from "@/backend/services/tutor.service";
import type { TutorModality, TutorProfile } from "@/backend/types";
// En el Entregable 3 se integrará useAgenda para detección real de choques con Mi Agenda.

const DAY_LABELS: Record<string, string> = {
  MONDAY: "Lunes",
  TUESDAY: "Martes",
  WEDNESDAY: "Miércoles",
  THURSDAY: "Jueves",
  FRIDAY: "Viernes",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
};

interface TutorModalProps {
  tutor: TutorProfile | null;
  onClose: () => void;
}

export default function TutorModal({ tutor, onClose }: TutorModalProps) {
  const findConflicts = (
    _day: string,
    _start: string,
    _end: string,
  ): Array<{ title: string; start: string; end: string }> => [];
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedScheduleIdx, setSelectedScheduleIdx] = useState(0);
  const [selectedModality, setSelectedModality] =
    useState<TutorModality>("PRESENCIAL");
  const [requestType, setRequestType] = useState<"TUTOR_PAR" | "PARTICULAR">(
    "TUTOR_PAR",
  );
  const [freeRooms, setFreeRooms] = useState<string[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [coverError, setCoverError] = useState(false);

  useEffect(() => {
    if (!tutor) return;
    setSelectedSubject(tutor.subjectTags[0] ?? "Cálculo");
    setSelectedScheduleIdx(0);
    setSelectedModality(tutor.modalities[0] ?? "PRESENCIAL");
    setRequestType(tutor.isTutorPar ? "TUTOR_PAR" : "PARTICULAR");
    setAvatarError(false);
    setCoverError(false);
  }, [tutor]);

  const currentSlot =
    tutor?.schedules[selectedScheduleIdx] ?? tutor?.schedules[0];

  useEffect(() => {
    if (
      !tutor ||
      tutor.isExternal ||
      tutor.communityTag === "DCEA" ||
      tutor.headquarters === "Marfil" ||
      selectedModality !== "PRESENCIAL" ||
      !currentSlot
    ) {
      setFreeRooms([]);
      setSelectedRoom("");
      return;
    }

    const hqQuery =
      tutor.headquarters === "Yuriria" || tutor.communityTag === "DEM"
        ? "Yuriria"
        : "Salamanca";
    fetch(
      `/api/v1/rooms?day=${currentSlot.day}&time=${encodeURIComponent(currentSlot.start)}&headquarters=${encodeURIComponent(hqQuery)}`,
    )
      .then((res) => res.json())
      .then((data: RoomsWithState) => {
        const availableNames = (data.freeRooms || [])
          .filter(
            (r) =>
              r.timeUntilOccupancy === null ||
              r.timeUntilOccupancy === undefined ||
              r.timeUntilOccupancy >= 60,
          )
          .slice(0, 8)
          .map((r) => r.room.name);
        setFreeRooms(availableNames);
        setSelectedRoom(availableNames[0] ?? "");
      })
      .catch(() => {
        setFreeRooms([]);
      });
  }, [tutor, selectedModality, currentSlot]);

  if (!tutor) return null;

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

  const dayLabel = currentSlot
    ? (DAY_LABELS[currentSlot.day] ?? currentSlot.day)
    : "esta semana";
  const start = currentSlot?.start ?? "12:00";
  const end = currentSlot?.end ?? "14:00";

  const slotConflicts = currentSlot
    ? findConflicts(currentSlot.day, currentSlot.start, currentSlot.end)
    : [];

  const whatsappUrl = TutorService.buildWhatsAppUrl({
    tutor,
    subjectTag: selectedSubject,
    dayLabel,
    start,
    end,
    modality: selectedModality,
    isTutorParRequest: requestType === "TUTOR_PAR",
    suggestedRoomName: selectedRoom,
  });

  const reviewFormUrl = TutorService.buildReviewFormUrl(tutor);
  const previewMessage = decodeURIComponent(
    whatsappUrl.split("?text=")[1] ?? "",
  );

  const mailtoUrl = tutor.email
    ? `mailto:${tutor.email}?subject=${encodeURIComponent(`Asesoría de #${selectedSubject} - BeeTeacher UG`)}&body=${encodeURIComponent(previewMessage)}`
    : "";

  const showCoverImage = Boolean(tutor.coverUrl && !coverError);
  const showAvatarImage = Boolean(tutor.avatarUrl && !avatarError);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/65 backdrop-blur-sm"
      />
      <div className="relative z-10 w-full max-w-3xl max-h-[92vh] bg-white dark:bg-[#0D1322] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 flex flex-col overflow-hidden">
        <div className="overflow-y-auto scroll-custom">
          {/* Banner superior estilo Facebook */}
          <div
            className={`relative h-40 sm:h-48 w-full bg-gradient-to-r ${gradient} p-4 sm:p-6 flex justify-between items-start overflow-hidden`}
          >
            {showCoverImage && (
              <img
                src={tutor.coverUrl}
                alt={`Portada de ${tutor.fullName}`}
                referrerPolicy="no-referrer"
                onError={() => setCoverError(true)}
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/25 pointer-events-none" />

            <div className="flex flex-wrap gap-2 relative z-10 pr-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider shadow ${
                  tutor.isExternal
                    ? "bg-amber-500 text-slate-950"
                    : tutor.communityTag === "DEM"
                      ? "bg-cyan-600 text-white"
                      : tutor.communityTag === "DCEA"
                        ? "bg-purple-600 text-white"
                        : "bg-indigo-600 text-white"
                }`}
              >
                #{tutor.communityTag}
              </span>
              {tutor.isTutorPar && (
                <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-emerald-500 text-white shadow">
                  ★ #TutorPar (Beca UG)
                </span>
              )}
              {tutor.career && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-black/55 text-amber-300 border border-amber-400/35 backdrop-blur-sm shadow">
                  <GraduationCap className="w-3.5 h-3.5" />
                  {tutor.career}
                </span>
              )}
              {tutor.modalities.map((m) => (
                <span
                  key={m}
                  className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase bg-black/40 text-white backdrop-blur-sm"
                >
                  #{m === "PRESENCIAL" ? "Presencial" : "Virtual"}
                </span>
              ))}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="relative z-10 p-2 rounded-full bg-black/45 hover:bg-black/65 text-white transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="px-5 sm:px-7 pb-7">
            {/* Avatar + Nombre + Carrera + Correo Institucional + Precios */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 mb-5 relative z-10">
              <div className="flex items-end gap-4">
                {showAvatarImage ? (
                  <img
                    src={tutor.avatarUrl}
                    alt={tutor.fullName}
                    referrerPolicy="no-referrer"
                    onError={() => setAvatarError(true)}
                    className="w-24 h-24 rounded-3xl object-cover object-center border-4 border-white dark:border-[#0D1322] shadow-xl bg-white shrink-0"
                  />
                ) : (
                  <div
                    className={`w-24 h-24 rounded-3xl ${
                      tutor.isExternal ? "bg-amber-600" : "bg-indigo-600"
                    } border-4 border-white dark:border-[#0D1322] shadow-xl flex items-center justify-center text-white font-extrabold text-2xl shrink-0`}
                  >
                    {initials}
                  </div>
                )}
                <div className="pt-2 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      {tutor.fullName}
                    </h2>
                    {tutor.verified && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        ID/NUA: {tutor.id}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-semibold flex items-center gap-1.5 flex-wrap">
                    <GraduationCap className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>{tutor.career}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {tutor.semester}
                    </span>
                  </p>

                  {tutor.email && (
                    <div className="flex items-center gap-2 flex-wrap pt-0.5">
                      <a
                        href={`mailto:${tutor.email}`}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/25 text-xs font-bold text-indigo-600 dark:text-indigo-300 transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>{tutor.email}</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard?.writeText(tutor.email || "");
                          setCopiedEmail(true);
                          setTimeout(() => setCopiedEmail(false), 2000);
                        }}
                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/15"
                      >
                        {copiedEmail ? "¡Correo copiado!" : "Copiar correo"}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center gap-4 shrink-0">
                <div>
                  <span className="block text-[10px] font-bold uppercase text-slate-400">
                    30 minutos
                  </span>
                  <span className="text-base font-extrabold text-slate-900 dark:text-white">
                    ${tutor.price30} MXN
                  </span>
                </div>
                <div className="h-7 w-px bg-slate-300 dark:bg-white/10" />
                <div>
                  <span className="block text-[10px] font-bold uppercase text-slate-400">
                    1 hora
                  </span>
                  <span className="text-base font-extrabold text-slate-900 dark:text-white">
                    ${tutor.price60} MXN
                  </span>
                </div>
              </div>
            </div>

            {tutor.tutorParNote && (
              <div
                className={`mb-5 p-3.5 rounded-2xl text-xs leading-relaxed ${
                  tutor.isTutorPar
                    ? "bg-emerald-500/10 border border-emerald-500/25 text-emerald-800 dark:text-emerald-300"
                    : "bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300"
                }`}
              >
                <strong>
                  {tutor.isTutorPar
                    ? "🎓 Condiciones #TutorPar y tarifas:"
                    : "📌 Nota sobre asesorías:"}
                </strong>{" "}
                {tutor.tutorParNote}
              </div>
            )}

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
              {tutor.bio}
            </p>

            {/* Configurador de Asesoría + Detector de Choques con Mi Agenda + Salones Vacíos */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 space-y-4 mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                1. Configura tu asesoría y elige un salón vacío disponible
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    Materia (#Etiqueta)
                  </label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs font-bold"
                  >
                    {tutor.subjectTags.map((tag) => (
                      <option key={tag} value={tag}>
                        #{tag}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    Horario disponible del tutor
                  </label>
                  <select
                    value={selectedScheduleIdx}
                    onChange={(e) =>
                      setSelectedScheduleIdx(Number(e.target.value))
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs font-bold"
                  >
                    {tutor.schedules.map((s, idx) => {
                      const hasConflict =
                        findConflicts(s.day, s.start, s.end).length > 0;
                      return (
                        <option key={`${s.day}-${s.start}`} value={idx}>
                          {DAY_LABELS[s.day] ?? s.day} {s.start} - {s.end}{" "}
                          {hasConflict
                            ? "(⚠️ Ocupado en tu agenda)"
                            : "(✓ Libre)"}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    Modalidad
                  </label>
                  <select
                    value={selectedModality}
                    onChange={(e) =>
                      setSelectedModality(e.target.value as TutorModality)
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs font-bold"
                  >
                    {tutor.modalities.map((m) => (
                      <option key={m} value={m}>
                        #{m === "PRESENCIAL" ? "Presencial" : "Virtual"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Aviso de Cruce con Mi Agenda */}
              {slotConflicts.length > 0 ? (
                <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center gap-2.5 text-xs text-amber-800 dark:text-amber-300">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>
                    <strong>Aviso de tu agenda:</strong> En este horario tienes
                    registrado{" "}
                    <strong>
                      {slotConflicts
                        .map((c) => `"${c.title}" (${c.start}-${c.end})`)
                        .join(", ")}
                    </strong>
                    .
                  </span>
                </div>
              ) : (
                <div className="px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>
                    Tienes este bloque libre en <strong>Mi Agenda</strong>.
                  </span>
                </div>
              )}

              {tutor.isTutorPar && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRequestType("TUTOR_PAR")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border text-left transition-colors ${
                      requestType === "TUTOR_PAR"
                        ? "bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-300"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 text-slate-500"
                    }`}
                  >
                    ★ Hora de beca #TutorPar (sin costo)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRequestType("PARTICULAR")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border text-left transition-colors ${
                      requestType === "PARTICULAR"
                        ? "bg-amber-500/15 border-amber-500 text-amber-700 dark:text-amber-300"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 text-slate-500"
                    }`}
                  >
                    💼 Sesión particular / hora extra (${tutor.price60}/h)
                  </button>
                </div>
              )}

              {!tutor.isExternal &&
                selectedModality === "PRESENCIAL" &&
                (tutor.communityTag === "DCEA" ||
                tutor.headquarters === "Marfil" ? (
                  <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/25 text-xs text-purple-800 dark:text-purple-300">
                    <strong>
                      📍 Punto de reunión en la sede Marfil (DCEA) por acordar:
                    </strong>{" "}
                    Al enviar WhatsApp o correo, podrás coordinar directamente
                    con el tutor el espacio de estudio o cubículo dentro de
                    DCEA.
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        ● Salones vacíos en{" "}
                        {tutor.communityTag === "DEM" ||
                        tutor.headquarters === "Yuriria"
                          ? "DEM"
                          : "DICIS"}{" "}
                        {currentSlot
                          ? `el ${dayLabel.toLowerCase()}`
                          : dayLabel}{" "}
                        a las {start}:
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {freeRooms.length}{" "}
                        {freeRooms.length === 1 ? "sugerido" : "sugeridos"} (1+
                        h libre)
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {freeRooms.map((roomName) => (
                        <button
                          type="button"
                          key={roomName}
                          onClick={() => setSelectedRoom(roomName)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                            selectedRoom === roomName
                              ? "bg-emerald-600 text-white border-emerald-500"
                              : "bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border-transparent hover:border-emerald-500/40"
                          }`}
                        >
                          Salón {roomName}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

              <div className="p-3 rounded-xl bg-slate-100 dark:bg-black/40 border border-slate-200/70 dark:border-white/5 text-[11px] text-slate-600 dark:text-slate-400">
                <span className="block text-[9px] font-bold uppercase text-slate-400 mb-1">
                  Vista previa del mensaje de contacto:
                </span>
                "{previewMessage}"
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-emerald-600/20 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  Enviar WhatsApp
                </a>

                {tutor.email && (
                  <a
                    href={mailtoUrl}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-indigo-600/20 transition-all"
                  >
                    <Mail className="w-4 h-4" />
                    Contactar por correo
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(previewMessage);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="inline-flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/15 text-slate-800 dark:text-slate-200 text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copied ? "¡Copiado!" : "Copiar mensaje"}
                </button>
              </div>
            </div>

            {/* Comentarios y Botón al Google Form Real */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                    Comentarios de alumnos ({rating.count}) · ★{" "}
                    {rating.count > 0 ? rating.average : "Sin reseñas"}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Reseñas asociadas al ID/NUA <code>{tutor.id}</code>.
                  </p>
                </div>
                <a
                  href={reviewFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-[11px] font-extrabold uppercase tracking-wider shadow-sm transition-all"
                >
                  <Star className="w-3.5 h-3.5 fill-slate-950" />
                  Calificar a este tutor
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="space-y-2.5">
                {tutor.reviews.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">
                    Aún no hay comentarios registrados para este tutor.
                  </p>
                ) : (
                  tutor.reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10"
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-amber-500">
                            {"★".repeat(rev.stars)}
                            {"☆".repeat(5 - rev.stars)}
                          </span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            #{rev.subject}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                            {rev.modality}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          Alumno NUA: ***{String(rev.studentNua).slice(-3)} ·{" "}
                          {rev.date}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {rev.comment}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}