import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";

import type { IStudentScheduleViewProps } from "./StudentScheduleView.types";
import StudentSesionRow from "./StudentSesionRow";

export default function StudentScheduleView({ proximas, pasadas }: IStudentScheduleViewProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Próximas clases</CardTitle>
        </CardHeader>
        <CardContent>
          {proximas.length === 0 ? (
            <p className="text-sm text-muted-foreground">No tienes clases próximas programadas.</p>
          ) : (
            <ul className="space-y-2">
              {proximas.map((sesion) => (
                <StudentSesionRow key={sesion.id} sesion={sesion} proxima />
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historial de sesiones</CardTitle>
        </CardHeader>
        <CardContent>
          {pasadas.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aún no hay sesiones pasadas.</p>
          ) : (
            <ul className="space-y-2">
              {pasadas.map((sesion) => (
                <StudentSesionRow key={sesion.id} sesion={sesion} proxima={false} />
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
