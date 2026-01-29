import React from 'react';

import "../styles/style.css";
import mainImage from "../assets/image.png";
import { NavLink } from 'react-router-dom';

function About() {
  return (
    <>
      <header className="header">
        <h1 className="header_text">
          Безопасность в цифровом пространстве
        </h1>
      </header>

      <img
        className="image-main"
        src={mainImage}
        alt="Цифровая безопасность"
      />

      <main className="main-container">
        <div className="start-learning-block">
          <h2>Начните обучение уже сейчас</h2>
          <p>
            Узнайте, как защитить свои персональные данные,
            распознавать фишинг и противостоять социальной инженерии.
          </p>
          <NavLink 
            className="start-btn" 
            to="/scenario_sms">
              Начать обучение
          </NavLink>
        </div>

        <div className="side-text">
          <p>
            Цифровая гигиена — это набор навыков,
            необходимых каждому пользователю интернета.
            Даже простые знания могут защитить от потери данных и денег.
          </p>
        </div>
      </main>

      <main className="main-container">
        <div className="side-text-leader">
          <p>
            Цифровая гигиена — это набор навыков,
            необходимых каждому пользователю интернета.
            Даже простые знания могут защитить от потери данных и денег.
          </p>
        </div>

        <div className="show-leader-block">
          <h2>Просмотрите таблицу лидеров</h2>
          <p>
            Узнайте, кто является лидером,
            сколько баллов, и возможно именно Вы займете его место.
          </p>
          <button className="leader-btn">
            Просмотреть таблицу
          </button>
        </div>
      </main>
    </>
  );
}

export default About;
