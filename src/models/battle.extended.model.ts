import { Id, Model, RelationMappings } from 'objection';
import Base from './base';
import { Monster } from './monster.extended.model';

export class Battle extends Base {
  id!: Id;
  monsterA!: Monster;
  monsterB!: Monster;
  winner!: Monster;

  static tableName = 'battle';

  static get relationMappings(): RelationMappings {
    return {
      monsterARelation: {
        relation: Model.HasOneRelation,
        modelClass: Monster,
        join: {
          from: 'battles.id',
          to: 'monsters.id',
        },
      },
      monsterBRelation: {
        relation: Model.HasOneRelation,
        modelClass: Monster,
        join: {
          from: 'battles.id',
          to: 'monsters.id',
        },
      },
      winnerRelation: {
        relation: Model.HasOneRelation,
        modelClass: Monster,
        join: {
          from: 'battles.id',
          to: 'monsters.id',
        },
      },
    };
  }
}
