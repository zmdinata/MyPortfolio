import PortfolioCrudManager from '../../components/admin/PortfolioCrudManager';
import { certificateCategoryFallbacks, certificateItemFallbacks } from '../../lib/portfolioFallbacks';

export default function ManageCertificates() {
  return (
    <PortfolioCrudManager
      contentType="certificates"
      itemTable="certificates"
      categoryTable="certificate_categories"
      itemFallbacks={certificateItemFallbacks}
      categoryFallbacks={certificateCategoryFallbacks}
    />
  );
}
