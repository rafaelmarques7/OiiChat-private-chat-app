import { FormAddToVault } from "../forms/FormAddToVault";
import "./AddToVault.css";

export const AddToVault = ({
  shouldRender,
  addToVault,
  setAddToVault,
  password,
  setPassword,
}) => {
  if (!shouldRender) return null;
  return (
    <div className="container-add-to-vault">
      <FormAddToVault addToVault={addToVault} setAddToVault={setAddToVault} />
      {addToVault && (
        <>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div>Note:</div>
          <div className="vault-pass-note">
            The password of the room is encrypted using <b>your</b> password
            before being sent to the server. This prevents us from being able to
            read your messages.
          </div>
        </>
      )}
    </div>
  );
};
