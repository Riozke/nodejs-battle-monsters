import app from '../../app';

const server = app.listen();

afterAll(() => server.close());

describe('MonsterExtendedController', () => {

    describe('Import CSV', () => {
        test('should fail when importing csv file with an empty monster', () => {
            // @TODO
            expect(true).toBe(false);
        });

        test('should fail when importing csv file with wrong or inexistent columns.', () => {
            // @TODO
            expect(true).toBe(false);
        });

        test('should import all the CSV objects into the database successfully', () => {
            // @TODO
            expect(true).toBe(false);
        });
    });
});
