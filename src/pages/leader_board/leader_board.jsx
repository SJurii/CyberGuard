import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../leader_board/leaderboard.module.css';

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const openProfile = (userId) => {
    navigate(`/profile/${userId}`);
  }

  useEffect(() => {
    fetch('http://localhost:8080/api/profile/leaderboard', {
        headers: {
        "Authorization": `Bearer ${localStorage.getItem("userToken")}`
        }
    })
    
      .then(res => res.json())
      .then(data => {
        // Сортируем по очкам на всякий случай, если бэк не отсортировал
        const sortedData = data.sort((a, b) => b.totalPoints - a.totalPoints);
        console.log("Полученные лидеры:", sortedData);
        setLeaders(sortedData);
        setLoading(false);
      })
      .catch(err => {
        console.error("Ошибка загрузки лидеров:", err);
        setLoading(false);
      });
  }, []);

  const getRankIcon = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return index + 1;
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>← Назад</button>
        <h1 className={styles.title}>ЗАЛ СЛАВЫ</h1>
        <p className={styles.subtitle}>Лучшие специалисты по кибербезопасности</p>
      </header>

      <div className={styles.board}>
        <div className={styles.boardHeader}>
          <span>Место</span>
          <span>Пользователь</span>
          <span>Ранг</span>
          <span>Очки</span>
        </div>

        {loading ? (
          <div className={styles.loader}>Загрузка данных из нейросети...</div>
        ) : (
          <div className={styles.list}>
            {leaders.map((user, index) => (
              <div onClick={() => openProfile(user.id)}
                key={user.id} 
                className={`${styles.row} ${index < 3 ? styles[`top-${index + 1}`] : ''}`}
              >
                <div className={styles.rank}>{getRankIcon(index)}</div>
                <div className={styles.userInfo}>
                  <div className={styles.avatar}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className={styles.userName}>{user.name}</span>
                </div>
                <div className={styles.userRankTag}>{user.rank?.name || 'Новичок'}</div>
                <div className={styles.points}>{user.totalPoints.toLocaleString()} XP</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;