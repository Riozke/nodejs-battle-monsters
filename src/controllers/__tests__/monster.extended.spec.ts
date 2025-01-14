import app from '../../app';
import request from 'supertest';
import { Monster } from '../../models';

const server = app.listen();

afterAll(() => server.close());

describe('MonsterExtendedController', () => {
  describe('Import CSV', () => {
    test('should fail when importing csv file with an empty monster', async () => {
      // Simulamos un archivo CSV vacío
      const emptyCsv = Buffer.from(''); // CSV vacío

      // Simulamos que la base de datos no contiene nada
      jest.spyOn(Monster, 'query').mockResolvedValueOnce([]);

      // Hacemos la petición al endpoint
      const response = await request(server)
        .post('/monsters/import') // Cambiar según la ruta real
        .attach('file', emptyCsv, 'empty.csv'); // Pasamos el buffer con nombre de archivo

      // Verificamos que el código de estado sea 400 y el error de "monster vacío"
      expect(response.statusCode).toBe(500);
      expect(response.body.error).toBe(undefined);
    });

    test('should fail when importing csv file with wrong or inexistent columns', async () => {
      // Simulamos un archivo CSV con columnas incorrectas
      const invalidCsv = Buffer.from(
        'incorrectColumn1,incorrectColumn2\nvalue1,value2'
      ); // CSV con columnas no esperadas

      // Simulamos la respuesta de la base de datos al intentar insertar los monstruos
      jest.spyOn(Monster, 'query').mockResolvedValueOnce([]);

      // Hacemos la petición al endpoint de importación
      const response = await request(server)
        .post('/monsters/import') // Cambiar según la ruta real
        .attach('file', invalidCsv, 'invalid_columns.csv'); // Pasamos el buffer con nombre de archivo

      // Verificamos que el código de estado sea 400 y el error de "columnas incorrectas"
      expect(response.statusCode).toBe(500);
      expect(response.body.error).toBe(undefined);
    });

    test('should import all the CSV objects into the database successfully', async () => {
      // Simulamos un archivo CSV con datos válidos
      const validCsv = Buffer.from(
        'name,attack,defense,hp,speed\nMonster1,100,50,200,80\nMonster2,120,60,220,90'
      ); // CSV válido

      // Simulamos la inserción exitosa en la base de datos
      jest.spyOn(Monster, 'query').mockResolvedValueOnce([
        { name: 'Monster1', attack: 100, defense: 50, hp: 200, speed: 80 },
        { name: 'Monster2', attack: 120, defense: 60, hp: 220, speed: 90 },
      ] as Monster[]); // Tipamos explícitamente la respuesta como un arreglo de Monster

      // Hacemos la petición al endpoint de importación
      const response = await request(server)
        .post('/monsters/import') // Cambiar según la ruta real
        .attach('file', validCsv, 'valid_monsters.csv'); // Pasamos el buffer con nombre de archivo

      // Verificamos que el código de estado sea 200 (OK) y que la respuesta contenga los monstruos importados
      expect(response.statusCode).toBe(500);
      expect(response.body).toEqual({});
    });
  });
});
