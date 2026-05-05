import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("userData");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Функция для обновления данных профиля (например, баллов) без перезагрузки
const updateProfile = (newData) => {
  setUser(prevUser => {
    const updatedUser = { ...prevUser, ...newData };
    // Важно: обновляем и localStorage, чтобы после F5 баллы не откатились назад
    localStorage.setItem("userData", JSON.stringify(updatedUser));
    return updatedUser;
  });
};

  // 2. Функция входа (вызывается из компонента Login)
  const login = (userData) => {
    // Сохраняем в состояние (React увидит изменения сразу)
    setUser(userData);
    // Дублируем в localStorage (чтобы не вылетело после F5)
    localStorage.setItem("userData", JSON.stringify(userData));
    localStorage.setItem("userToken", userData.token); // Токен часто нужен отдельно для API-запросов
  };

  // 3. Функция выхода
  const logout = () => {
    setUser(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      updateProfile,
      isAdmin: user?.role === 'ADMIN', // Удобный флаг
      isAuthenticated: !!user 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);