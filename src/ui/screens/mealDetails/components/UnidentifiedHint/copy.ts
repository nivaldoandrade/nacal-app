import { UnidentifiedKind } from '@/app/types/Meal';
import { CircleHelpIcon, CookingPotIcon, CupSodaIcon, LucideIcon, PackageIcon } from 'lucide-react-native';

type UnidentifiedCopy = {
  icon: LucideIcon;
  title: string;
  description: string;
  action: string;
  modalSubtitle: string | null;
  modalPlaceholder: string | null;
};

export const UNIDENTIFIED_COPY: Record<UnidentifiedKind, UnidentifiedCopy> = {
  DRINK: {
    icon: CupSodaIcon,
    title: 'Tinha algo no copo?',
    description: 'A gente não conseguiu ver o que era.',
    action: 'Adicionar bebida',
    modalSubtitle: 'Conte o que tinha no copo e a gente calcula para você.',
    modalPlaceholder: 'Ex.: um copo de suco de laranja 300ml',
  },
  PACKAGED: {
    icon: PackageIcon,
    title: 'Tinha algo na embalagem?',
    description: 'Ela estava fechada, então não deu para ver.',
    action: 'Adicionar item',
    modalSubtitle: 'Conte o que tinha na embalagem e a gente calcula para você.',
    modalPlaceholder: 'Ex.: um iogurte natural 170g',
  },
  COVERED: {
    icon: CookingPotIcon,
    title: 'Tinha algo tampado?',
    description: 'Não deu para ver o que tinha dentro.',
    action: 'Adicionar item',
    modalSubtitle: 'Conte o que tinha no recipiente e a gente calcula para você.',
    modalPlaceholder: 'Ex.: uma marmita de arroz com frango',
  },
  OTHER: {
    icon: CircleHelpIcon,
    title: 'Ficou faltando algo?',
    description: 'Vimos algo que não conseguimos identificar.',
    action: 'Adicionar item',
    modalSubtitle: null,
    modalPlaceholder: null,
  },
};
