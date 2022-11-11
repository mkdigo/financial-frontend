import React, { useEffect, useState } from 'react';

import BalanceSheetApi, {
  IBalanceSheet,
  IIncomeStatement,
} from '../../api/BalanceSheetApi';
import useAppContext from '../../hooks/useAppContext';
import { numberFormat } from '../../helpers';

import { Layout } from '../../Layout';
import PrintSvg from '../../svg/PrintSvg';

import styles from './styles.module.scss';

interface IYearMonth {
  year: string;
  month: string;
}

const BalanceSheet: React.FC = () => {
  const { setLoading } = useAppContext();
  const today = new Date();
  const thisYear = String(today.getFullYear());
  const thisMonth =
    today.getMonth() + 1 < 10
      ? `0${today.getMonth() + 1}`
      : String(today.getMonth() + 1);

  const [yearMonth, setYearMonth] = useState<IYearMonth>({
    year: thisYear,
    month: thisMonth,
  });

  const [balanceSheet, setBalanceSheet] = useState<IBalanceSheet>({
    assets: {
      current: {},
      longTerm: {},
      property: {},
      otherAssets: {},
    },
    liabilities: {
      current: {},
      longTerm: {},
      otherLiabilities: {},
    },
    equity: {},
    amounts: {
      assets: 0,
      currentAssets: 0,
      longTermAssets: 0,
      property: 0,
      otherAssets: 0,
      currentLiabilities: 0,
      longTermLiabilities: 0,
      otherLiabilities: 0,
      equity: 0,
      liabilities: 0,
    },
  });

  const [incomeStatement, setIncomeStatement] = useState<IIncomeStatement>({
    revenues: {},
    expenses: {},
    taxes: {},
    amounts: {
      revenues: 0,
      expenses: 0,
      taxes: 0,
      incomeBeforeTaxes: 0,
      incomeAfterTaxes: 0,
    },
  });

  useEffect(() => {
    (async () => {
      setLoading(true);
      const api = new BalanceSheetApi();
      setLoading(false);

      const response = await api.get({
        year: yearMonth.year,
        month: yearMonth.month,
      });

      if (!response.success) return;

      setBalanceSheet(response.data.balance);
      setIncomeStatement(response.data.incomeStatement);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yearMonth]);

  const handleInputChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    let value: string | number = event.target.value;

    setYearMonth((prev) => ({
      ...prev,
      [event.target.name]: value,
    }));
  };

  return (
    <Layout>
      <div className='title'>
        <h1>Balanço Patrimonial</h1>

        <div className='tools'>
          <button type='button' onClick={() => window.print()}>
            <PrintSvg />
          </button>
        </div>
      </div>

      <ul className={styles.selectDate}>
        <li>
          <label htmlFor='year'>Ano</label>
          <input
            type='number'
            name='year'
            id='year'
            value={yearMonth.year}
            onChange={handleInputChange}
          />
        </li>
        <li>
          <label htmlFor='month'>Mês</label>
          <select
            name='month'
            id='month'
            value={yearMonth.month}
            onChange={handleInputChange}
          >
            <option value='01'>1</option>
            <option value='02'>2</option>
            <option value='03'>3</option>
            <option value='04'>4</option>
            <option value='05'>5</option>
            <option value='06'>6</option>
            <option value='07'>7</option>
            <option value='08'>8</option>
            <option value='09'>9</option>
            <option value='10'>10</option>
            <option value='11'>11</option>
            <option value='12'>12</option>
          </select>
        </li>
      </ul>

      <section className={styles.balance}>
        <div className={styles.assets}>
          <div>
            <h2>Ativo</h2>

            <ul>
              <li>
                <strong>Circulante</strong>
                <span>{numberFormat(balanceSheet.amounts.currentAssets)}</span>
              </li>
              {balanceSheet.assets.current &&
                Object.keys(balanceSheet.assets.current).map((key, index) => (
                  <li key={index}>
                    <span>{key}</span>
                    <span>
                      {numberFormat(balanceSheet.assets.current[key])}
                    </span>
                  </li>
                ))}
            </ul>

            <ul>
              <li>
                <strong>Realizável a longo prazo</strong>
                <span>{numberFormat(balanceSheet.amounts.longTermAssets)}</span>
              </li>
              {balanceSheet.assets.longTerm &&
                Object.keys(balanceSheet.assets.longTerm).map((key, index) => (
                  <li key={index}>
                    <span>{key}</span>
                    <span>
                      {numberFormat(balanceSheet.assets.longTerm[key])}
                    </span>
                  </li>
                ))}
            </ul>

            <ul>
              <li>
                <strong>Permanente</strong>
                <span>{numberFormat(balanceSheet.amounts.property)}</span>
              </li>
              {balanceSheet.assets.property &&
                Object.keys(balanceSheet.assets.property).map((key, index) => (
                  <li key={index}>
                    <span>{key}</span>
                    <span>
                      {numberFormat(balanceSheet.assets.property[key])}
                    </span>
                  </li>
                ))}
            </ul>

            <ul>
              <li>
                <strong>Outros Ativos</strong>
                <span>{numberFormat(balanceSheet.amounts.otherAssets)}</span>
              </li>
              {balanceSheet.assets.otherAssets &&
                Object.keys(balanceSheet.assets.otherAssets).map(
                  (key, index) => (
                    <li key={index}>
                      <span>{key}</span>
                      <span>
                        {numberFormat(balanceSheet.assets.otherAssets[key])}
                      </span>
                    </li>
                  )
                )}
            </ul>
          </div>
          <div className='amount'>
            <ul>
              <li>
                <strong>Total</strong>
                <span>{numberFormat(balanceSheet.amounts.assets)}</span>
              </li>
            </ul>
          </div>
        </div>

        <div>
          <div>
            <h2>Passivo</h2>

            <ul>
              <li>
                <strong>Circulante</strong>
                <span>
                  {numberFormat(balanceSheet.amounts.currentLiabilities)}
                </span>
              </li>
              {balanceSheet.liabilities.current &&
                Object.keys(balanceSheet.liabilities.current).map(
                  (key, index) => (
                    <li key={index}>
                      <span>{key}</span>
                      <span>
                        {numberFormat(balanceSheet.liabilities.current[key])}
                      </span>
                    </li>
                  )
                )}
            </ul>

            <ul>
              <li>
                <strong>Exigível a longo prazo</strong>
                <span>
                  {numberFormat(balanceSheet.amounts.longTermLiabilities)}
                </span>
              </li>
              {balanceSheet.liabilities.longTerm &&
                Object.keys(balanceSheet.liabilities.longTerm).map(
                  (key, index) => (
                    <li key={index}>
                      <span>{key}</span>
                      <span>
                        {numberFormat(balanceSheet.liabilities.longTerm[key])}
                      </span>
                    </li>
                  )
                )}
            </ul>

            <ul>
              <li>
                <strong>Outros Passivos</strong>
                <span>
                  {numberFormat(balanceSheet.amounts.otherLiabilities)}
                </span>
              </li>
              {balanceSheet.liabilities.otherLiabilities &&
                Object.keys(balanceSheet.liabilities.otherLiabilities).map(
                  (key, index) => (
                    <li key={index}>
                      <span>{key}</span>
                      <span>
                        {numberFormat(
                          balanceSheet.liabilities.otherLiabilities[key]
                        )}
                      </span>
                    </li>
                  )
                )}
            </ul>

            <ul>
              <li>
                <strong>Patrimônio Líquido</strong>
                <span>{numberFormat(balanceSheet.amounts.equity)}</span>
              </li>
              {balanceSheet.equity &&
                Object.keys(balanceSheet.equity).map((key, index) => (
                  <li key={index}>
                    <span>{key}</span>
                    <span>{numberFormat(balanceSheet.equity[key])}</span>
                  </li>
                ))}
            </ul>
          </div>
          <div className='amount'>
            <ul>
              <li>
                <strong>Total</strong>
                <span>{numberFormat(balanceSheet.amounts.liabilities)}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <div className={`title ${styles.incomeStatementTitle}`}>
        <h1>DRE</h1>
      </div>

      <section className={styles.incomeStatement}>
        <ul>
          <h2>Receitas</h2>

          {Object.keys(incomeStatement.revenues).map((key, index) => (
            <li key={index}>
              <span>{key}</span>
              <span>{numberFormat(incomeStatement.revenues[key])}</span>
            </li>
          ))}
          <li>
            <strong>Total das Receitas</strong>
            <strong>{numberFormat(incomeStatement.amounts.revenues)}</strong>
          </li>
        </ul>

        <ul>
          <h2>Despesas</h2>

          {Object.keys(incomeStatement.expenses).map((key, index) => (
            <li key={index}>
              <span>{key}</span>
              <span>{numberFormat(incomeStatement.expenses[key])}</span>
            </li>
          ))}
          <li>
            <strong>Total das Despesas</strong>
            <strong>{numberFormat(incomeStatement.amounts.expenses)}</strong>
          </li>
          <li>
            <strong>Lucro/Prejuizo antes dos impostos</strong>
            <strong>
              {numberFormat(incomeStatement.amounts.incomeBeforeTaxes)}
            </strong>
          </li>
          {Object.keys(incomeStatement.taxes).map((key, index) => (
            <li key={index}>
              <span>{key}</span>
              <span>{numberFormat(incomeStatement.taxes[key])}</span>
            </li>
          ))}
          <li className='netIncome'>
            <strong>Lucro/Prejuizo depois dos impostos</strong>
            <strong>
              {numberFormat(incomeStatement.amounts.incomeAfterTaxes)}
            </strong>
          </li>
        </ul>
      </section>
    </Layout>
  );
};

export { BalanceSheet };
