import { InputToggle } from "../InputToggle";
import "./FormAddToVault.css";

export const FormAddToVault = ({ addToVault, setAddToVault }) => {
  return (
    <div className="form-add-to-vault">
      <div className="form-add-to-vault">
        <p>Add to vault</p>
        <InputToggle onChange={setAddToVault} isChecked={addToVault} />
      </div>
    </div>
  );
};
