import { SpinnerMedium } from "../../../../components/Spinner";

function VerifingDialog() {
  return (
    <div className="bg-neutral-800 h-screen flex justify-center py-60 px-5">
      <div className="flex flex-col items-center gap-6 max-h-[200px] justify-center max-w-[400px] w-full bg-neutral-50 rounded-md px-6 py-8">
        <SpinnerMedium />
        <p>Verifing payment...</p>
      </div>
    </div>
  );
}

export default VerifingDialog;
