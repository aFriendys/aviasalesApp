import { Button } from 'antd';
import { connect } from 'react-redux';

import * as actions from '../../redux/ticketsSlice';
import logo from '../../images/logo.svg';
import AsideFilter from '../AsideFilter';
import ContentHeader from '../ContentHeader';
import ContentMain from '../ContentMain';

import styles from './App.module.scss';

function App({ loading, addTicketsCount, ticketsCount }) {
  return (
    <div className="App">
      <header className={styles.header}>
        <img src={logo} alt="logo" />
      </header>
      <section className={styles.section}>
        <AsideFilter />
        <div className={styles['content-wrapper']}>
          <ContentHeader />
          <ContentMain />
          <footer className={styles['content-wrapper_footer']}>
            <Button type="primary" disabled={loading || !ticketsCount} onClick={() => addTicketsCount()}>
              Показать еще 5 билетов!
            </Button>
          </footer>
        </div>
      </section>
    </div>
  );
}

const mapStateToProps = (state) => ({
  loading: state.tickets.loading,
  ticketsCount: state.tickets.ticketsToDisplay.length,
});
export default connect(mapStateToProps, actions)(App);
