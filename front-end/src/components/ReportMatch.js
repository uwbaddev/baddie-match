import { Form } from "react-bootstrap";
import '../index.css';
import { useState } from "react";
import SinglesForm from "../Forms/SinglesForm";
import DoublesForm from "../Forms/DoublesForm";
import MixedForm from "../Forms/MixedForm";
import { PageShell, TabControl } from "./RedesignUI";

const reportTabs = [
    { key: 'Singles', label: 'Singles' },
    { key: 'Doubles', label: 'Doubles' },
    { key: 'Mixed', label: 'Mixed' },
];

const ReportMatchComponent = () => {
    const [activeTab, setActiveTab] = useState('Singles');
    const ActiveForm = activeTab === 'Singles'
        ? SinglesForm
        : activeTab === 'Doubles'
            ? DoublesForm
            : MixedForm;

    return (
        <PageShell title="Report Match" className="report-page">
            <Form id="match-form">
                <TabControl tabs={reportTabs} active={activeTab} onChange={setActiveTab} className="report-tabs" />
                <ActiveForm />
            </Form>
        </PageShell>
    )
}

export default ReportMatchComponent;
