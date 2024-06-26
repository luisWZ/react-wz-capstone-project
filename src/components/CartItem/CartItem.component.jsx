import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import {
  decreaseItemQuantity,
  increaseItemQuantity,
  removeItem,
} from 'store/cart';
import { formatMoney } from 'utils/helpers';
import {
  CartItemStyles,
  ImageStyles,
  NameStyles,
  QuantityWrapperStyles,
  QuantityStyles,
  ArrowStyles,
  PriceStyles,
  RemoveStyles,
} from './CartItem.styles';

function CartItem({ cartItem, enableEdition = false }) {
  const { name, price, img, quantity } = cartItem;
  const dispatch = useDispatch();

  const handleItemDecrease = () => dispatch(decreaseItemQuantity(cartItem));
  const handleItemIncrease = () => dispatch(increaseItemQuantity(cartItem));
  const handleRemoveItem = () => dispatch(removeItem(cartItem));

  return cartItem ? (
    <CartItemStyles>
      <ImageStyles>
        <img src={img.url} alt={img.alt ? img.alt : ''} />
      </ImageStyles>
      <NameStyles>
        <span>{name}</span>
      </NameStyles>
      {enableEdition ? (
        <QuantityWrapperStyles>
          <ArrowStyles data-testid="decrease-item" onClick={handleItemDecrease}>
            &#10094;
          </ArrowStyles>
          <QuantityStyles>{quantity}</QuantityStyles>
          <ArrowStyles data-testid="increase-item" onClick={handleItemIncrease}>
            &#10095;
          </ArrowStyles>
        </QuantityWrapperStyles>
      ) : (
        <QuantityStyles>{quantity}</QuantityStyles>
      )}
      <PriceStyles>{formatMoney(price)}</PriceStyles>
      {enableEdition ? (
        <RemoveStyles data-testid="remove-item" onClick={handleRemoveItem}>
          &#10005;
        </RemoveStyles>
      ) : null}
    </CartItemStyles>
  ) : null;
}

CartItem.propTypes = {
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  img: PropTypes.shape({
    url: PropTypes.string.isRequired,
    alt: PropTypes.string,
  }).isRequired,
  quantity: PropTypes.number.isRequired,
};

CartItem.defaultProps = {
  name: '',
  price: 0,
  img: {
    url: '',
  },
  quantity: 0,
};

export default CartItem;
