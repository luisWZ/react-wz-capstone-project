import { Fragment } from 'react';
import PropTypes from 'prop-types';
import { formatMoney } from '../../utils';
import ProductGallery from '../product-gallery/product-gallery.component';
import { CategoryStyles } from '../products-item/products-item.styles';

import {
  AddToCartStyles,
  ButtonWrapperStyles,
  GalleryWrapper,
  GalleryStyles,
  ProductDetailsStyles,
  PriceStyles,
  SkuStyles,
  TagsWrapperStyles,
  TagsStyles,
  SpecsStyles,
  FooterPadding,
  ColumnLeftStyles,
  ColumnRightStyles,
} from './product-details.styles';

function ProductDetails({ product }) {
  console.log(product)
  return product ? (
    <>
      <FooterPadding />
      <ProductDetailsStyles>
        <ColumnLeftStyles>
          <h1>{product.name}</h1>
          <GalleryWrapper>
            <GalleryStyles>
              <ProductGallery gallery={product.gallery} />
              <CategoryStyles>{product.category?.slug}</CategoryStyles>
            </GalleryStyles>
            <PriceStyles>{formatMoney(product.price)}</PriceStyles>
          </GalleryWrapper>
          <SkuStyles>SKU: #{product.sku}</SkuStyles>
          <TagsWrapperStyles>
            {product.tags?.length
              ? product.tags.map((tag) => (
                  <TagsStyles key={tag}>{tag}</TagsStyles>
                ))
              : null}
          </TagsWrapperStyles>
          <p>{product.short_description}</p>
        </ColumnLeftStyles>
        <ColumnRightStyles>
          <ButtonWrapperStyles>
            <AddToCartStyles>Add to cart</AddToCartStyles>
          </ButtonWrapperStyles>
          {product.specs?.length ? (
            <SpecsStyles>
              <h3>Specs:</h3>
              <dl>
                {product.specs.map(({ spec_name, spec_value }) => (
                  <Fragment key={spec_name}>
                    <dt>{spec_name}</dt>
                    <dd>{spec_value}</dd>
                  </Fragment>
                ))}
              </dl>
            </SpecsStyles>
          ) : null}
        </ColumnRightStyles>
      </ProductDetailsStyles>
    </>
  ) : null;
}

ProductDetails.propTypes = {
  product: PropTypes.shape({
    name: PropTypes.string.isRequired,
    gallery: PropTypes.string.isRequired,
    category: PropTypes.shape({
      slug: PropTypes.string,
    }),
    price: PropTypes.string.isRequired,
    sku: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string),
    short_description: PropTypes.string,
    specs: PropTypes.string,
  }),
};

export default ProductDetails;