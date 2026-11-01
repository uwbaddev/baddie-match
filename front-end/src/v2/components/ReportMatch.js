import { useState } from "react";
import { UserRound, UsersRound } from 'lucide-react';
import { PageShell } from "./RedesignUI";
import ReportMatchForm from './ReportMatchForm';
import './ReportMatch.css';

const reportTabs = [
    { key: 'Singles', icon: UserRound },
    { key: 'Doubles', icon: UsersRound },
    { key: 'Mixed', icon: UsersRound },
];

const ReportMatchComponent = () => {
    const [activeTab, setActiveTab] = useState('Singles');
    const [submitting, setSubmitting] = useState(false);
    return (
        <PageShell title="Report Match" className="report-page">
            <div className="report-tabs" role="group" aria-label="Match type">
                {reportTabs.map(({ key, icon: Icon }) => (
                    <button
                        key={key}
                        type="button"
                        className={activeTab === key ? 'is-active' : ''}
                        aria-pressed={activeTab === key}
                        disabled={submitting}
                        onClick={() => setActiveTab(key)}
                    >
                        <Icon size={16} aria-hidden="true" />
                        {key}
                    </button>
                ))}
            </div>
            <ReportMatchForm key={activeTab} event={activeTab} submitting={submitting} onSubmittingChange={setSubmitting} />
        </PageShell>
    )
}

export default ReportMatchComponent;
