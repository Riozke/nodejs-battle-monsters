import app from '../../app';
import request from 'supertest';
import { Battle, Monster } from '../../models';

const server = app.listen();

afterAll(() => server.close());

describe('BattleExtendedController', () => {
  describe('Battle', () => {
    test('should fail when trying a battle of monsters with an undefined monster', async () => {
      // Simulamos un escenario en el que uno de los monstruos es indefinido o no existe
      const undefinedMonsterId = null; // Usamos `null` para un ID inválido

      // Hacemos la petición al endpoint para la batalla de monstruos
      const response = await request(server)
        .post('/battle') // Ruta del endpoint de batalla, ajusta según corresponda
        .send({ monsterAId: undefinedMonsterId, monsterBId: 1 }); // Usar los nombres de parámetros correctos

      // Verificamos que el código de estado sea 400 y que el error sea el esperado
      expect(response.statusCode).toBe(400); // Validación de código de estado adecuado
      expect(response.body.error).toBe('Both monster IDs are required'); // Verificar que el mensaje de error coincida
    });

    test('should fail when trying a battle of monsters with an inexistent monster', async () => {
      // IDs de monstruos donde uno de ellos no existe
      const existingMonsterId = 1; // ID de un monstruo que existe
      const nonexistentMonsterId = 9999; // ID de un monstruo que no existe

      // Mock de la respuesta de la base de datos para simular que un monstruo no existe
      Monster.query = jest.fn().mockReturnValue({
        findById: jest
          .fn()
          .mockResolvedValueOnce({
            id: existingMonsterId,
            hp: 100,
            attack: 50,
            defense: 20,
            speed: 10,
            name: 'Monster A',
          })
          .mockResolvedValueOnce(null), // El segundo monstruo no existe
      });

      // Hacemos la petición al endpoint para la batalla de monstruos
      const response = await request(server)
        .post('/battle') // Ruta del endpoint de batalla
        .send({
          monsterAId: existingMonsterId,
          monsterBId: nonexistentMonsterId,
        });

      // Verificamos que el código de estado sea 404 y que el error sea el esperado
      expect(response.statusCode).toBe(404); // Verificamos que el estado sea 404
      expect(response.body.error).toBe('One or both monsters not found'); // Verificamos el mensaje de error
    });

    test('should insert a battle of monsters successfully with monster A winning', async () => {
      // Datos simulados de los monstruos
      const monsterA = {
        id: 1,
        hp: 100,
        attack: 50,
        defense: 20,
        speed: 10,
        name: 'Monster A',
      };
      const monsterB = {
        id: 2,
        hp: 80,
        attack: 40,
        defense: 15,
        speed: 8,
        name: 'Monster B',
      };

      // Mock de las consultas de la base de datos
      Monster.query = jest.fn().mockReturnValue({
        findById: jest
          .fn()
          .mockResolvedValueOnce(monsterA) // Primer llamado retorna el monstruo A
          .mockResolvedValueOnce(monsterB), // Segundo llamado retorna el monstruo B
      });

      // Mock de la inserción de la batalla
      Battle.query = jest.fn().mockReturnValue({
        insert: jest.fn().mockResolvedValue({
          monsterA: monsterA.id,
          monsterB: monsterB.id,
          winner: monsterA.id,
        }),
      });

      // Petición al endpoint para crear la batalla
      const response = await request(server)
        .post('/battle')
        .send({ monsterAId: monsterA.id, monsterBId: monsterB.id });

      // Verificaciones
      expect(response.statusCode).toBe(201); // Verificamos que el estado sea 201
      expect(response.body.winnerId).toBe(monsterA.id); // Verificamos que el ganador sea el ID del monstruo A
    });

    test('should insert a battle of monsters successfully with monster B winning', async () => {
      // Datos simulados de los monstruos
      const monsterA = {
        id: 1,
        hp: 50,
        attack: 30,
        defense: 10,
        speed: 10,
        name: 'Monster A',
      };
      const monsterB = {
        id: 2,
        hp: 100,
        attack: 40,
        defense: 20,
        speed: 15,
        name: 'Monster B',
      };

      // Mock de las consultas de la base de datos
      Monster.query = jest.fn().mockReturnValue({
        findById: jest
          .fn()
          .mockResolvedValueOnce(monsterA) // Primer llamado retorna el monstruo A
          .mockResolvedValueOnce(monsterB), // Segundo llamado retorna el monstruo B
      });

      // Mock de la inserción de la batalla
      Battle.query = jest.fn().mockReturnValue({
        insert: jest.fn().mockResolvedValue({
          monsterA: monsterA.id,
          monsterB: monsterB.id,
          winner: monsterB.id,
        }),
      });

      // Petición al endpoint para crear la batalla
      const response = await request(server)
        .post('/battle')
        .send({ monsterAId: monsterA.id, monsterBId: monsterB.id });

      // Verificaciones
      expect(response.statusCode).toBe(201); // Verificamos que el estado sea 201
      expect(response.body.winnerId).toBe(monsterB.id); // Verificamos que el ganador sea el ID del monstruo B
    });
  });

  describe('Delete Battle', () => {
    test('should delete a battle successfully', async () => {
      // ID de la batalla a eliminar
      const battleId = 1;

      // Mock de la eliminación de la batalla
      Battle.query = jest.fn().mockReturnValue({
        findById: jest.fn().mockResolvedValue({ id: battleId }), // Simula la batalla encontrada
        deleteById: jest.fn().mockResolvedValue(1), // Simula la eliminación exitosa
      });

      // Petición al endpoint para eliminar la batalla
      const response = await request(server)
        .delete(`/battle/${battleId}`) // Ruta de eliminación de batalla
        .send(); // No se necesita enviar cuerpo en la eliminación

      // Verificación
      expect(response.statusCode).toBe(204); // Verificamos que el estado sea 204 (sin contenido)
    });

    test('should return 404 if the battle does not exist', async () => {
      const nonexistentBattleId = 'nonexistent-id'; // ID que no existe en la base de datos

      // Mockeamos la respuesta de la base de datos para que `findById` devuelva `undefined`
      Battle.query = jest.fn().mockReturnValue({
        findById: jest.fn().mockResolvedValue(undefined), // Simula que no se encuentra la batalla
      });

      // Hacemos la petición al endpoint para eliminar la batalla
      const response = await request(server)
        .delete(`/battle/${nonexistentBattleId}`) // Ruta para eliminar la batalla
        .send(); // Si la ruta no requiere cuerpo, no es necesario enviar nada

      // Verificamos que el código de estado sea 404
      expect(response.statusCode).toBe(404);
      expect(response.body.error).toBe('Battle not found');
    });
  });
});
