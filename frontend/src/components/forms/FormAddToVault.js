import { InputToggle } from "../InputToggle";
import "./FormAddToVault.css";

export const FormAddToVault = ({ addToVault, setAddToVault }) => {
  return (
    <div className="form-input-container">
      <img src={"/img/visibility.svg"} alt="" className="form-input-icon" />
      <div className="form-add-to-vault">
        <p>Add to vault</p>
        <InputToggle onChange={setAddToVault} isChecked={addToVault} />
      </div>
    </div>
  );
};
