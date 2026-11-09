import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Compass, Plus, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { useGrantlyStore } from '../../lib/store';

interface StickyMobileCtaProps {
  scholarshipId?: string;
  scholarshipTitle?: string;
}

export const StickyMobileCta: React.FC<StickyMobileCtaProps> = ({
  scholarshipId,
  scholarshipTitle,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [hasScrolled, setHasScrolled] = useState(false);
  const addApplication = useGrantlyStore((state) => state.addApplication);
  const applications = useGrantlyStore((state) => state.applications);

  const isLanding = location.pathname === '/';
  const isDetail = location.pathname.startsWith('/scholarships/');

  const isInTracker = scholarshipId
    ? Object.values(applications).some((a) => a.scholarshipId === scholarshipId)
    : false;

  useEffect(() => {
    const handleScroll = () => {
      // Trigger after scrolling 280px past the hero header
      setHasScrolled(window.scrollY > 280);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!hasScrolled || (!isLanding && !isDetail)) {
    return null;
  }

  return (
    <div className="md:hidden fixed bottom-14 left-0 right-0 z-30 p-3 bg-surface-card/95 backdrop-blur-md border-t border-border-hairline shadow-lg transition-transform animate-in slide-in-from-bottom-2">
      {isLanding && (
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xs font-serif text-ink-primary font-medium truncate">
              Ready to find your matches?
            </div>
            <div className="text-[11px] text-ink-muted">Free, private, no registration required</div>
          </div>
          <Button
            size="sm"
            variant="primary"
            onClick={() => navigate('/discover')}
            leftIcon={<Compass className="w-3.5 h-3.5" />}
          >
            Find scholarships
          </Button>
        </div>
      )}

      {isDetail && scholarshipId && (
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="text-xs font-medium text-ink-primary truncate">
              {scholarshipTitle || 'Scholarship opportunity'}
            </div>
            <div className="text-[11px] text-ink-muted">Save to your personal tracker</div>
          </div>
          <Button
            size="sm"
            variant={isInTracker ? 'secondary' : 'primary'}
            onClick={() => {
              if (isInTracker) {
                navigate('/tracker');
              } else {
                addApplication(scholarshipId);
              }
            }}
            leftIcon={
              isInTracker ? (
                <Check className="w-3.5 h-3.5 text-semantic-success" />
              ) : (
                <Plus className="w-3.5 h-3.5" />
              )
            }
          >
            {isInTracker ? 'In Tracker' : 'Add to tracker'}
          </Button>
        </div>
      )}
    </div>
  );
};
