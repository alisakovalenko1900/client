import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProfileSelection.css";

interface Profile {
  id: number;
  name: string;
  avatar_url: string;
}

interface ProfileSelectionProps {
  onSelectProfile: () => void;
}

const ProfileSelection: React.FC<ProfileSelectionProps> = ({
  onSelectProfile,
}) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeProfile, setActiveProfile] = useState<Profile | null>(null);
  const [showInput, setShowInput] = useState(false); // Управление отображением инпута
  const [newProfileName, setNewProfileName] = useState(""); // Новое имя профиля
  const userId = 4; // Пример ID пользователя, заменить на реальный из авторизации

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/profiles/${userId}`
        );
        setProfiles(response.data);
        if (response.data.length > 0) setActiveProfile(response.data[0]);
      } catch (err) {
        console.error("Ошибка загрузки профилей:", err);
      }
    };

    fetchProfiles();
  }, []);

  const handleProfileSwitch = (profile: Profile) => {
    setActiveProfile(profile);
    onSelectProfile(); // Установка выбранного профиля
    alert(`Вы переключились на профиль: ${profile.name}`);
  };

  const handleAddProfile = async () => {
    if (newProfileName.trim()) {
      try {
        const response = await axios.post("http://localhost:3001/profiles", {
          userId,
          name: newProfileName,
        });
        setProfiles((prev) => [...prev, response.data]); // Добавляем новый профиль
        setNewProfileName("");
        setShowInput(false); // Скрываем инпут
      } catch (err) {
        console.error("Ошибка добавления профиля:", err);
      }
    }
  };

  return (
    <div className="profile-selection-container">
      <h1>Выбор профиля</h1>
      <div className="profiles-list">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className={`profile-card ${
              activeProfile?.id === profile.id ? "active" : ""
            }`}
            onClick={() => handleProfileSwitch(profile)}
          >
            <img
              src={profile.avatar_url || "default-avatar.png"}
              alt={profile.name}
              className="profile-avatar"
            />
            <p>{profile.name}</p>
          </div>
        ))}
        {!showInput ? (
          <button className="add-button" onClick={() => setShowInput(true)}>
            +
          </button>
        ) : (
          <div className="input-container">
            <input
              type="text"
              className="profile-input"
              placeholder="Введите имя профиля"
              value={newProfileName}
              onChange={(e) => setNewProfileName(e.target.value)}
            />
            <button className="add-profile-button" onClick={handleAddProfile}>
              Добавить
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSelection;
