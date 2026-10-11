import { getMockCategories, saveMockCategories, getMockEvents } from '../data/mockData.js';
import { apiClient, USE_MOCK_DATA } from './apiConfig.js';

export const categoryService = {
  /**
   * Get all categories
   */
  async getCategories() {
    if (USE_MOCK_DATA) {
      await new Promise((res) => setTimeout(res, 150));
      return getMockCategories();
    } else {
      const response = await apiClient.get('/categories');
      return response.data;
    }
  },

  /**
   * Add a new Category (Enforces unique name)
   */
  async addCategory(categoryData) {
    if (USE_MOCK_DATA) {
      await new Promise((res) => setTimeout(res, 300));
      const categories = getMockCategories();

      const nameTrimmed = categoryData.name.trim();
      const existing = categories.find((c) => c.name.toLowerCase() === nameTrimmed.toLowerCase());
      if (existing) {
        throw new Error(`Category "${nameTrimmed}" already exists.`);
      }

      const newCat = {
        id: `cat-${Date.now()}`,
        name: nameTrimmed,
        description: categoryData.description ? categoryData.description.trim() : ''
      };

      categories.push(newCat);
      saveMockCategories(categories);

      return {
        success: true,
        message: 'Category added successfully!',
        category: newCat
      };
    } else {
      const response = await apiClient.post('/admin/categories', categoryData);
      return response.data;
    }
  },

  /**
   * Update existing Category (Enforces unique name)
   */
  async updateCategory(categoryId, updatedData) {
    if (USE_MOCK_DATA) {
      await new Promise((res) => setTimeout(res, 300));
      const categories = getMockCategories();
      const index = categories.findIndex((c) => c.id === categoryId);
      if (index === -1) throw new Error('Category not found.');

      const nameTrimmed = updatedData.name.trim();
      const duplicate = categories.find((c) => c.id !== categoryId && c.name.toLowerCase() === nameTrimmed.toLowerCase());
      if (duplicate) {
        throw new Error(`Category "${nameTrimmed}" already exists.`);
      }

      const oldName = categories[index].name;

      categories[index] = {
        ...categories[index],
        name: nameTrimmed,
        description: updatedData.description ? updatedData.description.trim() : ''
      };
      saveMockCategories(categories);

      return {
        success: true,
        message: 'Category updated successfully!',
        category: categories[index]
      };
    } else {
      const response = await apiClient.put(`/admin/categories/${categoryId}`, updatedData);
      return response.data;
    }
  },

  /**
   * Delete Category (Blocks deletion if category is currently used by any event)
   */
  async deleteCategory(categoryId) {
    if (USE_MOCK_DATA) {
      await new Promise((res) => setTimeout(res, 300));
      const categories = getMockCategories();
      const cat = categories.find((c) => c.id === categoryId);
      if (!cat) throw new Error('Category not found.');

      // Check if category is used by any event
      const events = getMockEvents();
      const usedEvents = events.filter((e) => e.category.toLowerCase() === cat.name.toLowerCase());

      if (usedEvents.length > 0) {
        throw new Error(`Cannot delete category "${cat.name}". It is currently used by ${usedEvents.length} event(s).`);
      }

      const filtered = categories.filter((c) => c.id !== categoryId);
      saveMockCategories(filtered);

      return {
        success: true,
        message: `Category "${cat.name}" deleted successfully.`
      };
    } else {
      const response = await apiClient.delete(`/admin/categories/${categoryId}`);
      return response.data;
    }
  }
};
