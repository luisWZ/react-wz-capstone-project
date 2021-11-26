import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  useDocumentTitle,
  useFetchFeaturedBanners,
  useFetchProducts,
  useIsPageLoading,
} from 'utils/hooks';
import FeaturedBanners from 'components/FeaturedBanners';
import ProductCategories from 'components/ProductCategories';
import Products from 'components/Products';
import Spinner from 'components/Spinner';
import { CTA } from 'components/styles';

export default function HomePage() {
  useDocumentTitle();

  const { categories, isLoading: isProductCategoriesLoading } = useSelector(
    (state) => state.categories
  );

  const { featuredBanners: banners, isLoading: isFeaturedBannersLoading } =
    useFetchFeaturedBanners();

  const { products, isLoading: isFeaturedProductsLoading } =
    useFetchProducts('featured');

  const isPageLoading = useIsPageLoading(
    isFeaturedBannersLoading,
    isProductCategoriesLoading,
    isFeaturedProductsLoading
  );

  return isPageLoading ? (
    <Spinner />
  ) : (
    <>
      <FeaturedBanners banners={banners} />
      <ProductCategories categories={categories} />
      <CTA as={Link} to="/products">
        View all products
      </CTA>
      <Products products={products} featured={true} />
    </>
  );
}
