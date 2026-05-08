import PortfolioCrudManager from '../../components/admin/PortfolioCrudManager';
import { projectCategoryFallbacks, projectItemFallbacks } from '../../lib/portfolioFallbacks';

export default function ManageProjects() {
  return (
    <PortfolioCrudManager
      contentType="projects"
      itemTable="projects"
      categoryTable="project_categories"
      itemFallbacks={projectItemFallbacks}
      categoryFallbacks={projectCategoryFallbacks}
    />
  );
}
