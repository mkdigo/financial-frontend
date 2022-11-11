import { Api, Response } from './';

export interface IBalanceSheet {
  assets: {
    current: any;
    longTerm: any;
    property: any;
    otherAssets: any;
  };
  liabilities: {
    current: any;
    longTerm: any;
    otherLiabilities: any;
  };
  equity: any;
  amounts: {
    assets: number;
    currentAssets: number;
    longTermAssets: number;
    property: number;
    otherAssets: number;
    currentLiabilities: number;
    longTermLiabilities: number;
    otherLiabilities: number;
    equity: number;
    liabilities: number;
  };
}

export interface IIncomeStatement {
  revenues: any;
  expenses: any;
  taxes: any;
  amounts: {
    revenues: number;
    expenses: number;
    taxes: number;
    incomeBeforeTaxes: number;
    incomeAfterTaxes: number;
  };
}

type TParams = {
  year: string;
  month: string;
};

export default class BalanceSheetApi extends Api {
  public async get(params: TParams): Promise<
    Response<{
      balance: IBalanceSheet;
      incomeStatement: IIncomeStatement;
    }>
  > {
    return await this.request.get(`/balance`, { params });
  }
}
