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

  const getData = useCallback(() => {
    setLoading(true);
    AccountApi.get(params).then((response) => {
      if (response.success && response.data) {
        setAccounts(response.data);
      }
      setLoading(false);
    });
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
    GroupApi.get().then((response) => {
      if (response.success) setGroups(response.data);
    });
  }, []);

  useEffect(() => {
    SubgroupApi.get().then((response) => {
      if (response.success) setSubgroups(response.data);
    });
  }, []);

  const handleFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ): void => {
    setParams((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleAddSubmit = (data: IAccountEntryData): void => {
    setLoading(true);
    AccountApi.store(data).then((response) => {
      if (response.success) {
        const newAccounts = accounts;
        newAccounts.unshift(response.data);
        setAccounts(newAccounts);
        handleCloseModal();
        done();
      } else {
        handleError(
          response.message ?? 'Algo de errado aconteceu. Tente novamente.'
        );
      }
      setLoading(false);
    });
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

  const handleEditSubmit = (data: IAccountEntryData): void => {
    if (data.id) {
      setLoading(true);

      AccountApi.update(data).then((response) => {
        if (response.success) {
          const newAccounts = accounts.map((account) => {
            if (account.id === response.data?.id) return response.data;
            return account;
          });
          setAccounts(newAccounts);
          handleCloseModal();
          done();
        } else {
          handleError(
            response.message ?? 'Algo de errado aconteceu. Tente novamente.'
          );
        }
        setLoading(false);
      });
    }
  };

  const handleDeleteAccount = (id: number): void => {
    handleOpenModal('delete');
    setDeleteId(id);
  };

  const handleDeleteSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ): void => {
    event.preventDefault();
    setLoading(true);

    if (deleteId) {
      AccountApi.destroy(deleteId).then((response) => {
        if (response.success) {
          const newAccounts = accounts.filter(
            (account) => account.id !== deleteId
          );
          setAccounts(newAccounts);
          handleCloseModal();
          done();
        } else {
          handleError(
            'Você não pode excluir essa conta! Uma conta só pode ser excluida se não houver lançamentos com ela. Exclua todos os lançamentos que usa essa conta antes.'
          );
        }
        setLoading(false);
      });
    } else {
      handleError('Nenhuma conta foi seleciona, tente novamente.');
    }
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
