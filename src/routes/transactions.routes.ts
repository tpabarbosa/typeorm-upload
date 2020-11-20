import { Router } from 'express';
import { getCustomRepository } from 'typeorm';

import multer from 'multer';
import uploadConfig from '../config/upload';

import CreateTransactionService from '../services/CreateTransactionService';
import TransactionsRepository from '../repositories/TransactionsRepository';

import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

const upload = multer(uploadConfig);

transactionsRouter.get('/', async (_request, response) => {
  // call ListTransactionsService()

  const transactionRepository = getCustomRepository(TransactionsRepository);

  const transactions = await transactionRepository.find();
  const balance = await transactionRepository.getBalance();

  return response.json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  // call CreateCategoriesService()
  // call CreateTransactionService()

  const createTransaction = new CreateTransactionService();

  const transaction = await createTransaction.execute({
    title,
    value,
    type,
    category,
  });

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const deleteTransaction = new DeleteTransactionService();

  const deletedMessage = await deleteTransaction.execute({ id });

  return response.json(deletedMessage);
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    console.log(request.file);
    //console.log(Buffer.from(request.file, 'base64').toString('ascii'));
    const transactionsFilename = request.file.filename;

    // call ParseCsvService()
    // call CreateCategoriesService()
    // call CreateTransactionService()

    const importTransactions = new ImportTransactionsService();

    const importedTransactions = await importTransactions.execute(
      transactionsFilename,
    );

    return response.json(importedTransactions); // importedTransactions);
  },
);

export default transactionsRouter;
