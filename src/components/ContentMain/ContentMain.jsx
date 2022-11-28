import { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { intlFormat } from 'date-fns';
import { Spin, Alert } from 'antd';

import * as actions from '../../redux/ticketsSlice';
import { fetchTickets } from '../../redux/ticketsSlice';

import styles from './ContentMain.module.scss';

function getTime(value) {
  switch (value) {
    case 0: {
      return '0 пересадок';
    }
    case 1: {
      return '1 пересадка';
    }

    default: {
      return `${value} пересадки`;
    }
  }
}
function ContentMain({ ticketsState, loading }) {
  const dispatch = useDispatch();
  const [tickets, setTickets] = useState([]);
  useEffect(() => {
    dispatch(fetchTickets());
  }, []);

  useEffect(() => {
    setTickets(() => {
      if (!ticketsState.length)
        return (
          <Alert
            message="Билеты не найдены"
            description="Билеты с заданными параметрами не найдены."
            type="info"
            showIcon
          />
        );
      return ticketsState.map((ticket) => {
        const { price, carrier, segments } = ticket;
        return (
          <li className={styles.card} key={`${ticket.carrier}${ticket.price}${Math.random(0, 10000)}`}>
            <header className={styles.card__header}>
              <span className={styles.card__price}>{`${price.toLocaleString('ru-RU')}₽`}</span>
              <img src={`https://pics.avs.io/99/36/${carrier}.png`} alt={`${carrier} logo`} />
            </header>
            <main className={styles.route__wrapper}>
              <ul className={styles.route}>
                {segments.map((segment) => {
                  const { origin, destination, duration, stops, date } = segment;
                  return (
                    <li className={styles.route__item} key={`${origin}${destination}${duration}`}>
                      <div className={styles['route-wrapper']}>
                        <span className={styles.route__header}>{`${origin}-${destination}`}</span>
                        <span>
                          {`${intlFormat(
                            new Date(date),
                            {
                              hour: 'numeric',
                              minute: 'numeric',
                            },
                            {
                              locale: 'ru-RU',
                            }
                          )} - ${intlFormat(
                            new Date(Math.floor(new Date(date).getTime() + duration * 60 * 1000)),
                            {
                              hour: 'numeric',
                              minute: 'numeric',
                            },
                            {
                              locale: 'ru-RU',
                            }
                          )}`}
                        </span>
                      </div>
                      <div className={styles['route-wrapper']}>
                        <span className={styles.route__header}>В пути</span>
                        <span>{`${Math.floor(duration / 60)}ч ${Math.floor(duration % 60)}м`}</span>
                      </div>
                      <div className={styles['route-wrapper']}>
                        <span className={styles.route__header}>{getTime(stops.length)}</span>
                        <span>{stops.length ? stops.join(', ') : 'Без пересадок'}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </main>
          </li>
        );
      });
    });
  }, [ticketsState]);

  return (
    <main className={styles.main}>
      <ul className={styles['cards-list']}>{loading ? <Spin size="large" /> : tickets}</ul>
    </main>
  );
}

const mapStateToProps = (state) => ({ ticketsState: state.tickets.ticketsToDisplay, loading: state.tickets.loading });
export default connect(mapStateToProps, actions)(ContentMain);
