import { Id, RelationMappings } from 'objection';
import Base from './base';
import { Monster } from './monster.extended.model';

export class Battle extends Base {
  id!: Id;
  monsterA!: Id;
  monsterB!: Id;
  winner!: Id;

  static tableName = 'battle';

  static get relationMappings(): RelationMappings {
    return {};
  }
}
