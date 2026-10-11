import React, { useState, useEffect } from 'react';
import { categoryService } from '../../services/categoryService';
import { Tag, Plus, Pencil, Trash2, CheckCircle2, AlertTriangle, X, Check, Shield } from 'lucide-react';

export const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Add form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [addName, setAddName] = useState('');
  const [addDescription, setAddDescription] = useState('');
  const [addError, setAddError] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Edit modal state
  const [editingCat, setEditingCat] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editError, setEditError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Delete confirm state
  const [deletingCat, setDeletingCat] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (err) {
      setError('Failed to load categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // --- ADD ---
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setAddError('');
    if (!addName.trim()) {
      setAddError('Category name is required.');
      return;
    }
    setIsAdding(true);
    try {
      const res = await categoryService.addCategory({ name: addName, description: addDescription });
      showSuccess(res.message);
      setAddName('');
      setAddDescription('');
      setShowAddForm(false);
      fetchCategories();
    } catch (err) {
      setAddError(err.message || 'Failed to add category.');
    } finally {
      setIsAdding(false);
    }
  };

  // --- EDIT ---
  const openEditModal = (cat) => {
    setEditingCat(cat);
    setEditName(cat.name);
    setEditDescription(cat.description || '');
    setEditError('');
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditError('');
    if (!editName.trim()) {
      setEditError('Category name is required.');
      return;
    }
    setIsEditing(true);
    try {
      const res = await categoryService.updateCategory(editingCat.id, { name: editName, description: editDescription });
      showSuccess(res.message);
      setEditingCat(null);
      fetchCategories();
    } catch (err) {
      setEditError(err.message || 'Failed to update category.');
    } finally {
      setIsEditing(false);
    }
  };

  // --- DELETE ---
  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    setError('');
    try {
      const res = await categoryService.deleteCategory(deletingCat.id);
      showSuccess(res.message);
      setDeletingCat(null);
      fetchCategories();
    } catch (err) {
      setError(err.message || 'Failed to delete category.');
      setDeletingCat(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1>Predefined Categories 🏷️</h1>
          <p>Manage event categories available to organizers on the platform.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className="role-tag admin" style={{ fontSize: '0.85rem', padding: '0.4rem 0.9rem' }}>
            ADMIN MODULE
          </span>
          <button
            className="btn btn-primary"
            onClick={() => { setShowAddForm((v) => !v); setAddError(''); setAddName(''); setAddDescription(''); }}
          >
            <Plus size={16} /> Add Category
          </button>
        </div>
      </div>

      {/* Success / Error Alerts */}
      {successMsg && (
        <div className="alert alert-success" style={{ marginBottom: '1rem' }}>
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}
      {error && (
        <div className="alert alert-danger" style={{ marginBottom: '1rem' }}>
          <AlertTriangle size={18} />
          <span>{error}</span>
          <button onClick={() => setError('')} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Inline Add Form */}
      {showAddForm && (
        <div className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem', border: '2px solid var(--primary)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} color="var(--primary)" /> Add New Category
          </h3>
          <form onSubmit={handleAddSubmit}>
            {addError && (
              <div className="alert alert-danger" style={{ marginBottom: '1rem' }}>
                <AlertTriangle size={16} /><span>{addError}</span>
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="newCatName">Category Name *</label>
                <input
                  id="newCatName"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Music, Sports"
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  maxLength={60}
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="newCatDesc">Description (Optional)</label>
                <input
                  id="newCatDesc"
                  type="text"
                  className="form-input"
                  placeholder="Brief description of this category"
                  value={addDescription}
                  onChange={(e) => setAddDescription(e.target.value)}
                  maxLength={200}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowAddForm(false)} disabled={isAdding}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={isAdding}>
                {isAdding ? 'Adding...' : <><Check size={16} /> Save Category</>}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Table */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
          <div className="spinner" style={{ width: '2.5rem', height: '2.5rem', borderWidth: '3px' }} />
        </div>
      ) : categories.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <Tag size={48} color="var(--text-dim)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>No Categories Found</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.4rem' }}>Click "Add Category" to create the first category.</p>
        </div>
      ) : (
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-input)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '1rem 1.25rem' }}>#</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Category Name</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Description</th>
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat, idx) => (
                  <tr key={cat.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                      {idx + 1}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 700 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Tag size={16} color="var(--primary)" />
                        {cat.name}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {cat.description || <span style={{ color: 'var(--text-dim)', fontStyle: 'italic' }}>No description</span>}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => openEditModal(cat)}
                          title="Edit Category"
                        >
                          <Pencil size={14} /> Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => setDeletingCat(cat)}
                          title="Delete Category"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding: '0.75rem 1.25rem', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield size={14} color="var(--text-dim)" />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              {categories.length} {categories.length === 1 ? 'category' : 'categories'} configured. Categories in use by events cannot be deleted.
            </span>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingCat && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card" style={{ maxWidth: '500px', width: '100%', position: 'relative' }}>
            <button onClick={() => setEditingCat(null)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={20} />
            </button>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Pencil size={18} color="var(--primary)" /> Edit Category
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Editing: <strong>"{editingCat.name}"</strong>
            </p>

            {editError && (
              <div className="alert alert-danger" style={{ marginBottom: '1rem' }}>
                <AlertTriangle size={16} /><span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="editCatName">Category Name *</label>
                <input
                  id="editCatName"
                  type="text"
                  className="form-input"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  maxLength={60}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="editCatDesc">Description</label>
                <input
                  id="editCatDesc"
                  type="text"
                  className="form-input"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  maxLength={200}
                  placeholder="Optional description"
                />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setEditingCat(null)} disabled={isEditing}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isEditing}>
                  {isEditing ? 'Saving...' : <><Check size={16} /> Save Changes</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deletingCat && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card" style={{ maxWidth: '420px', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <Trash2 size={24} color="#ef4444" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ef4444' }}>Delete Category</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              Are you sure you want to delete <strong>"{deletingCat.name}"</strong>?
            </p>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginBottom: '1.5rem' }}>
              ⚠️ This cannot be undone. If this category is in use by active events, deletion will be blocked.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setDeletingCat(null)} disabled={isDeleting}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDeleteConfirm} disabled={isDeleting}>
                {isDeleting ? 'Deleting...' : <><Trash2 size={15} /> Confirm Delete</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
