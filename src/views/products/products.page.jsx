import { useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';

import { fetchProducts } from '../../store/products';
import { useDocumentTitle, useIsPageLoading } from '../../utils/hooks';
import ProductFilters from '../../components/product-filters/product-filters.component';
import Products from '../../components/products/products.components';
import Spinner from '../../components/spinner/spinner.component';
import Pagination from '../../components/pagination/pagination.component';

import {
  ContentStyles,
  FlexStyles,
  ProductListPageStyles,
} from './products.page.styles';

export default function ProductsPage() {
  useDocumentTitle('Products');

  const history = useHistory();
  const { search, state } = useLocation();
  const searchParams = useMemo(() => new URLSearchParams(search), [search]);

  const [filters, setFilters] = useState({});
  const [categories, setCategories] = useState([]);
  const [activeCategories, setActiveCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [fetchArgs, setFetchArgs] = useState([]);

  const dispatch = useDispatch();
  useEffect(() => {
    const controller = new AbortController();
    dispatch(fetchProducts(controller, ...fetchArgs));

    return () => {
      controller.abort();
    };
  }, [dispatch, fetchArgs]);

  const {
    products,
    pagination,
    isLoading: isProductsLoading,
  } = useSelector((state) => state.products);

  const { categories: categoriesData, isLoading: isCategoriesLoading } =
    useSelector((state) => state.categories);

  useEffect(() => {
    if (state?.paginationLink) {
      setFetchArgs(['pagination', state.paginationLink]);
    }
  }, [state]);

  // set categories after fetching categories
  useEffect(() => {
    if (!isCategoriesLoading) {
      setCategories(categoriesData.map(({ category: { name } }) => name));
    }
  }, [categoriesData, isCategoriesLoading]);

  // set filters after setting categories
  useEffect(() => {
    setFilters(
      categories.reduce((categories, category) => {
        return { ...categories, [category]: false };
      }, {})
    );
  }, [categories]);

  // set active categories after setting filters
  useEffect(() => {
    setActiveCategories(() =>
      categories.filter((category) => filters[category])
    );
  }, [categories, filters, searchParams]);

  // set filters, if route has query params
  useEffect(() => {
    const categoriesSearch = searchParams.get('category');
    if (categoriesSearch) {
      setFilters({
        ...categories.reduce((categories, category) => {
          return { ...categories, [category]: false };
        }, {}),
        ...categoriesSearch?.split(',').reduce((categories, category) => {
          return { ...categories, [category]: true };
        }, {}),
      });
    }
  }, [searchParams, categories]);

  // update filtered products
  // SHOULD call to API with filters,
  // instead of filtering products
  useEffect(() => {
    if (activeCategories.length) {
      const updatedProducts = products?.filter(({ product }) => {
        const { slug } = product.category;
        return activeCategories
          .map((category) => category.toLowerCase())
          .includes(slug.toLowerCase());
      });
      setFilteredProducts(updatedProducts);
    } else {
      setFilteredProducts(products);
    }
  }, [products, activeCategories, history, state]);

  useEffect(() => {
    const search = activeCategories.length
      ? `?category=${encodeURIComponent(activeCategories.join(','))}`
      : '';

    history.replace({
      search,
      state,
    });
  }, [activeCategories, history, state]);

  const setAllFiltersToFalse = () => {
    history.replace({
      search: '',
      state,
    });

    setFilters(
      categories.reduce((categories, category) => {
        return { ...categories, [category]: false };
      }, {})
    );
  };

  const handleChange = ({ target: { name, checked } }) => {
    setFilters((prevFilters) => {
      return {
        ...prevFilters,
        [name]: !prevFilters[name],
      };
    });
  };

  const isPageLoading = useIsPageLoading(
    isCategoriesLoading,
    isProductsLoading
  );

  return isPageLoading ? (
    <Spinner />
  ) : (
    <ProductListPageStyles>
      <h1>Our Products</h1>
      <FlexStyles>
        <ProductFilters
          filters={filters}
          handleChange={handleChange}
          setAllFiltersToFalse={setAllFiltersToFalse}
        />
        <ContentStyles>
          <Products products={filteredProducts} />
          {filteredProducts?.length ? (
            <Pagination pagination={pagination} />
          ) : null}
        </ContentStyles>
      </FlexStyles>
    </ProductListPageStyles>
  );
}