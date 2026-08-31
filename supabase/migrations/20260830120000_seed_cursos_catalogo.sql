-- Seed del catálogo público (cursos) basado en la landing de GOSMEL.
-- Idempotente: solo inserta si el slug/por clave no existe.
DO $$
DECLARE
  v_teclados  UUID;
  v_cuerdas   UUID;
  v_viento    UUID;
  v_piano     UUID;
  v_violin    UUID;
  v_guitarra  UUID;
  v_guitarra_electrica UUID;
  v_charango  UUID;
  v_quena     UUID;
  v_curso     UUID;
BEGIN
  -- ── Tipos de instrumento ──────────────────────────────────────────────
  SELECT id INTO v_teclados FROM tipos_instrumento WHERE nombre = 'Teclados';
  IF v_teclados IS NULL THEN
    INSERT INTO tipos_instrumento (nombre, orden, activo) VALUES ('Teclados', 1, true) RETURNING id INTO v_teclados;
  END IF;

  SELECT id INTO v_cuerdas FROM tipos_instrumento WHERE nombre = 'Cuerdas';
  IF v_cuerdas IS NULL THEN
    INSERT INTO tipos_instrumento (nombre, orden, activo) VALUES ('Cuerdas', 2, true) RETURNING id INTO v_cuerdas;
  END IF;

  SELECT id INTO v_viento FROM tipos_instrumento WHERE nombre = 'Viento madera';
  IF v_viento IS NULL THEN
    INSERT INTO tipos_instrumento (nombre, orden, activo) VALUES ('Viento madera', 3, true) RETURNING id INTO v_viento;
  END IF;

  -- ── Instrumentos ──────────────────────────────────────────────────────
  SELECT id INTO v_piano FROM instrumentos WHERE slug = 'piano';
  IF v_piano IS NULL THEN
    INSERT INTO instrumentos (nombre, slug, icono, tipo_instrumento_id, orden, activo)
    VALUES ('Piano', 'piano', 'ph:piano-keys', v_teclados, 1, true) RETURNING id INTO v_piano;
  END IF;

  SELECT id INTO v_violin FROM instrumentos WHERE slug = 'violin';
  IF v_violin IS NULL THEN
    INSERT INTO instrumentos (nombre, slug, icono, tipo_instrumento_id, orden, activo)
    VALUES ('Violín', 'violin', 'mdi:violin', v_cuerdas, 2, true) RETURNING id INTO v_violin;
  END IF;

  SELECT id INTO v_guitarra FROM instrumentos WHERE slug = 'guitarra';
  IF v_guitarra IS NULL THEN
    INSERT INTO instrumentos (nombre, slug, icono, tipo_instrumento_id, orden, activo)
    VALUES ('Guitarra', 'guitarra', 'ph:guitar', v_cuerdas, 3, true) RETURNING id INTO v_guitarra;
  END IF;

  SELECT id INTO v_guitarra_electrica FROM instrumentos WHERE slug = 'guitarra-electrica';
  IF v_guitarra_electrica IS NULL THEN
    INSERT INTO instrumentos (nombre, slug, icono, tipo_instrumento_id, orden, activo)
    VALUES ('Guitarra eléctrica', 'guitarra-electrica', 'mdi:guitar-electric', v_cuerdas, 4, true)
    RETURNING id INTO v_guitarra_electrica;
  END IF;

  SELECT id INTO v_charango FROM instrumentos WHERE slug = 'charango';
  IF v_charango IS NULL THEN
    INSERT INTO instrumentos (nombre, slug, icono, tipo_instrumento_id, orden, activo)
    VALUES ('Charango', 'charango', 'ph:guitar', v_cuerdas, 5, true) RETURNING id INTO v_charango;
  END IF;

  SELECT id INTO v_quena FROM instrumentos WHERE slug = 'quena';
  IF v_quena IS NULL THEN
    INSERT INTO instrumentos (nombre, slug, icono, tipo_instrumento_id, orden, activo)
    VALUES ('Quena', 'quena', 'mdi:flute', v_viento, 6, true) RETURNING id INTO v_quena;
  END IF;

  -- ── Cursos ────────────────────────────────────────────────────────────
  SELECT id INTO v_curso FROM cursos WHERE slug = 'piano';
  IF v_curso IS NULL THEN
    INSERT INTO cursos (nombre, slug, descripcion, resumen, nivel, modalidad, publicado, destacado, orden, portada_public_id, instrumento_id)
    VALUES (
      'Piano', 'piano',
      'Domina las teclas con técnica y expresión, desde tus primeras melodías hasta un repertorio más personal.',
      'Piano desde tus primeras melodías hasta un repertorio personal.',
      'basico', 'presencial', true, true, 1, 'Piano3_ebisvx.png', v_piano
    ) RETURNING id INTO v_curso;
    INSERT INTO curso_habilidades (curso_id, habilidad, orden)
    SELECT v_curso, habilidad, orden FROM (VALUES
      ('Lectura musical', 1),
      ('Técnica y coordinación', 2),
      ('Repertorio y expresión', 3)
    ) AS t(habilidad, orden);
  END IF;

  SELECT id INTO v_curso FROM cursos WHERE slug = 'violin';
  IF v_curso IS NULL THEN
    INSERT INTO cursos (nombre, slug, descripcion, resumen, nivel, modalidad, publicado, destacado, orden, portada_public_id, instrumento_id)
    VALUES (
      'Violín', 'violin',
      'Desarrolla oído, precisión y sensibilidad con uno de los instrumentos más expresivos de la música.',
      'Oído, precisión y sensibilidad con el violín.',
      'iniciacion', 'presencial', true, false, 2, 'Violin_Guitarra_2_qfp5j8.png', v_violin
    ) RETURNING id INTO v_curso;
    INSERT INTO curso_habilidades (curso_id, habilidad, orden)
    SELECT v_curso, habilidad, orden FROM (VALUES
      ('Postura y arco', 1),
      ('Afinación y oído', 2),
      ('Interpretación musical', 3)
    ) AS t(habilidad, orden);
  END IF;

  SELECT id INTO v_curso FROM cursos WHERE slug = 'guitarra';
  IF v_curso IS NULL THEN
    INSERT INTO cursos (nombre, slug, descripcion, resumen, nivel, modalidad, publicado, destacado, orden, portada_public_id, instrumento_id)
    VALUES (
      'Guitarra', 'guitarra',
      'Aprende acordes, punteos y teoría musical aplicada para tocar canciones y construir tu propio estilo.',
      'Acordes, punteos y teoría aplicada para tocar canciones.',
      'basico', 'presencial', true, true, 3, 'Guitarras_k0vwdk.png', v_guitarra
    ) RETURNING id INTO v_curso;
    INSERT INTO curso_habilidades (curso_id, habilidad, orden)
    SELECT v_curso, habilidad, orden FROM (VALUES
      ('Acordes y ritmo', 1),
      ('Punteos y acompañamiento', 2),
      ('Repertorio popular', 3)
    ) AS t(habilidad, orden);
  END IF;

  SELECT id INTO v_curso FROM cursos WHERE slug = 'guitarra-electrica';
  IF v_curso IS NULL THEN
    INSERT INTO cursos (nombre, slug, descripcion, resumen, nivel, modalidad, publicado, destacado, orden, portada_public_id, instrumento_id)
    VALUES (
      'Guitarra eléctrica', 'guitarra-electrica',
      'Explora riffs, efectos y técnica para encontrar tu sonido y tocar con mayor seguridad.',
      'Riffs, efectos y técnica para encontrar tu sonido.',
      'intermedio', 'presencial', true, false, 4, 'Guitarra_4_tr6yvj.png', v_guitarra_electrica
    ) RETURNING id INTO v_curso;
    INSERT INTO curso_habilidades (curso_id, habilidad, orden)
    SELECT v_curso, habilidad, orden FROM (VALUES
      ('Riffs y escalas', 1),
      ('Técnica con púa', 2),
      ('Sonido y efectos', 3)
    ) AS t(habilidad, orden);
  END IF;

  SELECT id INTO v_curso FROM cursos WHERE slug = 'solfeo';
  IF v_curso IS NULL THEN
    INSERT INTO cursos (nombre, slug, descripcion, resumen, nivel, modalidad, publicado, destacado, orden, portada_public_id, instrumento_id)
    VALUES (
      'Solfeo', 'solfeo',
      'Construye una base sólida para leer, comprender y expresar la música con mayor libertad.',
      'Base sólida para leer y expresar la música con libertad.',
      'iniciacion', 'presencial', true, false, 5, 'Solfeo_fbbxsf.png', NULL
    ) RETURNING id INTO v_curso;
    INSERT INTO curso_habilidades (curso_id, habilidad, orden)
    SELECT v_curso, habilidad, orden FROM (VALUES
      ('Lectura de partituras', 1),
      ('Ritmo y métrica', 2),
      ('Entrenamiento auditivo', 3)
    ) AS t(habilidad, orden);
  END IF;

  SELECT id INTO v_curso FROM cursos WHERE slug = 'charango';
  IF v_curso IS NULL THEN
    INSERT INTO cursos (nombre, slug, descripcion, resumen, nivel, modalidad, publicado, destacado, orden, portada_public_id, instrumento_id)
    VALUES (
      'Charango', 'charango',
      'Conoce la sonoridad y la tradición de este instrumento andino mientras desarrollas técnica y musicalidad.',
      'Sonoridad y tradición del charango andino.',
      'basico', 'presencial', true, false, 6, 'Guitarras_k0vwdk.png', v_charango
    ) RETURNING id INTO v_curso;
    INSERT INTO curso_habilidades (curso_id, habilidad, orden)
    SELECT v_curso, habilidad, orden FROM (VALUES
      ('Rasgueos tradicionales', 1),
      ('Acordes y afinación', 2),
      ('Repertorio andino', 3)
    ) AS t(habilidad, orden);
  END IF;

  SELECT id INTO v_curso FROM cursos WHERE slug = 'quena';
  IF v_curso IS NULL THEN
    INSERT INTO cursos (nombre, slug, descripcion, resumen, nivel, modalidad, publicado, destacado, orden, portada_public_id, instrumento_id)
    VALUES (
      'Quena', 'quena',
      'Descubre la interpretación de uno de los instrumentos ancestrales de los Andes y su particular color sonoro.',
      'Interpretación de la quena y su color sonoro.',
      'iniciacion', 'presencial', true, false, 7, 'Saludo_c6jxdq.png', v_quena
    ) RETURNING id INTO v_curso;
    INSERT INTO curso_habilidades (curso_id, habilidad, orden)
    SELECT v_curso, habilidad, orden FROM (VALUES
      ('Respiración y emisión', 1),
      ('Digitación y afinación', 2),
      ('Melodías andinas', 3)
    ) AS t(habilidad, orden);
  END IF;
END $$;