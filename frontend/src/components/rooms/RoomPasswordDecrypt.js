import { PasswordValidationForm } from "../PasswordValidationForm";

export const RoomPasswordDecrypt = ({ userData, isEncrypted, callback }) => {
  if (!isEncrypted) return null;

  return (
    <div>
      <div>The rooms password loaded from your vault is encrypted</div>
      <div>Please enter your password to decrypt the room and its messages</div>

      <PasswordValidationForm userData={userData} callback={callback} />
    </div>
  );
};
