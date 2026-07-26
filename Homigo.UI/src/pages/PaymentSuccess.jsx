import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    console.log(sessionId);

    toast.success("Payment completed successfully!");

    setTimeout(() => {
      navigate("/my-orders");
    }, 2000);
  }, []);

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="rounded-2xl bg-white p-10 shadow text-center">
        <h1 className="text-3xl font-bold text-green-600">
          Payment Successful 🎉
        </h1>

        <p className="mt-4 text-slate-600">
          Redirecting to My Orders...
        </p>
      </div>
    </div>
  );
}

export default PaymentSuccess;