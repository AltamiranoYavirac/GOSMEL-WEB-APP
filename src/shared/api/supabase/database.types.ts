export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      actividades: {
        Row: {
          created_at: string
          descripcion: string | null
          entidad_id: string | null
          entidad_tipo: string | null
          estudiante_id: string | null
          id: string
          perfil_id: string | null
          tipo: string
          titulo: string
        }
        Insert: {
          created_at?: string
          descripcion?: string | null
          entidad_id?: string | null
          entidad_tipo?: string | null
          estudiante_id?: string | null
          id?: string
          perfil_id?: string | null
          tipo: string
          titulo: string
        }
        Update: {
          created_at?: string
          descripcion?: string | null
          entidad_id?: string | null
          entidad_tipo?: string | null
          estudiante_id?: string | null
          id?: string
          perfil_id?: string | null
          tipo?: string
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "actividades_estudiante_id_fkey"
            columns: ["estudiante_id"]
            isOneToOne: false
            referencedRelation: "estudiantes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "actividades_estudiante_id_fkey"
            columns: ["estudiante_id"]
            isOneToOne: false
            referencedRelation: "v_estado_cuenta"
            referencedColumns: ["estudiante_id"]
          },
          {
            foreignKeyName: "actividades_estudiante_id_fkey"
            columns: ["estudiante_id"]
            isOneToOne: false
            referencedRelation: "v_estudiantes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "actividades_estudiante_id_fkey"
            columns: ["estudiante_id"]
            isOneToOne: false
            referencedRelation: "v_solicitudes_matricula"
            referencedColumns: ["estudiante_id"]
          },
          {
            foreignKeyName: "actividades_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "actividades_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "v_representantes_vinculables"
            referencedColumns: ["perfil_sugerido"]
          },
        ]
      }
      acuerdos_pago: {
        Row: {
          acordado_por: string | null
          created_at: string
          dia_cobro: number | null
          estado: Database["public"]["Enums"]["estado_acuerdo"]
          estudiante_id: string
          fecha_fin: string | null
          fecha_inicio: string
          id: string
          inscripcion_id: string | null
          moneda: string
          monto_mensual: number
          motivo_ajuste: string | null
          observaciones: string | null
          updated_at: string
        }
        Insert: {
          acordado_por?: string | null
          created_at?: string
          dia_cobro?: number | null
          estado?: Database["public"]["Enums"]["estado_acuerdo"]
          estudiante_id: string
          fecha_fin?: string | null
          fecha_inicio?: string
          id?: string
          inscripcion_id?: string | null
          moneda?: string
          monto_mensual: number
          motivo_ajuste?: string | null
          observaciones?: string | null
          updated_at?: string
        }
        Update: {
          acordado_por?: string | null
          created_at?: string
          dia_cobro?: number | null
          estado?: Database["public"]["Enums"]["estado_acuerdo"]
          estudiante_id?: string
          fecha_fin?: string | null
          fecha_inicio?: string
          id?: string
          inscripcion_id?: string | null
          moneda?: string
          monto_mensual?: number
          motivo_ajuste?: string | null
          observaciones?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "acuerdos_pago_acordado_por_fkey"
            columns: ["acordado_por"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "acuerdos_pago_acordado_por_fkey"
            columns: ["acordado_por"]
            isOneToOne: false
            referencedRelation: "v_representantes_vinculables"
            referencedColumns: ["perfil_sugerido"]
          },
          {
            foreignKeyName: "acuerdos_pago_estudiante_id_fkey"
            columns: ["estudiante_id"]
            isOneToOne: false
            referencedRelation: "estudiantes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "acuerdos_pago_estudiante_id_fkey"
            columns: ["estudiante_id"]
            isOneToOne: false
            referencedRelation: "v_estado_cuenta"
            referencedColumns: ["estudiante_id"]
          },
          {
            foreignKeyName: "acuerdos_pago_estudiante_id_fkey"
            columns: ["estudiante_id"]
            isOneToOne: false
            referencedRelation: "v_estudiantes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "acuerdos_pago_estudiante_id_fkey"
            columns: ["estudiante_id"]
            isOneToOne: false
            referencedRelation: "v_solicitudes_matricula"
            referencedColumns: ["estudiante_id"]
          },
          {
            foreignKeyName: "acuerdos_pago_inscripcion_id_fkey"
            columns: ["inscripcion_id"]
            isOneToOne: false
            referencedRelation: "inscripciones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "acuerdos_pago_inscripcion_id_fkey"
            columns: ["inscripcion_id"]
            isOneToOne: false
            referencedRelation: "v_promedio_academico"
            referencedColumns: ["inscripcion_id"]
          },
          {
            foreignKeyName: "acuerdos_pago_inscripcion_id_fkey"
            columns: ["inscripcion_id"]
            isOneToOne: false
            referencedRelation: "v_solicitudes_matricula"
            referencedColumns: ["inscripcion_id"]
          },
        ]
      }
      asistencias: {
        Row: {
          estado: Database["public"]["Enums"]["estado_asistencia"]
          inscripcion_id: string
          observacion: string | null
          registrada_en: string
          sesion_id: string
        }
        Insert: {
          estado?: Database["public"]["Enums"]["estado_asistencia"]
          inscripcion_id: string
          observacion?: string | null
          registrada_en?: string
          sesion_id: string
        }
        Update: {
          estado?: Database["public"]["Enums"]["estado_asistencia"]
          inscripcion_id?: string
          observacion?: string | null
          registrada_en?: string
          sesion_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "asistencias_inscripcion_id_fkey"
            columns: ["inscripcion_id"]
            isOneToOne: false
            referencedRelation: "inscripciones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asistencias_inscripcion_id_fkey"
            columns: ["inscripcion_id"]
            isOneToOne: false
            referencedRelation: "v_promedio_academico"
            referencedColumns: ["inscripcion_id"]
          },
          {
            foreignKeyName: "asistencias_inscripcion_id_fkey"
            columns: ["inscripcion_id"]
            isOneToOne: false
            referencedRelation: "v_solicitudes_matricula"
            referencedColumns: ["inscripcion_id"]
          },
          {
            foreignKeyName: "asistencias_sesion_id_fkey"
            columns: ["sesion_id"]
            isOneToOne: false
            referencedRelation: "sesiones"
            referencedColumns: ["id"]
          },
        ]
      }
      calificaciones: {
        Row: {
          calificada_en: string
          calificada_por: string | null
          evaluacion_id: string
          inscripcion_id: string
          nota: number | null
          observacion: string | null
        }
        Insert: {
          calificada_en?: string
          calificada_por?: string | null
          evaluacion_id: string
          inscripcion_id: string
          nota?: number | null
          observacion?: string | null
        }
        Update: {
          calificada_en?: string
          calificada_por?: string | null
          evaluacion_id?: string
          inscripcion_id?: string
          nota?: number | null
          observacion?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calificaciones_calificada_por_fkey"
            columns: ["calificada_por"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calificaciones_calificada_por_fkey"
            columns: ["calificada_por"]
            isOneToOne: false
            referencedRelation: "v_representantes_vinculables"
            referencedColumns: ["perfil_sugerido"]
          },
          {
            foreignKeyName: "calificaciones_evaluacion_id_fkey"
            columns: ["evaluacion_id"]
            isOneToOne: false
            referencedRelation: "evaluaciones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calificaciones_inscripcion_id_fkey"
            columns: ["inscripcion_id"]
            isOneToOne: false
            referencedRelation: "inscripciones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calificaciones_inscripcion_id_fkey"
            columns: ["inscripcion_id"]
            isOneToOne: false
            referencedRelation: "v_promedio_academico"
            referencedColumns: ["inscripcion_id"]
          },
          {
            foreignKeyName: "calificaciones_inscripcion_id_fkey"
            columns: ["inscripcion_id"]
            isOneToOne: false
            referencedRelation: "v_solicitudes_matricula"
            referencedColumns: ["inscripcion_id"]
          },
        ]
      }
      catedra_horarios: {
        Row: {
          catedra_id: string
          dia_semana: number
          hora_fin: string
          hora_inicio: string
          id: string
        }
        Insert: {
          catedra_id: string
          dia_semana: number
          hora_fin: string
          hora_inicio: string
          id?: string
        }
        Update: {
          catedra_id?: string
          dia_semana?: number
          hora_fin?: string
          hora_inicio?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "catedra_horarios_catedra_id_fkey"
            columns: ["catedra_id"]
            isOneToOne: false
            referencedRelation: "catedras"
            referencedColumns: ["id"]
          },
        ]
      }
      catedras: {
        Row: {
          aula: string | null
          codigo: string
          created_at: string
          cupo_maximo: number
          curso_id: string
          docente_id: string
          estado: Database["public"]["Enums"]["estado_catedra"]
          fecha_fin: string | null
          fecha_inicio: string
          id: string
          modalidad: Database["public"]["Enums"]["modalidad_curso"]
        }
        Insert: {
          aula?: string | null
          codigo: string
          created_at?: string
          cupo_maximo?: number
          curso_id: string
          docente_id: string
          estado?: Database["public"]["Enums"]["estado_catedra"]
          fecha_fin?: string | null
          fecha_inicio?: string
          id?: string
          modalidad?: Database["public"]["Enums"]["modalidad_curso"]
        }
        Update: {
          aula?: string | null
          codigo?: string
          created_at?: string
          cupo_maximo?: number
          curso_id?: string
          docente_id?: string
          estado?: Database["public"]["Enums"]["estado_catedra"]
          fecha_fin?: string | null
          fecha_inicio?: string
          id?: string
          modalidad?: Database["public"]["Enums"]["modalidad_curso"]
        }
        Relationships: [
          {
            foreignKeyName: "catedras_curso_id_fkey"
            columns: ["curso_id"]
            isOneToOne: false
            referencedRelation: "cursos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "catedras_docente_id_fkey"
            columns: ["docente_id"]
            isOneToOne: false
            referencedRelation: "docentes"
            referencedColumns: ["perfil_id"]
          },
        ]
      }
      certificados: {
        Row: {
          codigo_verificacion: string
          fecha_emision: string
          id: string
          inscripcion_id: string
          storage_path: string | null
        }
        Insert: {
          codigo_verificacion: string
          fecha_emision?: string
          id?: string
          inscripcion_id: string
          storage_path?: string | null
        }
        Update: {
          codigo_verificacion?: string
          fecha_emision?: string
          id?: string
          inscripcion_id?: string
          storage_path?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "certificados_inscripcion_id_fkey"
            columns: ["inscripcion_id"]
            isOneToOne: true
            referencedRelation: "inscripciones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificados_inscripcion_id_fkey"
            columns: ["inscripcion_id"]
            isOneToOne: true
            referencedRelation: "v_promedio_academico"
            referencedColumns: ["inscripcion_id"]
          },
          {
            foreignKeyName: "certificados_inscripcion_id_fkey"
            columns: ["inscripcion_id"]
            isOneToOne: true
            referencedRelation: "v_solicitudes_matricula"
            referencedColumns: ["inscripcion_id"]
          },
        ]
      }
      configuracion_sitio: {
        Row: {
          actualizado_por: string | null
          ciudad: string | null
          direccion: string | null
          email_admisiones: string | null
          email_general: string | null
          horario_atencion: string | null
          id: number
          mapa_embed: string | null
          redes_sociales: Json
          telefono: string | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          actualizado_por?: string | null
          ciudad?: string | null
          direccion?: string | null
          email_admisiones?: string | null
          email_general?: string | null
          horario_atencion?: string | null
          id?: number
          mapa_embed?: string | null
          redes_sociales?: Json
          telefono?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          actualizado_por?: string | null
          ciudad?: string | null
          direccion?: string | null
          email_admisiones?: string | null
          email_general?: string | null
          horario_atencion?: string | null
          id?: number
          mapa_embed?: string | null
          redes_sociales?: Json
          telefono?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "configuracion_sitio_actualizado_por_fkey"
            columns: ["actualizado_por"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "configuracion_sitio_actualizado_por_fkey"
            columns: ["actualizado_por"]
            isOneToOne: false
            referencedRelation: "v_representantes_vinculables"
            referencedColumns: ["perfil_sugerido"]
          },
        ]
      }
      cuotas: {
        Row: {
          acuerdo_id: string
          created_at: string
          estado: Database["public"]["Enums"]["estado_cuota"]
          fecha_pago: string | null
          fecha_vencimiento: string | null
          id: string
          monto: number
          monto_pagado: number
          periodo_mes: string
        }
        Insert: {
          acuerdo_id: string
          created_at?: string
          estado?: Database["public"]["Enums"]["estado_cuota"]
          fecha_pago?: string | null
          fecha_vencimiento?: string | null
          id?: string
          monto: number
          monto_pagado?: number
          periodo_mes: string
        }
        Update: {
          acuerdo_id?: string
          created_at?: string
          estado?: Database["public"]["Enums"]["estado_cuota"]
          fecha_pago?: string | null
          fecha_vencimiento?: string | null
          id?: string
          monto?: number
          monto_pagado?: number
          periodo_mes?: string
        }
        Relationships: [
          {
            foreignKeyName: "cuotas_acuerdo_id_fkey"
            columns: ["acuerdo_id"]
            isOneToOne: false
            referencedRelation: "acuerdos_pago"
            referencedColumns: ["id"]
          },
        ]
      }
      curso_habilidades: {
        Row: {
          curso_id: string
          habilidad: string
          id: string
          orden: number
        }
        Insert: {
          curso_id: string
          habilidad: string
          id?: string
          orden?: number
        }
        Update: {
          curso_id?: string
          habilidad?: string
          id?: string
          orden?: number
        }
        Relationships: [
          {
            foreignKeyName: "curso_habilidades_curso_id_fkey"
            columns: ["curso_id"]
            isOneToOne: false
            referencedRelation: "cursos"
            referencedColumns: ["id"]
          },
        ]
      }
      curso_lecciones: {
        Row: {
          descripcion: string | null
          duracion_minutos: number | null
          es_muestra: boolean
          id: string
          modulo_id: string
          orden: number
          titulo: string
        }
        Insert: {
          descripcion?: string | null
          duracion_minutos?: number | null
          es_muestra?: boolean
          id?: string
          modulo_id: string
          orden?: number
          titulo: string
        }
        Update: {
          descripcion?: string | null
          duracion_minutos?: number | null
          es_muestra?: boolean
          id?: string
          modulo_id?: string
          orden?: number
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "curso_lecciones_modulo_id_fkey"
            columns: ["modulo_id"]
            isOneToOne: false
            referencedRelation: "curso_modulos"
            referencedColumns: ["id"]
          },
        ]
      }
      curso_modulos: {
        Row: {
          curso_id: string
          descripcion: string | null
          id: string
          orden: number
          titulo: string
        }
        Insert: {
          curso_id: string
          descripcion?: string | null
          id?: string
          orden?: number
          titulo: string
        }
        Update: {
          curso_id?: string
          descripcion?: string | null
          id?: string
          orden?: number
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "curso_modulos_curso_id_fkey"
            columns: ["curso_id"]
            isOneToOne: false
            referencedRelation: "cursos"
            referencedColumns: ["id"]
          },
        ]
      }
      curso_resenas: {
        Row: {
          comentario: string | null
          created_at: string
          curso_id: string
          estudiante_id: string
          id: string
          publicado: boolean
          puntuacion: number
        }
        Insert: {
          comentario?: string | null
          created_at?: string
          curso_id: string
          estudiante_id: string
          id?: string
          publicado?: boolean
          puntuacion: number
        }
        Update: {
          comentario?: string | null
          created_at?: string
          curso_id?: string
          estudiante_id?: string
          id?: string
          publicado?: boolean
          puntuacion?: number
        }
        Relationships: [
          {
            foreignKeyName: "curso_resenas_curso_id_fkey"
            columns: ["curso_id"]
            isOneToOne: false
            referencedRelation: "cursos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "curso_resenas_estudiante_id_fkey"
            columns: ["estudiante_id"]
            isOneToOne: false
            referencedRelation: "estudiantes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "curso_resenas_estudiante_id_fkey"
            columns: ["estudiante_id"]
            isOneToOne: false
            referencedRelation: "v_estado_cuenta"
            referencedColumns: ["estudiante_id"]
          },
          {
            foreignKeyName: "curso_resenas_estudiante_id_fkey"
            columns: ["estudiante_id"]
            isOneToOne: false
            referencedRelation: "v_estudiantes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "curso_resenas_estudiante_id_fkey"
            columns: ["estudiante_id"]
            isOneToOne: false
            referencedRelation: "v_solicitudes_matricula"
            referencedColumns: ["estudiante_id"]
          },
        ]
      }
      cursos: {
        Row: {
          created_at: string
          descripcion: string
          destacado: boolean
          duracion_semanas: number | null
          etiqueta_precio: string | null
          horas_totales: number | null
          id: string
          instrumento_id: string | null
          modalidad: Database["public"]["Enums"]["modalidad_curso"]
          mostrar_precio: boolean
          nivel: Database["public"]["Enums"]["nivel_curso"]
          nombre: string
          orden: number
          portada_public_id: string | null
          precio_referencial: number | null
          publicado: boolean
          puntuacion_promedio: number
          resumen: string | null
          slug: string
          total_resenas: number
          updated_at: string
          video_intro_url: string | null
        }
        Insert: {
          created_at?: string
          descripcion: string
          destacado?: boolean
          duracion_semanas?: number | null
          etiqueta_precio?: string | null
          horas_totales?: number | null
          id?: string
          instrumento_id?: string | null
          modalidad?: Database["public"]["Enums"]["modalidad_curso"]
          mostrar_precio?: boolean
          nivel?: Database["public"]["Enums"]["nivel_curso"]
          nombre: string
          orden?: number
          portada_public_id?: string | null
          precio_referencial?: number | null
          publicado?: boolean
          puntuacion_promedio?: number
          resumen?: string | null
          slug: string
          total_resenas?: number
          updated_at?: string
          video_intro_url?: string | null
        }
        Update: {
          created_at?: string
          descripcion?: string
          destacado?: boolean
          duracion_semanas?: number | null
          etiqueta_precio?: string | null
          horas_totales?: number | null
          id?: string
          instrumento_id?: string | null
          modalidad?: Database["public"]["Enums"]["modalidad_curso"]
          mostrar_precio?: boolean
          nivel?: Database["public"]["Enums"]["nivel_curso"]
          nombre?: string
          orden?: number
          portada_public_id?: string | null
          precio_referencial?: number | null
          publicado?: boolean
          puntuacion_promedio?: number
          resumen?: string | null
          slug?: string
          total_resenas?: number
          updated_at?: string
          video_intro_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cursos_instrumento_id_fkey"
            columns: ["instrumento_id"]
            isOneToOne: false
            referencedRelation: "instrumentos"
            referencedColumns: ["id"]
          },
        ]
      }
      docente_formacion: {
        Row: {
          anio_fin: number | null
          anio_inicio: number | null
          descripcion: string | null
          docente_id: string
          id: string
          institucion: string
          orden: number
          titulo: string
        }
        Insert: {
          anio_fin?: number | null
          anio_inicio?: number | null
          descripcion?: string | null
          docente_id: string
          id?: string
          institucion: string
          orden?: number
          titulo: string
        }
        Update: {
          anio_fin?: number | null
          anio_inicio?: number | null
          descripcion?: string | null
          docente_id?: string
          id?: string
          institucion?: string
          orden?: number
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "docente_formacion_docente_id_fkey"
            columns: ["docente_id"]
            isOneToOne: false
            referencedRelation: "docentes"
            referencedColumns: ["perfil_id"]
          },
        ]
      }
      docente_instrumento: {
        Row: {
          docente_id: string
          es_principal: boolean
          instrumento_id: string
        }
        Insert: {
          docente_id: string
          es_principal?: boolean
          instrumento_id: string
        }
        Update: {
          docente_id?: string
          es_principal?: boolean
          instrumento_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "docente_instrumento_docente_id_fkey"
            columns: ["docente_id"]
            isOneToOne: false
            referencedRelation: "docentes"
            referencedColumns: ["perfil_id"]
          },
          {
            foreignKeyName: "docente_instrumento_instrumento_id_fkey"
            columns: ["instrumento_id"]
            isOneToOne: false
            referencedRelation: "instrumentos"
            referencedColumns: ["id"]
          },
        ]
      }
      docente_portafolio: {
        Row: {
          docente_id: string
          id: string
          orden: number
          public_id: string | null
          publicado: boolean
          tipo: Database["public"]["Enums"]["tipo_portafolio"]
          titulo: string | null
          url_externa: string | null
        }
        Insert: {
          docente_id: string
          id?: string
          orden?: number
          public_id?: string | null
          publicado?: boolean
          tipo: Database["public"]["Enums"]["tipo_portafolio"]
          titulo?: string | null
          url_externa?: string | null
        }
        Update: {
          docente_id?: string
          id?: string
          orden?: number
          public_id?: string | null
          publicado?: boolean
          tipo?: Database["public"]["Enums"]["tipo_portafolio"]
          titulo?: string | null
          url_externa?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "docente_portafolio_docente_id_fkey"
            columns: ["docente_id"]
            isOneToOne: false
            referencedRelation: "docentes"
            referencedColumns: ["perfil_id"]
          },
        ]
      }
      docente_reconocimientos: {
        Row: {
          anio: number | null
          descripcion: string | null
          docente_id: string
          entidad_otorgante: string | null
          id: string
          orden: number
          titulo: string
        }
        Insert: {
          anio?: number | null
          descripcion?: string | null
          docente_id: string
          entidad_otorgante?: string | null
          id?: string
          orden?: number
          titulo: string
        }
        Update: {
          anio?: number | null
          descripcion?: string | null
          docente_id?: string
          entidad_otorgante?: string | null
          id?: string
          orden?: number
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "docente_reconocimientos_docente_id_fkey"
            columns: ["docente_id"]
            isOneToOne: false
            referencedRelation: "docentes"
            referencedColumns: ["perfil_id"]
          },
        ]
      }
      docentes: {
        Row: {
          anios_experiencia: number | null
          biografia: string | null
          created_at: string
          destacado: boolean
          frase_destacada: string | null
          orden: number
          perfil_id: string
          publicado: boolean
          redes_sociales: Json
          slug: string
          titulo_profesional: string | null
          updated_at: string
        }
        Insert: {
          anios_experiencia?: number | null
          biografia?: string | null
          created_at?: string
          destacado?: boolean
          frase_destacada?: string | null
          orden?: number
          perfil_id: string
          publicado?: boolean
          redes_sociales?: Json
          slug: string
          titulo_profesional?: string | null
          updated_at?: string
        }
        Update: {
          anios_experiencia?: number | null
          biografia?: string | null
          created_at?: string
          destacado?: boolean
          frase_destacada?: string | null
          orden?: number
          perfil_id?: string
          publicado?: boolean
          redes_sociales?: Json
          slug?: string
          titulo_profesional?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "docentes_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: true
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "docentes_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: true
            referencedRelation: "v_representantes_vinculables"
            referencedColumns: ["perfil_sugerido"]
          },
        ]
      }
      estudiante_instrumento: {
        Row: {
          estudiante_id: string
          instrumento_id: string
          nivel: Database["public"]["Enums"]["nivel_curso"] | null
        }
        Insert: {
          estudiante_id: string
          instrumento_id: string
          nivel?: Database["public"]["Enums"]["nivel_curso"] | null
        }
        Update: {
          estudiante_id?: string
          instrumento_id?: string
          nivel?: Database["public"]["Enums"]["nivel_curso"] | null
        }
        Relationships: [
          {
            foreignKeyName: "estudiante_instrumento_estudiante_id_fkey"
            columns: ["estudiante_id"]
            isOneToOne: false
            referencedRelation: "estudiantes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estudiante_instrumento_estudiante_id_fkey"
            columns: ["estudiante_id"]
            isOneToOne: false
            referencedRelation: "v_estado_cuenta"
            referencedColumns: ["estudiante_id"]
          },
          {
            foreignKeyName: "estudiante_instrumento_estudiante_id_fkey"
            columns: ["estudiante_id"]
            isOneToOne: false
            referencedRelation: "v_estudiantes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estudiante_instrumento_estudiante_id_fkey"
            columns: ["estudiante_id"]
            isOneToOne: false
            referencedRelation: "v_solicitudes_matricula"
            referencedColumns: ["estudiante_id"]
          },
          {
            foreignKeyName: "estudiante_instrumento_instrumento_id_fkey"
            columns: ["instrumento_id"]
            isOneToOne: false
            referencedRelation: "instrumentos"
            referencedColumns: ["id"]
          },
        ]
      }
      estudiante_representante: {
        Row: {
          autoriza_retiro: boolean
          es_contacto_principal: boolean
          estudiante_id: string
          parentesco: Database["public"]["Enums"]["parentesco"]
          representante_id: string
        }
        Insert: {
          autoriza_retiro?: boolean
          es_contacto_principal?: boolean
          estudiante_id: string
          parentesco: Database["public"]["Enums"]["parentesco"]
          representante_id: string
        }
        Update: {
          autoriza_retiro?: boolean
          es_contacto_principal?: boolean
          estudiante_id?: string
          parentesco?: Database["public"]["Enums"]["parentesco"]
          representante_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "estudiante_representante_estudiante_id_fkey"
            columns: ["estudiante_id"]
            isOneToOne: false
            referencedRelation: "estudiantes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estudiante_representante_estudiante_id_fkey"
            columns: ["estudiante_id"]
            isOneToOne: false
            referencedRelation: "v_estado_cuenta"
            referencedColumns: ["estudiante_id"]
          },
          {
            foreignKeyName: "estudiante_representante_estudiante_id_fkey"
            columns: ["estudiante_id"]
            isOneToOne: false
            referencedRelation: "v_estudiantes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estudiante_representante_estudiante_id_fkey"
            columns: ["estudiante_id"]
            isOneToOne: false
            referencedRelation: "v_solicitudes_matricula"
            referencedColumns: ["estudiante_id"]
          },
          {
            foreignKeyName: "estudiante_representante_representante_id_fkey"
            columns: ["representante_id"]
            isOneToOne: false
            referencedRelation: "representantes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estudiante_representante_representante_id_fkey"
            columns: ["representante_id"]
            isOneToOne: false
            referencedRelation: "v_cobranza_familia"
            referencedColumns: ["representante_id"]
          },
          {
            foreignKeyName: "estudiante_representante_representante_id_fkey"
            columns: ["representante_id"]
            isOneToOne: false
            referencedRelation: "v_estudiantes"
            referencedColumns: ["representante_id"]
          },
          {
            foreignKeyName: "estudiante_representante_representante_id_fkey"
            columns: ["representante_id"]
            isOneToOne: false
            referencedRelation: "v_representantes_vinculables"
            referencedColumns: ["representante_id"]
          },
        ]
      }
      estudiantes: {
        Row: {
          activo: boolean
          apellidos: string
          avatar_public_id: string | null
          biografia_corta: string | null
          cedula: string | null
          celular: string | null
          created_at: string
          email: string | null
          fecha_ingreso: string
          fecha_nacimiento: string
          id: string
          nivel_musical: Database["public"]["Enums"]["nivel_curso"] | null
          nombres: string
          perfil_id: string | null
          updated_at: string
        }
        Insert: {
          activo?: boolean
          apellidos: string
          avatar_public_id?: string | null
          biografia_corta?: string | null
          cedula?: string | null
          celular?: string | null
          created_at?: string
          email?: string | null
          fecha_ingreso?: string
          fecha_nacimiento: string
          id?: string
          nivel_musical?: Database["public"]["Enums"]["nivel_curso"] | null
          nombres: string
          perfil_id?: string | null
          updated_at?: string
        }
        Update: {
          activo?: boolean
          apellidos?: string
          avatar_public_id?: string | null
          biografia_corta?: string | null
          cedula?: string | null
          celular?: string | null
          created_at?: string
          email?: string | null
          fecha_ingreso?: string
          fecha_nacimiento?: string
          id?: string
          nivel_musical?: Database["public"]["Enums"]["nivel_curso"] | null
          nombres?: string
          perfil_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "estudiantes_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: true
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estudiantes_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: true
            referencedRelation: "v_representantes_vinculables"
            referencedColumns: ["perfil_sugerido"]
          },
        ]
      }
      evaluaciones: {
        Row: {
          catedra_id: string
          creada_por: string | null
          created_at: string
          descripcion: string | null
          fecha: string | null
          id: string
          nota_maxima: number
          ponderacion: number
          sesion_id: string | null
          tipo: Database["public"]["Enums"]["tipo_evaluacion"]
          titulo: string
        }
        Insert: {
          catedra_id: string
          creada_por?: string | null
          created_at?: string
          descripcion?: string | null
          fecha?: string | null
          id?: string
          nota_maxima?: number
          ponderacion?: number
          sesion_id?: string | null
          tipo?: Database["public"]["Enums"]["tipo_evaluacion"]
          titulo: string
        }
        Update: {
          catedra_id?: string
          creada_por?: string | null
          created_at?: string
          descripcion?: string | null
          fecha?: string | null
          id?: string
          nota_maxima?: number
          ponderacion?: number
          sesion_id?: string | null
          tipo?: Database["public"]["Enums"]["tipo_evaluacion"]
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "evaluaciones_catedra_id_fkey"
            columns: ["catedra_id"]
            isOneToOne: false
            referencedRelation: "catedras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evaluaciones_creada_por_fkey"
            columns: ["creada_por"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evaluaciones_creada_por_fkey"
            columns: ["creada_por"]
            isOneToOne: false
            referencedRelation: "v_representantes_vinculables"
            referencedColumns: ["perfil_sugerido"]
          },
          {
            foreignKeyName: "evaluaciones_sesion_id_fkey"
            columns: ["sesion_id"]
            isOneToOne: false
            referencedRelation: "sesiones"
            referencedColumns: ["id"]
          },
        ]
      }
      favoritos: {
        Row: {
          created_at: string
          curso_id: string
          perfil_id: string
        }
        Insert: {
          created_at?: string
          curso_id: string
          perfil_id: string
        }
        Update: {
          created_at?: string
          curso_id?: string
          perfil_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favoritos_curso_id_fkey"
            columns: ["curso_id"]
            isOneToOne: false
            referencedRelation: "cursos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favoritos_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favoritos_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "v_representantes_vinculables"
            referencedColumns: ["perfil_sugerido"]
          },
        ]
      }
      galeria_medios: {
        Row: {
          actualizado_por: string | null
          categoria: Database["public"]["Enums"]["categoria_medio"]
          curso_id: string | null
          id: string
          orden: number
          public_id: string
          publicado: boolean
          texto_alt: string
          titulo: string | null
          updated_at: string
        }
        Insert: {
          actualizado_por?: string | null
          categoria?: Database["public"]["Enums"]["categoria_medio"]
          curso_id?: string | null
          id?: string
          orden?: number
          public_id: string
          publicado?: boolean
          texto_alt: string
          titulo?: string | null
          updated_at?: string
        }
        Update: {
          actualizado_por?: string | null
          categoria?: Database["public"]["Enums"]["categoria_medio"]
          curso_id?: string | null
          id?: string
          orden?: number
          public_id?: string
          publicado?: boolean
          texto_alt?: string
          titulo?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "galeria_medios_actualizado_por_fkey"
            columns: ["actualizado_por"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "galeria_medios_actualizado_por_fkey"
            columns: ["actualizado_por"]
            isOneToOne: false
            referencedRelation: "v_representantes_vinculables"
            referencedColumns: ["perfil_sugerido"]
          },
          {
            foreignKeyName: "galeria_medios_curso_id_fkey"
            columns: ["curso_id"]
            isOneToOne: false
            referencedRelation: "cursos"
            referencedColumns: ["id"]
          },
        ]
      }
      inscripciones: {
        Row: {
          aprobada_en: string | null
          aprobada_por: string | null
          catedra_id: string
          estado: Database["public"]["Enums"]["estado_inscripcion"]
          estudiante_id: string
          fecha_fin: string | null
          fecha_inicio: string
          fecha_inscripcion: string
          id: string
          motivo_rechazo: string | null
          progreso_pct: number
          solicitada_por: string | null
        }
        Insert: {
          aprobada_en?: string | null
          aprobada_por?: string | null
          catedra_id: string
          estado?: Database["public"]["Enums"]["estado_inscripcion"]
          estudiante_id: string
          fecha_fin?: string | null
          fecha_inicio?: string
          fecha_inscripcion?: string
          id?: string
          motivo_rechazo?: string | null
          progreso_pct?: number
          solicitada_por?: string | null
        }
        Update: {
          aprobada_en?: string | null
          aprobada_por?: string | null
          catedra_id?: string
          estado?: Database["public"]["Enums"]["estado_inscripcion"]
          estudiante_id?: string
          fecha_fin?: string | null
          fecha_inicio?: string
          fecha_inscripcion?: string
          id?: string
          motivo_rechazo?: string | null
          progreso_pct?: number
          solicitada_por?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inscripciones_aprobada_por_fkey"
            columns: ["aprobada_por"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inscripciones_aprobada_por_fkey"
            columns: ["aprobada_por"]
            isOneToOne: false
            referencedRelation: "v_representantes_vinculables"
            referencedColumns: ["perfil_sugerido"]
          },
          {
            foreignKeyName: "inscripciones_catedra_id_fkey"
            columns: ["catedra_id"]
            isOneToOne: false
            referencedRelation: "catedras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inscripciones_estudiante_id_fkey"
            columns: ["estudiante_id"]
            isOneToOne: false
            referencedRelation: "estudiantes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inscripciones_estudiante_id_fkey"
            columns: ["estudiante_id"]
            isOneToOne: false
            referencedRelation: "v_estado_cuenta"
            referencedColumns: ["estudiante_id"]
          },
          {
            foreignKeyName: "inscripciones_estudiante_id_fkey"
            columns: ["estudiante_id"]
            isOneToOne: false
            referencedRelation: "v_estudiantes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inscripciones_estudiante_id_fkey"
            columns: ["estudiante_id"]
            isOneToOne: false
            referencedRelation: "v_solicitudes_matricula"
            referencedColumns: ["estudiante_id"]
          },
          {
            foreignKeyName: "inscripciones_solicitada_por_fkey"
            columns: ["solicitada_por"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inscripciones_solicitada_por_fkey"
            columns: ["solicitada_por"]
            isOneToOne: false
            referencedRelation: "v_representantes_vinculables"
            referencedColumns: ["perfil_sugerido"]
          },
        ]
      }
      instrumentos: {
        Row: {
          activo: boolean
          icono: string | null
          id: string
          imagen_public_id: string | null
          nombre: string
          orden: number
          slug: string
          tipo_instrumento_id: string
        }
        Insert: {
          activo?: boolean
          icono?: string | null
          id?: string
          imagen_public_id?: string | null
          nombre: string
          orden?: number
          slug: string
          tipo_instrumento_id: string
        }
        Update: {
          activo?: boolean
          icono?: string | null
          id?: string
          imagen_public_id?: string | null
          nombre?: string
          orden?: number
          slug?: string
          tipo_instrumento_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "instrumentos_tipo_instrumento_id_fkey"
            columns: ["tipo_instrumento_id"]
            isOneToOne: false
            referencedRelation: "tipos_instrumento"
            referencedColumns: ["id"]
          },
        ]
      }
      materiales: {
        Row: {
          catedra_id: string | null
          created_at: string
          curso_id: string | null
          id: string
          storage_path: string | null
          subido_por: string | null
          tipo: Database["public"]["Enums"]["tipo_material"]
          titulo: string
          url_externa: string | null
          visible_para: Database["public"]["Enums"]["visibilidad_material"]
        }
        Insert: {
          catedra_id?: string | null
          created_at?: string
          curso_id?: string | null
          id?: string
          storage_path?: string | null
          subido_por?: string | null
          tipo: Database["public"]["Enums"]["tipo_material"]
          titulo: string
          url_externa?: string | null
          visible_para?: Database["public"]["Enums"]["visibilidad_material"]
        }
        Update: {
          catedra_id?: string | null
          created_at?: string
          curso_id?: string | null
          id?: string
          storage_path?: string | null
          subido_por?: string | null
          tipo?: Database["public"]["Enums"]["tipo_material"]
          titulo?: string
          url_externa?: string | null
          visible_para?: Database["public"]["Enums"]["visibilidad_material"]
        }
        Relationships: [
          {
            foreignKeyName: "materiales_catedra_id_fkey"
            columns: ["catedra_id"]
            isOneToOne: false
            referencedRelation: "catedras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "materiales_curso_id_fkey"
            columns: ["curso_id"]
            isOneToOne: false
            referencedRelation: "cursos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "materiales_subido_por_fkey"
            columns: ["subido_por"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "materiales_subido_por_fkey"
            columns: ["subido_por"]
            isOneToOne: false
            referencedRelation: "v_representantes_vinculables"
            referencedColumns: ["perfil_sugerido"]
          },
        ]
      }
      metricas_academia: {
        Row: {
          actualizado_por: string | null
          etiqueta: string
          icono: string | null
          id: string
          orden: number
          publicado: boolean
          sufijo: string | null
          updated_at: string
          valor: string
        }
        Insert: {
          actualizado_por?: string | null
          etiqueta: string
          icono?: string | null
          id?: string
          orden?: number
          publicado?: boolean
          sufijo?: string | null
          updated_at?: string
          valor: string
        }
        Update: {
          actualizado_por?: string | null
          etiqueta?: string
          icono?: string | null
          id?: string
          orden?: number
          publicado?: boolean
          sufijo?: string | null
          updated_at?: string
          valor?: string
        }
        Relationships: [
          {
            foreignKeyName: "metricas_academia_actualizado_por_fkey"
            columns: ["actualizado_por"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "metricas_academia_actualizado_por_fkey"
            columns: ["actualizado_por"]
            isOneToOne: false
            referencedRelation: "v_representantes_vinculables"
            referencedColumns: ["perfil_sugerido"]
          },
        ]
      }
      pagos: {
        Row: {
          comprobante_storage_path: string | null
          created_at: string
          cuota_id: string
          fecha_pago: string
          id: string
          metodo: string | null
          monto: number
          observacion: string | null
          referencia: string | null
          registrado_por: string | null
        }
        Insert: {
          comprobante_storage_path?: string | null
          created_at?: string
          cuota_id: string
          fecha_pago?: string
          id?: string
          metodo?: string | null
          monto: number
          observacion?: string | null
          referencia?: string | null
          registrado_por?: string | null
        }
        Update: {
          comprobante_storage_path?: string | null
          created_at?: string
          cuota_id?: string
          fecha_pago?: string
          id?: string
          metodo?: string | null
          monto?: number
          observacion?: string | null
          referencia?: string | null
          registrado_por?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pagos_cuota_id_fkey"
            columns: ["cuota_id"]
            isOneToOne: false
            referencedRelation: "cuotas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pagos_cuota_id_fkey"
            columns: ["cuota_id"]
            isOneToOne: false
            referencedRelation: "v_estado_cuenta"
            referencedColumns: ["cuota_id"]
          },
          {
            foreignKeyName: "pagos_registrado_por_fkey"
            columns: ["registrado_por"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pagos_registrado_por_fkey"
            columns: ["registrado_por"]
            isOneToOne: false
            referencedRelation: "v_representantes_vinculables"
            referencedColumns: ["perfil_sugerido"]
          },
        ]
      }
      perfil_rol: {
        Row: {
          asignado_en: string
          asignado_por: string | null
          perfil_id: string
          rol: Database["public"]["Enums"]["rol_usuario"]
        }
        Insert: {
          asignado_en?: string
          asignado_por?: string | null
          perfil_id: string
          rol: Database["public"]["Enums"]["rol_usuario"]
        }
        Update: {
          asignado_en?: string
          asignado_por?: string | null
          perfil_id?: string
          rol?: Database["public"]["Enums"]["rol_usuario"]
        }
        Relationships: [
          {
            foreignKeyName: "perfil_rol_asignado_por_fkey"
            columns: ["asignado_por"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "perfil_rol_asignado_por_fkey"
            columns: ["asignado_por"]
            isOneToOne: false
            referencedRelation: "v_representantes_vinculables"
            referencedColumns: ["perfil_sugerido"]
          },
          {
            foreignKeyName: "perfil_rol_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "perfil_rol_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "v_representantes_vinculables"
            referencedColumns: ["perfil_sugerido"]
          },
        ]
      }
      perfiles: {
        Row: {
          activo: boolean
          apellidos: string
          avatar_public_id: string | null
          cedula: string | null
          celular: string | null
          created_at: string
          email: string | null
          id: string
          nombres: string
          rol_preferido: Database["public"]["Enums"]["rol_usuario"] | null
          updated_at: string
        }
        Insert: {
          activo?: boolean
          apellidos: string
          avatar_public_id?: string | null
          cedula?: string | null
          celular?: string | null
          created_at?: string
          email?: string | null
          id: string
          nombres: string
          rol_preferido?: Database["public"]["Enums"]["rol_usuario"] | null
          updated_at?: string
        }
        Update: {
          activo?: boolean
          apellidos?: string
          avatar_public_id?: string | null
          cedula?: string | null
          celular?: string | null
          created_at?: string
          email?: string | null
          id?: string
          nombres?: string
          rol_preferido?: Database["public"]["Enums"]["rol_usuario"] | null
          updated_at?: string
        }
        Relationships: []
      }
      programa_curso: {
        Row: {
          curso_id: string
          orden: number
          programa_id: string
        }
        Insert: {
          curso_id: string
          orden?: number
          programa_id: string
        }
        Update: {
          curso_id?: string
          orden?: number
          programa_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "programa_curso_curso_id_fkey"
            columns: ["curso_id"]
            isOneToOne: false
            referencedRelation: "cursos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "programa_curso_programa_id_fkey"
            columns: ["programa_id"]
            isOneToOne: false
            referencedRelation: "programas"
            referencedColumns: ["id"]
          },
        ]
      }
      programas: {
        Row: {
          created_at: string
          descripcion: string | null
          id: string
          imagen_public_id: string | null
          instrumento_id: string | null
          nivel: Database["public"]["Enums"]["nivel_curso"] | null
          nombre: string
          objetivos: string | null
          orden: number
          publicado: boolean
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          descripcion?: string | null
          id?: string
          imagen_public_id?: string | null
          instrumento_id?: string | null
          nivel?: Database["public"]["Enums"]["nivel_curso"] | null
          nombre: string
          objetivos?: string | null
          orden?: number
          publicado?: boolean
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          descripcion?: string | null
          id?: string
          imagen_public_id?: string | null
          instrumento_id?: string | null
          nivel?: Database["public"]["Enums"]["nivel_curso"] | null
          nombre?: string
          objetivos?: string | null
          orden?: number
          publicado?: boolean
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "programas_instrumento_id_fkey"
            columns: ["instrumento_id"]
            isOneToOne: false
            referencedRelation: "instrumentos"
            referencedColumns: ["id"]
          },
        ]
      }
      progreso_lecciones: {
        Row: {
          completada: boolean
          completada_en: string | null
          inscripcion_id: string
          leccion_id: string
        }
        Insert: {
          completada?: boolean
          completada_en?: string | null
          inscripcion_id: string
          leccion_id: string
        }
        Update: {
          completada?: boolean
          completada_en?: string | null
          inscripcion_id?: string
          leccion_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "progreso_lecciones_inscripcion_id_fkey"
            columns: ["inscripcion_id"]
            isOneToOne: false
            referencedRelation: "inscripciones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "progreso_lecciones_inscripcion_id_fkey"
            columns: ["inscripcion_id"]
            isOneToOne: false
            referencedRelation: "v_promedio_academico"
            referencedColumns: ["inscripcion_id"]
          },
          {
            foreignKeyName: "progreso_lecciones_inscripcion_id_fkey"
            columns: ["inscripcion_id"]
            isOneToOne: false
            referencedRelation: "v_solicitudes_matricula"
            referencedColumns: ["inscripcion_id"]
          },
          {
            foreignKeyName: "progreso_lecciones_leccion_id_fkey"
            columns: ["leccion_id"]
            isOneToOne: false
            referencedRelation: "curso_lecciones"
            referencedColumns: ["id"]
          },
        ]
      }
      registros_practica: {
        Row: {
          estudiante_id: string
          fecha: string
          id: string
          inscripcion_id: string | null
          minutos: number
          nota: string | null
        }
        Insert: {
          estudiante_id: string
          fecha?: string
          id?: string
          inscripcion_id?: string | null
          minutos: number
          nota?: string | null
        }
        Update: {
          estudiante_id?: string
          fecha?: string
          id?: string
          inscripcion_id?: string | null
          minutos?: number
          nota?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "registros_practica_estudiante_id_fkey"
            columns: ["estudiante_id"]
            isOneToOne: false
            referencedRelation: "estudiantes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registros_practica_estudiante_id_fkey"
            columns: ["estudiante_id"]
            isOneToOne: false
            referencedRelation: "v_estado_cuenta"
            referencedColumns: ["estudiante_id"]
          },
          {
            foreignKeyName: "registros_practica_estudiante_id_fkey"
            columns: ["estudiante_id"]
            isOneToOne: false
            referencedRelation: "v_estudiantes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registros_practica_estudiante_id_fkey"
            columns: ["estudiante_id"]
            isOneToOne: false
            referencedRelation: "v_solicitudes_matricula"
            referencedColumns: ["estudiante_id"]
          },
          {
            foreignKeyName: "registros_practica_inscripcion_id_fkey"
            columns: ["inscripcion_id"]
            isOneToOne: false
            referencedRelation: "inscripciones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registros_practica_inscripcion_id_fkey"
            columns: ["inscripcion_id"]
            isOneToOne: false
            referencedRelation: "v_promedio_academico"
            referencedColumns: ["inscripcion_id"]
          },
          {
            foreignKeyName: "registros_practica_inscripcion_id_fkey"
            columns: ["inscripcion_id"]
            isOneToOne: false
            referencedRelation: "v_solicitudes_matricula"
            referencedColumns: ["inscripcion_id"]
          },
        ]
      }
      representantes: {
        Row: {
          apellidos: string | null
          cedula: string | null
          celular: string | null
          created_at: string
          direccion: string | null
          email: string | null
          id: string
          nombres: string | null
          ocupacion: string | null
          perfil_id: string | null
          updated_at: string
        }
        Insert: {
          apellidos?: string | null
          cedula?: string | null
          celular?: string | null
          created_at?: string
          direccion?: string | null
          email?: string | null
          id?: string
          nombres?: string | null
          ocupacion?: string | null
          perfil_id?: string | null
          updated_at?: string
        }
        Update: {
          apellidos?: string | null
          cedula?: string | null
          celular?: string | null
          created_at?: string
          direccion?: string | null
          email?: string | null
          id?: string
          nombres?: string | null
          ocupacion?: string | null
          perfil_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "representantes_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: true
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "representantes_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: true
            referencedRelation: "v_representantes_vinculables"
            referencedColumns: ["perfil_sugerido"]
          },
        ]
      }
      secciones_institucionales: {
        Row: {
          actualizado_por: string | null
          clave: string
          contenido: string
          id: string
          imagen_public_id: string | null
          orden: number
          publicado: boolean
          titulo: string
          updated_at: string
        }
        Insert: {
          actualizado_por?: string | null
          clave: string
          contenido: string
          id?: string
          imagen_public_id?: string | null
          orden?: number
          publicado?: boolean
          titulo: string
          updated_at?: string
        }
        Update: {
          actualizado_por?: string | null
          clave?: string
          contenido?: string
          id?: string
          imagen_public_id?: string | null
          orden?: number
          publicado?: boolean
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "secciones_institucionales_actualizado_por_fkey"
            columns: ["actualizado_por"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "secciones_institucionales_actualizado_por_fkey"
            columns: ["actualizado_por"]
            isOneToOne: false
            referencedRelation: "v_representantes_vinculables"
            referencedColumns: ["perfil_sugerido"]
          },
        ]
      }
      sesiones: {
        Row: {
          catedra_id: string
          estado: Database["public"]["Enums"]["estado_sesion"]
          fecha: string
          hora_fin: string
          hora_inicio: string
          id: string
          tema: string | null
        }
        Insert: {
          catedra_id: string
          estado?: Database["public"]["Enums"]["estado_sesion"]
          fecha: string
          hora_fin: string
          hora_inicio: string
          id?: string
          tema?: string | null
        }
        Update: {
          catedra_id?: string
          estado?: Database["public"]["Enums"]["estado_sesion"]
          fecha?: string
          hora_fin?: string
          hora_inicio?: string
          id?: string
          tema?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sesiones_catedra_id_fkey"
            columns: ["catedra_id"]
            isOneToOne: false
            referencedRelation: "catedras"
            referencedColumns: ["id"]
          },
        ]
      }
      solicitudes: {
        Row: {
          atendida_por: string | null
          consentimiento_datos: boolean
          consentimiento_en: string
          consentimiento_otorgado_por: string
          created_at: string
          curso_id: string | null
          docente_id: string | null
          email: string
          estado: Database["public"]["Enums"]["estado_solicitud"]
          estudiante_fecha_nacimiento: string | null
          estudiante_nombre: string | null
          id: string
          instrumento_id: string | null
          mensaje: string | null
          nombre_completo: string | null
          notas_internas: string | null
          origen_url: string | null
          para_menor: boolean
          parentesco: Database["public"]["Enums"]["parentesco"] | null
          telefono: string | null
          tipo: Database["public"]["Enums"]["tipo_solicitud"]
        }
        Insert: {
          atendida_por?: string | null
          consentimiento_datos: boolean
          consentimiento_en?: string
          consentimiento_otorgado_por?: string
          created_at?: string
          curso_id?: string | null
          docente_id?: string | null
          email: string
          estado?: Database["public"]["Enums"]["estado_solicitud"]
          estudiante_fecha_nacimiento?: string | null
          estudiante_nombre?: string | null
          id?: string
          instrumento_id?: string | null
          mensaje?: string | null
          nombre_completo?: string | null
          notas_internas?: string | null
          origen_url?: string | null
          para_menor?: boolean
          parentesco?: Database["public"]["Enums"]["parentesco"] | null
          telefono?: string | null
          tipo: Database["public"]["Enums"]["tipo_solicitud"]
        }
        Update: {
          atendida_por?: string | null
          consentimiento_datos?: boolean
          consentimiento_en?: string
          consentimiento_otorgado_por?: string
          created_at?: string
          curso_id?: string | null
          docente_id?: string | null
          email?: string
          estado?: Database["public"]["Enums"]["estado_solicitud"]
          estudiante_fecha_nacimiento?: string | null
          estudiante_nombre?: string | null
          id?: string
          instrumento_id?: string | null
          mensaje?: string | null
          nombre_completo?: string | null
          notas_internas?: string | null
          origen_url?: string | null
          para_menor?: boolean
          parentesco?: Database["public"]["Enums"]["parentesco"] | null
          telefono?: string | null
          tipo?: Database["public"]["Enums"]["tipo_solicitud"]
        }
        Relationships: [
          {
            foreignKeyName: "solicitudes_atendida_por_fkey"
            columns: ["atendida_por"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitudes_atendida_por_fkey"
            columns: ["atendida_por"]
            isOneToOne: false
            referencedRelation: "v_representantes_vinculables"
            referencedColumns: ["perfil_sugerido"]
          },
          {
            foreignKeyName: "solicitudes_curso_id_fkey"
            columns: ["curso_id"]
            isOneToOne: false
            referencedRelation: "cursos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitudes_docente_id_fkey"
            columns: ["docente_id"]
            isOneToOne: false
            referencedRelation: "docentes"
            referencedColumns: ["perfil_id"]
          },
          {
            foreignKeyName: "solicitudes_instrumento_id_fkey"
            columns: ["instrumento_id"]
            isOneToOne: false
            referencedRelation: "instrumentos"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonios: {
        Row: {
          actualizado_por: string | null
          autor_nombre: string
          autor_rol: string | null
          cita: string
          created_at: string
          estudiante_id: string | null
          foto_public_id: string | null
          id: string
          orden: number
          publicado: boolean
          puntuacion: number | null
          updated_at: string
        }
        Insert: {
          actualizado_por?: string | null
          autor_nombre: string
          autor_rol?: string | null
          cita: string
          created_at?: string
          estudiante_id?: string | null
          foto_public_id?: string | null
          id?: string
          orden?: number
          publicado?: boolean
          puntuacion?: number | null
          updated_at?: string
        }
        Update: {
          actualizado_por?: string | null
          autor_nombre?: string
          autor_rol?: string | null
          cita?: string
          created_at?: string
          estudiante_id?: string | null
          foto_public_id?: string | null
          id?: string
          orden?: number
          publicado?: boolean
          puntuacion?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "testimonios_actualizado_por_fkey"
            columns: ["actualizado_por"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "testimonios_actualizado_por_fkey"
            columns: ["actualizado_por"]
            isOneToOne: false
            referencedRelation: "v_representantes_vinculables"
            referencedColumns: ["perfil_sugerido"]
          },
          {
            foreignKeyName: "testimonios_estudiante_id_fkey"
            columns: ["estudiante_id"]
            isOneToOne: false
            referencedRelation: "estudiantes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "testimonios_estudiante_id_fkey"
            columns: ["estudiante_id"]
            isOneToOne: false
            referencedRelation: "v_estado_cuenta"
            referencedColumns: ["estudiante_id"]
          },
          {
            foreignKeyName: "testimonios_estudiante_id_fkey"
            columns: ["estudiante_id"]
            isOneToOne: false
            referencedRelation: "v_estudiantes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "testimonios_estudiante_id_fkey"
            columns: ["estudiante_id"]
            isOneToOne: false
            referencedRelation: "v_solicitudes_matricula"
            referencedColumns: ["estudiante_id"]
          },
        ]
      }
      tipos_instrumento: {
        Row: {
          activo: boolean
          id: string
          nombre: string
          orden: number
        }
        Insert: {
          activo?: boolean
          id?: string
          nombre: string
          orden?: number
        }
        Update: {
          activo?: boolean
          id?: string
          nombre?: string
          orden?: number
        }
        Relationships: []
      }
    }
    Views: {
      v_cobranza_familia: {
        Row: {
          celular: string | null
          detalle: string | null
          dias_mora_max: number | null
          hijos_con_cuota: number | null
          periodo_mes: string | null
          representante: string | null
          representante_id: string | null
          saldo_total: number | null
          total_mes: number | null
        }
        Relationships: []
      }
      v_estado_cuenta: {
        Row: {
          acuerdo_id: string | null
          cuota_id: string | null
          dias_mora: number | null
          estado_efectivo: string | null
          estudiante: string | null
          estudiante_id: string | null
          fecha_vencimiento: string | null
          monto: number | null
          monto_pagado: number | null
          periodo_mes: string | null
          saldo: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cuotas_acuerdo_id_fkey"
            columns: ["acuerdo_id"]
            isOneToOne: false
            referencedRelation: "acuerdos_pago"
            referencedColumns: ["id"]
          },
        ]
      }
      v_estudiantes: {
        Row: {
          activo: boolean | null
          apellidos: string | null
          avatar_public_id: string | null
          biografia_corta: string | null
          cedula: string | null
          celular: string | null
          created_at: string | null
          edad: number | null
          email: string | null
          es_menor: boolean | null
          fecha_ingreso: string | null
          fecha_nacimiento: string | null
          id: string | null
          nivel_musical: Database["public"]["Enums"]["nivel_curso"] | null
          nombres: string | null
          parentesco: Database["public"]["Enums"]["parentesco"] | null
          perfil_id: string | null
          representante_celular: string | null
          representante_email: string | null
          representante_id: string | null
          representante_principal: string | null
          tiene_cuenta: boolean | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "estudiantes_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: true
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estudiantes_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: true
            referencedRelation: "v_representantes_vinculables"
            referencedColumns: ["perfil_sugerido"]
          },
        ]
      }
      v_promedio_academico: {
        Row: {
          catedra_id: string | null
          estudiante_id: string | null
          evaluaciones_rendidas: number | null
          inscripcion_id: string | null
          promedio_sobre_10: number | null
        }
        Relationships: [
          {
            foreignKeyName: "inscripciones_catedra_id_fkey"
            columns: ["catedra_id"]
            isOneToOne: false
            referencedRelation: "catedras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inscripciones_estudiante_id_fkey"
            columns: ["estudiante_id"]
            isOneToOne: false
            referencedRelation: "estudiantes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inscripciones_estudiante_id_fkey"
            columns: ["estudiante_id"]
            isOneToOne: false
            referencedRelation: "v_estado_cuenta"
            referencedColumns: ["estudiante_id"]
          },
          {
            foreignKeyName: "inscripciones_estudiante_id_fkey"
            columns: ["estudiante_id"]
            isOneToOne: false
            referencedRelation: "v_estudiantes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inscripciones_estudiante_id_fkey"
            columns: ["estudiante_id"]
            isOneToOne: false
            referencedRelation: "v_solicitudes_matricula"
            referencedColumns: ["estudiante_id"]
          },
        ]
      }
      v_representantes_vinculables: {
        Row: {
          cedula: string | null
          celular: string | null
          email: string | null
          perfil_nombre: string | null
          perfil_sugerido: string | null
          representante: string | null
          representante_id: string | null
        }
        Relationships: []
      }
      v_solicitudes_matricula: {
        Row: {
          catedra: string | null
          cupo_maximo: number | null
          cupos_ocupados: number | null
          curso: string | null
          es_menor: boolean | null
          estudiante: string | null
          estudiante_id: string | null
          fecha_inscripcion: string | null
          inscripcion_id: string | null
          solicitada_por: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      aprobar_matricula: {
        Args: {
          p_dia_cobro?: number
          p_inscripcion_id: string
          p_monto_mensual: number
          p_motivo_ajuste?: string
        }
        Returns: undefined
      }
      custom_access_token_hook: { Args: { event: Json }; Returns: Json }
      es_admin: { Args: never; Returns: boolean }
      es_docente: { Args: never; Returns: boolean }
      estudiantes_accesibles: { Args: never; Returns: string[] }
      generar_cuotas_mes: { Args: { p_mes: string }; Returns: number }
      matriculado_en: { Args: { p_catedra: string }; Returns: boolean }
      roles_actuales: { Args: never; Returns: string[] }
      solicitar_matricula: {
        Args: {
          p_apellidos: string
          p_catedra_id: string
          p_fecha_nacimiento: string
          p_nombres: string
          p_para_menor: boolean
          p_parentesco?: Database["public"]["Enums"]["parentesco"]
        }
        Returns: string
      }
      tiene_matricula_activa: { Args: never; Returns: boolean }
      tiene_rol: { Args: { p: string }; Returns: boolean }
      vincular_cuenta_representante: {
        Args: { p_perfil_id: string; p_representante_id: string }
        Returns: undefined
      }
    }
    Enums: {
      categoria_medio: "instalaciones" | "conciertos" | "aulas" | "general"
      estado_acuerdo: "vigente" | "suspendido" | "finalizado"
      estado_asistencia: "presente" | "ausente" | "justificado" | "atraso"
      estado_catedra: "planificada" | "en_curso" | "finalizada" | "cancelada"
      estado_cuota: "pendiente" | "parcial" | "pagada" | "condonada"
      estado_inscripcion:
        | "pendiente"
        | "activa"
        | "finalizada"
        | "cancelada"
        | "retirada"
      estado_sesion: "programada" | "realizada" | "cancelada" | "reprogramada"
      estado_solicitud: "nueva" | "contactada" | "convertida" | "descartada"
      modalidad_curso: "presencial" | "virtual" | "hibrido"
      nivel_curso:
        | "iniciacion"
        | "basico"
        | "intermedio"
        | "avanzado"
        | "maestria"
      parentesco:
        | "madre"
        | "padre"
        | "abuelo"
        | "tio"
        | "hermano"
        | "tutor_legal"
        | "otro"
      rol_usuario: "estudiante" | "representante" | "docente" | "admin"
      tipo_evaluacion:
        | "diagnostica"
        | "formativa"
        | "sumativa"
        | "recital"
        | "examen_practico"
        | "examen_teorico"
      tipo_material: "pdf" | "audio" | "video" | "partitura" | "enlace"
      tipo_portafolio: "imagen" | "video" | "audio"
      tipo_solicitud:
        | "clase_prueba"
        | "admision"
        | "masterclass"
        | "contacto_general"
      visibilidad_material: "publico" | "registrados" | "inscritos" | "docentes"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      categoria_medio: ["instalaciones", "conciertos", "aulas", "general"],
      estado_acuerdo: ["vigente", "suspendido", "finalizado"],
      estado_asistencia: ["presente", "ausente", "justificado", "atraso"],
      estado_catedra: ["planificada", "en_curso", "finalizada", "cancelada"],
      estado_cuota: ["pendiente", "parcial", "pagada", "condonada"],
      estado_inscripcion: [
        "pendiente",
        "activa",
        "finalizada",
        "cancelada",
        "retirada",
      ],
      estado_sesion: ["programada", "realizada", "cancelada", "reprogramada"],
      estado_solicitud: ["nueva", "contactada", "convertida", "descartada"],
      modalidad_curso: ["presencial", "virtual", "hibrido"],
      nivel_curso: [
        "iniciacion",
        "basico",
        "intermedio",
        "avanzado",
        "maestria",
      ],
      parentesco: [
        "madre",
        "padre",
        "abuelo",
        "tio",
        "hermano",
        "tutor_legal",
        "otro",
      ],
      rol_usuario: ["estudiante", "representante", "docente", "admin"],
      tipo_evaluacion: [
        "diagnostica",
        "formativa",
        "sumativa",
        "recital",
        "examen_practico",
        "examen_teorico",
      ],
      tipo_material: ["pdf", "audio", "video", "partitura", "enlace"],
      tipo_portafolio: ["imagen", "video", "audio"],
      tipo_solicitud: [
        "clase_prueba",
        "admision",
        "masterclass",
        "contacto_general",
      ],
      visibilidad_material: ["publico", "registrados", "inscritos", "docentes"],
    },
  },
} as const
