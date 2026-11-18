"use client";

import { Sparkles, Users } from "lucide-react";
import { useState } from "react";
import Badge from "@/components/common/Badge";
import EmptyState from "@/components/common/EmptyState";
import LayoutSection from "@/components/common/LayoutSection";
import PageHeader from "@/components/common/PageHeader";
import SearchBar from "@/components/common/SearchBar";
import Tabs from "@/components/common/Tabs";

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [originTab, setOriginTab] = useState<"ALL" | "DICIS" | "EXTERNO">("ALL");

  return (
    <div className="space-y-8 py-4">
      <LayoutSection>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Buscar por materia (#Cálculo, #Programación), nombre o NUA..."
            className="flex-1"
          />
          <Tabs
            tabs={[
              { id: "ALL", label: "Todos" },
              { id: "DICIS", label: "#DICIS / #TutorPar" },
              { id: "EXTERNO", label: "#Externo" },
            ]}
            activeTab={originTab}
            onChange={setOriginTab}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="warning" icon={<Sparkles className="w-3 h-3" />}>
            #Cálculo
          </Badge>
          <Badge variant="info">#Programación</Badge>
          <Badge variant="success">★ #TutorPar</Badge>
          <Badge variant="neutral">#EcuacionesDiferenciales</Badge>
        </div>

        <PageHeader
          title="Directorio de Tutores"
          icon={Users}
          count={0}
          countLabel="tutores cargados (Entregable 1 — Base UI)"
        />

        <EmptyState message="Estructura base del directorio lista. En el Entregable 2 se conectará la sincronización con Google Sheets CSV y el cruce de salones vacíos." />
      </LayoutSection>
    </div>
  );
}
