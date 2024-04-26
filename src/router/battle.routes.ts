import { Router } from 'express';
import { BattleController } from '../controllers/battle.controller';
import { BattleExtendedController } from '../controllers/battle.extended.controller'; 

const router = Router();

router.get('/', BattleController.list);
router.post('/', BattleExtendedController.create);
router.delete('/:id', BattleExtendedController.remove);

export default router;
