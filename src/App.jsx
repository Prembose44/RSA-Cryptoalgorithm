import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, BookOpen, Target, ListOrdered,
  Cpu, Calculator, Zap, Compass, HelpCircle,
  LayoutDashboard, X, ChevronRight
} from 'lucide-react';

import Dashboard   from './pages/Dashboard.jsx';
import Simulation  from './pages/Simulation.jsx';
import Workbench   from './pages/Workbench.jsx';
import Attacks     from './pages/Attacks.jsx';
import Playground  from './pages/Playground.jsx';
import Quiz        from './pages/Quiz.jsx';
import Theory      from './pages/Theory.jsx';
import Learn       from './pages/Learn.jsx';
import Aim         from './pages/Aim.jsx';
import Procedure   from './pages/Procedure.jsx';

const TIERS = [
  {
    label: 'LEARN',
    items: [
      { id: 'aim',       label: 'Aim & Objectives',    icon: Target,          badge: 'Start Here' },
      { id: 'theory',    label: 'Mathematical Theory',  icon: BookOpen,        badge: null         },
      { id: 'learn',     label: 'RSA Concepts',         icon: BookOpen,        badge: 'Interactive' },
      { id: 'procedure', label: 'Lab Procedure',        icon: ListOrdered,     badge: 'Guide'      },
    ],
  },
  {
    label: 'BUILD',
    items: [
      { id: 'simulation', label: 'RSA Control Center', icon: Cpu,        badge: 'Core'       },
      { id: 'workbench',  label: 'Math Inspector',     icon: Calculator, badge: 'Step Trace' },
    ],
  },
  {
    label: 'BREAK',
    items: [
      { id: 'attacks', label: 'Attacks & Breaches', icon: Zap, badge: 'Security' },
    ],
  },
  {
    label: 'EXPERIMENT',
    items: [
      { id: 'playground', label: 'Parameter Lab', icon: Compass, badge: '4 Tests' },
    ],
  },
  {
    label: 'ASSESS',
    items: [
      { id: 'quiz',      label: 'Knowledge Check', icon: HelpCircle,      badge: '10 Qs' },
      { id: 'dashboard', label: 'Overview',         icon: LayoutDashboard, badge: null    },
    ],
  },
];

const ALL_ITEMS = TIERS.flatMap(t => t.items);

function getTierLabel(id) {
  for (const tier of TIERS) {
    if (tier.items.find(i => i.id === id)) return tier.label;
  }
  return '';
}

function getItemLabel(id) {
  return ALL_ITEMS.find(i => i.id === id)?.label || '';
}

export default function App() {
  const [activeTab, setActiveTab] = useState('aim');
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('rsa_onboarding_dismissed')) {
      setShowBanner(true);
    }
  }, []);

  const dismissBanner = () => {
    localStorage.setItem('rsa_onboarding_dismissed', '1');
    setShowBanner(false);
  };

  const navigate = (tab) => {
    setActiveTab(tab);
    dismissBanner();
  };

  return (
    <div className="app-wrapper">
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <ShieldCheck size={18} />
          </div>
          <div>
            <div className="sidebar-logo-name">RSA Virtual Lab</div>
            <div className="sidebar-logo-tag">Cryptosystem Suite</div>
          </div>
        </div>

        {TIERS.map((tier, ti) => (
          <div key={tier.label}>
            {ti > 0 && <hr className="sidebar-divider" />}
            <div className="sidebar-section-label">{tier.label}</div>
            {tier.items.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <div
                  key={item.id}
                  className={`nav-item${isActive ? ' active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <span className="nav-item-icon"><Icon size={15} /></span>
                  <span className="nav-item-label">{item.label}</span>
                  {item.badge && (
                    <span className="nav-badge">{item.badge}</span>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        <div className="sidebar-bottom">
          <div className="sidebar-bottom-name">RSA Virtual Lab v1.0</div>
          <div className="sidebar-bottom-sub">All math runs in-browser</div>
        </div>
      </aside>

      {/* ── Main Area ── */}
      <div className="main-area">

        {/* Onboarding Banner */}
        {showBanner && (
          <div className="onboarding-banner">
            <div className="onboarding-content">
              <div className="onboarding-tag">WELCOME TO THE LAB</div>
              <div className="onboarding-title">RSA Virtual Laboratory</div>
              <div className="onboarding-desc">
                RSA is the cryptosystem behind HTTPS, SSH, and digital signatures.
                This lab teaches you how it works from first principles — step by step,
                with real math, real keys, and real attacks.
              </div>
              <div className="onboarding-actions">
                <button className="onboarding-btn-primary" onClick={() => navigate('aim')}>
                  Start with the Aim
                </button>
                <button className="onboarding-btn-ghost" onClick={() => navigate('simulation')}>
                  Jump to Control Center
                </button>
              </div>
            </div>
            <button className="onboarding-close" onClick={dismissBanner}>
              <X size={14} />
            </button>
          </div>
        )}

        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-left">
            <span className="topbar-breadcrumb">{getTierLabel(activeTab)}</span>
            <span className="topbar-sep">›</span>
            <span className="topbar-title">{getItemLabel(activeTab)}</span>
          </div>
          <div className="topbar-right">
            <span className="algo-badge">
              <ShieldCheck size={12} />
              RSA Cryptosystem
            </span>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setActiveTab('simulation')}
            >
              <Cpu size={12} /> Control Center
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="page-content">
          {activeTab === 'aim'        && <Aim       onStartSimulation={() => setActiveTab('simulation')} />}
          {activeTab === 'theory'     && <Theory    />}
          {activeTab === 'learn'      && <Learn     />}
          {activeTab === 'procedure'  && <Procedure onGoToSim={() => setActiveTab('simulation')} />}
          {activeTab === 'simulation' && <Simulation />}
          {activeTab === 'workbench'  && <Workbench />}
          {activeTab === 'attacks'    && <Attacks   onGoToSim={() => setActiveTab('simulation')} />}
          {activeTab === 'playground' && <Playground />}
          {activeTab === 'quiz'       && <Quiz      onNavigate={setActiveTab} />}
          {activeTab === 'dashboard'  && <Dashboard onNavigate={setActiveTab} />}
        </main>
      </div>
    </div>
  );
}
