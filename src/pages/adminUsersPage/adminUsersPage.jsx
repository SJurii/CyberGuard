import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Shield, Search } from "lucide-react";
import "./adminUsers.css";

const AdminUsersPage = () => {

  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {

    const token = localStorage.getItem("userToken");

    fetch("http://localhost:8080/api/admin/users", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error(err));

  }, []);

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(search.toLowerCase()) ||
    user.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-users-page">

      <div className="admin-users-container">

        <div className="admin-users-header">

          <div>
            <h1>Управление пользователями</h1>
            <p>Список зарегистрированных агентов системы</p>
          </div>

          <div className="search-box">
            <Search size={18}/>
            <input
              type="text"
              placeholder="Поиск пользователя..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

        </div>

        <div className="users-grid">

          {filteredUsers.map(user => (

            <div
              key={user.id}
              className="user-card-admin"
              onClick={() => navigate(`/profile/${user.id}`)}
            >

              <div className="user-card-top">

                <div className="user-avatar-admin">
                  <User size={28}/>
                </div>

                <div>

                  <h3>{user.name}</h3>

                  <p>{user.email}</p>

                </div>

              </div>

              <div className="user-card-bottom">

                <span className={`role-badge ${user.role === "ADMIN" ? "admin" : ""}`}>
                  {user.role === "ADMIN" && <Shield size={14}/>}
                  {user.role}
                </span>

                <span className="xp-label">
                  {user.totalPoints || 0} XP
                </span>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
};

export default AdminUsersPage;