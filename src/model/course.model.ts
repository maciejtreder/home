import { WithDate } from './withdate.model';

export interface Course extends WithDate {
    title: string;
    for: string;
    description: string;
    pictureMain: string;
    picture: string[];
    keywords: string[];
    date: Date
}
