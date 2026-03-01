import React from 'react';
import "../styles/style.css";
import mainImage from "../assets/main.png";
import { NavLink } from 'react-router-dom';

function About() {
  return (
    <>
      <header className="header">
        <h1 className="header_text">
          Добро пожаловать в CyberGuard
        </h1>
      </header>

      <section className="hero">
        <div className="hero-text">
          <h2>Твой персональный гид по кибербезопасности</h2>
          <p>
            Этот проект создан для того, чтобы превратить сложные правила защиты данных в 
            интерактивное приключение. Мы поможем вам не просто знать теорию, а 
            научиться действовать в реальных ситуациях.
          </p>

          <div className="hero-buttons">
            <NavLink className="start-btn" to="/scenario_sms">
              Начать обучение
            </NavLink>
            <NavLink className="secondary-btn" to="/register">
              Создать профиль
            </NavLink>
          </div>
        </div>

        <img
          className="hero-image"
          src={mainImage}
          alt="Цифровая безопасность"
        />
      </section>

      {/* Новая секция: О проекте */}
      <section className="about-project">
        <div className="container">
          <h2 className="section-title">О чем этот проект?</h2>
          <div className="features-grid">
            <div className="feature-item">
              <h3>Симуляции</h3>
              <p>Проходите сценарии, основанные на реальных атаках: от SMS-мошенничества до взлома паролей.</p>
            </div>
            <div className="feature-item">
              <h3>Интерактивы</h3>
              <p>Никаких скучных лекций. Только практика, выбор решений и мгновенная обратная связь.</p>
            </div>
            <div className="feature-item">
              <h3>Соревнование</h3>
              <p>Зарабатывайте очки за правильные ответы и поднимайтесь в глобальном рейтинге.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="leader-section">
        <div className="leader-card">
          <h2>Станьте лучшим в защите</h2>
          <p>
            Наши пользователи уже предотвратили тысячи виртуальных атак. 
            Проверьте свои силы и займите почетное место в таблице лидеров.
          </p>

          <div className="leader-actions">
            <NavLink className="leader-btn primary" to="/leaderboard">
              Просмотреть таблицу
            </NavLink>
            <span className="or-text">или</span>
            <NavLink className="link-text" to="/login">
              Войти в аккаунт
            </NavLink>
          </div>
        </div>
      </section>
    </>
  );
}

export default About;