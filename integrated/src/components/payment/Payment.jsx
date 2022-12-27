import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../checkoutForm/CheckoutForm";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import "./payment.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

function Payment({ setOpen, data, alldates, roomId, available}) {
  console.log(roomId)
 
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:8800/payment/config"
        );
        setStripePromise(loadStripe(data.publishableKey));
      } catch (err) {}
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.post(
          "http://localhost:8800/payment/create-payment-intent"
        );
        setClientSecret(data.clientSecret);
      } catch (err) {}
    };
    fetchData();
  }, []);

  return (
    <div className="paymentForm">
      <FontAwesomeIcon
        icon={faCircleXmark}
        className="rClose"
        onClick={() => setOpen(false)}
      />

      {clientSecret && stripePromise && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm data={data} alldates={alldates} roomId={roomId} available={available}/>
        </Elements>
      )}
    </div>
  );
}

export default Payment;
