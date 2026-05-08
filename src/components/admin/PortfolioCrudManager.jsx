import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../lib/supabase';
import {
  FiEdit2,
  FiExternalLink,
  FiImage,
  FiPlus,
  FiRefreshCw,
  FiSave,
  FiSearch,
  FiStar,
  FiTrash2,
  FiUpload,
  FiX,
} from 'react-icons/fi';
import CustomSelect from './CustomSelect';
import {
  allCategoryIconNames,
  CategoryIcon,
  commonCategoryIcons,
  normalizeIconName,
} from '../../lib/categoryIcons';
import {
  buildStorageFolder,
  deletePortfolioFileByUrl,
  fetchLinkPreview,
  getDisplayType,
  getFileForItem,
  getPreviewForItem,
  isLinkType,
  normalizeLinkUrl,
  portfolioItemTypes,
  uploadPortfolioFile,
} from '../../lib/portfolioMedia';
import { mergePortfolioCategories, mergePortfolioItems } from '../../lib/portfolioFallbacks';
import '../../styles/pages/admin-manage.css';

const blankCategory = {
  slug: '',
  name_en: '',
  name_id: '',
  icon_name: 'folder',
  sort_order: 0,
};

const typeLabels = {
  pdf: 'PDF Document',
  image: 'Image',
  link: 'Link',
};

const contentLabels = {
  projects: {
    singular: 'Project',
    plural: 'Projects',
    titleColumns: ['Title (EN/ID)', 'Category', 'Type', 'Featured', 'Actions'],
  },
  certificates: {
    singular: 'Certificate',
    plural: 'Certificates',
    titleColumns: ['Title', 'Category', 'Type', 'Actions'],
  },
  honors: {
    singular: 'Honor',
    plural: 'Honors',
    titleColumns: ['Title (EN/ID)', 'Category', 'Type', 'Actions'],
  },
};

function getBlankItem(contentType, firstCategoryId = '') {
  if (contentType === 'projects') {
    return {
      id_string: '',
      category_id: firstCategoryId,
      title_en: '',
      title_id: '',
      file: '',
      preview: '',
      type: 'pdf',
      is_featured: false,
      featured_order: '',
      sort_order: 0,
    };
  }

  if (contentType === 'certificates') {
    return {
      category_id: firstCategoryId,
      title: '',
      file_path: '',
      preview_path: '',
      type: 'pdf',
      sort_order: 0,
    };
  }

  return {
    category_id: firstCategoryId,
    title_en: '',
    title_id: '',
    file_path: '',
    preview_path: '',
    image_path: '',
    type: 'image',
    sort_order: 0,
  };
}

function itemTitle(item, contentType, lang = 'en') {
  if (contentType === 'certificates') return item.title || '';
  return lang === 'id' ? item.title_id || item.title_en || '' : item.title_en || item.title_id || '';
}

function categoryLabel(category) {
  if (!category) return 'Uncategorized';
  return category.name_en || category.name_id || category.slug || 'Uncategorized';
}

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value || ''));
}

function getStaticSourceKey(formData) {
  if (formData.source_key) return formData.source_key;
  if (formData.id && !isUuid(formData.id)) return `static:${formData.id}`;
  return null;
}

function resolveCategory(formData, categories) {
  const category = categories.find((item) => (
    item.id === formData.category_id ||
    item.slug === formData.category_id ||
    item.slug === formData.category
  ));

  return {
    id: isUuid(category?.id) ? category.id : null,
    slug: category?.slug || formData.category || formData.category_id || null,
  };
}

function makeItemPayload(formData, contentType, categories) {
  const type = getDisplayType(formData.type);
  const category = resolveCategory(formData, categories);
  const sourceKey = getStaticSourceKey(formData);

  if (contentType === 'projects') {
    return {
      source_key: sourceKey,
      id_string: formData.id_string || null,
      category_id: category.id,
      category: category.slug,
      title_en: formData.title_en.trim(),
      title_id: formData.title_id.trim(),
      file: type === 'link' ? normalizeLinkUrl(formData.file) : formData.file.trim(),
      preview: formData.preview.trim() || null,
      type,
      is_featured: Boolean(formData.is_featured),
      featured_order: formData.is_featured && formData.featured_order !== '' ? Number(formData.featured_order) : null,
      sort_order: Number(formData.sort_order) || 0,
    };
  }

  if (contentType === 'certificates') {
    return {
      source_key: sourceKey,
      category_id: category.id,
      title: formData.title.trim(),
      file_path: type === 'link' ? normalizeLinkUrl(formData.file_path) : formData.file_path.trim(),
      preview_path: formData.preview_path.trim() || null,
      type,
      sort_order: Number(formData.sort_order) || 0,
    };
  }

  const filePath = type === 'link' ? normalizeLinkUrl(formData.file_path) : formData.file_path.trim();
  const previewPath = formData.preview_path.trim() || (type === 'image' ? filePath : null);

  return {
    source_key: sourceKey,
    category_id: category.id,
    title_en: formData.title_en.trim(),
    title_id: formData.title_id.trim(),
    file_path: filePath,
    preview_path: previewPath,
    image_path: previewPath || filePath,
    type,
    sort_order: Number(formData.sort_order) || 0,
  };
}

function getItemFileField(contentType) {
  return contentType === 'projects' ? 'file' : 'file_path';
}

function getItemPreviewField(contentType) {
  return contentType === 'projects' ? 'preview' : 'preview_path';
}

export default function PortfolioCrudManager({
  contentType,
  itemTable,
  categoryTable,
  itemFallbacks,
  categoryFallbacks,
}) {
  const label = contentLabels[contentType];
  const [activeTab, setActiveTab] = useState('items');
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [itemForm, setItemForm] = useState(getBlankItem(contentType));
  const [categoryForm, setCategoryForm] = useState(blankCategory);
  const [editingItemId, setEditingItemId] = useState(null);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savingFeaturedId, setSavingFeaturedId] = useState('');
  const [uploading, setUploading] = useState('');
  const [previewLoading, setPreviewLoading] = useState(false);
  const [iconSearch, setIconSearch] = useState('');

  const categoryMap = useMemo(
    () => new Map(categories.flatMap((category) => [[category.id, category], [category.slug, category]])),
    [categories]
  );

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      if (contentType === 'projects' && a.is_featured !== b.is_featured) {
        return a.is_featured ? -1 : 1;
      }
      return (a.sort_order ?? 999) - (b.sort_order ?? 999);
    });
  }, [contentType, items]);

  const filteredItems = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) return sortedItems;

    return sortedItems.filter((item) => {
      const values = [
        item.title,
        item.title_en,
        item.title_id,
        item.id_string,
        categoryLabel(categoryMap.get(item.category_id)),
        item.type,
      ];

      return values.some((value) => String(value || '').toLowerCase().includes(query));
    });
  }, [categoryMap, searchTerm, sortedItems]);

  const filteredIcons = useMemo(() => {
    const base = iconSearch
      ? allCategoryIconNames.filter((name) => name.includes(iconSearch.toLowerCase().trim()))
      : commonCategoryIcons;

    return base.slice(0, iconSearch ? 72 : commonCategoryIcons.length);
  }, [iconSearch]);

  const firstCategoryId = categories[0]?.id || '';

  const fetchData = async () => {
    setLoading(true);

    const [{ data: categoryData, error: categoryError }, { data: itemData, error: itemError }] =
      await Promise.all([
        supabase.from(categoryTable).select('*').order('sort_order', { ascending: true }),
        supabase.from(itemTable).select('*').order('sort_order', { ascending: true }),
      ]);

    if (categoryError) console.error(`Error fetching ${categoryTable}:`, categoryError);
    if (itemError) console.error(`Error fetching ${itemTable}:`, itemError);

    const nextCategories = mergePortfolioCategories(
      !categoryError ? categoryData || [] : [],
      categoryFallbacks
    );
    const nextItems = mergePortfolioItems(
      !itemError ? itemData || [] : [],
      itemFallbacks,
      nextCategories,
      contentType
    );

    setCategories(nextCategories || []);
    setItems(nextItems || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [categoryTable, itemTable]);

  const openItemModal = (item = null) => {
    if (item) {
      setItemForm({
        ...getBlankItem(contentType, item.category_id || firstCategoryId),
        ...item,
        type: getDisplayType(item.type),
        file_path: item.file_path || item.image_path || '',
        preview_path: item.preview_path || item.image_path || '',
        featured_order: item.featured_order ?? '',
      });
      setEditingItemId(item.id);
    } else {
      setItemForm(getBlankItem(contentType, firstCategoryId));
      setEditingItemId(null);
    }

    setItemModalOpen(true);
  };

  const openCategoryModal = (category = null) => {
    if (category) {
      setCategoryForm({
        slug: category.slug || '',
        name_en: category.name_en || '',
        name_id: category.name_id || '',
        icon_name: normalizeIconName(category.icon_name || 'folder'),
        sort_order: category.sort_order ?? 0,
      });
      setEditingCategoryId(category.id);
    } else {
      setCategoryForm(blankCategory);
      setEditingCategoryId(null);
    }

    setIconSearch('');
    setCategoryModalOpen(true);
  };

  const deleteItem = async (item) => {
    if (!window.confirm(`Delete this ${label.singular.toLowerCase()}?`)) return;

    if (!isUuid(item.id)) {
      setItems((current) => current.filter((candidate) => candidate.id !== item.id));
      return;
    }

    const { error } = await supabase.from(itemTable).delete().eq('id', item.id);
    if (error) {
      alert(error.message);
      return;
    }

    fetchData();
  };

  const deleteCategory = async (category) => {
    if (!window.confirm(`Delete category "${categoryLabel(category)}"? Existing items will become uncategorized.`)) return;

    if (!isUuid(category.id)) {
      setCategories((current) => current.filter((candidate) => candidate.id !== category.id));
      return;
    }

    const { error } = await supabase.from(categoryTable).delete().eq('id', category.id);
    if (error) {
      alert(error.message);
      return;
    }

    fetchData();
  };

  const submitCategory = async (event) => {
    event.preventDefault();
    setSaving(true);

    const payload = {
      slug: categoryForm.slug.trim().toLowerCase().replace(/\s+/g, '-'),
      name_en: categoryForm.name_en.trim(),
      name_id: categoryForm.name_id.trim(),
      icon_name: normalizeIconName(categoryForm.icon_name),
      sort_order: Number(categoryForm.sort_order) || 0,
    };

    const request = editingCategoryId && isUuid(editingCategoryId)
      ? supabase.from(categoryTable).update(payload).eq('id', editingCategoryId)
      : supabase.from(categoryTable).insert([payload]);

    const { error } = await request;
    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    setCategoryModalOpen(false);
    fetchData();
  };

  const submitItem = async (event) => {
    event.preventDefault();
    setSaving(true);

    if (contentType === 'projects' && itemForm.is_featured) {
      const featuredCount = items.filter((item) => item.is_featured && item.id !== editingItemId).length;
      if (featuredCount >= 3) {
        setSaving(false);
        alert('Only 3 featured projects are allowed. Unpin one project first.');
        return;
      }
    }

    const { error } = await saveItemRecord(itemForm, editingItemId);

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    setItemModalOpen(false);
    fetchData();
  };

  const saveItemRecord = async (formData, itemId = null) => {
    const payload = makeItemPayload(formData, contentType, categories);
    const shouldUpdateExisting = itemId && isUuid(itemId);
    let error = null;

    const runSave = async (nextPayload) => {
      if (shouldUpdateExisting) {
        return supabase.from(itemTable).update(nextPayload).eq('id', itemId);
      }

      if (nextPayload.source_key) {
        const { data: existingRows, error: lookupError } = await supabase
          .from(itemTable)
          .select('id')
          .eq('source_key', nextPayload.source_key)
          .limit(1);

        if (lookupError) return { error: lookupError };
        if (existingRows?.[0]?.id) {
          return supabase.from(itemTable).update(nextPayload).eq('id', existingRows[0].id);
        }
      }

      return supabase.from(itemTable).insert([nextPayload]);
    };

    ({ error } = await runSave(payload));

    if (
      error &&
      contentType === 'projects' &&
      payload.type === 'link' &&
      String(error.message || '').includes('projects_type_check')
    ) {
      ({ error } = await runSave({ ...payload, type: 'external' }));
    }

    return { error };
  };

  const getNextFeaturedOrder = (currentItemId) => {
    const usedOrders = new Set(
      items
        .filter((item) => item.is_featured && item.id !== currentItemId)
        .map((item) => Number(item.featured_order))
        .filter(Boolean)
    );

    return [1, 2, 3].find((order) => !usedOrders.has(order)) || usedOrders.size + 1;
  };

  const toggleFeaturedProject = async (item) => {
    if (contentType !== 'projects' || savingFeaturedId) return;

    const nextFeatured = !item.is_featured;
    if (nextFeatured) {
      const featuredCount = items.filter((project) => project.is_featured && project.id !== item.id).length;
      if (featuredCount >= 3) {
        alert('Only 3 featured projects are allowed. Unpin one project first.');
        return;
      }
    }

    setSavingFeaturedId(item.id);
    const nextItem = {
      ...item,
      is_featured: nextFeatured,
      featured_order: nextFeatured ? getNextFeaturedOrder(item.id) : '',
    };

    setItems((current) => current.map((project) => (
      project.id === item.id
        ? { ...nextItem, featured_order: nextFeatured ? nextItem.featured_order : null }
        : project
    )));

    const { error } = await saveItemRecord(nextItem, item.id);
    setSavingFeaturedId('');

    if (error) {
      alert(error.message);
      fetchData();
      return;
    }

    fetchData();
  };

  const uploadIntoItemField = async (file, field, role) => {
    if (!file) return;
    setUploading(field);

    try {
      const previousUrl = itemForm[field];
      const url = await uploadPortfolioFile(file, buildStorageFolder(contentType, role));
      await deletePortfolioFileByUrl(previousUrl);
      setItemForm((current) => ({
        ...current,
        [field]: url,
        ...(field === getItemFileField(contentType) && current.type === 'image'
          ? { [getItemPreviewField(contentType)]: url }
          : {}),
      }));
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading('');
    }
  };

  const applyLinkPreview = async () => {
    const fileField = getItemFileField(contentType);
    const previewField = getItemPreviewField(contentType);
    setPreviewLoading(true);

    try {
      const preview = await fetchLinkPreview(itemForm[fileField]);
      setItemForm((current) => ({
        ...current,
        [fileField]: preview.url || current[fileField],
        [previewField]: preview.image || current[previewField],
        ...(contentType === 'certificates' && !current.title && preview.title ? { title: preview.title } : {}),
        ...(contentType !== 'certificates' && !current.title_en && preview.title
          ? { title_en: preview.title, title_id: preview.title }
          : {}),
      }));
    } catch (error) {
      alert(error.message);
    } finally {
      setPreviewLoading(false);
    }
  };

  const renderTitleCell = (item) => {
    if (contentType === 'certificates') {
      return <strong>{item.title}</strong>;
    }

    return (
      <div className="title-cell">
        <strong>{item.title_en}</strong>
        <span>{item.title_id}</span>
      </div>
    );
  };

  const renderItemFields = () => {
    const fileField = getItemFileField(contentType);
    const previewField = getItemPreviewField(contentType);
    const selectedType = getDisplayType(itemForm.type);

    return (
      <>
        {contentType === 'projects' && (
          <div className="form-group">
            <label>Project ID / Slug</label>
            <input
              type="text"
              value={itemForm.id_string || ''}
              onChange={(event) => setItemForm({ ...itemForm, id_string: event.target.value })}
              placeholder="data-1"
            />
          </div>
        )}

        <div className="form-group">
          <CustomSelect
            label="Category"
            value={itemForm.category_id || firstCategoryId}
            options={categories.map((category) => ({ value: category.id, label: categoryLabel(category) }))}
            onChange={(value) => setItemForm({ ...itemForm, category_id: value })}
          />
        </div>

        {contentType === 'certificates' ? (
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Certificate Title</label>
            <input
              type="text"
              value={itemForm.title || ''}
              onChange={(event) => setItemForm({ ...itemForm, title: event.target.value })}
              required
            />
          </div>
        ) : (
          <>
            <div className="form-group">
              <label>Title (English)</label>
              <input
                type="text"
                value={itemForm.title_en || ''}
                onChange={(event) => setItemForm({ ...itemForm, title_en: event.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Title (Indonesia)</label>
              <input
                type="text"
                value={itemForm.title_id || ''}
                onChange={(event) => setItemForm({ ...itemForm, title_id: event.target.value })}
                required
              />
            </div>
          </>
        )}

        <div className="form-group">
          <CustomSelect
            label="Content Type"
            value={selectedType}
            options={portfolioItemTypes.map((type) => ({ value: type, label: typeLabels[type] }))}
            onChange={(value) => setItemForm({ ...itemForm, type: value })}
          />
        </div>

        <div className="form-group">
          <label>Sort Order</label>
          <input
            type="number"
            value={itemForm.sort_order ?? 0}
            onChange={(event) => setItemForm({ ...itemForm, sort_order: event.target.value })}
          />
        </div>

        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label>{selectedType === 'link' ? 'Link URL' : 'File URL'}</label>
          <input
            type="text"
            value={itemForm[fileField] || ''}
            onChange={(event) => setItemForm({ ...itemForm, [fileField]: event.target.value })}
            placeholder={selectedType === 'link' ? 'https://example.com' : 'Upload a file or paste an asset URL'}
            required
          />
          {selectedType !== 'link' && (
            <label className="upload-inline">
              <FiUpload />
              {uploading === fileField ? 'Uploading...' : `Upload ${selectedType === 'pdf' ? 'PDF' : 'Image'}`}
              <input
                type="file"
                accept={selectedType === 'pdf' ? 'application/pdf' : 'image/*'}
                onChange={(event) => uploadIntoItemField(event.target.files?.[0], fileField, 'files')}
              />
            </label>
          )}
        </div>

        {selectedType === 'link' && (
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <button type="button" className="secondary-action-btn" onClick={applyLinkPreview} disabled={previewLoading || !itemForm[fileField]}>
              <FiRefreshCw /> {previewLoading ? 'Fetching preview...' : 'Fetch Link Preview'}
            </button>
          </div>
        )}

        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label>Preview Image URL</label>
          <input
            type="text"
            value={itemForm[previewField] || ''}
            onChange={(event) => setItemForm({ ...itemForm, [previewField]: event.target.value })}
            placeholder="Upload a preview image or paste an image URL"
          />
          <label className="upload-inline">
            <FiImage />
            {uploading === previewField ? 'Uploading...' : 'Upload Preview Image'}
            <input
              type="file"
              accept="image/*"
              onChange={(event) => uploadIntoItemField(event.target.files?.[0], previewField, 'previews')}
            />
          </label>
        </div>

        <div className="media-preview-panel" style={{ gridColumn: '1 / -1' }}>
          <span>Preview</span>
          {itemForm[previewField] ? (
            <img src={itemForm[previewField]} alt="" onError={(event) => { event.currentTarget.style.display = 'none'; }} />
          ) : (
            <div className="empty-preview">No preview image yet</div>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="manage-container">
      <div className="admin-tabs">
        <button className={activeTab === 'items' ? 'active' : ''} onClick={() => setActiveTab('items')}>
          {label.plural}
        </button>
        <button className={activeTab === 'categories' ? 'active' : ''} onClick={() => setActiveTab('categories')}>
          Categories
        </button>
      </div>

      {activeTab === 'items' && (
        <>
          <div className="action-bar">
            <div className="search-box">
              <FiSearch />
              <input
                className="search-input"
                type="text"
                placeholder={`Search ${label.plural.toLowerCase()}...`}
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
            <button className="add-btn" onClick={() => openItemModal()}>
              <FiPlus /> Add {label.singular}
            </button>
          </div>

          {loading ? (
            <div className="loading">Loading {label.plural.toLowerCase()}...</div>
          ) : (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Preview</th>
                    {label.titleColumns.map((column) => (
                      <th key={column}>{column}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => {
                    const preview = getPreviewForItem(item);
                    const type = getDisplayType(item.type);
                    return (
                      <tr key={item.id}>
                        <td>
                          {preview ? (
                            <img src={preview} alt="" className="table-preview" onError={(event) => { event.currentTarget.style.display = 'none'; }} />
                          ) : (
                            <span className="table-empty-preview">No image</span>
                          )}
                        </td>
                        <td>{renderTitleCell(item)}</td>
                        <td>
                          <span className="badge category-badge">
                            <CategoryIcon name={categoryMap.get(item.category_id)?.icon_name} size={14} />
                            {categoryLabel(categoryMap.get(item.category_id))}
                          </span>
                        </td>
                        <td>
                          <span className="badge">{type}</span>
                        </td>
                        {contentType === 'projects' && (
                          <td>
                            <button
                              type="button"
                              className={`featured-toggle-btn ${item.is_featured ? 'active' : ''}`}
                              onClick={() => toggleFeaturedProject(item)}
                              disabled={savingFeaturedId === item.id}
                              title={item.is_featured ? 'Unpin from Home' : 'Pin to Home'}
                              aria-pressed={Boolean(item.is_featured)}
                            >
                              <FiStar />
                              <span>{item.is_featured ? `#${item.featured_order || '-'}` : 'Off'}</span>
                            </button>
                          </td>
                        )}
                        <td>
                          <div className="actions">
                            {isLinkType(type) && (
                              <a href={getFileForItem(item)} target="_blank" rel="noopener noreferrer" className="open-icon" title="Open link">
                                <FiExternalLink />
                              </a>
                            )}
                            <button onClick={() => openItemModal(item)} className="edit-icon" title="Edit"><FiEdit2 /></button>
                            <button onClick={() => deleteItem(item)} className="delete-icon" title="Delete"><FiTrash2 /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {activeTab === 'categories' && (
        <>
          <div className="action-bar">
            <h2>Manage {label.singular} Categories</h2>
            <button className="add-btn" onClick={() => openCategoryModal()}>
              <FiPlus /> Add Category
            </button>
          </div>

          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Icon</th>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Order</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td className="category-icon-cell"><CategoryIcon name={category.icon_name} size={22} /></td>
                    <td>
                      <div className="title-cell">
                        <strong>{category.name_en}</strong>
                        <span>{category.name_id}</span>
                      </div>
                    </td>
                    <td><span className="badge">{category.slug}</span></td>
                    <td>{category.sort_order}</td>
                    <td>
                      <div className="actions">
                        <button onClick={() => openCategoryModal(category)} className="edit-icon" title="Edit"><FiEdit2 /></button>
                        <button onClick={() => deleteCategory(category)} className="delete-icon" title="Delete"><FiTrash2 /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {itemModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content large-modal">
            <div className="modal-header">
              <h2>{editingItemId ? `Edit ${label.singular}` : `Add ${label.singular}`}</h2>
              <button onClick={() => setItemModalOpen(false)}><FiX /></button>
            </div>
            <form onSubmit={submitItem} className="modal-form">
              <div className="form-grid">
                {renderItemFields()}
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setItemModalOpen(false)} className="cancel-btn">Cancel</button>
                <button type="submit" className="save-btn" disabled={saving}>
                  <FiSave /> {saving ? 'Saving...' : `Save ${label.singular}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {categoryModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content large-modal">
            <div className="modal-header">
              <h2>{editingCategoryId ? 'Edit Category' : 'Add Category'}</h2>
              <button onClick={() => setCategoryModalOpen(false)}><FiX /></button>
            </div>
            <form onSubmit={submitCategory} className="modal-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Slug</label>
                  <input
                    type="text"
                    value={categoryForm.slug}
                    onChange={(event) => setCategoryForm({ ...categoryForm, slug: event.target.value })}
                    placeholder="data"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Sort Order</label>
                  <input
                    type="number"
                    value={categoryForm.sort_order}
                    onChange={(event) => setCategoryForm({ ...categoryForm, sort_order: event.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Name (English)</label>
                  <input
                    type="text"
                    value={categoryForm.name_en}
                    onChange={(event) => setCategoryForm({ ...categoryForm, name_en: event.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Name (Indonesia)</label>
                  <input
                    type="text"
                    value={categoryForm.name_id}
                    onChange={(event) => setCategoryForm({ ...categoryForm, name_id: event.target.value })}
                    required
                  />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Lucide Icon</label>
                  <div className="search-box icon-search">
                    <FiSearch />
                    <input
                      className="search-input"
                      type="text"
                      placeholder="Search icon, e.g. database, trophy, badge..."
                      value={iconSearch}
                      onChange={(event) => setIconSearch(event.target.value)}
                    />
                  </div>
                  <div className="icon-picker-grid">
                    {filteredIcons.map((iconName) => (
                      <button
                        type="button"
                        key={iconName}
                        className={`icon-picker-item ${normalizeIconName(categoryForm.icon_name) === iconName ? 'selected' : ''}`}
                        onClick={() => setCategoryForm({ ...categoryForm, icon_name: iconName })}
                        title={iconName}
                      >
                        <CategoryIcon name={iconName} size={22} />
                      </button>
                    ))}
                  </div>
                  <div className="selected-icon-label">
                    Selected: <CategoryIcon name={categoryForm.icon_name} size={16} /> <strong>{normalizeIconName(categoryForm.icon_name)}</strong>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setCategoryModalOpen(false)} className="cancel-btn">Cancel</button>
                <button type="submit" className="save-btn" disabled={saving}>
                  <FiSave /> {saving ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
