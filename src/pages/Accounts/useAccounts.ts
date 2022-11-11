import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from 'react';

import { AppContext } from '../../contexts/AppProvider';
import AccountApi, {
  IAccount,
  IAccountEntryData,
  IAccountSearchParams,
} from '../../api/AccountApi';
import GroupApi, { IGroup } from '../../api/GroupApi';
import SubgroupApi, { ISubgroup } from '../../api/SubgroupApi';

interface IUseAccounts {
  accounts: IAccount[];
  setAccounts: React.Dispatch<IAccount[]>;
  groups: IGroup[];
  subgroups: ISubgroup[];
  params: IAccountSearchParams;
  handleFilterChange: (
    event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => void;
  handleAddSubmit: (data: IAccountEntryData) => void;
  editAccount: IAccountEntryData;
  handleEditAccount: (account: IAccount) => void;
  handleEditSubmit: (data: IAccountEntryData) => void;
  handleDeleteAccount: (id: number) => void;
  handleDeleteSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  searchRef: React.RefObject<HTMLInputElement>;
}

export default function useAccounts(): IUseAccounts {
  const { setLoading, done, handleOpenModal, handleCloseModal, handleError } =
    useContext(AppContext);

  const [accounts, setAccounts] = useState<IAccount[]>([]);
  const [groups, setGroups] = useState<IGroup[]>([]);
  const [subgroups, setSubgroups] = useState<ISubgroup[]>([]);
  const [params, setParams] = useState<IAccountSearchParams>({
    group_id: '',
    subgroup_id: '',
    search: '',
  });
  const [editAccount, setEditAccount] = useState<IAccountEntryData>({
    id: 0,
    name: '',
    group_id: '',
    subgroup_id: '',
  });
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const searchRef = useRef<HTMLInputElement>(null);

  const getData = useCallback(async () => {
    setLoading(true);
    const api = new AccountApi();

    const response = await api.get(params);
    setLoading(false);

    if (!response.success) return;

    setAccounts(response.data.accounts);
  }, [setLoading, params]);

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.group_id, params.subgroup_id]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (searchRef.current) {
      searchRef.current.onkeyup = () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          getData();
        }, 500);
      };
    }

    return () => clearTimeout(timeout);
  }, [getData]);

  useEffect(() => {
    (async () => {
      const groupApi = new GroupApi();
      const subGroupApi = new SubgroupApi();
      const [groupResponse, subGroupResponse] = await Promise.all([
        groupApi.get(),
        subGroupApi.get(),
      ]);

      if (groupResponse.success) setGroups(groupResponse.data.groups);
      if (subGroupResponse.success)
        setSubgroups(subGroupResponse.data.subgroups);
    })();
  }, []);

  const handleFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ): void => {
    setParams((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleAddSubmit = async (data: IAccountEntryData): Promise<void> => {
    setLoading(true);
    const api = new AccountApi();

    const response = await api.store(data);
    setLoading(false);

    if (!response.success) {
      handleError(
        response.message ?? 'Algo de errado aconteceu. Tente novamente.'
      );
      return;
    }

    const newAccounts = [...accounts];
    newAccounts.unshift(response.data.account);
    setAccounts(newAccounts);
    handleCloseModal();
    done();
  };

  const handleEditAccount = (account: IAccount): void => {
    handleOpenModal('edit');
    setEditAccount({
      id: account.id,
      name: account.name,
      group_id: account.group_id,
      subgroup_id: account.subgroup_id,
    });
  };

  const handleEditSubmit = async (data: IAccountEntryData): Promise<void> => {
    if (data.id) {
      setLoading(true);

      const api = new AccountApi();

      const response = await api.update(data);
      setLoading(false);

      if (!response.success) {
        handleError(
          response.message ?? 'Algo de errado aconteceu. Tente novamente.'
        );
        return;
      }

      const newAccounts = accounts.map((account) => {
        if (account.id === response.data.account.id)
          return response.data.account;
        return account;
      });
      setAccounts(newAccounts);
      handleCloseModal();
      done();
    }
  };

  const handleDeleteAccount = (id: number): void => {
    handleOpenModal('delete');
    setDeleteId(id);
  };

  const handleDeleteSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    if (!deleteId) {
      handleError('Nenhuma conta foi seleciona, tente novamente.');
      return;
    }

    setLoading(true);
    const api = new AccountApi();
    setLoading(false);

    const response = await api.destroy(deleteId);

    if (!response.success) {
      handleError(
        'Você não pode excluir essa conta! Uma conta só pode ser excluida se não houver lançamentos com ela. Exclua todos os lançamentos que usa essa conta antes.'
      );
      return;
    }

    const newAccounts = accounts.filter((account) => account.id !== deleteId);
    setAccounts(newAccounts);
    handleCloseModal();
    done();
  };

  return {
    accounts,
    setAccounts,
    groups,
    subgroups,
    params,
    handleFilterChange,
    handleAddSubmit,
    editAccount,
    handleEditAccount,
    handleEditSubmit,
    handleDeleteAccount,
    handleDeleteSubmit,
    searchRef,
  };
}
