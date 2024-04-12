import { Id, RelationMappings } from 'objection';
import Base from './base';
import { Monster } from './monster.model';

export class Battle extends Base {
  id!: Id;
  monsterA!: Monster;
  monsterB!: Monster;
  winner!: Monster;

  static tableName = 'battle';

  static get relationMappings(): RelationMappings {
    return {
      monsterARelation: {
        relation: Battle.BelongsToOneRelation,
        modelClass: Monster,
        join: {
          from: 'battle.monsterA',
          to: 'monster.id'
        }
      },
      monsterBRelation: {
        relation: Battle.BelongsToOneRelation,
        modelClass: Monster,
        join: {
          from: 'battle.monsterB',
          to: 'monster.id'
        }
      },
      winnerRelation: {
        relation: Battle.BelongsToOneRelation,
        modelClass: Monster,
        join: {
          from: 'battle.winner',
          to: 'monster.id'
        }
      }
    };
  }
}
