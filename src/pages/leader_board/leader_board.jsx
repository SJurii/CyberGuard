import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Crown, Award, Medal } from 'lucide-react';
import styles from './leaderboard.module.css';

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Единство фона со скроллом
    const handleScroll = () => {
      const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      document.documentElement.style.setProperty("--scroll", scrolled || 0);
    };
    window.addEventListener("scroll", handleScroll);
    
    fetch('http://localhost:8080/api/profile/leaderboard', {
      headers: { "Authorization": `Bearer ${localStorage.getItem("userToken")}` }
    })
      .then(res => res.json())
      .then(data => {
        setLeaders(data.sort((a, b) => b.totalPoints - a.totalPoints));
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getRankContent = (index) => {
    if (index === 0) return <Crown color="#ffd700" size={28} />;
    if (index === 1) return <Medal color="#c0c0c0" size={24} />;
    if (index === 2) return <Award color="#cd7f32" size={24} />;
    return <span className={styles.rankNumber}>{index + 1}</span>;
  };

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        <ChevronLeft size={20} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
        Назад
      </button>

      <header className={styles.header}>
        <h1 className={styles.title}>ЗАЛ СЛАВЫ</h1>
        <p className={styles.subtitle}>Элита киберзащиты</p>
      </header>

      <div className={styles.board}>
        <div className={styles.boardHeader}>
          <span>#</span>
          <span>Оперативник</span>
          <span>Ранг</span>
          <span style={{ textAlign: 'right' }}>Опыт</span>
        </div>

        {loading ? (
          <div className={styles.loader}>Синхронизация данных...</div>
        ) : (
          <div className={styles.list}>
            {leaders.map((user, index) => (
              <div 
                onClick={() => navigate(`/profile/${user.id}`)}
                key={user.id} 
                className={`${styles.row} ${index < 3 ? styles.topRow : ''} ${styles[`top-${index + 1}`]}`}
              >
                <div className={styles.rank}>{getRankContent(index)}</div>
                
                <div className={styles.userInfo}>
                  <div className={styles.avatar}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className={styles.userName}>{user.name}</span>
                </div>

                <div className={styles.userRankTag}>{user.rank?.name || 'Новичок'}</div>
                
                <div className={styles.points}>
                  {user.totalPoints.toLocaleString()} <span style={{ fontSize: '12px', color: '#64748b' }}>XP</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;