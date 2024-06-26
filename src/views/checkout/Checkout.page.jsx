import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCartTotal } from 'store/cart';
import {
  useCartEmptyRedirect,
  useDocumentTitle,
  useHideCartDropdownOnPageLoad,
} from 'utils/hooks';
import { formatMoney } from 'utils/helpers';
import CartItem from 'components/CartItem';
import { Input, Textarea } from 'components/forms';
import { Button, Total } from 'components/styles';
import { CheckoutPageStyles, ColumnStyles } from './Checkout.styles';

export default function CheckoutPage() {
  useDocumentTitle('Checkout');
  useHideCartDropdownOnPageLoad();
  useCartEmptyRedirect();

  const { cartItems } = useSelector((state) => state.cart);
  const cartTotal = useSelector(selectCartTotal);

  const [orderInfo, setOrderInfo] = useState({
    name: '',
    email: '',
    postalCode: '',
    notes: '',
  });

  function handleSubmit(evt) {
    evt.preventDefault();
  }

  function handleChange(evt) {
    const { name, value } = evt.target;
    setOrderInfo({
      ...orderInfo,
      [name]: value,
    });
  }

  const { name, email, postalCode, notes } = orderInfo;

  return (
    <CheckoutPageStyles>
      <ColumnStyles>
        <h1>Summary:</h1>
        <form onSubmit={handleSubmit}>
          <Input
            handleChange={handleChange}
            label="Name"
            type="text"
            name="name"
            value={name}
            required
          />
          <Input
            handleChange={handleChange}
            label="Email"
            type="email"
            name="email"
            value={email}
            required
          />
          <Input
            handleChange={handleChange}
            label="Postal Code"
            type="text"
            name="postalCode"
            value={postalCode}
            required
          />
          <Textarea
            handleChange={handleChange}
            label="Notes"
            name="notes"
            value={notes}
          />
          <Button as="button" type="submit">
            Place order
          </Button>
        </form>
      </ColumnStyles>
      <ColumnStyles>
        <Total>
          <span>TOTAL: {formatMoney(cartTotal)}</span>
        </Total>
        {cartItems.map((cartItem) => (
          <CartItem key={cartItem.id} cartItem={cartItem} />
        ))}
      </ColumnStyles>
    </CheckoutPageStyles>
  );
}
