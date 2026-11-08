export type DeleteMealSheetReason = 'meal' | 'lastItem';

export interface IDeleteMealSheet {
  open: (reason: DeleteMealSheetReason) => void;
  dismiss: () => void;
}
