import { describe, expect, it } from "vitest";

import { createFakeSupabase } from "@/test/supabase";

import { getCuotasPendientesFamilia } from "./getCuotasPendientesFamilia";

describe("getCuotasPendientesFamilia", () => {
  it("consulta el estado de cuenta por responsable y descarta filas incompletas", async () => {
    const result = await getCuotasPendientesFamilia(
      "r1",
      "representante",
      createFakeSupabase({
        v_estado_cuenta: [
          { cuota_id: "q2", estudiante_id: "e2", estudiante: "Alan Turing", responsable_representante_id: "r1", periodo_mes: "2026-06", monto: 40, monto_pagado: 0, saldo: 40, saldo_reservado: 10, fecha_vencimiento: "2026-06-10", estado_efectivo: "vencida" },
          { cuota_id: "q1", estudiante_id: "e1", estudiante: "Ada Lovelace", responsable_representante_id: "r1", periodo_mes: "2026-05", monto: 50, monto_pagado: 20, saldo: 30, saldo_reservado: 0, fecha_vencimiento: "2026-05-10", estado_efectivo: "parcial" },
          { cuota_id: "q3", estudiante_id: "e3", estudiante: "Fuera del responsable", responsable_representante_id: "r2", periodo_mes: "2026-06", monto: 10, monto_pagado: 0, saldo: 10, saldo_reservado: 0, fecha_vencimiento: "2026-06-10", estado_efectivo: "pendiente" },
          { cuota_id: null, estudiante_id: "e1", estudiante: null, responsable_representante_id: "r1", periodo_mes: "2026-06", monto: 10, monto_pagado: 0, saldo: 10, saldo_reservado: 0, fecha_vencimiento: null, estado_efectivo: "pendiente" },
        ],
      }),
    );

    expect(result.error).toBeNull();
    expect(result.data).toHaveLength(2);
    expect(result.data!.map((item) => item.cuotaId)).toEqual(["q1", "q2"]);
    expect(result.data![0]).toMatchObject({ estudianteId: "e1", saldo: 30, saldoReservado: 0 });
  });

  it("incluye cuotas de un estudiante adulto sin representante", async () => {
    const result = await getCuotasPendientesFamilia(
      "e1",
      "estudiante",
      createFakeSupabase({
        v_estado_cuenta: [
          { cuota_id: "q1", estudiante_id: "e1", estudiante: "Ada Lovelace", responsable_representante_id: null, periodo_mes: "2026-06", monto: 50, monto_pagado: 0, saldo: 50, saldo_reservado: 0, fecha_vencimiento: "2026-06-05", estado_efectivo: "pendiente" },
          { cuota_id: "q2", estudiante_id: "e1", estudiante: "Ada Lovelace", responsable_representante_id: "r1", periodo_mes: "2026-06", monto: 50, monto_pagado: 0, saldo: 50, saldo_reservado: 0, fecha_vencimiento: "2026-06-05", estado_efectivo: "pendiente" },
        ],
      }),
    );

    expect(result).toMatchObject({ data: [{ cuotaId: "q1", estudianteId: "e1" }], error: null });
  });

  it("propaga el error de la fuente canónica de estado de cuenta", async () => {
    const result = await getCuotasPendientesFamilia(
      "r1",
      "representante",
      createFakeSupabase.withError("v_estado_cuenta", "vista caída"),
    );

    expect(result).toEqual({ data: null, error: "vista caída" });
  });
});
