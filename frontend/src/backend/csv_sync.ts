import type {
  CommunityOrigin,
  DayOfWeek,
  TutorModality,
  TutorProfile,
  TutorReview,
  TutorScheduleSlot,
} from "./types";

export const DICIS_SHEETS_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRZ1dtPdjG1fLpE_aVzKmbW2qiWzJl1IcMqjYcWc5hJGnTw3uNUCj3FG8b30xjhWBZ32vOYTS2wRGRN/pub?gid=1902917026&single=true&output=csv";

export const EXTERNOS_SHEETS_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRZ1dtPdjG1fLpE_aVzKmbW2qiWzJl1IcMqjYcWc5hJGnTw3uNUCj3FG8b30xjhWBZ32vOYTS2wRGRN/pub?gid=1158175325&single=true&output=csv";

export const REVIEWS_SHEETS_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRZ1dtPdjG1fLpE_aVzKmbW2qiWzJl1IcMqjYcWc5hJGnTw3uNUCj3FG8b30xjhWBZ32vOYTS2wRGRN/pub?gid=1285429493&single=true&output=csv";

const DAY_MAP: Record<string, DayOfWeek> = {
  lunes: "MONDAY",
  martes: "TUESDAY",
  miercoles: "WEDNESDAY",
  miércoles: "WEDNESDAY",
  jueves: "THURSDAY",
  juves: "THURSDAY",
  viernes: "FRIDAY",
  sabado: "SATURDAY",
  sábado: "SATURDAY",
};

// Palabras reservadas de columnas estadísticas para que nunca interfieran con otros campos
const STATS_EXCLUDES = [
  "edad",
  "entidad",
  "origen",
  "estado de procedencia",
  "municipio",
  "nacimiento",
  "nacimineto",
  "estadístic",
  "estadistic",
  "esatdistic",
];

export function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        currentField += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        currentField += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        currentRow.push(currentField.trim());
        currentField = "";
      } else if (ch === "\r" && next === "\n") {
        currentRow.push(currentField.trim());
        rows.push(currentRow);
        currentRow = [];
        currentField = "";
        i++;
      } else if (ch === "\n") {
        currentRow.push(currentField.trim());
        rows.push(currentRow);
        currentRow = [];
        currentField = "";
      } else {
        currentField += ch;
      }
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    rows.push(currentRow);
  }

  if (rows.length < 2) return [];
  const headers = rows[0].map((h) => h.trim());

  return rows
    .slice(1)
    .filter((r) => r.some((cell) => cell !== ""))
    .map((r) => {
      const obj: Record<string, string> = {};
      headers.forEach((h, idx) => {
        obj[h] = r[idx] ?? "";
      });
      return obj;
    });
}

export function driveUrlToDirectImage(url: string): string {
  if (!url || !url.trim() || !url.includes("http")) return "";
  const match = url.match(/(?:id=|\/d\/)([a-zA-Z0-9_-]{15,})/);
  if (match?.[1]) {
    return `/api/v1/image?id=${match[1]}`;
  }
  return url.trim();
}

function findField(
  row: Record<string, string>,
  keywords: string[],
  excludeKeywords: string[] = [],
): string {
  for (const [key, val] of Object.entries(row)) {
    const lower = key.toLowerCase();
    if (
      keywords.some((kw) => lower.includes(kw)) &&
      !excludeKeywords.some((ex) => lower.includes(ex))
    ) {
      return val;
    }
  }
  return "";
}

function resolveSedeAndHeadquarters(
  row: Record<string, string>,
  career: string,
): { communityTag: CommunityOrigin; headquarters: "Salamanca" | "Yuriria" | "Marfil" } {
  const rawSede = findField(
    row,
    ["sede", "campus", "división", "division", "unidad"],
    [...STATS_EXCLUDES, "correo", "nombre", "precio", "modalidad"],
  ).toLowerCase();

  const lowerCareer = career.toLowerCase();

  if (
    rawSede.includes("dcea") ||
    rawSede.includes("marfil") ||
    rawSede.includes("guanajuato") ||
    lowerCareer.includes("contador público") ||
    lowerCareer.includes("contador publico") ||
    lowerCareer.includes("calidad y la productividad") ||
    lowerCareer.includes("comercio internacional") ||
    lowerCareer.includes("lic. en economía") ||
    lowerCareer.includes("lic. en economia") ||
    lowerCareer.includes("relaciones industriales") ||
    lowerCareer.includes("información administrativa") ||
    lowerCareer.includes("informacion administrativa") ||
    lowerCareer.includes("recursos turísticos") ||
    lowerCareer.includes("recursos turisticos") ||
    lowerCareer.includes("posgrado dcea")
  ) {
    return { communityTag: "DCEA", headquarters: "Marfil" };
  }

  if (
    rawSede.includes("dem") ||
    rawSede.includes("yuriria") ||
    lowerCareer.includes("automatización") ||
    lowerCareer.includes("automatizacion") ||
    lowerCareer.includes("enseñanza del inglés") ||
    lowerCareer.includes("ensenanza del ingles") ||
    lowerCareer.includes("administración de tecnologías") ||
    lowerCareer.includes("administracion de tecnologias") ||
    lowerCareer.includes("electrónica aplicada") ||
    lowerCareer.includes("electronica aplicada")
  ) {
    return { communityTag: "DEM", headquarters: "Yuriria" };
  }

  return { communityTag: "DICIS", headquarters: "Salamanca" };
}

function extractAvatarAndCover(row: Record<string, string>): {
  avatarUrl: string;
  coverUrl: string;
} {
  let avatarRaw = findField(
    row,
    ["foto de perfil", "imagen de perfil", "cuadrada"],
    ["nombre", "sobre", "descripción", "descripcion", "profesional", ...STATS_EXCLUDES],
  );
  let coverRaw = findField(
    row,
    ["portada", "fondo", "facebook", "horizontal"],
    ["nombre", "sobre", "descripción", "descripcion", ...STATS_EXCLUDES],
  );

  const driveLinks = Object.entries(row)
    .filter(([, val]) => val && val.includes("http"))
    .map(([key, val]) => ({ key: key.toLowerCase(), val }));

  if (!avatarRaw.includes("http") && driveLinks.length >= 1) {
    const foundAvatar = driveLinks.find(
      (d) =>
        !d.key.includes("portada") &&
        !d.key.includes("fondo") &&
        !d.key.includes("facebook"),
    );
    if (foundAvatar) avatarRaw = foundAvatar.val;
  }

  if (!coverRaw.includes("http") && driveLinks.length >= 1) {
    const foundCover = driveLinks.find(
      (d) =>
        d.key.includes("portada") ||
        d.key.includes("fondo") ||
        d.key.includes("facebook") ||
        d.key.includes("horizontal"),
    );
    if (foundCover) {
      coverRaw = foundCover.val;
    } else if (driveLinks.length >= 2) {
      coverRaw = driveLinks[1].val;
    }
  }

  return {
    avatarUrl: driveUrlToDirectImage(avatarRaw),
    coverUrl: driveUrlToDirectImage(coverRaw),
  };
}

function extractTagsFromRow(row: Record<string, string>): string[] {
  const tags: string[] = [];
  for (const [key, val] of Object.entries(row)) {
    const lower = key.toLowerCase();
    if (
      (lower.includes("etiqueta") || lower.includes("materia")) &&
      val.trim()
    ) {
      for (const part of val.split(",")) {
        const cleaned = part.trim().replace(/^#+/, "").trim();
        if (cleaned && !tags.includes(cleaned)) {
          tags.push(cleaned);
        }
      }
    }
  }
  return tags.length > 0 ? tags : ["Cálculo"];
}

function extractSchedulesFromRow(
  row: Record<string, string>,
): TutorScheduleSlot[] {
  const slots: TutorScheduleSlot[] = [];
  for (const [key, val] of Object.entries(row)) {
    if (!val) continue;
    const lower = key.toLowerCase();
    for (const [dayEs, dayEn] of Object.entries(DAY_MAP)) {
      if (lower.includes(`[${dayEs}]`) || lower.endsWith(dayEs)) {
        for (const chunk of val.split(",")) {
          const times = chunk.match(/\d{1,2}:\d{2}/g);
          if (times && times.length >= 2) {
            slots.push({
              day: dayEn,
              start: times[0].padStart(5, "0"),
              end: times[1].padStart(5, "0"),
            });
          }
        }
        break;
      }
    }
  }
  return slots.length > 0
    ? slots
    : [{ day: "WEDNESDAY", start: "12:00", end: "14:00" }];
}

function extractBioFromRow(row: Record<string, string>, fallback: string): string {
  const bio = findField(
    row,
    [
      "sobre mí",
      "sobre mi",
      "sobre ti",
      "descripción",
      "descripcion",
      "temas específicos",
      "temas especificos",
      "experiencia",
      "biografía",
      "biografia",
    ],
    [
      "nombre",
      "foto",
      "imagen",
      "portada",
      "nota",
      "aclaración",
      "carrera",
      "perfil profesional",
      ...STATS_EXCLUDES,
    ],
  );
  return bio.trim() || fallback;
}

export async function fetchLiveTutorsFromSheets(
  fallbackTutors: TutorProfile[],
): Promise<TutorProfile[]> {
  try {
    const [dicisRes, extRes, revRes] = await Promise.all([
      fetch(DICIS_SHEETS_CSV_URL, { cache: "no-store" }),
      fetch(EXTERNOS_SHEETS_CSV_URL, { cache: "no-store" }),
      fetch(REVIEWS_SHEETS_CSV_URL, { cache: "no-store" }),
    ]);

    const dicisText = dicisRes.ok ? await dicisRes.text() : "";
    const extText = extRes.ok ? await extRes.text() : "";
    const revText = revRes.ok ? await revRes.text() : "";

    const seenIds = new Set<string>();
    const liveTutors = new Map<string, TutorProfile>();

    // 1. Parsear Tutores Comunidad UG (DICIS / DEM / TutorPar)
    for (const row of parseCsv(dicisText)) {
      const nua = findField(row, ["nua"], STATS_EXCLUDES).replace(/\D/g, "");
      if (nua.length !== 6) continue;
      if (seenIds.has(nua)) continue;
      seenIds.add(nua);

      const fullName = findField(row, ["nombre"], STATS_EXCLUDES);
      if (!fullName) continue;

      const email = findField(row, ["correo", "email", "mail", "@"], STATS_EXCLUDES).trim();
      const age = findField(row, ["edad"], ["modalidad", "comunidad", "universidad"]).trim();
      const stateOfOrigin = findField(
        row,
        ["entidad", "nacimineto", "nacimiento", "estado de origen", "lugar de origen", "origen"],
        ["comunidad", "etiqueta"],
      ).trim();

      const tutorParField = findField(
        row,
        ["tutor par", "pares", "beca"],
        STATS_EXCLUDES,
      ).toLowerCase();
      const isTutorPar =
        tutorParField.includes("sí") ||
        tutorParField.includes("si") ||
        tutorParField.includes("tutorpar");

      const modField = findField(row, ["modalidad"]).toUpperCase();
      const modalities: TutorModality[] = [];
      if (modField.includes("PRESENCIAL")) modalities.push("PRESENCIAL");
      if (
        modField.includes("VIRTUAL") ||
        modField.includes("LÍNEA") ||
        modField.includes("LINEA")
      ) {
        modalities.push("VIRTUAL");
      }
      if (modalities.length === 0) modalities.push("PRESENCIAL");

      const whatsapp = findField(
        row,
        ["whatsapp", "teléfono", "telefono", "celular", "número", "numero"],
        ["nua", "precio", ...STATS_EXCLUDES],
      )
        .replace(/\D/g, "")
        .slice(-10);

      const price30 =
        Number.parseFloat(findField(row, ["30"], STATS_EXCLUDES) || "0") || 0;
      const price60 =
        Number.parseFloat(
          findField(
            row,
            ["1 hora", "hora"],
            ["30", "horario", "condicion", "nota", ...STATS_EXCLUDES],
          ) || "0",
        ) || 0;

      const career =
        findField(row, ["carrera", "programa"], STATS_EXCLUDES) ||
        "Ingeniería UG";

      const { communityTag, headquarters } = resolveSedeAndHeadquarters(
        row,
        career,
      );

      const { avatarUrl, coverUrl } = extractAvatarAndCover(row);

      liveTutors.set(nua, {
        id: nua,
        fullName,
        email,
        age,
        stateOfOrigin,
        career,
        semester:
          findField(row, ["semestre", "rol"], STATS_EXCLUDES) || "Comunidad UG",
        communityTag,
        isExternal: false,
        isTutorPar,
        verified: true,
        modalities,
        headquarters,
        whatsapp,
        price30,
        price60,
        tutorParNote: findField(
          row,
          ["nota", "aclaración", "aclaracion", "condicion"],
          STATS_EXCLUDES,
        ),
        subjectTags: extractTagsFromRow(row),
        bio: extractBioFromRow(
          row,
          `Tutor verificado de la comunidad ${communityTag}.`,
        ),
        avatarUrl,
        coverUrl,
        coverGradient: isTutorPar
          ? "from-indigo-600 via-emerald-600 to-teal-700"
          : communityTag === "DEM"
            ? "from-cyan-600 via-teal-600 to-emerald-700"
            : communityTag === "DCEA"
              ? "from-purple-600 via-indigo-600 to-slate-800"
              : "from-blue-700 via-indigo-700 to-slate-800",
        schedules: extractSchedulesFromRow(row),
        reviews: [],
      });
    }

    // 2. Parsear Tutores Externos
    const extRows = parseCsv(extText);
    extRows.forEach((row, idx) => {
      const fullName = findField(row, ["nombre"], STATS_EXCLUDES);
      if (!fullName) return;

      const email = findField(row, ["correo", "email", "mail", "@"], STATS_EXCLUDES).trim();
      const age = findField(row, ["edad"], ["modalidad", "comunidad", "universidad"]).trim();
      const stateOfOrigin = findField(
        row,
        ["entidad", "nacimineto", "nacimiento", "estado de origen", "lugar de origen", "origen"],
        ["comunidad", "etiqueta"],
      ).trim();

      const whatsapp = findField(
        row,
        ["whatsapp", "teléfono", "telefono", "celular", "número", "numero"],
        ["precio", "modalidad", ...STATS_EXCLUDES],
      )
        .replace(/\D/g, "")
        .slice(-10);

      const nuaOrCode = findField(row, ["nua"], ["modalidad", ...STATS_EXCLUDES]).replace(
        /\D/g,
        "",
      );
      const uniqueSuffix = whatsapp || nuaOrCode || String(1000 + idx);
      const extId = `EXT-${uniqueSuffix}`;

      if (seenIds.has(extId)) return;
      seenIds.add(extId);

      const modField = findField(row, ["modalidad"]).toUpperCase();
      const modalities: TutorModality[] = [];
      if (modField.includes("PRESENCIAL")) modalities.push("PRESENCIAL");
      if (
        modField.includes("VIRTUAL") ||
        modField.includes("LÍNEA") ||
        modField.includes("LINEA")
      ) {
        modalities.push("VIRTUAL");
      }
      if (modalities.length === 0) modalities.push("VIRTUAL");

      const price30 =
        Number.parseFloat(findField(row, ["30"], STATS_EXCLUDES) || "0") || 0;
      const price60 =
        Number.parseFloat(
          findField(
            row,
            ["1 hora", "hora"],
            ["30", "horario", "condicion", "nota", ...STATS_EXCLUDES],
          ) || "0",
        ) || 0;

      const { avatarUrl, coverUrl } = extractAvatarAndCover(row);

      liveTutors.set(extId, {
        id: extId,
        fullName,
        email,
        age,
        stateOfOrigin,
        career:
          findField(
            row,
            ["perfil profesional", "formación", "formacion", "carrera", "profesión"],
            ["foto", "nombre", "sobre", ...STATS_EXCLUDES],
          ) || "Asesor Independiente",
        semester: "Asesor Externo",
        communityTag: "Externo",
        isExternal: true,
        isTutorPar: false,
        verified: true,
        modalities,
        headquarters: "Salamanca",
        whatsapp,
        price30,
        price60,
        tutorParNote: findField(
          row,
          ["nota", "aclaración", "aclaracion", "condicion", "punto de reunión"],
          STATS_EXCLUDES,
        ),
        subjectTags: extractTagsFromRow(row),
        bio: extractBioFromRow(row, "Asesor externo registrado en BeeTeacher."),
        avatarUrl,
        coverUrl,
        coverGradient: "from-amber-600 via-orange-600 to-rose-700",
        schedules: extractSchedulesFromRow(row),
        reviews: [],
      });
    });

    // 3. Agregar los tutores base de tutors.json si su ID no choca
    for (const fb of fallbackTutors) {
      if (!seenIds.has(fb.id)) {
        seenIds.add(fb.id);
        liveTutors.set(fb.id, { ...fb, reviews: [...(fb.reviews || [])] });
      }
    }

    // 4. Vincular Comentarios por NUA/ID del Tutor
    const revRows = parseCsv(revText);
    revRows.forEach((row, idx) => {
      const values = Object.values(row);
      const targetTutorId = (
        findField(row, [
          "id o nua",
          "nua del tutor",
          "tutor que estás",
          "id del tutor",
        ]) ||
        values[1] ||
        ""
      ).trim();

      const tutor =
        liveTutors.get(targetTutorId) ||
        liveTutors.get(`EXT-${targetTutorId}`);
      if (!tutor) return;

      const studentNua =
        findField(row, ["tu nua", "estudiante"]) || values[3] || "000000";
      const starsRaw = Number.parseInt(
        findField(row, ["calificación", "calificacion", "estrellas"]) ||
          values[4] ||
          "5",
        10,
      );
      const stars = Number.isNaN(starsRaw)
        ? 5
        : Math.min(5, Math.max(1, starsRaw));
      const subject =
        findField(row, ["materia"]) || tutor.subjectTags[0] || "Asesoría";
      const comment =
        findField(row, ["comentario", "reseña", "escribe"]) ||
        values[values.length - 1] ||
        "";

      if (!comment) return;

      const reviewObj: TutorReview = {
        id: `sheet_rev_${idx + 1}`,
        studentNua,
        stars,
        subject,
        modality: "Verificada por NUA",
        comment,
        date: (values[0] || "").split(" ")[0] || "Reciente",
      };

      tutor.reviews.unshift(reviewObj);
    });

    return Array.from(liveTutors.values());
  } catch (err) {
    console.error(
      "Error reading live Google Sheets CSV, using local tutors.json:",
      err,
    );
    return fallbackTutors;
  }
}
