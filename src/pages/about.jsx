import React from 'react';

import "../styles/style.css";
import mainImage from "../assets/main.png";
import { NavLink } from 'react-router-dom';

function About() {
  return (
    <>
  <header className="header">
    <h1 className="header_text">
      Безопасность в цифровом пространстве
    </h1>
  </header>

  <section className="hero">
    <div className="hero-text">
      <h2>Начните обучение уже сейчас</h2>
      <p>
        Узнайте, как защитить свои персональные данные,
        распознавать фишинг и противостоять социальной инженерии.
      </p>

      <NavLink className="start-btn" to="/scenario_sms">
        Начать обучение
      </NavLink>
    </div>

    <img
      className="hero-image"
      src={mainImage}
      alt="Цифровая безопасность"
    />
  </section>

  <section className="leader-section">
    <div className="leader-card">
      <h2>Просмотрите таблицу лидеров</h2>
      <p>
        Узнайте, кто является лидером, сколько баллов,
        и возможно именно Вы займете его место.
      </p>

      <button className="leader-btn">
        Просмотреть таблицу
      </button>
      <NavLink className="leader-btn" to="/login">
        Логин
      </NavLink>
    </div>
  </section>
</>

  );
}

export default About;
