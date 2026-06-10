import React, { useState } from "react";
import { Category } from "../types";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/api";
import { TextField, Button, Modal } from "../vibes";
import { COLORS } from "../constants/colors";

interface CategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onCategoriesChanged: () => Promise<void>;
}

export function CategoriesModal({
  isOpen,
  onClose,
  categories,
  onCategoriesChanged,
}: CategoriesModalProps) {
  const [newName, setNewName] = useState("");
  const [newNameError, setNewNameError] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingError, setEditingError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      setNewNameError("Name is required");
      return;
    }
    setIsAdding(true);
    try {
      await createCategory(newName.trim());
      setNewName("");
      setNewNameError("");
      await onCategoriesChanged();
    } catch (err) {
      setNewNameError(
        err instanceof Error ? err.message : "Failed to create category",
      );
    } finally {
      setIsAdding(false);
    }
  };

  const startEdit = (category: Category) => {
    setEditingId(category.id);
    setEditingName(category.name);
    setEditingError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
    setEditingError("");
  };

  const handleSave = async (id: number) => {
    if (!editingName.trim()) {
      setEditingError("Name is required");
      return;
    }
    setIsSaving(true);
    try {
      await updateCategory(id, editingName.trim());
      setEditingId(null);
      setEditingName("");
      setEditingError("");
      await onCategoriesChanged();
    } catch (err) {
      setEditingError(
        err instanceof Error ? err.message : "Failed to update category",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await deleteCategory(id);
      await onCategoriesChanged();
    } catch {
      // keep list intact on error
    } finally {
      setDeletingId(null);
    }
  };

  const rowStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.6rem 0",
    borderBottom: `1px solid ${COLORS.border}`,
  };

  const nameStyle: React.CSSProperties = {
    flex: 1,
    color: COLORS.text.primary,
    fontSize: "0.95rem",
  };

  const dividerStyle: React.CSSProperties = {
    borderTop: `2px solid ${COLORS.border}`,
    margin: "1rem 0",
  };

  const listStyle: React.CSSProperties = {
    overflowY: "auto",
    flex: 1,
    minHeight: 0,
    paddingRight: "0.5rem",
  };

  const emptyStyle: React.CSSProperties = {
    color: COLORS.text.secondary,
    fontSize: "0.875rem",
    padding: "0.75rem 0",
    textAlign: "center",
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Categories">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 0,
        }}
      >
        {/* Add new category */}
        <form
          onSubmit={handleAdd}
          style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}
        >
          <div style={{ flex: 1 }}>
            <TextField
              type="text"
              placeholder="New category name"
              value={newName}
              onChange={(e) => {
                setNewName(e.target.value);
                setNewNameError("");
              }}
              error={newNameError}
              fullWidth
            />
          </div>
          <Button type="submit" variant="primary" disabled={isAdding}>
            {isAdding ? "Adding..." : "Add"}
          </Button>
        </form>

        <div style={dividerStyle} />

        {/* Category list */}
        {categories.length === 0 ? (
          <p style={emptyStyle}>No categories yet. Add one above.</p>
        ) : (
          <div style={listStyle}>
            {categories.map((cat) =>
              editingId === cat.id ? (
                <div key={cat.id} style={rowStyle}>
                  <div style={{ flex: 1 }}>
                    <TextField
                      type="text"
                      value={editingName}
                      onChange={(e) => {
                        setEditingName(e.target.value);
                        setEditingError("");
                      }}
                      error={editingError}
                      fullWidth
                    />
                  </div>
                  <Button
                    variant="primary"
                    size="small"
                    onClick={() => handleSave(cat.id)}
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={cancelEdit}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <div key={cat.id} style={rowStyle}>
                  <span style={nameStyle}>{cat.name}</span>
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => startEdit(cat)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="small"
                    onClick={() => handleDelete(cat.id)}
                    disabled={deletingId === cat.id}
                  >
                    {deletingId === cat.id ? "..." : "Delete"}
                  </Button>
                </div>
              ),
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
