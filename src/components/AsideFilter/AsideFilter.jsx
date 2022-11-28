import { Checkbox } from 'antd';
import { connect, useDispatch } from 'react-redux';

import * as actions from '../../redux/filterSlice';
import { filterTickets } from '../../redux/ticketsSlice';

import styles from './AsideFilter.module.scss';

const CheckboxGroup = Checkbox.Group;

const plainOptions = ['Без пересадок', '1 Пересадка', '2 Пересадки', '3 Пересадки'];

function AsideFilter({ filtersState, toggleAll, toggleFilter, loading }) {
  const dispatch = useDispatch();
  return (
    <aside className={styles.aside}>
      <label className={styles.aside__label}>Количество пересадок</label>
      <Checkbox
        disabled={loading}
        indeterminate={filtersState.length && filtersState.length < plainOptions.length}
        onChange={() => {
          toggleAll();
          dispatch(filterTickets());
        }}
        checked={filtersState.length === plainOptions.length}
      >
        Все
      </Checkbox>
      <CheckboxGroup
        disabled={loading}
        options={plainOptions}
        value={filtersState}
        onClick={(e) => {
          toggleFilter(e.target.value);
          dispatch(filterTickets());
        }}
        className={styles['ant-checkbox-group']}
      />
    </aside>
  );
}

const mapStateToProps = (state) => ({ filtersState: state.filters.checkboxGroup, loading: state.tickets.loading });
export default connect(mapStateToProps, actions)(AsideFilter);
