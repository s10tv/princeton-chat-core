import OnboardingOverlay from '../components/onboarding/onboarding.overlay.jsx';
import {useDeps} from '/imports/libs/mantra.js';

export const depsMapper = (context) => ({
  context: () => context
});

export default useDeps(depsMapper)(OnboardingOverlay);
