import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useState } from "react";

import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAxiosSecure from "../Hooks/useAxiosSecure";

const CheckoutForm = ({ session, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError('');

    const card = elements.getElement(CardElement);
    if (!card) return;

    try {
      // Step 1: Create Payment Intent
      const { data } = await axiosSecure.post('/stripe/create-payment-intent', {
        price: session.price,
      });

      // Step 2: Confirm Payment
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card,
            billing_details: {
              name: session.studentName,
              email: session.studentEmail,
            },
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message);
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        // Step 3: Save booking
        const bookingData = {
          sessionId: session._id,
          title: session.title,
          tutorName: session.tutorName,
          tutorEmail: session.tutorEmail,
          studentName: session.studentName,
          studentEmail: session.studentEmail,
          studentPhotoUrl: session.studentPhotoUrl,
          registrationDate: new Date().toISOString(),
          status: "registered",
          sessionType: session.sessionType,
          price: session.price,
          paymentIntentId: paymentIntent.id
        };

        const bookingRes = await axiosSecure.post('/booked-sessions', bookingData);
        
        if (bookingRes.data.insertedId) {
          Swal.fire({
            title: "Success!",
            text: "Payment and booking completed!",
            icon: "success",
            confirmButtonText: "View My Bookings"
          }).then(() => {
            onSuccess();
          });
        }
      }
    } catch (error) {
      console.error("Payment error:", error);
      setError(error.message || "Payment failed");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border p-3 rounded bg-white">
        <CardElement 
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>
      
      {error && <p className="text-red-500 text-sm">{error}</p>}
      
      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
        
        <button
          type="submit"
          disabled={!stripe || processing}
          className={`px-6 py-2 rounded font-medium ${
            processing 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {processing ? 'Processing...' : `Pay $${session.price}`}
        </button>
      </div>
    </form>
  );
};

export default CheckoutForm;