import axios, { catchReturn, TResponse, setHeaders, responseError } from './';

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

export default class BalanceSheetApi {
  public static async get(
    year: string,
    month: string
  ): Promise<
    TResponse<{
      balance: IBalanceSheet;
      incomeStatement: IIncomeStatement;
    }>
  > {
    try {
      const response = await axios.get(`/balance`, setHeaders({ year, month }));

      if (!response.data.success) return responseError(response);

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      return catchReturn(error);
    }
  }
}
