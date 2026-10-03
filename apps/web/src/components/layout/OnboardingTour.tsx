"use client";

import { usePortalStore } from '@/stores/portalStore';
import { useTranslations } from 'next-intl';
import { X, ChevronRight, ChevronLeft, Check, Sparkles, PhoneCall, ShieldCheck, Users, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function OnboardingTour() {
  const t = useTranslations('tour');
  const { tourOpen, tourStep, setTourStep, closeTour } = usePortalStore();

  if (!tourOpen) return null;

  const totalSteps = 5;

  const stepIcons = [
    <Users key="1" className="text-gold-500 w-10 h-10" />,
    <PhoneCall key="2" className="text-gold-500 w-10 h-10" />,
    <Sparkles key="3" className="text-gold-500 w-10 h-10" />,
    <ShieldCheck key="4" className="text-gold-500 w-10 h-10" />,
    <BarChart3 key="5" className="text-gold-500 w-10 h-10" />
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl bg-dark-850 border border-gold-500/40 p-6 md:p-8 shadow-2xl shadow-gold-500/10">
        {/* Close Button */}
        <button
          onClick={closeTour}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-100 rounded-lg hover:bg-dark-800 transition-colors"
          title="Schließen"
        >
          <X size={20} />
        </button>

        {/* Step Indicator & Icon */}
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 rounded-2xl bg-gold-500/10 border border-gold-500/30">
            {stepIcons[tourStep]}
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gold-500/20 text-gold-400 border border-gold-500/30">
              <Sparkles size={12} />
              {t('step', { current: tourStep + 1, total: totalSteps })}
            </div>
            <h3 className="text-xl font-bold text-gray-100 mt-1">
              {t(`steps.${tourStep}.title`)}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-300 text-base leading-relaxed bg-dark-900/60 p-5 rounded-xl border border-dark-border">
          {t(`steps.${tourStep}.desc`)}
        </p>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 my-6">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <button
              key={index}
              onClick={() => setTourStep(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === tourStep
                  ? 'w-8 bg-gold-500 shadow-sm shadow-gold-500/50'
                  : 'w-2.5 bg-dark-700 hover:bg-dark-600'
              }`}
            />
          ))}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-dark-border">
          <Button
            variant="secondary"
            onClick={() => setTourStep(Math.max(0, tourStep - 1))}
            disabled={tourStep === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft size={16} />
            <span>Zurück</span>
          </Button>

          {tourStep < totalSteps - 1 ? (
            <Button
              onClick={() => setTourStep(tourStep + 1)}
              className="flex items-center gap-2 bg-gradient-to-r from-gold-500 to-gold-600 text-dark-950 font-bold hover:brightness-110 shadow-lg shadow-gold-500/20"
            >
              <span>Weiter</span>
              <ChevronRight size={16} />
            </Button>
          ) : (
            <Button
              onClick={closeTour}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-500/20"
            >
              <Check size={16} />
              <span>{t('finish')}</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
