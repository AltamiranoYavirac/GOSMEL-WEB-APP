import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/api/supabase/database.types";

import type { IContactoInstitucional, IStudentAcuerdo, IStudentFinanzas, IStudentPago, TEstadoAcuerdo } from "../model/student-dashboard.types";

export async function getStudentAccountStatement(
  estudianteId: string,
  supabase: SupabaseClient<Database> = createSupabaseBrowserClient(),
): Promise<{
  data: IStudentFinanzas | null;
  error: string | null;
}> {

  const [cuentas, acuerdos, contacto] = await Promise.all([
    supabase
      .from("v_estado_cuenta")
      .select("cuota_id, periodo_mes, monto, monto_pagado, saldo, saldo_reservado, fecha_vencimiento, estado_efectivo, dias_mora")
      .eq("estudiante_id", estudianteId)
      .order("periodo_mes", { ascending: false }),
    supabase
      .from("acuerdos_pago")
      .select("monto_mensual, moneda, dia_cobro, estado")
      .eq("estudiante_id", estudianteId)
      .eq("estado", "vigente")
      .order("created_at", { ascending: false }),
    supabase
      .from("configuracion_sitio")
      .select("telefono, whatsapp, email_general, horario_atencion")
      .eq("id", 1)
      .maybeSingle(),
  ]);

  if (cuentas.error || acuerdos.error) {
    return {
      data: null,
      error: cuentas.error?.message ?? acuerdos.error?.message ?? "Error al cargar el estado de cuenta",
    };
  }

  const cuotaIds = (cuentas.data ?? []).map((row) => row.cuota_id).filter((id): id is string => Boolean(id));

  let pagos: IStudentPago[] = [];
  if (cuotaIds.length > 0) {
    const { data: aplicaciones, error: aplicacionesError } = await supabase
      .from("cobro_aplicaciones")
      .select("cobro_id, cuota_id, monto")
      .in("cuota_id", cuotaIds);
    if (aplicacionesError) return { data: null, error: aplicacionesError.message };

    const cobroIds = [...new Set((aplicaciones ?? []).map((aplicacion) => aplicacion.cobro_id))];
    const { data: cobros, error: cobrosError } = cobroIds.length
      ? await supabase.from("cobros").select("id, fecha_pago, metodo, referencia, comprobante_storage_path, estado, observacion").in("id", cobroIds).order("fecha_pago", { ascending: false })
      : { data: [], error: null };
    if (cobrosError) return { data: null, error: cobrosError.message };

    const cuotaPorId = new Map((cuentas.data ?? []).map((cuota) => [cuota.cuota_id, cuota]));
    const cobroPorId = new Map((cobros ?? []).map((cobro) => [cobro.id, cobro]));
    pagos = (aplicaciones ?? []).flatMap((aplicacion) => {
      const cobro = cobroPorId.get(aplicacion.cobro_id);
      const cuota = cuotaPorId.get(aplicacion.cuota_id);
      if (!cobro) return [];
      return [{
        id: cobro.id,
        fecha: cobro.fecha_pago,
        monto: Number(aplicacion.monto) || 0,
        metodo: cobro.metodo ?? "",
        referencia: cobro.referencia,
        comprobantePath: cobro.comprobante_storage_path,
        periodo: cuota?.periodo_mes ?? "",
        estado: cobro.estado as IStudentPago["estado"],
        observacion: cobro.observacion,
        cuotaId: aplicacion.cuota_id,
      }];
    });
  }

  const cuotasConPagoPendiente = new Set(
    pagos.filter((p) => p.estado === "pendiente_verificacion").map((p) => p.cuotaId).filter(Boolean)
  );

  const acuerdosList = acuerdos.data ?? [];
  const acuerdo: IStudentAcuerdo | null =
    acuerdosList.length > 0
      ? {
          montoMensual: acuerdosList.reduce((acc, a) => acc + (Number(a.monto_mensual) || 0), 0),
          moneda: acuerdosList[0].moneda ?? "USD",
          diaCobro: acuerdosList[0].dia_cobro,
          estado: (acuerdosList[0].estado ?? "vigente") as TEstadoAcuerdo,
        }
      : null;

  const contactoRow: IContactoInstitucional = {
    telefono: contacto.data?.telefono ?? null,
    whatsapp: contacto.data?.whatsapp ?? null,
    emailGeneral: contacto.data?.email_general ?? null,
    horarioAtencion: contacto.data?.horario_atencion ?? null,
  };

  return {
    data: {
      acuerdo,
      cuotas: (cuentas.data ?? []).map((row) => ({
        cuotaId: row.cuota_id ?? "",
        periodo: row.periodo_mes ?? "",
        monto: Number(row.monto) || 0,
        montoPagado: Number(row.monto_pagado) || 0,
        saldo: Number(row.saldo) || 0,
        saldoReservado: Number(row.saldo_reservado) || 0,
        fechaVencimiento: row.fecha_vencimiento,
        estadoEfectivo: row.estado_efectivo ?? "pendiente",
        diasMora: row.dias_mora ?? 0,
        tienePagoPendiente: cuotasConPagoPendiente.has(row.cuota_id ?? ""),
      })),
      pagos,
      contacto: contactoRow,
    },
    error: null,
  };
}
