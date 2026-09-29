# Diagramas del sistema

En esta página se muestran los flujos principales del proyecto. Cada diagrama está en su propio bloque Mermaid; el visor debe tener Mermaid habilitado para dibujarlos.

## Asignación de plan y contrato

```mermaid
flowchart TD
    A[Administrador] --> B[Seleccionar cliente]
    B --> C[Seleccionar plan]
    C --> D[ContratoService]
    D --> E[Verificar cliente y plan]
    E --> F[BEGIN TRANSACTION]
    F --> G[Registrar asignación]
    G --> H[Crear contrato]
    H --> I{¿Operación correcta?}
    I -->|Sí| J[COMMIT]
    I -->|No| K[ROLLBACK]
    J --> L[Confirmar operación]
    K --> M[Mostrar error]
```

## Registro de movimiento financiero

```mermaid
flowchart TD
    A[Administrador] --> B[Registrar movimiento]
    B --> C[FinanzaService]
    C --> D[Validar datos]
    D --> E[BEGIN TRANSACTION]
    E --> F[Registrar ingreso o egreso]
    F --> G{¿Operación correcta?}
    G -->|Sí| H[COMMIT]
    G -->|No| I[ROLLBACK]
    H --> J[Movimiento guardado]
    I --> K[Mostrar error]
```

## Flujo general de trabajo y arquitectura

```mermaid
flowchart TD
    subgraph Planeacion[Planeación Scrum]
        A[Product Backlog y sprints] --> B[Historias de usuario]
        B --> C[Documentación y evidencias]
    end

    subgraph Arquitectura[Arquitectura CLI y base de datos]
        D[Usuario] --> E[Menús CLI]
        E --> F[Servicios de negocio]
        F --> G[Controladores y repositories]
        G --> H[(MySQL)]
    end

    subgraph Entrega[Entrega final]
        I[Repositorio GitHub y Conventional Commits] --> J[Video de presentación de máximo 7 minutos]
    end
```


```mermaid
erDiagram

    CLIENTE {
        INT id_cliente PK
        VARCHAR nombre
        VARCHAR apellido
        VARCHAR correo UK
        VARCHAR telefono
        DATE fecha_registro
        VARCHAR estado
    }

    PLAN_ENTRENAMIENTO {
        INT id_plan PK
        VARCHAR nombre_plan
        VARCHAR duracion
        TEXT metas_fisicas
        VARCHAR nivel
        DECIMAL precio
    }

    PLAN_NUTRICIONAL {
        INT id_nutricion PK
        VARCHAR descripcion
        INT calorias_estimadas
        DATE fecha_inicio
        DATE fecha_fin
        VARCHAR estado
    }

    DETALLE_PLAN {
        INT id_detalle_plan PK
        INT id_plan_entrenamiento FK
        INT id_plan_nutricional FK
        VARCHAR observaciones
    }

    ASIGNACION_PLAN {
        INT id_asignacion PK
        INT id_cliente FK
        INT id_detalle_plan FK
        DATE fecha_inicio
        DATE fecha_fin
        VARCHAR estado
    }

    CONTRATO {
        INT id_contrato PK
        INT id_asignacion FK
        INT id_cliente FK
        TEXT condiciones
        DECIMAL precio
        DATE fecha_inicio
        DATE fecha_fin
        VARCHAR estado
    }

    RUTINA {
        INT id_rutina PK
        INT id_plan FK
        VARCHAR nombre_rutina
        TEXT descripcion
        VARCHAR estado
    }

    COMIDA_NUTRICIONAL {
        INT id_comida PK
        INT id_nutricion FK
        VARCHAR dia_semana
        VARCHAR tipo_comida
        TIME hora
        TEXT indicaciones
    }

    ALIMENTO {
        INT id_alimento PK
        VARCHAR nombre UK
        DECIMAL calorias_por_porcion
        DECIMAL proteinas
        DECIMAL carbohidratos
        DECIMAL grasas
        VARCHAR unidad_medida_base
    }

    DETALLE_COMIDA {
        INT id_detalle PK
        INT id_comida FK
        INT id_alimento FK
        DECIMAL cantidad
        VARCHAR unidad
        INT calorias_estimadas
        TEXT observaciones
    }

    PROGRESO_FISICO {
        INT id_progreso PK
        INT id_cliente FK
        DATE fecha_registro
        DECIMAL peso
        DECIMAL grasa_corporal
        TEXT medidas
        VARCHAR foto
        TEXT comentarios
    }

    SEGUIMIENTO_CLIENTE {
        INT id_seguimiento PK
        INT id_cliente FK
        INT id_asignacion FK
        INT id_rutina FK
        INT id_nutricion FK
        INT id_progreso_fisico FK
        DATE fecha_seguimiento
        TEXT cumplimiento_rutinas
        TEXT cumplimiento_nutricion
        TEXT observaciones_generales
    }

    CATEGORIA_FINANZA {
        INT id_categoria PK
        VARCHAR nombre
        VARCHAR tipo
        TEXT descripcion
    }

    FINANZA {
        INT id_finanza PK
        INT id_categoria FK
        INT id_contrato FK
        DECIMAL monto
        TEXT descripcion
        DATE fecha
    }

    PLAN_ENTRENAMIENTO ||--o{ DETALLE_PLAN : "incluye"
    PLAN_NUTRICIONAL ||--o{ DETALLE_PLAN : "incluye"
    
    CLIENTE ||--o{ ASIGNACION_PLAN : "recibe"
    DETALLE_PLAN ||--o{ ASIGNACION_PLAN : "configura"

    ASIGNACION_PLAN ||--o| CONTRATO : "genera"
    CLIENTE ||--o{ CONTRATO : "firma"

    PLAN_ENTRENAMIENTO ||--o{ RUTINA : "contiene"
    PLAN_NUTRICIONAL ||--o{ COMIDA_NUTRICIONAL : "contiene"
    ALIMENTO ||--o{ DETALLE_COMIDA : "incluye"
    COMIDA_NUTRICIONAL ||--o{ DETALLE_COMIDA : "contiene"

    CLIENTE ||--o{ PROGRESO_FISICO : "registra"
    CLIENTE ||--o{ SEGUIMIENTO_CLIENTE : "tiene"
    ASIGNACION_PLAN ||--o{ SEGUIMIENTO_CLIENTE : "audita"
    RUTINA ||--o{ SEGUIMIENTO_CLIENTE : "evalúa"
    PLAN_NUTRICIONAL ||--o{ SEGUIMIENTO_CLIENTE : "revisa"
    PROGRESO_FISICO ||--o{ SEGUIMIENTO_CLIENTE : "incorpora"

    CATEGORIA_FINANZA ||--o{ FINANZA : "clasifica"
    CONTRATO ||--o{ FINANZA : "genera"

```

en el siguiente enlace esta la grabacion del video explicativo
https://drive.google.com/drive/folders/1EHoH4rAuWTKglPZUkQhkboBwUMvu51vb?usp=sharing



