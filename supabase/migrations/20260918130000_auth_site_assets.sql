insert into public.activos_sitio (
  clave,
  nombre,
  public_id,
  texto_alt,
  publicado,
  orden
) values
  (
    'auth_login',
    'Autenticación · Inicio de sesión',
    'MicrofonoLight_tudvss',
    'Estudiantes de GOSMEL agradeciendo al público al final de un concierto',
    true,
    180
  ),
  (
    'auth_register',
    'Autenticación · Registro',
    'Piano5Light_hqrabp',
    'Estudiante de canto en una clase de GOSMEL',
    true,
    190
  )
on conflict (clave) do nothing;
