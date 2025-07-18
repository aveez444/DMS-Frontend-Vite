import React from 'react';
import Navigation from '../../Navigation';
import Footer from '../Footer';
import HeroWorking from './HeroWorking';
import WorkingFeatures from './WorkingFeatures';
import ComparisonTable from './ComparisonTable';
import TaskSection from './TaskSection';
import CallToAction from './CTASection';

const SeeHowItWorks = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <HeroWorking />

      {/* Features Section */}
      <WorkingFeatures />

      {/* Comparison Table */}
      <ComparisonTable />

      {/* Task Section */}
      <TaskSection />

      {/* CTA Section */}
      <CallToAction />
      

      <Footer />
    </div>
  );
};

export default SeeHowItWorks;
