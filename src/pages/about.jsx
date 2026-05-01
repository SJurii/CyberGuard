import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { ShieldAlert, Cpu, Award } from 'lucide-react'; // Импорт премиальных иконок
import mainImage from "../assets/main.png";
import "../styles/style.css";

function About() {
  // Эффект для динамического изменения цвета (перелива) при скролле
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      document.documentElement.style.setProperty("--scroll", scrolled);
    };

    window.addEventListener("scroll", handleScroll);
    // Очистка слушателя при размонтировании компонента
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const userId = localStorage.getItem("userId");
  const isProfile = !!userId;

  return (
    <div className="about-page">
      <header className="header">
        <h1 className="header_text">
          <span className="word-1">Отражай угрозы.</span>
          <span className="word-2"> Превосходи ожидания.</span>
        </h1>
      </header>

      {/* Hero Section: Главный экран */}
      <section className="hero">
        <div className="hero-text">
          <h2>Твой персональный гид по кибербезопасности</h2>
          <p>
            Этот проект создан для того, чтобы превратить сложные правила защиты данных в 
            интерактивное приключение. Мы поможем вам не просто знать теорию, а 
            научиться действовать в реальных ситуациях.
          </p>

          <div className="hero-buttons">
            <NavLink className="start-btn" to="/map">
              Начать обучение
            </NavLink>
            {!isProfile && (
              <NavLink className="secondary-btn" to="/register">
                Создать профиль
              </NavLink>
            )}
          </div>
        </div>

        <div className="hero-image-wrapper">
          <img
            className="hero-image"
            src={mainImage}
            alt="Цифровая безопасность"
          />
        </div>
      </section>

      {/* Features Section: Преимущества с иконками */}
      <section className="about-project">
        <div className="container">
          <h2 className="section-title">О чем этот проект?</h2>
          <div className="features-grid">
            
            <div className="feature-item">
              <ShieldAlert size={42} className="feature-icon" strokeWidth={1.5} />
              <h3>Симуляции</h3>
              <p>Проходите сценарии, основанные на реальных атаках: от SMS-мошенничества до взлома паролей.</p>
            </div>

            <div className="feature-item">
              <Cpu size={42} className="feature-icon" strokeWidth={1.5} />
              <h3>Интерактивы</h3>
              <p>Никаких скучных лекций. Только практика, выбор решений и мгновенная обратная связь.</p>
            </div>

            <div className="feature-item">
              <Award size={42} className="feature-icon" strokeWidth={1.5} />
              <h3>Соревнование</h3>
              <p>Зарабатывайте очки за правильные ответы и поднимайтесь в глобальном рейтинге.</p>
            </div>

          </div>
        </div>
      </section>

      {/* Leaderboard Section: Призыв к действию */}
      <section className="leader-section">
        <div className="leader-card">
          <h2>Станьте лучшим в защите</h2>
          <p>
            Наши пользователи уже предотвратили тысячи виртуальных атак. 
            Проверьте свои силы и займите почетное место в таблице лидеров.
          </p>

          <div className="leader-actions">
            <NavLink className="start-btn" to="/profile/leaderboard">
              Просмотреть таблицу
            </NavLink>
            <span className="or-text">или</span>
            {!isProfile ? (
              <NavLink className="secondary-btn" to="/login">
                Войти в аккаунт
              </NavLink>
            ) : (
              <NavLink className="secondary-btn" to={`/profile/${userId}`}>
                Мой профиль
              </NavLink>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;