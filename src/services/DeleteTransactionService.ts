import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  id: string;
}

interface Response {
  message: string;
}

class DeleteTransactionService {
  public async execute(id: Request): Promise<Response> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transaction = await transactionsRepository.findOne(id);

    if (!transaction) {
      throw new AppError('Transaction not found.', 400);
    }

    try {
      await transactionsRepository.remove(transaction);
    } catch (err) {
      throw new AppError(`Transaction not removed from database. ${err}`, 400);
    }

    return { message: 'Transaction removed from database.' };
  }
}

export default DeleteTransactionService;
