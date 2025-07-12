import PaymentDescription from "./PaymentDescription";
import UserInformation from "./UserInformation";
import PaymentMethod from "./PaymentMethod";

function PaymentLayout() {
  return (
    <div className="flex-[2]">
      <PaymentDescription />
      <UserInformation />
      <PaymentMethod />
    </div>
  );
}

export default PaymentLayout;
