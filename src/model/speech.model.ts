import { WithDate } from './withdate.model';

export interface Speech extends WithDate {
    title: string;
    for: string;
    place: string;
    description: string;
    pictureMain: string;
    picture: string[];
    slides: string;
    video: string;
    keywords: string[];
    date: Date
}
