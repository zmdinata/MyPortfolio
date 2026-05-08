import PortfolioCrudManager from '../../components/admin/PortfolioCrudManager';
import { honorCategoryFallbacks, honorItemFallbacks } from '../../lib/portfolioFallbacks';

export default function ManageHonors() {
  return (
    <PortfolioCrudManager
      contentType="honors"
      itemTable="honors"
      categoryTable="honor_categories"
      itemFallbacks={honorItemFallbacks}
      categoryFallbacks={honorCategoryFallbacks}
    />
  );
}
