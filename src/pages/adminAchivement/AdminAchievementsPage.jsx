import React, { useState } from "react";
import { Trophy, Save, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./adminAchievements.css";

const AdminAchievementsPage = () => {

  const navigate = useNavigate();
  const [allAchievements, setAllAchievements] = useState([]);
    const [searchAchievement, setSearchAchievement] = useState("");
    const [showAchievementList, setShowAchievementList] = useState(false);

    const [isEditMode, setIsEditMode] = useState(false);
    const [editingAchievementId, setEditingAchievementId] = useState(null);

  const [achievement, setAchievement] = useState({
    achievementName: "",
    title: "",
    description: "",
    iconName: "",
    minPointer: 0
  });

  const fetchAchievements = async () => {

    try {

        const token = localStorage.getItem("userToken");

        const response = await fetch(
        "http://localhost:8080/api/achievements",
        {
            headers: {
            Authorization: `Bearer ${token}`
            }
        }
        );

        if (response.ok) {

        const data = await response.json();

        setAllAchievements(data);

        }

        } catch (e) {
            console.error(e);
        }
    };

    const handleEditAchievement = (achievement) => {

    setIsEditMode(true);

    setEditingAchievementId(achievement.id);

    setAchievement({
        achievementName: achievement.achievementName || "",
        title: achievement.title || "",
        description: achievement.description || "",
        iconName: achievement.iconName || "",
        minPointer: achievement.minPointer || 0
    });

    setShowAchievementList(false);
    };

    const handleUpdateAchievement = async () => {

  try {

    const token = localStorage.getItem("userToken");

    const response = await fetch(
  `http://localhost:8080/api/achievements/${editingAchievementId}`,
      {
        method: "PUT",

        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },

        body: JSON.stringify(achievement)
      }
    );

    if (response.ok) {

      alert("Достижение обновлено");

      setIsEditMode(false);

      setEditingAchievementId(null);

      fetchAchievements();

    } else {

      alert("Ошибка обновления");
    }

  } catch (e) {

    console.error(e);

    alert("Ошибка сервера");
  }
};

  const handleSave = async () => {

    const token = localStorage.getItem("userToken");

    try {

      const response = await fetch("http://localhost:8080/api/achievements", {
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
            <h1>    
            {
                isEditMode
                ? "Редактирование достижения"
                : "Добавление достижения"
            }
            </h1>
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

          <button
            className="save-ach-btn"
            onClick={
                isEditMode
                ? handleUpdateAchievement
                : handleSave
            }
            >
            <Save size={18}/>
                    {
                isEditMode
                    ? "Обновить достижение"
                    : "Добавить достижение"
                }
          </button>
          <button
            className="admin-btn"
            onClick={() => {
                setShowAchievementList(true);
                fetchAchievements();
            }}
            >
            Редактировать достижения
            </button>

            {showAchievementList && (

                <div className="admin-modal-overlay">

                    <div className="admin-editor-card">

                    <div className="modal-header">

                        <h3>Редактирование достижений</h3>

                        <button
                        onClick={() => setShowAchievementList(false)}
                        className="close-modal-btn"
                        >
                        ✕
                        </button>

                    </div>

                    <div className="modal-body">

                        <input
                        type="text"
                        placeholder="Поиск достижения..."
                        value={searchAchievement}
                        onChange={(e) => setSearchAchievement(e.target.value)}
                        className="search-input"
                        />

                        <div className="scenario-list">

                        {allAchievements
                            .filter((a) =>
                            a.title
                                ?.toLowerCase()
                                .includes(searchAchievement.toLowerCase())
                            )
                            .map((achievement) => (

                            <div
                                key={achievement.id}
                                className="scenario-list-item"
                                onClick={() => handleEditAchievement(achievement)}
                            >
                                <h4>{achievement.title}</h4>

                                <p>{achievement.minPointer} XP</p>
                            </div>

                            ))}

                        </div>

                    </div>

                    </div>

                </div>
                )}

        </div>

      </div>

    </div>
  );
};

export default AdminAchievementsPage;