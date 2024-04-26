import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const create = async (req: Request, res: Response): Promise<Response> => {
    // @TODO
    return res.status(StatusCodes.BAD_REQUEST);
};

const remove = async (req: Request, res: Response): Promise<Response> => {
    // @TODO
    return res.status(StatusCodes.BAD_REQUEST);
}

export const BattleExtendedController = {
    create,
    remove,
};