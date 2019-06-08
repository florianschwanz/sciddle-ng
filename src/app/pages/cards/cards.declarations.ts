import {CardsComponent} from './pages/cards/cards.component';
import {CardsToolbarComponent} from './components/toolbars/cards-toolbar/cards-toolbar.component';
import {CardFragmentComponent} from './components/fragments/card-fragment/card-fragment.component';
import {DifficultySelectionFragmentComponent} from './components/fragments/difficulty-selection-fragment/difficulty-selection-fragment.component';
import {TeamSelectionFragmentComponent} from './components/fragments/team-selection-fragment/team-selection-fragment.component';
import {GameEvaluationFragmentComponent} from './components/fragments/game-evaluation-fragment/game-evaluation-fragment.component';
import {TeamInformationFragmentComponent} from './components/fragments/team-information-fragment/team-information-fragment.component';

/**
 * Declarations of cards module
 */
export const CardsDeclarations = [
  // Pages
  CardsComponent,
  // Toolbars
  CardsToolbarComponent,
  // Fragments
  CardFragmentComponent,
  DifficultySelectionFragmentComponent,
  GameEvaluationFragmentComponent,
  TeamInformationFragmentComponent,
  TeamSelectionFragmentComponent
];
