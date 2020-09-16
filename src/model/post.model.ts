import { WithDate } from './withdate.model';

export interface Post extends WithDate {
    title: string;
    description: string;
    url: string;
    keywords: string[];
    for: string;
}