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
      .select("cuota_id, periodo_mes, monto, monto_pagado, saldo, fecha_vencimiento, estado_efectivo, dias_mora")
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
    const { data, error } = await supabase
      .from("pagos")
      .select("id, fecha_pago, monto, metodo, referencia, comprobante_storage_path, estado, observacion, cuota_id, cuotas!pagos_cuota_id_fkey(periodo_mes)")
      .in("cuota_id", cuotaIds)
      .order("fecha_pago", { ascending: false })
      .limit(100);

    if (error) {
      return { data: null, error: error.message };
    }

    pagos = (data ?? []).map((pago) => ({
      id: pago.id,
      fecha: pago.fecha_pago,
      monto: Number(pago.monto) || 0,
      metodo: pago.metodo ?? "",
      referencia: pago.referencia,
      comprobantePath: pago.comprobante_storage_path,
      periodo: pago.cuotas?.periodo_mes ?? "",
      estado: (pago.estado ?? "aprobado") as IStudentPago["estado"],
      observacion: pago.observacion,
      cuotaId: pago.cuota_id,
    }));
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