import { showAlert } from './alert';
import axios from 'axios';
const stripe = Stripe('pk_test_bIXs7upVjezHnhynWdip59zb00d0hyrj2h');

export const bookGame = async (gameId, event) => {
  try {
    if (!gameId) {
      showAlert('error', 'Tournament has ended, Please try for another one');
      event.target.innerHTML = 'Purchase';
      return;
    }
    const session = await axios(
      `http://localhost:2000/api/purchase/checkout-session/${gameId}`
    );

    if (session.data.alreadyPurchased) {
      showAlert('error', 'You have already Purchased the game');
      event.target.innerHTML = 'Purchase';
      return;
    }

    event.target.innerHTML = 'Purchase';
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    event.target.innerHTML = 'Purchase';
    showAlert('error', 'If you are not logged, Please login and try again ');
  }
};
