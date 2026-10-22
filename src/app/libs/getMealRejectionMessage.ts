import {
  MealInput,
  RejectionReason,
} from '@/app/types/Meal';

export function getMealRejectionMessage(
  reason: RejectionReason | null,
  input: MealInput,
): string {
  if (reason === RejectionReason.INVALID_FILE) {
    return 'Não conseguimos processar esse arquivo. Tente novamente.';
  }

  if (input === MealInput.AUDIO) {
    return 'Não conseguimos identificar alimentos nesse áudio. Tente novamente!';
  }

  return 'Não conseguimos identificar uma refeição nessa foto. Tente outra foto!';
}
