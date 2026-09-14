"use client";

import { useState } from "react";

import {
  AdminPageHeader,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/ui";

import CrearInstrumentoDialog from "./CrearInstrumentoDialog";
import CrearTipoInstrumentoDialog from "./CrearTipoInstrumentoDialog";
import InstrumentosTab from "./InstrumentosTab";
import TiposInstrumentoTab from "./TiposInstrumentoTab";

export default function InstrumentosList() {
  const [tab, setTab] = useState("instrumentos");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <AdminPageHeader
          eyebrow="Catálogos · GOSMEL"
          title="Instrumentos"
          description="Catálogo de instrumentos y familias musicales ofertadas por la academia."
          icon="ph:guitar"
        />
        {tab === "instrumentos" ? <CrearInstrumentoDialog /> : <CrearTipoInstrumentoDialog />}
      </div>

      <Tabs value={tab} onValueChange={setTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 sm:w-fit">
          <TabsTrigger value="instrumentos">Instrumentos</TabsTrigger>
          <TabsTrigger value="familias">Familias</TabsTrigger>
        </TabsList>

        <TabsContent value="instrumentos" className="pt-2">
          <InstrumentosTab />
        </TabsContent>
        <TabsContent value="familias" className="pt-2">
          <TiposInstrumentoTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
