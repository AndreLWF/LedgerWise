import { useCallback, useMemo, useState } from 'react';
import type { CategoryInfo, UserCategory } from '../../types/categorize';

interface MenuState {
  category: CategoryInfo;
  position: { top: number; right: number };
}

interface CategoryModalsInput {
  allCategories: CategoryInfo[];
  userCategories: UserCategory[];
  createCategory: (name: string, colorId: number) => Promise<void>;
  updateCategory: (id: string, updates: { name?: string; color_id?: number }, oldName: string) => Promise<void>;
  deleteCategory: (id: string, categoryName: string) => Promise<void>;
}

export default function useCategoryModals({
  allCategories,
  userCategories,
  createCategory,
  updateCategory,
  deleteCategory,
}: CategoryModalsInput) {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editTarget, setEditTarget] = useState<CategoryInfo | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CategoryInfo | null>(null);
  const [menuState, setMenuState] = useState<MenuState | null>(null);

  const existingCategoryNames = useMemo(
    () => allCategories.map((c) => c.name),
    [allCategories],
  );

  const takenColorIds = useMemo(
    () => userCategories.map((uc) => uc.color_id),
    [userCategories],
  );

  const handleOpenCreateModal = useCallback(() => setCreateModalVisible(true), []);
  const handleCloseCreateModal = useCallback(() => setCreateModalVisible(false), []);

  const handleCreateCategory = useCallback(
    async (name: string, colorId: number) => {
      await createCategory(name, colorId);
    },
    [createCategory],
  );

  const handleEditCategory = useCallback(
    async (name: string, colorId: number) => {
      if (!editTarget) return;
      await updateCategory(editTarget.id, { name, color_id: colorId }, editTarget.name);
    },
    [editTarget, updateCategory],
  );

  const handleDeleteCategory = useCallback(async () => {
    if (!deleteTarget) return;
    await deleteCategory(deleteTarget.id, deleteTarget.name);
  }, [deleteTarget, deleteCategory]);

  const handleMenuOpen = useCallback(
    (category: CategoryInfo, position: { top: number; right: number }) => {
      setMenuState({ category, position });
    },
    [],
  );

  const handleMenuClose = useCallback(() => setMenuState(null), []);

  const handleMenuEdit = useCallback(() => {
    if (menuState) setEditTarget(menuState.category);
  }, [menuState]);

  const handleMenuDelete = useCallback(() => {
    if (menuState) setDeleteTarget(menuState.category);
  }, [menuState]);

  const handleCloseEditModal = useCallback(() => setEditTarget(null), []);
  const handleCloseDeleteModal = useCallback(() => setDeleteTarget(null), []);

  return {
    createModalVisible,
    editTarget,
    deleteTarget,
    menuState,
    existingCategoryNames,
    takenColorIds,
    handleOpenCreateModal,
    handleCloseCreateModal,
    handleCreateCategory,
    handleEditCategory,
    handleDeleteCategory,
    handleMenuOpen,
    handleMenuClose,
    handleMenuEdit,
    handleMenuDelete,
    handleCloseEditModal,
    handleCloseDeleteModal,
  };
}
