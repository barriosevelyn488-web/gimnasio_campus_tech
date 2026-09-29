const { modulo } = await inquirer.prompt([
    {
      type: 'select',
      name: 'modulo',
      message: 'Seleccione un módulo a gestionar:',
      choices: [
        { name: '1. Gestión de Clientes', value: 'cliente' },
        { name: '2. Planes de Entrenamiento', value: 'plan' },
        { name: '3. Asignación y Contratos (Transacciones)', value: 'contrato' },
        { name: '4. Progreso Físico', value: 'progreso' },
        { name: '5. Gestión Financiera', value: 'finanza' },
        { name: '6. Planes Nutricionales', value: 'nutricion' },
        { name: '7. Seguimiento Integral', value: 'seguimiento' },
        { name: '0. Salir de la aplicación', value: 'salir' }
      ]
    }
  ]);