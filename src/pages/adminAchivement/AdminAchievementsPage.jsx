import React, { useState } from "react";
import { Trophy, Save, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./adminAchievements.css";

const AdminAchievementsPage = () => {

  const navigate = useNavigate();

  const [achievement, setAchievement] = useState({
    achievementName: "",
    title: "",
    description: "",
    iconName: "",
    minPointer: 0
  });

  const handleSave = async () => {

    const token = localStorage.getItem("userToken");

    try {

      const response = await fetch("http://localhost:8080/api/admin/achievements", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(achievement)
      });

      if (response.ok) {

        alert("Достижение успешно добавлено!");

        setAchievement({
          achievementName: "",
          title: "",
          description: "",
          iconName: "",
          minPointer: 0
        });

      } else {

        const error = await response.text();
        alert(error);

      }

    } catch (e) {

      console.error(e);
      alert("Ошибка соединения");

    }
  };

  return (
    <div className="admin-ach-page">

      <div className="admin-ach-card">

        <div className="admin-ach-header">

          <button
            className="back-btn-admin"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft size={18}/>
          </button>

          <div>
            <h1>Добавление достижения</h1>
            <p>Создание нового достижения для системы CyberGuard</p>
          </div>

        </div>

        <div className="admin-ach-form">

          <div className="input-group">
            <label>Название иконки (Lucide)</label>
            <input
              type="text"
              placeholder="ShieldCheck"
              value={achievement.achievementName}
              onChange={(e) =>
                setAchievement({
                  ...achievement,
                  achievementName: e.target.value
                })
              }
            />
          </div>

          <div className="input-group">
            <label>Заголовок</label>
            <input
              type="text"
              placeholder="Анти-Фишер"
              value={achievement.title}
              onChange={(e) =>
                setAchievement({
                  ...achievement,
                  title: e.target.value
                })
              }
            />
          </div>

          <div className="input-group">
            <label>Описание</label>
            <textarea
              placeholder="Успешно отражена первая SMS атака"
              value={achievement.description}
              onChange={(e) =>
                setAchievement({
                  ...achievement,
                  description: e.target.value
                })
              }
            />
          </div>

          <div className="input-group">
            <label>Lucide Icon</label>
            <input
              type="text"
              placeholder="MessageSquareShield"
              value={achievement.iconName}
              onChange={(e) =>
                setAchievement({
                  ...achievement,
                  iconName: e.target.value
                })
              }
            />
          </div>

          <div className="input-group">
            <label>Минимум XP</label>
            <input
              type="number"
              placeholder="100"
              value={achievement.minPointer}
              onChange={(e) =>
                setAchievement({
                  ...achievement,
                  minPointer: Number(e.target.value)
                })
              }
            />
          </div>

          <button className="save-ach-btn" onClick={handleSave}>
            <Save size={18}/>
            Добавить достижение
          </button>

        </div>

      </div>

    </div>
  );
};

export default AdminAchievementsPage;