"use client";

import { Heart, Tag, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { TutorService } from "@/backend/services/tutor.service";
import type { SedeFilter, TutorModality, TutorProfile } from "@/backend/types";
import { getSearchScore } from "@/backend/utils";
import EmptyState from "@/components/common/EmptyState";
import PageHeader from "@/components/common/PageHeader";
import SearchBar from "@/components/common/SearchBar";
import TutorCard from "@/components/tutors/TutorCard";
import TutorModal from "@/components/tutors/TutorModal";
import { useFavorites } from "@/hooks/useFavorites";

export default function Home() {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [tutorsList, setTutorsList] = useState<TutorProfile[]>(() =>
    TutorService.getAllTutors(),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [originFilter, setOriginFilter] = useState<
    "ALL" | "TUTOR_PAR" | "EXTERNO"
  >("ALL");
  const [sedeFilter, setSedeFilter] = useState<SedeFilter>("ALL");
  const [modalityFilter, setModalityFilter] = useState<"ALL" | TutorModality>(
    "ALL",
  );
  const [sortBy, setSortBy] = useState<
    "RATING" | "TUTOR_PAR_FIRST" | "PRICE_ASC"
  >("RATING");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [activeTutor, setActiveTutor] = useState<TutorProfile | null>(null);


  useEffect(() => {
    fetch("/api/v1/tutors")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data?.tutors)) {
          setTutorsList(data.tutors);
        }
      })
      .catch(() => {});
  }, []);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    for (const t of tutorsList) {
      for (const tag of t.subjectTags) {
        set.add(tag);
      }
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b, "es"));
  }, [tutorsList]);

  const filteredTutors = useMemo(() => {
    const result = tutorsList.filter((t) => {
      if (originFilter === "TUTOR_PAR" && !t.isTutorPar) return false;
      if (originFilter === "EXTERNO" && !t.isExternal) return false;

      if (sedeFilter === "DICIS") {
        if (
          t.isExternal ||
          (t.communityTag !== "DICIS" && t.headquarters !== "Salamanca")
        ) {
          return false;
        }
      } else if (sedeFilter === "DEM") {
        if (
          t.isExternal ||
          (t.communityTag !== "DEM" && t.headquarters !== "Yuriria")
        ) {
          return false;
        }
      } else if (sedeFilter === "DCEA") {
        if (
          t.isExternal ||
          (t.communityTag !== "DCEA" && t.headquarters !== "Marfil")
        ) {
          return false;
        }
      }

      if (
        modalityFilter !== "ALL" &&
        !t.modalities.includes(modalityFilter)
      ) {
        return false;
      }

      if (selectedTags.length > 0) {
        const hasAll = selectedTags.every((tag) =>
          t.subjectTags.includes(tag),
        );
        if (!hasAll) return false;
      }

      if (searchQuery.trim()) {
        const score = Math.max(
          getSearchScore(searchQuery, t.fullName),
          getSearchScore(searchQuery, t.id),
          getSearchScore(searchQuery, t.career),
          getSearchScore(searchQuery, t.communityTag),
          ...t.subjectTags.map((tag) => getSearchScore(searchQuery, tag)),
        );
        if (score === 0) return false;
      }

      return true;
    });

    return [...result].sort((a, b) => {
      if (sortBy === "TUTOR_PAR_FIRST") {
        if (a.isTutorPar && !b.isTutorPar) return -1;
        if (!a.isTutorPar && b.isTutorPar) return 1;
      }
      if (sortBy === "PRICE_ASC") {
        return a.price60 - b.price60;
      }
      return (
        TutorService.getAverageRating(b).average -
        TutorService.getAverageRating(a).average
      );
    });
  }, [
    tutorsList,
    searchQuery,
    originFilter,
    sedeFilter,
    modalityFilter,
    selectedTags,
    sortBy,
  ]);

  const favoriteTutors = useMemo(
    () => tutorsList.filter((t) => isFavorite(t.id)),
    [tutorsList, isFavorite],
  );

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  return (
    <div className="space-y-7 pb-24 mt-2">
      {favoriteTutors.length > 0 && (
        <section className="space-y-4">
          <PageHeader
            title="Tus Tutores Favoritos"
            icon={Heart}
            count={favoriteTutors.length}
            countLabel="guardados"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {favoriteTutors.map((tutor, idx) => (
              <TutorCard
                key={`fav-${tutor.id}`}
                tutor={tutor}
                isFavorite={isFavorite(tutor.id)}
                onToggleFavorite={() => toggleFavorite(tutor.id)}
                onSelectTag={handleToggleTag}
                onClick={() => setActiveTutor(tutor)}
                delay={idx * 0.04}
              />
            ))}
          </div>
        </section>
      )}

      <section className="space-y-4">
        <PageHeader
          title="Directorio de Tutores BeeTeacher"
          icon={Users}
          count={filteredTutors.length}
          countLabel="tutores encontrados"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          <div className="lg:col-span-5">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Buscar por nombre, NUA o materia (ej. calculo, probabilidad)..."
            />
          </div>

          <div className="lg:col-span-3 flex p-1 rounded-2xl bg-slate-100 dark:bg-white/5 overflow-x-auto">
            {[
              { id: "ALL", label: "Todos" },
              { id: "TUTOR_PAR", label: "★ #TutorPar" },
              { id: "EXTERNO", label: "#Externo" },
            ].map((tab) => {
              const active = originFilter === tab.id;
              return (
                <button
                  type="button"
                  key={tab.id}
                  onClick={() =>
                    setOriginFilter(
                      tab.id as "ALL" | "TUTOR_PAR" | "EXTERNO",
                    )
                  }
                  className={`flex-1 px-3 py-2 rounded-xl text-[10px] font-extrabold uppercase tracking-wider whitespace-nowrap transition-all ${
                    active
                      ? "bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-4 flex flex-wrap sm:flex-nowrap gap-2">
            <select
              value={sedeFilter}
              onChange={(e) => setSedeFilter(e.target.value as SedeFilter)}
              aria-label="Filtrar por sede"
              className="flex-1 px-3 py-2.5 rounded-2xl bg-slate-100 dark:bg-white/5 text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 outline-none"
            >
              <option value="ALL">Sede: Todas</option>
              <option value="DICIS">DICIS</option>
              <option value="DEM">DEM</option>
              <option value="DCEA">DCEA</option>
            </select>

            <select
              value={modalityFilter}
              onChange={(e) =>
                setModalityFilter(e.target.value as "ALL" | TutorModality)
              }
              aria-label="Filtrar por modalidad"
              className="flex-1 px-3 py-2.5 rounded-2xl bg-slate-100 dark:bg-white/5 text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 outline-none"
            >
              <option value="ALL">Modalidad: Todas</option>
              <option value="PRESENCIAL">#Presencial</option>
              <option value="VIRTUAL">#Virtual</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value as "RATING" | "TUTOR_PAR_FIRST" | "PRICE_ASC",
                )
              }
              aria-label="Ordenar por"
              className="flex-1 px-3 py-2.5 rounded-2xl bg-slate-100 dark:bg-white/5 text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 outline-none"
            >
              <option value="RATING">Mejor calificados</option>
              <option value="TUTOR_PAR_FIRST">#TutorPar primero</option>
              <option value="PRICE_ASC">Menor precio</option>
            </select>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-100/80 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10">
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-amber-500" />
              Filtrar por etiquetas de materias:
            </span>
            {selectedTags.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedTags([])}
                className="text-[10px] font-bold uppercase tracking-wider text-rose-500 hover:underline"
              >
                Limpiar etiquetas ({selectedTags.length}) ✕
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {allTags.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  type="button"
                  key={tag}
                  onClick={() => handleToggleTag(tag)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all border ${
                    isSelected
                      ? "bg-amber-500 text-slate-950 border-amber-400 shadow-sm scale-[1.02]"
                      : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-amber-500/40"
                  }`}
                >
                  #{tag}
                </button>
              );
            })}
          </div>
        </div>

        {filteredTutors.length === 0 ? (
          <EmptyState message="No se encontraron tutores con las etiquetas o filtros seleccionados." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTutors.map((tutor, idx) => (
              <TutorCard
                key={tutor.id}
                tutor={tutor}
                isFavorite={isFavorite(tutor.id)}
                onToggleFavorite={() => toggleFavorite(tutor.id)}
                onSelectTag={handleToggleTag}
                onClick={() => setActiveTutor(tutor)}
                delay={idx * 0.04}
              />
            ))}
          </div>
        )}
      </section>

      <TutorModal tutor={activeTutor} onClose={() => setActiveTutor(null)} />
    </div>
  );
}
