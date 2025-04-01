import { userHandlers } from './userHandlers';
import { savingsHandlers } from './savingsHandlers';
import { investmentsHandlers } from './investmentsHandlers';
import { transactionsHandlers } from './transactionsHandlers';
import { accountsHandlers } from './accountsHandlers';
import { dashboardHandlers } from './dashboardHandlers';
import { billsHandlers } from './billsHandlers';

export const handlers = [
  ...userHandlers,
  ...savingsHandlers,
  ...investmentsHandlers,
  ...transactionsHandlers,
  ...accountsHandlers,
  ...dashboardHandlers,
  ...billsHandlers
]; 