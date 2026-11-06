import { ErrorCode, getApiErrorCode, getErrorMessage } from '@/app/errors/apiErrors';
import { useAddMealItems } from '@/app/hooks/mutations/useAddMealItems';
import { toast } from '@/app/libs/sonner';
import { MODAL_TOASTER_ID } from '@/ui/components/ModalWrapper';
import { useState } from 'react';

const CLOSING_ERROR_CODES = new Set<ErrorCode>([
  ErrorCode.MEAL_NOT_EDITABLE,
  ErrorCode.MEAL_ITEM_LIMIT_REACHED,
  ErrorCode.RESOURCE_NOT_FOUND,
  ErrorCode.FREE_QUOTA_EXCEEDED,
]);

function getAddedFoodsMessage(count: number) {
  return count === 1
    ? 'Item adicionado à refeição.'
    : `${count} itens adicionados à refeição.`;
}

interface IUseAddItemModalParams {
  mealId: string;
  onClose: () => void;
}

export function useAddItemModal({ mealId, onClose }: IUseAddItemModalParams) {
  const [text, setText] = useState('');
  const { addMealItems, isPending } = useAddMealItems();

  const canSubmit = text.trim().length > 0 && !isPending;

  function handleClose() {
    if (isPending) {
      return;
    }

    onClose();
  }

  function handleDismiss() {
    setText('');
  }

  async function handleSubmit() {
    if (!canSubmit) {
      return;
    }

    try {
      const { addedFoods, skippedFoodsCount } = await addMealItems({ mealId, text: text.trim() });

      setText('');
      onClose();

      if (skippedFoodsCount > 0) {
        toast.info(
          `${getAddedFoodsMessage(addedFoods.length)} Alguns itens ficaram de fora porque a refeição chegou ao limite.`,
        );
        return;
      }

      toast.success(getAddedFoodsMessage(addedFoods.length));
    } catch (error) {
      console.error(error);

      const code = getApiErrorCode(error);

      if (code && CLOSING_ERROR_CODES.has(code)) {
        setText('');
        onClose();
        toast.info(getErrorMessage(code));
        return;
      }

      if (code === ErrorCode.NO_FOOD_IDENTIFIED || code === ErrorCode.RATE_LIMIT_EXCEEDED) {
        toast.info(getErrorMessage(code), { toasterId: MODAL_TOASTER_ID });
        return;
      }

      toast.error('Não conseguimos adicionar o item. Tente novamente!', {
        toasterId: MODAL_TOASTER_ID,
      });
    }
  }

  return {
    text,
    setText,
    isPending,
    canSubmit,
    handleClose,
    handleDismiss,
    handleSubmit,
  };
}
