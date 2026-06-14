export type ProjectStatus = 'PLANNING' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED';

export interface Project {
    id: number;
    name: string;
    description?: string;
    status: ProjectStatus;
    startDate?: Date;
    endDate?: Date;
    budget?: number;
    teamLead?: string;
    tags?: string[];
    color?: string;
}