import { FormAddToVault } from "../forms/FormAddToVault";

export const AddToVault = ({ shouldRender, addToVault, setAddToVault }) => {
  if (!shouldRender) return null;
  return (
    <>
      <FormAddToVault addToVault={addToVault} setAddToVault={setAddToVault} />
    </>
  );
};
