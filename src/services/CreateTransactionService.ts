import { getCustomRepository } from 'typeorm';

import Transaction from '../models/Transaction';
import AppError from '../errors/AppError';
import CreateCategoryService from './CreateCategoryService';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}
class CreateTransactionService {
  public async execute({
    title,
    type,
    value,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    if (!title || !type || !value || !category) {
      throw new AppError('Error on data.', 400);
    }

    const createCategory = new CreateCategoryService();
    const newCategory = await createCategory.execute({ title: category });

    if (
      type === 'outcome' &&
      (await transactionsRepository.getBalance()).total - value < 0
    ) {
      throw new AppError('error string', 400);
    }

    const transaction = transactionsRepository.create({
      title,
      type,
      value,
      category_id: newCategory.id,
    });

    await transactionsRepository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
