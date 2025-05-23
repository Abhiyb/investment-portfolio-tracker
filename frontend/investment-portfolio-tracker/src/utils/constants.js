// utils/constants.js

export const RISK_LEVELS = {
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH'
};

export const RISK_LEVEL_OPTIONS = [
    { value: RISK_LEVELS.LOW, label: 'Low' },
    { value: RISK_LEVELS.MEDIUM, label: 'Medium' },
    { value: RISK_LEVELS.HIGH, label: 'High' }
];

export const INVESTMENT_FORM_MODES = {
    ADD: 'add',
    EDIT: 'edit'
};

export const DEFAULT_FORM_DATA = {
    name: '',
    type: '',
    riskLevel: '',
    description: '',
    currentNetAssetValuePerUnit: '',
    expectedAnnualReturnRate: '',
    minimumInvestment: '',
    isActive: true
};