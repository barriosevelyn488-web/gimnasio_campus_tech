# Flujo de trabajo Git

## Convención de commits

Usa Conventional Commits con el formato:

```text
<tipo>(<alcance>): <resumen breve en imperativo>
```

Tipos recomendados:

- `feat`: funcionalidad nueva.
- `fix`: corrección de defecto.
- `docs`: documentación.
- `test`: pruebas.
- `refactor`: reorganización sin cambio funcional intencional.
- `chore`: mantenimiento y herramientas.

Ejemplos: `feat(clientes): agregar validación de correo` y `docs(readme): documentar configuración de MySQL`.

## Flujo sugerido

1. Actualiza la rama base antes de comenzar.
2. Crea una rama corta por historia o corrección (`feat/HU-05-contratos`).
3. Mantén cambios enfocados y revisa `git diff` antes de confirmar.
4. Ejecuta las comprobaciones pertinentes y registra su resultado real.
5. Confirma con un mensaje que describa el cambio; integra mediante revisión si el equipo usa pull requests.

## Registro de entrega

El historial Git conserva evidencia de commits. No sustituye capturas del tablero, acuerdos, responsables o retrospectivas Scrum. Adjunta enlaces/capturas reales y conserva autoría/fechas del repositorio; no fabriques evidencia de proceso.
