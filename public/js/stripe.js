import { showAlert } from './alert';
import axios from 'axios';
const stripe = Stripe('pk_test_bIXs7upVjezHnhynWdip59zb00d0hyrj2h');

export const bookGame = async (gameId) => {
  try {
    const session = await axios(
      `http://localhost:2000/api/purchase/checkout-session/${gameId}`
    );
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    showAlert('error', 'If you are not logged, Please login and try again ');
  }
};
