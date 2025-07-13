import { Link } from "react-router";

const PaymentSuccess = () => {
  return (
    <div className="max-w-xl mx-auto text-center mt-20 p-8 bg-white rounded-lg shadow">
      <h2 className="text-3xl font-bold text-green-600 mb-4">🎉 Payment Successful!</h2>
      <p className="text-gray-700 mb-6">
        Your session has been booked successfully.
      </p>
      <Link 
        to="/my-bookings"
        className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded inline-block"
      >
        View My Bookings
      </Link>
    </div>
  );
};

export default PaymentSuccess;