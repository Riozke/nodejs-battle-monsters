import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Monster } from '../models';

export const list = async (req: Request, res: Response): Promise<Response> => {
  const monsters = await Monster.query();
  return res.status(StatusCodes.OK).json(monsters);
};

export const MonsterExtendedController = {
  list,
};
