import type { TutorModality, TutorProfile } from "@/backend/types";
import { getSearchScore } from "@/backend/utils";
import tutorsData from "@/data/tutors.json";

// Configuración real del Google Form de Comentarios de BeeTeacher
export const BEETEACHER_REVIEWS_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSc95vUo3Uylzu729ytHs-5Y-glEPj_8qFdWKJDoA3k34aQVJg/viewform";
export const FORM_ENTRY_TUTOR_ID = "entry.192251025";
export const FORM_ENTRY_TUTOR_NAME = "entry.1150356660";

const tutors = tutorsData as TutorProfile[];

export interface TutorFilterOptions {
  searchQuery?: string;
  origin?: "ALL" | "DICIS" | "TUTOR_PAR" | "EXTERNO";
  modality?: "ALL" | TutorModality;
  selectedTags?: string[];
  sortBy?: "RATING" | "TUTOR_PAR_FIRST" | "PRICE_ASC";
}

export class TutorService {
  static getAllTutors(): TutorProfile[] {
    return tutors;
  }

  static getTutorById(id: string): TutorProfile | null {
    return tutors.find((t) => t.id === id) ?? null;
  }

  static getAllSubjectTags(): string[] {
    const tagSet = new Set<string>();
    for (const tutor of tutors) {
      for (const tag of tutor.subjectTags) {
        tagSet.add(tag);
      }
    }
    return Array.from(tagSet).sort((a, b) => a.localeCompare(b, "es"));
  }

  static getAverageRating(tutor: TutorProfile): { average: number; count: number } {
    if (!tutor.reviews || tutor.reviews.length === 0) {
      return { average: 0, count: 0 };
    }
    const sum = tutor.reviews.reduce((acc, r) => acc + r.stars, 0);
    return {
      average: Number((sum / tutor.reviews.length).toFixed(1)),
      count: tutor.reviews.length,
    };
  }

  static filterTutors(options: TutorFilterOptions): TutorProfile[] {
    const {
      searchQuery = "",
      origin = "ALL",
      modality = "ALL",
      selectedTags = [],
      sortBy = "RATING",
    } = options;

    let result = tutors.filter((t) => {
      if (origin === "DICIS" && t.isExternal) return false;
      if (origin === "TUTOR_PAR" && !t.isTutorPar) return false;
      if (origin === "EXTERNO" && !t.isExternal) return false;

      if (modality !== "ALL" && !t.modalities.includes(modality)) {
        return false;
      }

      if (selectedTags.length > 0) {
        const matchesAllTags = selectedTags.every((tag) =>
          t.subjectTags.includes(tag),
        );
        if (!matchesAllTags) return false;
      }

      if (searchQuery.trim()) {
        const score = Math.max(
          getSearchScore(searchQuery, t.fullName),
          getSearchScore(searchQuery, t.id),
          getSearchScore(searchQuery, t.career),
          ...t.subjectTags.map((tag) => getSearchScore(searchQuery, tag)),
        );
        if (score === 0) return false;
      }

      return true;
    });

    result.sort((a, b) => {
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

    return result;
  }

  static buildReviewFormUrl(tutor: TutorProfile): string {
    return `${BEETEACHER_REVIEWS_FORM_URL}?usp=pp_url&${FORM_ENTRY_TUTOR_ID}=${encodeURIComponent(tutor.id)}&${FORM_ENTRY_TUTOR_NAME}=${encodeURIComponent(tutor.fullName)}`;
  }

  static buildWhatsAppUrl(params: {
    tutor: TutorProfile;
    subjectTag: string;
    dayLabel: string;
    start: string;
    end: string;
    modality: TutorModality;
    isTutorParRequest: boolean;
    suggestedRoomName?: string;
  }): string {
    const {
      tutor,
      subjectTag,
      dayLabel,
      start,
      end,
      modality,
      isTutorParRequest,
      suggestedRoomName,
    } = params;

    const modalityText = modality === "PRESENCIAL" ? "Presencial" : "Virtual";
    const rateText =
      tutor.isTutorPar && isTutorParRequest
        ? "bajo la modalidad de apoyo #TutorPar (horas de beca UG)"
        : `($${tutor.price30}/30m · $${tutor.price60}/1h)`;

    const roomPart =
      !tutor.isExternal && modality === "PRESENCIAL"
        ? tutor.communityTag === "DCEA" || tutor.headquarters === "Marfil"
          ? " Nos veríamos en un punto de reunión en Sede Marfil (DCEA) a acordar."
          : suggestedRoomName
            ? ` Vi en BeeTeacher que el salón *${suggestedRoomName}* está vacío en ese horario.`
            : ""
        : "";

    const msg = `¡Hola ${tutor.fullName}! Te contacto desde BeeTeacher 🐝. Me gustaría agendar una asesoría de *#${subjectTag}* en modalidad *${modalityText}* ${rateText} para el *${dayLabel} de ${start} a ${end}*.${roomPart} ¿Tienes disponibilidad?`;

    return `https://wa.me/52${tutor.whatsapp}?text=${encodeURIComponent(msg)}`;
  }
}
