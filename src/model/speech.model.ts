import { WithDate } from './withdate.model';

export interface Speech extends WithDate {
    title: string;
    event: string;
    place: string;
    description: string;
    pictureMain: string;
    picture: string[];
    slides: string;
    vid: string;
    keywords: string[];
    date: Date
}
