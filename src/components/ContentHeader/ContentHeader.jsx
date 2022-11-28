import { Radio } from 'antd';
import { connect, useDispatch } from 'react-redux';

import * as actions from '../../redux/filterSlice';
import { filterTickets } from '../../redux/ticketsSlice';

import styles from './ContentHeader.module.scss';

function ContentHeader({ radioState, toggleRadio, loading }) {
  const dispatch = useDispatch();
  return (
    <header className={styles.header}>
      <Radio.Group
        disabled={loading}
        className={styles['radio-group']}
        defaultValue={radioState}
        buttonStyle="solid"
        onChange={(e) => {
          toggleRadio(e.target.value);
          dispatch(filterTickets());
        }}
      >
        <Radio.Button value="cheap">Самый дешевый</Radio.Button>
        <Radio.Button value="fast">Самый быстрый</Radio.Button>
      </Radio.Group>
    </header>
  );
}

const mapStateToProps = (state) => ({ radioState: state.filters.radioGroup, loading: state.tickets.loading });

export default connect(mapStateToProps, actions)(ContentHeader);
