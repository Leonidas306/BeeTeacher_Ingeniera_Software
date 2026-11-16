import type { Class } from "./models/class.model";
import type { Professor } from "./models/professor.model";
import type { Room } from "./models/room.model";
import type { Subject } from "./models/subject.model";

export type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export const DaysOfWeek = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const;

export type DayOfWeek = (typeof DaysOfWeek)[number];

export interface DBObject {
  subjects: Subject[];
  professors: Professor[];
  rooms: Room[];
  classes: Class[];
}

export interface ClassWithDetails
  extends Omit<Class, "subjectId" | "professorId" | "roomId"> {
  subject: Subject;
  professor: Professor;
  room: Room;
}

export interface RoomWithOccupancyInfo {
  room: Room;
  currentOccupancy: ClassWithDetails | null;
  nextOccupancy: ClassWithDetails | null;
  timeUntilOccupancy: number | null;
  timeUntilFree: number | null;
  occupiedUntilEnd?: boolean;
}

export interface ProfessorWithOccupancyInfo {
  professor: Professor;
  currentOccupancy: ClassWithDetails | null;
  nextOccupancy: ClassWithDetails | null;
  timeUntilOccupancy: number | null;
  timeUntilFree: number | null;
  occupiedUntilEnd?: boolean;
}

// ==================== TIPOS DE BEETEACHER ====================

export type TutorModality = "PRESENCIAL" | "VIRTUAL";

export type CommunityOrigin = "DICIS" | "DEM" | "DCEA" | "Externo";
export type SedeFilter = "ALL" | "DICIS" | "DEM" | "DCEA";

export interface TutorScheduleSlot {
  day: DayOfWeek;
  start: string;
  end: string;
}

export interface TutorReview {
  id: string;
  studentNua: string;
  stars: number;
  subject: string;
  modality: string;
  comment: string;
  date: string;
}

export interface TutorProfile {
  id: string;
  fullName: string;
  email?: string;
  age?: string;
  stateOfOrigin?: string;
  career: string;
  semester: string;
  communityTag: CommunityOrigin;
  isExternal: boolean;
  isTutorPar: boolean;
  verified: boolean;
  modalities: TutorModality[];
  headquarters: string;
  whatsapp: string;
  price30: number;
  price60: number;
  tutorParNote?: string;
  subjectTags: string[];
  bio: string;
  avatarUrl?: string;
  coverUrl?: string;
  coverGradient?: string;
  schedules: TutorScheduleSlot[];
  reviews: TutorReview[];
}
