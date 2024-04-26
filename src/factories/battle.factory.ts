import { Factory } from 'rosie';
import { Battle } from '../models';
import monsterFactory from './monster.factory';

const monster1 = monsterFactory.build();
const monster2 = monsterFactory.build();

export default Factory.define(Battle.tableName).attrs({
  monsterA: monster1,
  monsterB: monster2,
  winner: monster1,
});
