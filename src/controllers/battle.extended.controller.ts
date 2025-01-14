import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Monster, Battle } from '../models'; // Asegúrate de que la ruta de importación sea correcta

const create = async (req: Request, res: Response): Promise<Response> => {
  const { monsterAId, monsterBId } = req.body;
  console.log(monsterAId, monsterBId);

  // Validar que los parámetros sean proporcionados
  if (!monsterAId || !monsterBId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: 'Both monster IDs are required' });
  }

  try {
    // Obtener los dos monstruos de la base de datos
    const monsterA = await Monster.query().findById(monsterAId);
    const monsterB = await Monster.query().findById(monsterBId);

    // Verificar si los monstruos existen
    if (!monsterA || !monsterB) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'One or both monsters not found' });
    }

    // Lógica de la batalla
    let winner = null;

    const attacker = monsterA.speed >= monsterB.speed ? monsterA : monsterB;

    while (monsterA.hp > 0 && monsterB.hp > 0) {
      // Determinar qué monstruo ataca primero

      const defender = attacker === monsterA ? monsterB : monsterA;

      // Calcular el daño
      const damage = Math.max(attacker.attack - defender.defense, 1);
      defender.hp -= damage;

      // Cambio de turno

      // Verificar si alguno de los monstruos ha ganado
      if (monsterA.hp <= 0) {
        winner = monsterB;
        break;
      } else if (monsterB.hp <= 0) {
        winner = monsterA;
        break;
      }
    }

    // Guardar la batalla en la base de datos
    if (!winner) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Error determining winner' });
    }

    await Battle.query().insert({
      monsterA: monsterAId,
      monsterB: monsterBId,
      winner: winner, // Solo el ID del ganador
    });

    // Insertar batalla solo con los IDs
    // Retornar la respuesta
    return res.status(StatusCodes.CREATED).json({
      winnerId: winner.id,
      winnerName: winner.name,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Error starting battle' });
  }
};

const remove = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  if (!id) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: 'Battle ID is required' });
  }

  // Verificar si la batalla existe antes de intentar eliminarla
  const battle = await Battle.query().findById(id); // Debería devolver null si no se encuentra
  console.log(battle); // Esto debería imprimir null o el objeto de la batalla si se encuentra

  if (!battle) {
    return res
      .status(StatusCodes.NOT_FOUND) // 404 si no se encuentra la batalla
      .json({ error: 'Battle not found' });
  }

  // Eliminar la batalla de la base de datos
  await Battle.query().deleteById(id);

  return res.status(StatusCodes.NO_CONTENT).send(); // 204 si la batalla se elimina correctamente
};

export const BattleExtendedController = {
  create,
  remove,
};
