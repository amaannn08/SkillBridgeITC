import { MOCK_ANALYTICS } from '../data/mockData';
import LandingNav      from '../components/landing/LandingNav';
import LandingHero     from '../components/landing/LandingHero';
import LandingPillars  from '../components/landing/LandingPillars';
import LandingProcess  from '../components/landing/LandingProcess';
import LandingImpact   from '../components/landing/LandingImpact';
import LandingRegister from '../components/landing/LandingRegister';
import LandingCTA      from '../components/landing/LandingCTA';
import LandingFooter   from '../components/landing/LandingFooter';

const { summary } = MOCK_ANALYTICS;

const STATS = [
  { value: summary.totalInstitutions.toLocaleString('en-IN'), label: 'Institutions' },
  { value: summary.totalCompanies.toLocaleString('en-IN'),    label: 'Industry Partners' },
  { value: summary.totalPlacements.toLocaleString('en-IN'),   label: 'Placements' },
  { value: summary.totalJobPostings.toLocaleString('en-IN'),  label: 'Active Jobs' },
];

export default function Landing() {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <LandingNav />
      <LandingHero stats={STATS} />
      <LandingPillars />
      <LandingProcess />
      <LandingImpact />
      <LandingRegister />
      <LandingCTA />
      <LandingFooter />
    </div>
  );
}
