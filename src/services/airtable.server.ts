import Airtable, { Records, SelectOptions } from 'airtable'
import { Transaction, Type } from './transactions'

type AirtableRecord = {
  'Date Paiement'?: string;
  'Date Facturation': string;
  Mission: string;
  Client: string;
  Total: number;
  Ref: string;
  Type: Type;
  Prix: string;
}


export const fetchTransactions = async (select: SelectOptions<AirtableRecord> = {}) => {
  if (typeof document !== 'undefined') throw new Error('Cannot fetch transactions in browser')

  let transactions: Transaction[] = []
  const table = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID!)

  await table('Transactions').select({
    sort: [{
      field: 'Date Paiement',
      direction: 'desc',
    }, { field: 'Date Facturation', direction: 'desc' }], ...select,
  } as any).eachPage((records, fetchNextPage) => {
    transactions = [
      ...transactions,
      ...(records as unknown as Records<AirtableRecord>).map(({ fields }) => ({
        ref: fields['Ref'],
        datePaiement: fields['Date Paiement'] ? new Date(fields['Date Paiement']) : undefined,
        dateFacturation: fields['Date Facturation'] ? new Date(fields['Date Facturation']) : undefined,
        mission: fields['Mission'],
        client: fields['Client'],
        total: fields['Total'],
        type: fields['Type'],
        prix: fields['Prix'],
      })),
    ]

    fetchNextPage()
  })

  return [
    ...transactions.filter(({ dateFacturation }) => !dateFacturation),
    ...transactions.filter(({ datePaiement, dateFacturation }) => dateFacturation && !datePaiement),
    ...transactions.filter(({ datePaiement, dateFacturation }) => dateFacturation && datePaiement),

  ]
}

