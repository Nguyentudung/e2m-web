import { useState } from "react";
import profile from "../assets/icons/profile.svg";
import { Button } from "@/components/ui/button";
import ProfileEditModal from "@/components/profile/ProfileEditModal";
import { getUserProfile, saveUserProfile } from "../utils/userStorage";

function ProfilePage() {
  const [profileData, setProfileData] = useState(() => getUserProfile());
  const [isEditing, setIsEditing] = useState(false);

  const hasNickname = profileData.nickname.trim() !== "";

  const handleSaveNickname = (nickname: string) => {
    const updatedProfile = {
      ...profileData,
      nickname,
    };

    saveUserProfile(updatedProfile);
    setProfileData(updatedProfile);
    setIsEditing(false);
  };

  return (
    <section className="flex min-h-[75vh] flex-col items-center justify-center px-6 text-center">
      {hasNickname ? (
        <>
          <h1 className="mb-2 text-2xl font-bold text-text-primary">
            Xin chào, {profileData.nickname}!
          </h1>

          <p className="mb-6 text-sm text-text-secondary">
            Chào mừng bạn quay trở lại Montra.
          </p>

          <Button onClick={() => setIsEditing(true)} size="lg">
            Chỉnh sửa thông tin
          </Button>
        </>
      ) : (
        <>
          <img
            src={profile}
            alt="Cá nhân"
            className="mb-4 h-80 w-80 object-contain"
          />

          <h1 className="mb-6 text-xl font-bold text-text-primary">
            Thông tin cá nhân chưa hoàn thiện
          </h1>

          <Button onClick={() => setIsEditing(true)} size="lg">
            Đặt biệt danh
          </Button>
        </>
      )}

      <ProfileEditModal
        open={isEditing}
        nickname={profileData.nickname}
        onClose={() => setIsEditing(false)}
        onSave={handleSaveNickname}
      />
    </section>
  );
}

export default ProfilePage;
