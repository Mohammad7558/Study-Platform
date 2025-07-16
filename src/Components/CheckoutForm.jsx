import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import { toast } from "sonner";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { Button } from "../Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../Components/ui/card";

const CheckoutForm = ({ session, onSuccess, onError, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();

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
        toast.error("Payment Error", {
          description: stripeError.message
        });
        throw new Error(stripeError.message);
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
          toast.success("Payment Successful", {
            description: "Your booking has been confirmed"
          });
          onSuccess();
        }
      }
    } catch (error) {
      console.error("Payment error:", error);
      setError(error.message || "Payment failed");
      onError();
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Payment Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="border p-4 rounded-lg bg-muted">
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
          
          {error && (
            <div className="text-red-500 text-sm p-2 bg-red-50 rounded-md">
              {error}
            </div>
          )}
          
          <div className="flex justify-between items-center pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={processing}
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              disabled={!stripe || processing}
              className="ml-auto"
            >
              {processing ? 'Processing...' : `Pay $${session.price}`}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CheckoutForm;