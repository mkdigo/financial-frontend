import React, { useContext, useEffect, useState } from 'react';
import { IGroup } from '../../api/GroupApi';
import { ISubgroup } from '../../api/SubgroupApi';
import { AppContext } from '../../contexts/AppProvider';
import { groupTranslation } from '../../translations/groupTranslation';
import { subgroupTranslation } from '../../translations/subgroupTranslation';

interface IData {
  name: string;
  group_id: number | '';
  subgroup_id: number | '';
}

interface IProps {
  groups: IGroup[];
  subgroups: ISubgroup[];
  handleAddSubmit: (data: IData) => void;
}

const AccountAddForm: React.FC<IProps> = ({
  groups,
  subgroups,
  handleAddSubmit,
}) => {
  const { language, handleCloseModal } = useContext(AppContext);
  const [data, setData] = useState<IData>({
    name: '',
    group_id: '',
    subgroup_id: '',
  });

  const [availableSubgroups, setAvailableSubgroups] =
    useState<ISubgroup[]>(subgroups);

  useEffect(() => {
    setData({
      name: '',
      group_id: '',
      subgroup_id: '',
    });
  }, []);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleAvailableSubgroups = (
    event: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    if (event.target.value) {
      const group: number = parseInt(event.target.value);
      const availables = subgroups.filter(
        (subgroup) => subgroup.group.id === group
      );
      setAvailableSubgroups(availables);
      setData((prev) => ({
        ...prev,
        group_id: group,
        subgroup_id: '',
      }));
    } else {
      setAvailableSubgroups([]);
      setData((prev) => ({
        ...prev,
        group_id: '',
        subgroup_id: '',
      }));
    }
  };

  const handleAvailableGroups = (
    event: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    if (event.target.value) {
      const subgroup: number = parseInt(event.target.value);

      setData((prev) => ({
        ...prev,
        subgroup_id: subgroup,
      }));
    } else {
      setData((prev) => ({
        ...prev,
        subgroup_id: 0,
      }));
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    handleAddSubmit(data);
  };

  return (
    <>
      <h2>Adicionar Conta</h2>

      <form action='' onSubmit={handleSubmit}>
        <ul>
          <li>
            <label>
              <strong>Nome:</strong>
              <input
                type='text'
                name='name'
                value={data.name}
                onChange={handleInputChange}
                required
              />
            </label>
          </li>
          <li>
            <label>
              <strong>Grupo:</strong>
              <select
                value={data.group_id}
                onChange={handleAvailableSubgroups}
                name='group'
                required
              >
                <option value=''></option>
                {groups.map((group) => (
                  <option value={group.id} key={group.id}>
                    {groupTranslation[language].getName(group.name)}
                  </option>
                ))}
              </select>
            </label>
          </li>
          <li>
            <label>
              <strong>Subgrupo:</strong>
              <select
                value={data.subgroup_id}
                onChange={handleAvailableGroups}
                name='subgroup'
                required
              >
                <option value=''></option>
                {availableSubgroups.map((subgroup) => (
                  <option value={subgroup.id} key={subgroup.id}>
                    {subgroupTranslation[language].getName(subgroup.name)}
                  </option>
                ))}
              </select>
            </label>
          </li>
          <li>
            <button
              type='button'
              className='btn-danger'
              onClick={handleCloseModal}
            >
              Cancelar
            </button>
            <button type='submit' className='btn-primary'>
              Adicionar
            </button>
          </li>
        </ul>
      </form>
    </>
  );
};

export { AccountAddForm };
